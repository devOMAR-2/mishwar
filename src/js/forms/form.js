/**
 * Shared submit flow for Mishwar's forms: custom validation with an error
 * summary, a single in-flight request, a loading state on the submit button
 * and a recoverable error message when sending fails.
 */
import { createValidator, focusField } from './validation.js';
import { createAnnouncer } from './announcer.js';

/**
 * @param {HTMLFormElement} form
 * @param {object} options
 * @param {Record<string, (field: HTMLElement) => string>} [options.validators]
 * @param {() => Promise<any>} options.submit   sends the data; resolves with the service result
 * @param {(result: any) => void} options.onSuccess
 */
export function enhanceForm(form, { validators, submit, onSuccess }) {
  const button = form.querySelector('[data-submit]');
  const label = button.querySelector('.btn__label');
  const idleLabel = label.textContent;
  const alert = form.querySelector('[data-form-alert]');
  const announce = createAnnouncer(form.querySelector('[data-announcer]'));
  const validator = createValidator(form, {
    validators,
    summary: form.querySelector('[data-error-summary]'),
    announce,
  });
  let pending = false;

  // The HTML keeps native validation for visitors without JavaScript.
  form.noValidate = true;

  const setPending = (state) => {
    pending = state;
    form.toggleAttribute('aria-busy', state);
    button.toggleAttribute('data-loading', state);
    button.setAttribute('aria-disabled', String(state));
    label.textContent = state ? button.dataset.loadingLabel : idleLabel;
    if (state) announce(button.dataset.loadingLabel);
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (pending) return;
    alert.hidden = true;

    const invalid = validator.validateAll();
    if (invalid.length) {
      focusField(invalid[0].field);
      return;
    }

    setPending(true);
    try {
      const result = await submit();
      setPending(false);
      onSuccess(result);
    } catch (error) {
      console.warn('[mishwar] form submission failed', error);
      setPending(false);
      alert.hidden = false;
      alert.focus();
    }
  });

  return {
    announce,
    revalidate: validator.revalidate,
    reset() {
      form.reset();
      validator.reset();
      alert.hidden = true;
    },
  };
}
