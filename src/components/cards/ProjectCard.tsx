import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Project } from '../../types';
import { useAdmin } from '../../context/AdminContext';
import { EditableText } from '../admin/EditableText';
import { EditableImage } from '../admin/EditableImage';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { updateProjectField } = useAdmin();

  return (
    <motion.div 
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group h-full"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <EditableImage value={project.image} onSave={(val) => updateProjectField(project.id, 'image', val)}>
          {(src) => (
            <img 
              src={src} 
              alt={project.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
        </EditableImage>
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          <span className="bg-primary-container text-on-primary-container text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-md">
            {project.status}
          </span>
          <span className="bg-secondary-container text-on-secondary-container text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-md">
            {project.category}
          </span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-1.5 text-body-sm text-body-sm text-on-surface-variant font-medium mb-1">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <EditableText 
              value={project.location}
              onSave={(val) => updateProjectField(project.id, 'location', val)}
              tag="span"
            />
          </div>
          
          <EditableText
            value={project.name}
            onSave={(val) => updateProjectField(project.id, 'name', val)}
            className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors font-bold"
            tag="h3"
          />

          <p className="text-body-sm text-body-sm text-on-surface-variant font-medium italic mt-1 line-clamp-1">
            "<EditableText
              value={project.tagline}
              onSave={(val) => updateProjectField(project.id, 'tagline', val)}
              tag="span"
            />"
          </p>
          
          <EditableText
            value={project.description}
            onSave={(val) => updateProjectField(project.id, 'description', val)}
            className="text-body-sm text-body-sm text-on-surface-variant mt-3 line-clamp-2 leading-relaxed"
            tag="p"
            multiline={true}
          />
        </div>

        {/* Specs highlights */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-outline-variant/20 text-body-sm">
          <div>
            <span className="text-on-surface-variant block opacity-85">Total Area</span>
            <EditableText
              value={project.specs.totalArea}
              onSave={(val) => updateProjectField(project.id, 'specs', { ...project.specs, totalArea: val })}
              className="text-on-surface font-semibold"
              tag="strong"
            />
          </div>
          <div>
            <span className="text-on-surface-variant block opacity-85">Lot Sizes</span>
            <EditableText
              value={project.specs.lotSizes}
              onSave={(val) => updateProjectField(project.id, 'specs', { ...project.specs, lotSizes: val })}
              className="text-on-surface font-semibold"
              tag="strong"
            />
          </div>
        </div>

        <Link
          to={`/projects/${project.slug}`}
          className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-on-primary font-label-lg text-label-lg rounded hover:bg-primary-container hover:text-on-primary-container transition-all group-hover:shadow-md cursor-pointer"
        >
          <span>View Master Plan</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
};
export default ProjectCard;

