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

  // A time never breaks between the digits and its AM/PM marker.
  const time = (minutes) => formatTime(minutes, lang).replace(/ /g, '\u00a0');

  const render = () => {
    const status = getOpenStatus(location.hours);
    el.dataset.state = status.isOpen ? 'open' : 'closed';

    const headline = document.createElement('strong');
    headline.textContent = t(status.isOpen ? ui.status.openNow : ui.status.closedNow);

    let detail;
    if (status.isOpen) detail = t(ui.status.closesAt, { time: time(status.closesAt) });
    else if (status.isToday) detail = t(ui.status.opensAt, { time: time(status.opensAt) });
    else detail = t(ui.status.opensTomorrow, { time: time(status.opensAt) });

    text.replaceChildren(headline, ` · ${detail}`);
  };

  render();
  setInterval(render, 60_000);
}
