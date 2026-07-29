import React, { useState } from 'react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Phone, Mail, MapPin, Clock, CheckCircle } from 'lucide-react';
import { EditableText } from '../components/admin/EditableText';

export const ContactPage: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="space-y-xl py-sm">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          {/* Form */}
          <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/20 shadow-sm space-y-6">
            <EditableText 
              contentKey="contact_form_title"
              tag="h2"
              className="font-headline-sm text-headline-sm text-on-surface font-bold"
            />

            {formSubmitted ? (
              <div className="p-6 bg-primary-container text-on-primary-container rounded-xl text-center space-y-2">
                <CheckCircle className="w-10 h-10 mx-auto text-on-primary-container" />
                <h3 className="font-headline-sm text-headline-sm font-bold">Inquiry Sent Successfully!</h3>
                <p className="font-body-sm text-body-sm opacity-90">Our customer team will contact you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Maria Santos"
                      className="w-full px-3.5 py-2.5 rounded border border-outline-variant bg-surface text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1">Email Address</label>
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
                    <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1">Mobile Number</label>
                    <input 
                      type="tel" 
                      required 
                      placeholder="+63 917 000 0000"
                      className="w-full px-3.5 py-2.5 rounded border border-outline-variant bg-surface text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1">Inquiry Type</label>
                    <select className="w-full px-3.5 py-2.5 rounded border border-outline-variant bg-surface text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none">
                      <option value="purchase">Purchase</option>
                      <option value="lease">Lease</option>
                      <option value="general">General Inquiry</option>
                      <option value="partnership">Partnership</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1">Message</label>
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
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Info panel */}
          <div className="space-y-6">
            <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/20 space-y-4">
              <EditableText 
                contentKey="contact_info_title"
                tag="h3"
                className="font-headline-sm text-headline-sm text-on-surface font-bold"
              />
              <div className="space-y-3 text-body-sm text-on-surface-variant">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <EditableText contentKey="contact_info_address" tag="span" />
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <EditableText contentKey="contact_info_phone" tag="span" />
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary shrink-0" />
                  <EditableText contentKey="contact_info_email" tag="span" />
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <EditableText 
                    contentKey="contact_info_hours"
                    tag="span"
                    multiline={true}
                    className="whitespace-pre-line"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

