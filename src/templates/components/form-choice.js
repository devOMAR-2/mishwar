import { html, attrs, cx } from '../lib/html.js';
import { icon } from './icon.js';
import { errorAttrs, describedBy, optionalTag, fieldHint, fieldError } from './form-field.js';

/**
 * Radio group as a <fieldset>, styled as pill chips or media cards.
 * Native radios keep arrow-key navigation and form semantics for free.
 *
 * options: [{ value, label, detail?, note?, media?, checked?, disabled?, data? }]
 */
export function choiceGroup(ctx, { id, name, legend, hint, required = false, optional = false, errors, variant = 'chips', options, className }) {
  return html`
  <fieldset${attrs({
    class: cx('field', 'field--group', className),
    id,
    'data-field': name,
    'aria-describedby': describedBy(id, { hint }),
    ...errorAttrs(ctx, errors),
  })}>
    <legend class="field__label" id="${id}-label">${legend}${optional ? optionalTag(ctx) : ''}</legend>
    ${fieldHint(id, hint)}
    <div class="choices choices--${variant}">
      ${options.map((o) => choice({ id, name, variant, required }, o))}
    </div>
    ${fieldError(id)}
  </fieldset>`;
}

function choice({ id, name, variant, required }, o) {
  const inputId = `${id}-${o.value || 'none'}`;
  return html`
  <label class="choice choice--${variant}" for="${inputId}">
    <input${attrs({
      class: 'choice__input',
      type: 'radio',
      id: inputId,
      name,
      value: o.value,
      checked: o.checked,
      disabled: o.disabled,
      required,
      ...o.data,
    })}>
    ${o.media ? html`<span class="choice__media">${o.media}</span>` : ''}
    <span class="choice__body">
      <span class="choice__label">${o.label}</span>
      ${o.detail ? html`<span class="choice__detail">${o.detail}</span>` : ''}
      ${o.note ? html`<span class="choice__note">${o.note}</span>` : ''}
    </span>
    ${variant === 'cards' ? html`<span class="choice__check" aria-hidden="true">${icon('check')}</span>` : ''}
  </label>`;
}
