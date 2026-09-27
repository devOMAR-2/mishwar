import { html, cx } from '../lib/html.js';
import { picture } from './picture.js';

/**
 * Opening block for inner pages: eyebrow, large title, lede and an optional
 * wide image. `title` may be SafeHtml to allow an accent span.
 */
export function pageHero(ctx, { eyebrow, title, lede, image, imageAlt, className, children }) {
  return html`
  <section class="${cx('page-hero', image && 'page-hero--image', className)}" aria-labelledby="page-title">
    <div class="container page-hero__inner">
      ${eyebrow ? html`<p class="eyebrow page-hero__eyebrow" data-reveal>${eyebrow}</p>` : ''}
      <h1 class="page-hero__title" id="page-title" data-reveal>${title}</h1>
      ${lede ? html`<p class="page-hero__lede" data-reveal>${lede}</p>` : ''}
      ${children ?? ''}
    </div>
    ${image
      ? html`<div class="page-hero__media container" data-reveal="image">
          ${picture(ctx, image, { eager: true, sizes: '(min-width: 1440px) 1360px, 100vw', alt: imageAlt, className: 'page-hero__img' })}
        </div>`
      : ''}
  </section>`;
}
