import { html, cx } from '../lib/html.js';
import { ui } from '../../i18n/ui.js';
import { mapsUrl } from '../../js/utils/maps.js';
import { icon } from './icon.js';
import { picture } from './picture.js';
import { openStatus } from './hours.js';

/** Branch preview card (home page). The Locations page renders the long form. */
export function branchCard(ctx, loc, { level = 3, sizes = '(min-width: 1024px) 40vw, 92vw' } = {}) {
  const tag = `h${level}`;

  if (loc.status !== 'open') {
    return html`
    <article class="branch-card branch-card--soon" data-reveal>
      <div class="branch-card__soon-art" aria-hidden="true"><span class="tri-rule"></span></div>
      <div class="branch-card__body">
        <p class="badge badge--soon">${ctx.t(ui.status.comingSoon)}</p>
        <${tag} class="branch-card__name">${ctx.t(loc.name)}</${tag}>
        <p class="branch-card__summary">${ctx.t(loc.summary)}</p>
      </div>
    </article>`;
  }

  return html`
  <article class="branch-card" data-reveal>
    <figure class="branch-card__media photo">
      ${picture(ctx, loc.image, { sizes, className: 'branch-card__img' })}
    </figure>
    <div class="branch-card__body">
      <p class="branch-card__district">${icon('pin')}${ctx.t(loc.district)}</p>
      <${tag} class="branch-card__name">${ctx.t(loc.name)}</${tag}>
      ${openStatus(ctx, loc.id)}
      <p class="branch-card__address">${ctx.t(loc.address)}</p>
      <div class="branch-card__actions">
        <a class="btn btn--secondary btn--sm" href="${mapsUrl(loc)}" target="_blank" rel="noopener">
          <span class="btn__label">${ctx.t(ui.cta.directions)}</span>${icon('arrow-up-right', { className: 'btn__icon' })}
          <span class="visually-hidden">${ctx.t(ui.labels.newWindow)}</span>
        </a>
        <a class="btn btn--primary btn--sm" href="${ctx.url('reservations')}?branch=${loc.id}"><span class="btn__label">${ctx.t(ui.cta.reserveShort)}</span></a>
        <a class="branch-card__call" href="tel:${loc.phone}">${icon('phone')}<span dir="ltr">${loc.phoneDisplay}</span></a>
      </div>
    </div>
  </article>`;
}

export const branchClass = (loc) => cx('branch', `branch--${loc.id}`);
