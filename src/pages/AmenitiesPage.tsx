import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { AmenityCard } from '../components/cards/AmenityCard';
import { useAdmin } from '../context/AdminContext';
import { EditableText } from '../components/admin/EditableText';
import { Filter, X } from 'lucide-react';
import type { Amenity } from '../types';

export const AmenitiesPage: React.FC = () => {
  const { amenities, projects } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialProject = searchParams.get('project') || 'All';
  const [selectedProject, setSelectedProject] = useState<string>(initialProject);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

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
    <div className="space-y-xl py-sm">
      <div className="container-custom space-y-md">
        <Breadcrumbs items={[{ label: 'Amenities' }]} />

        {/* Page Header */}
        <div className="space-y-xs">
          <EditableText
            contentKey="amenities_hero_title"
            value="Discover Our Amenities"
            className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary font-bold"
            tag="h1"
          />
          <EditableText
            contentKey="amenities_hero_text"
            value="Experience a world of leisure and convenience with our curated selection of world-class estate amenities."
            className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed"
            tag="p"
          />
        </div>

        {/* Filter Bar: Project Filter & Category Tabs */}
        <div className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-outline-variant/20 space-y-md">
          <div className="flex flex-col md:flex-row gap-sm items-start md:items-center justify-between">
            {/* Project Dropdown Filter */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <label className="font-label-lg text-label-lg text-on-surface-variant shrink-0 font-bold flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-primary" />
                <span>Filter by Project:</span>
              </label>
              <select
                value={selectedProject}
                onChange={(e) => handleProjectChange(e.target.value)}
                className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-4 py-2.5 font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none cursor-pointer w-full sm:w-72 font-semibold"
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
              <div className="flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold px-3.5 py-1.5 rounded-full border border-primary/20">
                <span>Filtered for: {selectedProjectObj.name}</span>
                <button
                  onClick={() => handleProjectChange('All')}
                  className="hover:bg-primary/20 p-0.5 rounded-full text-primary transition-colors cursor-pointer"
                  title="Clear Project Filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-outline-variant/20 pt-md">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-lg font-label-lg text-label-lg whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-primary text-on-primary shadow-sm font-bold'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Amenities Grid */}
        {filteredAmenities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {filteredAmenities.map(amenity => (
              <AmenityCard key={amenity.id} amenity={amenity} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface-container-lowest rounded-xl border border-outline-variant/20 space-y-2">
            <p className="text-on-surface font-bold">No amenities found.</p>
            <p className="text-sm text-on-surface-variant">Try selecting a different project or category filter.</p>
            <button
              onClick={() => { handleProjectChange('All'); setSelectedCategory('All'); }}
              className="mt-2 bg-primary text-on-primary font-bold text-xs px-4 py-2 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AmenitiesPage;
