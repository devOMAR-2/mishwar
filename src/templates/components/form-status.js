import { html, raw, cx } from '../lib/html.js';
import { formMessages } from '../../js/forms/messages.js';
import { icon } from './icon.js';

/** Form-level pieces: error summary, send-failure alert, submit button, live region, client strings. */

/** Filled by js/forms/validation.js on submit; each item links to its field. */
export const errorSummary = (ctx) => html`
  <div class="form-summary" data-error-summary hidden>
    <p class="form-summary__title">${icon('alert')}${ctx.t(formMessages.summaryTitle)}</p>
    <ul class="form-summary__list" role="list" data-summary-list></ul>
  </div>`;

/** Shown (and focused) when sending fails. `message` may contain markup (tel: link). */
export const formAlert = (message) => html`
  <div class="form-alert" data-form-alert tabindex="-1" hidden>
    ${icon('alert', { className: 'form-alert__icon' })}<p>${message}</p>
  </div>`;

export const submitButton = (ctx, { label, className }) => html`
  <button class="${cx('btn btn--primary btn--lg btn--block form-submit', className)}" type="submit" data-submit data-loading-label="${ctx.t(formMessages.sending)}">
    <span class="form-submit__spinner" aria-hidden="true"></span>
    <span class="btn__label">${label}</span>
    ${icon('arrow', { className: 'btn__icon' })}
  </button>`;

export const announcer = () => html`<p class="visually-hidden" aria-live="polite" data-announcer></p>`;

/** Strings the browser module needs, serialised for the current language only. */
export const clientStrings = (data) =>
  html`<script type="application/json" data-strings>${raw(JSON.stringify(data).replace(/</g, '\\u003c'))}</script>`;

/**
 * Fill `{key}` placeholders in plain copy with markup (links, output slots);
 * the surrounding text stays escaped.
 */
export const fillHtml = (text, slots) =>
  text.split(/(\{\w+\})/).map((part) => {
    const key = part.match(/^\{(\w+)\}$/)?.[1];
    return key && key in slots ? slots[key] : part;
  });
