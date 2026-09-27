/** Page ids → output paths. Arabic lives at the root, English under /en/. */

export const LANGS = ['ar', 'en'];
export const DEFAULT_LANG = 'ar';

export const routes = {
  home: '',
  menu: 'menu/',
  about: 'about/',
  locations: 'locations/',
  reservations: 'reservations/',
  contact: 'contact/',
  privacy: 'privacy/',
  notFound: '404.html',
};

export const pathFor = (id, lang) => `${lang === DEFAULT_LANG ? '/' : `/${lang}/`}${routes[id]}`;

/** Output file for a page, relative to /dist. */
export const fileFor = (id, lang) => {
  const base = lang === DEFAULT_LANG ? '' : `${lang}/`;
  const route = routes[id];
  return route.endsWith('.html') ? base + route : `${base}${route}index.html`;
};
