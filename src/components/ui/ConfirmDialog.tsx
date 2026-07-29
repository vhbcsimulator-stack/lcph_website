import React from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        zIndex: 9999, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '1rem',
        boxSizing: 'border-box'
      }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/85 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(24, 28, 36, 0.75)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      />

      {/* Dialog container */}
      <div 
        className="relative bg-surface-container-low rounded-2xl border border-outline-variant/30 shadow-2xl p-6 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200 flex flex-col gap-4"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '512px',
          minWidth: '280px',
          backgroundColor: 'var(--color-surface-container-low, #eff4ff)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          borderRadius: '1rem',
          boxSizing: 'border-box',
          zIndex: 10000,
        }}
      >
        
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-500/10 text-red-600 rounded-full shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              {title}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-bold rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors cursor-pointer shadow-md"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
