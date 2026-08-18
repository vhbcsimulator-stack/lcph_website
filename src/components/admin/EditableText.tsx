import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Check, Edit3, X } from 'lucide-react';

interface EditableTextProps {
  contentKey?: string; // used if editing static page content
  value?: string;      // used if editing inline data from database
  onSave?: (newValue: string) => void; // custom save callback
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'strong' | 'li';
  multiline?: boolean;
  /** Keeps the field in the text flow — use inside flex rows, buttons and links. */
  inline?: boolean;
  /** Static text shown after the value inside the same field, e.g. a unit or a word like "Estate". */
  suffix?: string;
}

export const EditableText: React.FC<EditableTextProps> = ({
  contentKey,
  value,
  onSave,
  className = '',
  tag = 'span',
  multiline = false,
  inline = false,
  suffix,
}) => {
  const { isAdmin, pageContent, updateText } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Determine current value to display.
  // A key with no row yet falls back to `value`, so newly added copy shows its default instead of
  // rendering blank until an admin saves it. An admin-cleared key stores '', which still wins.
  const currentValue = contentKey
    ? (pageContent[contentKey] ?? value ?? '')
    : (value || '');

  useEffect(() => {
    setEditValue(currentValue);
  }, [currentValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsEditing(false);
    if (editValue !== currentValue) {
      if (contentKey) {
        updateText(contentKey, editValue);
      }
      if (onSave) {
        onSave(editValue);
      }
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(false);
    setEditValue(currentValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(currentValue);
    }
  };

  // Prevents the surrounding link / button / accordion from firing while editing
  const swallow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Render normal view
  const Tag = tag;

  const displayValue = suffix ? `${currentValue} ${suffix}` : currentValue;

  if (!isAdmin) {
    return <Tag className={className}>{displayValue}</Tag>;
  }

  if (isEditing) {
    // Single-line fields keep the controls on the same row; only multiline stacks them.
    const controls = (
      <span className={`flex shrink-0 items-center gap-1 ${multiline ? 'justify-end' : ''}`}>
        <span
          role="button"
          tabIndex={0}
          onClick={handleCancel}
          className="flex h-7 w-7 items-center justify-center rounded bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface-variant cursor-pointer"
          title="Cancel"
        >
          <X className="w-4 h-4" />
        </span>
        <span
          role="button"
          tabIndex={0}
          onClick={handleSave}
          className="flex h-7 w-7 items-center justify-center rounded bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container cursor-pointer"
          title="Save"
        >
          <Check className="w-4 h-4" />
        </span>
      </span>
    );

    return (
      <span
        onClick={swallow}
        className={`relative z-20 gap-2 rounded border border-primary/50 bg-surface p-1.5 text-left shadow-md ${
          multiline ? 'flex flex-col' : 'inline-flex items-center align-middle'
        } ${inline && !multiline ? 'w-[min(280px,100%)]' : 'w-full'}`}
      >
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={4}
            className="w-full resize-y rounded border border-outline-variant p-2 font-body-md text-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-w-0 flex-1 rounded border border-outline-variant px-2 py-1 font-body-md text-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        )}
        {/* Rendered as spans so the control stays valid inside buttons and links */}
        {controls}
      </span>
    );
  }

  return (
    <span
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsEditing(true);
      }}
      /* Hidden until hover; border-current / bg-current keep it legible on dark photos and coloured buttons alike */
      className={`group/edit relative cursor-pointer rounded border border-dashed border-transparent transition-all duration-150 hover:border-current/70 hover:bg-current/10 ${
        inline ? 'inline-block align-middle' : 'block w-full'
      } ${className}`}
    >
      <Tag className={inline ? 'inline' : 'w-full pr-6 block'}>{displayValue}</Tag>
      {inline ? (
        <Edit3 className="w-3 h-3 ml-1 inline-block align-middle text-current opacity-0 transition-opacity duration-150 group-hover/edit:opacity-100" />
      ) : (
        <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md border border-outline-variant/30 bg-surface-container p-1 opacity-0 shadow-sm transition-opacity duration-150 group-hover/edit:opacity-100">
          <Edit3 className="w-3.5 h-3.5 text-primary" />
        </span>
      )}
    </span>
  );
};
