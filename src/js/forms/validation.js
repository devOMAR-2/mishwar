/**
 * Custom, bilingual constraint validation.
 *
 * Every field is a wrapper with `data-field="name"` holding its control(s), an
 * optional hint and a `.field__error` element referenced by aria-describedby.
 * Constraints come from ordinary HTML attributes (required, type=email,
 * minlength, maxlength, min/max, data-validate="saudi-mobile"); pages can add
 * custom checks per field. Messages are looked up in the field's
 * `data-error-<key>` attributes first, then in the generic formMessages.
 *
 * Timing: errors appear when a field the visitor has used loses focus, clear
 * as soon as the value becomes valid, and everything is checked on submit.
 */
import { formMessages, plural } from './messages.js';
import { normaliseSaudiMobile, isSaudiMobile } from './phone.js';
import { lang, t } from '../core/i18n.js';

const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[^\s@.]{2,}$/;
const CONTROLS = 'input, select, textarea';

const isActive = (field) => !field.closest('[hidden]') && !field.matches(':disabled');

/** First failing built-in constraint of a field, as an error key ('' when valid). */
function check(field) {
  const radios = [...field.querySelectorAll('input[type="radio"]')];
  if (radios.length) {
    return radios.some((r) => r.required) && !radios.some((r) => r.checked) ? 'required' : '';
  }

  const control = field.querySelector(CONTROLS);
  if (!control || control.disabled) return '';
  const value = control.value.trim();

  if (!value) return control.required ? 'required' : '';
  if (control.dataset.validate === 'saudi-mobile' && !isSaudiMobile(normaliseSaudiMobile(value))) return 'phone';
  if (control.type === 'email' && !EMAIL.test(value)) return 'email';
  if (control.type === 'number') {
    const n = Number(value);
    if (!Number.isInteger(n) || n < Number(control.min) || n > Number(control.max)) return 'range';
  }
  if (control.minLength > 0 && value.length < control.minLength) return 'tooShort';
  if (control.maxLength > 0 && value.length > control.maxLength) return 'tooLong';
  return '';
}

function messageFor(field, key) {
  const custom = field.dataset[`error${key[0].toUpperCase()}${key.slice(1)}`];
  if (custom) return custom;
  const control = field.querySelector(CONTROLS);
  const vars = { min: control?.min || control?.minLength, max: control?.max || control?.maxLength };
  return t(formMessages.errors[key] ?? formMessages.errors.required, vars);
}

/** The element to move focus to for a field: its checked/first radio, its control, or the group itself. */
export function focusTarget(field) {
  const target =
    field.querySelector('input[type="radio"]:checked:not(:disabled)') ??
    field.querySelector('input:not([type="hidden"]):not(:disabled), select:not(:disabled), textarea:not(:disabled)');
  if (target && !target.closest('[hidden]')) return target;
  field.tabIndex = -1;
  return field;
}

export function focusField(field) {
  const target = focusTarget(field);
  target.focus({ preventScroll: true });
  const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  field.scrollIntoView({ block: 'center', behavior: smooth ? 'smooth' : 'auto' });
}

function render(field, message) {
  const text = field.querySelector('.field__error [data-error-text]');
  if (text) text.textContent = message;
  field.classList.toggle('is-invalid', Boolean(message));
  field.querySelectorAll(CONTROLS).forEach((control) => {
    if (message) control.setAttribute('aria-invalid', 'true');
    else control.removeAttribute('aria-invalid');
  });
}

/**
 * @param {HTMLFormElement} form
 * @param {object} options
 * @param {Record<string, (field: HTMLElement) => string>} [options.validators] extra checks returning an error key
 * @param {HTMLElement} [options.summary] error summary container (`[data-summary-list]` inside)
 * @param {(message: string) => void} [options.announce]
 */
export function createValidator(form, { validators = {}, summary, announce } = {}) {
  const used = new Set();
  const fields = () => [...form.querySelectorAll('[data-field]')].filter(isActive);

  const validate = (field) => {
    const key = check(field) || validators[field.dataset.field]?.(field) || '';
    const message = key ? messageFor(field, key) : '';
    render(field, message);
    return message;
  };

  const renderSummary = (invalid) => {
    if (!summary) return;
    const list = summary.querySelector('[data-summary-list]');
    list.replaceChildren(
      ...invalid.map(({ field, message }) => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${focusTarget(field).id || field.id}`;
        link.textContent = message;
        link.addEventListener('click', (event) => {
          event.preventDefault();
          focusField(field);
        });
        item.append(link);
        return item;
      })
    );
    summary.hidden = invalid.length === 0;
  };

  const refreshSummary = () => {
    if (!summary || summary.hidden) return;
    renderSummary(
      fields()
        .filter((f) => f.classList.contains('is-invalid'))
        .map((field) => ({ field, message: field.querySelector('[data-error-text]')?.textContent ?? '' }))
    );
  };

  const onEdit = (event) => {
    const field = event.target.closest?.('[data-field]');
    if (!field) return;
    used.add(field);
    if (field.classList.contains('is-invalid')) {
      validate(field);
      refreshSummary();
    }
  };

  form.addEventListener('input', onEdit);
  form.addEventListener('change', onEdit);
  form.addEventListener('focusout', (event) => {
    const field = event.target.closest?.('[data-field]');
    if (!field || field.contains(event.relatedTarget) || !used.has(field)) return;
    const wasInvalid = field.classList.contains('is-invalid');
    const message = validate(field);
    if (message && !wasInvalid) announce?.(message);
    refreshSummary();
  });

  return {
    /** Re-check one field by name (e.g. after a dependent field changed). */
    revalidate(name) {
      const field = form.querySelector(`[data-field="${name}"]`);
      if (field && isActive(field) && (used.has(field) || field.classList.contains('is-invalid'))) {
        validate(field);
        refreshSummary();
      }
    },
    /** Check everything; returns the invalid fields in document order. */
    validateAll() {
      const invalid = fields()
        .map((field) => ({ field, message: validate(field) }))
        .filter((entry) => entry.message);
      renderSummary(invalid);
      if (invalid.length) announce?.(plural(formMessages.summaryCount[lang], invalid.length, lang));
      return invalid;
    },
    reset() {
      used.clear();
      form.querySelectorAll('[data-field]').forEach((field) => render(field, ''));
      renderSummary([]);
    },
  };
}

