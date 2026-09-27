/**
 * Character counter for a textarea with maxlength. The visible count updates
 * on every keystroke; screen readers only hear about it near the limit.
 */
import { formMessages, plural } from './messages.js';
import { lang, t } from '../core/i18n.js';

const WARN_AT = 20;

export function enhanceCounter(textarea, output, announce) {
  const max = textarea.maxLength;
  let lastRemaining = max;

  const update = () => {
    const remaining = max - textarea.value.length;
    const near = remaining <= WARN_AT;
    output.textContent = near
      ? plural(formMessages.counterNear[lang], remaining, lang)
      : t(formMessages.counter, { count: textarea.value.length, max });
    output.classList.toggle('is-near', near);
    const crossed = (mark) => lastRemaining > mark && remaining <= mark;
    if (crossed(WARN_AT) || crossed(0)) announce?.(output.textContent);
    lastRemaining = remaining;
  };

  textarea.addEventListener('input', update);
  update();
  return { update };
}
