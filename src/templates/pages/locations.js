import { html, raw } from '../lib/html.js';
import { restaurantSchema } from '../lib/seo.js';
import { locationsPage } from '../../content/locations.js';
import { ui } from '../../i18n/ui.js';
import { site } from '../../data/site.js';
import { locations } from '../../data/locations.js';
import { mapsUrl } from '../../js/utils/maps.js';
import { icon } from '../components/icon.js';
import { picture } from '../components/picture.js';
import { pageHero } from '../components/page-hero.js';
import { sectionHead } from '../components/section-head.js';
import { hoursList, openStatus } from '../components/hours.js';
import { whatsappUrl } from '../components/footer.js';
import { riyadhMap } from '../components/riyadh-map.js';

const L = locationsPage.labels;
const fill = (text, vars) => text.replace(/\{(\w+)\}/g, (_, key) => vars[key]);
const pad = (n) => String(n).padStart(2, '0');

function branch(ctx, loc, index) {
  const extra = locationsPage.branches[loc.id];
  const titleId = `branch-${loc.id}-title`;
  return html`
  <article class="branch" id="branch-${loc.id}" aria-labelledby="${titleId}">
    <div class="branch__media">
      <figure class="branch__photo branch__photo--main photo" data-reveal="image">
        ${picture(ctx, loc.image, { sizes: '(min-width: 1024px) 50vw, 100vw' })}
      </figure>
      <figure class="branch__photo branch__photo--detail photo" data-reveal="image">
        ${picture(ctx, extra.detailImage, { sizes: '(min-width: 1024px) 18vw, 40vw', alt: ctx.t(extra.detailAlt) })}
      </figure>
    </div>

    <div class="branch__body" data-reveal-stagger>
      <header class="branch__head" data-reveal>
        <p class="branch__kicker"><span class="branch__num num">${pad(index + 1)}</span>${ctx.t(extra.tagline)} · ${fill(ctx.t(L.since), { year: loc.opened })}</p>
        <h2 class="branch__name" id="${titleId}">${ctx.t(loc.name)}</h2>
        <p class="branch__district">${icon('pin')}${ctx.t(loc.district)}</p>
        ${openStatus(ctx, loc.id, { className: 'branch__status' })}
      </header>

      <p class="branch__summary" data-reveal>${ctx.t(loc.summary)}</p>

      <dl class="branch__facts" data-reveal>
        <div class="branch__fact branch__fact--address">
          <dt>${ctx.t(ui.labels.address)}</dt>
          <dd>
            <p>${ctx.t(loc.address)}</p>
            <p class="branch__short">
              <span class="branch__short-label">${ctx.t(ui.labels.shortAddress)}</span>
              <span class="branch__short-code" dir="ltr">${loc.shortAddress}</span>
              <button class="branch__copy" type="button" data-module="location-copy" data-copy="${loc.shortAddress}" data-done="${ctx.t(L.copied)}" hidden>
                <span class="branch__copy-text">${ctx.t(L.copy)}</span>
                <span class="visually-hidden"> ${ctx.t(ui.labels.shortAddress)}</span>
              </button>
            </p>
          </dd>
        </div>
        <div class="branch__fact">
          <dt>${ctx.t(L.landmark)}</dt>
          <dd>${ctx.t(loc.landmark)}</dd>
        </div>
        <div class="branch__fact">
          <dt>${ctx.t(ui.labels.phone)}</dt>
          <dd><a class="branch__phone" href="tel:${loc.phone}">${icon('phone')}<span dir="ltr">${loc.phoneDisplay}</span></a></dd>
        </div>
        <div class="branch__fact branch__fact--hours">
          <dt>${ctx.t(ui.labels.hours)}</dt>
          <dd>${hoursList(ctx, loc.hours)}</dd>
        </div>
      </dl>

      <div class="branch__extras" data-reveal>
        <div class="branch__features">
          <h3 class="branch__subhead">${ctx.t(L.features)}</h3>
          <ul class="branch__feature-list" role="list">
            ${loc.features.map((f) => html`<li>${icon('check')}${ctx.t(f)}</li>`)}
          </ul>
        </div>
        <div class="branch__directions">
          <h3 class="branch__subhead">${ctx.t(L.gettingThere)}</h3>
          <p>${icon('car')}<span>${ctx.t(extra.directions)}</span></p>
        </div>
      </div>

      <div class="branch__actions" data-reveal>
        <a class="btn btn--primary" href="${ctx.url('reservations')}?branch=${loc.id}">
          <span class="btn__label">${fill(ctx.t(L.reserveAt), { branch: ctx.t(loc.shortName) })}</span>${icon('arrow', { className: 'btn__icon' })}
        </a>
        <a class="btn btn--secondary" href="${mapsUrl(loc)}" target="_blank" rel="noopener">
          <span class="btn__label">${ctx.t(ui.cta.directions)}</span>${icon('arrow-up-right', { className: 'btn__icon' })}
          <span class="visually-hidden">${ctx.t(ui.labels.newWindow)}</span>
        </a>
      </div>
    </div>
  </article>`;
}

function comingSoon(ctx, loc) {
  const c = locationsPage.soon;
  return html`
  <article class="branch-soon" id="branch-${loc.id}" aria-labelledby="branch-${loc.id}-title">
    <div class="branch-soon__media photo" data-reveal="image">
      ${picture(ctx, loc.image, { sizes: '(min-width: 1024px) 40vw, 100vw', decorative: true })}
      <span class="branch-soon__mark" aria-hidden="true">?</span>
    </div>
    <div class="branch-soon__body" data-reveal>
      <p class="badge badge--soon">${ctx.t(ui.status.comingSoon)}</p>
      <p class="eyebrow">${ctx.t(c.eyebrow)}</p>
      <h2 class="branch-soon__title" id="branch-${loc.id}-title">${raw(ctx.t(c.title))}</h2>
      <p class="branch-soon__text">${ctx.t(c.text)}</p>
      <a class="link-arrow branch-soon__link" href="${ctx.url('contact')}">${ctx.t(c.suggest)}${icon('arrow')}</a>
    </div>
  </article>`;
}

function faq(ctx) {
  const c = locationsPage.faq;
  return html`
  <section class="faq section surface-alt" aria-labelledby="faq-title">
    <div class="container faq__grid">
      <div class="faq__intro">
        ${sectionHead({ eyebrow: ctx.t(c.eyebrow), title: raw(ctx.t(c.title)), id: 'faq-title' })}
        <div class="faq__contact" data-reveal>
          <p class="faq__more">${ctx.t(c.more)}</p>
          <a class="faq__line" href="tel:${site.contact.phone}">${icon('phone')}<span>${ctx.t(c.call)} <span class="num" dir="ltr">${site.contact.phoneDisplay}</span></span></a>
          <a class="faq__line" href="${whatsappUrl()}">${icon('whatsapp')}<span>${ctx.t(c.whatsapp)}</span></a>
        </div>
      </div>
      <div class="faq__list" data-reveal-stagger="0.06">
        ${c.items.map(
          (item) => html`<details class="faq__item" data-reveal>
            <summary class="faq__q"><span>${ctx.t(item.q)}</span><span class="faq__icon" aria-hidden="true"></span></summary>
            <p class="faq__a">${ctx.t(item.a)}</p>
          </details>`
        )}
      </div>
    </div>
  </section>`;
}

export default {
  id: 'locations',
  meta: (ctx) => ({
    title: ctx.t(locationsPage.meta.title),
    description: ctx.t(locationsPage.meta.description),
  }),
  jsonLd: (ctx) => restaurantSchema(ctx),
  render(ctx) {
    const c = locationsPage.hero;
    const open = locations.filter((l) => l.status === 'open');
    const soon = locations.filter((l) => l.status !== 'open');
    return html`
    ${pageHero(ctx, {
      eyebrow: ctx.t(c.eyebrow),
      title: raw(ctx.t(c.title)),
      lede: ctx.t(c.lede),
      className: 'loc-hero',
      children: html`<div class="loc-hero__map" data-reveal>${riyadhMap(ctx, locations)}</div>`,
    })}
    <div class="branches-list container">
      ${open.map((loc, i) => branch(ctx, loc, i))}
      ${soon.map((loc) => comingSoon(ctx, loc))}
    </div>
    ${faq(ctx)}`;
  },
};
