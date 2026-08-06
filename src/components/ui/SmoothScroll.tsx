import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { setSmoothScroller } from '../../utils/scroll';

/** Provides inertial wheel scrolling without altering native touch behavior. */
export const SmoothScroll = () => {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(pointer: fine)');

    if (reducedMotion.matches || !finePointer.matches) return;

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 1.5,
    });

    setSmoothScroller(lenis);

    let frameId = 0;
    const frame = (time: number) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(frame);
    };
    frameId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(frameId);
      setSmoothScroller(null);
      lenis.destroy();
    };
  }, []);

  return null;
};

