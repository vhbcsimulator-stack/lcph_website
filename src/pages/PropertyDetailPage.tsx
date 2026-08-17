﻿import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Lightbox } from '../components/ui/Lightbox';
import { useAdmin } from '../context/AdminContext';
import { EditableText } from '../components/admin/EditableText';
import { EditableRichText } from '../components/admin/EditableRichText';
import { EditableImage } from '../components/admin/EditableImage';
import { Calendar, CheckCircle, MapPin, ZoomIn } from 'lucide-react';
import { metaForProperty } from '../seo/site.js';
import { useSeo, type SeoMeta } from '../seo/useSeo';
import type { Property } from '../types';

/** Landmark rows are page copy rather than property data, so they live in page_content. */
const LANDMARKS = [
  { key: 'property_landmark_1', name: 'Premium Education', distanceKey: 'property_landmark_1_distance', distance: '2.5 km' },
  { key: 'property_landmark_2', name: 'Healthcare facilities', distanceKey: 'property_landmark_2_distance', distance: '4.0 km' },
  { key: 'property_landmark_3', name: 'Recreation Loops', distanceKey: 'property_landmark_3_distance', distance: '1.2 km' },
  { key: 'property_landmark_4', name: 'Shopping & Dining strip', distanceKey: 'property_landmark_4_distance', distance: '3.0 km' },
];

export const PropertyDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { properties, loading, updatePropertyField } = useAdmin();
  const property = properties.find(p => p.slug === slug || p.id === slug);

  useSeo(property ? (metaForProperty(property) as SeoMeta) : null);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [inquirerName, setInquirerName] = useState('');
  const [inquirerEmail, setInquirerEmail] = useState('');
  const [inquirerPhone, setInquirerPhone] = useState('');

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inquirerName && inquirerEmail && inquirerPhone) {
      setFormSubmitted(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
        <p className="text-sm font-semibold text-on-surface-variant">Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4 px-4">
        <h2 className="text-2xl font-bold text-primary">
          <EditableText contentKey="property_missing_title" value="Property Not Found" tag="span" inline />
        </h2>
        <p className="text-on-surface-variant max-w-md">
          <EditableText
            contentKey="property_missing_text"
            value="The property you are looking for does not exist or has been removed."
            tag="span"
            inline
          />
        </p>
        <Link to="/projects" className="bg-primary text-on-primary font-bold text-sm px-6 py-2.5 rounded-lg hover:bg-primary-container">
          <EditableText contentKey="property_missing_cta" value="Back to Projects" tag="span" inline />
        </Link>
      </div>
    );
  }

  /** Writes a single slot of the property's image array. */
  const saveImage = (index: number, url: string) => {
    const images = [...property.images];
    images[index] = url;
    updatePropertyField(property.id, 'images', images);
  };

  const saveFeature = (index: number, text: string) => {
    const features = [...property.features];
    features[index] = text;
    updatePropertyField(property.id, 'features', features);
  };

  const secondaryIndex = 1 % property.images.length;

  return (
    <div className="space-y-xl py-sm">
      <div className="container-custom space-y-md">
        <Breadcrumbs items={[
          { label: 'Properties', path: '/properties' },
          { label: property.title }
        ]} />

        {/* Hero Gallery Bento Grid */}
        <section className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-xs md:gap-sm h-[400px] md:h-[600px] rounded-xl overflow-hidden shadow-lg border border-outline-variant/20 bg-surface">
            {/* Main Featured Image */}
            <div
              onClick={() => openLightbox(0)}
              className="md:col-span-3 md:row-span-2 relative group cursor-pointer overflow-hidden"
            >
              <EditableImage value={property.images[0]} onSave={(val) => saveImage(0, val)}>
                {(src) => (
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${src}')` }}
                  />
                )}
              </EditableImage>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-on-background/80 via-transparent to-transparent opacity-60" />
              {/* z-40 keeps this copy above the image editor's hover overlay (z-30) so it stays clickable */}
              <div className="absolute bottom-md left-md z-40 text-white pr-md">
                <span className="bg-primary text-on-primary font-label-lg text-label-lg px-3 py-1 rounded-full mb-xs inline-block shadow-sm">
                  <EditableText
                    value={property.status}
                    onSave={(val) => updatePropertyField(property.id, 'status', val as Property['status'])}
                    tag="span"
                    inline
                  />
                </span>
                <EditableText
                  value={property.title}
                  onSave={(val) => updatePropertyField(property.id, 'title', val)}
                  className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-white drop-shadow-md font-bold"
                  tag="h1"
                />
                <p className="font-body-lg text-body-lg text-surface-variant flex items-center mt-2">
                  <MapPin className="w-5 h-5 mr-2 text-primary-fixed" />
                  <EditableText
                    value={property.location}
                    onSave={(val) => updatePropertyField(property.id, 'location', val)}
                    tag="span"
                    inline
                  />
                </p>
              </div>
            </div>
            {/* Secondary Image 1 */}
            <div
              onClick={() => openLightbox(secondaryIndex)}
              className="hidden md:block relative group cursor-pointer overflow-hidden rounded-tr-xl"
            >
              <EditableImage
                value={property.images[secondaryIndex]}
                onSave={(val) => saveImage(secondaryIndex, val)}
              >
                {(src) => (
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${src}')` }}
                  />
                )}
              </EditableImage>
              <div className="pointer-events-none absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>
            {/* Secondary Image 2 */}
            <div
              onClick={() => openLightbox(0)}
              className="hidden md:block relative group cursor-pointer overflow-hidden rounded-br-xl"
            >
              <EditableImage value={property.images[0]} onSave={(val) => saveImage(0, val)}>
                {(src) => (
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${src}')` }}
                  />
                )}
              </EditableImage>
              <div className="pointer-events-none absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="pointer-events-auto z-40 text-white font-label-lg text-label-lg flex items-center bg-on-background/50 px-4 py-2 rounded-full backdrop-blur-sm">
                  <ZoomIn className="w-4 h-4 mr-2" />
                  <EditableText contentKey="property_gallery_cta" value="View Gallery" tag="span" inline />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section (8 cols left, 4 cols right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter py-md">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-xl">
            {/* Description */}
            <section className="space-y-md">
              <EditableText
                contentKey="property_description_title"
                value="Property Description"
                className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary font-bold"
                tag="h2"
              />
              <EditableRichText
                value={property.description}
                onSave={(val) => updatePropertyField(property.id, 'description', val)}
                className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed"
              />

              {/* Specs Grid */}
              <div className="bg-surface-container-low/50 border border-outline-variant/30 rounded-xl p-md grid grid-cols-2 md:grid-cols-3 gap-md shadow-sm">
                <div>
                  <EditableText
                    contentKey="property_spec_lot_size"
                    value="Lot Size"
                    className="font-body-sm text-body-sm text-on-surface-variant mb-1 uppercase tracking-wider"
                    tag="p"
                  />
                  <p className="font-headline-sm text-headline-sm text-on-background font-bold">
                    <EditableText
                      value={String(property.lotSize)}
                      onSave={(val) => updatePropertyField(property.id, 'lotSize', Number(val) || 0)}
                      tag="span"
                      inline
                    />{' '}
                    <EditableText contentKey="property_spec_lot_unit" value="sqm" tag="span" inline />
                  </p>
                </div>
                <div>
                  <EditableText
                    contentKey="property_spec_category"
                    value="Category"
                    className="font-body-sm text-body-sm text-on-surface-variant mb-1 uppercase tracking-wider"
                    tag="p"
                  />
                  <EditableText
                    value={property.category}
                    onSave={(val) => updatePropertyField(property.id, 'category', val as Property['category'])}
                    className="font-headline-sm text-headline-sm text-on-background font-bold"
                    tag="p"
                  />
                </div>
                <div>
                  <EditableText
                    contentKey="property_spec_pricing"
                    value="Pricing Tier"
                    className="font-body-sm text-body-sm text-on-surface-variant mb-1 uppercase tracking-wider"
                    tag="p"
                  />
                  <EditableText
                    value={property.pricePlaceholder}
                    onSave={(val) => updatePropertyField(property.id, 'pricePlaceholder', val)}
                    className="font-headline-sm text-headline-sm text-primary font-bold"
                    tag="p"
                  />
                </div>
              </div>
            </section>

            {/* Key Features */}
            <section className="section-band-inset section-dots space-y-md p-6 md:p-8">
              <EditableText
                contentKey="property_features_title"
                value="Key Features &amp; Selling Points"
                className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary font-bold"
                tag="h2"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
                {property.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-body-md text-body-md text-on-surface-variant">
                    <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                    <EditableText value={feat} onSave={(val) => saveFeature(idx, val)} tag="span" inline />
                  </div>
                ))}
              </div>
            </section>

            {/* Neighborhood & Distances */}
            <section className="space-y-md">
              <EditableText
                contentKey="property_landmarks_title"
                value="Nearby Landmarks"
                className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary font-bold"
                tag="h2"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-sm text-body-sm">
                {LANDMARKS.map((landmark) => (
                  <div
                    key={landmark.key}
                    className="p-sm bg-surface-container-low border border-outline-variant/20 rounded-lg flex items-center justify-between gap-3"
                  >
                    <span className="font-bold text-on-surface">
                      <EditableText contentKey={landmark.key} value={landmark.name} tag="span" inline />
                    </span>
                    <span className="text-on-surface-variant">
                      <EditableText contentKey={landmark.distanceKey} value={landmark.distance} tag="span" inline />
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column (4 cols) - Sticky Booking Widget */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-[140px] bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-md shadow-lg space-y-4">
              <h3 className="font-headline-md text-headline-md text-on-background font-bold">
                <EditableText contentKey="property_widget_title" value="Inquire About" tag="span" inline />{' '}
                <EditableText
                  value={property.title}
                  onSave={(val) => updatePropertyField(property.id, 'title', val)}
                  tag="span"
                  inline
                />
              </h3>
              <EditableRichText
                contentKey="property_widget_text"
                className="font-body-sm text-body-sm text-on-surface-variant"
                compact
              />

              {formSubmitted ? (
                <div className="p-6 bg-primary-container text-on-primary-container rounded-xl text-center space-y-3">
                  <CheckCircle className="w-10 h-10 mx-auto" />
                  <EditableText
                    contentKey="property_success_title"
                    value="Inquiry Logged!"
                    className="font-headline-sm text-headline-sm font-bold"
                    tag="h4"
                  />
                  <p className="font-body-sm text-body-sm opacity-90">
                    <EditableText
                      contentKey="property_success_text"
                      value="We have received your computation request. An agent will contact you at"
                      tag="span"
                      inline
                    />{' '}
                    {inquirerEmail}{' '}
                    <EditableText contentKey="property_success_text_suffix" value="within 24 hours." tag="span" inline />
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div>
                    <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1">
                      <EditableText contentKey="property_label_name" value="Your Full Name" tag="span" inline />
                    </label>
                    <input
                      type="text"
                      required
                      value={inquirerName}
                      onChange={(e) => setInquirerName(e.target.value)}
                      className="w-full rounded-md border border-outline-variant/50 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 bg-surface p-2.5 outline-none text-body-md"
                      placeholder="Juan Dela Cruz"
                    />
                  </div>
                  <div>
                    <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1">
                      <EditableText contentKey="property_label_email" value="Email Address" tag="span" inline />
                    </label>
                    <input
                      type="email"
                      required
                      value={inquirerEmail}
                      onChange={(e) => setInquirerEmail(e.target.value)}
                      className="w-full rounded-md border border-outline-variant/50 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 bg-surface p-2.5 outline-none text-body-md"
                      placeholder="juan@example.com"
                    />
                  </div>
                  <div>
                    <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1">
                      <EditableText contentKey="property_label_mobile" value="Mobile Number" tag="span" inline />
                    </label>
                    <input
                      type="tel"
                      required
                      value={inquirerPhone}
                      onChange={(e) => setInquirerPhone(e.target.value)}
                      className="w-full rounded-md border border-outline-variant/50 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 bg-surface p-2.5 outline-none text-body-md"
                      placeholder="+63 (917) 000-0000"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary text-on-primary font-label-lg text-label-lg px-6 py-4 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-md hover:shadow-lg active:scale-95 duration-100 mt-4 cursor-pointer"
                  >
                    <EditableText
                      contentKey="property_submit_cta"
                      value="Request Sample Computation"
                      tag="span"
                      inline
                    />
                  </button>
                  <div className="flex items-center justify-center mt-4">
                    <span className="w-full border-t border-outline-variant/30" />
                    <span className="px-3 font-body-sm text-body-sm text-on-surface-variant whitespace-nowrap">
                      <EditableText contentKey="property_divider_label" value="or" tag="span" inline />
                    </span>
                    <span className="w-full border-t border-outline-variant/30" />
                  </div>
                  <Link
                    to="/schedule-site-visit"
                    className="w-full bg-transparent border-2 border-tertiary text-tertiary font-label-lg text-label-lg px-6 py-3 rounded-lg hover:bg-tertiary/5 transition-colors mt-4 flex items-center justify-center"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    <EditableText contentKey="property_visit_cta" value="Book Site Visit" tag="span" inline />
                  </Link>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <Lightbox
        isOpen={lightboxOpen}
        images={property.images}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : property.images.length - 1))}
        onNext={() => setLightboxIndex((prev) => (prev < property.images.length - 1 ? prev + 1 : 0))}
        title={property.title}
      />
    </div>
  );
};
export default PropertyDetailPage;