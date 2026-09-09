import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useVisibility } from '../../hooks/useVisibility';
import { VISIBILITY_SECTIONS } from '../../data/visibility';

interface HideableProps {
  /** Section id from VISIBILITY_SECTIONS. */
  id: string;
  children: React.ReactNode;
  /** Extra classes for the wrapper. It is a plain block element, so section layout is unchanged. */
  className?: string;
  /** Placement of the toggle, for sections whose own controls sit in the default top-right corner. */
  toggleClassName?: string;
}

const labelFor = (id: string) => VISIBILITY_SECTIONS.find((section) => section.id === id)?.label ?? id;

/**
 * Wraps a section so an admin can hide it from the public site.
 *
 * Visitors never render a hidden section at all. Admins always render it — dimmed and outlined when
 * hidden — because a section that vanished from the editor could not be brought back in place.
 */
export const Hideable: React.FC<HideableProps> = ({
  id,
  children,
  className = '',
  toggleClassName = 'right-4 top-4',
}) => {
  const { isAdmin, isSectionHidden, toggleSection } = useVisibility();
  const hidden = isSectionHidden(id);

  if (hidden && !isAdmin) return null;

  if (!isAdmin) return <>{children}</>;

  return (
    <div
      data-hidden-section={hidden ? 'true' : undefined}
      className={`group/hideable relative ${hidden ? 'opacity-40 grayscale' : ''} ${className}`}
    >
      {hidden && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-2 z-20 rounded-xl border-2 border-dashed border-amber-500/70"
        />
      )}

      {/* z-30 sits above in-page edit shells but below the sticky header (z-70). */}
      <div
        className={`absolute z-30 transition-opacity ${toggleClassName} ${
          hidden ? 'opacity-100' : 'opacity-0 focus-within:opacity-100 group-hover/hideable:opacity-100'
        }`}
      >
        <button
          type="button"
          onClick={() => toggleSection(id)}
          title={
            hidden
              ? `"${labelFor(id)}" is hidden from the public site. Click to show it.`
              : `Hide "${labelFor(id)}" from the public site.`
          }
          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider shadow-lg transition-colors ${
            hidden
              ? 'bg-amber-500 text-white hover:bg-amber-400'
              : 'bg-[#0d1c2f]/90 text-white hover:bg-[#17314f]'
          }`}
        >
          {hidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {hidden ? 'Hidden' : 'Hide'}
        </button>
      </div>

      {children}
    </div>
  );
};

export default Hideable;
