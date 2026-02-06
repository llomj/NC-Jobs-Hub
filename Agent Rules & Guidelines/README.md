# NC Jobs Hub

A centralized employment discovery, tracking, and communication dashboard for New Caledonia.

## Run the app

Start both the API server and the UI with one command:

```bash
npm install
npm run dev:all
```

This starts the API on port 3001 and the frontend (Vite). Open the URL Vite prints in the terminal (e.g. http://localhost:5173).

- **API only:** `npm run server` (from this directory).
- **Frontend only:** `npm run dev`. The app will still work using offline fallback data if the API is not running; start the server to sync and persist updates.

See [server/README.md](server/README.md) for API endpoints and OpenClaw polling.

## PWA & GitHub Pages deployment

The app is a **Progressive Web App (PWA)** so you can:
- **Phone:** open the deployed URL in the browser → Add to Home Screen (install as app).
- **Desktop:** open the URL in Chrome/Edge → ⋮ → “Install NC Jobs Hub” or “Open in window” so it runs as a standalone app (no browser UI). Your Telegram bot / OpenClaw can then open this same URL.

### URL after deployment

Once GitHub Actions has built and deployed:

- **App URL:** `https://<your-username>.github.io/<repository-name>/`

Example: if your repo is `https://github.com/YourName/NC_jobs_hub`, the app URL is:

- **`https://YourName.github.io/NC_jobs_hub/`**

Use this URL on your phone (Add to Home Screen), on your desktop (Install app), and in OpenClaw so the bot can open the app.

### One-time setup for GitHub Pages

1. Push this repo to GitHub (including the `.github/workflows/deploy-pages.yml` workflow).
2. In the repo: **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions** (not “Deploy from a branch”).
4. Push to `main` (or `master`); the workflow will build and deploy. The first run may need **Settings → Actions → General** to allow “Read and write permissions” for the GITHUB_TOKEN if you use a default environment.

After that, every push to `main`/`master` will rebuild and redeploy the PWA to the URL above.
