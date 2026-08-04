import React, { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useAdmin } from '../../context/AdminContext';
import { compressImage } from '../../utils/image';
import { Image, UploadCloud, X } from 'lucide-react';

interface EditableImageProps {
  contentKey?: string; // used if editing static page images
  value?: string;      // used if editing inline data from database
  onSave?: (newValue: string) => void; // custom save callback
  overlayClassName?: string; // custom overlay classes for positioning
  children: (src: string) => React.ReactNode;
}

export const EditableImage: React.FC<EditableImageProps> = ({
  contentKey,
  value,
  onSave,
  overlayClassName,
  children,
}) => {
  const { isAdmin, pageContent, updateImage } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Determine current image URL
  const currentUrl = contentKey ? (pageContent[contentKey] || '') : (value || '');

  const processFile = useCallback(async (file: File) => {
    setError('');
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }
    try {
      const compressedData = await compressImage(file);
      setPreviewUrl(compressedData);
    } catch (err) {
      setError('Failed to process image.');
      console.error(err);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const openEditor = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl('');
    setError('');
    setIsEditing(true);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const finalUrl = previewUrl || currentUrl;
    setIsEditing(false);
    if (finalUrl !== currentUrl) {
      if (contentKey) updateImage(contentKey, finalUrl);
      if (onSave) onSave(finalUrl);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
    setPreviewUrl('');
    setError('');
  };

  const renderNormal = children(currentUrl);

  if (!isAdmin) {
    return <>{renderNormal}</>;
  }

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group overflow-hidden w-full h-full"
    >
      {renderNormal}

      {/* Hover edit overlay */}
      {!isEditing && (
        <div 
          className={`absolute inset-0 bg-black/40 transition-opacity duration-200 z-30 ${
            overlayClassName ? overlayClassName : 'p-4 flex items-center justify-center'
          } ${
            isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <button
            onClick={openEditor}
            className="flex items-center gap-2 bg-[#0d1c2f]/90 border border-white/20 text-white font-semibold text-xs px-3.5 py-2 rounded-lg shadow-lg hover:bg-[#0d1c2f] transition-all cursor-pointer backdrop-blur-md"
          >
            <Image className="w-4 h-4 text-emerald-400" />
            <span>Change Image</span>
          </button>
        </div>
      )}

      {/* Portal: renders outside parent so it's never compressed */}
      {isEditing && createPortal(
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={handleCancel}
        >
          {/* Dialog card — stop propagation so clicking inside doesn't close */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '440px',
              flexShrink: 0,
              boxSizing: 'border-box',
            }}
            className="bg-surface border border-outline-variant/30 rounded-2xl p-6 shadow-2xl space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-on-surface flex items-center gap-2">
                <Image className="w-4 h-4 text-primary" />
                Change Image
              </h4>
              <button
                onClick={handleCancel}
                className="p-1.5 rounded-lg hover:bg-surface-container-low cursor-pointer text-on-surface-variant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drop zone */}
            <div
              onClick={() => inputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              className={`
                h-40 border-2 border-dashed rounded-xl cursor-pointer
                flex flex-col items-center justify-center gap-3 transition-all duration-200
                ${dragging
                  ? 'border-primary bg-primary/5 scale-[1.01]'
                  : 'border-outline-variant/50 bg-surface-container-lowest hover:border-primary/50 hover:bg-primary/5'
                }
              `}
            >
              <UploadCloud className={`w-8 h-8 transition-colors ${dragging ? 'text-primary' : 'text-on-surface-variant'}`} />
              <div className="text-center px-4">
                <p className="text-sm font-semibold text-on-surface">
                  {dragging ? 'Drop to upload' : 'Drag & drop an image'}
                </p>
                <p className="text-xs text-on-surface-variant mt-1">
                  or <span className="text-primary font-bold underline">click to browse</span>
                </p>
              </div>
            </div>

            {/* Preview of newly selected image */}
            {previewUrl && (
              <div className="relative rounded-xl overflow-hidden h-32 border border-outline-variant/30">
                <img src={previewUrl} alt="New preview" className="w-full h-full object-cover" />
                <button
                  onClick={(e) => { e.stopPropagation(); setPreviewUrl(''); }}
                  className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {error && (
              <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                <X className="w-3.5 h-3.5" /> {error}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-bold border border-outline-variant rounded-lg hover:bg-surface-container-low text-on-surface-variant cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!previewUrl}
                className="px-4 py-2 text-sm font-bold rounded-lg bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInput}
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
