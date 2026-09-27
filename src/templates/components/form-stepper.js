import { html, attrs, cx } from '../lib/html.js';
import { icon } from './icon.js';
import { errorAttrs, describedBy, fieldHint, fieldError } from './form-field.js';

/**
 * Number field with −/+ buttons (enhanced by js/forms/stepper.js).
 * Without JavaScript the buttons are hidden and the native number input works alone.
 */
export function stepperField(ctx, { id, name, label, hint, min, max, value, decreaseLabel, increaseLabel, errors, className }) {
  const stepButton = (step, iconName, text) => html`
    <button class="stepper__btn" type="button" data-step="${step}" aria-controls="${id}">
      ${icon(iconName)}<span class="visually-hidden">${text}</span>
    </button>`;

  return html`
  <div${attrs({ class: cx('field', 'field--stepper', className), 'data-field': name, ...errorAttrs(ctx, errors) })}>
    <label class="field__label" id="${id}-label" for="${id}">${label}</label>
    <div class="stepper" data-stepper>
      ${stepButton(-1, 'minus', decreaseLabel)}
      <input${attrs({
        class: 'stepper__input num',
        id,
        name,
        type: 'number',
        inputmode: 'numeric',
        min,
        max,
        step: 1,
        value,
        required: true,
        'aria-describedby': describedBy(id, { hint }),
      })}>
      ${stepButton(1, 'plus', increaseLabel)}
    </div>
    ${fieldHint(id, hint)}
    ${fieldError(id)}
  </div>`;
}
