import { html } from '../lib/html.js';
import { ui } from '../../i18n/ui.js';
import { icon } from './icon.js';

/** Sticky mobile booking bar; revealed by js/modules/reserve-bar.js once the page is scrolled. */
export function reserveBar(ctx) {
  return html`
  <div class="reserve-bar" data-module="reserve-bar" data-state="hidden" inert>
    <p class="reserve-bar__text">${ctx.t(ui.mobileBar.text)}</p>
    <a class="btn btn--primary btn--sm" href="${ctx.url('reservations')}"><span class="btn__label">${ctx.t(ui.cta.reserveShort)}</span>${icon('arrow', { className: 'btn__icon' })}</a>
  </div>`;
}
