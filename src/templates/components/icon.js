import { html, cx } from '../lib/html.js';

/** Icons whose meaning depends on reading direction (flipped in RTL via CSS). */
const DIRECTIONAL = new Set(['arrow', 'arrow-up-right']);

/**
 * Inline reference to the shared SVG sprite. Decorative by default;
 * pass `label` when the icon carries meaning on its own.
 */
export function icon(name, { className, label } = {}) {
  const classes = cx('icon', `icon--${name}`, DIRECTIONAL.has(name) && 'icon--directional', className);
  return label
    ? html`<svg class="${classes}" role="img" aria-label="${label}"><use href="/assets/icons/sprite.svg#${name}"></use></svg>`
    : html`<svg class="${classes}" aria-hidden="true" focusable="false"><use href="/assets/icons/sprite.svg#${name}"></use></svg>`;
}
