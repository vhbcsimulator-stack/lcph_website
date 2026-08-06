import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { scrollToTop } from '../../utils/scroll';
import { ArrowRight, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/projects', label: 'Projects' },
  { to: '/amenities', label: 'Amenities' },
  { to: '/updates', label: 'Updates' },
  { to: '/contact', label: 'Contact Us' },
];

const LOGO_SRC =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDDn4QYY5RyP9HlFJxEx1F2XuHqbTxvsJfSxeklG8UGytMdWzFm0OCH0Cms3BMsBlTBl1r-FQ046MWLBvUIGXS5HleQc1zGOTQtV83aaEwt7F9woi_V3vBo8xISTbV8VCxYOR55NOlD-NLjLFHxtwLS94YXH72BXsyZJCFs2tphjbmwtarCxQmkykfRHuU4ohvJwXrqKzzzLwDyba8G2yIEyaECPSA9rfApQrk2dh7jTotxxsv5gi0JhFk7XswId2do5w';

const ISLAND_COLOR = 'var(--color-surface-container-lowest)';

// Header Geometry
const SHELL = 'mx-auto w-[min(100%-4rem,1920px)]';

const LOGO_COL_W = 176;
const CTA_COL_W = 216;


// Corner Geometry
const ISLAND_FILLET = 36;
const POD_FILLET = 20;


const POD_GAP = POD_FILLET + ISLAND_FILLET;


const ISLAND_INSET = {
  left: LOGO_COL_W + POD_GAP,
  right: CTA_COL_W + POD_GAP,
};


// Resting Header
const REST_STRIP_H = 28;
const REST_POD_H = 96;
const REST_POD_R = 28;
const REST_ISLAND_H = 112;
const REST_DIP_R = 40;


// Scrolled Header
const BAR_H = 80;
const ROW_PAD_REST = 'lg:px-8';


// Header Metrics
type HeaderMetrics = {
  
  rowH: string;

  pod: string;
  logo: string;
  ctaPadY: string;
  logoCol: string;
  ctaCol: string;
};

const EXPANDED: HeaderMetrics = {
  rowH: `${REST_ISLAND_H}px`,
  pod: `${REST_POD_H}px`,
  logo: '56px',
  ctaPadY: '12px',
  logoCol: `${LOGO_COL_W}px`,
  ctaCol: `${CTA_COL_W}px`,
};


const COMPACT: HeaderMetrics = {
  rowH: `${BAR_H}px`,
  pod: '68px',
  logo: '44px',
  ctaPadY: '10px',
  logoCol: `${LOGO_COL_W}px`,
  ctaCol: `${CTA_COL_W}px`,
};

const toCssVars = (m: HeaderMetrics): React.CSSProperties =>
  ({
    '--hdr-row-h': m.rowH,
    '--hdr-pod': m.pod,
    '--hdr-logo': m.logo,
    '--hdr-cta-y': m.ctaPadY,
    '--logo-col': m.logoCol,
    '--cta-col': m.ctaCol,
  }) as React.CSSProperties;


const EASE = 'transition-all duration-300 ease-out';


// Corner Fillet
const Fillet: React.FC<{
  side: 'left' | 'right';
  size: number;
  at: string;
  direction?: 'down' | 'up';
}> = ({ side, size, at, direction = 'down' }) => (
  <span
    aria-hidden
    className={`absolute ${side === 'left' ? 'right-full' : 'left-full'} ${EASE}`}
    style={{
      width: size,
      height: size,
      top: direction === 'down' ? at : `calc(${at} - ${size}px)`,
      background: `radial-gradient(circle at ${side === 'left' ? '0' : '100%'} ${
      direction === 'down' ? '100%' : '0'
    }, transparent ${size - 1}px, ${ISLAND_COLOR} ${size + 1}px)`
    }}
  />
);

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    const onScroll = () =>
      setScrolled((wasScrolled) => (wasScrolled ? window.scrollY > 8 : window.scrollY > 48));
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileMenuOpen]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };
  const isContactPage = location.pathname === '/contact' || location.pathname.startsWith('/contact/');

  /** Clicking a link for the page you are already on scrolls back to the top instead of re-navigating. */
  const handleNavClick = (to: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (location.pathname !== to) return;
    e.preventDefault();
    setMobileMenuOpen(false);
    scrollToTop();
  };

  
  const isHome = location.pathname === '/';
  const overlay = false;

  return (
    // z-[70] keeps the nav above in-page admin edit shells (z-20) and hover overlays (z-30).
    // --admin-offset is published by the admin toolbar so the nav sticks below it instead of under it.
    <header
      className={`sticky z-[70] w-full ${isHome ? '-mb-[72px] lg:-mb-[112px]' : ''}`}
      style={{ top: 'var(--admin-offset, 0px)', ...toCssVars(scrolled ? COMPACT : EXPANDED) }}
    >
      <div className="relative h-[72px] w-full lg:h-28">
        {/* Background Scrim */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 top-0 h-[180%] bg-gradient-to-b from-black/55 via-black/25 to-transparent transition-opacity duration-300 ${
            overlay ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {/* Header Shapes */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 hidden transition-[filter,opacity] duration-300 lg:block ${
            overlay ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            filter: scrolled
              ? 'drop-shadow(0 12px 30px rgba(13, 28, 47, 0.20))'
              : 'drop-shadow(0 8px 20px rgba(13, 28, 47, 0.15))',
          }}
        >
<div className="absolute inset-0">
<div
            className={`absolute inset-x-0 top-0 ${EASE}`}
            style={{ height: scrolled ? 20 : REST_STRIP_H, background: ISLAND_COLOR }}
          />
<div className={`relative h-full ${SHELL}`}>
<div
              className={`absolute left-0 top-0 ${EASE}`}
              style={{
                width: LOGO_COL_W,
                height: scrolled ? 68 : REST_POD_H,
                borderBottomLeftRadius: REST_POD_R,
                borderBottomRightRadius: REST_POD_R,
                background: ISLAND_COLOR,
              }}
            >
              <Fillet side="left" size={POD_FILLET} at={`${scrolled ? 20 : REST_STRIP_H}px`} />
              <Fillet side="right" size={POD_FILLET} at={`${scrolled ? 20 : REST_STRIP_H}px`} />
            </div>
<div
              className={`absolute top-0 ${EASE}`}
              style={{
                ...ISLAND_INSET,
                height: scrolled ? BAR_H : REST_ISLAND_H,
                borderBottomLeftRadius: REST_DIP_R,
                borderBottomRightRadius: REST_DIP_R,
                background: ISLAND_COLOR,
              }}
            >
              <Fillet side="left" size={ISLAND_FILLET} at={`${scrolled ? 20 : REST_STRIP_H}px`} />
              <Fillet side="right" size={ISLAND_FILLET} at={`${scrolled ? 20 : REST_STRIP_H}px`} />
            </div>
          </div>
          </div>
        </div>
<div
          className={`relative flex h-full w-full items-center justify-between px-margin-mobile transition-[padding,height,background-color] duration-300 ease-out lg:h-[var(--hdr-row-h)] lg:w-full lg:bg-transparent lg:shadow-none ${ROW_PAD_REST} ${
            overlay
              ? 'bg-transparent shadow-none'
              : `bg-surface-container-lowest ${scrolled ? 'shadow-[0_10px_28px_-12px_rgba(13,28,47,0.40)]' : 'shadow-[0_8px_22px_-12px_rgba(13,28,47,0.32)]'}`
          }`}
        >
<div
            className={`flex shrink-0 items-center justify-center lg:h-[var(--hdr-pod)] lg:w-[var(--logo-col)] lg:self-start ${EASE}`}
          >
            <Link
              to="/"
              onClick={handleNavClick('/')}
              aria-label="LCPH Realty Inc. â€” Home"
              className="group relative flex items-center rounded-lg outline-none transition-transform duration-300 hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
            >
              <img
                alt="LCPH Realty Inc. Logo"
                className={`relative h-11 w-auto object-contain lg:h-[var(--hdr-logo)] ${EASE} ${
                  overlay ? 'brightness-0 invert drop-shadow-md' : 'drop-shadow-sm'
                }`}
                src={LOGO_SRC}
              />
            </Link>
          </div>
<nav
            className="hidden min-w-0 flex-1 items-center justify-center gap-6 transition-[gap] duration-300 ease-out xl:gap-8 lg:flex"
          >
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={handleNavClick(item.to)}
                  aria-current={active ? 'page' : undefined}
                  className={`group relative whitespace-nowrap rounded font-headline-sm text-sm font-bold uppercase tracking-wide outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 ${
                    overlay
                      ? `text-white drop-shadow-sm focus-visible:ring-white/70 ${active ? '' : 'text-white/80 hover:text-white'}`
                      : `focus-visible:ring-primary/50 ${active ? 'text-primary' : 'text-on-surface hover:text-primary'}`
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={`absolute -bottom-1.5 left-0 h-0.5 w-full origin-left rounded-full transition-transform duration-300 ease-out ${
                      overlay ? 'bg-white' : 'bg-primary'
                    } ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
                  />
                </Link>
              );
            })}
          </nav>
          <div className={`hidden shrink-0 lg:block lg:w-[var(--cta-col)] ${EASE}`}>
            {!isContactPage && (
            <Link
              to="/contact"
              onClick={handleNavClick('/contact')}
              className={`group flex w-full items-center justify-center gap-2 rounded-lg px-6 py-[var(--hdr-cta-y)] font-label-lg text-label-lg uppercase tracking-wider shadow-sm outline-none hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 active:translate-y-0 ${EASE} ${
                overlay
                  ? 'bg-surface-container-lowest text-primary hover:bg-white focus-visible:ring-white/70 focus-visible:ring-offset-transparent'
                  : 'bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container focus-visible:ring-primary/50'
              }`}
            >
              Inquire Now
              <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`flex cursor-pointer items-center justify-center rounded-lg p-2 outline-none transition-colors duration-300 focus-visible:ring-2 lg:hidden ${
              overlay
                ? 'text-white drop-shadow hover:bg-white/10 focus-visible:ring-white/70'
                : 'text-on-surface hover:bg-primary/5 hover:text-primary focus-visible:ring-primary/50'
            }`}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
{mobileMenuOpen && (
        <>
          <div
            aria-hidden
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-x-0 bottom-0 -z-10 bg-black/30 backdrop-blur-sm lg:hidden"
            style={{ top: 'calc(72px + var(--admin-offset, 0px))' }}
          />
          <div className="animate-in slide-in-from-top space-y-sm border-b border-outline-variant/30 bg-surface-container-lowest px-margin-mobile py-sm shadow-lg duration-300 lg:hidden">
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={handleNavClick(item.to)}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 font-headline-sm text-headline-sm transition-colors duration-200 ${
                      active
                        ? 'bg-primary/8 text-primary'
                        : 'text-on-surface-variant hover:bg-primary/5 hover:text-primary'
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`h-5 w-0.5 rounded-full transition-colors ${
                        active ? 'bg-primary' : 'bg-transparent'
                      }`}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            {!isContactPage && (
            <div className="flex flex-col gap-sm border-t border-outline-variant/20 pt-sm">
              <Link
                to="/contact"
                onClick={handleNavClick('/contact')}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-center font-label-lg text-label-lg uppercase tracking-wider text-on-primary shadow-sm transition-colors hover:bg-primary-container hover:text-on-primary-container"
              >
                Inquire Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            )}
          </div>
        </>
      )}
    </header>
  );
};
