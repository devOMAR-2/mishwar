/**
 * Menu filtering: section chips (one at a time) plus dietary toggles (every
 * active toggle must match). Progressive enhancement — without JS the whole
 * menu is rendered and the bar is hidden by CSS.
 *
 * The chosen section is mirrored in the URL hash, so /menu/#desserts (or any
 * in-page link to a section) opens the menu filtered to that section.
 */
import { lang } from '../core/i18n.js';

const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const pluralRules = new Intl.PluralRules(lang);

export default function menuFilter(root) {
  const bar = root.querySelector('.menu-bar');
  const scroller = bar.querySelector('.menu-bar__scroller');
  const results = root.querySelector('[data-menu-results]');
  const status = root.querySelector('.menu-status');
  const statusText = root.querySelector('.menu-status__text');
  const empty = root.querySelector('[data-menu-empty]');
  const dietToggle = root.querySelector('.menu-bar__toggle');
  const dietCount = root.querySelector('[data-diet-count]');
  const clearButtons = [...root.querySelectorAll('[data-menu-clear]')];
  const categoryButtons = [...root.querySelectorAll('[data-category-filter]')];
  const dietButtons = [...root.querySelectorAll('[data-diet-filter]')];
  const sections = [...root.querySelectorAll('[data-menu-section]')];
  const copy = JSON.parse(root.dataset.copy);

  const items = [...root.querySelectorAll('[data-menu-item]')].map((el) => ({
    el,
    category: el.dataset.category,
    tags: new Set(el.dataset.tags.split(' ').filter(Boolean)),
  }));
  const categoryIds = new Set(sections.map((section) => section.id));

  const state = { category: 'all', diets: new Set() };
  let fading = null;
  let revealed = false;

  const matchesDiets = (item) => [...state.diets].every((diet) => item.tags.has(diet));
  const isVisible = (item) => (state.category === 'all' || item.category === state.category) && matchesDiets(item);

  const countLabel = (n) => {
    const form = copy.count[pluralRules.select(n)] ?? copy.count.other;
    return form.replace('{n}', n);
  };

  function statusMessage(visible) {
    const count = countLabel(visible);
    if (state.diets.size) return copy.status.filtered.replace('{count}', count);
    if (state.category !== 'all') {
      return copy.status.category.replace('{count}', count).replace('{category}', copy.categories[state.category]);
    }
    return copy.status.all.replace('{count}', count);
  }

  /** Controls, counts and the live status — updated instantly on every change. */
  function syncControls() {
    const dietMatches = items.filter(matchesDiets);
    const perCategory = (id) => (id === 'all' ? dietMatches : dietMatches.filter((item) => item.category === id)).length;

    categoryButtons.forEach((button) => {
      const id = button.dataset.categoryFilter;
      const count = perCategory(id);
      button.setAttribute('aria-pressed', String(id === state.category));
      button.toggleAttribute('data-empty', count === 0);
      button.querySelector('[data-chip-count]').textContent = count;
    });

    dietButtons.forEach((button) => button.setAttribute('aria-pressed', String(state.diets.has(button.dataset.dietFilter))));
    dietCount.textContent = state.diets.size;
    dietCount.hidden = state.diets.size === 0;

    const filtered = state.category !== 'all' || state.diets.size > 0;
    clearButtons.forEach((button) => {
      if (button.closest('.menu-status')) button.hidden = !filtered;
    });
    statusText.textContent = statusMessage(items.filter(isVisible).length);
  }

  /** Show/hide dishes, then any group or section left without dishes. */
  function renderResults() {
    let visible = 0;
    items.forEach((item) => {
      const show = isVisible(item);
      item.el.hidden = !show;
      if (show) visible += 1;
    });

    sections.forEach((section) => {
      let sectionCount = 0;
      section.querySelectorAll('[data-menu-group]').forEach((group) => {
        const count = group.querySelectorAll('[data-menu-item]:not([hidden])').length;
        group.hidden = count === 0;
        sectionCount += count;
      });
      section.hidden = sectionCount === 0;
      section.querySelector('[data-section-count]').textContent = countLabel(sectionCount);
    });

    empty.hidden = visible > 0;
  }

  function writeHash() {
    const url = state.category === 'all' ? location.pathname + location.search : `#${state.category}`;
    history.replaceState(history.state, '', url);
  }

  /**
   * Bring the top of the results up under the sticky bar. The header tucks
   * away while scrolling down and returns scrolling up, so it only counts
   * towards the offset when we're heading up.
   */
  function scrollToResults() {
    const header = document.querySelector('.site-header');
    const below = status.getBoundingClientRect().top + window.scrollY - bar.offsetHeight;
    const top = below > window.scrollY ? below : below - (header?.offsetHeight ?? 0);
    if (Math.abs(window.scrollY - top) > 1) {
      window.scrollTo({ top, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    }
  }

  /** Keep the pressed chip in view inside the horizontal scroller. */
  function revealChip(button) {
    const view = scroller.getBoundingClientRect();
    const chip = button.getBoundingClientRect();
    const margin = 32;
    const delta = chip.left < view.left + margin ? chip.left - view.left - margin : chip.right > view.right - margin ? chip.right - view.right + margin : 0;
    if (delta) scroller.scrollBy({ left: delta, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  }

  /** Reveal-on-scroll would fight the filter transitions, so settle it once. */
  function settleReveals() {
    if (revealed) return;
    revealed = true;
    results.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-inview'));
  }

  function update({ animate = true } = {}) {
    syncControls();
    const commit = () => {
      renderResults();
      scrollToResults();
    };

    if (!animate || reducedMotion.matches || !results.animate) {
      commit();
      return;
    }

    settleReveals();
    // A change during the fade-out is picked up when the fade completes.
    if (fading) return;
    fading = results.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateY(0.5rem)' }], {
      duration: 160,
      easing: 'ease-in',
      fill: 'forwards',
    });
    fading.onfinish = () => {
      commit();
      fading.cancel();
      fading = null;
      [...sections, empty]
        .filter((el) => !el.hidden)
        .slice(0, 3)
        .forEach((el, i) =>
          el.animate([{ opacity: 0, transform: 'translateY(1rem)' }, { opacity: 1, transform: 'none' }], {
            duration: 520,
            delay: i * 80,
            easing: EASE_OUT,
            fill: 'backwards',
          })
        );
    };
  }

  function setCategory(id) {
    state.category = categoryIds.has(id) ? id : 'all';
    writeHash();
    update();
  }

  categoryButtons.forEach((button) =>
    button.addEventListener('click', () => {
      setCategory(button.dataset.categoryFilter);
      revealChip(button);
    })
  );

  dietButtons.forEach((button) =>
    button.addEventListener('click', () => {
      const diet = button.dataset.dietFilter;
      if (!state.diets.delete(diet)) state.diets.add(diet);
      update();
    })
  );

  // Give keyboard and screen-reader users a landing point when the control they
  // used goes away (empty-state button) or points elsewhere (in-page links).
  const focusStatus = () => {
    statusText.tabIndex = -1;
    statusText.focus({ preventScroll: true });
  };

  clearButtons.forEach((button) =>
    button.addEventListener('click', () => {
      state.diets.clear();
      state.category = 'all';
      writeHash();
      update();
      focusStatus();
    })
  );

  dietToggle.addEventListener('click', () => {
    const open = dietToggle.getAttribute('aria-expanded') !== 'true';
    dietToggle.setAttribute('aria-expanded', String(open));
    bar.toggleAttribute('data-diet-open', open);
  });

  // In-page links to a section (hero index, kitchen notes) filter instead of jumping.
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    const id = link?.getAttribute('href').slice(1);
    if (!id || !categoryIds.has(id)) return;
    event.preventDefault();
    setCategory(id);
    focusStatus();
  });

  window.addEventListener('hashchange', () => {
    const id = location.hash.slice(1);
    if (!id || categoryIds.has(id)) setCategory(id);
  });

  // Expose the bar height for sticky offsets and anchor scroll margins.
  const measure = () => root.style.setProperty('--menu-bar-h', `${bar.offsetHeight}px`);
  new ResizeObserver(measure).observe(bar);
  measure();

  // Soft shadow once the bar is pinned under the header.
  let ticking = false;
  const checkStuck = () => {
    const top = parseFloat(getComputedStyle(bar).insetBlockStart) || 0;
    bar.toggleAttribute('data-stuck', bar.getBoundingClientRect().top <= top + 0.5 && window.scrollY > 0);
    ticking = false;
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(checkStuck);
        ticking = true;
      }
    },
    { passive: true }
  );
  checkStuck();

  // Deep link: /menu/#desserts opens straight onto that section.
  const initial = location.hash.slice(1);
  if (categoryIds.has(initial)) {
    state.category = initial;
    update({ animate: false });
  }
}
