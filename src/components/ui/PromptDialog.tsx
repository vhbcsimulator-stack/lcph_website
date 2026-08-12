import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Pencil } from 'lucide-react';

interface PromptDialogProps {
  isOpen: boolean;
  title: string;
  /** Optional supporting line under the title. */
  message?: string;
  label: string;
  placeholder?: string;
  initialValue?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Called with the trimmed value; never fires empty. */
  onSubmit: (value: string) => void;
  onCancel: () => void;
}

/**
 * The text-entry counterpart to ConfirmDialog — same shell, so admin prompts read as part of the
 * site rather than a browser dialog. Enter submits, Escape cancels.
 */
export const PromptDialog: React.FC<PromptDialogProps> = ({
  isOpen,
  title,
  message,
  label,
  placeholder,
  initialValue = '',
  confirmLabel = 'Save',
  cancelLabel = 'Cancel',
  onSubmit,
  onCancel,
}) => {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  // Each opening starts from the value it was opened with, never the last thing that was typed.
  useEffect(() => {
    if (isOpen) {
      setValue(initialValue);
      inputRef.current?.focus();
    }
  }, [isOpen, initialValue]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[rgba(24,28,36,0.75)] backdrop-blur-sm"
        onClick={onCancel}
      />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 flex w-full max-w-[512px] flex-col gap-4 rounded-2xl border border-outline-variant/30 bg-surface-container-low p-6 shadow-2xl"
      >
        <div className="flex items-start gap-4">
          <div className="shrink-0 rounded-full bg-primary/10 p-3 text-primary">
            <Pencil className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">{title}</h3>
            {message && (
              <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">{message}</p>
            )}
          </div>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
            {label}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={value}
            placeholder={placeholder}
            onChange={(e) => setValue(e.target.value)}
            className="w-full rounded-lg border border-outline-variant/60 bg-surface-container-lowest px-3 py-2 text-body-md text-on-surface outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </label>

        <div className="flex justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-lg bg-surface-container-high px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-highest"
          >
            {cancelLabel}
          </button>
          <button
            type="submit"
            disabled={!value.trim()}
            className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary shadow-md transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50"
          >
            {confirmLabel}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
};
