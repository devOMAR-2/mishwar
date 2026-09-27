import { pathFor, LANGS } from './routes.js';
import { formatPrice } from '../../js/utils/format.js';
import { site } from '../../data/site.js';

/**
 * Per-page render context: language, direction and localisation helpers.
 * Every template receives it as its first argument.
 */
export function createContext({ lang, pageId }) {
  const otherLang = LANGS.find((l) => l !== lang);
  return {
    lang,
    otherLang,
    pageId,
    dir: lang === 'ar' ? 'rtl' : 'ltr',
    /** Pick the current language from a `{ ar, en }` pair (strings pass through). */
    t: (value) => (value && typeof value === 'object' ? value[lang] : value ?? ''),
    url: (id, l = lang) => pathFor(id, l),
    absoluteUrl: (id, l = lang) => site.url + pathFor(id, l),
    price: (amount) => formatPrice(amount, lang),
  };
}
