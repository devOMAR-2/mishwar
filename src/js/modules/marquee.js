/**
 * Pause/play control for the dish-name marquee (WCAG 2.2.2 — moving content
 * must be pausable). Hover pausing is handled in CSS.
 */
export default function marquee(el) {
  const toggle = el.querySelector('.marquee__toggle');
  const label = toggle?.querySelector('.visually-hidden');
  if (!toggle || !label) return;

  toggle.addEventListener('click', () => {
    const paused = toggle.getAttribute('aria-pressed') !== 'true';
    toggle.setAttribute('aria-pressed', String(paused));
    el.toggleAttribute('data-paused', paused);
    label.textContent = paused ? toggle.dataset.labelPlay : toggle.dataset.labelPause;
  });
}
