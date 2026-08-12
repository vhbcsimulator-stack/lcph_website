import React from 'react';
import { Link } from 'react-router-dom';
import type { DevelopmentUpdate } from '../../types';
import { useAdmin } from '../../context/AdminContext';
import { EditableText } from '../admin/EditableText';
import { EditableRichText } from '../admin/EditableRichText';
import { EditableImage } from '../admin/EditableImage';
import { DeleteItemButton } from '../admin/AddItemButton';
import { ArrowRight, Calendar, Flag, Pencil, Star } from 'lucide-react';

interface UpdateCardProps {
  update: DevelopmentUpdate;
  /** The featured variant puts the copy in a panel that overlaps the image. */
  variant?: 'grid' | 'featured';
  /** Opens the admin form for this update; the pencil button only renders when provided. */
  onEdit?: (update: DevelopmentUpdate) => void;
  /** Promotes this existing update and demotes the previously featured one. */
  onSetFeatured?: (id: string) => void;
}

/** Admins can set the label per update; otherwise it tracks progress. */
const statusLabel = (update: DevelopmentUpdate) =>
  update.status?.trim() ||
  (update.progressPercentage >= 100 ? 'Completed' : update.progressPercentage > 0 ? 'Under Construction' : 'Upcoming');

const StatusPill: React.FC<{ update: DevelopmentUpdate }> = ({ update }) => (
  <span className="inline-flex items-center rounded border border-outline-variant/60 px-2.5 py-1 font-label-lg text-[10px] uppercase tracking-[0.12em] text-on-surface-variant">
    {statusLabel(update)}
  </span>
);

const ProgressMeter: React.FC<{ progress: number }> = ({ progress }) => {
  // Data can arrive from an older row or a hand-edited field, so clamp before it reaches the width.
  const pct = Math.min(100, Math.max(0, Math.round(progress) || 0));

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between font-body-sm text-body-sm">
        <EditableText
          contentKey="card_update_progress_label"
          value="Overall Progress"
          className="font-semibold text-on-surface-variant"
          tag="span"
          inline
        />
        <span className="font-bold tabular-nums text-primary">{pct}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high"
      >
        <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

export const UpdateCard: React.FC<UpdateCardProps> = ({ update, variant = 'grid', onEdit, onSetFeatured }) => {
  const { isAdmin, updateUpdateField, deleteUpdate } = useAdmin();

  const adminControls = isAdmin && (
    <>
      {onSetFeatured && (
        <button
          type="button"
          title={update.featured ? 'Currently featured' : 'Set as featured update'}
          aria-label={update.featured ? `${update.title} is featured` : `Feature ${update.title}`}
          aria-pressed={!!update.featured}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSetFeatured(update.id);
          }}
          className={`absolute right-24 top-3 z-40 cursor-pointer rounded-full p-2 text-white shadow-md transition-all duration-200 group-hover:opacity-100 ${
            update.featured
              ? 'bg-emerald-500 opacity-100 hover:bg-emerald-400'
              : 'bg-slate-700/90 opacity-0 hover:bg-emerald-500'
          }`}
        >
          <Star className={`h-4 w-4 ${update.featured ? 'fill-current' : ''}`} />
        </button>
      )}
      {onEdit && (
        <button
          type="button"
          title="Edit this update"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEdit(update);
          }}
          className="absolute right-14 top-3 z-40 cursor-pointer rounded-full bg-emerald-600 p-2 text-white opacity-0 shadow-md transition-opacity duration-200 hover:bg-emerald-500 group-hover:opacity-100"
        >
          <Pencil className="h-4 w-4" />
        </button>
      )}
      <DeleteItemButton title="Delete this update" onClick={() => deleteUpdate(update.id)} />
    </>
  );

  const image = (
    <EditableImage value={update.image} onSave={(val) => updateUpdateField(update.id, 'image', val)}>
      {(src) => (
        <img
          src={src}
          alt={update.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
      )}
    </EditableImage>
  );

  if (variant === 'featured') {
    return (
      <article className="group relative md:pb-10">
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg shadow-sm md:aspect-[16/9] md:w-[62%]">
          {image}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-5 z-30 flex h-11 w-12 items-center justify-center rounded-r-xl border-y border-r border-emerald-200/80 bg-emerald-500 text-white shadow-[0_8px_24px_rgba(16,185,129,0.32)]"
          >
            <span className="absolute inset-y-1 right-1 w-px bg-white/45" />
            <Flag className="relative h-5 w-5 fill-current" strokeWidth={2.25} />
          </div>
          {adminControls}
        </div>

        <div className="relative z-10 -mt-6 mx-4 space-y-3 rounded-lg border border-outline-variant/20 border-t-2 border-t-emerald-500 bg-surface-container-lowest p-6 shadow-xl md:absolute md:right-0 md:top-1/2 md:mx-0 md:mt-0 md:w-[52%] md:-translate-y-1/2 md:p-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <StatusPill update={update} />
            <span className="inline-flex items-center gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              {update.date}
            </span>
          </div>

          <EditableText
            value={update.title}
            onSave={(val) => updateUpdateField(update.id, 'title', val)}
            className="block font-headline-sm text-headline-sm font-bold leading-snug text-on-surface transition-colors group-hover:text-primary"
            tag="h3"
          />

          <EditableRichText
            value={update.summary}
            onSave={(val) => updateUpdateField(update.id, 'summary', val)}
            className="block font-body-sm text-body-sm leading-relaxed text-on-surface-variant"
            compact
          />

          <ProgressMeter progress={update.progressPercentage} />

          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-outline-variant/20 pt-3">
            <span className="font-body-sm text-body-sm font-semibold text-on-surface">{update.projectName}</span>
            <Link
              to={`/updates/${update.slug}`}
              className="group/link inline-flex cursor-pointer items-center gap-1.5 font-label-lg text-label-lg text-primary hover:underline"
            >
              <EditableText contentKey="card_update_cta" value="Read Full Update Report" tag="span" inline />
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="interactive-card group flex flex-col overflow-hidden rounded-lg border border-outline-variant/20 bg-surface-container-lowest shadow-sm transition-all duration-300">
      <div className="relative aspect-[16/10] overflow-hidden">
        {image}
        {adminControls}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <StatusPill update={update} />
          <span className="inline-flex items-center gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            {update.date}
          </span>
        </div>

        <EditableText
          value={update.title}
          onSave={(val) => updateUpdateField(update.id, 'title', val)}
          className="block font-headline-sm text-headline-sm font-bold leading-snug text-on-surface transition-colors group-hover:text-primary"
          tag="h3"
        />

        <EditableRichText
          value={update.summary}
          onSave={(val) => updateUpdateField(update.id, 'summary', val)}
          className="block font-body-sm text-body-sm leading-relaxed text-on-surface-variant"
          compact
        />

        {/* mt-auto pins the meter and footer down so cards in a row share one baseline. */}
        <div className="mt-auto">
          <ProgressMeter progress={update.progressPercentage} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-outline-variant/20 pt-3">
          <span className="font-body-sm text-body-sm font-semibold text-on-surface">{update.projectName}</span>
          <Link
            to={`/updates/${update.slug}`}
            className="group/link inline-flex cursor-pointer items-center gap-1.5 font-label-lg text-label-lg text-primary hover:underline"
          >
            <EditableText contentKey="card_update_cta" value="Read Full Update Report" tag="span" inline />
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
};
export default UpdateCard;
