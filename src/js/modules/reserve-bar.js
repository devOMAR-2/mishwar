/**
 * Mobile booking bar: appears after the first screen has been scrolled,
 * steps aside when the footer (which has its own booking button) is visible.
 */
export default function reserveBar(bar) {
  const footer = document.querySelector('.site-footer');
  let footerVisible = false;

  const setVisible = (visible) => {
    bar.dataset.state = visible ? 'visible' : 'hidden';
    bar.inert = !visible;
  };

  const update = () => setVisible(window.scrollY > window.innerHeight * 0.6 && !footerVisible);

  if (footer && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      footerVisible = entry.isIntersecting;
      update();
    }).observe(footer);
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}
