import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onJump?: (index: number) => void;
  title?: string;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
  onJump,
  title,
}) => {
  // Keyboard navigation
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowLeft') onPrev();
      else if (e.key === 'ArrowRight') onNext();
      else if (e.key === 'Escape') onClose();
    },
    [isOpen, onPrev, onNext, onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen || images.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[300] bg-black/95 flex flex-col backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {title ? (
          <span className="text-white/80 text-sm font-semibold truncate max-w-xs">
            {title}
          </span>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-3">
          <span className="text-white/50 text-sm tabular-nums">
            {currentIndex + 1} / {images.length}
          </span>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main image area */}
      <div
        className="flex-1 flex items-center justify-center relative min-h-0 px-16"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Prev button */}
        {images.length > 1 && (
          <button
            onClick={onPrev}
            className="absolute left-3 z-10 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/25 transition-all cursor-pointer"
            aria-label="Previous"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
        )}

        {/* Image */}
        <img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${title ? title + ' – ' : ''}Photo ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl select-none animate-in fade-in zoom-in-95 duration-200"
          style={{ maxHeight: 'calc(100vh - 180px)' }}
          draggable={false}
        />

        {/* Next button */}
        {images.length > 1 && (
          <button
            onClick={onNext}
            className="absolute right-3 z-10 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/25 transition-all cursor-pointer"
            aria-label="Next"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-3 overflow-x-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (onJump) {
                  onJump(idx);
                } else {
                  const diff = idx - currentIndex;
                  if (diff > 0) for (let i = 0; i < diff; i++) onNext();
                  else if (diff < 0) for (let i = 0; i < -diff; i++) onPrev();
                }
              }}
              className={`
                flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border-2 cursor-pointer transition-all duration-150
                ${idx === currentIndex
                  ? 'border-white scale-110 shadow-lg'
                  : 'border-white/20 opacity-50 hover:opacity-80 hover:border-white/50'
                }
              `}
              aria-label={`Go to photo ${idx + 1}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" draggable={false} />
            </button>
          ))}
        </div>
      )}

      {/* Keyboard hint */}
      <div className="flex-shrink-0 text-center pb-2">
        <span className="text-white/25 text-[11px]">
          ← → to navigate · Esc to close
        </span>
      </div>
    </div>
  );
};
