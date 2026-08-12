import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAdmin } from '../../context/AdminContext';
import { ImageDropzone } from './ImageDropzone';
import { GalleryFieldset } from './GalleryFieldset';
import type { DevelopmentUpdate } from '../../types';
import { X } from 'lucide-react';

interface UpdateFormModalProps {
  isOpen: boolean;
  /** Omit to create a new update; pass an existing one to edit it in place. */
  update?: DevelopmentUpdate | null;
  onClose: () => void;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const blankUpdate = (): DevelopmentUpdate => ({
  id: `update-${Date.now()}`,
  slug: '',
  title: 'New Development Update',
  date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  projectId: '',
  projectName: '',
  progressPercentage: 0,
  summary: 'Short summary shown on the updates card.',
  content: 'Write the full progress report here.',
  image: 'https://placehold.co/1200x675/004321/ffffff?text=LCPH+Update',
  gallery: [],
  featured: false,
  status: 'Under Construction',
});

const fieldClass =
  'w-full rounded-lg border border-outline-variant/60 bg-surface-container-lowest px-3 py-2 text-body-md text-on-surface outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15';
const labelClass = 'block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5';

export const UpdateFormModal: React.FC<UpdateFormModalProps> = ({ isOpen, update, onClose }) => {
  const { isAdmin, projects, updates, addUpdate, updateUpdateField } = useAdmin();
  const [draft, setDraft] = useState<DevelopmentUpdate>(blankUpdate);

  // Reopening the modal must always show the record it was opened for, never the last draft.
  useEffect(() => {
    if (isOpen) setDraft(update ? { ...update } : blankUpdate());
  }, [isOpen, update]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen || !isAdmin) return null;

  const set = <K extends keyof DevelopmentUpdate>(field: K, value: DevelopmentUpdate[K]) =>
    setDraft((prev) => ({ ...prev, [field]: value }));

  const handleProjectChange = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    setDraft((prev) => ({ ...prev, projectId, projectName: project?.name ?? '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // project_id is a NOT NULL foreign key, so saving without one fails at the database.
    if (!draft.projectId) return;

    const title = draft.title.trim() || 'Untitled Update';
    const record: DevelopmentUpdate = {
      ...draft,
      title,
      slug: slugify(draft.slug) || `${slugify(title)}-${Date.now()}`,
      progressPercentage: Math.min(100, Math.max(0, Number(draft.progressPercentage) || 0)),
    };

    if (update) {
      // Field-level commits keep undo/redo granular, matching the rest of the admin surface.
      (Object.keys(record) as (keyof DevelopmentUpdate)[]).forEach((field) => {
        if (JSON.stringify(record[field]) !== JSON.stringify(update[field])) {
          updateUpdateField(update.id, field, record[field]);
        }
      });
    } else {
      addUpdate(record);
    }

    // Only one update can occupy the banner, so promoting this one demotes the rest.
    if (record.featured) {
      updates
        .filter((item) => item.featured && item.id !== record.id)
        .forEach((item) => updateUpdateField(item.id, 'featured', false));
    }
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[rgba(24,28,36,0.75)] backdrop-blur-sm"
        onClick={onClose}
      />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 flex max-h-[90vh] w-full max-w-[720px] flex-col overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-low shadow-2xl"
      >
        <header className="flex items-center justify-between gap-4 border-b border-outline-variant/30 px-6 py-4">
          <div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              {update ? 'Edit Development Update' : 'Add Development Update'}
            </h3>
            <p className="text-body-sm text-on-surface-variant">
              Changes are staged — use Save in the admin toolbar to publish them.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Close"
            className="cursor-pointer rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-4 overflow-y-auto px-6 py-5">
          <div>
            <label className={labelClass} htmlFor="update-title">Title</label>
            <input
              id="update-title"
              className={fieldClass}
              value={draft.title}
              onChange={(e) => set('title', e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="update-slug">Slug</label>
              <input
                id="update-slug"
                className={fieldClass}
                placeholder="auto-generated from title"
                value={draft.slug}
                onChange={(e) => set('slug', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="update-date">Date</label>
              <input
                id="update-date"
                className={fieldClass}
                value={draft.date}
                onChange={(e) => set('date', e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="update-project">Project</label>
              <select
                id="update-project"
                required
                className={`${fieldClass} cursor-pointer`}
                value={draft.projectId}
                onChange={(e) => handleProjectChange(e.target.value)}
              >
                <option value="">— Select a project —</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="update-progress">
                Progress — {draft.progressPercentage}%
              </label>
              <input
                id="update-progress"
                type="range"
                min={0}
                max={100}
                step={1}
                className="mt-3 w-full cursor-pointer accent-primary"
                value={draft.progressPercentage}
                onChange={(e) => set('progressPercentage', Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="update-status">Status pill label</label>
            <input
              id="update-status"
              className={fieldClass}
              placeholder="Under Construction"
              value={draft.status ?? ''}
              onChange={(e) => set('status', e.target.value)}
            />
            <p className="mt-1 text-[11px] text-on-surface-variant">
              Shown in the outlined chip on the card. Leave blank to fall back to the progress-based label.
            </p>
          </div>

          <div>
            <label className={labelClass} htmlFor="update-summary">Summary (shown on the card)</label>
            <textarea
              id="update-summary"
              rows={3}
              className={`${fieldClass} resize-y`}
              value={draft.summary}
              onChange={(e) => set('summary', e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="update-content">Full report</label>
            <textarea
              id="update-content"
              rows={6}
              className={`${fieldClass} resize-y`}
              value={draft.content}
              onChange={(e) => set('content', e.target.value)}
            />
          </div>

          <ImageDropzone
            value={draft.image}
            onChange={(val) => set('image', val)}
            label="Cover Image"
          />

          <GalleryFieldset
            value={draft.gallery ?? []}
            onChange={(images) => set('gallery', images)}
          />

          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-4 py-3">
            <input
              type="checkbox"
              className="h-4 w-4 cursor-pointer accent-primary"
              checked={!!draft.featured}
              onChange={(e) => set('featured', e.target.checked)}
            />
            <span className="text-body-sm text-on-surface">
              <span className="font-bold">Featured</span> — show this update in the large banner card at the top of the page.
            </span>
          </label>
        </div>

        <footer className="flex justify-end gap-3 border-t border-outline-variant/30 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg bg-surface-container-high px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-highest"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-primary px-5 py-2 text-sm font-bold text-on-primary shadow-md transition-colors hover:bg-primary-container hover:text-on-primary-container"
          >
            {update ? 'Apply Changes' : 'Add Update'}
          </button>
        </footer>
      </form>
    </div>,
    document.body,
  );
};

export default UpdateFormModal;
