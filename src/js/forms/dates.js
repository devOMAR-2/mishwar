/**
 * Calendar-date helpers for booking forms. Dates travel as ISO strings
 * ("2026-10-02") and are always interpreted in Riyadh time, whatever the
 * visitor's own timezone is.
 */

const pad = (n) => String(n).padStart(2, '0');

const LOCALES = { ar: 'ar-SA-u-ca-gregory-nu-latn', en: 'en-GB' };

export const fromISO = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

export const toISO = (date) => `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;

export const isISODate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && toISO(fromISO(value)) === value;

export function addDays(iso, days) {
  const date = fromISO(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return toISO(date);
}

/** 0 = Sunday … 6 = Saturday, matching the opening-hours arrays. */
export const weekdayOf = (iso) => fromISO(iso).getUTCDay();

/** Today's calendar date in Riyadh. */
export function riyadhToday(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Riyadh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const get = (type) => parts.find((p) => p.type === type).value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

/** Short pieces for a compact day tile: { weekday, day, month }. */
export function dayParts(iso, lang) {
  const date = fromISO(iso);
  const format = (options) => new Intl.DateTimeFormat(LOCALES[lang], { timeZone: 'UTC', ...options }).format(date);
  return {
    weekday: format({ weekday: lang === 'ar' ? 'long' : 'short' }),
    day: String(date.getUTCDate()),
    month: format({ month: 'short' }),
  };
}
