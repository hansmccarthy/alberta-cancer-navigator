# Alberta Cancer Navigator

A simple web app that helps people in Alberta find the cancer centre for their
area, understand the basics of the referral pathway, and see clinical trials
(from clinicaltrials.gov) that have a site in Alberta.

> **This is not medical advice. Please talk to your oncologist or care team.**

Every piece of medical or facility information shows its source (Alberta Health
Services or clinicaltrials.gov). Nothing medical is invented or guessed.

## Tech

- Next.js (App Router)
- A server route (`app/api/trials/route.js`) that proxies the public
  clinicaltrials.gov API and filters results to Alberta sites
- Curated, source-cited data in `app/data/albertaCancerCare.js`

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

On some Windows setups the dev server needs telemetry disabled to start:

```bash
NEXT_TELEMETRY_DISABLED=1 npm run dev
```

## Deploy

Deploys as-is to any host that runs Next.js server functions (e.g. Netlify or
Vercel) — no environment variables or API keys are required, because the
clinicaltrials.gov API is public.
