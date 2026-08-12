import React from 'react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { EditableText } from '../components/admin/EditableText';
import { EditableRichText } from '../components/admin/EditableRichText';
import { Briefcase } from 'lucide-react';

export const CareersPage: React.FC = () => {
  return (
    <div className="space-y-xl py-sm">
      <div className="container-custom space-y-md">
        <Breadcrumbs items={[{ label: 'Careers' }]} />

        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-6 max-w-[672px] mx-auto py-12">
          <div className="bg-primary-container/20 text-primary p-6 rounded-full shadow-inner">
            <Briefcase className="w-16 h-16 text-primary animate-pulse" />
          </div>
          
          <EditableText 
            contentKey="careers_title"
            tag="h1"
            className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary font-bold"
          />
          
          <EditableText 
            contentKey="careers_status"
            tag="div"
            className="inline-block bg-secondary-fixed text-on-secondary-fixed font-label-lg text-label-lg px-4 py-1.5 rounded-full uppercase tracking-widest font-bold"
          />

          <EditableRichText
            contentKey="careers_text"
            className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};
export default CareersPage;

