import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Wrench } from 'lucide-react';
import { EditableText } from '../components/admin/EditableText';
import { useNoIndexSeo } from '../seo/useSeo';

/**
 * Shown when a visitor reaches a page an admin has hidden.
 *
 * Deliberately says "under maintenance" rather than "not found": the page does exist and is coming
 * back, so this tells the visitor to return instead of concluding the link is dead.
 *
 * Still noindex — the copy promises the page will return, and a crawler that indexed this in place
 * of the real page would go on serving the maintenance notice in search results after it came back.
 */
export const MaintenancePage: React.FC = () => {
  useNoIndexSeo(
    'Under Maintenance | LCPH Realty Inc.',
    'This page is temporarily unavailable while we make updates. Please check back shortly.',
  );

  return (
    <div className="container-custom flex min-h-[60vh] items-center justify-center py-16 text-center">
      <div className="max-w-[448px] space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Wrench className="h-8 w-8" />
        </div>
        <h1 className="font-headline-sm text-xl font-bold text-on-surface">
          <EditableText contentKey="maintenance_title" value="Page Under Maintenance" tag="span" inline />
        </h1>
        <p className="text-body-sm text-on-surface-variant">
          <EditableText
            contentKey="maintenance_text"
            value="This page is temporarily unavailable while we make some updates. Please check back shortly."
            tag="span"
            inline
          />
        </p>
        <div className="flex justify-center gap-3 pt-4">
          <Link
            to="/"
            className="flex items-center gap-2 rounded bg-primary px-6 py-3 font-label-lg text-label-lg text-on-primary"
          >
            <Home className="h-4 w-4" />
            <EditableText contentKey="maintenance_cta" value="Return to Home" tag="span" inline />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
