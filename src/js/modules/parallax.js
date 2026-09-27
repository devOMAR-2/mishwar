/**
 * Gentle vertical parallax for `[data-parallax]` layers inside `el`.
 * Layers are over-sized in CSS (inset: -8% 0) so the drift never shows an edge.
 * Skipped entirely for reduced-motion users.
 */
const AMPLITUDE = 0.06; // fraction of the layer's height

export default function parallax(el) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const layers = [...el.querySelectorAll('[data-parallax]')];
  const visible = new Set();
  let frame = null;

  const update = () => {
    const vh = window.innerHeight;
    visible.forEach((layer) => {
      const rect = layer.parentElement.getBoundingClientRect();
      // -1 when the frame enters from the bottom, +1 when it leaves at the top.
      const progress = (vh - rect.top) / (vh + rect.height) * 2 - 1;
      layer.style.transform = `translate3d(0, ${(-progress * AMPLITUDE * 100).toFixed(2)}%, 0)`;
    });
    frame = null;
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    });
    schedule();
  });

  layers.forEach((layer) => observer.observe(layer));
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
}
