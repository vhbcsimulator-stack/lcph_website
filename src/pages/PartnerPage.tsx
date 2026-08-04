import React, { useState } from 'react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { EditableText } from '../components/admin/EditableText';
import { Award, CheckCircle } from 'lucide-react';

export const PartnerPage: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="space-y-xl py-sm">
      <div className="container-custom space-y-md">
        <Breadcrumbs items={[{ label: 'Partner With Us' }]} />

        {/* Page Header */}
        <div className="space-y-xs">
          <EditableText 
            contentKey="partner_title"
            tag="h1"
            className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary font-bold"
          />
          <EditableText 
            contentKey="partner_subtitle"
            tag="p"
            className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          <div className="interactive-panel lg:col-span-2 bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/20 shadow-sm space-y-6">
            <EditableText 
              contentKey="partner_form_title"
              tag="h2"
              className="font-headline-sm text-headline-sm text-on-surface font-bold"
            />

            {formSubmitted ? (
              <div className="p-6 bg-primary-container text-on-primary-container rounded-xl text-center space-y-2">
                <CheckCircle className="w-10 h-10 mx-auto text-on-primary-container" />
                <h3 className="font-headline-sm text-headline-sm font-bold"><EditableText contentKey="partner_success_title" value="Application Submitted!" tag="span" inline /></h3>
                <p className="font-body-sm text-body-sm opacity-90"><EditableText contentKey="partner_success_text" value="Our Broker Network Relations desk will contact you with accreditation terms." tag="span" inline /></p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1"><EditableText contentKey="partner_label_name" value="Full Name / Agency" tag="span" inline /></label>
                    <input type="text" required placeholder="e.g. Juan Dela Cruz / Apex Realty" className="w-full px-3.5 py-2.5 rounded border border-outline-variant bg-surface text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1"><EditableText contentKey="partner_label_license" value="PRC License / DHSUD Reg No." tag="span" inline /></label>
                    <input type="text" required placeholder="PRC Reg. No." className="w-full px-3.5 py-2.5 rounded border border-outline-variant bg-surface text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1"><EditableText contentKey="partner_label_email" value="Email Address" tag="span" inline /></label>
                    <input type="email" required placeholder="broker@agency.com" className="w-full px-3.5 py-2.5 rounded border border-outline-variant bg-surface text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1"><EditableText contentKey="partner_label_mobile" value="Mobile Number" tag="span" inline /></label>
                    <input type="tel" required placeholder="+63 917 000 0000" className="w-full px-3.5 py-2.5 rounded border border-outline-variant bg-surface text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1"><EditableText contentKey="partner_label_category" value="Partnership Category" tag="span" inline /></label>
                  <select className="w-full px-3.5 py-2.5 rounded border border-outline-variant bg-surface text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none">
                    <option value="broker">Licensed Real Estate Broker</option>
                    <option value="agent">Sales Agent</option>
                    <option value="supplier">Supplier / Material Provider</option>
                    <option value="contractor">Civil Contractor</option>
                  </select>
                </div>

                <button type="submit" className="px-6 py-3 bg-primary text-on-primary font-label-lg text-label-lg rounded hover:bg-primary-container hover:text-on-primary-container transition-colors cursor-pointer">
                  <EditableText contentKey="partner_submit" value="Submit Accreditation Request" tag="span" inline />
                </button>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className="interactive-panel bg-surface-container-low p-6 rounded-xl border border-outline-variant/20 space-y-4">
              <EditableText 
                contentKey="partner_benefits_title"
                tag="h3"
                className="font-headline-sm text-headline-sm text-on-surface font-bold"
              />
              <ul className="space-y-2 text-body-sm text-body-sm text-on-surface-variant">
                <li className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary shrink-0" />
                  <EditableText contentKey="partner_benefit1" tag="span" />
                </li>
                <li className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary shrink-0" />
                  <EditableText contentKey="partner_benefit2" tag="span" />
                </li>
                <li className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary shrink-0" />
                  <EditableText contentKey="partner_benefit3" tag="span" />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PartnerPage;

