/**
 * Real API client for NC Jobs Hub backend.
 * Base URL: VITE_API_URL or http://localhost:3001
 * When the API is unreachable, fetchJobs returns offline fallback data and fetchLogs returns [].
 */

import type { JobListing, ApplicationLog, UserIdentity } from '../types';
import { JobStatus } from '../types';
import { getFallbackJobs } from './seedData';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

let _usingFallback = false;
export function isUsingFallback(): boolean {
  return _usingFallback;
}

function statusFromString(s: string): JobStatus {
  const map: Record<string, JobStatus> = {
    new: JobStatus.NEW,
    saved: JobStatus.SAVED,
    applied: JobStatus.APPLIED,
    interview: JobStatus.INTERVIEW,
    rejected: JobStatus.REJECTED,
  };
  return map[s?.toLowerCase()] ?? JobStatus.NEW;
}

function toJobListing(raw: Record<string, unknown>): JobListing {
  return {
    id: String(raw.id),
    sourceId: String(raw.sourceId ?? ''),
    category: String(raw.category ?? ''),
    title: String(raw.title ?? ''),
    company: String(raw.company ?? ''),
    location: String(raw.location ?? ''),
    address: raw.address != null ? String(raw.address) : undefined,
    contractType: String(raw.contractType ?? ''),
    postedDate: String(raw.postedDate ?? ''),
    description: String(raw.description ?? ''),
    requirements: Array.isArray(raw.requirements) ? raw.requirements.map(String) : [],
    contactEmail: raw.contactEmail != null ? String(raw.contactEmail) : undefined,
    contactPhone: raw.contactPhone != null ? String(raw.contactPhone) : undefined,
    url: String(raw.url ?? ''),
    status: statusFromString(String(raw.status ?? 'new')),
    relevanceScore: typeof raw.relevanceScore === 'number' ? raw.relevanceScore : undefined,
  };
}

export async function fetchJobs(): Promise<JobListing[]> {
  try {
    const res = await fetch(`${API_BASE}/api/jobs`);
    if (!res.ok) throw new Error(`Jobs API error: ${res.status}`);
    const data = await res.json();
    const list = Array.isArray(data) ? data : (data?.jobs ?? []);
    _usingFallback = false;
    return list.map(toJobListing);
  } catch {
    _usingFallback = true;
    return getFallbackJobs();
  }
}

export async function updateJob(id: string, patch: Partial<JobListing>): Promise<JobListing> {
  const res = await fetch(`${API_BASE}/api/jobs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...patch, id }),
  });
  if (!res.ok) throw new Error(`Update job error: ${res.status}`);
  const raw = await res.json();
  return toJobListing(raw);
}

export async function fetchLogs(): Promise<ApplicationLog[]> {
  try {
    const res = await fetch(`${API_BASE}/api/logs`);
    if (!res.ok) throw new Error(`Logs API error: ${res.status}`);
    const data = await res.json();
    const list = Array.isArray(data) ? data : [];
    return list.map((entry: Record<string, unknown>) => ({
      id: String(entry.id ?? ''),
      jobId: String(entry.jobId ?? ''),
      status: statusFromString(String(entry.status ?? 'new')),
      timestamp: String(entry.timestamp ?? ''),
      notes: String(entry.notes ?? ''),
    }));
  } catch {
    return [];
  }
}

export async function addLog(entry: Omit<ApplicationLog, 'id'>): Promise<ApplicationLog> {
  const res = await fetch(`${API_BASE}/api/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error(`Add log error: ${res.status}`);
  const data = await res.json();
  return {
    id: String(data.id ?? entry.timestamp + Math.random().toString(36).slice(2, 9)),
    jobId: String(data.jobId ?? entry.jobId),
    status: statusFromString(String(data.status ?? entry.status)),
    timestamp: String(data.timestamp ?? entry.timestamp),
    notes: String(data.notes ?? entry.notes ?? ''),
  };
}

export async function fetchIdentity(): Promise<UserIdentity | null> {
  const res = await fetch(`${API_BASE}/api/identity`);
  if (!res.ok) return null;
  return res.json();
}

export async function saveIdentity(identity: Partial<UserIdentity>): Promise<UserIdentity | null> {
  const res = await fetch(`${API_BASE}/api/identity`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(identity),
  });
  if (!res.ok) return null;
  return res.json();
}

export { API_BASE };
