/**
 * Opening-hours helpers shared by the static build and the browser.
 * All calculations happen in Riyadh time regardless of the visitor's timezone.
 */

export const DAY_NAMES = {
  ar: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
};

/** Saudi weeks are usually printed Saturday-first. */
const WEEK_ORDER = [6, 0, 1, 2, 3, 4, 5];
const MINUTES_PER_DAY = 24 * 60;

export const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export const fromMinutes = (total) => {
  const minutes = ((total % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
};

/** "13:30" → "1:30 م" / "1:30 PM" */
export function formatTime(hhmm, lang) {
  const [h, m] = hhmm.split(':').map(Number);
  const hour12 = ((h + 11) % 12) + 1;
  const suffix = lang === 'ar' ? (h < 12 ? 'ص' : 'م') : h < 12 ? 'AM' : 'PM';
  return `${hour12}:${String(m).padStart(2, '0')} ${suffix}`;
}

export const formatRange = ({ open, close }, lang) =>
  `${formatTime(open, lang)} – ${formatTime(close, lang)}`;

/** Opening span of a day in minutes; overnight closes roll past 24:00. */
function span({ open, close }) {
  const start = toMinutes(open);
  let end = toMinutes(close);
  if (end <= start) end += MINUTES_PER_DAY;
  return { start, end };
}

/** Current weekday + minutes-since-midnight in Riyadh. */
export function riyadhNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Riyadh',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type).value;
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { day, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

/**
 * Is the branch open right now?
 * Returns { isOpen, closesAt } when open, or { isOpen: false, opensAt, opensDay } when closed.
 */
export function getOpenStatus(hours, date = new Date()) {
  const { day, minutes } = riyadhNow(date);
  const yesterday = (day + 6) % 7;

  // Still inside yesterday's after-midnight service?
  const prev = span(hours[yesterday]);
  if (prev.end > MINUTES_PER_DAY && minutes < prev.end - MINUTES_PER_DAY) {
    return { isOpen: true, closesAt: hours[yesterday].close };
  }

  const today = span(hours[day]);
  if (minutes >= today.start && minutes < today.end) {
    return { isOpen: true, closesAt: hours[day].close };
  }
  if (minutes < today.start) {
    return { isOpen: false, opensAt: hours[day].open, opensDay: day, isToday: true };
  }
  const tomorrow = (day + 1) % 7;
  return { isOpen: false, opensAt: hours[tomorrow].open, opensDay: tomorrow, isToday: false };
}

/**
 * Collapse consecutive days with identical hours into printable rows:
 * [{ label: 'السبت – الأربعاء', time: '12:30 م – 12:30 ص', days: [6,0,1,2,3] }]
 */
export function groupHours(hours, lang) {
  const groups = [];
  for (const day of WEEK_ORDER) {
    const time = formatRange(hours[day], lang);
    const last = groups.at(-1);
    if (last && last.time === time) last.days.push(day);
    else groups.push({ time, days: [day] });
  }
  const names = DAY_NAMES[lang];
  return groups.map(({ time, days }) => ({
    days,
    time,
    label: days.length === 1 ? names[days[0]] : `${names[days[0]]} – ${names[days.at(-1)]}`,
  }));
}

/**
 * Bookable time slots for a given weekday.
 * Last seating is `lastSeating` minutes before closing.
 */
export function timeSlots(dayHours, { step = 30, lastSeating = 90 } = {}) {
  const { start, end } = span(dayHours);
  const slots = [];
  for (let t = start; t <= end - lastSeating; t += step) slots.push(fromMinutes(t));
  return slots;
}
