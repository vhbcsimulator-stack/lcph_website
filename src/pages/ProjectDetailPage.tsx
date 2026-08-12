import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Lightbox } from '../components/ui/Lightbox';
import { useAdmin } from '../context/AdminContext';
import { EditableText } from '../components/admin/EditableText';
import { EditableRichText } from '../components/admin/EditableRichText';
import { EditableImage } from '../components/admin/EditableImage';
import { compressImage } from '../utils/image';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { getHeaderOffset, scrollToElement } from '../utils/scroll';
import { ArrowRight, CheckCircle, MapPin, MessageSquare, Plus, Trash2, X } from 'lucide-react';

/** The sub-nav tabs, in page order â€” the scroll spy walks this list top to bottom. */
const SECTION_TABS = [
  { id: 'overview', contentKey: 'project_detail_tab_overview', label: 'Overview' },
  { id: 'amenities', contentKey: 'project_detail_tab_amenities', label: 'Amenities' },
  { id: 'masterplan', contentKey: 'project_detail_tab_video', label: 'Walkthrough Video' },
  { id: 'gallery', contentKey: 'project_detail_tab_gallery', label: 'Gallery' },
] as const;

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { projects, loading, updateProjectField, deleteProject, isAdmin, pageContent } = useAdmin();
  const project = projects.find(p => p.slug === slug || p.id === slug);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitDate, setVisitDate] = useState('');
  
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [tempVideoUrl, setTempVideoUrl] = useState(project?.video || '');
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const [activeSection, setActiveSection] = useState<string>(SECTION_TABS[0].id);
  const subNavRef = useRef<HTMLDivElement>(null);
  /** Timestamp the scroll spy stays quiet until, so a clicked tab wins over the sections it passes. */
  const spyLockUntilRef = useRef(0);

  useEffect(() => {
    if (project) {
      setTempVideoUrl(project.video || '');
    }
  }, [project?.video]);

  useEffect(() => {
    if (!videoContainerRef.current || !project?.video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const iframe = videoContainerRef.current?.querySelector('iframe');
          if (!iframe || !iframe.contentWindow) return;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            if (!isManuallyPaused) {
              iframe.contentWindow.postMessage(
                JSON.stringify({ event: 'command', func: 'playVideo' }),
                '*'
              );
              setIsPlaying(true);
            }
          } else {
            iframe.contentWindow.postMessage(
              JSON.stringify({ event: 'command', func: 'pauseVideo' }),
              '*'
            );
            setIsPlaying(false);
            setIsManuallyPaused(false); // Reset manual pause state when video goes out of view
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    observer.observe(videoContainerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [project?.video, isManuallyPaused]);

  /**
   * Scroll spy for the sticky sub-nav: the active tab is the last section whose top has passed
   * under the nav. A click sets the tab straight away and locks the spy until the animated scroll
   * lands, so the underline doesn't skip through every section on the way there.
   */
  useEffect(() => {
    const syncActiveSection = () => {
      if (Date.now() < spyLockUntilRef.current) return;

      const line = (subNavRef.current?.getBoundingClientRect().bottom ?? getHeaderOffset()) + 12;
      let current: string = SECTION_TABS[0].id;

      for (const tab of SECTION_TABS) {
        const el = document.getElementById(tab.id);
        if (el && el.getBoundingClientRect().top <= line) current = tab.id;
      }

      // A short last section may never reach the line, so hitting the bottom selects it outright.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = SECTION_TABS[SECTION_TABS.length - 1].id;
      }

      setActiveSection(current);
    };

    syncActiveSection();
    window.addEventListener('scroll', syncActiveSection, { passive: true });
    window.addEventListener('resize', syncActiveSection);

    return () => {
      window.removeEventListener('scroll', syncActiveSection);
      window.removeEventListener('resize', syncActiveSection);
    };
  }, [project?.id]);

  const handleTabClick = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();

    const target = document.getElementById(id);
    if (!target) return;

    setActiveSection(id);
    spyLockUntilRef.current = Date.now() + 1000;
    scrollToElement(target, getHeaderOffset() + (subNavRef.current?.offsetHeight ?? 0) + 12);
  };

  const togglePlayPause = () => {
    const iframe = videoContainerRef.current?.querySelector('iframe');
    if (!iframe || !iframe.contentWindow) return;

    if (isPlaying) {
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'pauseVideo' }),
        '*'
      );
      setIsPlaying(false);
      setIsManuallyPaused(true);
    } else {
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'playVideo' }),
        '*'
      );
      setIsPlaying(true);
      setIsManuallyPaused(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent play/pause toggle when unmuting
    const iframe = videoContainerRef.current?.querySelector('iframe');
    if (!iframe || !iframe.contentWindow) return;

    if (isMuted) {
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'unMute' }),
        '*'
      );
      setIsMuted(false);
    } else {
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'mute' }),
        '*'
      );
      setIsMuted(true);
    }
  };

  const handleSaveVideoUrl = () => {
    if (!project) return;
    updateProjectField(project.id, 'video', tempVideoUrl.trim());
    setVideoModalOpen(false);
  };

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?enablejsapi=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0&disablekb=1&loop=1&playlist=${match[2]}&cc_load_policy=3`;
    }
    return null;
  };

  const handleDeleteClick = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!project) return;
    deleteProject(project.id);
    setIsConfirmOpen(false);
    navigate('/projects');
  };

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  const handleBookVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (visitorName && visitorEmail && visitorPhone && visitDate) {
      setFormSubmitted(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
        <p className="text-sm font-semibold text-on-surface-variant">Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4 px-4">
        <h2 className="text-2xl font-bold text-primary">
          <EditableText contentKey="project_detail_missing_title" value="Project Not Found" tag="span" inline />
        </h2>
        <p className="text-on-surface-variant max-w-md">
          <EditableText
            contentKey="project_detail_missing_text"
            value="The project you are looking for does not exist or has been removed."
            tag="span"
            inline
          />
        </p>
        <Link to="/projects" className="bg-primary text-on-primary font-bold text-sm px-6 py-2.5 rounded-lg hover:bg-primary-container">
          <EditableText contentKey="project_detail_back" value="Back to Projects" tag="span" inline />
        </Link>
      </div>
    );
  }

  const youtubeEmbedUrl = project.video ? getYoutubeEmbedUrl(project.video) : null;

  /**
   * What the lightbox pages through. The cover lives in project.image, outside the gallery array,
   * so it is prepended here â€” every index below is into this list, not into project.gallery.
   * That keeps clicking a tile opening that same photo rather than the one that shares its index.
   */
  const lightboxImages = [project.image, ...project.gallery].filter(Boolean);
  /** Index of a gallery photo within lightboxImages â€” the cover takes slot 0. */
  const galleryLightboxIndex = (index: number) =>
    project.gallery.length ? (index % project.gallery.length) + 1 : 0;

  return (
    <div className="space-y-xl py-sm">
      <div className="container-custom space-y-md">
        <div className="flex justify-between items-center gap-4">
          <Breadcrumbs items={[
            { label: 'Projects', path: '/projects' },
            { label: project.name }
          ]} />
          
          {isAdmin && (
            <button
              onClick={handleDeleteClick}
              className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shadow-md shrink-0"
            >
              <Trash2 className="w-4 h-4" />
              Delete Project
            </button>
          )}
        </div>

        {/* Hero Gallery Bento Grid */}
        <section className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-xs md:gap-sm h-[400px] md:h-[600px] rounded-xl overflow-hidden shadow-lg border border-outline-variant/20 bg-surface">
            {/* Main Featured Image */}
            <div 
              onClick={() => openLightbox(0)}
              className="md:col-span-3 md:row-span-2 relative group cursor-pointer overflow-hidden"
            >
              <EditableImage value={project.image} onSave={(val) => updateProjectField(project.id, 'image', val)}>
                {(src) => (
                  <div 
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                    style={{ backgroundImage: `url('${src}')` }}
                  ></div>
                )}
              </EditableImage>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-on-background/80 via-transparent to-transparent opacity-60"></div>
              {/* z-40 keeps this copy above the image editor's hover overlay (z-30) so it stays clickable */}
              <div className="absolute bottom-md left-md z-40 text-white pr-md">
                <span className="bg-primary text-on-primary font-label-lg text-label-lg px-3 py-1 rounded-full mb-xs inline-block shadow-sm font-bold">
                  <EditableText
                    value={project.status}
                    onSave={(val: string) => updateProjectField(project.id, 'status', val as any)}
                    tag="span"
                    inline
                  />
                </span>
                
                <EditableText
                  value={project.name}
                  onSave={(val) => updateProjectField(project.id, 'name', val)}
                  className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-white drop-shadow-md font-bold"
                  tag="h1"
                />

                <p className="font-body-lg text-body-lg text-surface-variant flex items-center mt-2">
                  <MapPin className="w-5 h-5 mr-2 text-primary-fixed" />
                  <EditableText
                    value={project.location}
                    onSave={(val: string) => updateProjectField(project.id, 'location', val)}
                    tag="span"
                  />
                </p>
              </div>
            </div>

            {/* Secondary Image 1 */}
            <div 
              className="hidden md:block relative group cursor-pointer overflow-hidden rounded-tr-xl"
            >
              <EditableImage
                value={project.gallery[1 % Math.max(project.gallery.length, 1)] || project.image}
                onSave={(val: string) => {
                  const updated = [...project.gallery];
                  updated[1] = val;
                  updateProjectField(project.id, 'gallery', updated);
                }}
              >
                {(src: string) => (
                  <div
                    onClick={() => openLightbox(galleryLightboxIndex(1))}
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${src}')` }}
                  ></div>
                )}
              </EditableImage>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors pointer-events-none"></div>
            </div>

            {/* Secondary Image 2 */}
            <div 
              className="hidden md:block relative group cursor-pointer overflow-hidden rounded-br-xl"
            >
              <EditableImage
                value={project.gallery[2 % Math.max(project.gallery.length, 1)] || project.image}
                onSave={(val: string) => {
                  const updated = [...project.gallery];
                  updated[2] = val;
                  updateProjectField(project.id, 'gallery', updated);
                }}
              >
                {(src: string) => (
                  <div
                    onClick={() => openLightbox(galleryLightboxIndex(2))}
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${src}')` }}
                  ></div>
                )}
              </EditableImage>
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                {/*
                  A real button: the badge sits above the tile and would otherwise swallow the
                  click meant for it. It opens the gallery from the first photo rather than this
                  tile's photo, since it is an entry point to the whole set.
                */}
                <button
                  type="button"
                  onClick={() => openLightbox(galleryLightboxIndex(0))}
                  aria-label={`View all ${project.gallery.length} gallery photos`}
                  className="pointer-events-auto z-40 cursor-pointer text-white font-label-lg text-label-lg flex items-center bg-on-background/50 px-4 py-2 rounded-full backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-on-background/70"
                >
                  <EditableText contentKey="project_detail_gallery_cta" value="View Gallery" tag="span" inline />
                  {' '}({project.gallery.length})
                </button>
              </div>
            </div>
          </div>
        </section>

        {/*
          Sticky Sub-Navigation.
          top clears the site header at each breakpoint (72px, 112px from lg) plus the admin
          toolbar, so the tabs park below it instead of sliding underneath. z-50 stays below the
          header's z-70 and above in-page admin overlays.
        */}
        <div
          ref={subNavRef}
          className="sticky z-50 w-full border-y border-outline-variant/30 bg-surface-container-lowest shadow-sm top-[calc(72px+var(--admin-offset,0px))] lg:top-[calc(112px+var(--admin-offset,0px))]"
        >
          <nav aria-label="Project sections" className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop flex overflow-x-auto">
            {SECTION_TABS.map((tab) => {
              const isActive = activeSection === tab.id;
              return (
                <a
                  key={tab.id}
                  href={`#${tab.id}`}
                  onClick={handleTabClick(tab.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative font-label-lg text-label-lg py-4 px-6 whitespace-nowrap transition-colors hover:bg-surface-container-low ${
                    isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  <EditableText contentKey={tab.contentKey} value={tab.label} tag="span" inline />
                  <span
                    aria-hidden
                    className={`absolute inset-x-0 bottom-0 h-0.5 origin-left bg-primary transition-transform duration-300 ease-out ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </a>
              );
            })}
          </nav>
        </div>

        {/* Content Grid (Asymmetric layout: 8 cols left, 4 cols right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter py-md">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-xl">
            {/* Overview */}
            <section id="overview" className="scroll-mt-[136px] lg:scroll-mt-[176px] space-y-md">
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary font-bold"><EditableText contentKey="project_detail_overview_title" value="Discover Serenity" tag="span" inline /></h2>
              
              <EditableRichText
                value={project.longDescription}
                onSave={(val: string) => updateProjectField(project.id, 'longDescription', val)}
                className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed"
              />
              
              {/* Quick Stats Glassmorphism Card */}
              <div className="bg-surface-container-low/50 backdrop-blur-sm border border-outline-variant/30 rounded-xl p-md grid grid-cols-2 md:grid-cols-4 gap-md shadow-sm">
                <div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-1 uppercase tracking-wider"><EditableText contentKey="project_detail_stat_type" value="Property Type" tag="span" inline /></p>
                  {/* One field: the category is what gets edited, "Estate" rides along as a suffix */}
                  <EditableText
                    value={project.category}
                    onSave={(val: string) => updateProjectField(project.id, 'category', val as any)}
                    suffix={pageContent['project_detail_stat_type_suffix'] ?? ''}
                    className="font-headline-sm text-headline-sm text-on-background font-bold"
                    tag="p"
                  />
                </div>
                <div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-1 uppercase tracking-wider"><EditableText contentKey="project_detail_stat_lot_sizes" value="Lot Sizes" tag="span" inline /></p>
                  <EditableText
                    value={project.specs.lotSizes}
                    onSave={(val: string) => updateProjectField(project.id, 'specs', { ...project.specs, lotSizes: val })}
                    className="font-headline-sm text-headline-sm text-on-background font-bold"
                    tag="p"
                  />
                </div>
                <div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-1 uppercase tracking-wider"><EditableText contentKey="project_detail_stat_status" value="Status" tag="span" inline /></p>
                  <EditableText
                    value={project.status}
                    onSave={(val: string) => updateProjectField(project.id, 'status', val as any)}
                    className="font-headline-sm text-headline-sm text-primary font-bold animate-pulse"
                    tag="p"
                  />
                </div>
                <div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-1 uppercase tracking-wider"><EditableText contentKey="project_detail_stat_turnover" value="Turnover" tag="span" inline /></p>
                  <EditableText
                    value={project.specs.totalArea}
                    onSave={(val: string) => updateProjectField(project.id, 'specs', { ...project.specs, totalArea: val })}
                    className="font-headline-sm text-headline-sm text-on-background font-bold"
                    tag="p"
                  />
                </div>
              </div>
            </section>

            {/* Amenities Section */}
            {/* Inset band, not a full-bleed one: this column sits inside the page container, and a
                wrapping band would trap the sticky sub-nav above in its stacking context. */}
            <section id="amenities" className="section-band-inset section-dots scroll-mt-[136px] lg:scroll-mt-[176px] space-y-md p-6 md:p-8">
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary font-bold"><EditableText contentKey="project_detail_amenities_title" value="Exclusive Amenities" tag="span" inline /></h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
                {project.amenities.slice(0, 4).map((amenity, idx) => (
                  <div key={idx} className="flex items-start p-sm rounded-lg hover:bg-surface-container-low border border-transparent hover:border-outline-variant/20 transition-all duration-200">
                    <div className="bg-primary-container text-on-primary-container p-3 rounded-lg mr-sm shadow-sm">
                      <CheckCircle className="w-5 h-5 text-on-primary-container" />
                    </div>
                    <div>
                      <EditableText
                        value={amenity}
                        onSave={(val: string) => {
                          const updated = [...project.amenities];
                          updated[idx] = val;
                          updateProjectField(project.id, 'amenities', updated);
                        }}
                        className="font-headline-sm text-headline-sm text-on-background font-bold mb-1"
                        tag="h3"
                      />
                      <EditableRichText
                        contentKey="project_detail_amenity_blurb"
                        className="font-body-sm text-body-sm text-on-surface-variant"
                        compact
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-start">
                <Link
                  to={`/amenities?project=${project.id}`}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container font-bold text-sm px-5 py-2.5 rounded-lg transition-all shadow-sm group cursor-pointer"
                >
                  <EditableText contentKey="project_detail_more_amenities" value="View More Amenities" tag="span" inline />
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </section>

            {/* Walkthrough Video */}
            <section id="masterplan" className="scroll-mt-[136px] lg:scroll-mt-[176px] space-y-md">
              <div className="flex justify-between items-center">
                <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary font-bold"><EditableText contentKey="project_detail_video_title" value="Walkthrough Video" tag="span" inline /></h2>
                {isAdmin && (
                  <button
                    onClick={() => setVideoModalOpen(true)}
                    className="bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container text-xs font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Manage Video</span>
                  </button>
                )}
              </div>

              <div 
                ref={videoContainerRef} 
                className="relative w-full rounded-xl overflow-hidden border border-outline-variant/30 shadow-sm bg-surface-container-lowest aspect-[16/9] flex items-center justify-center bg-black group"
              >
                {project.video ? (
                  youtubeEmbedUrl ? (
                    <>
                      <iframe
                        src={youtubeEmbedUrl}
                        title="Project Walkthrough Video"
                        style={{
                          transform: 'scale(1.15) translateY(3.5%)',
                          width: '100%',
                          height: '100%',
                          border: 'none',
                          pointerEvents: 'none'
                        }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      {/* Click overlay for Play/Pause */}
                      <div 
                        onClick={togglePlayPause}
                        className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors"
                      >
                        {/* Play icon overlay */}
                        {!isPlaying && (
                          <div className="bg-white/95 text-primary p-4 rounded-full shadow-lg transform scale-100 hover:scale-110 active:scale-95 transition-all duration-200">
                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        )}
                        {/* Pause icon overlay when playing & hovered */}
                        {isPlaying && (
                          <div className="opacity-0 group-hover:opacity-100 bg-black/40 text-white p-4 rounded-full shadow-lg transform scale-90 group-hover:scale-100 active:scale-95 transition-all duration-200">
                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            </svg>
                          </div>
                        )}

                        {/* Custom Mute/Unmute Speaker button on bottom right */}
                        <button
                          onClick={toggleMute}
                          className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full shadow-md transition-all z-20 cursor-pointer"
                          title={isMuted ? "Unmute" : "Mute"}
                        >
                          {isMuted ? (
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </>
                  ) : (
                    <video 
                      key={project.video}
                      src={project.video} 
                      className="w-full h-full object-cover" 
                      controls 
                      preload="metadata"
                    />
                  )
                ) : (
                  <div className="text-on-surface-variant font-body-md text-center p-6">
                    <p className="font-bold text-lg mb-1 text-white"><EditableText contentKey="project_detail_video_empty_title" value="No Video Available" tag="span" inline /></p>
                    <p className="text-xs text-white/60"><EditableText contentKey="project_detail_video_empty_text" value="Walkthrough video will be uploaded soon." tag="span" inline /></p>
                  </div>
                )}
              </div>
            </section>
            {/* Photo Gallery Section */}
            <section id="gallery" className="scroll-mt-[136px] lg:scroll-mt-[176px] space-y-md">
              <div className="flex items-end justify-between">
                <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary font-bold"><EditableText contentKey="project_detail_gallery_title" value="Photo Gallery" tag="span" inline /></h2>
                <span className="text-sm text-on-surface-variant">{project.gallery.length} photo{project.gallery.length !== 1 ? 's' : ''}</span>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {project.gallery.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden aspect-square border border-outline-variant/20 shadow-sm"
                  >
                    <img
                      src={img}
                      alt={`${project.name} gallery ${idx + 1}`}
                      className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
                      onClick={() => openLightbox(idx + 1)}
                    />
                    {/* Admin overlay: edit + delete */}
                    {isAdmin && (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        {/* Replace this image */}
                        <label
                          className="bg-white text-on-surface text-xs font-bold px-2.5 py-1.5 rounded-lg shadow cursor-pointer hover:bg-surface-container-low transition-colors"
                          title="Replace image"
                        >
                          Replace
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                const compressedData = await compressImage(file);
                                const updated = [...project.gallery];
                                updated[idx] = compressedData;
                                updateProjectField(project.id, 'gallery', updated);
                              } catch (err) {
                                console.error('Failed to process image:', err);
                              }
                              e.target.value = '';
                            }}
                          />
                        </label>
                        {/* Delete this image */}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = project.gallery.filter((_, i) => i !== idx);
                            updateProjectField(project.id, 'gallery', updated);
                          }}
                          className="bg-red-600 text-white text-xs font-bold p-1.5 rounded-lg shadow cursor-pointer hover:bg-red-700 transition-colors"
                          title="Remove image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Add Photo tile â€” admin only */}
                {isAdmin && (
                  <label className="relative group rounded-xl aspect-square border-2 border-dashed border-outline-variant/50 hover:border-primary/50 bg-surface-container-lowest hover:bg-primary/5 transition-all duration-200 flex flex-col items-center justify-center gap-2 cursor-pointer">
                    <div className="p-3 bg-surface-container-low rounded-full group-hover:bg-primary/10 transition-colors">
                      <Plus className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                    </div>
                    <span className="text-xs font-bold text-on-surface-variant group-hover:text-primary transition-colors text-center px-2">Add Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []);
                        try {
                          const compressedImages = await Promise.all(
                            files.map(file => compressImage(file))
                          );
                          updateProjectField(project.id, 'gallery', [...project.gallery, ...compressedImages]);
                        } catch (err) {
                          console.error('Failed to process one or more images:', err);
                        }
                        e.target.value = '';
                      }}
                    />
                  </label>
                )}
              </div>
            </section>

          </div>{/* End left column */}

          {/* Right Column (4 cols) - Sticky Booking Widget */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-[140px] bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-md shadow-lg space-y-4">
              <h3 className="font-headline-md text-headline-md text-on-background font-bold">
                <EditableText contentKey="project_detail_widget_title" value="Interested in" tag="span" inline />{' '}
                <EditableText
                  value={project.name}
                  onSave={(val: string) => updateProjectField(project.id, 'name', val)}
                  tag="span"
                  inline
                />
                ?
              </h3>
              <EditableRichText
                contentKey="project_detail_widget_text"
                className="font-body-sm text-body-sm text-on-surface-variant"
                compact
              />

              {formSubmitted ? (
                <div className="p-6 bg-primary-container text-on-primary-container rounded-xl text-center space-y-3">
                  <CheckCircle className="w-10 h-10 mx-auto" />
                  <h4 className="font-headline-sm text-headline-sm font-bold"><EditableText contentKey="project_detail_success_title" value="Visit Scheduled!" tag="span" inline /></h4>
                  <p className="font-body-sm text-body-sm opacity-90">
                    We have logged your request. A consultant will call you at {visitorPhone} to finalize the arrangements.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookVisit} className="space-y-4">
                  <div>
                    <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1"><EditableText contentKey="project_detail_label_name" value="Full Name" tag="span" inline /></label>
                    <input 
                      type="text" 
                      required
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      className="w-full rounded-md border border-outline-variant/50 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 bg-surface p-2.5 outline-none text-body-md" 
                      placeholder="John Doe" 
                    />
                  </div>
                  <div>
                    <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1"><EditableText contentKey="project_detail_label_email" value="Email Address" tag="span" inline /></label>
                    <input 
                      type="email" 
                      required
                      value={visitorEmail}
                      onChange={(e) => setVisitorEmail(e.target.value)}
                      className="w-full rounded-md border border-outline-variant/50 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 bg-surface p-2.5 outline-none text-body-md" 
                      placeholder="john@example.com" 
                    />
                  </div>
                  <div>
                    <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1"><EditableText contentKey="project_detail_label_phone" value="Phone Number" tag="span" inline /></label>
                    <input 
                      type="tel" 
                      required
                      value={visitorPhone}
                      onChange={(e) => setVisitorPhone(e.target.value)}
                      className="w-full rounded-md border border-outline-variant/50 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 bg-surface p-2.5 outline-none text-body-md" 
                      placeholder="+63 (917) 000-0000" 
                    />
                  </div>
                  <div>
                    <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1"><EditableText contentKey="project_detail_label_date" value="Preferred Date for Visit" tag="span" inline /></label>
                    <input 
                      type="date" 
                      required
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="w-full rounded-md border border-outline-variant/50 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 bg-surface p-2.5 outline-none text-body-md text-on-background" 
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-primary text-on-primary font-label-lg text-label-lg px-6 py-4 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-md hover:shadow-lg active:scale-95 duration-100 mt-4 cursor-pointer"
                  >
                    <EditableText contentKey="project_detail_book_cta" value="Book a Site Visit" tag="span" inline />
                  </button>
                  <div className="flex items-center justify-center mt-4">
                    <span className="w-full border-t border-outline-variant/30"></span>
                    <span className="px-3 font-body-sm text-body-sm text-on-surface-variant whitespace-nowrap">or</span>
                    <span className="w-full border-t border-outline-variant/30"></span>
                  </div>
                  <Link 
                    to="/contact"
                    className="w-full bg-transparent border-2 border-tertiary text-tertiary font-label-lg text-label-lg px-6 py-3 rounded-lg hover:bg-tertiary/5 transition-colors mt-4 flex items-center justify-center"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    <EditableText contentKey="project_detail_chat_cta" value="Chat with an Agent" tag="span" inline />
                  </Link>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <Lightbox 
        isOpen={lightboxOpen} 
        images={lightboxImages}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : lightboxImages.length - 1))}
        onNext={() => setLightboxIndex((prev) => (prev < lightboxImages.length - 1 ? prev + 1 : 0))}
        onJump={(idx) => setLightboxIndex(idx)}
        title={project.name}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Delete Project"
        message={`Are you sure you want to permanently delete the project "${project.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />

      {videoModalOpen && createPortal(
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '16px',
            boxSizing: 'border-box'
          }}
        >
          <div 
            className="bg-surface border border-outline-variant/30 rounded-2xl shadow-2xl p-6 space-y-4 text-left"
            style={{
              width: '100%',
              maxWidth: '400px',
              boxSizing: 'border-box'
            }}
          >
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
              <h3 className="font-bold text-lg text-on-surface">Manage Walkthrough Video</h3>
              <button 
                onClick={() => setVideoModalOpen(false)} 
                className="p-1 rounded-lg hover:bg-surface-container-low cursor-pointer text-on-surface-variant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface-variant uppercase">YouTube Video Link</label>
                <input
                  type="text"
                  placeholder="e.g., https://www.youtube.com/watch?v=..."
                  value={tempVideoUrl}
                  onChange={(e) => setTempVideoUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded border border-outline-variant bg-surface text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
                <p className="text-[10px] text-on-surface-variant opacity-80 pt-0.5">
                  Paste a YouTube video URL. To optimize storage and site performance, local video file uploads are not supported.
                </p>
              </div>

              {project.video && (
                <div className="pt-2 border-t border-outline-variant/20 flex justify-between items-center">
                  <span className="text-xs text-on-surface-variant">Current YouTube Link saved</span>
                  <button
                    onClick={() => {
                      updateProjectField(project.id, 'video', '');
                      setTempVideoUrl('');
                      setVideoModalOpen(false);
                    }}
                    className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Remove Video
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-outline-variant/20">
              <button
                onClick={() => setVideoModalOpen(false)}
                className="px-4 py-2 text-sm font-bold border border-outline-variant rounded-lg hover:bg-surface-container-low text-on-surface-variant cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveVideoUrl}
                className="px-4 py-2 text-sm font-bold rounded-lg bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container cursor-pointer transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
export default ProjectDetailPage;
