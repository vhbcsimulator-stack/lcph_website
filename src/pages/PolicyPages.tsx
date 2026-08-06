import React from 'react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { EditableText } from '../components/admin/EditableText';
import { EditableSections, type ContentSection } from '../components/admin/EditableSections';

const PANEL =
  'bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/20 text-body-sm text-on-surface-variant space-y-6 leading-relaxed shadow-sm';

/** Starting sections, kept until an admin saves their own set. */
const PRIVACY_SECTIONS: ContentSection[] = [
  {
    id: 'privacy-collection',
    heading: '1. Data Collection',
    blocks: [
      {
        type: 'paragraph',
        text: 'We collect personal information voluntarily submitted via inquiry forms, site visit bookings, and broker accreditation applications.',
      },
      { type: 'bullet', text: 'Full name and mobile number' },
      { type: 'bullet', text: 'Email address' },
      { type: 'bullet', text: 'Lot and project preferences' },
    ],
  },
  {
    id: 'privacy-usage',
    heading: '2. Data Usage & Protection',
    blocks: [
      {
        type: 'paragraph',
        text: 'Your data is used strictly by accredited LCPH property specialists for lot availability updates, tour confirmations, and contract documentation in compliance with Republic Act No. 10173 (Data Privacy Act of 2012).',
      },
    ],
  },
];

const TERMS_SECTIONS: ContentSection[] = [
  {
    id: 'terms-renderings',
    heading: '1. Property Renderings & Disclaimers',
    blocks: [
      {
        type: 'paragraph',
        text: 'All lot dimensions, architectural renders, amenity visualizations, and maps are presented for illustrative purposes ("Artist\'s Perspective"). Verified lot titles, exact boundary points, and contract terms are specified in the official Contract to Sell (CTS).',
      },
    ],
  },
];

const COOKIE_SECTIONS: ContentSection[] = [
  {
    id: 'cookies-essential',
    heading: '1. Essential Cookies',
    blocks: [
      {
        type: 'paragraph',
        text: 'This website uses essential session cookies to enhance navigation, remember search filters, and ensure secure form submissions.',
      },
    ],
  },
];

export const PrivacyPolicyPage: React.FC = () => (
  <div className="py-8 space-y-6 container-custom max-w-4xl">
    <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />
    <EditableText contentKey="policy_privacy_title" tag="h1" className="font-headline-lg text-primary font-bold" />
    <div className={PANEL}>
      <EditableText contentKey="policy_privacy_content_p1" tag="p" multiline={true} />
      <EditableSections contentKey="policy_privacy_sections" defaultSections={PRIVACY_SECTIONS} />
    </div>
  </div>
);

export const TermsPage: React.FC = () => (
  <div className="py-8 space-y-6 container-custom max-w-4xl">
    <Breadcrumbs items={[{ label: 'Terms of Use' }]} />
    <EditableText contentKey="policy_terms_title" tag="h1" className="font-headline-lg text-primary font-bold" />
    <div className={PANEL}>
      <EditableText contentKey="policy_terms_content_p1" tag="p" multiline={true} />
      <EditableSections contentKey="policy_terms_sections" defaultSections={TERMS_SECTIONS} />
    </div>
  </div>
);

export const CookiePolicyPage: React.FC = () => (
  <div className="py-8 space-y-6 container-custom max-w-4xl">
    <Breadcrumbs items={[{ label: 'Cookie Policy' }]} />
    <EditableText contentKey="policy_cookies_title" tag="h1" className="font-headline-lg text-primary font-bold" />
    <div className={PANEL}>
      <EditableText contentKey="policy_cookies_content_p1" tag="p" multiline={true} />
      <EditableSections contentKey="policy_cookies_sections" defaultSections={COOKIE_SECTIONS} />
    </div>
  </div>
);
