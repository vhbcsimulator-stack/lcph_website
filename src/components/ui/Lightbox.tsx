import React, { useEffect, useCallback, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react';

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
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragOrigin = useRef({ pointerX: 0, pointerY: 0, imageX: 0, imageY: 0 });
  const imageAreaRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const resetZoom = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const changeZoom = useCallback((nextZoom: number) => {
    const clamped = Math.min(4, Math.max(1, nextZoom));
    setZoom(clamped);
    if (clamped === 1) setPosition({ x: 0, y: 0 });
  }, []);

  useEffect(() => resetZoom(), [currentIndex, isOpen, resetZoom]);

  useEffect(() => {
    const imageArea = imageAreaRef.current;
    if (!isOpen || !imageArea) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      changeZoom(zoom + (event.deltaY < 0 ? 0.25 : -0.25));
    };

    imageArea.addEventListener('wheel', handleWheel, { passive: false });
    return () => imageArea.removeEventListener('wheel', handleWheel);
  }, [changeZoom, isOpen, zoom]);

  // Keyboard navigation
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowLeft') onPrev();
      else if (e.key === 'ArrowRight') onNext();
      else if (e.key === 'Escape') onClose();
      else if (e.key === '+' || e.key === '=') changeZoom(zoom + 0.5);
      else if (e.key === '-') changeZoom(zoom - 0.5);
      else if (e.key === '0') resetZoom();
    },
    [isOpen, onPrev, onNext, onClose, changeZoom, resetZoom, zoom]
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
      data-lenis-prevent
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
          <div className="flex items-center gap-1 rounded-full bg-white/10 p-1">
            <button type="button" onClick={() => changeZoom(zoom - 0.5)} disabled={zoom <= 1} className="cursor-pointer rounded-full p-1.5 text-white/75 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30" aria-label="Zoom out">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="w-11 text-center text-xs font-semibold tabular-nums text-white/70">{Math.round(zoom * 100)}%</span>
            <button type="button" onClick={() => changeZoom(zoom + 0.5)} disabled={zoom >= 4} className="cursor-pointer rounded-full p-1.5 text-white/75 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30" aria-label="Zoom in">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button type="button" onClick={resetZoom} disabled={zoom === 1} className="cursor-pointer rounded-full p-1.5 text-white/75 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30" aria-label="Reset zoom">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
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
        ref={imageAreaRef}
        data-lenis-prevent-wheel
        className="flex-1 flex items-center justify-center relative min-h-0 overflow-hidden px-16"
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
          className={`max-w-full max-h-full object-contain rounded-lg shadow-2xl select-none animate-in fade-in duration-200 ${zoom > 1 ? isDragging ? 'cursor-grabbing' : 'cursor-grab' : 'cursor-zoom-in'}`}
          style={{
            maxHeight: 'calc(100vh - 180px)',
            transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${zoom})`,
            transition: isDragging ? 'none' : 'transform 180ms cubic-bezier(0.2, 0, 0, 1)',
            touchAction: 'none',
          }}
          draggable={false}
          onDoubleClick={() => zoom === 1 ? changeZoom(2) : resetZoom()}
          onPointerDown={(e) => {
            if (zoom <= 1) return;
            e.currentTarget.setPointerCapture(e.pointerId);
            dragOrigin.current = { pointerX: e.clientX, pointerY: e.clientY, imageX: position.x, imageY: position.y };
            setIsDragging(true);
          }}
          onPointerMove={(e) => {
            if (!isDragging) return;
            setPosition({
              x: dragOrigin.current.imageX + e.clientX - dragOrigin.current.pointerX,
              y: dragOrigin.current.imageY + e.clientY - dragOrigin.current.pointerY,
            });
          }}
          onPointerUp={() => setIsDragging(false)}
          onPointerCancel={() => setIsDragging(false)}
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
