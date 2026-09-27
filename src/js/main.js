/**
 * Mishwar — client entry.
 *
 * Global behaviour boots immediately; everything else is declared in the HTML
 * with `data-module="name"` and lazy-loaded from ./modules/name.js, so each
 * page only downloads the code it actually uses.
 */
import { initReveal } from './core/reveal.js';
import { markToday } from './core/hours-today.js';

async function mountModules(root = document) {
  const groups = new Map();
  root.querySelectorAll('[data-module]').forEach((el) => {
    el.dataset.module.split(/\s+/).forEach((name) => {
      if (!groups.has(name)) groups.set(name, []);
      groups.get(name).push(el);
    });
  });

  await Promise.all(
    [...groups].map(async ([name, elements]) => {
      try {
        const { default: mount } = await import(`./modules/${name}.js`);
        elements.forEach((el) => mount(el));
      } catch (error) {
        console.error(`[mishwar] module "${name}" failed to load`, error);
      }
    })
  );
}

initReveal();
markToday();
mountModules();
