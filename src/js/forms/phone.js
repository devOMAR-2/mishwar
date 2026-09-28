/**
 * Saudi mobile numbers: the field shows a fixed "+966" prefix and takes the
 * 9 national digits (5XXXXXXXX), displayed as "5X XXX XXXX". Pasted
 * "+966 5…", "00966 5…", "05…" and Arabic-Indic digits are all normalised.
 */
import { formatSaudiMobile } from '../utils/format.js';

const toWesternDigits = (value) =>
  String(value)
    .replace(/[٠-٩]/g, (d) => d.charCodeAt(0) - 0x0660)
    .replace(/[۰-۹]/g, (d) => d.charCodeAt(0) - 0x06f0);

const digitsOf = (value) => toWesternDigits(value).replace(/\D/g, '');

/** "+966 50 000 0000" | "0500000000" | "٥٠٠٠٠٠٠٠٠" → "500000000" */
export function normaliseSaudiMobile(value) {
  let digits = digitsOf(value);
  if (digits.length > 9) digits = digits.replace(/^(00)?966/, '');
  return digits.replace(/^0(?=5)/, '').slice(0, 9);
}

export const isSaudiMobile = (digits) => /^5\d{8}$/.test(digits);

export const toE164 = (digits) => `+966${digits}`;

export const displaySaudiMobile = (digits) => `+966 ${formatSaudiMobile(digits)}`;

/** Live formatting that keeps the caret next to the digit the visitor just typed. */
export function enhancePhoneInput(input) {
  const apply = () => {
    const { value } = input;
    const raw = digitsOf(value);
    const national = normaliseSaudiMobile(value);
    const formatted = formatSaudiMobile(national);
    if (formatted === value) return;

    const caret = input.selectionStart ?? value.length;
    const offset = national ? raw.indexOf(national) : 0;
    const digitsBeforeCaret = Math.min(Math.max(digitsOf(value.slice(0, caret)).length - offset, 0), national.length);

    input.value = formatted;
    if (document.activeElement !== input) return;
    let position = 0;
    for (let seen = 0; position < formatted.length && seen < digitsBeforeCaret; position++) {
      if (/\d/.test(formatted[position])) seen++;
    }
    input.setSelectionRange(position, position);
  };

  input.addEventListener('input', apply);
  apply();
}
