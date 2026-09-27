/**
 * Minimal iCalendar (RFC 5545) event for "Add to calendar", built entirely in
 * the browser. Times are written in Asia/Riyadh (UTC+3 all year, no DST) with
 * an embedded VTIMEZONE so every calendar app places the booking correctly.
 */

const CRLF = '\r\n';

const escapeText = (value) =>
  String(value).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');

/** Fold lines longer than 75 octets without splitting multi-byte characters. */
function fold(line) {
  const encoder = new TextEncoder();
  const parts = [];
  let current = '';
  let bytes = 0;
  for (const char of line) {
    const size = encoder.encode(char).length;
    if (bytes + size > (parts.length ? 74 : 75)) {
      parts.push(current);
      current = '';
      bytes = 0;
    }
    current += char;
    bytes += size;
  }
  parts.push(current);
  return parts.join(`${CRLF} `);
}

const stamp = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

/** "2026-10-02", "20:30" → "20261002T203000" */
const local = (isoDate, time) => `${isoDate.replace(/-/g, '')}T${time.replace(':', '')}00`;

/**
 * @param {object} event
 * @param {string} event.uid
 * @param {string} event.date        local start date (ISO)
 * @param {string} event.time        local start time "HH:MM"
 * @param {string} event.endDate
 * @param {string} event.endTime
 * @param {string} event.title
 * @param {string} event.location
 * @param {string} event.description
 * @param {string} [event.url]
 * @param {{lat:number,lng:number}} [event.geo]
 */
export function buildIcs({ uid, date, time, endDate, endTime, title, location, description, url, geo }) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mishwar//Reservations//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VTIMEZONE',
    'TZID:Asia/Riyadh',
    'BEGIN:STANDARD',
    'DTSTART:19700101T000000',
    'TZOFFSETFROM:+0300',
    'TZOFFSETTO:+0300',
    'TZNAME:+03',
    'END:STANDARD',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART;TZID=Asia/Riyadh:${local(date, time)}`,
    `DTEND;TZID=Asia/Riyadh:${local(endDate, endTime)}`,
    `SUMMARY:${escapeText(title)}`,
    `LOCATION:${escapeText(location)}`,
    `DESCRIPTION:${escapeText(description)}`,
    url && `URL:${url}`,
    geo && `GEO:${geo.lat};${geo.lng}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeText(title)}`,
    'TRIGGER:-PT2H',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);

  return lines.map(fold).join(CRLF) + CRLF;
}

/** Object URL for a downloadable .ics file (revoke it when replaced). */
export const icsObjectUrl = (ics) => URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
