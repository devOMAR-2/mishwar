/**
 * Mobile navigation overlay built on <dialog>: showModal() provides the focus
 * trap, Escape handling and inert page behind it; we add the animated close
 * and keep the toggle's aria-expanded in sync.
 */
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function navOverlay(dialog) {
  const toggle = document.querySelector('[data-nav-open]');
  const closeBtn = dialog.querySelector('[data-nav-close]');
  if (!toggle || typeof dialog.showModal !== 'function') return;

  const open = () => {
    dialog.showModal();
    toggle.setAttribute('aria-expanded', 'true');
    document.documentElement.style.overflow = 'hidden';
  };

  const finishClose = () => {
    dialog.classList.remove('is-closing');
    dialog.close();
  };

  const close = () => {
    if (!dialog.open) return;
    if (prefersReducedMotion()) return finishClose();
    dialog.classList.add('is-closing');
    dialog.addEventListener('animationend', finishClose, { once: true });
  };

  dialog.addEventListener('close', () => {
    toggle.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = '';
    toggle.focus();
  });

  // Escape: run our animated close instead of the instant native one.
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    close();
  });

  toggle.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);

  // Close when a same-page link is chosen or when the layout grows past mobile.
  dialog.addEventListener('click', (event) => {
    if (event.target.closest('a')) finishClose();
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => e.matches && finishClose());
}
