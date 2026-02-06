#!/usr/bin/env node
/**
 * Demo external scraper – pulls data from a public JSON API and POSTs jobs into NC Jobs Hub.
 *
 * This is a PROOF-OF-CONCEPT to show how "real-time" external data can flow into the app.
 * In production you would point EXTERNAL_JOBS_URL at your own scraper or a real jobs API
 * (e.g. a jobs.json endpoint, OpenClaw output, or a third-party job feed).
 *
 * Usage:
 *   cd server
 *   API_URL=http://localhost:3001 \
 *   EXTERNAL_JOBS_URL=https://your-scraper-or-jobs-endpoint.example.com/jobs.json \
 *   node demo-scraper.js
 *
 * For a quick demo without any extra setup, you can omit EXTERNAL_JOBS_URL; the script
 * will use a public placeholder JSON feed and map it into job listings.
 */

const API_URL = process.env.API_URL || 'http://localhost:3001';
const EXTERNAL_JOBS_URL =
  process.env.EXTERNAL_JOBS_URL || 'https://jsonplaceholder.typicode.com/todos?_limit=5';

async function fetchExternalJobs() {
  const res = await fetch(EXTERNAL_JOBS_URL);
  if (!res.ok) {
    throw new Error(`External source error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();

  // For the demo placeholder, we expect an array of objects with at least { id, title }.
  // For real scrapers, adapt this mapping so it returns the NC Jobs Hub job schema.
  const now = new Date().toISOString();
  return (Array.isArray(data) ? data : []).map((item, idx) => {
    const idPart = item.id != null ? String(item.id) : String(idx);
    return {
      id: `external-${idPart}`,
      sourceId: 'external-demo',
      category: 'External Demo',
      title: String(item.title ?? 'External job'),
      company: 'External Source',
      location: 'Nouméa',
      contractType: 'Unknown',
      postedDate: now,
      description:
        'Imported from external JSON feed for demo purposes. Replace this with real scraped job data.',
      requirements: [],
      contactEmail: undefined,
      contactPhone: undefined,
      url: EXTERNAL_JOBS_URL,
      status: 'new',
    };
  });
}

async function postJob(job) {
  const res = await fetch(`${API_URL}/api/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(job),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`POST /api/jobs failed: ${res.status} ${text}`);
  }
  return res.json();
}

async function main() {
  console.log(`[demo-scraper] API_URL=${API_URL}`);
  console.log(`[demo-scraper] EXTERNAL_JOBS_URL=${EXTERNAL_JOBS_URL}`);

  try {
    const externalJobs = await fetchExternalJobs();
    console.log(`[demo-scraper] Fetched ${externalJobs.length} jobs from external source.`);

    for (const job of externalJobs) {
      try {
        const saved = await postJob(job);
        console.log(`[demo-scraper] Imported job ${saved.id} (${saved.title})`);
      } catch (err) {
        console.error('[demo-scraper] Failed to import job', job.id, '-', err.message);
      }
    }

    console.log('[demo-scraper] Done.');
  } catch (err) {
    console.error('[demo-scraper] Error:', err.message);
    process.exitCode = 1;
  }
}

main();

