import { html, raw, cx } from '../lib/html.js';
import { getImage } from '../lib/images.js';
import { menuPage } from '../../content/menu.js';
import { ui } from '../../i18n/ui.js';
import { site } from '../../data/site.js';
import { menuCategories, menuItems, dietaryLabels } from '../../data/menu.js';
import { icon } from '../components/icon.js';
import { picture } from '../components/picture.js';
import { button } from '../components/button.js';
import { menuFeature, menuRow, spiceIcons } from '../components/menu-item.js';

const pad = (n) => String(n).padStart(2, '0');

/** Localised dish count, e.g. "8 أطباق" / "8 dishes". */
function countLabel(ctx, n) {
  const forms = menuPage.count[ctx.lang];
  const form = forms[new Intl.PluralRules(ctx.lang).select(n)] ?? forms.other;
  return form.replace('{n}', n);
}

/**
 * Splits a category into photographed highlights and list rows. Highlights
 * are dishes with a photo, signatures first; the rest keep menu order.
 */
function composeCategory(category) {
  const items = menuItems.filter((item) => item.category === category.id);
  const config = menuPage.sections[category.id] ?? { layout: 'list', features: 0 };
  const features = items
    .filter((item) => item.image)
    .sort((a, b) => Number(b.signature) - Number(a.signature))
    .slice(0, config.features);
  const rows = items.filter((item) => !features.includes(item));
  return { items, features, rows, config };
}

const categories = menuCategories.map((category) => ({ ...category, ...composeCategory(category) }));
const seasonalItems = menuItems.filter((item) => item.seasonal);

const FEATURE_SIZES = {
  wide: '(min-width: 1440px) 780px, (min-width: 1024px) 55vw, (min-width: 768px) 50vw, 100vw',
  narrow: '(min-width: 1440px) 540px, (min-width: 1024px) 38vw, (min-width: 768px) 50vw, 100vw',
  spread: '(min-width: 1440px) 780px, (min-width: 1024px) 55vw, 100vw',
  aside: '(min-width: 1440px) 540px, (min-width: 1024px) 38vw, 100vw',
};

function hero(ctx) {
  const c = menuPage.hero;
  return html`
  <section class="menu-hero" aria-labelledby="page-title">
    <div class="container menu-hero__grid">
      <div class="menu-hero__copy">
        <p class="eyebrow" data-reveal>${ctx.t(c.eyebrow)}</p>
        <h1 class="menu-hero__title" id="page-title" data-reveal>${raw(ctx.t(c.title))}</h1>
        <p class="menu-hero__lede" data-reveal>${ctx.t(c.lede)}</p>
        <nav class="menu-index" aria-label="${ctx.t(c.indexLabel)}" data-reveal>
          <ol class="menu-index__list" role="list">
            ${categories.map(
              (cat, i) => html`<li>
                <a class="menu-index__link" href="#${cat.id}">
                  <span class="menu-index__num num" aria-hidden="true">${pad(i + 1)}</span>
                  <span class="menu-index__name">${ctx.t(cat.name)}</span>
                  <span class="menu-index__count num"><span class="visually-hidden">— </span>${countLabel(ctx, cat.items.length)}</span>
                </a>
              </li>`
            )}
          </ol>
        </nav>
        <ul class="menu-hero__notes" role="list" data-reveal>
          <li>${icon('check')}<span>${ctx.t(ui.labels.vatIncluded)}</span></li>
          <li>${icon('alert')}<span>${ctx.t(c.allergy)} <a href="#menu-notes">${ctx.t(c.notesLink)}</a></span></li>
        </ul>
      </div>
      <figure class="menu-hero__media">
        <div class="menu-hero__photo photo" data-reveal="image">
          ${picture(ctx, 'spices', { sizes: '(min-width: 1024px) 30vw, 100vw' })}
        </div>
        <figcaption class="menu-hero__caption">${ctx.t(c.caption)}</figcaption>
      </figure>
    </div>
  </section>`;
}

function filterBar(ctx) {
  const c = menuPage.filters;
  const chip = ({ id, label, count }) => html`
    <button class="menu-chip" type="button" data-category-filter="${id}" aria-pressed="${id === 'all' ? 'true' : 'false'}">
      <span class="menu-chip__label">${label}</span>
      <span class="menu-chip__count num" data-chip-count>${count}</span>
    </button>`;

  return html`
  <div class="menu-bar" role="region" aria-label="${ctx.t(c.label)}">
    <div class="menu-bar__inner container">
      <div class="menu-bar__scroller" data-scroll-x>
        <div class="menu-bar__chips" role="group" aria-label="${ctx.t(c.categories)}">
          ${chip({ id: 'all', label: ctx.t(c.all), count: menuItems.length })}
          ${categories.map((cat) => chip({ id: cat.id, label: ctx.t(cat.name), count: cat.items.length }))}
        </div>
      </div>
      <button class="menu-bar__toggle" type="button" aria-expanded="false" aria-controls="menu-diet">
        <span class="menu-bar__toggle-label">${ctx.t(c.toggle)}</span>
        <span class="menu-bar__toggle-count num" data-diet-count hidden></span>
        ${icon('chevron-down', { className: 'menu-bar__toggle-icon' })}
      </button>
      <div class="menu-bar__diet" id="menu-diet" role="group" aria-label="${ctx.t(c.diet)}">
        ${c.options.map(
          (opt) => html`<button class="menu-toggle" type="button" data-diet-filter="${opt.id}" aria-pressed="false">
            ${icon(opt.icon)}<span>${ctx.t(opt.label)}</span>
          </button>`
        )}
      </div>
    </div>
  </div>`;
}

function statusLine(ctx) {
  const c = menuPage.filters;
  return html`
  <div class="menu-status container">
    <p class="menu-status__text" role="status">${ctx.t(c.status.all).replace('{count}', countLabel(ctx, menuItems.length))}</p>
    <button class="menu-status__clear" type="button" data-menu-clear hidden>${icon('close')}${ctx.t(c.clear)}</button>
  </div>`;
}

function features(ctx, cat) {
  if (!cat.features.length) return '';
  const { layout, reverse } = cat.config;
  const variants = layout === 'pair' ? ['wide', 'narrow'] : [layout];
  return html`
    <div class="${cx('menu-features', `menu-features--${layout}`, reverse && 'menu-features--reverse')}" data-menu-group>
      ${cat.features.map((item, i) => menuFeature(ctx, item, { variant: variants[i] ?? variants[0], sizes: FEATURE_SIZES[variants[i] ?? variants[0]] }))}
    </div>`;
}

function section(ctx, cat, index) {
  const { layout, compact, surface } = cat.config;
  const titleId = `${cat.id}-title`;
  return html`
  <section class="${cx('menu-section', `menu-section--${layout}`, surface === 'dark' && 'surface-dark')}" id="${cat.id}" aria-labelledby="${titleId}" data-menu-section>
    <div class="container">
      <header class="menu-section__head" data-reveal>
        <p class="menu-section__num num" aria-hidden="true">${pad(index + 1)}</p>
        <div class="menu-section__titles">
          <h2 class="menu-section__title" id="${titleId}">${ctx.t(cat.name)}</h2>
          <p class="menu-section__alt ${ctx.otherLang === 'en' ? 'name-en' : 'name-ar'}" lang="${ctx.otherLang}">${cat.name[ctx.otherLang]}</p>
        </div>
        <div class="menu-section__meta">
          <p class="menu-section__intro">${ctx.t(cat.intro)}</p>
          <p class="menu-section__count" data-section-count>${countLabel(ctx, cat.items.length)}</p>
        </div>
      </header>
      <div class="menu-section__body">
        ${features(ctx, cat)}
        ${cat.rows.length
          ? html`<ul class="${cx('menu-list', compact && 'menu-list--compact')}" role="list" data-menu-group>
              ${cat.rows.map((item) => menuRow(ctx, item, { compact }))}
            </ul>`
          : ''}
      </div>
    </div>
  </section>`;
}

function emptyState(ctx) {
  const c = menuPage.filters.empty;
  return html`
  <div class="menu-empty container" data-menu-empty hidden>
    <span class="menu-empty__mark" aria-hidden="true"></span>
    <p class="menu-empty__title">${ctx.t(c.title)}</p>
    <p class="menu-empty__text">${ctx.t(c.text)}</p>
    <button class="btn btn--secondary" type="button" data-menu-clear><span class="btn__label">${ctx.t(menuPage.filters.clear)}</span></button>
  </div>`;
}

function notes(ctx) {
  const c = menuPage.notes;
  const legend = [
    [html`<span class="badge badge--signature">${icon('sparkle')}${ctx.t(ui.labels.signature)}</span>`, c.legend.rows.signature],
    [html`<span class="menu-tag">${icon('share')}${ctx.t(ui.labels.sharing)}</span>`, c.legend.rows.sharing],
    [html`<span class="menu-tag menu-tag--spicy">${spiceIcons(1)}${ctx.t(ui.labels.mild)}</span>`, c.legend.rows.mild],
    [html`<span class="menu-tag menu-tag--spicy">${spiceIcons(2)}${ctx.t(ui.labels.hot)}</span>`, c.legend.rows.hot],
    ...['vegetarian', 'vegan', 'gluten-free', 'nuts'].map((key) => [
      html`<span class="${cx('menu-tag', key === 'nuts' ? 'menu-tag--allergen' : 'menu-tag--diet')}">${icon(key === 'gluten-free' ? 'wheat' : key === 'nuts' ? 'nut' : 'leaf')}${ctx.t(dietaryLabels[key])}</span>`,
      c.legend.rows[key],
    ]),
  ];

  return html`
  <section class="menu-notes section" id="menu-notes" aria-labelledby="menu-notes-title">
    <div class="container menu-notes__grid">
      <header class="menu-notes__head" data-reveal>
        <p class="eyebrow">${ctx.t(c.eyebrow)}</p>
        <h2 class="menu-notes__title" id="menu-notes-title">${raw(ctx.t(c.title))}</h2>
        <p class="menu-notes__vat">${ctx.t(ui.labels.vatIncluded)}</p>
      </header>

      <div class="menu-notes__block menu-notes__block--legend" data-reveal>
        <h3 class="menu-notes__label">${ctx.t(c.legend.title)}</h3>
        <dl class="menu-legend">
          ${legend.map(([tag, text]) => html`<div class="menu-legend__row"><dt>${tag}</dt><dd>${ctx.t(text)}</dd></div>`)}
        </dl>
      </div>

      <div class="menu-notes__block" data-reveal>
        <h3 class="menu-notes__label">${icon('alert')}${ctx.t(c.allergy.title)}</h3>
        <p class="menu-notes__text">${ctx.t(c.allergy.text)}</p>
      </div>

      <div class="menu-notes__block" data-reveal>
        <h3 class="menu-notes__label">${ctx.t(c.season.title)}</h3>
        <p class="menu-notes__text">${ctx.t(c.season.text)}</p>
        <ul class="menu-notes__season" role="list">
          ${seasonalItems.map((item) => html`<li><a href="#${item.category}">${ctx.t(item.name)}</a></li>`)}
        </ul>
      </div>

      <div class="menu-notes__reserve" data-reveal>
        <p class="menu-notes__reserve-title">${ctx.t(c.reserve.title)}</p>
        <p class="menu-notes__text">${ctx.t(c.reserve.text)}</p>
        ${button({ href: ctx.url('reservations'), label: ctx.t(ui.cta.reserve), variant: 'primary', iconName: 'arrow' })}
      </div>
    </div>
  </section>`;
}

const DIET_SCHEMA = {
  vegetarian: ['https://schema.org/VegetarianDiet'],
  vegan: ['https://schema.org/VeganDiet', 'https://schema.org/VegetarianDiet'],
  'gluten-free': ['https://schema.org/GlutenFreeDiet'],
};

function menuItemSchema(ctx, item) {
  const image = item.image && getImage(item.image);
  const diets = [...new Set(item.dietary.flatMap((key) => DIET_SCHEMA[key] ?? []))];
  return {
    '@type': 'MenuItem',
    name: ctx.t(item.name),
    description: ctx.t(item.description),
    ...(image && { image: `${site.url}/assets/images/${item.image}-${image.widths.find((w) => w >= 1200) ?? image.widths.at(-1)}.webp` }),
    ...(diets.length && { suitableForDiet: diets.length === 1 ? diets[0] : diets }),
    offers: {
      '@type': 'Offer',
      price: item.price,
      priceCurrency: 'SAR',
      priceSpecification: { '@type': 'PriceSpecification', price: item.price, priceCurrency: 'SAR', valueAddedTaxIncluded: true },
    },
  };
}

export default {
  id: 'menu',
  meta: (ctx) => ({
    title: ctx.t(menuPage.meta.title),
    description: ctx.t(menuPage.meta.description),
  }),
  jsonLd: (ctx) => ({
    '@type': 'Menu',
    '@id': `${ctx.absoluteUrl('menu')}#menu`,
    name: ctx.t(menuPage.meta.menuName),
    description: ctx.t(menuPage.meta.description),
    url: ctx.absoluteUrl('menu'),
    inLanguage: ctx.lang,
    hasMenuSection: categories.map((cat) => ({
      '@type': 'MenuSection',
      '@id': `${ctx.absoluteUrl('menu')}#${cat.id}`,
      name: ctx.t(cat.name),
      description: ctx.t(cat.intro),
      hasMenuItem: cat.items.map((item) => menuItemSchema(ctx, item)),
    })),
  }),
  render: (ctx) => {
    const c = menuPage.filters;
    const copy = {
      count: menuPage.count[ctx.lang],
      status: { all: ctx.t(c.status.all), category: ctx.t(c.status.category), filtered: ctx.t(c.status.filtered) },
      categories: Object.fromEntries(categories.map((cat) => [cat.id, ctx.t(cat.name)])),
    };
    return html`
    ${hero(ctx)}
    <div class="menu" data-module="menu-filter" data-copy="${JSON.stringify(copy)}">
      ${filterBar(ctx)}
      ${statusLine(ctx)}
      <div class="menu__results" data-menu-results>
        ${categories.map((cat, i) => section(ctx, cat, i))}
        ${emptyState(ctx)}
      </div>
    </div>
    ${notes(ctx)}`;
  },
};
