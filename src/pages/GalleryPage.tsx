import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { useAdmin } from '../context/AdminContext';
import { EditableImage } from '../components/admin/EditableImage';
import { AddItemButton, DeleteItemButton } from '../components/admin/AddItemButton';
import { Lightbox } from '../components/ui/Lightbox';
import { EditableText } from '../components/admin/EditableText';
import { Image, Maximize2 } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const { gallery: galleryData, addGalleryItem, updateGalleryField, deleteGalleryItem } = useAdmin();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const categories = ['All', 'Aerial Views', 'Amenities', 'Properties', 'Progress'];

  const filteredItems = galleryData.filter(item => 
    selectedCategory === 'All' || item.category === selectedCategory
  );

  const imagesForLightbox = filteredItems.map(item => item.url);

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  /** Adds a placeholder tile the admin then edits in place. */
  const handleAddImage = () => {
    const stamp = Date.now();
    const placeholder = 'https://placehold.co/1200x900/004321/ffffff?text=LCPH+Gallery';
    addGalleryItem({
      id: `gal-${stamp}`,
      title: 'New gallery image',
      category: selectedCategory === 'All' ? 'Aerial Views' : (selectedCategory as any),
      mediaType: 'image',
      url: placeholder,
      thumbnail: placeholder,
    });
  };

  /** The tile shows the thumbnail and the lightbox shows the full image, so both move together. */
  const saveImage = (id: string, url: string) => {
    updateGalleryField(id, 'url', url);
    updateGalleryField(id, 'thumbnail', url);
  };

  return (
    <div className="overflow-hidden pb-xl">
      <div className="relative border-b border-outline-variant/20">
        <div className="container-custom relative pb-12 pt-sm md:pb-16">
        <Breadcrumbs items={[{ label: 'Media Gallery' }]} />

        {/* Page Header */}
        <div className="grid items-end gap-8 pt-8 md:grid-cols-[1fr_auto] md:pt-12">
          <div className="max-w-3xl">
          <EditableText 
            contentKey="gallery_title"
            tag="h1"
            className="font-headline-xl-mobile text-headline-xl-mobile font-bold capitalize tracking-tight text-primary md:font-headline-xl md:text-headline-xl"
          />
          <EditableText 
            contentKey="gallery_subtitle"
            tag="p"
            className="mt-3 max-w-2xl font-body-lg text-body-lg leading-relaxed text-on-surface-variant"
          />
          </div>

        </div>
        </div>
      </div>

      <div className="container-custom space-y-8 pt-10 md:pt-12">

        {/* Categories */}
        <div className="flex items-center justify-between gap-4 border-b border-outline-variant/20 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`cursor-pointer whitespace-nowrap rounded-full border px-5 py-2.5 font-label-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                selectedCategory === cat 
                  ? 'border-primary bg-primary text-on-primary shadow-md' 
                  : 'border-outline-variant/40 bg-surface-container-lowest text-on-surface-variant hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary hover:shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <p className="hidden text-body-sm text-on-surface-variant sm:block"><strong className="text-on-surface">{filteredItems.length}</strong> {filteredItems.length === 1 ? 'image' : 'images'}</p>
            <AddItemButton label="Add Image" onClick={handleAddImage} />
          </div>
        </div>

        {/* Gallery Grid */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={selectedCategory}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[270px] lg:grid-cols-12"
          >
          {filteredItems.map((item, idx) => {
            const editorialClass = idx === 0
              ? 'lg:col-span-7 lg:row-span-2'
              : idx === 1
                ? 'lg:col-span-5 lg:row-span-1'
                : idx === 2
                  ? 'lg:col-span-5 lg:row-span-1'
                  : 'lg:col-span-4 lg:row-span-1';
            // A div rather than a button, so the admin controls inside stay valid HTML
            return (
            <motion.div
              role="button"
              tabIndex={0}
              key={item.id}
              onClick={() => openLightbox(idx)}
              whileHover={prefersReducedMotion ? undefined : { y: -3 }}
              transition={{ duration: 0.24, ease: [0.2, 0, 0, 1] }}
              className={`group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-low text-left shadow-sm lg:aspect-auto ${editorialClass}`}
            >
              <EditableImage value={item.thumbnail} onSave={(val) => saveImage(item.id, val)}>
                {(src) => (
                  <img
                    src={src}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                  />
                )}
              </EditableImage>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95" />

              <DeleteItemButton onClick={() => deleteGalleryItem(item.id)} title="Delete image" />

              <div className="absolute inset-x-0 bottom-0 z-40 flex items-end justify-between gap-4 p-5 text-white md:p-6">
                <div>
                  <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-primary-fixed">
                    <EditableText
                      value={item.category}
                      onSave={(val) => updateGalleryField(item.id, 'category', val as typeof item.category)}
                      tag="span"
                      inline
                    />
                  </span>
                  <EditableText
                    value={item.title}
                    onSave={(val) => updateGalleryField(item.id, 'title', val)}
                    className={`line-clamp-2 font-headline-sm font-bold text-white ${idx === 0 ? 'text-headline-md md:text-[26px]' : 'text-base'}`}
                    tag="h3"
                  />
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/20 backdrop-blur-sm transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-primary">
                  <Maximize2 className="w-4 h-4 text-white group-hover:text-primary shrink-0" />
                </span>
              </div>
            </motion.div>
          );})}
          </motion.div>
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <div className="rounded-2xl border border-dashed border-outline-variant/60 bg-surface-container-lowest px-6 py-16 text-center">
            <Image className="w-9 h-9 mx-auto text-primary/55" />
            <EditableText
              contentKey="gallery_empty_title"
              value="No images in this collection"
              className="mt-4 block font-headline-sm text-headline-sm font-bold text-on-surface"
              tag="h2"
            />
            <button type="button" onClick={() => setSelectedCategory('All')} className="mt-5 cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-on-primary hover:bg-primary-container">
              <EditableText contentKey="gallery_empty_cta" value="View all images" tag="span" inline />
            </button>
          </div>
        )}
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
