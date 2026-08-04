/** Scrolls the window back to the top, respecting the reduced-motion preference. */
export const scrollToTop = () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: reducedMotion ? 'auto' : 'smooth',
  });
};
