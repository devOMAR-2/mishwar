import { locations } from '../../data/locations.js';
import { ui } from '../../i18n/ui.js';
import { getOpenStatus, formatTime } from '../utils/hours.js';
import { lang, t } from '../core/i18n.js';

/**
 * Live "Open now · Closes 12:30 AM" line for a branch, computed in Riyadh time
 * and refreshed every minute.
 */
export default function openStatus(el) {
  const location = locations.find((l) => l.id === el.dataset.location);
  const text = el.querySelector('.open-status__text');
  if (!location?.hours || !text) return;

  const render = () => {
    const status = getOpenStatus(location.hours);
    el.dataset.state = status.isOpen ? 'open' : 'closed';

    const headline = document.createElement('strong');
    headline.textContent = t(status.isOpen ? ui.status.openNow : ui.status.closedNow);

    let detail;
    if (status.isOpen) detail = t(ui.status.closesAt, { time: formatTime(status.closesAt, lang) });
    else if (status.isToday) detail = t(ui.status.opensAt, { time: formatTime(status.opensAt, lang) });
    else detail = t(ui.status.opensTomorrow, { time: formatTime(status.opensAt, lang) });

    text.replaceChildren(headline, ` · ${detail}`);
  };

  render();
  setInterval(render, 60_000);
}
