import { NextResponse } from "next/server";
import { CLINICAL_TRIALS_LOCATION } from "@/app/data/albertaCancerCare";

// Server-side proxy for the clinicaltrials.gov API v2.
// Running this on the server avoids CORS and lets us filter each trial's
// locations down to Alberta before sending anything to the browser.

const API_BASE = "https://clinicaltrials.gov/api/v2/studies";

// Statuses we treat as "open" trials, in priority order. We first ask for
// actively recruiting trials; if there are none we widen to trials that are
// about to open.
const OPEN_STATUSES = [
  "RECRUITING",
  "NOT_YET_RECRUITING",
  "ENROLLING_BY_INVITATION",
];

const FIELDS = [
  "NCTId",
  "BriefTitle",
  "OverallStatus",
  "LocationFacility",
  "LocationCity",
  "LocationState",
  "LocationCountry",
].join(",");

function buildUrl(cond, statuses) {
  const params = new URLSearchParams();
  params.set("query.cond", cond);
  params.set("query.locn", CLINICAL_TRIALS_LOCATION);
  params.set("filter.overallStatus", statuses.join(","));
  params.set("pageSize", "50");
  params.set("fields", FIELDS);
  return `${API_BASE}?${params.toString()}`;
}

// Pull the Alberta sites out of a study and shape it for the UI.
// Returns null if the study has no Alberta location (so we can drop it).
function shapeStudy(study) {
  const protocol = study?.protocolSection || {};
  const id = protocol.identificationModule || {};
  const status = protocol.statusModule || {};
  const locations =
    protocol.contactsLocationsModule?.locations || [];

  const albertaSites = locations
    .filter(
      (loc) =>
        loc?.country === "Canada" &&
        typeof loc?.state === "string" &&
        loc.state.toLowerCase() === "alberta"
    )
    .map((loc) => ({
      facility: loc.facility || "Cancer centre",
      city: loc.city || "",
    }));

  if (albertaSites.length === 0) return null;
  if (!id.nctId) return null;

  // De-duplicate sites that repeat the same facility + city.
  const seen = new Set();
  const uniqueSites = albertaSites.filter((s) => {
    const key = `${s.facility}|${s.city}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return {
    nctId: id.nctId,
    title: id.briefTitle || "Untitled study",
    status: status.overallStatus || "Unknown",
    albertaSites: uniqueSites,
    url: `https://clinicaltrials.gov/study/${id.nctId}`,
  };
}

async function fetchTrials(cond, statuses) {
  const controller = new AbortController();
  // Keep under free serverless limits (Vercel/Netlify cap ~10s per request).
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(buildUrl(cond, statuses), {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      throw new Error(`Upstream responded ${res.status}`);
    }
    const data = await res.json();
    const studies = Array.isArray(data?.studies) ? data.studies : [];
    return studies.map(shapeStudy).filter(Boolean);
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const cond = (searchParams.get("cond") || "").trim();

  if (!cond) {
    return NextResponse.json(
      { error: true, message: "Please choose a cancer type." },
      { status: 400 }
    );
  }

  try {
    // First pass: actively recruiting only.
    let trials = await fetchTrials(cond, ["RECRUITING"]);

    // If nothing is recruiting, widen to trials that are about to open.
    if (trials.length === 0) {
      trials = await fetchTrials(cond, OPEN_STATUSES);
    }

    return NextResponse.json({
      error: false,
      count: trials.length,
      trials,
      sourceUrl: "https://clinicaltrials.gov/",
    });
  } catch (err) {
    // Graceful failure — the page shows a fallback link to clinicaltrials.gov.
    return NextResponse.json(
      {
        error: true,
        message:
          "We could not load clinical trials right now. Please try again in a moment.",
      },
      { status: 502 }
    );
  }
}
