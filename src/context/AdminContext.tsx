import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useReducer, useRef } from 'react';
import { QueryClientProvider, useQueries, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { queryClient as sharedQueryClient, queryKeys } from '../lib/queryClient';
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
  deleteUpdateById,
  getNews,
  saveNews,
  deleteNewsById,
  getGallery,
  saveGallery,
  deleteGalleryById,
} from '../data/db';
import type { Project, Property, Amenity, DevelopmentUpdate, NewsArticle, GalleryItem } from '../types';

/**
 * Edits are staged in memory and only written to Supabase when saveChanges() runs.
 * Every mutation pushes a new snapshot onto a history stack, which is what powers undo/redo.
 */
interface Snapshot {
  pageContent: Record<string, string>;
  projects: Project[];
  properties: Property[];
  amenities: Amenity[];
  updates: DevelopmentUpdate[];
  news: NewsArticle[];
  gallery: GalleryItem[];
}

const EMPTY_SNAPSHOT: Snapshot = {
  pageContent: {},
  projects: [],
  properties: [],
  amenities: [],
  updates: [],
  news: [],
  gallery: [],
};

/** How many undo steps to keep. */
const HISTORY_LIMIT = 60;

interface HistoryState {
  history: Snapshot[];
  cursor: number;
  /** Last state known to match the database. */
  baseline: Snapshot;
  /** False until server data has been loaded into history — what `loading` is derived from. */
  hydrated: boolean;
}

type HistoryAction =
  | { type: 'load'; snapshot: Snapshot }
  | { type: 'commit'; snapshot: Snapshot }
  | { type: 'undo' }
  | { type: 'redo' }
  | { type: 'saved' }
  | { type: 'discard' };

const initialHistory: HistoryState = {
  history: [EMPTY_SNAPSHOT],
  cursor: 0,
  baseline: EMPTY_SNAPSHOT,
  hydrated: false,
};

function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case 'load':
      return { history: [action.snapshot], cursor: 0, baseline: action.snapshot, hydrated: true };

    case 'commit': {
      // Anything after the cursor is a redo branch the new edit replaces.
      const kept = state.history.slice(0, state.cursor + 1);
      const next = [...kept, action.snapshot].slice(-HISTORY_LIMIT);
      return { ...state, history: next, cursor: next.length - 1 };
    }

    case 'undo':
      return state.cursor > 0 ? { ...state, cursor: state.cursor - 1 } : state;

    case 'redo':
      return state.cursor < state.history.length - 1 ? { ...state, cursor: state.cursor + 1 } : state;

    case 'saved':
      return { ...state, baseline: state.history[state.cursor] };

    case 'discard':
      return { ...state, history: [state.baseline], cursor: 0, baseline: state.baseline };

    default:
      return state;
  }
}

/** Work the next save needs to push to Supabase. */
interface ChangePlan {
  contentKeys: string[];
  projects: Project[];
  removedProjectIds: string[];
  amenities: Amenity[];
  removedAmenityIds: string[];
  properties: Property[];
  updates: DevelopmentUpdate[];
  removedUpdateIds: string[];
  news: NewsArticle[];
  removedNewsIds: string[];
  gallery: GalleryItem[];
  removedGalleryIds: string[];
  total: number;
}

const sameJson = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

function buildChangePlan(baseline: Snapshot, current: Snapshot): ChangePlan {
  const contentKeys = Object.keys(current.pageContent).filter(
    (key) => current.pageContent[key] !== baseline.pageContent[key],
  );

  const changedRows = <T extends { id: string }>(before: T[], after: T[]) => {
    const byId = new Map(before.map((row) => [row.id, row]));
    return after.filter((row) => !sameJson(byId.get(row.id), row));
  };

  const removedIds = <T extends { id: string }>(before: T[], after: T[]) => {
    const ids = new Set(after.map((row) => row.id));
    return before.filter((row) => !ids.has(row.id)).map((row) => row.id);
  };

  const projects = changedRows(baseline.projects, current.projects);
  const amenities = changedRows(baseline.amenities, current.amenities);
  const properties = changedRows(baseline.properties, current.properties);
  const updates = changedRows(baseline.updates, current.updates);
  const news = changedRows(baseline.news, current.news);
  const gallery = changedRows(baseline.gallery, current.gallery);
  const removedProjectIds = removedIds(baseline.projects, current.projects);
  const removedAmenityIds = removedIds(baseline.amenities, current.amenities);
  const removedUpdateIds = removedIds(baseline.updates, current.updates);
  const removedNewsIds = removedIds(baseline.news, current.news);
  const removedGalleryIds = removedIds(baseline.gallery, current.gallery);

  return {
    contentKeys,
    projects,
    removedProjectIds,
    amenities,
    removedAmenityIds,
    properties,
    updates,
    removedUpdateIds,
    news,
    removedNewsIds,
    gallery,
    removedGalleryIds,
    total:
      contentKeys.length +
      projects.length +
      amenities.length +
      properties.length +
      updates.length +
      news.length +
      gallery.length +
      removedProjectIds.length +
      removedAmenityIds.length +
      removedUpdateIds.length +
      removedNewsIds.length +
      removedGalleryIds.length,
  };
}

export interface SaveResult {
  ok: boolean;
  saved: number;
  error?: string;
}

interface AdminContextType {
  isAdmin: boolean;
  loading: boolean;
  contentError: boolean;
  pageContent: Record<string, string>;
  projects: Project[];
  properties: Property[];
  amenities: Amenity[];
  updates: DevelopmentUpdate[];
  news: NewsArticle[];
  gallery: GalleryItem[];
  updateText: (key: string, value: string) => void;
  updateImage: (key: string, value: string) => void;
  updateProjectField: (id: string, field: keyof Project, value: any) => void;
  updatePropertyField: (id: string, field: keyof Property, value: any) => void;
  updateAmenityField: (id: string, field: keyof Amenity, value: any) => void;
  updateUpdateField: (id: string, field: keyof DevelopmentUpdate, value: any) => void;
  addUpdate: (update: DevelopmentUpdate) => void;
  deleteUpdate: (id: string) => void;
  addProject: (project: Project) => void;
  addProperty: (property: Property) => void;
  addAmenity: (amenity: Amenity) => void;
  deleteProject: (id: string) => void;
  deleteAmenity: (id: string) => void;
  updateNewsField: (id: string, field: keyof NewsArticle, value: any) => void;
  addNews: (article: NewsArticle) => void;
  deleteNews: (id: string) => void;
  updateGalleryField: (id: string, field: keyof GalleryItem, value: any) => void;
  addGalleryItem: (item: GalleryItem) => void;
  deleteGalleryItem: (id: string) => void;
  // ─── Draft / history controls ──────────────────────────────────────────────
  /** Number of pending changes waiting to be written to Supabase. */
  pendingCount: number;
  hasUnsavedChanges: boolean;
  canUndo: boolean;
  canRedo: boolean;
  saving: boolean;
  undo: () => void;
  redo: () => void;
  /** Writes every staged change to Supabase. */
  saveChanges: () => Promise<SaveResult>;
  /** Throws away staged changes and returns to the last saved state. */
  discardChanges: () => void;
}

const noop = () => {};

export const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  loading: true,
  contentError: false,
  pageContent: {},
  projects: [],
  properties: [],
  amenities: [],
  updates: [],
  news: [],
  gallery: [],
  updateText: noop,
  updateImage: noop,
  updateProjectField: noop,
  updatePropertyField: noop,
  updateAmenityField: noop,
  updateUpdateField: noop,
  addUpdate: noop,
  deleteUpdate: noop,
  addProject: noop,
  addProperty: noop,
  addAmenity: noop,
  deleteProject: noop,
  deleteAmenity: noop,
  updateNewsField: noop,
  addNews: noop,
  deleteNews: noop,
  updateGalleryField: noop,
  addGalleryItem: noop,
  deleteGalleryItem: noop,
  pendingCount: 0,
  hasUnsavedChanges: false,
  canUndo: false,
  canRedo: false,
  saving: false,
  undo: noop,
  redo: noop,
  saveChanges: async () => ({ ok: true, saved: 0 }),
  discardChanges: noop,
});

/** Realtime table name → the query it invalidates. */
const REALTIME_TABLES = [
  { table: 'page_content', key: queryKeys.pageContent },
  { table: 'projects', key: queryKeys.projects },
  { table: 'properties', key: queryKeys.properties },
  { table: 'amenities', key: queryKeys.amenities },
  { table: 'development_updates', key: queryKeys.updates },
  { table: 'news', key: queryKeys.news },
  { table: 'gallery', key: queryKeys.gallery },
] as const;

const AdminProviderInner: React.FC<{
  children: React.ReactNode;
  isAdmin?: boolean;
  /** Show the last saved snapshot and disable editing while keeping the draft in memory. */
  previewSaved?: boolean;
}> = ({
  children,
  isAdmin: propIsAdmin = false,
  previewSaved = false,
}) => {
  const isAdmin = propIsAdmin && !previewSaved;
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();
  const [state, dispatch] = useReducer(historyReducer, initialHistory);

  const snapshot = state.history[state.cursor];
  const visibleSnapshot = previewSaved ? state.baseline : snapshot;
  const { pageContent, projects, properties, amenities, updates, news, gallery } = visibleSnapshot;

  const plan = useMemo(() => buildChangePlan(state.baseline, snapshot), [state.baseline, snapshot]);
  const hasUnsavedChanges = plan.total > 0;

  // Realtime must not clobber unsaved work, so the guard is read from a ref inside the handlers.
  const dirtyRef = useRef(false);
  dirtyRef.current = hasUnsavedChanges;

  // ─── Data loading (TanStack Query) ──────────────────────────────────────────
  // One query per table so a realtime event only refetches what actually changed.
  const [contentQ, projectsQ, propertiesQ, amenitiesQ, updatesQ, newsQ, galleryQ] = useQueries({
    queries: [
      { queryKey: queryKeys.pageContent, queryFn: getPageContent },
      { queryKey: queryKeys.projects, queryFn: getProjects },
      { queryKey: queryKeys.properties, queryFn: getProperties },
      { queryKey: queryKeys.amenities, queryFn: getAmenities },
      { queryKey: queryKeys.updates, queryFn: getUpdates },
      { queryKey: queryKeys.news, queryFn: getNews },
      { queryKey: queryKeys.gallery, queryFn: getGallery },
    ],
  });

  const contentError = [contentQ, projectsQ, propertiesQ, amenitiesQ, updatesQ, newsQ, galleryQ]
    .some((query) => query.isError);

  // The whole site renders from one snapshot, so nothing is published until every table has arrived.
  const remoteSnapshot: Snapshot | null = useMemo(() => {
    if (
      !contentQ.data ||
      !projectsQ.data ||
      !propertiesQ.data ||
      !amenitiesQ.data ||
      !updatesQ.data ||
      !newsQ.data ||
      !galleryQ.data
    ) {
      return null;
    }
    return {
      pageContent: contentQ.data,
      projects: projectsQ.data,
      properties: propertiesQ.data,
      amenities: amenitiesQ.data,
      updates: updatesQ.data,
      news: newsQ.data,
      gallery: galleryQ.data,
    };
  }, [
    contentQ.data,
    projectsQ.data,
    propertiesQ.data,
    amenitiesQ.data,
    updatesQ.data,
    newsQ.data,
    galleryQ.data,
  ]);

  /**
   * Derived from the reducer, not from the queries: query data lands one render before the
   * effect below copies it into history, and reporting "loaded" during that gap paints the whole
   * site once against an empty snapshot (blank text, empty image src).
   */
  const loading = !state.hydrated;

  /**
   * Fresh server data becomes the new baseline and clears history.
   * Skipped while local edits are pending — a draft must never be overwritten.
   */
  useEffect(() => {
    if (!remoteSnapshot || dirtyRef.current) return;
    dispatch({ type: 'load', snapshot: remoteSnapshot });
  }, [remoteSnapshot]);

  useEffect(() => {
    // A remote change marks that table stale; the refetch flows back through the effect above.
    const channels = REALTIME_TABLES.map(({ table, key }) =>
      supabase
        .channel(`rt-${table}`)
        .on('postgres_changes', { event: '*', schema: 'public', table }, () => {
          if (dirtyRef.current) return;
          queryClient.invalidateQueries({ queryKey: key });
        })
        .subscribe(),
    );

    return () => {
      channels.forEach((channel) => supabase.removeChannel(channel));
    };
  }, [queryClient]);

  // ─── Staged mutations (memory only) ─────────────────────────────────────────

  // commit() reads the live snapshot through a ref so batched calls don't stack on stale state.
  const snapshotRef = useRef(snapshot);
  snapshotRef.current = snapshot;

  const commit = useCallback((mutate: (current: Snapshot) => Snapshot) => {
    const next = mutate(snapshotRef.current);
    // Advanced synchronously so several mutations in one event stack instead of overwriting each other.
    snapshotRef.current = next;
    dispatch({ type: 'commit', snapshot: next });
  }, []);

  const setContentValue = useCallback(
    (key: string, value: string) => {
      commit((current) => ({ ...current, pageContent: { ...current.pageContent, [key]: value } }));
    },
    [commit],
  );

  const updateText = setContentValue;
  const updateImage = setContentValue;

  const updateProjectField = useCallback(
    (id: string, field: keyof Project, value: any) => {
      commit((current) => ({
        ...current,
        projects: current.projects.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
      }));
    },
    [commit],
  );

  const updatePropertyField = useCallback(
    (id: string, field: keyof Property, value: any) => {
      commit((current) => ({
        ...current,
        properties: current.properties.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
      }));
    },
    [commit],
  );

  const updateAmenityField = useCallback(
    (id: string, field: keyof Amenity, value: any) => {
      commit((current) => ({
        ...current,
        amenities: current.amenities.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
      }));
    },
    [commit],
  );

  const updateUpdateField = useCallback(
    (id: string, field: keyof DevelopmentUpdate, value: any) => {
      commit((current) => ({
        ...current,
        updates: current.updates.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
      }));
    },
    [commit],
  );

  // New updates go to the front so the admin sees what they just created without scrolling.
  const addUpdate = useCallback(
    (update: DevelopmentUpdate) => commit((current) => ({ ...current, updates: [update, ...current.updates] })),
    [commit],
  );

  const deleteUpdate = useCallback(
    (id: string) => commit((current) => ({ ...current, updates: current.updates.filter((item) => item.id !== id) })),
    [commit],
  );

  const addProject = useCallback(
    (project: Project) => commit((current) => ({ ...current, projects: [...current.projects, project] })),
    [commit],
  );

  const addProperty = useCallback(
    (property: Property) => commit((current) => ({ ...current, properties: [...current.properties, property] })),
    [commit],
  );

  const addAmenity = useCallback(
    (amenity: Amenity) => commit((current) => ({ ...current, amenities: [...current.amenities, amenity] })),
    [commit],
  );

  const deleteProject = useCallback(
    (id: string) => commit((current) => ({ ...current, projects: current.projects.filter((p) => p.id !== id) })),
    [commit],
  );

  const deleteAmenity = useCallback(
    (id: string) =>
      commit((current) => {
        const target = current.amenities.find((item) => item.id === id);
        if (!target) return current;
        return {
          ...current,
          amenities: current.amenities.filter((item) => item.id !== id),
          // Drop orphaned references from projects too
          projects: current.projects.map((proj) => ({
            ...proj,
            amenities: proj.amenities.filter((name) => name !== target.name),
          })),
        };
      }),
    [commit],
  );

  // ─── News ───────────────────────────────────────────────────────────────────

  const updateNewsField = useCallback(
    (id: string, field: keyof NewsArticle, value: any) => {
      commit((current) => ({
        ...current,
        news: current.news.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
      }));
    },
    [commit],
  );

  const addNews = useCallback(
    (article: NewsArticle) => commit((current) => ({ ...current, news: [article, ...current.news] })),
    [commit],
  );

  const deleteNews = useCallback(
    (id: string) => commit((current) => ({ ...current, news: current.news.filter((item) => item.id !== id) })),
    [commit],
  );

  // ─── Gallery ────────────────────────────────────────────────────────────────

  const updateGalleryField = useCallback(
    (id: string, field: keyof GalleryItem, value: any) => {
      commit((current) => ({
        ...current,
        gallery: current.gallery.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
      }));
    },
    [commit],
  );

  const addGalleryItem = useCallback(
    (item: GalleryItem) => commit((current) => ({ ...current, gallery: [item, ...current.gallery] })),
    [commit],
  );

  const deleteGalleryItem = useCallback(
    (id: string) => commit((current) => ({ ...current, gallery: current.gallery.filter((item) => item.id !== id) })),
    [commit],
  );

  // ─── History + persistence ──────────────────────────────────────────────────

  const undo = useCallback(() => dispatch({ type: 'undo' }), []);
  const redo = useCallback(() => dispatch({ type: 'redo' }), []);
  const discardChanges = useCallback(() => dispatch({ type: 'discard' }), []);

  const saveChanges = useCallback(async (): Promise<SaveResult> => {
    const pending = buildChangePlan(state.baseline, snapshotRef.current);
    if (pending.total === 0) return { ok: true, saved: 0 };

    setSaving(true);
    try {
      const current = snapshotRef.current;

      for (const key of pending.contentKeys) {
        await updatePageContentValue(key, current.pageContent[key]);
      }
      if (pending.projects.length) await saveProjects(pending.projects);
      if (pending.amenities.length) await saveAmenities(pending.amenities);
      if (pending.properties.length) await saveProperties(pending.properties);
      if (pending.updates.length) await saveUpdates(pending.updates);
      if (pending.news.length) await saveNews(pending.news);
      if (pending.gallery.length) await saveGallery(pending.gallery);
      for (const id of pending.removedUpdateIds) await deleteUpdateById(id);
      for (const id of pending.removedNewsIds) await deleteNewsById(id);
      for (const id of pending.removedGalleryIds) await deleteGalleryById(id);
      for (const id of pending.removedProjectIds) await deleteProjectById(id);
      for (const id of pending.removedAmenityIds) await deleteAmenityById(id);

      dispatch({ type: 'saved' });
      // Draft is now clean, so refetching is safe and keeps the cache honest.
      dirtyRef.current = false;
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
      return { ok: true, saved: pending.total };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error while saving.';
      console.error('saveChanges:', message);
      return { ok: false, saved: 0, error: message };
    } finally {
      setSaving(false);
    }
  }, [state.baseline, queryClient]);

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        loading,
        contentError,
        pageContent,
        projects,
        properties,
        amenities,
        updates,
        news,
        gallery,
        updateText,
        updateImage,
        updateProjectField,
        updatePropertyField,
        updateAmenityField,
        updateUpdateField,
        addUpdate,
        deleteUpdate,
        addProject,
        addProperty,
        addAmenity,
        deleteProject,
        deleteAmenity,
        updateNewsField,
        addNews,
        deleteNews,
        updateGalleryField,
        addGalleryItem,
        deleteGalleryItem,
        pendingCount: plan.total,
        hasUnsavedChanges,
        canUndo: state.cursor > 0,
        canRedo: state.cursor < state.history.length - 1,
        saving,
        undo,
        redo,
        saveChanges,
        discardChanges,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

/**
 * Wraps the provider in its own QueryClientProvider so both the public site and
 * the admin app get the cache without touching their entry points.
 */
export const AdminProvider: React.FC<{
  children: React.ReactNode;
  isAdmin?: boolean;
  previewSaved?: boolean;
}> = ({ children, ...props }) => (
  <QueryClientProvider client={sharedQueryClient}>
    <AdminProviderInner {...props}>{children}</AdminProviderInner>
  </QueryClientProvider>
);

export const useAdmin = () => useContext(AdminContext);
export default AdminProvider;
