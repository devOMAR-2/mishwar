import { html, raw } from '../lib/html.js';
import { privacy } from '../../content/privacy.js';
import { formatDate } from '../../js/utils/format.js';
import { icon } from '../components/icon.js';
import { pageHero } from '../components/page-hero.js';

const num = (i) => String(i + 1).padStart(2, '0');

/** One content block of a section body (see content/privacy.js). */
function block(ctx, b) {
  if (b.p) return html`<p>${raw(ctx.t(b.p))}</p>`;
  if (b.list) return html`<ul class="legal-list" role="list">${b.list.map((item) => html`<li>${raw(ctx.t(item))}</li>`)}</ul>`;
  if (b.facts)
    return html`<dl class="legal-facts">
      ${b.facts.map(
        (f) => html`<div class="legal-facts__row">
          <dt>${ctx.t(f.term)}</dt>
          <dd>${ctx.t(f.detail)}</dd>
        </div>`
      )}
    </dl>`;
  return '';
}

function toc(ctx) {
  return html`
  <nav class="toc" aria-labelledby="toc-title" data-module="legal-toc">
    <h2 class="toc__title" id="toc-title">${ctx.t(privacy.tocLabel)}</h2>
    <ol class="toc__list" role="list">
      ${privacy.sections.map(
        (s, i) => html`<li>
          <a class="toc__link" href="#${s.id}"><span class="toc__num num" aria-hidden="true">${num(i)}</span><span>${ctx.t(s.title)}</span></a>
        </li>`
      )}
    </ol>
  </nav>`;
}

function notice(ctx) {
  const c = privacy.notice;
  return html`
  <aside class="legal-notice" aria-labelledby="notice-title" data-reveal>
    ${icon('sparkle', { className: 'legal-notice__icon' })}
    <div>
      <h2 class="legal-notice__title" id="notice-title">${ctx.t(c.title)}</h2>
      <p class="legal-notice__text">${ctx.t(c.text)}</p>
    </div>
  </aside>`;
}

function summary(ctx) {
  const c = privacy.summary;
  return html`
  <section class="legal-summary" aria-labelledby="summary-title" data-reveal>
    <h2 class="legal-summary__title" id="summary-title">${ctx.t(c.title)}</h2>
    <ul class="legal-summary__list" role="list">
      ${c.points.map((point) => html`<li>${icon('check')}<span>${ctx.t(point)}</span></li>`)}
    </ul>
  </section>`;
}

function section(ctx, s, i) {
  return html`
  <section class="legal-section" id="${s.id}" aria-labelledby="${s.id}-title">
    <header class="legal-section__head" data-reveal>
      <span class="legal-section__num num" aria-hidden="true">${num(i)}</span>
      <h2 class="legal-section__title" id="${s.id}-title">${ctx.t(s.title)}</h2>
    </header>
    <div class="legal-section__body prose" data-reveal>
      ${s.body.map((b) => block(ctx, b))}
    </div>
  </section>`;
}

export default {
  id: 'privacy',
  meta: (ctx) => ({
    title: ctx.t(privacy.meta.title),
    description: ctx.t(privacy.meta.description),
  }),
  render(ctx) {
    const c = privacy.hero;
    const { label, date } = privacy.updated;
    return html`
    ${pageHero(ctx, {
      eyebrow: ctx.t(c.eyebrow),
      title: raw(ctx.t(c.title)),
      lede: ctx.t(c.lede),
      className: 'legal-hero',
      children: html`<p class="legal-hero__updated" data-reveal>
        ${icon('calendar')}<span>${ctx.t(label)}</span>
        <time datetime="${date}">${formatDate(date, ctx.lang, { weekday: undefined, year: 'numeric' })}</time>
      </p>`,
    })}
    <div class="legal">
      <div class="container legal__grid">
        <div class="legal__aside">${toc(ctx)}</div>
        <div class="legal__body">
          ${notice(ctx)}
          ${summary(ctx)}
          ${privacy.sections.map((s, i) => section(ctx, s, i))}
        </div>
      </div>
    </div>`;
  },
};
