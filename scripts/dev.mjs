/**
 * Development workflow: build, serve, rebuild on change, live-reload the browser.
 *
 *   npm run dev   →  http://localhost:5173
 *
 * Each rebuild runs in a fresh child process so edited template/data modules
 * are re-imported (Node caches ES modules for the lifetime of a process).
 */
import { spawn } from 'node:child_process';
import { watch } from 'node:fs';
import path from 'node:path';
import { createStaticServer } from './serve.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const PORT = Number(process.env.PORT) || 5173;
const clients = new Set();

const RELOAD_SNIPPET = `<script type="module">new EventSource('/__reload').onmessage = () => location.reload();</script>`;

function build() {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [path.join(ROOT, 'scripts/build.mjs'), '--dev'], { stdio: 'inherit' });
    child.on('exit', (code) => resolve(code === 0));
  });
}

const server = createStaticServer({
  caching: false,
  transformHtml: (html) => html.replace('</body>', `${RELOAD_SNIPPET}</body>`),
  intercept(req, res) {
    if (req.url !== '/__reload') return false;
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
    res.write('\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return true;
  },
});

let timer;
let building = false;
let queued = false;

async function rebuild() {
  if (building) {
    queued = true;
    return;
  }
  building = true;
  const ok = await build();
  building = false;
  if (ok) clients.forEach((res) => res.write('data: reload\n\n'));
  if (queued) {
    queued = false;
    rebuild();
  }
}

await build();
server.listen(PORT, () => console.log(`\n  Mishwar dev server → http://localhost:${PORT}\n`));

watch(path.join(ROOT, 'src'), { recursive: true }, (_event, file) => {
  if (!file || file.includes('_source')) return;
  clearTimeout(timer);
  timer = setTimeout(rebuild, 120);
});
