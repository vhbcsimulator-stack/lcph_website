import React, { useState } from 'react';
import { ImageDropzone } from './ImageDropzone';
import { Link2, X } from 'lucide-react';

interface GalleryFieldsetProps {
  /** Current gallery images (base64 data URLs or remote URLs). */
  value: string[];
  onChange: (images: string[]) => void;
  label?: string;
  hint?: string;
}

/**
 * Multi-image picker for a progress gallery: upload or paste as many photos as needed,
 * reorder-free list with per-image removal. Each pick appends rather than replacing,
 * which is what separates this from the single-image ImageDropzone it builds on.
 */
export const GalleryFieldset: React.FC<GalleryFieldsetProps> = ({
  value,
  onChange,
  label = 'Progress Gallery',
  hint = 'Add as many site photos as you need. These appear in the gallery on the update detail page.',
}) => {
  const [urlDraft, setUrlDraft] = useState('');

  const append = (src: string) => {
    const next = src.trim();
    if (next) onChange([...value, next]);
  };

  const removeAt = (index: number) => onChange(value.filter((_, i) => i !== index));

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
          {label}
        </span>
        <span className="text-[11px] text-on-surface-variant">
          {value.length} {value.length === 1 ? 'photo' : 'photos'}
        </span>
      </div>

      {value.length > 0 && (
        <ul className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {value.map((src, index) => (
            <li key={`${index}-${src.slice(-24)}`} className="group relative">
              <img
                src={src}
                alt={`Gallery image ${index + 1}`}
                className="aspect-square w-full rounded-lg border border-outline-variant/40 object-cover"
              />
              <button
                type="button"
                title="Remove image"
                onClick={() => removeAt(index)}
                className="absolute right-1 top-1 cursor-pointer rounded-full bg-red-600 p-1 text-white opacity-0 shadow transition-opacity hover:bg-red-500 group-hover:opacity-100 focus:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Key resets the dropzone after each pick so it never holds on to the last image */}
      <ImageDropzone
        key={value.length}
        value=""
        onChange={append}
        label="Add a photo"
        height="h-28"
      />

      <div className="mt-2 flex gap-2">
        <input
          type="url"
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              append(urlDraft);
              setUrlDraft('');
            }
          }}
          placeholder="…or paste an image URL"
          className="min-w-0 flex-1 rounded-lg border border-outline-variant/60 bg-surface-container-lowest px-3 py-2 text-sm text-on-surface outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
        <button
          type="button"
          onClick={() => { append(urlDraft); setUrlDraft(''); }}
          disabled={!urlDraft.trim()}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-surface-container-high px-3 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-highest disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Link2 className="h-4 w-4" />
          Add
        </button>
      </div>

      <p className="mt-1.5 text-[11px] text-on-surface-variant">{hint}</p>
    </div>
  );
};

export default GalleryFieldset;
