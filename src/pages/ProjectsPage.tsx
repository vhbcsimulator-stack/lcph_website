import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { ProjectCard } from '../components/cards/ProjectCard';
import { Filter, MapPin, Map, Star, ChevronDown } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { EditableText } from '../components/admin/EditableText';

export const ProjectsPage: React.FC = () => {
  const { projects, isAdmin, updateProjectField } = useAdmin();
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [featuredPickerOpen, setFeaturedPickerOpen] = useState(false);

  const locations = Array.from(new Set(projects.map(p => p.location))).filter(Boolean);

  // Derive featured project — first one with featured=true, else first project
  const featuredProject = projects.find(p => p.featured) ?? projects[0] ?? null;

  const filteredProjects = projects.filter(project => {
    const locationMatch = selectedLocation === 'All' || project.location.includes(selectedLocation);
    const statusMatch = selectedStatus === 'All' || project.status === selectedStatus;
    const typeMatch = selectedType === 'All' || project.category === selectedType;
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
    <div className="space-y-xl py-sm">
      <div className="container-custom space-y-lg">
        <Breadcrumbs items={[{ label: 'Projects' }]} />

        {/* Header & Filter Section */}
        <section className="space-y-md">
          <div className="space-y-xs">
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
          </div>

          <div className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col md:flex-row gap-sm items-end">
            <div className="w-full md:w-1/4 space-y-xs">
              <label className="font-label-lg text-label-lg text-on-surface-variant block">Location</label>
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

            <div className="w-full md:w-1/4 space-y-xs">
              <label className="font-label-lg text-label-lg text-on-surface-variant block">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-4 py-3 font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-colors appearance-none outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Ongoing">Pre-selling / Ongoing</option>
                <option value="Completed">Ready / Completed</option>
              </select>
            </div>

            <div className="w-full md:w-1/4 space-y-xs">
              <label className="font-label-lg text-label-lg text-on-surface-variant block">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-4 py-3 font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-colors appearance-none outline-none"
              >
                <option value="All">All Types</option>
                <option value="Residential">Residential</option>
                <option value="Leisure">Leisure</option>
                <option value="Mixed-Use">Mixed-Use</option>
                <option value="Condominium">Condominium</option>
              </select>
            </div>

            <div className="w-full md:w-1/4">
              <button
                className="w-full bg-primary text-on-primary font-label-lg text-label-lg px-6 py-3 rounded hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer h-[48px]"
              >
                <Filter className="w-4 h-4" />
                <span>Apply Filters</span>
              </button>
            </div>
          </div>
        </section>

        {/* Featured Project Asymmetric Bento Block */}
        {featuredProject && (
          <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            {/* Main featured card */}
            <div className="md:col-span-8 relative rounded-2xl overflow-hidden shadow-lg h-[400px] md:h-[500px] group">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${featuredProject.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-lg w-full text-white">
                <span className="inline-block bg-primary text-on-primary font-label-lg text-label-lg px-3 py-1 rounded-full mb-3 shadow-sm">
                  Featured • {featuredProject.status}
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
                  Explore Project
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

            {/* Side column */}
            <div className="md:col-span-4 flex flex-col gap-gutter h-[400px] md:h-[500px]">
              <div className="flex-1 bg-surface-container-lowest rounded-2xl p-md shadow-sm border border-outline-variant/20 flex flex-col justify-center">
                <EditableText
                  contentKey="projects_invest_title"
                  className="font-headline-sm text-headline-sm text-primary mb-2 font-bold"
                  tag="h3"
                />
                <EditableText
                  contentKey="projects_invest_text"
                  className="font-body-md text-body-md text-on-surface-variant mb-4 leading-relaxed"
                  tag="p"
                  multiline={true}
                />
              </div>
              <div className="flex-1 relative rounded-2xl overflow-hidden shadow-sm border border-outline-variant/20">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${featuredProject.gallery?.[0] ?? featuredProject.image}')` }}
                />
              </div>
            </div>
          </section>
        )}

        {/* All Projects Grid */}
        <section className="space-y-md">
          <div className="flex justify-between items-end border-b border-outline-variant/30 pb-sm">
            <h2 className="font-headline-md text-headline-md text-on-background font-bold">All Projects</h2>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Showing {filteredProjects.length} results
            </span>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-on-surface-variant">
              No projects found matching the selected filter criteria.
            </div>
          )}
        </section>

        {/* Interactive Map Placeholder */}
        <section className="bg-surface-container-low rounded-2xl p-md border border-outline-variant/30 flex flex-col items-center justify-center h-96 relative overflow-hidden group cursor-pointer">
          <div className="absolute inset-0 opacity-10 mix-blend-multiply bg-primary" />
          <div className="z-10 text-center space-y-4 bg-surface/90 backdrop-blur-md p-lg rounded-xl shadow-sm border border-outline-variant/20 max-w-[448px] transition-transform duration-300 group-hover:-translate-y-2">
            <Map className="w-12 h-12 text-primary mx-auto" />
            <h3 className="font-headline-md text-headline-md text-primary font-bold">Interactive Project Map</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Explore the geographical spread of our developments and nearby landmarks.
            </p>
            <button className="bg-primary text-on-primary font-label-lg text-label-lg px-6 py-2 rounded hover:bg-primary-container hover:text-on-primary-container transition-colors w-full cursor-pointer h-[44px]">
              Open Map View
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
export default ProjectsPage;
