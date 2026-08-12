import React, { useState } from 'react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { EditableText } from '../components/admin/EditableText';
import { EditableRichText } from '../components/admin/EditableRichText';
import { EditableEmbed } from '../components/admin/EditableEmbed';
import { CheckCircle, Clock, Mail, MapPin, Phone } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div data-page-motion="custom" className="simple-page-enter space-y-xl py-sm">
      <div className="container-custom space-y-md">
        <Breadcrumbs items={[{ label: 'Contact Us' }]} />

        {/* Page Header */}
        <div className="space-y-xs">
          <EditableText 
            contentKey="contact_title"
            tag="h1"
            className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary font-bold"
          />
          <EditableText 
            contentKey="contact_subtitle"
            tag="p"
            className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 items-stretch gap-gutter lg:grid-cols-3">
          {/* Form */}
          <div className="interactive-panel space-y-6 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm md:p-8 lg:col-span-2">
            <EditableText 
              contentKey="contact_form_title"
              tag="h2"
              className="font-headline-sm text-headline-sm text-on-surface font-bold"
            />

            {formSubmitted ? (
              <div className="p-6 bg-primary-container text-on-primary-container rounded-xl text-center space-y-2">
                <CheckCircle className="w-10 h-10 mx-auto text-on-primary-container" />
                <EditableText
                  contentKey="contact_success_title"
                  value="Inquiry Sent Successfully!"
                  className="block font-headline-sm text-headline-sm font-bold"
                  tag="h3"
                />
                <EditableRichText
                  contentKey="contact_success_text"
                  className="block font-body-sm text-body-sm opacity-90"
                  compact
                />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1">
                      <EditableText contentKey="contact_label_name" value="Full Name" tag="span" inline />
                    </label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Maria Santos"
                      className="w-full px-3.5 py-2.5 rounded border border-outline-variant bg-surface text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1">
                      <EditableText contentKey="contact_label_email" value="Email Address" tag="span" inline />
                    </label>
                    <input 
                      type="email" 
                      required 
                      placeholder="maria@example.com"
                      className="w-full px-3.5 py-2.5 rounded border border-outline-variant bg-surface text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1">
                      <EditableText contentKey="contact_label_mobile" value="Mobile Number" tag="span" inline />
                    </label>
                    <input 
                      type="tel" 
                      required 
                      placeholder="+63 917 000 0000"
                      className="w-full px-3.5 py-2.5 rounded border border-outline-variant bg-surface text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1">
                      <EditableText contentKey="contact_label_inquiry" value="Inquiry Type" tag="span" inline />
                    </label>
                    <select className="w-full px-3.5 py-2.5 rounded border border-outline-variant bg-surface text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none appearance-none">
                      <option value="purchase">Purchase</option>
                      <option value="lease">Lease</option>
                      <option value="general">General Inquiry</option>
                      <option value="partnership">Partnership</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1">
                    <EditableText contentKey="contact_label_message" value="Message" tag="span" inline />
                  </label>
                  <textarea 
                    rows={4} 
                    required 
                    placeholder="Write your message or inquiry here..."
                    className="w-full px-3.5 py-2.5 rounded border border-outline-variant bg-surface text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>

                <button 
                  type="submit" 
                  className="px-6 py-3 bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container font-label-lg text-label-lg rounded transition-colors shadow-sm cursor-pointer"
                >
                  <EditableText contentKey="contact_submit_label" value="Send Message" tag="span" inline />
                </button>
              </form>
            )}
          </div>

          {/* Info panel */}
          <div className="h-full">
            <div className="section-diagonal pattern-on-dark relative flex h-full min-h-[440px] flex-col overflow-hidden rounded-xl border border-primary-container bg-primary p-6 text-on-primary shadow-md md:p-8">
              <EditableText 
                contentKey="contact_info_title"
                tag="h3"
                className="relative mb-7 font-headline-md text-[24px] font-bold text-on-primary"
              />
              <div className="relative flex flex-1 flex-col justify-center gap-3 text-body-sm text-on-primary/90">
                <div className="group flex items-start gap-4 rounded-lg border border-white/10 bg-white/[0.07] p-4 backdrop-blur-sm transition-all hover:translate-x-1 hover:border-white/25 hover:bg-white/[0.12]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-primary-fixed">
                    <MapPin className="w-5 h-5 transition-transform group-hover:scale-110" />
                  </div>
                  <EditableText contentKey="contact_info_address" tag="span" className="self-center leading-relaxed text-on-primary" />
                </div>
                <div className="group flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.07] p-4 backdrop-blur-sm transition-all hover:translate-x-1 hover:border-white/25 hover:bg-white/[0.12]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-primary-fixed">
                    <Phone className="w-5 h-5 transition-transform group-hover:scale-110" />
                  </div>
                  <EditableText contentKey="contact_info_phone" tag="span" className="text-on-primary" />
                </div>
                <div className="group flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.07] p-4 backdrop-blur-sm transition-all hover:translate-x-1 hover:border-white/25 hover:bg-white/[0.12]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-primary-fixed">
                    <Mail className="w-5 h-5 transition-transform group-hover:scale-110" />
                  </div>
                  <EditableText contentKey="contact_info_email" tag="span" className="break-all text-on-primary" />
                </div>
                <div className="group flex items-start gap-4 rounded-lg border border-white/10 bg-white/[0.07] p-4 backdrop-blur-sm transition-all hover:translate-x-1 hover:border-white/25 hover:bg-white/[0.12]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-primary-fixed">
                    <Clock className="w-5 h-5 transition-transform group-hover:scale-110" />
                  </div>
                  <EditableRichText
                    contentKey="contact_info_hours"
                    className="self-center leading-relaxed text-on-primary"
                    compact
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section data-reveal className="section-band w-full h-96 relative overflow-hidden">
        <EditableEmbed
          contentKey="contact_map_embed"
          value="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3853.1134835949197!2d120.6810847761108!3d15.041838066119714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396f766478da7d5%3A0x37161103f245a3f9!2sLCPH%20REALTY%20INC.%20%E2%80%9CLeisure%20Community%20PH%E2%80%9D!5e0!3m2!1sen!2sph!4v1785566513008!5m2!1sen!2sph"
          className="w-full h-full border-0"
          title="LCPH office location map"
        />
      </section>
    </div>
  );
};

export default ContactPage;

