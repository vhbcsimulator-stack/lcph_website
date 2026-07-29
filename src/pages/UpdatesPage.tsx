import React from 'react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { UpdateCard } from '../components/cards/UpdateCard';
import { EditableText } from '../components/admin/EditableText';
import { useAdmin } from '../context/AdminContext';

export const UpdatesPage: React.FC = () => {
  const { updates } = useAdmin();

  return (
    <div className="space-y-xl py-sm">
      <div className="container-custom space-y-md">
        <Breadcrumbs items={[{ label: 'Development Updates' }]} />

        {/* Page Header */}
        <div className="space-y-xs">
          <EditableText 
            contentKey="updates_title"
            tag="h1"
            className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary font-bold"
          />
          <EditableText 
            contentKey="updates_subtitle"
            tag="p"
            className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed"
          />
        </div>

        {/* Grid of Update Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {updates.map(update => (
            <UpdateCard key={update.id} update={update} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default UpdatesPage;

