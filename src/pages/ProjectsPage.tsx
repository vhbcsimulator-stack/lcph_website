import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { ProjectCard } from '../components/cards/ProjectCard';
import { AnimatedPage } from '../components/layout/AnimatedPage';
import { useAdmin } from '../context/AdminContext';
import { EditableText } from '../components/admin/EditableText';
import { EditableRichText } from '../components/admin/EditableRichText';
import { fadeInUp, scaleUp, staggerContainer } from '../utils/animations';
import type { Project } from '../types';
import { ChevronDown, Filter, MapPin, Star } from 'lucide-react';

/** Sections below the fold rise in as they are scrolled to, once each. */
const REVEAL_ON_SCROLL = {
  variants: fadeInUp(0.6),
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, amount: 0.14, margin: '0px 0px -14% 0px' },
} as const;

const normalizeFilterValue = (value: string) => value.trim().toLocaleLowerCase();

const uniqueFilterValues = (values: string[]) =>
  Array.from(new Set(values.map(value => value.trim()).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b),
  );

export const ProjectsPage: React.FC = () => {
  const { projects, isAdmin, updateProjectField } = useAdmin();
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [featuredPickerOpen, setFeaturedPickerOpen] = useState(false);

  const locations = uniqueFilterValues(projects.map(project => project.location));
  const statuses = uniqueFilterValues(projects.map(project => project.status));
  const types = uniqueFilterValues(projects.map(project => project.category));

  // Derive featured project â€” first one with featured=true, else first project
  const featuredProject = projects.find(p => p.featured) ?? projects[0] ?? null;

  const filteredProjects = projects.filter(project => {
    const matches = (selectedValue: string, projectValue: string) =>
      selectedValue === 'All' || normalizeFilterValue(projectValue) === normalizeFilterValue(selectedValue);

    const locationMatch = matches(selectedLocation, project.location);
    const statusMatch = matches(selectedStatus, project.status);
    const typeMatch = matches(selectedType, project.category);
    return locationMatch && statusMatch && typeMatch;
  });

  const handleSetFeatured = (projectId: string) => {
    // Unfeature all others, feature selected
    projects.forEach(p => {
      updateProjectField(p.id, 'featured', p.id === projectId);
    });
    setFeaturedPickerOpen(false);
  };

  return (
    <AnimatedPage className="space-y-xl">
      <div className="container-custom space-y-lg">
        <Breadcrumbs items={[{ label: 'Projects' }]} />

        {/* Header & Filter Section â€” animates on mount, so the page opens with the reveal */}
        <motion.section
          variants={staggerContainer(0.12, 0.05)}
          initial="hidden"
          animate="visible"
          className="space-y-md"
        >
          <motion.div variants={fadeInUp(0.55)} className="space-y-xs">
            <EditableText
              contentKey="projects_hero_title"
              className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary font-bold"
              tag="h1"
            />
            <EditableText
              contentKey="projects_hero_text"
              className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed"
              tag="p"
            />
          </motion.div>

          <motion.div
            variants={fadeInUp(0.55)}
            className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col md:flex-row md:flex-wrap gap-sm items-end"
          >

            <div className="w-full md:flex-1 space-y-xs">
              <label className="flex items-center gap-2 font-label-lg text-base font-bold text-on-surface-variant">
                <Filter className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <EditableText contentKey="projects_filter_location" value="Location" tag="span" inline />
              </label>
              <div>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-4 py-3 font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-colors appearance-none outline-none"
                >
                  <option value="All">All Locations</option>
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="w-full md:flex-1 space-y-xs">
              <label className="font-label-lg text-label-lg text-on-surface-variant block">
                <EditableText contentKey="projects_filter_status" value="Status" tag="span" inline />
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-4 py-3 font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-colors appearance-none outline-none"
              >
                <option value="All">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="w-full md:flex-1 space-y-xs">
              <label className="font-label-lg text-label-lg text-on-surface-variant block">
                <EditableText contentKey="projects_filter_type" value="Type" tag="span" inline />
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-4 py-3 font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-colors appearance-none outline-none"
              >
                <option value="All">All Types</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* <div className="w-full md:w-1/4">
              <button
                className="w-full bg-primary text-on-primary font-label-lg text-label-lg px-6 py-3 rounded hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer h-[48px]"
              >
                <Filter className="w-4 h-4" />
                <EditableText contentKey="projects_filter_cta" value="Apply Filters" tag="span" inline />
              </button>
            </div> */}
          </motion.div>
        </motion.section>

        {/* Featured Project Asymmetric Bento Block */}
        {featuredProject && (
          <motion.section
            {...REVEAL_ON_SCROLL}
            className="grid grid-cols-1 gap-5 md:grid-cols-12 md:grid-rows-2 md:auto-rows-[238px]"
          >
            {/* Main featured card */}
            <div className="group relative h-full overflow-hidden rounded-xl shadow-lg md:col-span-8 md:row-span-2 md:h-100">
              <div
                className="absolute inset-0 bg-cover bg-center bg-blend-multiply transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundColor: 'rgba(2, 2, 2, 0.2)',
                  backgroundImage: `url('${featuredProject.image}')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-lg w-full text-white">
                <span className="inline-block bg-primary text-on-primary font-label-lg text-label-lg px-3 py-1 rounded-full mb-3 shadow-sm">
                  <EditableText contentKey="projects_featured_badge" value="Featured" tag="span" inline /> | {' '}
                  <EditableText
                    value={featuredProject.status}
                    onSave={(val) => updateProjectField(featuredProject.id, 'status', val as Project['status'])}
                    tag="span"
                    inline
                  />
                </span>
                <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-white mb-2 font-bold">
                  {featuredProject.name}
                </h2>
                <p className="font-body-lg text-body-lg text-white/90 flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-primary-fixed" />
                  <span>{featuredProject.location}</span>
                </p>
                <Link
                  to={`/projects/${featuredProject.slug}`}
                  className="bg-surface text-primary font-label-lg text-label-lg px-6 py-3 rounded hover:bg-surface-container-low transition-colors inline-block"
                >
                  <EditableText contentKey="projects_featured_cta" value="Explore Project" tag="span" inline />
                </Link>
              </div>

              {/* Admin: Change featured project dropdown */}
              {isAdmin && (
                <div className="absolute top-4 right-4 z-20">
                  <div className="relative">
                    <button
                      onClick={() => setFeaturedPickerOpen(prev => !prev)}
                      className="flex items-center gap-2 bg-[#0d1c2f]/90 border border-white/20 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-lg hover:bg-[#0d1c2f] transition-colors cursor-pointer backdrop-blur-sm"
                    >
                      <Star className="w-3.5 h-3.5 text-yellow-400" />
                      Change Featured Project
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${featuredPickerOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {featuredPickerOpen && (
                      <>
                        {/* backdrop to close on outside click */}
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setFeaturedPickerOpen(false)}
                        />
                        <div className="absolute top-full right-0 mt-2 w-72 bg-[#0d1c2f] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-20">
                          <div className="px-4 py-2.5 border-b border-white/10">
                            <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Select Featured Project</p>
                          </div>
                          <div className="max-h-64 overflow-y-auto">
                            {projects.map(p => (
                              <button
                                key={p.id}
                                onClick={() => handleSetFeatured(p.id)}
                                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors cursor-pointer text-sm
                                  ${p.featured
                                    ? 'bg-primary/30 text-white'
                                    : 'text-white/80 hover:bg-white/10'
                                  }`}
                              >
                                <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                                  {p.image
                                    ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                    : <div className="w-full h-full bg-white/10" />
                                  }
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold truncate">{p.name}</p>
                                  <p className="text-xs text-white/50 truncate">{p.location}</p>
                                </div>
                                {p.featured && (
                                  <Star className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Supporting bento tiles */}
            <div className="flex min-h-[220px] flex-col justify-center rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-md shadow-sm md:col-span-4 md:min-h-0">
              <EditableText
                contentKey="projects_invest_title"
                className="mb-2 font-headline-sm text-headline-sm font-bold text-primary"
                tag="h3"
              />
              <EditableRichText
                contentKey="projects_invest_text"
                className="font-body-md text-body-md leading-relaxed text-on-surface-variant"
                compact
              />
            </div>
            <div className="relative min-h-[220px] overflow-hidden rounded-xl border border-outline-variant/20 shadow-sm md:col-span-4 md:min-h-0">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                style={{ backgroundImage: `url('${featuredProject.gallery?.[0] ?? featuredProject.image}')` }}
              />
            </div>
          </motion.section>
        )}

      </div>

      {/* All Projects Grid â€” banded so the results read as their own zone below the featured block */}
      <div className="section-band section-grid py-16">
        <div className="container-custom">
        <motion.section {...REVEAL_ON_SCROLL} className="space-y-md">
          <div className="flex justify-between items-end border-b border-outline-variant/30 pb-sm">
            <EditableText
              contentKey="projects_grid_title"
              value="All Projects"
              className="font-headline-md text-headline-md text-primary font-bold"
              tag="h2"
              inline
            />
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Showing {filteredProjects.length} results
            </span>
          </div>

          {filteredProjects.length > 0 ? (
            /* Keyed on the filters so re-filtering replays the cascade over the new results. */
            <motion.div
              key={`${selectedLocation}-${selectedStatus}-${selectedType}`}
              variants={staggerContainer(0.08, 0.05)}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap justify-center gap-gutter"
            >
              {filteredProjects.map(project => (
                <motion.div
                  key={project.id}
                  variants={scaleUp(0.45)}
                  className="w-full max-w-[410px] md:w-[calc(50%_-_12px)] lg:w-[calc(33.333%_-_16px)]"
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12 text-on-surface-variant">
              <EditableText
                contentKey="projects_empty_text"
                value="No projects found matching the selected filter criteria."
                tag="p"
              />
            </div>
          )}
        </motion.section>
        </div>
      </div>
    </AnimatedPage>
  );
};
export default ProjectsPage;
