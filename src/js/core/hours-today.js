import { riyadhNow } from '../utils/hours.js';

/** Highlight today's row (Riyadh time) in every opening-hours list. */
export function markToday() {
  const { day } = riyadhNow();
  document.querySelectorAll('.hours__row[data-days]').forEach((row) => {
    const days = row.dataset.days.split(',').map(Number);
    row.classList.toggle('is-today', days.includes(day));
  });
}
