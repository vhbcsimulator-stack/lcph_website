import type Lenis from 'lenis';

/**
 * Lenis keeps its own scroll position and re-applies it every frame, so a raw window.scrollTo can
 * be undone by the next frame. SmoothScroll registers its instance here and every programmatic
 * scroll goes through it instead.
 */
let smoothScroller: Lenis | null = null;

export const setSmoothScroller = (instance: Lenis | null) => {
  smoothScroller = instance;
};

interface ScrollToTopOptions {
  /** Jump instead of animating — used on route changes, where the new page must start at the top. */
  immediate?: boolean;
}

/** Scrolls back to the top, respecting the reduced-motion preference. */
export const scrollToTop = ({ immediate = false }: ScrollToTopOptions = {}) => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const jump = immediate || reducedMotion;

  // A route change swaps the page out, so Lenis' cached document height is stale until this runs.
  smoothScroller?.resize();

  if (jump) {
    // Exactly what opening the page in a fresh tab does: no animation, no intermediate frames.
    // Both scroll positions are set so neither the browser nor Lenis can pull the page back down.
    window.scrollTo(0, 0);
    smoothScroller?.scrollTo(0, { immediate: true, force: true });
    return;
  }

  if (smoothScroller) {
    smoothScroller.scrollTo(0, { force: true });
    return;
  }

  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
};
