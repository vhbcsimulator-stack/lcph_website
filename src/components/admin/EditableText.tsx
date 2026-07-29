import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Edit3, Check, X } from 'lucide-react';

interface EditableTextProps {
  contentKey?: string; // used if editing static page content
  value?: string;      // used if editing inline data from database
  onSave?: (newValue: string) => void; // custom save callback
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'strong';
  multiline?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({
  contentKey,
  value,
  onSave,
  className = '',
  tag = 'span',
  multiline = false,
}) => {
  const { isAdmin, pageContent, updateText } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Determine current value to display
  const currentValue = contentKey 
    ? (pageContent[contentKey] !== undefined ? pageContent[contentKey] : (value || '')) 
    : (value || '');

  useEffect(() => {
    setEditValue(currentValue);
  }, [currentValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
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

  // Render normal view
  const Tag = tag;

  if (!isAdmin) {
    return <Tag className={className}>{currentValue}</Tag>;
  }

  if (isEditing) {
    return (
      <div className="relative inline-block w-full border border-primary/50 bg-surface p-1 rounded z-50 shadow-md">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={4}
            className="w-full text-body-md text-on-surface p-2 border border-outline-variant rounded outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full text-body-md text-on-surface px-2 py-1 border border-outline-variant rounded outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        )}
        <div className="flex justify-end gap-1.5 mt-2">
          <button
            onClick={handleCancel}
            className="p-1 rounded bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface-variant cursor-pointer"
            title="Cancel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleSave}
            className="p-1 rounded bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container cursor-pointer"
            title="Save"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => setIsEditing(true)}
      className={`group/edit relative cursor-pointer hover:bg-primary-container/10 border border-transparent hover:border-dashed hover:border-primary/40 rounded transition-all duration-150 inline-block w-full ${className}`}
    >
      <Tag className="w-full pr-6 block">{currentValue}</Tag>
      <span className="absolute top-1/2 -translate-y-1/2 right-1.5 opacity-0 group-hover/edit:opacity-100 transition-opacity duration-150 p-1 bg-surface-container border border-outline-variant/30 rounded-md shadow-sm pointer-events-none">
        <Edit3 className="w-3.5 h-3.5 text-primary" />
      </span>
    </div>
  );
};
