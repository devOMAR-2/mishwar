import { html, raw } from './html.js';
import { site } from '../../data/site.js';
import { locations } from '../../data/locations.js';
import { LANGS, DEFAULT_LANG } from './routes.js';

const LOCALES = { ar: 'ar_SA', en: 'en_US' };
const DAY_SCHEMA = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** <head> SEO block: title, description, canonical, hreflang, Open Graph, Twitter. */
export function seoHead(ctx, { title, description, noindex = false }) {
  const canonical = ctx.pageId === 'notFound' ? null : ctx.absoluteUrl(ctx.pageId);
  const ogImage = `${site.url}/assets/social/og-${ctx.lang}.jpg`;

  return html`
    <title>${title}</title>
    <meta name="description" content="${description}">
    ${noindex ? html`<meta name="robots" content="noindex">` : ''}
    ${canonical
      ? html`<link rel="canonical" href="${canonical}">
    ${LANGS.map((l) => html`<link rel="alternate" hreflang="${l}" href="${ctx.absoluteUrl(ctx.pageId, l)}">`)}
    <link rel="alternate" hreflang="x-default" href="${ctx.absoluteUrl(ctx.pageId, DEFAULT_LANG)}">`
      : ''}
    <meta property="og:type" content="${ctx.pageId === 'home' ? 'restaurant.restaurant' : 'website'}">
    <meta property="og:site_name" content="${ctx.t(site.name)}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    ${canonical ? html`<meta property="og:url" content="${canonical}">` : ''}
    <meta property="og:image" content="${ogImage}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:locale" content="${LOCALES[ctx.lang]}">
    <meta property="og:locale:alternate" content="${LOCALES[ctx.otherLang]}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@mishwar">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${ogImage}">`;
}

/** Serialise one or more JSON-LD graphs. `<` is escaped so content can't break out of the script tag. */
export function jsonLd(data) {
  if (!data) return '';
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': [].concat(data) }).replace(/</g, '\\u003c');
  return html`<script type="application/ld+json">${raw(json)}</script>`;
}

/** schema.org Restaurant nodes for each open branch. */
export function restaurantSchema(ctx) {
  const org = {
    '@type': 'Organization',
    '@id': `${site.url}/#organization`,
    name: ctx.t(site.name),
    alternateName: site.name[ctx.otherLang],
    url: ctx.absoluteUrl('home'),
    logo: `${site.url}/assets/social/icon-512.png`,
    foundingDate: String(site.founded),
    email: site.contact.email,
    telephone: site.contact.phone,
    sameAs: [],
  };

  const branches = locations
    .filter((l) => l.status === 'open')
    .map((loc) => ({
      '@type': 'Restaurant',
      '@id': `${site.url}/#${loc.id}`,
      name: ctx.t(loc.name),
      parentOrganization: { '@id': org['@id'] },
      url: ctx.absoluteUrl('locations'),
      image: `${site.url}/assets/images/${loc.image}-1200.webp`,
      telephone: loc.phone,
      servesCuisine: site.cuisine,
      priceRange: site.priceRange,
      currenciesAccepted: 'SAR',
      acceptsReservations: ctx.absoluteUrl('reservations'),
      hasMenu: ctx.absoluteUrl('menu'),
      address: {
        '@type': 'PostalAddress',
        streetAddress: ctx.t(loc.address).split(/[،,]\s*/).slice(0, 2).join(ctx.lang === 'ar' ? '، ' : ', '),
        addressLocality: ctx.lang === 'ar' ? 'الرياض' : 'Riyadh',
        addressRegion: ctx.lang === 'ar' ? 'منطقة الرياض' : 'Riyadh Province',
        postalCode: ctx.t(loc.address).match(/\d{5}/)?.[0],
        addressCountry: 'SA',
      },
      geo: { '@type': 'GeoCoordinates', latitude: loc.coordinates.lat, longitude: loc.coordinates.lng },
      openingHoursSpecification: loc.hours.map((h, day) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: DAY_SCHEMA[day],
        opens: h.open,
        closes: h.close,
      })),
    }));

  return [org, ...branches];
}
