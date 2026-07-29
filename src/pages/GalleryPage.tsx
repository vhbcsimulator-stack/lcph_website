import React, { useState } from 'react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { galleryData } from '../data/galleryData';
import { Lightbox } from '../components/ui/Lightbox';
import { Maximize2 } from 'lucide-react';
import { EditableText } from '../components/admin/EditableText';

export const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const categories = ['All', 'Aerial Views', 'Amenities', 'Properties', 'Progress'];

  const filteredItems = galleryData.filter(item => 
    selectedCategory === 'All' || item.category === selectedCategory
  );

  const imagesForLightbox = filteredItems.map(item => item.url);

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  return (
    <div className="space-y-xl py-sm">
      <div className="container-custom space-y-md">
        <Breadcrumbs items={[{ label: 'Media Gallery' }]} />

        {/* Page Header */}
        <div className="space-y-xs">
          <EditableText 
            contentKey="gallery_title"
            tag="h1"
            className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary font-bold"
          />
          <EditableText 
            contentKey="gallery_subtitle"
            tag="p"
            className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-outline-variant/20">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded font-label-lg text-label-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat 
                  ? 'bg-primary text-on-primary shadow-sm' 
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {filteredItems.map((item, idx) => (
            <div 
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm border border-outline-variant/20 cursor-pointer"
            >
              <img 
                src={item.thumbnail} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary-fixed block mb-1">
                    {item.category}
                  </span>
                  <h3 className="font-headline-sm text-sm text-white line-clamp-1">{item.title}</h3>
                </div>
                <Maximize2 className="w-5 h-5 text-white/80 group-hover:text-white shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Lightbox 
        isOpen={lightboxOpen} 
        images={imagesForLightbox} 
        currentIndex={lightboxIndex} 
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : imagesForLightbox.length - 1))}
        onNext={() => setLightboxIndex((prev) => (prev < imagesForLightbox.length - 1 ? prev + 1 : 0))}
        title={filteredItems[lightboxIndex]?.title}
      />
    </div>
  );
};
export default GalleryPage;
