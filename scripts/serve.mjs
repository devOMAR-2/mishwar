/**
 * Minimal zero-dependency static server for /dist with pretty URLs and
 * language-aware 404s. Used by `npm run serve` and the dev watcher.
 *
 *   node scripts/serve.mjs [--port 4173] [--root dist]
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const rootArg = process.argv.indexOf('--root');
const ROOT = rootArg > -1 ? path.resolve(process.argv[rootArg + 1]) : path.resolve(import.meta.dirname, '..', 'dist');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json',
};

async function resolveFile(urlPath) {
  const safe = path.normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '');
  let file = path.join(ROOT, safe);
  if (!file.startsWith(ROOT)) return null;
  try {
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    await stat(file);
    return file;
  } catch {
    return null;
  }
}

/**
 * @param {object} options
 * @param {(html: string) => string} [options.transformHtml] hook used by the dev server to inject live reload
 * @param {(req, res) => boolean} [options.intercept] return true when the request was handled
 */
export function createStaticServer({ transformHtml = (h) => h, intercept } = {}) {
  return createServer(async (req, res) => {
    if (intercept?.(req, res)) return;

    const { pathname } = new URL(req.url, 'http://localhost');
    // Directory URLs without a trailing slash → redirect, so relative paths stay correct.
    if (!path.extname(pathname) && !pathname.endsWith('/')) {
      const dir = await resolveFile(pathname);
      if (dir) {
        res.writeHead(301, { Location: `${pathname}/` });
        return res.end();
      }
    }

    let file = await resolveFile(pathname);
    let status = 200;
    if (!file) {
      status = 404;
      file = await resolveFile(pathname.startsWith('/en/') ? '/en/404.html' : '/404.html');
    }
    if (!file) {
      res.writeHead(404).end('Not found');
      return;
    }

    const ext = path.extname(file);
    let body = await readFile(file);
    if (ext === '.html') body = transformHtml(body.toString());
    res.writeHead(status, {
      'Content-Type': TYPES[ext] ?? 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(body);
  });
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.argv[process.argv.indexOf('--port') + 1]) || 4173;
  createStaticServer().listen(port, () => console.log(`Serving dist → http://localhost:${port}`));
}
