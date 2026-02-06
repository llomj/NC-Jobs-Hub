/**
 * In-memory store for jobs, identity, logs, and OpenClaw events.
 * Schema aligns with AGENTS.md (job listing includes scrapeTimestamp, url as source link).
 */

import { seedJobs, defaultIdentity } from './seedData.js';

const jobs = new Map(seedJobs().map((j) => [j.id, { ...j }]));
let identity = defaultIdentity();
const logs = [];
const openClawEvents = [];

export const jobsStore = {
  getAll() {
    return Array.from(jobs.values());
  },
  getById(id) {
    return jobs.get(id) ?? null;
  },
  setAll(list) {
    jobs.clear();
    list.forEach((j) => jobs.set(j.id, { ...j }));
  },
  upsert(job) {
    const withTimestamp = {
      ...job,
      scrapeTimestamp: job.scrapeTimestamp || new Date().toISOString(),
    };
    jobs.set(withTimestamp.id, withTimestamp);
    return withTimestamp;
  },
};

export const identityStore = {
  get() {
    return { ...identity };
  },
  set(data) {
    identity = { ...identity, ...data };
    return identityStore.get();
  },
};

export const logsStore = {
  getAll() {
    return [...logs];
  },
  add(entry) {
    const record = {
      id: entry.id || `log-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      jobId: entry.jobId,
      status: entry.status,
      timestamp: entry.timestamp || new Date().toISOString(),
      notes: entry.notes || '',
    };
    logs.unshift(record);
    return record;
  },
};

export const eventsStore = {
  getAll(since) {
    const list = [...openClawEvents];
    if (since) {
      return list.filter((e) => e.timestamp >= since);
    }
    return list;
  },
  add(event) {
    const record = {
      id: event.id || `evt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: event.type,
      message: event.message,
      timestamp: event.timestamp || new Date().toISOString(),
    };
    openClawEvents.push(record);
    return record;
  },
};
