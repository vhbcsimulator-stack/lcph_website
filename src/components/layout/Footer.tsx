import React from 'react';
import { Link } from 'react-router-dom';
import { EditableText } from '../admin/EditableText';
import { EditableImage } from '../admin/EditableImage';

const LINK_CLASS =
  'font-body-sm text-body-sm text-on-surface-variant hover:text-primary hover:underline transition-all focus:ring-2 focus:ring-primary rounded';

const DEFAULT_LOGO =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDDn4QYY5RyP9HlFJxEx1F2XuHqbTxvsJfSxeklG8UGytMdWzFm0OCH0Cms3BMsBlTBl1r-FQ046MWLBvUIGXS5HleQc1zGOTQtV83aaEwt7F9woi_V3vBo8xISTbV8VCxYOR55NOlD-NLjLFHxtwLS94YXH72BXsyZJCFs2tphjbmwtarCxQmkykfRHuU4ohvJwXrqKzzzLwDyba8G2yIEyaECPSA9rfApQrk2dh7jTotxxsv5gi0JhFk7XswId2do5w';

const COMPANY_LINKS = [
  { to: '/careers', key: 'footer_link_careers', value: 'Careers' },
  { to: '/news', key: 'footer_link_news', value: 'News' },
  { to: '/gallery', key: 'footer_link_gallery', value: 'Gallery' },
];

const LEGAL_LINKS = [
  { to: '/privacy-policy', key: 'footer_link_privacy', value: 'Privacy Policy' },
  { to: '/terms', key: 'footer_link_terms', value: 'Terms of Service' },
  { to: '/cookie-policy', key: 'footer_link_cookies', value: 'Cookie Policy' },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-container-lowest full-width bottom-0 border-t border-outline-variant mt-auto">
      <div className="w-full px-margin-mobile md:px-margin-desktop py-xl grid grid-cols-1 md:grid-cols-4 gap-gutter max-w-[1280px] mx-auto">
        <div className="col-span-1 md:col-span-2">
          <div className="mb-sm h-16 w-fit">
            <EditableImage contentKey="footer_logo" value={DEFAULT_LOGO}>
              {(src) => (
                <img
                  alt="LCPH Realty Inc. Logo"
                  className="h-16 w-auto object-contain"
                  src={src || DEFAULT_LOGO}
                />
              )}
            </EditableImage>
          </div>
          <EditableText
            contentKey="footer_tagline"
            value="Building communities where leisure meets luxury. A subsidiary of VHBC dedicated to premium real estate development in the Philippines."
            className="font-body-sm text-body-sm text-on-surface-variant max-w-[448px]"
            tag="p"
            multiline={true}
          />
        </div>

        <div>
          <EditableText
            contentKey="footer_company_heading"
            value="Company"
            className="font-label-lg text-label-lg text-on-surface mb-md font-bold block"
            tag="h4"
          />
          <ul className="space-y-sm">
            {COMPANY_LINKS.map((item) => (
              <li key={item.key}>
                <Link to={item.to} className={LINK_CLASS}>
                  <EditableText contentKey={item.key} value={item.value} tag="span" inline />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <EditableText
            contentKey="footer_legal_heading"
            value="Legal"
            className="font-label-lg text-label-lg text-on-surface mb-md font-bold block"
            tag="h4"
          />
          <ul className="space-y-sm">
            {LEGAL_LINKS.map((item) => (
              <li key={item.key}>
                <Link to={item.to} className={LINK_CLASS}>
                  <EditableText contentKey={item.key} value={item.value} tag="span" inline />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-outline-variant/30 py-md text-center">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          © {new Date().getFullYear()}{' '}
          <EditableText
            contentKey="footer_copyright"
            value="LCPH Realty Inc. All rights reserved."
            tag="span"
            inline
          />
        </p>
      </div>
    </footer>
  );
};
export default Footer;
