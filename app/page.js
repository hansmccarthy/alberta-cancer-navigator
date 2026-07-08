"use client";

import { useState } from "react";
import {
  CANCER_TYPES,
  ZONES,
  getCancerType,
  getCentreForZone,
  REFERRAL_INFO,
} from "@/app/data/albertaCancerCare";

function SourceLinks({ sources }) {
  return (
    <p className="sources">
      {sources.map((s, i) => (
        <span key={s.url}>
          {i > 0 && " · "}
          <a href={s.url} target="_blank" rel="noopener noreferrer">
            Source: {s.label}
          </a>
        </span>
      ))}
    </p>
  );
}

function CentreCard({ zone }) {
  const centre = getCentreForZone(zone);
  if (!centre) return null;
  const zoneLabel = ZONES.find((z) => z.value === zone)?.label || "";

  return (
    <section className="result-card">
      <h2>Your cancer centre</h2>
      {centre.primary && (
        <p className="centre-name">
          {centre.primary.name}
          <span className="centre-city"> — {centre.primary.city}</span>
        </p>
      )}
      {centre.primary && <p className="centre-tier">{centre.primary.tier}</p>}
      <p>{centre.note}</p>
      {centre.others && centre.others.length > 0 && (
        <p className="centre-others">
          Care closer to home may also be given at:{" "}
          {centre.others.map((o, i) => (
            <span key={o.name}>
              {i > 0 && ", "}
              {o.name} ({o.city})
            </span>
          ))}
          .
        </p>
      )}
      <p className="centre-zone-note">Area: {zoneLabel}</p>
      <SourceLinks sources={centre.sources} />
    </section>
  );
}

function ReferralCard() {
  return (
    <section className="result-card">
      <h2>How a referral works</h2>
      {REFERRAL_INFO.text.map((line, i) => (
        <p key={i}>{line}</p>
      ))}
      <SourceLinks sources={REFERRAL_INFO.sources} />
    </section>
  );
}

function TrialsCard({ trials, cancerLabel }) {
  if (trials.error) {
    return (
      <section className="result-card">
        <h2>Clinical trials</h2>
        <p className="state-error">{trials.message}</p>
        <p>
          You can also search directly on{" "}
          <a
            href="https://clinicaltrials.gov/"
            target="_blank"
            rel="noopener noreferrer"
          >
            clinicaltrials.gov
          </a>
          .
        </p>
      </section>
    );
  }

  if (!trials.list || trials.list.length === 0) {
    return (
      <section className="result-card">
        <h2>Clinical trials</h2>
        <p className="state-empty">
          We did not find open {cancerLabel.toLowerCase()} trials with a site in
          Alberta right now.
        </p>
        <p>
          Trials change often. You can search again later or look on{" "}
          <a
            href="https://clinicaltrials.gov/"
            target="_blank"
            rel="noopener noreferrer"
          >
            clinicaltrials.gov
          </a>
          .
        </p>
      </section>
    );
  }

  return (
    <section className="result-card">
      <h2>
        Clinical trials in Alberta{" "}
        <span className="count-badge">{trials.list.length}</span>
      </h2>
      <p className="trials-intro">
        These {cancerLabel.toLowerCase()} trials have at least one site in
        Alberta. Talk to your care team before joining any trial.
      </p>
      <ul className="trials-list">
        {trials.list.map((t) => (
          <li key={t.nctId} className="trial">
            <p className="trial-title">{t.title}</p>
            <p className="trial-meta">
              <span className="status-badge">{t.status.replace(/_/g, " ")}</span>
            </p>
            <p className="trial-sites">
              In Alberta at:{" "}
              {t.albertaSites
                .map((s) => (s.city ? `${s.facility} (${s.city})` : s.facility))
                .join(", ")}
            </p>
            <a
              className="trial-link"
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Source: View study on clinicaltrials.gov ({t.nctId})
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Home() {
  const [cancerType, setCancerType] = useState("");
  const [zone, setZone] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [formError, setFormError] = useState("");

  async function handleSearch() {
    if (!cancerType || !zone) {
      setFormError("Please choose a cancer type and your area first.");
      return;
    }
    setFormError("");
    setLoading(true);
    setResults(null);

    const type = getCancerType(cancerType);
    const params = new URLSearchParams({
      cond: type ? type.condQuery : cancerType,
      zone,
    });

    let trials;
    try {
      const res = await fetch(`/api/trials?${params.toString()}`);
      const data = await res.json();
      if (data.error) {
        trials = { error: true, message: data.message };
      } else {
        trials = { error: false, list: data.trials };
      }
    } catch (err) {
      trials = {
        error: true,
        message:
          "We could not load clinical trials right now. Please try again in a moment.",
      };
    }

    setResults({
      zone,
      cancerLabel: type ? type.label : cancerType,
      trials,
    });
    setLoading(false);
  }

  return (
    <main className="page">
      <header className="masthead">
        <h1>Alberta Cancer Navigator</h1>
        <p>Find the right cancer centre and clinical trials near you.</p>
      </header>

      <div className="disclaimer">
        <strong>This is not medical advice.</strong> Please talk to your
        oncologist or care team.
      </div>

      <section className="card" aria-label="Search">
        <div className="field">
          <label htmlFor="cancerType">What kind of cancer?</label>
          <p className="hint">Pick the cancer type from the list.</p>
          <select
            id="cancerType"
            name="cancerType"
            value={cancerType}
            onChange={(e) => setCancerType(e.target.value)}
          >
            <option value="" disabled>
              Choose a cancer type
            </option>
            {CANCER_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="zone">Where do you live in Alberta?</label>
          <p className="hint">Pick the area closest to your home.</p>
          <select
            id="zone"
            name="zone"
            value={zone}
            onChange={(e) => setZone(e.target.value)}
          >
            <option value="" disabled>
              Choose your area
            </option>
            {ZONES.map((z) => (
              <option key={z.value} value={z.value}>
                {z.label}
              </option>
            ))}
          </select>
        </div>

        {formError && <p className="state-error">{formError}</p>}

        <button
          type="button"
          className="search-btn"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </section>

      {loading && (
        <p className="state-loading">Looking up your area and trials…</p>
      )}

      {results && !loading && (
        <div className="results">
          <CentreCard zone={results.zone} />
          <ReferralCard />
          <TrialsCard trials={results.trials} cancerLabel={results.cancerLabel} />
        </div>
      )}

      <footer>
        Information is shown with its source. Sources: Alberta Health Services
        and clinicaltrials.gov. This tool does not give medical advice.
      </footer>
    </main>
  );
}
