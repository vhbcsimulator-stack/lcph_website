import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useReducer, useRef } from 'react';
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
}

const EMPTY_SNAPSHOT: Snapshot = {
  pageContent: {},
  projects: [],
  properties: [],
  amenities: [],
  updates: [],
};

/** How many undo steps to keep. */
const HISTORY_LIMIT = 60;

interface HistoryState {
  history: Snapshot[];
  cursor: number;
  /** Last state known to match the database. */
  baseline: Snapshot;
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
};

function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case 'load':
      return { history: [action.snapshot], cursor: 0, baseline: action.snapshot };

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
      return { history: [state.baseline], cursor: 0, baseline: state.baseline };

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
  const removedProjectIds = removedIds(baseline.projects, current.projects);
  const removedAmenityIds = removedIds(baseline.amenities, current.amenities);

  return {
    contentKeys,
    projects,
    removedProjectIds,
    amenities,
    removedAmenityIds,
    properties,
    updates,
    total:
      contentKeys.length +
      projects.length +
      amenities.length +
      properties.length +
      updates.length +
      removedProjectIds.length +
      removedAmenityIds.length,
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
  pageContent: Record<string, string>;
  projects: Project[];
  properties: Property[];
  amenities: Amenity[];
  updates: DevelopmentUpdate[];
  updateText: (key: string, value: string) => void;
  updateImage: (key: string, value: string) => void;
  updateProjectField: (id: string, field: keyof Project, value: any) => void;
  updatePropertyField: (id: string, field: keyof Property, value: any) => void;
  updateAmenityField: (id: string, field: keyof Amenity, value: any) => void;
  updateUpdateField: (id: string, field: keyof DevelopmentUpdate, value: any) => void;
  addProject: (project: Project) => void;
  addProperty: (property: Property) => void;
  addAmenity: (amenity: Amenity) => void;
  deleteProject: (id: string) => void;
  deleteAmenity: (id: string) => void;
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
  pageContent: {},
  projects: [],
  properties: [],
  amenities: [],
  updates: [],
  updateText: noop,
  updateImage: noop,
  updateProjectField: noop,
  updatePropertyField: noop,
  updateAmenityField: noop,
  updateUpdateField: noop,
  addProject: noop,
  addProperty: noop,
  addAmenity: noop,
  deleteProject: noop,
  deleteAmenity: noop,
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

export const AdminProvider: React.FC<{ children: React.ReactNode; isAdmin?: boolean }> = ({
  children,
  isAdmin: propIsAdmin = false,
}) => {
  const [isAdmin] = useState(() => propIsAdmin || localStorage.getItem('lcph_admin_logged_in') === 'true');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [state, dispatch] = useReducer(historyReducer, initialHistory);

  const snapshot = state.history[state.cursor];
  const { pageContent, projects, properties, amenities, updates } = snapshot;

  const plan = useMemo(() => buildChangePlan(state.baseline, snapshot), [state.baseline, snapshot]);
  const hasUnsavedChanges = plan.total > 0;

  // Realtime must not clobber unsaved work, so the guard is read from a ref inside the handlers.
  const dirtyRef = useRef(false);
  dirtyRef.current = hasUnsavedChanges;

  // ─── Initial data load ──────────────────────────────────────────────────────
  const loadAll = useCallback(async () => {
    const [content, projs, props, ams, upds] = await Promise.all([
      getPageContent(),
      getProjects(),
      getProperties(),
      getAmenities(),
      getUpdates(),
    ]);
    dispatch({
      type: 'load',
      snapshot: { pageContent: content, projects: projs, properties: props, amenities: ams, updates: upds },
    });
  }, []);

  useEffect(() => {
    loadAll().finally(() => setLoading(false));

    /**
     * A remote change refetches everything so the baseline stays truthful.
     * Skipped while local edits are pending — a draft must never be overwritten.
     */
    const reloadIfClean = () => {
      if (dirtyRef.current) return;
      loadAll();
    };

    const projectsCh = supabase
      .channel('rt-projects')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, reloadIfClean)
      .subscribe();

    const amenitiesCh = supabase
      .channel('rt-amenities')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'amenities' }, reloadIfClean)
      .subscribe();

    const propertiesCh = supabase
      .channel('rt-properties')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, reloadIfClean)
      .subscribe();

    const updatesCh = supabase
      .channel('rt-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'development_updates' }, reloadIfClean)
      .subscribe();

    const contentCh = supabase
      .channel('rt-content')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'page_content' }, reloadIfClean)
      .subscribe();

    return () => {
      supabase.removeChannel(projectsCh);
      supabase.removeChannel(amenitiesCh);
      supabase.removeChannel(propertiesCh);
      supabase.removeChannel(updatesCh);
      supabase.removeChannel(contentCh);
    };
  }, [loadAll]);

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
      for (const id of pending.removedProjectIds) await deleteProjectById(id);
      for (const id of pending.removedAmenityIds) await deleteAmenityById(id);

      dispatch({ type: 'saved' });
      return { ok: true, saved: pending.total };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error while saving.';
      console.error('saveChanges:', message);
      return { ok: false, saved: 0, error: message };
    } finally {
      setSaving(false);
    }
  }, [state.baseline]);

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
        updatePropertyField,
        updateAmenityField,
        updateUpdateField,
        addProject,
        addProperty,
        addAmenity,
        deleteProject,
        deleteAmenity,
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

export const useAdmin = () => useContext(AdminContext);
export default AdminProvider;
