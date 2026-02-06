/**
 * NC Jobs Hub API – backend for dashboard and OpenClaw polling.
 * Serves jobs, identity, logs; OpenClaw can poll /api/openclaw/* for structured data.
 */

import express from 'express';
import cors from 'cors';
import { jobsStore, identityStore, logsStore, eventsStore } from './store.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// —— CRUD: Jobs ——
app.get('/api/jobs', (req, res) => {
  res.json(jobsStore.getAll());
});

app.get('/api/jobs/:id', (req, res) => {
  const job = jobsStore.getById(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

app.post('/api/jobs', (req, res) => {
  const job = jobsStore.upsert(req.body);
  res.status(201).json(job);
});

app.put('/api/jobs/:id', (req, res) => {
  const job = jobsStore.upsert({ ...req.body, id: req.params.id });
  res.json(job);
});

// —— Identity ——
app.get('/api/identity', (req, res) => {
  res.json(identityStore.get());
});

app.put('/api/identity', (req, res) => {
  res.json(identityStore.set(req.body));
});

// —— Logs ——
app.get('/api/logs', (req, res) => {
  res.json(logsStore.getAll());
});

app.post('/api/logs', (req, res) => {
  res.status(201).json(logsStore.add(req.body));
});

// —— OpenClaw polling endpoints (read-only for bot) ——
app.get('/api/openclaw/jobs', (req, res) => {
  const list = jobsStore.getAll();
  res.json({ jobs: list, count: list.length });
});

app.get('/api/openclaw/identity', (req, res) => {
  res.json(identityStore.get());
});

app.get('/api/openclaw/logs', (req, res) => {
  res.json(logsStore.getAll());
});

app.get('/api/openclaw/events', (req, res) => {
  const since = req.query.since;
  res.json(eventsStore.getAll(since));
});

app.get('/api/openclaw/feed', (req, res) => {
  const since = req.query.since || null;
  const jobs = jobsStore.getAll();
  const identity = identityStore.get();
  const logs = logsStore.getAll();
  const events = eventsStore.getAll(since);
  res.json({
    jobs,
    identity,
    logs,
    events,
    dashboardDeepLink: '/',
  });
});

app.listen(PORT, () => {
  console.log(`NC Jobs Hub API running at http://localhost:${PORT}`);
});
