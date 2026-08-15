import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { staticRoute, metaForStatic } from './site.js';
import { applySeo, type SeoMeta } from './useSeo';

/**
 * Applies the metadata for every non-parameterised route in one place.
 *
 * Mounted *before* <Routes> so its effect runs first: pages with their own record to
 * describe (project, news article, update, 404) call `useSeo` and their effect, being
 * later in the tree, wins. Paths this component does not recognise are left alone
 * rather than reset to defaults, so the page owning them is never fighting a flicker.
 */
export function RouteSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!staticRoute(pathname)) return;
    applySeo(metaForStatic(pathname) as SeoMeta);
  }, [pathname]);

  return null;
}
