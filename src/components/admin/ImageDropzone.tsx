import React, { useRef, useState, useCallback } from 'react';
import { compressImage } from '../../utils/image';
import { Image, UploadCloud, X } from 'lucide-react';

interface ImageDropzoneProps {
  value: string; // base64 or URL
  onChange: (base64: string) => void;
  label?: string;
  height?: string; // tailwind height class e.g. 'h-36'
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  value,
  onChange,
  label = 'Cover Image',
  height = 'h-36',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

  const processFile = useCallback(async (file: File) => {
    setError('');
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, WebP, etc.)');
      return;
    }
    try {
      const compressedData = await compressImage(file);
      onChange(compressedData);
    } catch (err) {
      setError('Failed to process image.');
      console.error(err);
    }
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setError('');
  };

  return (
    <div className="space-y-1">
      <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">{label}</p>

      {value ? (
        /* Preview with remove button */
        <div className={`relative rounded-xl overflow-hidden border border-outline-variant/30 ${height} group`}>
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="bg-white text-on-surface text-xs font-bold px-3 py-1.5 rounded-lg shadow hover:bg-surface-container-low cursor-pointer"
              >
                Change
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow hover:bg-red-700 cursor-pointer flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Drop zone */
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            ${height} border-2 border-dashed rounded-xl cursor-pointer
            flex flex-col items-center justify-center gap-2 text-center px-4
            transition-all duration-200
            ${dragging
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : 'border-outline-variant/50 bg-surface-container-lowest hover:border-primary/50 hover:bg-primary/5'
            }
          `}
        >
          <div className={`p-3 rounded-full transition-colors ${dragging ? 'bg-primary/10' : 'bg-surface-container-low'}`}>
            {dragging
              ? <Image className="w-6 h-6 text-primary" />
              : <UploadCloud className="w-6 h-6 text-on-surface-variant" />
            }
          </div>
          <div>
            <p className="text-sm font-semibold text-on-surface">
              {dragging ? 'Drop image here' : 'Drag & drop an image'}
            </p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              or <span className="text-primary font-bold underline">click to browse</span> · JPG, PNG, WebP
            </p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
          <X className="w-3.5 h-3.5" /> {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInput}
      />
    </div>
  );
};
