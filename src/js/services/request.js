/** Transport shared by the form services: real API calls, or a local simulation in demo mode. */
import { config } from './config.js';

export class SubmissionError extends Error {
  constructor(message, { status, cause } = {}) {
    super(message, { cause });
    this.name = 'SubmissionError';
    this.status = status;
  }
}

/** POST JSON to `${config.apiBaseUrl}${path}` and resolve with the JSON response. */
export async function postJson(path, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.timeoutMs);
  try {
    const response = await fetch(`${config.apiBaseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new SubmissionError(data.message || `Request failed (${response.status})`, { status: response.status });
    return data;
  } catch (error) {
    if (error instanceof SubmissionError) throw error;
    throw new SubmissionError('Network error', { cause: error });
  } finally {
    clearTimeout(timer);
  }
}

/** Unambiguous reference like "MSH-7K3Q9" (no 0/O, 1/I/L). */
export function referenceCode(prefix) {
  const alphabet = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  return `${prefix}-${Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('')}`;
}

/** Demo mode: wait a moment, keep the last few records in localStorage, resolve with the record. */
export function simulate(storageKey, record) {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
        localStorage.setItem(storageKey, JSON.stringify([...saved, record].slice(-20)));
      } catch {
        // Storage can be unavailable (private mode, quota); the demo still succeeds.
      }
      resolve(record);
    }, config.demoLatencyMs);
  });
}
