import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { scrollToTop } from '../../utils/scroll';
import { useVisibility } from '../../hooks/useVisibility';
import { Hideable } from '../admin/Hideable';

const LINK_CLASS =
  'font-body-sm text-body-sm text-on-surface-variant hover:text-primary hover:underline transition-all focus:ring-2 focus:ring-primary rounded';

const LOGO_SRC =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDDn4QYY5RyP9HlFJxEx1F2XuHqbTxvsJfSxeklG8UGytMdWzFm0OCH0Cms3BMsBlTBl1r-FQ046MWLBvUIGXS5HleQc1zGOTQtV83aaEwt7F9woi_V3vBo8xISTbV8VCxYOR55NOlD-NLjLFHxtwLS94YXH72BXsyZJCFs2tphjbmwtarCxQmkykfRHuU4ohvJwXrqKzzzLwDyba8G2yIEyaECPSA9rfApQrk2dh7jTotxxsv5gi0JhFk7XswId2do5w';

const COMPANY_LINKS = [
  { to: '/careers', label: 'Careers' },
  { to: '/partner-with-us', label: 'Partner With Us' },
  { to: '/news', label: 'News' },
  { to: '/gallery', label: 'Gallery' },
];

const LEGAL_LINKS = [
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms of Service' },
  { to: '/cookie-policy', label: 'Cookie Policy' },
];

export const Footer: React.FC = () => {
  const location = useLocation();
  const { isAdmin, isPageHidden } = useVisibility();

  /* A hidden page keeps no footer link either, or the footer would advertise a 404. */
  const visible = (items: typeof COMPANY_LINKS) =>
    items.filter((item) => isAdmin || !isPageHidden(item.to));

  /** Clicking a link for the page you are already on scrolls back to the top instead of doing nothing. */
  const handleNavClick = (to: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (location.pathname !== to) return;
    e.preventDefault();
    scrollToTop({ immediate: true });
  };

  return (
    <footer className="bg-surface-container-lowest full-width bottom-0 border-t border-outline-variant mt-auto">
      <div className="w-full px-margin-mobile md:px-margin-desktop py-xl grid grid-cols-1 md:grid-cols-4 gap-gutter max-w-[1280px] mx-auto">
        <div className="col-span-1 md:col-span-2">
          <img alt="LCPH Realty Inc. Logo" className="h-16 w-auto object-contain mb-sm" src={LOGO_SRC} />
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[448px]">
            Building communities where leisure meets luxury. A subsidiary of VHBC dedicated to premium real estate
            development in the Philippines.
          </p>
        </div>

        <Hideable id="chrome.footer_company">
          <div>
            <h4 className="font-label-lg text-label-lg text-on-surface mb-md font-bold">Company</h4>
            <ul className="space-y-sm">
              {visible(COMPANY_LINKS).map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    title={isPageHidden(item.to) ? 'Hidden from the public site' : undefined}
                    className={`${LINK_CLASS} ${
                      isPageHidden(item.to) ? 'line-through decoration-amber-500 decoration-2 opacity-60' : ''
                    }`}
                    onClick={handleNavClick(item.to)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Hideable>

        <Hideable id="chrome.footer_legal">
          <div>
            <h4 className="font-label-lg text-label-lg text-on-surface mb-md font-bold">Legal</h4>
            <ul className="space-y-sm">
              {visible(LEGAL_LINKS).map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    title={isPageHidden(item.to) ? 'Hidden from the public site' : undefined}
                    className={`${LINK_CLASS} ${
                      isPageHidden(item.to) ? 'line-through decoration-amber-500 decoration-2 opacity-60' : ''
                    }`}
                    onClick={handleNavClick(item.to)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Hideable>
      </div>
      <div className="border-t border-outline-variant/30 py-md text-center">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          © {new Date().getFullYear()} LCPH Realty Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
export default Footer;
