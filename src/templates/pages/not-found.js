import { html, raw } from '../lib/html.js';
import { notFound } from '../../content/not-found.js';
import { ui } from '../../i18n/ui.js';
import { icon } from '../components/icon.js';
import { button } from '../components/button.js';

/*
 * A dotted route that sets off confidently, loops around the zero, doubles back
 * and ends in a question mark — nowhere near the pin it was meant to reach.
 * In Arabic the whole journey is mirrored so it sets off from the right.
 */
const ROUTE =
  'M34 290C100 300 190 290 222 240S206 120 240 70 372 24 392 80 360 190 316 178 280 110 322 118 380 228 430 266 560 300 590 250 560 190 572 140 610 104 606 84';

function art() {
  return html`
  <div class="lost__art" aria-hidden="true">
    <svg class="lost-art" viewBox="0 0 640 320" focusable="false">
      <defs>
        <mask id="lost-route-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="640" height="320">
          <path class="lost-art__reveal" d="${ROUTE}" pathLength="1"/>
        </mask>
      </defs>
      <text class="lost-art__digits" x="320" y="268" text-anchor="middle" direction="ltr">404</text>
      <g class="lost-art__journey">
        <path class="lost-art__route" d="${ROUTE}" mask="url(#lost-route-mask)"/>
        <g class="lost-art__origin">
          <circle cx="34" cy="290" r="15"/>
          <circle cx="34" cy="290" r="6.5"/>
        </g>
        <g transform="translate(608 66)"><text class="lost-art__query" text-anchor="middle">?</text></g>
        <g class="lost-art__pin" transform="translate(84 20)">
          <path d="M18 60S2 42 2 26a16 16 0 0 1 32 0c0 16-16 34-16 34Z"/>
          <circle cx="18" cy="25" r="6"/>
        </g>
      </g>
    </svg>
    <span class="tri-rule lost__ground"></span>
  </div>`;
}

export default {
  id: 'notFound',
  meta: (ctx) => ({
    title: ctx.t(notFound.meta.title),
    description: ctx.t(notFound.meta.description),
    noindex: true,
  }),
  render: (ctx) => html`
  <section class="lost" aria-labelledby="page-title">
    <div class="container lost__grid">
      ${art()}
      <div class="lost__copy">
        <p class="eyebrow">${ctx.t(notFound.eyebrow)}</p>
        <h1 class="lost__title" id="page-title">${raw(ctx.t(notFound.title))}</h1>
        <p class="lost__lede">${ctx.t(notFound.lede)}</p>
        ${button({ href: ctx.url('home'), label: ctx.t(ui.cta.backHome), variant: 'primary', size: 'lg', iconName: 'arrow', className: 'lost__home' })}
      </div>
      <nav class="lost__stops" aria-labelledby="stops-title">
        <h2 class="eyebrow" id="stops-title">${ctx.t(notFound.stopsTitle)}</h2>
        <ol class="stops" role="list">
          ${notFound.stops.map(
            (stop) => html`<li class="stops__item">
              <a class="stops__link" href="${ctx.url(stop.page)}">
                <span class="stops__label">${ctx.t(ui.nav[stop.page])}</span>
                <span class="stops__note">${ctx.t(stop.note)}</span>
                ${icon('arrow', { className: 'stops__icon' })}
              </a>
            </li>`
          )}
        </ol>
      </nav>
    </div>
  </section>`,
};
