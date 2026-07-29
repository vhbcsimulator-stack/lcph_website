import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-container-lowest full-width bottom-0 border-t border-outline-variant mt-auto">
      <div className="w-full px-margin-mobile md:px-margin-desktop py-xl grid grid-cols-1 md:grid-cols-4 gap-gutter max-w-[1280px] mx-auto">
        <div className="col-span-1 md:col-span-2">
          <img 
            alt="LCPH Realty Inc. Logo" 
            className="h-16 w-auto object-contain mb-sm" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDn4QYY5RyP9HlFJxEx1F2XuHqbTxvsJfSxeklG8UGytMdWzFm0OCH0Cms3BMsBlTBl1r-FQ046MWLBvUIGXS5HleQc1zGOTQtV83aaEwt7F9woi_V3vBo8xISTbV8VCxYOR55NOlD-NLjLFHxtwLS94YXH72BXsyZJCFs2tphjbmwtarCxQmkykfRHuU4ohvJwXrqKzzzLwDyba8G2yIEyaECPSA9rfApQrk2dh7jTotxxsv5gi0JhFk7XswId2do5w"
          />
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[448px]">
            Building communities where leisure meets luxury. A subsidiary of VHBC dedicated to premium real estate development in the Philippines.
          </p>
        </div>
        <div>
          <h4 className="font-label-lg text-label-lg text-on-surface mb-md font-bold">Links</h4>
          <ul className="space-y-sm">
            <li>
              <Link 
                to="/privacy-policy" 
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary hover:underline transition-all focus:ring-2 focus:ring-primary rounded"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link 
                to="/terms" 
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary hover:underline transition-all focus:ring-2 focus:ring-primary rounded"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link 
                to="/cookie-policy" 
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary hover:underline transition-all focus:ring-2 focus:ring-primary rounded"
              >
                Cookie Policy
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-label-lg text-label-lg text-on-surface mb-md font-bold">Company</h4>
          <ul className="space-y-sm">
            <li>
              <Link 
                to="/careers" 
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary hover:underline transition-all focus:ring-2 focus:ring-primary rounded"
              >
                Careers
              </Link>
            </li>
            <li>
              <Link 
                to="/contact" 
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary hover:underline transition-all focus:ring-2 focus:ring-primary rounded"
              >
                Contact Support
              </Link>
            </li>
          </ul>
        </div>
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
