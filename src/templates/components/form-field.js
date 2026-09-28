import { html, attrs, cx } from '../lib/html.js';
import { formMessages } from '../../js/forms/messages.js';
import { icon } from './icon.js';

/**
 * Form field building blocks. Every field renders the same anatomy —
 *   [data-field] > label · hint · control · .field__error
 * — which js/forms/validation.js relies on. Field-specific error messages are
 * passed as `errors: { required: {ar,en}, … }` and emitted as data-error-*.
 */

const kebab = (key) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

export const errorAttrs = (ctx, errors = {}) =>
  Object.fromEntries(Object.entries(errors).map(([key, pair]) => [`data-error-${kebab(key)}`, ctx.t(pair)]));

/** aria-describedby for a control: hint (if any), extras, then the error slot. */
export const describedBy = (id, { hint, extra } = {}) => cx(hint && `${id}-hint`, extra, `${id}-error`);

export const optionalTag = (ctx) => html`<span class="field__optional">${ctx.t(formMessages.optional)}</span>`;

export const fieldHint = (id, hint) => (hint ? html`<p class="field__hint" id="${id}-hint">${hint}</p>` : '');

/** Inline error slot; stays empty (and invisible) until validation fills it. */
export const fieldError = (id) =>
  html`<p class="field__error" id="${id}-error">${icon('alert', { className: 'field__error-icon' })}<span data-error-text></span></p>`;

function fieldShell(ctx, { id, name, label, hint, optional, errors, className, control, after, hidden }) {
  return html`
  <div${attrs({ class: cx('field', className), 'data-field': name, hidden, ...errorAttrs(ctx, errors) })}>
    <label class="field__label" id="${id}-label" for="${id}">${label}${optional ? optionalTag(ctx) : ''}</label>
    ${fieldHint(id, hint)}
    ${control}
    ${fieldError(id)}
    ${after ?? ''}
  </div>`;
}

export function textField(ctx, { id, name, label, hint, type = 'text', required = true, errors, autocomplete, inputmode, minlength, maxlength, placeholder, dir, className }) {
  const control = html`<input${attrs({
    class: 'field__input',
    id,
    name,
    type,
    required,
    autocomplete,
    inputmode,
    minlength,
    maxlength,
    placeholder,
    dir,
    spellcheck: type === 'email' ? 'false' : null,
    'aria-describedby': describedBy(id, { hint }),
  })}>`;
  return fieldShell(ctx, { id, name, label, hint, optional: !required, errors, className, control });
}

export function textareaField(ctx, { id, name, label, hint, required = true, errors, minlength, maxlength, rows = 4, placeholder, className }) {
  const counterId = maxlength ? `${id}-count` : null;
  const control = html`<textarea${attrs({
    class: 'field__input field__input--area',
    id,
    name,
    rows,
    required,
    minlength,
    maxlength,
    placeholder,
    'aria-describedby': describedBy(id, { hint, extra: counterId }),
  })}></textarea>`;
  const counter = counterId
    ? html`<p class="field__counter num" id="${counterId}" data-counter>${ctx.t(formMessages.counter).replace('{count}', '0').replace('{max}', maxlength)}</p>`
    : '';
  return fieldShell(ctx, { id, name, label, hint, optional: !required, errors, className, control, after: counter });
}

/** options: [{ value, label, selected?, data? }]; `placeholder` becomes an empty first option. */
export function selectField(ctx, { id, name, label, hint, required = true, errors, options, placeholder, className }) {
  const control = html`
    <div class="field__select">
      <select${attrs({ class: 'field__input', id, name, required, 'aria-describedby': describedBy(id, { hint }) })}>
        ${placeholder ? html`<option value="">${placeholder}</option>` : ''}
        ${options.map((o) => html`<option${attrs({ value: o.value, selected: o.selected, ...o.data })}>${o.label}</option>`)}
      </select>
      ${icon('chevron-down', { className: 'field__select-icon' })}
    </div>`;
  return fieldShell(ctx, { id, name, label, hint, optional: !required, errors, className, control });
}

/**
 * Saudi mobile with a fixed +966 prefix. The accessible name is
 * "label +966"; js/forms/phone.js formats as the visitor types.
 * `hidden` renders the field hidden with its input disabled (revealed by a script).
 */
export function phoneField(ctx, { id, name = 'phone', label, hint, required = true, errors, className, hidden = false }) {
  const control = html`
    <div class="phone" dir="ltr">
      <span class="phone__prefix" id="${id}-prefix">+966</span>
      <input${attrs({
        class: 'field__input phone__input',
        id,
        name,
        type: 'tel',
        inputmode: 'tel',
        autocomplete: 'tel-national',
        dir: 'ltr',
        placeholder: '50 000 0000',
        required,
        disabled: hidden,
        'data-validate': 'saudi-mobile',
        'aria-labelledby': `${id}-label ${id}-prefix`,
        'aria-describedby': describedBy(id, { hint }),
      })}>
    </div>`;
  return fieldShell(ctx, { id, name, label, hint, optional: !required, errors, className: cx('field--phone', className), control, hidden });
}
