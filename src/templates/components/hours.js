import { html, cx } from '../lib/html.js';
import { groupHours } from '../../js/utils/hours.js';
import { ui } from '../../i18n/ui.js';

/** Weekly opening hours as a definition list. */
export function hoursList(ctx, hours, { className } = {}) {
  return html`
    <dl class="${cx('hours', className)}">
      ${groupHours(hours, ctx.lang).map(
        (row) => html`<div class="hours__row" data-days="${row.days.join(',')}"><dt>${row.label}</dt><dd>${row.time}</dd></div>`
      )}
    </dl>`;
}

/**
 * Live "open now / closed" badge. Rendered with a neutral, always-true
 * fallback; js/modules/open-status.js fills in the real state in Riyadh time.
 */
export function openStatus(ctx, locationId, { className } = {}) {
  const fallback = { ar: 'يوميًا من الظهر حتى بعد منتصف الليل', en: 'Daily, from noon until late' };
  return html`
    <p class="${cx('open-status', className)}" data-module="open-status" data-location="${locationId}">
      <span class="open-status__dot" aria-hidden="true"></span>
      <span class="open-status__text">${ctx.t(fallback)}</span>
    </p>`;
}

export const comingSoonBadge = (ctx) => html`<span class="badge badge--soon">${ctx.t(ui.status.comingSoon)}</span>`;
