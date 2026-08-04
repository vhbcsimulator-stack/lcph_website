import React, { useState } from 'react';
import { X } from 'lucide-react';
import { EditableText } from '../admin/EditableText';

export const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-primary text-on-primary py-xs px-margin-desktop relative text-center">
      <EditableText
        contentKey="announcement_text"
        value="Discover your dream home at Lakeshore. New phases now pre-selling!"
        className="font-body-sm text-body-sm"
        tag="p"
        multiline={true}
      />
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-on-primary hover:opacity-80 cursor-pointer flex items-center justify-center"
        aria-label="Close announcement"
      >
        <X className="w-4.5 h-4.5" />
      </button>
    </div>
  );
};
