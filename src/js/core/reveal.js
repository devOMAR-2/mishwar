/**
 * Scroll-triggered reveals for `[data-reveal]`.
 * Children of `[data-reveal-stagger]` get incremental delays.
 * Styles live in scss/base/_motion.scss and are disabled for reduced motion.
 */
export function initReveal() {
  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;

  document.querySelectorAll('[data-reveal-stagger]').forEach((group) => {
    const step = Number(group.dataset.revealStagger) || 0.08;
    group.querySelectorAll(':scope > [data-reveal], :scope > * > [data-reveal]').forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${(i * step).toFixed(2)}s`);
    });
  });

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-inview'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-inview');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
  );

  targets.forEach((el) => observer.observe(el));
}
