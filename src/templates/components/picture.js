import { html, attrs, cx } from '../lib/html.js';
import { getImage } from '../lib/images.js';

const src = (key, width) => `/assets/images/${key}-${width}.webp`;

/**
 * Responsive, CLS-safe <img> for a photography key.
 *
 * @param {object} ctx     render context
 * @param {string} key     image key from src/data/images.js
 * @param {object} options sizes, className, eager (above-the-fold), alt override, decorative
 */
export function picture(ctx, key, { sizes = '100vw', className, eager = false, alt, decorative = false } = {}) {
  const image = getImage(key);
  if (!image) {
    console.warn(`⚠ missing image "${key}"`);
    return html`<span class="${cx('img', 'img--missing', className)}" aria-hidden="true"></span>`;
  }

  const widths = image.widths;
  const fallback = widths.find((w) => w >= 1200) ?? widths.at(-1);

  return html`<img${attrs({
    class: cx('img', className),
    src: src(key, fallback),
    srcset: widths.map((w) => `${src(key, w)} ${w}w`).join(', '),
    sizes,
    width: image.width,
    height: image.height,
    alt: decorative ? '' : alt ?? ctx.t(image.alt),
    loading: eager ? 'eager' : 'lazy',
    fetchpriority: eager ? 'high' : null,
    decoding: eager ? 'sync' : 'async',
    style: image.color ? `--img-placeholder:${image.color}` : null,
  })}>`;
}

/** Photography credit line for a key (used on the About page / README). */
export const credit = (key) => getImage(key)?.credit;
