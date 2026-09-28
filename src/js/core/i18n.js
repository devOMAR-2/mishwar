/** Client-side localisation helpers. The document language is set by the build. */

export const lang = document.documentElement.lang === 'en' ? 'en' : 'ar';

/**
 * Resolve a `{ ar, en }` pair and fill `{placeholders}`.
 * t({ ar: 'يُغلق {time}', en: 'Closes {time}' }, { time: '1:00 AM' })
 */
export function t(pair, vars = {}) {
  const text = typeof pair === 'string' ? pair : pair?.[lang] ?? '';
  return text.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? '');
}
