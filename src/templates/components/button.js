import { html, attrs, cx } from '../lib/html.js';
import { icon } from './icon.js';

/**
 * Link styled as a button.
 * variant: primary | secondary | ghost | light | link
 */
export function button({ href, label, variant = 'primary', size, iconName, className, external = false, extraAttrs = {} }) {
  return html`<a${attrs({
    class: cx('btn', `btn--${variant}`, size && `btn--${size}`, className),
    href,
    target: external ? '_blank' : null,
    rel: external ? 'noopener' : null,
    ...extraAttrs,
  })}><span class="btn__label">${label}</span>${iconName ? icon(iconName, { className: 'btn__icon' }) : ''}</a>`;
}
