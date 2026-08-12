import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Amenity } from '../../types';
import { useAdmin } from '../../context/AdminContext';
import { EditableText } from '../admin/EditableText';
import { EditableRichText } from '../admin/EditableRichText';
import { EditableImage } from '../admin/EditableImage';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { CheckCircle, Trash2 } from 'lucide-react';

interface AmenityCardProps {
  amenity: Amenity;
  /** 'grid' is the stacked card used in listing grids; 'row' is the wide split panel used on the homepage. */
  variant?: 'grid' | 'row';
  /** Row variant only: places the image on the right instead of the left. */
  reverse?: boolean;
}

export const AmenityCard: React.FC<AmenityCardProps> = ({ amenity, variant = 'grid', reverse = false }) => {
  const { updateAmenityField, deleteAmenity, isAdmin } = useAdmin();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteAmenity(amenity.id);
    setIsConfirmOpen(false);
  };

  const isRow = variant === 'row';

  const handleHighlightSave = (index: number, newValue: string) => {
    const highlights = [...amenity.highlights];
    highlights[index] = newValue;
    updateAmenityField(amenity.id, 'highlights', highlights);
  };

  const image = (
    <EditableImage value={amenity.image} onSave={(val) => updateAmenityField(amenity.id, 'image', val)}>
      {(src) => (
        <img
          src={src}
          alt={amenity.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
    </EditableImage>
  );

  const deleteButton = isAdmin && (
    <button
      type="button"
      onClick={handleDeleteClick}
      className="absolute right-3 top-3 z-40 cursor-pointer rounded-full bg-red-600 p-2 text-white opacity-0 shadow-md transition-opacity duration-200 hover:bg-red-500 group-hover:opacity-100"
      title="Delete Amenity"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );

  const confirmDialog = (
    <ConfirmDialog
      isOpen={isConfirmOpen}
      title="Delete Amenity"
      message={`Are you sure you want to permanently delete the amenity "${amenity.name}"? This action cannot be undone.`}
      confirmLabel="Delete"
      onConfirm={handleConfirmDelete}
      onCancel={() => setIsConfirmOpen(false)}
    />
  );

  if (isRow) {
    return (
      <>
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="interactive-card group grid overflow-hidden rounded-DEFAULT border border-outline-variant/20 bg-surface-container-lowest shadow-sm transition-shadow md:grid-cols-2"
        >
          <div
            className={`relative h-[240px] overflow-hidden md:h-full md:min-h-[300px] ${reverse ? 'md:order-2' : ''}`}
          >
            {image}
            {deleteButton}
          </div>

          <div className="flex flex-col justify-center gap-4 p-8 lg:p-10">
            <span className="w-fit rounded-DEFAULT border border-outline-variant/40 px-3 py-1 font-label-lg text-[11px] uppercase tracking-wider text-on-surface-variant">
              <EditableText
                value={amenity.category}
                onSave={(val) => updateAmenityField(amenity.id, 'category', val as Amenity['category'])}
                tag="span"
                inline
              />
            </span>

            <EditableText
              value={amenity.name}
              onSave={(val) => updateAmenityField(amenity.id, 'name', val)}
              className="font-headline-md text-headline-md font-bold capitalize text-secondary"
              tag="h3"
            />

            <EditableRichText
              value={amenity.description}
              onSave={(val) => updateAmenityField(amenity.id, 'description', val)}
              className="font-body-md text-body-md capitalize leading-relaxed text-on-surface-variant"
              compact
            />

            <div className="space-y-1.5 pt-1">
              {amenity.highlights.slice(0, 3).map((h, i) => (
                <div key={i} className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
                  <CheckCircle className="w-4 h-4 shrink-0 text-primary" />
                  <EditableText value={h} onSave={(val) => handleHighlightSave(i, val)} tag="span" inline />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {confirmDialog}
      </>
    );
  }

  return (
    <>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="interactive-card group flex h-full flex-col overflow-hidden rounded-DEFAULT border border-outline-variant/20 bg-surface-container-lowest shadow-sm transition-all"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          {image}
          <span className="absolute left-3 top-3 z-40 rounded-DEFAULT bg-primary/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-on-primary backdrop-blur-md">
            <EditableText
              value={amenity.category}
              onSave={(val) => updateAmenityField(amenity.id, 'category', val as Amenity['category'])}
              tag="span"
              inline
            />
          </span>
          {deleteButton}
        </div>

        <div className="flex flex-1 flex-col justify-between space-y-3 p-5">
          <div>
            <EditableText
              value={amenity.name}
              onSave={(val) => updateAmenityField(amenity.id, 'name', val)}
              className="font-headline-sm text-headline-sm font-bold text-on-surface transition-colors group-hover:text-primary"
              tag="h3"
            />
            <EditableRichText
              value={amenity.description}
              onSave={(val) => updateAmenityField(amenity.id, 'description', val)}
              className="mt-2 font-body-sm text-body-sm leading-relaxed text-on-surface-variant"
              compact
            />
          </div>

          <div className="space-y-1 border-t border-outline-variant/20 pt-3">
            {amenity.highlights.slice(0, 3).map((h, i) => (
              <div key={i} className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
                <CheckCircle className="w-4 h-4 shrink-0 text-primary" />
                <EditableText value={h} onSave={(val) => handleHighlightSave(i, val)} tag="span" inline />
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {confirmDialog}
    </>
  );
};
