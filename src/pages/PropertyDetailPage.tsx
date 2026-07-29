import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { MapPin, CheckCircle, Calendar, ZoomIn } from 'lucide-react';
import { Lightbox } from '../components/ui/Lightbox';
import { useAdmin } from '../context/AdminContext';

export const PropertyDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { properties, loading } = useAdmin();
  const property = properties.find(p => p.slug === slug || p.id === slug);

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
        <h2 className="text-2xl font-bold text-primary">Property Not Found</h2>
        <p className="text-on-surface-variant max-w-md">The property you are looking for does not exist or has been removed.</p>
        <Link to="/projects" className="bg-primary text-on-primary font-bold text-sm px-6 py-2.5 rounded-lg hover:bg-primary-container">
          Back to Projects
        </Link>
      </div>
    );
  }

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
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${property.images[0]}')` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 via-transparent to-transparent opacity-60"></div>
              <div className="absolute bottom-md left-md text-white">
                <span className="bg-primary text-on-primary font-label-lg text-label-lg px-3 py-1 rounded-full mb-xs inline-block shadow-sm">
                  {property.status}
                </span>
                <h1 className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-white drop-shadow-md font-bold">
                  {property.title}
                </h1>
                <p className="font-body-lg text-body-lg text-surface-variant flex items-center mt-2">
                  <MapPin className="mr-2 w-5 h-5 text-primary-fixed" />
                  <span>{property.location}</span>
                </p>
              </div>
            </div>
            {/* Secondary Image 1 */}
            <div
              onClick={() => openLightbox(1 % property.images.length)}
              className="hidden md:block relative group cursor-pointer overflow-hidden rounded-tr-xl"
            >
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${property.images[1 % property.images.length]}')` }}
              ></div>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
            </div>
            {/* Secondary Image 2 */}
            <div
              onClick={() => openLightbox(0)}
              className="hidden md:block relative group cursor-pointer overflow-hidden rounded-br-xl"
            >
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${property.images[0]}')` }}
              ></div>
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="text-white font-label-lg text-label-lg flex items-center bg-on-background/50 px-4 py-2 rounded-full backdrop-blur-sm">
                  <ZoomIn className="w-4 h-4 mr-2" />
                  View Gallery
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
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary font-bold">Property Description</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                {property.description}
              </p>

              {/* Specs Grid */}
              <div className="bg-surface-container-low/50 border border-outline-variant/30 rounded-xl p-md grid grid-cols-2 md:grid-cols-3 gap-md shadow-sm">
                <div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-1 uppercase tracking-wider">Lot Size</p>
                  <p className="font-headline-sm text-headline-sm text-on-background font-bold">{property.lotSize} sqm</p>
                </div>
                <div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-1 uppercase tracking-wider">Category</p>
                  <p className="font-headline-sm text-headline-sm text-on-background font-bold">{property.category}</p>
                </div>
                <div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-1 uppercase tracking-wider">Pricing Tier</p>
                  <p className="font-headline-sm text-headline-sm text-primary font-bold">{property.pricePlaceholder}</p>
                </div>
              </div>
            </section>

            {/* Key Features */}
            <section className="space-y-md">
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary font-bold">Key Features & Selling Points</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
                {property.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-body-md text-body-md text-on-surface-variant">
                    <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Neighborhood & Distances */}
            <section className="space-y-md">
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary font-bold">Nearby Landmarks</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-sm text-body-sm">
                <div className="p-sm bg-surface-container-low border border-outline-variant/20 rounded-lg flex items-center justify-between">
                  <span className="font-bold text-on-surface">Premium Education</span>
                  <span className="text-on-surface-variant">2.5 km</span>
                </div>
                <div className="p-sm bg-surface-container-low border border-outline-variant/20 rounded-lg flex items-center justify-between">
                  <span className="font-bold text-on-surface">Healthcare facilities</span>
                  <span className="text-on-surface-variant">4.0 km</span>
                </div>
                <div className="p-sm bg-surface-container-low border border-outline-variant/20 rounded-lg flex items-center justify-between">
                  <span className="font-bold text-on-surface">Recreation Loops</span>
                  <span className="text-on-surface-variant">1.2 km</span>
                </div>
                <div className="p-sm bg-surface-container-low border border-outline-variant/20 rounded-lg flex items-center justify-between">
                  <span className="font-bold text-on-surface">Shopping & Dining strip</span>
                  <span className="text-on-surface-variant">3.0 km</span>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column (4 cols) - Sticky Booking Widget */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-[140px] bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-md shadow-lg space-y-4">
              <h3 className="font-headline-md text-headline-md text-on-background font-bold">
                Inquire About {property.title}
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Request sample computation, lot map guidelines, or schedule a viewing.
              </p>

              {formSubmitted ? (
                <div className="p-6 bg-primary-container text-on-primary-container rounded-xl text-center space-y-3">
                  <CheckCircle className="w-10 h-10 mx-auto" />
                  <h4 className="font-headline-sm text-headline-sm font-bold">Inquiry Logged!</h4>
                  <p className="font-body-sm text-body-sm opacity-90">
                    We have received your computation request. An agent will contact you at {inquirerEmail} within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div>
                    <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1">Your Full Name</label>
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
                    <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1">Email Address</label>
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
                    <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1">Mobile Number</label>
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
                    Request Sample Computation
                  </button>
                  <div className="flex items-center justify-center mt-4">
                    <span className="w-full border-t border-outline-variant/30"></span>
                    <span className="px-3 font-body-sm text-body-sm text-on-surface-variant whitespace-nowrap">or</span>
                    <span className="w-full border-t border-outline-variant/30"></span>
                  </div>
                  <Link
                    to="/schedule-site-visit"
                    className="w-full bg-transparent border-2 border-tertiary text-tertiary font-label-lg text-label-lg px-6 py-3 rounded-lg hover:bg-tertiary/5 transition-colors mt-4 flex items-center justify-center"
                  >
                    <Calendar className="mr-2 w-5 h-5" />
                    <span>Book Site Visit</span>
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
