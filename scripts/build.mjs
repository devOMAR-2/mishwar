/**
 * Static site build.
 *
 *   src/templates  →  dist/**.html   (Arabic at /, English at /en/)
 *   src/scss       →  dist/assets/css/main.css
 *   src/js, src/data, src/i18n → dist/assets/*  (native ES modules, no bundler)
 *   src/assets     →  dist/assets/*
 *
 *   node scripts/build.mjs          production build
 *   node scripts/build.mjs --dev    expanded CSS + source maps
 *   node scripts/build.mjs --out x  build into another directory
 */
import { rm, mkdir, writeFile, cp, readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import * as sass from 'sass';
import sharp from 'sharp';

import { pages } from '../src/templates/pages/index.js';
import { layout } from '../src/templates/layout.js';
import { createContext } from '../src/templates/lib/context.js';
import { LANGS, fileFor, pathFor } from '../src/templates/lib/routes.js';
import { site } from '../src/data/site.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'src');
const outArg = process.argv.indexOf('--out');
const DIST = outArg > -1 ? path.resolve(process.argv[outArg + 1]) : path.join(ROOT, 'dist');
const DEV = process.argv.includes('--dev');

const hash = (content) => createHash('sha256').update(content).digest('hex').slice(0, 10);
const out = (...p) => path.join(DIST, ...p);

async function write(file, content) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, content);
}

/** Light HTML tidy: drop indentation and blank lines produced by nested templates. */
const tidy = (markup) =>
  markup
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n');

async function buildStyles() {
  const result = sass.compile(path.join(SRC, 'scss/main.scss'), {
    style: DEV ? 'expanded' : 'compressed',
    sourceMap: DEV,
    sourceMapIncludeSources: DEV,
  });
  let css = result.css;
  if (DEV && result.sourceMap) {
    await write(out('assets/css/main.css.map'), JSON.stringify(result.sourceMap));
    css += '\n/*# sourceMappingURL=main.css.map */';
  }
  await write(out('assets/css/main.css'), css);
  return `/assets/css/main.css?v=${hash(css)}`;
}

async function copyStatic() {
  const skipSource = (src) => !src.includes(`${path.sep}_source`);
  await cp(path.join(SRC, 'js'), out('assets/js'), { recursive: true });
  await cp(path.join(SRC, 'data'), out('assets/data'), { recursive: true });
  await cp(path.join(SRC, 'i18n'), out('assets/i18n'), { recursive: true });
  await cp(path.join(SRC, 'assets/images'), out('assets/images'), { recursive: true, filter: skipSource });
  await cp(path.join(SRC, 'assets/fonts'), out('assets/fonts'), { recursive: true });
  await cp(path.join(SRC, 'assets/icons'), out('assets/icons'), { recursive: true });
  await cp(path.join(SRC, 'assets/favicon.svg'), out('favicon.svg'));

  const entry = await readFile(path.join(SRC, 'js/main.js'));
  return `/assets/js/main.js?v=${hash(entry)}`;
}

async function buildPages(assets) {
  let count = 0;
  for (const lang of LANGS) {
    for (const page of pages) {
      const ctx = createContext({ lang, pageId: page.id });
      const markup = layout(ctx, page, { assets }).toString();
      await write(out(fileFor(page.id, lang)), tidy(markup));
      count++;
    }
  }
  return count;
}

async function buildSeoFiles() {
  const today = new Date().toISOString().slice(0, 10);
  const indexable = pages.filter((p) => p.id !== 'notFound');
  const urls = indexable
    .map((page) => {
      const alternates = LANGS.map(
        (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${site.url}${pathFor(page.id, l)}"/>`
      ).join('\n');
      return LANGS.map(
        (lang) => `  <url>\n    <loc>${site.url}${pathFor(page.id, lang)}</loc>\n    <lastmod>${today}</lastmod>\n${alternates}\n  </url>`
      ).join('\n');
    })
    .join('\n');

  await write(
    out('sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`
  );
  await write(out('robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
  await write(
    out('site.webmanifest'),
    JSON.stringify(
      {
        name: site.legalName.ar,
        short_name: site.name.ar,
        lang: 'ar',
        dir: 'rtl',
        start_url: '/',
        display: 'standalone',
        background_color: '#f4eee4',
        theme_color: '#a64b25',
        icons: [
          { src: '/assets/social/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/assets/social/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      null,
      2
    )
  );
}

/** Raster icons + Open Graph images, generated from source art. */
async function buildSocialImages() {
  const favicon = await readFile(path.join(SRC, 'assets/favicon.svg'));
  const icon = (size) => sharp(favicon, { density: 600 }).resize(size, size).png();
  await mkdir(out('assets/social'), { recursive: true });
  await icon(180).toFile(out('assets/social/apple-touch-icon.png'));
  await icon(192).toFile(out('assets/social/icon-192.png'));
  await icon(512).toFile(out('assets/social/icon-512.png'));
  await icon(48).toFile(out('assets/social/icon-48.png'));

  const heroVariants = (await readdir(path.join(SRC, 'assets/images')).catch(() => []))
    .filter((f) => /^hero-spread-\d+\.webp$/.test(f))
    .sort((a, b) => parseInt(b.match(/\d+/)) - parseInt(a.match(/\d+/)));
  const heroSource = heroVariants[0] && path.join(SRC, 'assets/images', heroVariants[0]);
  const ogArt = path.join(SRC, 'assets/og');
  for (const lang of LANGS) {
    const overlay = await readFile(path.join(ogArt, `og-${lang}.svg`)).catch(() => null);
    const base = heroSource
      ? sharp(heroSource).resize(1200, 630, { fit: 'cover' })
      : sharp({ create: { width: 1200, height: 630, channels: 3, background: '#2a1e17' } });
    const layers = overlay ? [{ input: overlay, top: 0, left: 0 }] : [];
    await base.composite(layers).jpeg({ quality: 82, mozjpeg: true }).toFile(out(`assets/social/og-${lang}.jpg`));
  }
}

const started = performance.now();
await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });

const [css, js] = await Promise.all([buildStyles(), copyStatic()]);
const count = await buildPages({ css, js });
await Promise.all([buildSeoFiles(), buildSocialImages()]);

console.log(`✓ built ${count} pages in ${Math.round(performance.now() - started)} ms${DEV ? ' (dev)' : ''}`);
