import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { EmptyState } from '../components/ui/EmptyState';
import { AmenityCard } from '../components/cards/AmenityCard';
import { useAdmin } from '../context/AdminContext';
import { EditableText } from '../components/admin/EditableText';
import type { Amenity } from '../types';
import { Filter, Layers3, SlidersHorizontal, X } from 'lucide-react';

export const AmenitiesPage: React.FC = () => {
  const { amenities, projects } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialProject = searchParams.get('project') || 'All';
  const [selectedProject, setSelectedProject] = useState<string>(initialProject);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const prefersReducedMotion = useReducedMotion();

  // Keep state in sync with URL search params (e.g. navigation or direct links)
  useEffect(() => {
    const projectFromUrl = searchParams.get('project');
    if (projectFromUrl) {
      setSelectedProject(projectFromUrl);
    } else {
      setSelectedProject('All');
    }
  }, [searchParams]);

  const categories = ['All', 'Recreation', 'Nature', 'Wellness', 'Security', 'Lifestyle', 'Sports'];

  const handleProjectChange = (projectId: string) => {
    setSelectedProject(projectId);
    const newParams = new URLSearchParams(searchParams);
    if (projectId === 'All') {
      newParams.delete('project');
    } else {
      newParams.set('project', projectId);
    }
    setSearchParams(newParams, { replace: true });
  };

  // Find selected project object if a project filter is active
  const selectedProjectObj = selectedProject !== 'All'
    ? projects.find(p => p.id === selectedProject || p.slug === selectedProject)
    : null;

  // Derive amenities list based on project filter
  let displayedAmenities: Amenity[] = [];

  if (!selectedProjectObj) {
    // Show all amenities when "All Projects" selected
    displayedAmenities = amenities;
  } else {
    // 1. Filter existing amenities table by project ID match or name match
    const projAmenityNames = (selectedProjectObj.amenities || []).map(a => a.toLowerCase());

    const matched = amenities.filter(item => {
      const matchesId = (item as any).projectId === selectedProjectObj.id;
      const matchesName = projAmenityNames.some(pName =>
        pName.includes(item.name.toLowerCase()) || item.name.toLowerCase().includes(pName)
      );
      return matchesId || matchesName;
    });

    // 2. Also map any project.amenities strings that aren't already represented in matched
    const syntheticAmenities: Amenity[] = (selectedProjectObj.amenities || [])
      .filter(aName => !matched.some(m => m.name.toLowerCase() === aName.toLowerCase()))
      .map((aName, idx) => ({
        id: `synth-${selectedProjectObj.id}-${idx}`,
        name: aName,
        category: 'Lifestyle' as const,
        description: `Exclusive feature of ${selectedProjectObj.name}, designed for luxury township living.`,
        image: selectedProjectObj.image,
        highlights: ['Township Feature', 'Exclusive Access', 'Managed Facility']
      }));

    displayedAmenities = [...matched, ...syntheticAmenities];
  }

  // Filter by category tab
  const filteredAmenities = displayedAmenities.filter(item =>
    selectedCategory === 'All' || item.category === selectedCategory
  );

  return (
    <motion.div
      data-page-motion="custom"
      className={`overflow-hidden ${prefersReducedMotion ? '' : 'simple-page-enter'}`}
    >
      {/* No bottom rule here: the tinted band below already separates the header from the list. */}
      <div className="relative">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full" />
        <div className="container-custom relative pb-5 pt-sm md:pb-5">
        <Breadcrumbs items={[{ label: 'Amenities' }]} />

        {/* Page Header */}
        <div className="grid items-end gap-8 pt-8 md:grid-cols-[1fr_auto] md:pt-12">
          <div className="max-w-3xl">
          <EditableText
            contentKey="amenities_hero_title"
            value="Discover Our Amenities"
            className="font-headline-xl-mobile text-headline-xl-mobile font-bold capitalize tracking-tight text-primary md:font-headline-xl md:text-headline-xl"
            tag="h1"
          />
          <EditableText
            contentKey="amenities_hero_text"
            value="Experience a world of leisure and convenience with our curated selection of world-class estate amenities."
            className="mt-3 max-w-2xl font-body-lg text-body-lg leading-relaxed text-on-surface-variant"
            tag="p"
          />
          </div>
        </div>
        </div>
      </div>

      <div className="section-band section-grid pb-16 ">
        <div className="container-custom space-y-8">

        {/* Filter Bar: Project Filter & Category Tabs */}
        <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 md:p-6">
          <div className="flex flex-col md:flex-row gap-sm items-start md:items-center justify-between">
            {/* Project Dropdown Filter */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <label className="flex shrink-0 items-center gap-2 font-label-lg text-[12px] font-bold uppercase tracking-wider text-on-surface-variant">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/8"><Filter className="w-4 h-4 text-primary" /></span>
                <EditableText contentKey="amenities_filter_label" value="Filter by Project:" tag="span" inline />
              </label>
              <select
                value={selectedProject}
                onChange={(e) => handleProjectChange(e.target.value)}
                className="w-full cursor-pointer rounded-xl border border-outline-variant/50 bg-surface-container-low px-4 py-3 font-body-md font-semibold text-on-surface outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 sm:w-72 appearance-none"
              >
                <option value="All">All Projects</option>
                {projects.map(proj => (
                  <option key={proj.id} value={proj.id}>
                    {proj.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Active Filter Pill */}
            {selectedProject !== 'All' && selectedProjectObj && (
              <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-2 text-xs font-bold text-primary">
                <span>Filtered for: {selectedProjectObj.name}</span>
                <button
                  onClick={() => handleProjectChange('All')}
                  className="cursor-pointer rounded-full p-0.5 text-primary transition-all hover:rotate-90 hover:bg-primary/20"
                  title="Clear Project Filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div className="mt-5 flex items-center gap-2 overflow-x-auto border-t border-outline-variant/20 pt-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <SlidersHorizontal className="w-4 h-4 mr-1 shrink-0 text-primary" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`cursor-pointer whitespace-nowrap rounded-full border px-4 py-2 font-label-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                  selectedCategory === cat
                    ? 'border-primary bg-primary text-on-primary shadow-md'
                    : 'border-transparent bg-surface-container-low text-on-surface-variant hover:-translate-y-0.5 hover:border-primary/25 hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3 px-1">
          <div>
            <EditableText
              contentKey="amenities_list_badge"
              value="Curated facilities"
              className="block text-[11px] font-bold uppercase tracking-[0.15em] text-primary"
              tag="span"
            />
            <h2 className="mt-1 font-headline-md text-headline-md font-bold text-primary">
              {selectedProjectObj ? selectedProjectObj.name : selectedCategory === 'All' ? 'All amenities' : selectedCategory}
            </h2>
          </div>
          <p className="text-body-sm text-on-surface-variant"><strong className="text-on-surface">{filteredAmenities.length}</strong> {filteredAmenities.length === 1 ? 'amenity' : 'amenities'} found</p>
        </div>

        {/* Amenities Grid */}
        {filteredAmenities.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredAmenities.map((amenity, index) => (
                <motion.div
                  layout
                  key={amenity.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.32, delay: prefersReducedMotion ? 0 : Math.min(index, 5) * 0.04 }}
                >
                  <AmenityCard amenity={amenity} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <EmptyState
            icon={Layers3}
            title={<EditableText contentKey="amenities_empty_title" value="No amenities found" tag="span" inline />}
            description={
              <EditableText
                contentKey="amenities_empty_text"
                value="Try selecting a different project or category."
                tag="span"
                inline
              />
            }
            action={
              <button
                onClick={() => { handleProjectChange('All'); setSelectedCategory('All'); }}
                className="home-cta cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-on-primary hover:bg-primary-container hover:text-on-primary-container"
              >
                <EditableText contentKey="amenities_empty_cta" value="Reset Filters" tag="span" inline />
              </button>
            }
          />
        )}
        </div>
      </div>
    </motion.div>
  );
};

export default AmenitiesPage;
