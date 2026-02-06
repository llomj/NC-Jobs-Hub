#!/usr/bin/env node
/**
 * OpenClaw poller – polls NC Jobs Hub API for jobs, identity, and events.
 * Intended for deduplication, relevance scoring, and event-based payloads to Telegram.
 * Configure API_URL and optionally TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID for sending.
 * Usage: node openclaw-poller.js [--interval=60000]
 */

const API_URL = process.env.API_URL || 'http://localhost:3001';
const POLL_INTERVAL_MS = parseInt(process.env.POLL_INTERVAL_MS || '60000', 10);
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

let lastEventTimestamp = null;

async function fetchJSON(path) {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(`${path} ${res.status}`);
  return res.json();
}

async function sendTelegram(text) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('[Telegram stub]', text);
    return;
  }
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: 'HTML' }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('Telegram send failed', res.status, err);
  }
}

async function poll() {
  try {
    const feedPath = lastEventTimestamp
      ? `/api/openclaw/feed?since=${encodeURIComponent(lastEventTimestamp)}`
      : '/api/openclaw/feed';
    const feed = await fetchJSON(feedPath);
    const { jobs = [], events = [], dashboardDeepLink = '/' } = feed;

    for (const ev of events) {
      lastEventTimestamp = ev.timestamp;
      const msg = `[${ev.type}] ${ev.message}`;
      await sendTelegram(msg);
    }

    if (events.length === 0 && jobs.length > 0 && !lastEventTimestamp) {
      lastEventTimestamp = new Date().toISOString();
    }
  } catch (err) {
    console.error('Poll error:', err.message);
  }
}

const interval = process.argv.find((a) => a.startsWith('--interval='));
const ms = interval ? parseInt(interval.split('=')[1], 10) : POLL_INTERVAL_MS;

console.log(`OpenClaw poller: ${API_URL} every ${ms}ms`);
poll();
setInterval(poll, ms);
