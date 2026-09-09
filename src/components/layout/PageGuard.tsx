import React from 'react';
import { useLocation } from 'react-router-dom';
import { EyeOff } from 'lucide-react';
import { useVisibility } from '../../hooks/useVisibility';
import { VISIBILITY_PAGES } from '../../data/visibility';
import { MaintenancePage } from '../../pages/MaintenancePage';

const labelFor = (pathname: string) =>
  VISIBILITY_PAGES.find((page) => page.id === pathname)?.label ?? 'This page';

/**
 * Gates the routed body on page visibility.
 *
 * A hidden page shows the maintenance notice rather than a 404: hiding here is temporary, so a
 * visitor who followed a real link should be told to come back, not that the page never existed.
 * The trade-off is that the URL confirms the page exists — acceptable, since these are public
 * marketing pages being taken down briefly, not private ones.
 *
 * Admins still get the real page, behind a banner, so they can keep editing it while it is off
 * the public site.
 */
export const PageGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { isAdmin, isRouteHidden } = useVisibility();

  if (!isRouteHidden(location.pathname)) return <>{children}</>;

  if (!isAdmin) return <MaintenancePage />;

  return (
    <>
      <div className="flex items-center justify-center gap-2 border-b border-amber-500/40 bg-amber-500/15 px-4 py-2.5 text-center text-[12px] font-bold uppercase tracking-wider text-amber-700">
        <EyeOff className="h-3.5 w-3.5" />
        {labelFor(location.pathname)} is hidden from the public site
      </div>
      {children}
    </>
  );
};

export default PageGuard;
