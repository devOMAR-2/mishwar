import { html } from '../lib/html.js';
import { ui } from '../../i18n/ui.js';
import { site } from '../../data/site.js';
import { locations } from '../../data/locations.js';
import { logo } from './logo.js';
import { icon } from './icon.js';
import { hoursList } from './hours.js';
import { langSwitch } from './header.js';

const FOOTER_NAV = ['home', 'menu', 'about', 'locations', 'reservations', 'contact', 'privacy'];

/** Placeholder chat link — the number is fictional, so this simply dials it. */
export const whatsappUrl = () => `tel:${site.contact.whatsapp}`;

export function socialLinks(ctx, { className = 'social' } = {}) {
  return html`<ul class="${className}" role="list">
    ${site.social.map(
      (s) => html`<li><a class="social__link" href="${s.url}" target="_blank" rel="noopener">${icon(s.id)}<span class="visually-hidden">${s.label} ${ctx.t(ui.labels.newWindow)}</span></a></li>`
    )}
  </ul>`;
}

function branchColumn(ctx, loc) {
  if (loc.status !== 'open') {
    return html`<section class="site-footer__col site-footer__col--soon" aria-labelledby="footer-${loc.id}">
      <h2 class="site-footer__heading" id="footer-${loc.id}">${ctx.t(loc.name)}</h2>
      <p class="site-footer__soon">${ctx.t(ui.status.comingSoon)}</p>
    </section>`;
  }
  return html`<section class="site-footer__col" aria-labelledby="footer-${loc.id}">
    <h2 class="site-footer__heading" id="footer-${loc.id}">${ctx.t(loc.name)}</h2>
    <p class="site-footer__address">${ctx.t(loc.address)}</p>
    ${hoursList(ctx, loc.hours, { className: 'hours--footer' })}
    <a class="site-footer__link" href="tel:${loc.phone}"><span dir="ltr">${loc.phoneDisplay}</span></a>
  </section>`;
}

export function footer(ctx) {
  const year = new Date().getFullYear();
  return html`
  <footer class="site-footer">
    <div class="container">
      <div class="site-footer__top">
        <div class="site-footer__brand">
          ${logo(ctx, { size: 'lg' })}
          <p class="site-footer__kicker">${ctx.t(ui.footer.kicker)}</p>
        </div>
        <a class="btn btn--light" href="${ctx.url('reservations')}"><span class="btn__label">${ctx.t(ui.cta.reserve)}</span>${icon('arrow', { className: 'btn__icon' })}</a>
      </div>

      <div class="site-footer__grid">
        ${locations.map((loc) => branchColumn(ctx, loc))}

        <section class="site-footer__col" aria-labelledby="footer-contact">
          <h2 class="site-footer__heading" id="footer-contact">${ctx.t(ui.nav.contact)}</h2>
          <ul class="site-footer__list" role="list">
            <li><span class="site-footer__label">${ctx.t(ui.labels.unifiedNumber)}</span><a class="site-footer__link" href="tel:${site.contact.phone}"><span dir="ltr">${site.contact.phoneDisplay}</span></a></li>
            <li><span class="site-footer__label">${ctx.t(ui.labels.whatsapp)}</span><a class="site-footer__link" href="${whatsappUrl()}"><span dir="ltr">${site.contact.whatsappDisplay}</span></a></li>
            <li><span class="site-footer__label">${ctx.t(ui.labels.email)}</span><a class="site-footer__link" href="mailto:${site.contact.email}">${site.contact.email}</a></li>
          </ul>
          <p class="site-footer__label site-footer__label--follow">${ctx.t(ui.labels.follow)}</p>
          ${socialLinks(ctx)}
        </section>

        <nav class="site-footer__col" aria-labelledby="footer-nav">
          <h2 class="site-footer__heading" id="footer-nav">${ctx.t(ui.footerNavLabel)}</h2>
          <ul class="site-footer__list site-footer__list--nav" role="list">
            ${FOOTER_NAV.map((id) => html`<li><a class="site-footer__link" href="${ctx.url(id)}">${ctx.t(ui.nav[id])}</a></li>`)}
          </ul>
        </nav>
      </div>

      <div class="site-footer__bottom">
        <p>© ${year} ${ctx.t(site.legalName)}. ${ctx.t(ui.footer.rights)}</p>
        <p class="site-footer__concept">${ctx.t(ui.footer.concept)}</p>
        <div class="site-footer__lang"><span>${ctx.t(ui.footer.language)}</span>${langSwitch(ctx, { className: 'lang-switch lang-switch--footer' })}</div>
      </div>
    </div>
  </footer>`;
}
