import { html, cx } from '../lib/html.js';

/**
 * Eyebrow + heading + optional intro, the standard section opener.
 * `title` may be SafeHtml to allow an accent span.
 */
export function sectionHead({ eyebrow, title, intro, level = 2, id, align = 'start', className, action }) {
  const tag = `h${level}`;
  return html`
    <header class="${cx('section-head', `section-head--${align}`, className)}" data-reveal>
      ${eyebrow ? html`<p class="eyebrow">${eyebrow}</p>` : ''}
      <${tag} class="section-head__title"${id ? html` id="${id}"` : ''}>${title}</${tag}>
      ${intro ? html`<p class="section-head__intro">${intro}</p>` : ''}
      ${action ?? ''}
    </header>`;
}
