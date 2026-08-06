import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTop } from '../../utils/scroll';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  // Back and forward would otherwise be handed their old offset by the browser, which lands the
  // page mid-content instead of at the top like every other navigation.
  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
  }, []);

  // A layout effect, so the new route is put at the top before the browser paints it — an animated
  // scroll here left short pages (the policy routes) parked mid-page when the jump was interrupted.
  useLayoutEffect(() => {
    scrollToTop({ immediate: true });
  }, [pathname]);

  return null;
};
