# NC Jobs Hub API & OpenClaw

Backend for the NC Jobs Hub dashboard and OpenClaw polling.

## Run the API

```bash
cd server
npm install
npm start
```

API runs at `http://localhost:3001`. Use `npm run dev` for watch mode.

## Endpoints

- `GET/POST /api/jobs`, `GET/PUT /api/jobs/:id` – job listings (with `scrapeTimestamp`)
- `GET /api/identity`, `PUT /api/identity` – user identity (read-only for OpenClaw)
- `GET /api/logs`, `POST /api/logs` – application tracking logs

## OpenClaw polling

OpenClaw can poll these read-only endpoints:

- `GET /api/openclaw/jobs` – all jobs
- `GET /api/openclaw/identity` – identity data
- `GET /api/openclaw/logs` – logs
- `GET /api/openclaw/events?since=ISO8601` – events since timestamp
- `GET /api/openclaw/feed?since=ISO8601` – jobs, identity, logs, events, and `dashboardDeepLink`

## OpenClaw poller script

Polls the API and can forward events to Telegram (event-based payloads only; dashboard deep links, no raw job dumps).

```bash
# From server directory
API_URL=http://localhost:3001 node openclaw-poller.js

# With Telegram (optional)
TELEGRAM_BOT_TOKEN=xxx TELEGRAM_CHAT_ID=yyy node openclaw-poller.js

# Custom interval (default 60000 ms)
node openclaw-poller.js --interval=30000
```

Or: `npm run openclaw` (uses `API_URL` / `PORT` from env).

## Demo external scraper (pull from external JSON API)

To see real-time external data flowing into the dashboard, you can run the demo scraper, which:

- Fetches data from a public JSON endpoint (or your own scraper URL)
- Maps the entries into NC Jobs Hub job listings
- POSTs them into `/api/jobs`

```bash
cd server
npm run scrape:demo
```

By default it uses a placeholder JSON feed. To point it at your own external source (for example, a jobs.json file or an OpenClaw output endpoint), set `EXTERNAL_JOBS_URL`:

```bash
cd server
API_URL=http://localhost:3001 \
EXTERNAL_JOBS_URL=https://your-scraper-or-jobs-endpoint.example.com/jobs.json \
npm run scrape:demo
```

As the script runs, new jobs with source `external-demo` will appear in the NC Jobs Hub UI in real time.
