import React, { useState } from 'react';
import { CheckCircle, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Amenity } from '../../types';
import { useAdmin } from '../../context/AdminContext';
import { EditableText } from '../admin/EditableText';
import { EditableImage } from '../admin/EditableImage';
import { ConfirmDialog } from '../ui/ConfirmDialog';

interface AmenityCardProps {
  amenity: Amenity;
}

export const AmenityCard: React.FC<AmenityCardProps> = ({ amenity }) => {
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

  return (
    <>
      <motion.div 
        whileHover={{ y: -6 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group h-full"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <EditableImage value={amenity.image} onSave={(val) => updateAmenityField(amenity.id, 'image', val)}>
            {(src) => (
              <img 
                src={src} 
                alt={amenity.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            )}
          </EditableImage>
          <span className="absolute top-3 left-3 bg-primary/90 text-on-primary text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded backdrop-blur-md z-10">
            {amenity.category}
          </span>
          {isAdmin && (
            <button
              type="button"
              onClick={handleDeleteClick}
              className="absolute top-3 right-3 bg-red-600 hover:bg-red-500 text-white p-2 rounded-full shadow-md z-20 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              title="Delete Amenity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <EditableText
              value={amenity.name}
              onSave={(val) => updateAmenityField(amenity.id, 'name', val)}
              className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors font-bold"
              tag="h3"
            />
            <EditableText
              value={amenity.description}
              onSave={(val) => updateAmenityField(amenity.id, 'description', val)}
              className="text-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed"
              tag="p"
              multiline={true}
            />
          </div>

          <div className="pt-3 border-t border-outline-variant/20 space-y-1">
            {amenity.highlights.slice(0, 3).map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-body-sm text-body-sm text-on-surface-variant">
                <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Delete Amenity"
        message={`Are you sure you want to permanently delete the amenity "${amenity.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </>
  );
};

