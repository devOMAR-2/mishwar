import { html } from './lib/html.js';
import { seoHead, jsonLd } from './lib/seo.js';
import { ui } from '../i18n/ui.js';
import { site } from '../data/site.js';
import { header } from './components/header.js';
import { footer } from './components/footer.js';
import { reserveBar } from './components/reserve-bar.js';

/** Fonts worth preloading per language (the first-paint display + text faces). */
const PRELOAD_FONTS = {
  ar: ['reem-kufi-arabic-400-700.woff2', 'plex-sans-arabic-arabic-400.woff2'],
  en: ['fraunces-latin-300-700.woff2', 'plex-sans-arabic-latin-400.woff2'],
};

/** Static imports of main.js, preloaded so the module graph resolves in one round trip. */
const MODULE_PRELOADS = ['/assets/js/core/reveal.js', '/assets/js/core/hours-today.js', '/assets/js/utils/hours.js'];

/**
 * Full HTML document shell shared by every page.
 * `page` is a page module (see src/templates/pages), `assets` holds cache-busted URLs.
 */
export function layout(ctx, page, { assets }) {
  const meta = page.meta(ctx);
  const title = ctx.pageId === 'home' ? meta.title : `${meta.title} | ${ctx.t(site.name)}`;

  return html`<!doctype html>
<html lang="${ctx.lang}" dir="${ctx.dir}" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <script>document.documentElement.classList.replace('no-js', 'js')</script>
  ${seoHead(ctx, { title, description: meta.description, noindex: meta.noindex })}
  <meta name="theme-color" content="#f4eee4">
  <meta name="format-detection" content="telephone=no">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/assets/social/icon-48.png" type="image/png" sizes="48x48">
  <link rel="apple-touch-icon" href="/assets/social/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  ${PRELOAD_FONTS[ctx.lang].map((f) => html`<link rel="preload" href="/assets/fonts/${f}" as="font" type="font/woff2" crossorigin>`)}
  ${meta.preloadImage ? html`<link rel="preload" as="image" imagesrcset="${meta.preloadImage.srcset}" imagesizes="${meta.preloadImage.sizes}" fetchpriority="high">` : ''}
  <link rel="stylesheet" href="${assets.css}">
  <script type="module" src="${assets.js}"></script>
  ${MODULE_PRELOADS.map((m) => html`<link rel="modulepreload" href="${m}">`)}
  ${jsonLd(page.jsonLd?.(ctx))}
</head>
<body class="page page--${ctx.pageId}" data-page="${ctx.pageId}">
  <a class="skip-link" href="#main">${ctx.t(ui.skipLink)}</a>
  ${header(ctx)}
  <main id="main" tabindex="-1">
    ${page.render(ctx)}
  </main>
  ${footer(ctx)}
  ${page.hideReserveBar ? '' : reserveBar(ctx)}
</body>
</html>
`;
}
