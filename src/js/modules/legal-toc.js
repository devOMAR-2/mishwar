/**
 * Table of contents for long legal pages: marks the section currently being
 * read with aria-current so the sticky list doubles as a progress indicator.
 */
export default function legalToc(nav) {
  const links = new Map(
    [...nav.querySelectorAll('a[href^="#"]')].map((link) => [decodeURIComponent(link.hash.slice(1)), link])
  );
  const sections = [...links.keys()].map((id) => document.getElementById(id)).filter(Boolean);
  if (!sections.length || !('IntersectionObserver' in window)) return;

  const visible = new Set();

  const setCurrent = (id) => {
    links.forEach((link, key) => {
      if (key === id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  // The active section is the first one intersecting a band near the top of the viewport.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target)));
      const current = sections.find((s) => visible.has(s));
      if (current) setCurrent(current.id);
    },
    { rootMargin: '-20% 0px -65% 0px' }
  );

  sections.forEach((s) => observer.observe(s));
}
