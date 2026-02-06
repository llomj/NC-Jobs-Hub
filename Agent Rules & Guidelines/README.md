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
