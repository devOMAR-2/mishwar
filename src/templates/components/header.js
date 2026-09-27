import { html } from '../lib/html.js';
import { ui } from '../../i18n/ui.js';
import { site } from '../../data/site.js';
import { openLocations } from '../../data/locations.js';
import { logo } from './logo.js';
import { icon } from './icon.js';
import { hoursList } from './hours.js';

const HEADER_NAV = ['menu', 'about', 'locations', 'contact'];
const OVERLAY_NAV = ['home', 'menu', 'about', 'locations', 'reservations', 'contact'];

const current = (ctx, id) => (ctx.pageId === id ? html` aria-current="page"` : '');

export function langSwitch(ctx, { className = 'lang-switch' } = {}) {
  const copy = ui.langSwitch[ctx.lang];
  const target = ctx.pageId === 'notFound' ? 'home' : ctx.pageId;
  return html`<a class="${className}" href="${ctx.url(target, ctx.otherLang)}" hreflang="${ctx.otherLang}" lang="${ctx.otherLang}" title="${copy.title}" data-lang-switch>
    ${icon('globe', { className: 'lang-switch__icon' })}<span class="lang-switch__label">${copy.label}</span>
  </a>`;
}

export function header(ctx) {
  return html`
  <header class="site-header" data-module="header">
    <div class="site-header__inner container">
      ${logo(ctx, { href: ctx.url('home') })}

      <nav class="site-nav" aria-label="${ctx.t(ui.primaryNavLabel)}">
        <ul class="site-nav__list" role="list">
          ${HEADER_NAV.map((id) => html`<li><a class="site-nav__link" href="${ctx.url(id)}"${current(ctx, id)}>${ctx.t(ui.nav[id])}</a></li>`)}
        </ul>
      </nav>

      <div class="site-header__actions">
        ${langSwitch(ctx)}
        <a class="btn btn--primary btn--sm site-header__cta" href="${ctx.url('reservations')}"${current(ctx, 'reservations')}>
          <span class="btn__label">${ctx.t(ui.cta.reserve)}</span>
        </a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-overlay" data-nav-open>
          <span class="nav-toggle__bars" aria-hidden="true"><span></span></span>
          <span class="visually-hidden">${ctx.t(ui.menuToggle.open)}</span>
        </button>
      </div>
    </div>
  </header>

  <dialog class="nav-overlay" id="nav-overlay" aria-label="${ctx.t(ui.menuToggle.label)}" data-module="nav-overlay">
    <div class="nav-overlay__inner">
      <div class="nav-overlay__top">
        ${logo(ctx, { href: ctx.url('home') })}
        <button class="nav-overlay__close" type="button" data-nav-close>
          ${icon('close')}<span class="visually-hidden">${ctx.t(ui.menuToggle.close)}</span>
        </button>
      </div>

      <nav class="nav-overlay__nav" aria-label="${ctx.t(ui.primaryNavLabel)}">
        <ol class="nav-overlay__list" role="list">
          ${OVERLAY_NAV.map(
            (id, i) => html`<li style="--i:${i}"><a class="nav-overlay__link" href="${ctx.url(id)}"${current(ctx, id)}><span class="nav-overlay__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>${ctx.t(ui.nav[id])}</a></li>`
          )}
        </ol>
      </nav>

      <div class="nav-overlay__meta">
        ${openLocations.map(
          (loc) => html`<div class="nav-overlay__branch">
            <p class="nav-overlay__branch-name">${ctx.t(loc.name)}</p>
            ${hoursList(ctx, loc.hours, { className: 'hours--compact' })}
          </div>`
        )}
        <div class="nav-overlay__foot">
          <a class="nav-overlay__phone" href="tel:${site.contact.phone}">${icon('phone')}<span dir="ltr">${site.contact.phoneDisplay}</span></a>
          ${langSwitch(ctx, { className: 'lang-switch lang-switch--overlay' })}
        </div>
      </div>
    </div>
  </dialog>`;
}
