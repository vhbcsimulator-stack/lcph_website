import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Activity } from 'lucide-react';
import type { DevelopmentUpdate } from '../../types';

interface UpdateCardProps {
  update: DevelopmentUpdate;
}

export const UpdateCard: React.FC<UpdateCardProps> = ({ update }) => {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img 
          src={update.image} 
          alt={update.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-on-background/90 text-white text-[11px] font-bold px-2.5 py-1 rounded backdrop-blur-md flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-primary-fixed" />
          <span>{update.progressPercentage}% Completed</span>
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

          <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors line-clamp-2 font-bold">
            {update.title}
          </h3>

          <p className="text-body-sm text-body-sm text-on-surface-variant mt-2 line-clamp-2 leading-relaxed">
            {update.summary}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="pt-3 border-t border-outline-variant/20">
          <div className="flex items-center justify-between text-body-sm text-on-surface-variant mb-1 font-semibold">
            <span>Overall Status</span>
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
          className="inline-flex items-center gap-1.5 text-label-lg font-label-lg text-primary hover:underline pt-1 cursor-pointer"
        >
          <span>Read Full Update Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
export default UpdateCard;
