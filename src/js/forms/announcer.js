/**
 * Polite screen-reader announcements through a visually hidden live region
 * (`[data-announcer]`, rendered by the form template).
 */
export function createAnnouncer(region) {
  let timer;
  return (message) => {
    if (!region) return;
    clearTimeout(timer);
    region.textContent = '';
    // A short gap makes repeated identical messages announce again.
    timer = setTimeout(() => {
      region.textContent = message;
    }, 60);
  };
}
