import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Calendar, Activity, ArrowLeft, X, UploadCloud } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { EditableText } from '../components/admin/EditableText';
import { EditableImage } from '../components/admin/EditableImage';
import { compressImage } from '../utils/image';

export const UpdatesDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { updates, loading, updateUpdateField, isAdmin, projects } = useAdmin();
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const update = updates.find(u => u.slug === slug || u.id === slug);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
        <p className="text-sm font-semibold text-on-surface-variant">Loading update details...</p>
      </div>
    );
  }

  if (!update) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-4">
        <p className="text-on-surface-variant font-body-lg">Development update not found.</p>
        <Link to="/updates" className="text-primary hover:underline font-semibold">Back to all updates</Link>
      </div>
    );
  }

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressedData = await compressImage(file);
      const newGallery = [...(update.gallery || []), compressedData];
      updateUpdateField(update.id, 'gallery', newGallery);
    } catch (err) {
      console.error('Failed to compress gallery image:', err);
    }
    e.target.value = '';
  };

  return (
    <div className="space-y-xl py-sm">
      <div className="container-custom space-y-md max-w-4xl mx-auto">
        <Breadcrumbs items={[
          { label: 'Development Updates', path: '/updates' },
          { label: update.title }
        ]} />

        <div className="space-y-sm">
          <div className="flex flex-wrap items-center gap-2">
            {isAdmin ? (
              <select
                value={update.projectId}
                onChange={(e) => {
                  const selectedProj = projects.find(p => p.id === e.target.value);
                  if (selectedProj) {
                    updateUpdateField(update.id, 'projectId', selectedProj.id);
                    updateUpdateField(update.id, 'projectName', selectedProj.name);
                  }
                }}
                className="bg-primary text-on-primary text-xs font-bold px-3 py-1 rounded outline-none border border-primary-container cursor-pointer"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id} className="text-on-surface bg-surface">
                    {p.name}
                  </option>
                ))}
              </select>
            ) : (
              <span className="bg-primary text-on-primary text-xs font-bold px-3 py-1 rounded">
                {update.projectName}
              </span>
            )}
            <span className="bg-surface-container-high text-on-surface text-xs font-bold px-3 py-1 rounded flex items-center gap-2 border border-outline-variant/30">
              <Activity className="w-4 h-4 text-primary" />
              {isAdmin ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={update.progressPercentage}
                    onChange={(e) => updateUpdateField(update.id, 'progressPercentage', parseInt(e.target.value) || 0)}
                    className="w-12 bg-transparent text-on-surface font-bold outline-none border-b border-primary/45 focus:border-primary text-center py-0.5"
                  />
                  <span>% Overall</span>
                </div>
              ) : (
                <span>{update.progressPercentage}% Overall Progress</span>
              )}
            </span>
          </div>

          <EditableText
            value={update.title}
            onSave={(val: string) => updateUpdateField(update.id, 'title', val)}
            tag="h1"
            className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold leading-tight block"
          />

          <div className="flex items-center gap-2 text-body-sm text-body-sm text-on-surface-variant pt-1">
            <Calendar className="w-4 h-4 text-primary" />
            <span>Published on </span>
            <EditableText
              value={update.date}
              onSave={(val: string) => updateUpdateField(update.id, 'date', val)}
              tag="span"
              className="font-semibold text-on-surface"
            />
          </div>
        </div>

        <div className="aspect-[16/9] rounded-xl overflow-hidden shadow-md border border-outline-variant/20 relative">
          <EditableImage
            value={update.image}
            onSave={(val: string) => updateUpdateField(update.id, 'image', val)}
          >
            {(src: string) => <img src={src} alt={update.title} className="w-full h-full object-cover" />}
          </EditableImage>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/20 shadow-sm space-y-4">
          <h2 className="font-headline-sm text-headline-sm text-primary font-bold">Engineering Progress Report</h2>
          <EditableText
            value={update.content}
            onSave={(val: string) => updateUpdateField(update.id, 'content', val)}
            tag="p"
            multiline={true}
            className="font-body-md text-body-md text-on-surface-variant leading-relaxed block"
          />
        </div>

        {/* Project Progress Gallery */}
        <div className="space-y-4 pt-sm">
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Project Progress Gallery</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {(update.gallery || []).map((imgUrl, idx) => (
              <div key={idx} className="aspect-[4/3] rounded-lg overflow-hidden border border-outline-variant/20 relative group/gallery shadow-sm bg-surface-container-low">
                <img src={imgUrl} alt={`Progress gallery ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                {isAdmin && (
                  <button
                    onClick={() => {
                      const newGallery = (update.gallery || []).filter((_, i) => i !== idx);
                      updateUpdateField(update.id, 'gallery', newGallery);
                    }}
                    className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-md cursor-pointer"
                    title="Remove Image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            {/* Add new image card if admin */}
            {isAdmin && (
              <div 
                onClick={() => galleryInputRef.current?.click()}
                className="aspect-[4/3] rounded-lg border-2 border-dashed border-outline-variant/50 bg-surface-container-lowest hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center p-4 shadow-sm"
              >
                <UploadCloud className="w-6 h-6 text-on-surface-variant" />
                <span className="text-xs font-semibold text-on-surface">Add Gallery Photo</span>
                <span className="text-[10px] text-on-surface-variant">Click to browse</span>
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleGalleryUpload}
                />
              </div>
            )}
          </div>
        </div>

        <div className="pt-sm border-t border-outline-variant/30">
          <Link to="/updates" className="inline-flex items-center gap-2 text-label-lg font-label-lg text-primary hover:underline cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Updates</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default UpdatesDetailPage;
