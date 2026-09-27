import { html, cx } from '../lib/html.js';
import { ui } from '../../i18n/ui.js';
import { dietaryLabels } from '../../data/menu.js';
import { icon } from './icon.js';
import { picture } from './picture.js';

export const DIET_ICONS = { vegetarian: 'leaf', vegan: 'leaf', 'gluten-free': 'wheat', nuts: 'nut' };

/** Primary name in the page language, the other language set beneath in its own face. */
export function dishNames(ctx, item, { level = 3, className = 'dish-name' } = {}) {
  const tag = `h${level}`;
  const secondary = item.name[ctx.otherLang];
  return html`<${tag} class="${className}">
    <span class="${className}__primary">${ctx.t(item.name)}</span>
    <span class="${className}__secondary ${ctx.otherLang === 'en' ? 'name-en' : 'name-ar'}" lang="${ctx.otherLang}">${secondary}</span>
  </${tag}>`;
}

/** Price with the currency de-emphasised. */
export function dishPrice(ctx, amount, { className = 'price' } = {}) {
  const currency = ctx.lang === 'ar' ? 'ر.س' : 'SAR';
  const number = html`<span class="${className}__amount num">${amount}</span>`;
  const unit = html`<span class="${className}__currency">${currency}</span>`;
  return html`<p class="${className}"><span class="visually-hidden">${ctx.lang === 'ar' ? 'السعر:' : 'Price:'} </span>${ctx.lang === 'ar' ? [number, ' ', unit] : [unit, ' ', number]}</p>`;
}

/** Badge list for a menu item: signature, sharing, spice level, dietary, seasonal. */
export function dishBadges(ctx, item, { signature = true } = {}) {
  const badges = [];
  if (signature && item.signature) badges.push(html`<li class="badge badge--signature">${icon('sparkle')}${ctx.t(ui.labels.signature)}</li>`);
  if (item.seasonal) badges.push(html`<li class="badge badge--seasonal">${ctx.t(ui.labels.seasonal)}</li>`);
  if (item.sharing) badges.push(html`<li class="badge">${icon('share')}${ctx.t(ui.labels.sharing)}</li>`);
  if (item.spicy) {
    const label = item.spicy > 1 ? ui.labels.hot : ui.labels.mild;
    badges.push(html`<li class="badge badge--spicy">${icon('chili')}${ctx.t(label)}</li>`);
  }
  item.dietary.forEach((diet) =>
    badges.push(html`<li class="badge badge--diet">${icon(DIET_ICONS[diet] ?? 'leaf')}${ctx.t(dietaryLabels[diet])}</li>`)
  );
  return badges.length ? html`<ul class="badges" role="list">${badges}</ul>` : '';
}

/** Editorial dish card with photo (home page signatures, menu highlights). */
export function dishCard(ctx, item, { index, sizes = '(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 82vw', className, level = 3 } = {}) {
  return html`
  <article class="${cx('dish-card', className)}" data-reveal>
    <figure class="dish-card__media photo">
      ${picture(ctx, item.image, { sizes, className: 'dish-card__img' })}
      ${index != null ? html`<span class="dish-card__index num" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>` : ''}
    </figure>
    <div class="dish-card__body">
      <div class="dish-card__head">
        ${dishNames(ctx, item, { level, className: 'dish-card__name' })}
        ${dishPrice(ctx, item.price, { className: 'dish-card__price' })}
      </div>
      <p class="dish-card__desc">${ctx.t(item.description)}</p>
      ${dishBadges(ctx, item, { signature: false })}
    </div>
  </article>`;
}
