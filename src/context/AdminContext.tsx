import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  getPageContent,
  updatePageContentValue,
  getProjects,
  saveProjects,
  deleteProjectById,
  getAmenities,
  saveAmenities,
  deleteAmenityById,
  getProperties,
  saveProperties,
  getUpdates,
  saveUpdates,
} from '../data/db';
import type { Project, Property, Amenity, DevelopmentUpdate } from '../types';

interface AdminContextType {
  isAdmin: boolean;
  loading: boolean;
  pageContent: Record<string, string>;
  projects: Project[];
  properties: Property[];
  amenities: Amenity[];
  updates: DevelopmentUpdate[];
  updateText: (key: string, value: string) => void;
  updateImage: (key: string, value: string) => void;
  updateProjectField: (id: string, field: keyof Project, value: any) => void;
  updateAmenityField: (id: string, field: keyof Amenity, value: any) => void;
  updateUpdateField: (id: string, field: keyof DevelopmentUpdate, value: any) => void;
  addProject: (project: Project) => void;
  addProperty: (property: Property) => void;
  addAmenity: (amenity: Amenity) => void;
  deleteProject: (id: string) => void;
  deleteAmenity: (id: string) => void;
}

export const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  loading: true,
  pageContent: {},
  projects: [],
  properties: [],
  amenities: [],
  updates: [],
  updateText: () => {},
  updateImage: () => {},
  updateProjectField: () => {},
  updateAmenityField: () => {},
  updateUpdateField: () => {},
  addProject: () => {},
  addProperty: () => {},
  addAmenity: () => {},
  deleteProject: () => {},
  deleteAmenity: () => {},
});

export const AdminProvider: React.FC<{ children: React.ReactNode; isAdmin?: boolean }> = ({
  children,
  isAdmin: propIsAdmin = false,
}) => {
  const [isAdmin] = useState(() => propIsAdmin || localStorage.getItem('lcph_admin_logged_in') === 'true');
  const [loading, setLoading] = useState(true);
  const [pageContent, setPageContent] = useState<Record<string, string>>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [updates, setUpdates] = useState<DevelopmentUpdate[]>([]);

  // ─── Initial data load ──────────────────────────────────────────────────────
  const loadAll = useCallback(async () => {
    setLoading(true);
    const [content, projs, props, ams, upds] = await Promise.all([
      getPageContent(),
      getProjects(),
      getProperties(),
      getAmenities(),
      getUpdates(),
    ]);
    setPageContent(content);
    setProjects(projs);
    setProperties(props);
    setAmenities(ams);
    setUpdates(upds);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAll();

    // ─── Supabase Realtime subscriptions ─────────────────────────────────────
    const projectsCh = supabase
      .channel('rt-projects')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        getProjects().then(setProjects);
      })
      .subscribe();

    const amenitiesCh = supabase
      .channel('rt-amenities')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'amenities' }, () => {
        getAmenities().then(setAmenities);
      })
      .subscribe();

    const propertiesCh = supabase
      .channel('rt-properties')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, () => {
        getProperties().then(setProperties);
      })
      .subscribe();

    const updatesCh = supabase
      .channel('rt-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'development_updates' }, () => {
        getUpdates().then(setUpdates);
      })
      .subscribe();

    const contentCh = supabase
      .channel('rt-content')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'page_content' }, () => {
        getPageContent().then(setPageContent);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(projectsCh);
      supabase.removeChannel(amenitiesCh);
      supabase.removeChannel(propertiesCh);
      supabase.removeChannel(updatesCh);
      supabase.removeChannel(contentCh);
    };
  }, [loadAll]);

  // ─── Write helpers ───────────────────────────────────────────────────────────

  const updateText = (key: string, value: string) => {
    updatePageContentValue(key, value);
    setPageContent(prev => ({ ...prev, [key]: value }));
  };

  const updateImage = (key: string, value: string) => {
    updatePageContentValue(key, value);
    setPageContent(prev => ({ ...prev, [key]: value }));
  };

  const updateProjectField = (id: string, field: keyof Project, value: any) => {
    setProjects(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, [field]: value } : item);
      saveProjects(updated);
      return updated;
    });
  };

  const updateAmenityField = (id: string, field: keyof Amenity, value: any) => {
    setAmenities(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, [field]: value } : item);
      saveAmenities(updated);
      return updated;
    });
  };

  const updateUpdateField = (id: string, field: keyof DevelopmentUpdate, value: any) => {
    setUpdates(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, [field]: value } : item);
      saveUpdates(updated);
      return updated;
    });
  };

  const addProject = (project: Project) => {
    setProjects(prev => {
      const list = [...prev, project];
      saveProjects(list);
      return list;
    });
  };

  const addProperty = (property: Property) => {
    setProperties(prev => {
      const list = [...prev, property];
      saveProperties(list);
      return list;
    });
  };

  const addAmenity = (amenity: Amenity) => {
    setAmenities(prev => {
      const list = [...prev, amenity];
      saveAmenities(list);
      return list;
    });
  };

  const deleteProject = (id: string) => {
    deleteProjectById(id);
    setProjects(prev => prev.filter(item => item.id !== id));
  };

  const deleteAmenity = (id: string) => {
    const target = amenities.find(item => item.id === id);
    if (!target) return;
    deleteAmenityById(id);
    setAmenities(prev => prev.filter(item => item.id !== id));
    // Remove orphaned amenity references from projects
    setProjects(prev => {
      const updated = prev.map(proj => ({
        ...proj,
        amenities: proj.amenities.filter(name => name !== target.name),
      }));
      saveProjects(updated);
      return updated;
    });
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        loading,
        pageContent,
        projects,
        properties,
        amenities,
        updates,
        updateText,
        updateImage,
        updateProjectField,
        updateAmenityField,
        updateUpdateField,
        addProject,
        addProperty,
        addAmenity,
        deleteProject,
        deleteAmenity,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
export default AdminProvider;
