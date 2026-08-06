import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface PageEffectsProps {
  children: React.ReactNode;
}

const REVEAL_SELECTOR = [
  'section',
  '.container-custom > :not(.grid)',
  '[data-reveal]',
  '.grid > article',
  '.grid > a',
  '.grid > div',
].join(',');

/** Gap between one element in a cascade and the next, and how many gaps it can grow to. */
const STEP = 60;
const MAX_STEPS = 6;

/** Adds a consistent, progressively enhanced reveal system to every route. */
export const PageEffects: React.FC<PageEffectsProps> = ({ children }) => {
  const location = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    /** Every node the reveal class has been put on, so registration never runs twice. */
    const registered = new WeakSet<Element>();
    /** Registered nodes still waiting to be revealed — iterable, unlike the WeakSet. */
    const pending = new Set<HTMLElement>();

    /** True when the page cannot be scrolled any further down. */
    const atScrollLimit = () =>
      window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;

    const onScreen = (node: HTMLElement) => {
      const bounds = node.getBoundingClientRect();
      if (bounds.bottom <= 0) return false;
      // An element normally has to come 14% into the viewport, matching the observer. Once there
      // is no scrolling left to do, anything visible at all counts — nothing is going to move it
      // any further up, so waiting would leave it hidden for good.
      return bounds.top < window.innerHeight * (atScrollLimit() ? 1 : 0.86);
    };

    const reveal = (node: HTMLElement, delay: number) => {
      if (!pending.delete(node)) return;
      observer.unobserve(node);
      node.style.setProperty('--reveal-delay', `${delay}ms`);
      node.classList.add('is-revealed');
    };

    /** Grid children come in together, so a row animates as one staggered run. */
    const revealFrom = (target: HTMLElement, base = 0) => {
      const parent = target.parentElement;
      const grid = parent?.classList.contains('grid') ? parent : null;
      if (grid) {
        Array.from(grid.children)
          .filter((child): child is HTMLElement => pending.has(child as HTMLElement) && onScreen(child as HTMLElement))
          .forEach((child, index) => reveal(child, base + STEP * Math.min(index, MAX_STEPS)));
      }
      reveal(target, base);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) revealFrom(entry.target as HTMLElement);
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -14% 0px' },
    );

    /**
     * The observer alone is not enough. Its threshold and negative bottom margin mean a node can
     * sit on screen without ever crossing a boundary — which happens on short routes such as the
     * policy pages, where a route change clamps the scroll position and there is then too little
     * page left to scroll and trigger the observer. Those nodes stayed at opacity 0 forever.
     * So anything actually visible is revealed directly, whatever the observer thinks.
     */
    let sweepFrame = 0;
    const sweep = () => {
      sweepFrame = 0;
      // pending is in document order, so whatever is already on screen cascades down the page
      // instead of appearing all at once — this is the whole animation on short routes such as
      // the policy pages, where nothing is ever scrolled into view.
      Array.from(pending)
        .filter(onScreen)
        .forEach((node, index) => revealFrom(node, STEP * Math.min(index, MAX_STEPS)));
    };
    const queueSweep = () => {
      if (sweepFrame) return;
      sweepFrame = requestAnimationFrame(sweep);
    };

    const register = () => {
      root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((node) => {
        if (registered.has(node) || node.closest('[data-page-motion="custom"]')) return;
        registered.add(node);
        node.classList.add('site-reveal');
        if (reducedMotion) {
          node.classList.add('is-revealed');
          return;
        }
        pending.add(node);
        observer.observe(node);
      });
      queueSweep();
    };

    register();
    const mutationObserver = new MutationObserver(register);
    mutationObserver.observe(root, { childList: true, subtree: true });

    // Scrolling covers the smooth scroll-to-top that runs on every route change; resize covers
    // late layout shifts (fonts, images) that move a node into view without any scrolling.
    window.addEventListener('scroll', queueSweep, { passive: true });
    window.addEventListener('resize', queueSweep);

    return () => {
      window.removeEventListener('scroll', queueSweep);
      window.removeEventListener('resize', queueSweep);
      if (sweepFrame) cancelAnimationFrame(sweepFrame);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname]);

  return (
    <div ref={rootRef} className="site-page-motion" key={location.pathname}>
      {children}
    </div>
  );
};
