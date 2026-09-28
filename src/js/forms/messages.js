/**
 * Generic, bilingual form copy shared by the build (templates) and the
 * browser (validation). Field-specific messages live with each page's content
 * and override these through `data-error-*` attributes on the field.
 */

export const formMessages = {
  optional: { ar: 'اختياري', en: 'Optional' },
  summaryTitle: { ar: 'باقي كم شغلة قبل الإرسال:', en: 'A few things need your attention:' },
  summaryCount: {
    ar: { one: 'فيه حقل واحد يحتاج تعديل.', two: 'فيه حقلين تحتاج تعديل.', few: 'فيه {n} حقول تحتاج تعديل.', other: 'فيه {n} حقل تحتاج تعديل.' },
    en: { one: '1 field needs your attention.', other: '{n} fields need your attention.' },
  },
  sending: { ar: 'جاري الإرسال…', en: 'Sending…' },
  counter: { ar: '{count} من {max}', en: '{count} / {max}' },
  counterNear: {
    ar: { one: 'باقي حرف واحد', two: 'باقي حرفين', few: 'باقي {n} أحرف', other: 'باقي {n} حرف' },
    en: { one: '1 character left', other: '{n} characters left' },
  },
  errors: {
    required: { ar: 'هذا الحقل مطلوب.', en: 'This field is required.' },
    email: { ar: 'اكتب بريد إلكتروني صحيح، مثل ⁦name@mail.example⁩.', en: 'Enter a valid email address, like name@mail.example.' },
    phone: {
      ar: 'اكتب رقم جوال سعودي من 9 أرقام يبدأ بـ 5، مثل ⁦50 000 0000⁩.',
      en: 'Enter a Saudi mobile number: 9 digits starting with 5, like 50 000 0000.',
    },
    tooShort: { ar: 'اكتب {min} أحرف على الأقل.', en: 'Enter at least {min} characters.' },
    tooLong: { ar: 'الحد الأقصى {max} حرف.', en: 'Use {max} characters or fewer.' },
    range: { ar: 'اختر رقم من {min} إلى {max}.', en: 'Choose a number from {min} to {max}.' },
  },
};

/** Fill `{placeholders}` in a string. */
export const fill = (text, vars = {}) => String(text).replace(/\{(\w+)\}/g, (match, key) => (key in vars ? vars[key] : match));

/**
 * Pick the right plural form for `n` using CLDR categories
 * (Arabic distinguishes one / two / few / many / other).
 * `forms` is `{ one, two?, few?, many?, other }` for a single language.
 */
export function plural(forms, n, lang) {
  const category = new Intl.PluralRules(lang).select(n);
  return fill(forms[category] ?? forms.other, { n });
}
