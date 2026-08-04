import React from 'react';
import { Link } from 'react-router-dom';
import type { DevelopmentUpdate } from '../../types';
import { useAdmin } from '../../context/AdminContext';
import { EditableText } from '../admin/EditableText';
import { EditableImage } from '../admin/EditableImage';
import { Activity, ArrowRight, Calendar } from 'lucide-react';

interface UpdateCardProps {
  update: DevelopmentUpdate;
}

export const UpdateCard: React.FC<UpdateCardProps> = ({ update }) => {
  const { updateUpdateField } = useAdmin();

  return (
    <article className="interactive-card bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden shadow-sm transition-all duration-300 flex flex-col group">
      <div className="relative aspect-[16/9] overflow-hidden">
        <EditableImage value={update.image} onSave={(val) => updateUpdateField(update.id, 'image', val)}>
          {(src) => (
            <img
              src={src}
              alt={update.title}
              className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"
            />
          )}
        </EditableImage>
        <div className="absolute top-3 left-3 z-40 bg-on-background/90 text-white text-[11px] font-bold px-2.5 py-1 rounded backdrop-blur-md flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-primary-fixed" />
          <span>
            {update.progressPercentage}%{' '}
            <EditableText contentKey="card_update_badge_label" value="Completed" tag="span" inline />
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-2 text-body-sm text-body-sm text-on-surface-variant font-medium mb-1">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{update.date}</span>
            <span>•</span>
            <span className="font-semibold text-on-surface">{update.projectName}</span>
          </div>

          <EditableText
            value={update.title}
            onSave={(val) => updateUpdateField(update.id, 'title', val)}
            className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors line-clamp-2 font-bold"
            tag="h3"
          />

          <EditableText
            value={update.summary}
            onSave={(val) => updateUpdateField(update.id, 'summary', val)}
            className="text-body-sm text-body-sm text-on-surface-variant mt-2 line-clamp-2 leading-relaxed"
            tag="p"
            multiline={true}
          />
        </div>

        {/* Progress Bar */}
        <div className="pt-3 border-t border-outline-variant/20">
          <div className="flex items-center justify-between text-body-sm text-on-surface-variant mb-1 font-semibold">
            <EditableText contentKey="card_update_progress_label" value="Overall Status" tag="span" inline />
            <span className="text-primary">{update.progressPercentage}%</span>
          </div>
          <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500" 
              style={{ width: `${update.progressPercentage}%` }}
            />
          </div>
        </div>

        <Link
          to={`/updates/${update.slug}`}
          className="group/link inline-flex items-center gap-1.5 text-label-lg font-label-lg text-primary hover:underline pt-1 cursor-pointer"
        >
          <EditableText contentKey="card_update_cta" value="Read Full Update Report" tag="span" inline />
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
        </Link>
      </div>
    </article>
  );
};
export default UpdateCard;
