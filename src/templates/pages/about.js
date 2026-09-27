import { html, raw } from '../lib/html.js';
import { allImages } from '../lib/images.js';
import { about } from '../../content/about.js';
import { ui } from '../../i18n/ui.js';
import { site } from '../../data/site.js';
import { menuItems } from '../../data/menu.js';
import { icon } from '../components/icon.js';
import { picture } from '../components/picture.js';
import { button } from '../components/button.js';
import { pageHero } from '../components/page-hero.js';
import { sectionHead } from '../components/section-head.js';
import { originsMap } from '../components/about-origins-map.js';

const pad = (n) => String(n).padStart(2, '0');
const dishById = new Map(menuItems.map((item) => [item.id, item]));

function nameEntry(ctx) {
  const c = about.definition;
  return html`
  <section class="name-entry section" aria-labelledby="name-title">
    <div class="container name-entry__grid">
      <h2 class="eyebrow name-entry__label" id="name-title" data-reveal>${ctx.t(c.label)}</h2>
      <p class="name-entry__word" lang="ar" data-reveal>${c.word}</p>
      <div class="name-entry__body" data-reveal>
        <p class="name-entry__meta">
          <span class="name-entry__phonetic" lang="en" dir="ltr">/${c.transliteration}/</span>
          <span class="name-entry__grammar">${ctx.t(c.grammar)}</span>
        </p>
        <ol class="name-entry__senses" role="list">
          ${c.senses.map((sense, i) => html`<li><span class="name-entry__num num" aria-hidden="true">${i + 1}.</span><span>${ctx.t(sense)}</span></li>`)}
        </ol>
        <p class="name-entry__example">${ctx.t(c.example)}</p>
      </div>
      <svg class="name-entry__route" viewBox="0 0 600 120" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d="M4 96 C 140 96, 170 24, 300 24 S 460 96, 596 60"/>
      </svg>
    </div>
  </section>`;
}

function chapter(ctx, item, index) {
  const [main, detail] = item.images;
  return html`
  <li class="chapter" data-reveal-stagger>
    <div class="chapter__text">
      <p class="chapter__num num" aria-hidden="true" data-reveal>${pad(index + 1)}</p>
      <p class="chapter__kicker" data-reveal>${ctx.t(item.kicker)}</p>
      <h3 class="chapter__title" data-reveal>${ctx.t(item.title)}</h3>
      ${item.body.map((para) => html`<p class="chapter__para" data-reveal>${ctx.t(para)}</p>`)}
    </div>
    <div class="chapter__media">
      <figure class="chapter__figure chapter__figure--main">
        <div class="photo" data-reveal="image">${picture(ctx, main.key, { sizes: '(min-width: 1024px) 34vw, 78vw' })}</div>
        <figcaption class="about-caption">${ctx.t(main.caption)}</figcaption>
      </figure>
      <figure class="chapter__figure chapter__figure--detail">
        <div class="photo" data-reveal="image">${picture(ctx, detail.key, { sizes: '(min-width: 1024px) 18vw, 44vw' })}</div>
        <figcaption class="about-caption">${ctx.t(detail.caption)}</figcaption>
      </figure>
    </div>
  </li>`;
}

function chapters(ctx) {
  const c = about.chapters;
  return html`
  <section class="chapters section surface-alt" aria-labelledby="chapters-title">
    <div class="container">
      ${sectionHead({ eyebrow: ctx.t(c.eyebrow), title: raw(ctx.t(c.title)), id: 'chapters-title' })}
      <ol class="chapters__list" role="list">
        ${c.items.map((item, i) => chapter(ctx, item, i))}
      </ol>
    </div>
  </section>`;
}

function pullQuote(ctx) {
  const c = about.quote;
  return html`
  <section class="about-quote surface-dark" aria-label="${ctx.t(c.cite)}">
    <figure class="container container--narrow about-quote__inner" data-reveal>
      <span class="tri-rule about-quote__rule" aria-hidden="true"></span>
      <blockquote class="about-quote__text"><p>${ctx.t(c.text)}</p></blockquote>
      <figcaption class="about-quote__cite">${ctx.t(c.cite)}</figcaption>
    </figure>
  </section>`;
}

function creed(ctx) {
  const c = about.philosophy;
  const column = (group, modifier, glyph) => html`
    <div class="creed__col creed__col--${modifier}" data-reveal>
      <h3 class="creed__heading">${icon(glyph)}${ctx.t(group.title)}</h3>
      <ul class="creed__list" role="list">
        ${group.items.map(
          (item) => html`<li class="creed__item">
            <p class="creed__item-title">${ctx.t(item.title)}</p>
            <p class="creed__item-text">${ctx.t(item.text)}</p>
          </li>`
        )}
      </ul>
    </div>`;
  return html`
  <section class="creed section" aria-labelledby="creed-title">
    <div class="container">
      ${sectionHead({ eyebrow: ctx.t(c.eyebrow), title: raw(ctx.t(c.title)), intro: ctx.t(c.intro), id: 'creed-title' })}
      <div class="creed__grid">
        ${column(c.keep, 'keep', 'check')}
        ${column(c.add, 'add', 'plus')}
      </div>
    </div>
  </section>`;
}

function ingredients(ctx) {
  const c = about.ingredients;
  return html`
  <section class="ingredients section surface-alt" aria-labelledby="ingredients-title">
    <div class="container ingredients__grid">
      <div class="ingredients__intro">
        ${sectionHead({ eyebrow: ctx.t(c.eyebrow), title: raw(ctx.t(c.title)), intro: ctx.t(c.intro), id: 'ingredients-title' })}
        <figure class="ingredients__map" data-reveal>
          ${originsMap(ctx, { places: c.places, items: c.items, riyadhLabel: ctx.t(c.riyadh), label: ctx.t(c.mapLabel) })}
        </figure>
      </div>
      <ol class="ingredient-index" role="list" data-reveal-stagger="0.06">
        ${c.items.map(
          (item, i) => html`<li class="ingredient" data-reveal>
            <span class="ingredient__num num" aria-hidden="true">${pad(i + 1)}</span>
            <h3 class="ingredient__name">
              ${ctx.t(item.name)}
              <span class="ingredient__alt ${ctx.otherLang === 'en' ? 'name-en' : 'name-ar'}" lang="${ctx.otherLang}">${item.name[ctx.otherLang]}</span>
            </h3>
            <p class="ingredient__origin">${icon('pin')}${ctx.t(item.origin)}</p>
            <p class="ingredient__use">${ctx.t(item.use)}</p>
            <p class="ingredient__km"><span class="visually-hidden">${ctx.t(c.distanceLabel)}: </span><span class="num">${item.km.toLocaleString('en-US')}</span> ${ctx.t(c.kmUnit)}</p>
          </li>`
        )}
      </ol>
    </div>
  </section>`;
}

function roots(ctx) {
  const c = about.roots;
  return html`
  <section class="roots section" aria-labelledby="roots-title">
    <div class="container">
      ${sectionHead({ eyebrow: ctx.t(c.eyebrow), title: raw(ctx.t(c.title)), intro: ctx.t(c.intro), id: 'roots-title' })}
      <ul class="roots__grid" role="list" data-reveal-stagger>
        ${c.regions.map(
          (region) => html`<li class="region region--${region.id}" data-reveal>
            <p class="region__compass"><span class="region__arrow" aria-hidden="true"></span>${ctx.t(region.compass)}</p>
            <h3 class="region__name">${ctx.t(region.name)}</h3>
            <p class="region__text">${ctx.t(region.text)}</p>
            <p class="visually-hidden">${ctx.t(c.dishesLabel)}:</p>
            <ul class="region__dishes" role="list">
              ${region.dishes.map((id) => dishById.get(id)).filter(Boolean).map((dish) => html`<li>${ctx.t(dish.name)}</li>`)}
            </ul>
          </li>`
        )}
      </ul>
      <a class="link-arrow roots__link" href="${ctx.url('menu')}" data-reveal>${ctx.t(ui.cta.fullMenu)}${icon('arrow')}</a>
    </div>
  </section>`;
}

function hospitality(ctx) {
  const c = about.hospitality;
  return html`
  <section class="hosting section surface-dark" aria-labelledby="hosting-title">
    <div class="container hosting__grid">
      <div class="hosting__media">
        <figure class="hosting__figure hosting__figure--main">
          <div class="photo" data-reveal="image">${picture(ctx, 'dates', { sizes: '(min-width: 1024px) 34vw, 80vw' })}</div>
          <figcaption class="about-caption">${ctx.t(c.captions.dates)}</figcaption>
        </figure>
        <figure class="hosting__figure hosting__figure--detail">
          <div class="photo" data-reveal="image">${picture(ctx, 'drink-tea', { sizes: '(min-width: 1024px) 16vw, 40vw' })}</div>
          <figcaption class="about-caption">${ctx.t(c.captions.tea)}</figcaption>
        </figure>
      </div>
      <div class="hosting__content">
        ${sectionHead({ eyebrow: ctx.t(c.eyebrow), title: raw(ctx.t(c.title)), intro: ctx.t(c.intro), id: 'hosting-title' })}
        <ol class="rituals" role="list" data-reveal-stagger>
          ${c.rituals.map(
            (r, i) => html`<li class="ritual" data-reveal>
              <span class="ritual__num num" aria-hidden="true">${pad(i + 1)}</span>
              <h3 class="ritual__title">${ctx.t(r.title)}</h3>
              <p class="ritual__text">${ctx.t(r.text)}</p>
            </li>`
          )}
        </ol>
      </div>
    </div>
  </section>`;
}

function rooms(ctx) {
  const c = about.rooms;
  return html`
  <section class="rooms section" aria-labelledby="rooms-title">
    <div class="container">
      ${sectionHead({ eyebrow: ctx.t(c.eyebrow), title: raw(ctx.t(c.title)), id: 'rooms-title' })}
      <div class="rooms__media">
        <figure class="rooms__figure rooms__figure--main">
          <div class="photo" data-reveal="image">${picture(ctx, 'interior-main', { sizes: '(min-width: 1024px) 62vw, 100vw' })}</div>
          <figcaption class="about-caption">${ctx.t(c.captions.main)}</figcaption>
        </figure>
        <figure class="rooms__figure rooms__figure--detail">
          <div class="photo" data-reveal="image">${picture(ctx, 'chef-plating', { sizes: '(min-width: 1024px) 24vw, 50vw' })}</div>
          <figcaption class="about-caption">${ctx.t(c.captions.plating)}</figcaption>
        </figure>
      </div>
      <ul class="rooms__points" role="list" data-reveal-stagger>
        ${c.points.map(
          (p) => html`<li class="rooms__point" data-reveal>
            <h3 class="rooms__point-title">${ctx.t(p.title)}</h3>
            <p class="rooms__point-text">${ctx.t(p.text)}</p>
          </li>`
        )}
      </ul>
    </div>
  </section>`;
}

function timeline(ctx) {
  const c = about.timeline;
  return html`
  <section class="timeline section surface-alt" aria-labelledby="timeline-title">
    <div class="container">
      ${sectionHead({ eyebrow: ctx.t(c.eyebrow), title: raw(ctx.t(c.title)), id: 'timeline-title' })}
      <ol class="timeline__track" role="list" data-reveal-stagger="0.12">
        ${c.steps.map(
          (step) => html`<li class="${step.soon ? 'stop stop--soon' : 'stop'}" data-reveal>
            <span class="stop__marker" aria-hidden="true">${step.soon ? '?' : ''}</span>
            <p class="stop__year num">${ctx.t(step.year)}</p>
            <h3 class="stop__title">${ctx.t(step.title)}</h3>
            <p class="stop__text">${ctx.t(step.text)}</p>
          </li>`
        )}
      </ol>
    </div>
  </section>`;
}

function closing(ctx) {
  const c = about.closing;
  return html`
  <section class="about-close section" aria-labelledby="close-title">
    <div class="container container--narrow about-close__inner" data-reveal>
      <span class="tri-rule about-close__rule" aria-hidden="true"></span>
      <h2 class="about-close__title" id="close-title">${raw(ctx.t(c.title))}</h2>
      <p class="about-close__text">${ctx.t(c.text)}</p>
      <div class="btn-row about-close__ctas">
        ${button({ href: ctx.url('reservations'), label: ctx.t(ui.cta.reserve), variant: 'primary', size: 'lg', iconName: 'arrow' })}
        ${button({ href: ctx.url('locations'), label: ctx.t(ui.cta.allLocations), variant: 'secondary', size: 'lg' })}
      </div>
    </div>
  </section>`;
}

/** One entry per photographer, in manifest order. */
function photographers() {
  const byName = new Map();
  Object.values(allImages()).forEach((image) => {
    const credit = image.credit;
    if (credit?.name && !byName.has(credit.name)) byName.set(credit.name, credit);
  });
  return [...byName.values()];
}

function credits(ctx) {
  const c = about.credits;
  const people = photographers();
  if (!people.length) return '';
  return html`
  <section class="credits" aria-labelledby="credits-title">
    <div class="container credits__inner">
      <h2 class="credits__title" id="credits-title">${ctx.t(c.title)}</h2>
      <p class="credits__text">${ctx.t(c.text)}</p>
      <ul class="credits__list" role="list" lang="en">
        ${people.map(
          (p) => html`<li>${p.url ? html`<a href="${p.url}" target="_blank" rel="noopener">${p.name}<span class="visually-hidden"> ${ui.labels.newWindow.en}</span></a>` : p.name}</li>`
        )}
      </ul>
    </div>
  </section>`;
}

export default {
  id: 'about',
  meta: (ctx) => ({
    title: ctx.t(about.meta.title),
    description: ctx.t(about.meta.description),
  }),
  jsonLd: (ctx) => ({
    '@type': 'AboutPage',
    '@id': `${ctx.absoluteUrl('about')}#page`,
    url: ctx.absoluteUrl('about'),
    name: ctx.t(about.meta.title),
    description: ctx.t(about.meta.description),
    inLanguage: ctx.lang,
    about: { '@id': `${site.url}/#organization` },
  }),
  render: (ctx) => html`
    ${pageHero(ctx, {
      eyebrow: ctx.t(about.hero.eyebrow),
      title: raw(ctx.t(about.hero.title)),
      lede: ctx.t(about.hero.lede),
      image: 'exterior',
      imageAlt: ctx.t(about.hero.imageAlt),
      className: 'about-hero',
    })}
    ${nameEntry(ctx)}
    ${chapters(ctx)}
    ${pullQuote(ctx)}
    ${creed(ctx)}
    ${ingredients(ctx)}
    ${roots(ctx)}
    ${hospitality(ctx)}
    ${rooms(ctx)}
    ${timeline(ctx)}
    ${closing(ctx)}
    ${credits(ctx)}`,
};
