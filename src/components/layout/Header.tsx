import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-surface/95 docked full-width top-0 sticky border-b border-outline-variant/30 backdrop-blur-md shadow-sm z-50">
      <div className="flex justify-between items-center w-full px-margin-desktop py-base max-w-[1280px] mx-auto min-h-[72px]">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-all duration-200">
          <img 
            alt="LCPH Realty Inc. Logo" 
            className="h-12 w-auto object-contain" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDn4QYY5RyP9HlFJxEx1F2XuHqbTxvsJfSxeklG8UGytMdWzFm0OCH0Cms3BMsBlTBl1r-FQ046MWLBvUIGXS5HleQc1zGOTQtV83aaEwt7F9woi_V3vBo8xISTbV8VCxYOR55NOlD-NLjLFHxtwLS94YXH72BXsyZJCFs2tphjbmwtarCxQmkykfRHuU4ohvJwXrqKzzzLwDyba8G2yIEyaECPSA9rfApQrk2dh7jTotxxsv5gi0JhFk7XswId2do5w"
          />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex gap-md items-center">
          <Link 
            to="/" 
            className={`${
              isActive('/') 
                ? 'font-headline-sm text-headline-sm text-primary border-b-2 border-primary pb-1 scale-95 duration-100' 
                : 'font-headline-sm text-headline-sm text-on-surface-variant hover:text-primary transition-colors hover:opacity-80 duration-200'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={`${
              isActive('/about') 
                ? 'font-headline-sm text-headline-sm text-primary border-b-2 border-primary pb-1 scale-95 duration-100' 
                : 'font-headline-sm text-headline-sm text-on-surface-variant hover:text-primary transition-colors hover:opacity-80 duration-200'
            }`}
          >
            About Us
          </Link>
          <Link 
            to="/projects" 
            className={`${
              isActive('/projects') 
                ? 'font-headline-sm text-headline-sm text-primary border-b-2 border-primary pb-1 scale-95 duration-100' 
                : 'font-headline-sm text-headline-sm text-on-surface-variant hover:text-primary transition-colors hover:opacity-80 duration-200'
            }`}
          >
            Projects
          </Link>

          <Link 
            to="/amenities" 
            className={`${
              isActive('/amenities') 
                ? 'font-headline-sm text-headline-sm text-primary border-b-2 border-primary pb-1 scale-95 duration-100' 
                : 'font-headline-sm text-headline-sm text-on-surface-variant hover:text-primary transition-colors hover:opacity-80 duration-200'
            }`}
          >
            Amenities
          </Link>
          <Link 
            to="/updates" 
            className={`${
              isActive('/updates') 
                ? 'font-headline-sm text-headline-sm text-primary border-b-2 border-primary pb-1 scale-95 duration-100' 
                : 'font-headline-sm text-headline-sm text-on-surface-variant hover:text-primary transition-colors hover:opacity-80 duration-200'
            }`}
          >
            Updates
          </Link>
          <Link 
            to="/contact" 
            className={`${
              isActive('/contact') 
                ? 'font-headline-sm text-headline-sm text-primary border-b-2 border-primary pb-1 scale-95 duration-100' 
                : 'font-headline-sm text-headline-sm text-on-surface-variant hover:text-primary transition-colors hover:opacity-80 duration-200'
            }`}
          >
            Contact Us
          </Link>
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Link 
            to="/contact"
            className="inline-flex items-center justify-center bg-primary text-on-primary font-label-lg text-label-lg px-6 py-3 rounded hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm cursor-pointer"
          >
            Inquire Now
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-on-surface p-2 cursor-pointer flex items-center justify-center"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface border-b border-outline-variant/30 px-margin-mobile py-sm space-y-sm animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col gap-sm">
            <Link to="/" className="font-headline-sm text-headline-sm text-on-surface-variant py-1">Home</Link>
            <Link to="/about" className="font-headline-sm text-headline-sm text-on-surface-variant py-1">About Us</Link>
            <Link to="/projects" className="font-headline-sm text-headline-sm text-on-surface-variant py-1">Projects</Link>
            <Link to="/amenities" className="font-headline-sm text-headline-sm text-on-surface-variant py-1">Amenities</Link>
            <Link to="/updates" className="font-headline-sm text-headline-sm text-on-surface-variant py-1">Updates</Link>
            <Link to="/contact" className="font-headline-sm text-headline-sm text-on-surface-variant py-1">Contact Us</Link>
          </nav>
          <div className="pt-sm border-t border-outline-variant/20 flex flex-col gap-sm">
            <Link 
              to="/contact"
              className="w-full text-center py-3 bg-primary text-on-primary font-label-lg text-label-lg rounded-lg shadow-sm"
            >
              Inquire Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
