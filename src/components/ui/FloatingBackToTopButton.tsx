import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { scrollToTop } from '../../utils/scroll';

const SHOW_AFTER_PX = 400;

/** Public-site shortcut that appears once the visitor has moved beyond the top of the page. */
export function FloatingBackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setIsVisible(window.scrollY > SHOW_AFTER_PX);

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

  return (
    <button
      type="button"
      onClick={() => scrollToTop()}
      aria-label="Back to top"
      title="Back to top"
      className={`cursor-pointer group fixed bottom-5 right-5 z-[60] inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary shadow-[0_8px_24px_rgba(0,67,33,0.3)] transition-[opacity,transform,background-color,box-shadow] duration-200 hover:-translate-y-1 hover:bg-primary/90 hover:shadow-[0_12px_30px_rgba(0,67,33,0.38)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 motion-reduce:transform-none sm:bottom-7 sm:right-7 ${
        isVisible ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
      tabIndex={isVisible ? 0 : -1}
    >
      <ArrowUp
        aria-hidden="true"
        className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 motion-reduce:transform-none"
      />
    </button>
  );
}

export default FloatingBackToTopButton;
