import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAdmin } from '../../context/AdminContext';
import { Map, X } from 'lucide-react';

interface EditableEmbedProps {
  /** page_content key holding the embed URL. */
  contentKey: string;
  /** Fallback URL used until an admin saves one. */
  value?: string;
  title: string;
  className?: string;
}

/**
 * Pulls the src out of a pasted `<iframe …>` snippet, or accepts a bare URL.
 * Returns null when the result isn't a plain https URL, so nothing unsafe reaches the iframe.
 */
export const parseEmbedUrl = (input: string): string | null => {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const fromIframe = /<iframe[^>]*\ssrc=["']([^"']+)["']/i.exec(trimmed);
  const candidate = (fromIframe ? fromIframe[1] : trimmed).trim();

  try {
    const url = new URL(candidate);
    if (url.protocol !== 'https:') return null;
    return url.toString();
  } catch {
    return null;
  }
};

/** A map/video embed whose URL an admin can replace by pasting Google's embed code. */
export const EditableEmbed: React.FC<EditableEmbedProps> = ({ contentKey, title, className }) => {
  const { isAdmin, pageContent, updateText } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');

  const currentUrl = pageContent[contentKey] ?? '';

  const openEditor = () => {
    setDraft(currentUrl);
    setError('');
    setIsEditing(true);
  };

  const handleSave = () => {
    const parsed = parseEmbedUrl(draft);
    if (!parsed) {
      setError('Paste a Google Maps embed code (the full <iframe> snippet) or an https:// URL.');
      return;
    }
    updateText(contentKey, parsed);
    setIsEditing(false);
  };

  const frame = (
    <iframe
      src={currentUrl}
      className={className}
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      title={title}
    />
  );

  if (!isAdmin) return frame;

  return (
    <>
      {frame}

      <button
        type="button"
        onClick={openEditor}
        className="absolute right-4 top-4 z-40 flex items-center gap-2 rounded-lg border border-white/20 bg-[#0d1c2f]/90 px-3.5 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-md transition-colors hover:bg-[#0d1c2f] cursor-pointer"
      >
        <Map className="w-4 h-4 text-emerald-400" />
        <span>Change Map</span>
      </button>

      {isEditing &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/65 p-6 backdrop-blur-sm"
            onClick={() => setIsEditing(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[560px] space-y-4 rounded-2xl border border-outline-variant/30 bg-surface p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h4 className="flex items-center gap-2 text-sm font-bold text-on-surface">
                  <Map className="w-4 h-4 text-primary" />
                  Change Map Embed
                </h4>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="cursor-pointer rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container-low"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs leading-relaxed text-on-surface-variant">
                In Google Maps choose <strong>Share → Embed a map → Copy HTML</strong>, then paste it below. A plain
                embed URL works too.
              </p>

              <textarea
                autoFocus
                rows={5}
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  setError('');
                }}
                placeholder='<iframe src="https://www.google.com/maps/embed?pb=..." …></iframe>'
                className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-3 font-mono text-xs text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />

              {error && <p className="text-xs font-medium text-red-500">{error}</p>}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="cursor-pointer rounded-lg border border-outline-variant px-4 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-container-low"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary transition-colors hover:bg-primary-container hover:text-on-primary-container"
                >
                  Save
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default EditableEmbed;
