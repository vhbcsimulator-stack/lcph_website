import React from 'react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { EditableText } from '../components/admin/EditableText';

export const PrivacyPolicyPage: React.FC = () => (
  <div className="py-8 space-y-6 container-custom max-w-4xl">
    <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />
    <EditableText 
      contentKey="policy_privacy_title"
      tag="h1"
      className="font-headline-lg text-primary font-bold"
    />
    <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/20 text-body-sm text-on-surface-variant space-y-4 leading-relaxed shadow-sm">
      <EditableText contentKey="policy_privacy_content_p1" tag="p" />
      <h3 className="font-bold text-headline-sm text-sm text-on-surface">1. Data Collection</h3>
      <EditableText contentKey="policy_privacy_content_p2" tag="p" />
      <h3 className="font-bold text-headline-sm text-sm text-on-surface">2. Data Usage & Protection</h3>
      <EditableText contentKey="policy_privacy_content_p3" tag="p" />
    </div>
  </div>
);

export const TermsPage: React.FC = () => (
  <div className="py-8 space-y-6 container-custom max-w-4xl">
    <Breadcrumbs items={[{ label: 'Terms of Use' }]} />
    <EditableText 
      contentKey="policy_terms_title"
      tag="h1"
      className="font-headline-lg text-primary font-bold"
    />
    <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/20 text-body-sm text-on-surface-variant space-y-4 leading-relaxed shadow-sm">
      <EditableText contentKey="policy_terms_content_p1" tag="p" />
      <h3 className="font-bold text-headline-sm text-sm text-on-surface">1. Property Renderings & Disclaimers</h3>
      <EditableText contentKey="policy_terms_content_p2" tag="p" />
    </div>
  </div>
);

export const CookiePolicyPage: React.FC = () => (
  <div className="py-8 space-y-6 container-custom max-w-4xl">
    <Breadcrumbs items={[{ label: 'Cookie Policy' }]} />
    <EditableText 
      contentKey="policy_cookies_title"
      tag="h1"
      className="font-headline-lg text-primary font-bold"
    />
    <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/20 text-body-sm text-on-surface-variant space-y-4 leading-relaxed shadow-sm">
      <EditableText contentKey="policy_cookies_content_p1" tag="p" />
    </div>
  </div>
);

