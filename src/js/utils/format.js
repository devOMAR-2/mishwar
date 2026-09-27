/** Locale-aware formatting shared by the build and the browser. */

export const CURRENCY = { ar: 'ر.س', en: 'SAR' };

/** Saudi menus print Western digits in both languages. */
export function formatPrice(amount, lang) {
  return lang === 'ar' ? `${amount} ${CURRENCY.ar}` : `${CURRENCY.en} ${amount}`;
}

/** "+966 5X XXX XXXX" grouping for a 9-digit Saudi mobile number. */
export function formatSaudiMobile(digits) {
  const d = digits.replace(/\D/g, '').slice(0, 9);
  return [d.slice(0, 2), d.slice(2, 5), d.slice(5, 9)].filter(Boolean).join(' ');
}

export function formatDate(isoDate, lang, options = {}) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
    ...options,
  }).format(new Date(Date.UTC(y, m - 1, d)));
}
