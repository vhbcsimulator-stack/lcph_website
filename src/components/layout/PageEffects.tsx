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

/** Adds a consistent, progressively enhanced reveal system to every route. */
export const PageEffects: React.FC<PageEffectsProps> = ({ children }) => {
  const location = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observed = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          const grid = target.parentElement?.classList.contains('grid') ? target.parentElement : null;
          const siblings = grid ? Array.from(grid.children).filter((child) => observed.has(child)) : [target];
          const visibleSiblings = siblings.filter((node) => {
            const bounds = node.getBoundingClientRect();
            return bounds.top < window.innerHeight * 0.86 && bounds.bottom > 0;
          });

          visibleSiblings.forEach((node, index) => {
            (node as HTMLElement).style.setProperty('--reveal-delay', `${Math.min(index, 5) * 45}ms`);
            node.classList.add('is-revealed');
            observer.unobserve(node);
          });

          if (!grid) {
            target.classList.add('is-revealed');
            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -14% 0px' },
    );

    const register = () => {
      const nodes = root.querySelectorAll(REVEAL_SELECTOR);
      nodes.forEach((node) => {
        if (observed.has(node) || node.closest('[data-page-motion="custom"]')) return;
        observed.add(node);
        node.classList.add('site-reveal');
        if (reducedMotion) node.classList.add('is-revealed');
        else {
          observer.observe(node);
        }
      });
    };

    register();
    const mutationObserver = new MutationObserver(register);
    mutationObserver.observe(root, { childList: true, subtree: true });

    return () => {
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
