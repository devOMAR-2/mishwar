import { html, raw } from '../lib/html.js';
import { restaurantSchema } from '../lib/seo.js';
import { getImage } from '../lib/images.js';
import { home } from '../../content/home.js';
import { ui } from '../../i18n/ui.js';
import { site } from '../../data/site.js';
import { locations, openLocations } from '../../data/locations.js';
import { menuItems } from '../../data/menu.js';
import { icon } from '../components/icon.js';
import { picture } from '../components/picture.js';
import { button } from '../components/button.js';
import { sectionHead } from '../components/section-head.js';
import { openStatus } from '../components/hours.js';
import { dishCard } from '../components/dish.js';
import { branchCard } from '../components/branch-card.js';

const HERO_SIZES = '(min-width: 1024px) 52vw, 100vw';
const signatures = menuItems.filter((item) => item.signature && item.image && item.category !== 'drinks').slice(0, 6);
const marqueeItems = menuItems.filter((item) => item.category !== 'drinks').slice(0, 14);

function hero(ctx) {
  const c = home.hero;
  const [first, second] = c.lines[ctx.lang];
  return html`
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero__grid container">
      <div class="hero__copy">
        <p class="eyebrow hero__eyebrow" data-hero="1">${ctx.t(c.eyebrow)}</p>
        <h1 class="hero__title" id="hero-title">
          <span class="hero__line"><span data-hero="2">${first}</span></span>
          <span class="hero__line accent"><span data-hero="3">${second}</span></span>
        </h1>
        <p class="hero__lede" data-hero="4">${ctx.t(c.lede)}</p>
        <div class="btn-row hero__ctas" data-hero="5">
          ${button({ href: ctx.url('reservations'), label: ctx.t(ui.cta.reserve), variant: 'primary', size: 'lg', iconName: 'arrow' })}
          ${button({ href: ctx.url('menu'), label: ctx.t(ui.cta.exploreMenu), variant: 'secondary', size: 'lg' })}
        </div>
        <ul class="hero__status" role="list" data-hero="6">
          ${openLocations.map((loc) => html`<li><span class="hero__status-name">${ctx.t(loc.shortName)}</span>${openStatus(ctx, loc.id)}</li>`)}
        </ul>
      </div>

      <div class="hero__media">
        <figure class="hero__main photo" data-hero="media">
          ${picture(ctx, 'hero-spread', { eager: true, sizes: HERO_SIZES, className: 'hero__img' })}
        </figure>
        <figure class="hero__inset" data-hero="inset">
          <div class="hero__inset-photo photo">${picture(ctx, 'hero-detail', { sizes: '(min-width: 1024px) 18vw, 40vw', className: 'hero__img' })}</div>
          <figcaption class="hero__tag">
            <span class="hero__tag-dish"><span class="hero__tag-dot" aria-hidden="true"></span>${ctx.t(c.tag.dish)}</span>
            <span class="hero__tag-note">${ctx.t(c.tag.note)}</span>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>`;
}

function marquee(ctx) {
  const c = home.marquee;
  const track = (hidden) => html`
    <ul class="marquee__track" role="list"${hidden ? raw(' aria-hidden="true"') : ''}>
      ${marqueeItems.map((item) => html`<li>${ctx.t(item.name)}</li>`)}
    </ul>`;
  return html`
  <section class="marquee surface-dark" data-module="marquee" aria-label="${ctx.t(c.label)}">
    <div class="marquee__viewport">${track(false)}${track(true)}</div>
    <button class="marquee__toggle" type="button" aria-pressed="false" data-label-pause="${ctx.t(c.pause)}" data-label-play="${ctx.t(c.play)}">
      <span class="marquee__toggle-icon" aria-hidden="true"></span><span class="visually-hidden">${ctx.t(c.pause)}</span>
    </button>
  </section>`;
}

function intro(ctx) {
  const c = home.intro;
  return html`
  <section class="intro section" aria-labelledby="intro-title">
    <div class="container intro__grid">
      <h2 class="eyebrow intro__eyebrow" id="intro-title" data-reveal>${ctx.t(c.eyebrow)}</h2>
      <p class="intro__statement" data-reveal>${raw(ctx.t(c.statement))}</p>
      <ul class="intro__facts" role="list" data-reveal-stagger>
        ${c.facts.map(
          (fact) => html`<li class="intro__fact" data-reveal>
            <p class="intro__fact-value">${ctx.t(fact.value)}</p>
            <p class="intro__fact-text">${ctx.t(fact.text)}</p>
          </li>`
        )}
      </ul>
      <a class="link-arrow intro__link" href="${ctx.url('about')}" data-reveal>${ctx.t(ui.cta.ourStory)}${icon('arrow')}</a>
    </div>
  </section>`;
}

function signatureDishes(ctx) {
  const c = home.signatures;
  return html`
  <section class="signatures section surface-alt" aria-labelledby="signatures-title">
    <div class="container">
      <div class="signatures__head">
        ${sectionHead({ eyebrow: ctx.t(c.eyebrow), title: raw(ctx.t(c.title)), intro: ctx.t(c.intro), id: 'signatures-title' })}
        <a class="link-arrow signatures__all" href="${ctx.url('menu')}" data-reveal>${ctx.t(ui.cta.fullMenu)}${icon('arrow')}</a>
      </div>
      <div class="signatures__rail" tabindex="0" role="region" aria-label="${ctx.t(c.railLabel)}" data-reveal-stagger>
        ${signatures.map((item, index) => dishCard(ctx, item, { index, className: 'signatures__card', sizes: '(min-width: 1024px) 22rem, (min-width: 768px) 44vw, 80vw' }))}
      </div>
    </div>
  </section>`;
}

function philosophy(ctx) {
  const c = home.philosophy;
  return html`
  <section class="philosophy section surface-dark" aria-labelledby="philosophy-title">
    <div class="container philosophy__grid">
      <figure class="philosophy__media">
        <div class="photo philosophy__photo" data-reveal="image">
          ${picture(ctx, 'hands-dough', { sizes: '(min-width: 1024px) 40vw, 100vw' })}
        </div>
        <figcaption class="philosophy__caption">${ctx.t(c.caption)}</figcaption>
      </figure>
      <div class="philosophy__content">
        ${sectionHead({ eyebrow: ctx.t(c.eyebrow), title: raw(ctx.t(c.title)), id: 'philosophy-title' })}
        <ol class="principles" role="list" data-reveal-stagger>
          ${c.principles.map(
            (p, i) => html`<li class="principle" data-reveal>
              <span class="principle__num num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
              <h3 class="principle__title">${ctx.t(p.title)}</h3>
              <p class="principle__text">${ctx.t(p.text)}</p>
            </li>`
          )}
        </ol>
      </div>
    </div>
  </section>`;
}

function experience(ctx) {
  const c = home.experience;
  const tile = (key, image, sizes) => html`
    <figure class="gallery__item gallery__item--${key}">
      <div class="photo gallery__photo" data-reveal="image">
        <div class="gallery__parallax" data-parallax>${picture(ctx, image, { sizes })}</div>
      </div>
      <figcaption class="gallery__caption">${ctx.t(c.captions[key])}</figcaption>
    </figure>`;

  return html`
  <section class="experience section" aria-labelledby="experience-title" data-module="parallax">
    <div class="container">
      ${sectionHead({ eyebrow: ctx.t(c.eyebrow), title: raw(ctx.t(c.title)), intro: ctx.t(c.intro), id: 'experience-title' })}
      <div class="gallery">
        ${tile('gathering', 'gathering', '(min-width: 1024px) 58vw, 100vw')}
        ${tile('fire', 'cooking-fire', '(min-width: 1024px) 34vw, 50vw')}
        ${tile('coffee', 'coffee-pour', '(min-width: 1024px) 26vw, 50vw')}
        ${tile('room', 'interior-main', '(min-width: 1024px) 40vw, 100vw')}
        ${tile('plating', 'chef-plating', '(min-width: 1024px) 26vw, 50vw')}
      </div>
    </div>
  </section>`;
}

function branches(ctx) {
  const c = home.branches;
  return html`
  <section class="branches section surface-alt" aria-labelledby="branches-title">
    <div class="container">
      <div class="branches__head">
        ${sectionHead({ eyebrow: ctx.t(c.eyebrow), title: raw(ctx.t(c.title)), intro: ctx.t(c.intro), id: 'branches-title' })}
        <a class="link-arrow" href="${ctx.url('locations')}" data-reveal>${ctx.t(ui.cta.allLocations)}${icon('arrow')}</a>
      </div>
      <div class="branches__grid" data-reveal-stagger>
        ${locations.map((loc) => branchCard(ctx, loc))}
      </div>
    </div>
  </section>`;
}

function reserveCta(ctx) {
  const c = home.reserve;
  return html`
  <section class="reserve-cta" aria-labelledby="reserve-title">
    <div class="container reserve-cta__grid">
      <div class="reserve-cta__copy" data-reveal>
        <p class="eyebrow">${ctx.t(c.eyebrow)}</p>
        <h2 class="reserve-cta__title" id="reserve-title">${ctx.t(c.title)}</h2>
        <p class="reserve-cta__text">${ctx.t(c.text)}</p>
        <div class="btn-row">
          ${button({ href: ctx.url('reservations'), label: ctx.t(ui.cta.reserve), variant: 'light', size: 'lg', iconName: 'arrow' })}
          <a class="reserve-cta__phone" href="tel:${site.contact.phone}">${icon('phone')}<span>${ctx.t(c.call)} <span dir="ltr">${site.contact.phoneDisplay}</span></span></a>
        </div>
      </div>
      <div class="reserve-cta__media photo" data-reveal="image">
        ${picture(ctx, 'interior-table', { sizes: '(min-width: 1024px) 38vw, 100vw' })}
      </div>
    </div>
  </section>`;
}

export default {
  id: 'home',
  meta(ctx) {
    const image = getImage('hero-spread');
    return {
      title: ctx.t(home.meta.title),
      description: ctx.t(home.meta.description),
      preloadImage: image && {
        srcset: image.widths.map((w) => `/assets/images/hero-spread-${w}.webp ${w}w`).join(', '),
        sizes: HERO_SIZES,
      },
    };
  },
  jsonLd: (ctx) => [
    ...restaurantSchema(ctx),
    {
      '@type': 'WebSite',
      '@id': `${site.url}/#website`,
      url: ctx.absoluteUrl('home'),
      name: ctx.t(site.name),
      inLanguage: ctx.lang,
    },
  ],
  render: (ctx) => html`
    ${hero(ctx)}
    ${marquee(ctx)}
    ${intro(ctx)}
    ${signatureDishes(ctx)}
    ${philosophy(ctx)}
    ${experience(ctx)}
    ${branches(ctx)}
    ${reserveCta(ctx)}`,
};
