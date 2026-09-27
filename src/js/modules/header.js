/**
 * Sticky header: gains a surface once the page scrolls, tucks away while
 * scrolling down and returns on the slightest scroll up.
 */
export default function header(el) {
  const SOLID_AFTER = 8;
  const HIDE_AFTER = 320;
  const TOLERANCE = 6;
  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    el.toggleAttribute('data-scrolled', y > SOLID_AFTER);

    const delta = y - lastY;
    if (Math.abs(delta) > TOLERANCE) {
      const hide = delta > 0 && y > HIDE_AFTER && !el.contains(document.activeElement);
      el.toggleAttribute('data-hidden', hide);
      lastY = y;
    }
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );

  // Keyboard users tabbing into a hidden header should always see it.
  el.addEventListener('focusin', () => el.removeAttribute('data-hidden'));
  update();
}
