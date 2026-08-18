import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  /** Lucide icon shown in the badge above the title. */
  icon?: LucideIcon;
  /** Short headline, e.g. "No projects found". Accepts an EditableText so admins can reword it. */
  title: React.ReactNode;
  /** Optional supporting line: what will appear here, or how to widen the filters. */
  description?: React.ReactNode;
  /** Optional reset/browse control rendered under the copy. */
  action?: React.ReactNode;
  /** Tighter padding for indicators that sit inside a card or sub-section. */
  compact?: boolean;
  className?: string;
}

/**
 * The shared "nothing here" indicator, so an empty list always reads as deliberate rather than
 * as a section that failed to load.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  action,
  compact = false,
  className = '',
}) => (
  <div
    role="status"
    className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-outline-variant/60 bg-surface-container-lowest text-center ${
      compact ? 'px-5 py-8' : 'px-6 py-16'
    } ${className}`}
  >
    {/* rounded-[50%]: this theme redefines --radius-full to 0.75rem, so `rounded-full` is not a circle */}
    <span
      className={`flex items-center justify-center rounded-[50%] bg-primary/10 text-primary ${
        compact ? 'h-11 w-11' : 'h-14 w-14'
      }`}
    >
      <Icon className={compact ? 'h-5 w-5' : 'h-7 w-7'} aria-hidden="true" />
    </span>

    <p className={`font-headline-sm font-bold text-on-surface ${compact ? 'text-body-lg' : 'text-headline-sm'}`}>
      {title}
    </p>

    {/* Explicit ch width: `max-w-md` would resolve against this theme's --spacing-md (24px) */}
    {description && (
      <p className="max-w-[52ch] font-body-md text-body-sm leading-relaxed text-on-surface-variant">{description}</p>
    )}

    {action && <div className="mt-2 flex flex-wrap items-center justify-center gap-3">{action}</div>}
  </div>
);

export default EmptyState;
