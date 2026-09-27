import { html, cx } from '../lib/html.js';

/**
 * Temporary typographic wordmark.
 *
 * This is the single swap point for the final brand asset: once the SVG logo
 * exists, replace the markup below with
 *   <img class="wordmark__svg" src="/assets/brand/mishwar-logo.svg" alt="" width="…" height="…">
 * and every header, footer and menu overlay picks it up.
 */
export function logo(ctx, { href, className, size = 'md' } = {}) {
  const mark = html`
    <span class="wordmark__ar" lang="ar">مِشوار</span>
    <span class="wordmark__en" lang="en">Mishwar</span>`;

  return href
    ? html`<a class="${cx('wordmark', `wordmark--${size}`, className)}" href="${href}" aria-label="${ctx.lang === 'ar' ? 'مِشوار — الصفحة الرئيسية' : 'Mishwar — home'}"><span class="wordmark__inner" aria-hidden="true">${mark}</span></a>`
    : html`<span class="${cx('wordmark', `wordmark--${size}`, className)}" role="img" aria-label="${ctx.lang === 'ar' ? 'مِشوار' : 'Mishwar'}"><span class="wordmark__inner" aria-hidden="true">${mark}</span></span>`;
}
