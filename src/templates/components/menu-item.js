import { html, cx } from '../lib/html.js';
import { ui } from '../../i18n/ui.js';
import { dietaryLabels } from '../../data/menu.js';
import { icon } from './icon.js';
import { picture } from './picture.js';
import { dishPrice, DIET_ICONS } from './dish.js';

/** Filter keys an item answers to (matched by the menu-filter module). */
export function itemTags(item) {
  return [
    (item.dietary.includes('vegetarian') || item.dietary.includes('vegan')) && 'vegetarian',
    item.dietary.includes('gluten-free') && 'gluten-free',
    item.spicy > 0 && 'spicy',
    item.signature && 'signature',
  ].filter(Boolean);
}

/** One chili per heat level, so "hot" reads hotter than "mild" at a glance. */
export const spiceIcons = (level) => Array.from({ length: level }, () => icon('chili'));

/**
 * Menu badges. Signature and seasonal are pills; everything else is a quiet
 * icon + label tag so a long list doesn't turn into a wall of chips.
 */
export function menuTags(ctx, item, { signature = true, diet = true } = {}) {
  const tags = [];
  if (signature && item.signature) tags.push(html`<li class="badge badge--signature">${icon('sparkle')}${ctx.t(ui.labels.signature)}</li>`);
  if (item.seasonal) tags.push(html`<li class="badge badge--seasonal">${ctx.t(ui.labels.seasonal)}</li>`);
  if (item.sharing) tags.push(html`<li class="menu-tag">${icon('share')}${ctx.t(ui.labels.sharing)}</li>`);
  if (item.spicy) {
    const label = item.spicy > 1 ? ui.labels.hot : ui.labels.mild;
    tags.push(html`<li class="menu-tag menu-tag--spicy">${spiceIcons(item.spicy)}${ctx.t(label)}</li>`);
  }
  if (diet) {
    item.dietary.forEach((key) =>
      tags.push(html`<li class="${cx('menu-tag', key === 'nuts' ? 'menu-tag--allergen' : 'menu-tag--diet')}">${icon(DIET_ICONS[key])}${ctx.t(dietaryLabels[key])}</li>`)
    );
  }
  return tags.length ? html`<ul class="menu-tags" role="list">${tags}</ul>` : '';
}

/** Data attributes shared by rows and highlights. */
const filterAttrs = (item) => html`data-menu-item data-category="${item.category}" data-tags="${itemTags(item).join(' ')}"`;

/** Name in the page language; the other language set beneath in its own face. */
const altName = (ctx, item, className) =>
  html`<p class="${className} ${ctx.otherLang === 'en' ? 'name-en' : 'name-ar'}" lang="${ctx.otherLang}">${item.name[ctx.otherLang]}</p>`;

/**
 * Editorial highlight: photograph, large bilingual name, description, price.
 * `variant` sets the proportions (wide | narrow | spread | aside).
 */
export function menuFeature(ctx, item, { variant, sizes }) {
  return html`
  <article class="${cx('menu-feature', `menu-feature--${variant}`)}" ${filterAttrs(item)}>
    <figure class="menu-feature__media photo" data-reveal="image">
      ${picture(ctx, item.image, { sizes, className: 'menu-feature__img' })}
    </figure>
    <div class="menu-feature__body" data-reveal>
      <div class="menu-feature__head">
        <div class="menu-feature__names">
          <h3 class="menu-feature__name">${ctx.t(item.name)}</h3>
          ${altName(ctx, item, 'menu-feature__alt')}
        </div>
        <span class="menu-leader" aria-hidden="true"></span>
        ${dishPrice(ctx, item.price, { className: 'menu-price' })}
      </div>
      <p class="menu-feature__desc">${ctx.t(item.description)}</p>
      ${menuTags(ctx, item)}
    </div>
  </article>`;
}

/**
 * Menu row: name, dotted leader and price on one line; description and tags
 * below, with a small photo tucked under the price when the dish has one.
 */
export function menuRow(ctx, item, { compact = false } = {}) {
  return html`
  <li class="${cx('menu-item', item.image && 'menu-item--thumb')}" ${filterAttrs(item)}>
    <div class="menu-item__head">
      <h3 class="menu-item__name">${ctx.t(item.name)}</h3>
      <span class="menu-leader" aria-hidden="true"></span>
      ${dishPrice(ctx, item.price, { className: 'menu-price' })}
    </div>
    <div class="menu-item__body">
      ${altName(ctx, item, 'menu-item__alt')}
      <p class="menu-item__desc">${ctx.t(item.description)}</p>
      ${menuTags(ctx, item, { diet: !compact })}
    </div>
    ${item.image
      ? html`<figure class="menu-item__thumb photo">${picture(ctx, item.image, { sizes: '96px', decorative: true })}</figure>`
      : ''}
  </li>`;
}
