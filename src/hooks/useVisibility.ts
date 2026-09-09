import { useCallback, useMemo } from 'react';
import { useAdmin } from '../context/AdminContext';
import {
  VISIBILITY_KEY,
  isPathHidden,
  parseVisibility,
  serializeVisibility,
  type VisibilityState,
} from '../data/visibility';

export interface VisibilityApi {
  /** True while the current viewer is an editing admin — hidden blocks stay on screen for them. */
  isAdmin: boolean;
  hidden: VisibilityState;
  isPageHidden: (pageId: string) => boolean;
  isSectionHidden: (sectionId: string) => boolean;
  /** True when the given route should render as Not Found for the public. */
  isRouteHidden: (pathname: string) => boolean;
  togglePage: (pageId: string) => void;
  toggleSection: (sectionId: string) => void;
}

const toggleIn = (list: string[], id: string) =>
  list.includes(id) ? list.filter((entry) => entry !== id) : [...list, id];

/**
 * Reads and writes the hidden set. Writes go through `updateText`, so a visibility change is a
 * staged edit like any other: it counts toward the pending badge, undoes and redoes, and only
 * reaches Supabase on Save.
 */
export const useVisibility = (): VisibilityApi => {
  const { isAdmin, pageContent, updateText } = useAdmin();

  const hidden = useMemo(() => parseVisibility(pageContent[VISIBILITY_KEY]), [pageContent]);

  const write = useCallback(
    (next: VisibilityState) => updateText(VISIBILITY_KEY, serializeVisibility(next)),
    [updateText],
  );

  const togglePage = useCallback(
    (pageId: string) => write({ ...hidden, pages: toggleIn(hidden.pages, pageId) }),
    [hidden, write],
  );

  const toggleSection = useCallback(
    (sectionId: string) => write({ ...hidden, sections: toggleIn(hidden.sections, sectionId) }),
    [hidden, write],
  );

  return {
    isAdmin,
    hidden,
    isPageHidden: (pageId: string) => hidden.pages.includes(pageId),
    isSectionHidden: (sectionId: string) => hidden.sections.includes(sectionId),
    isRouteHidden: (pathname: string) => isPathHidden(pathname, hidden.pages),
    togglePage,
    toggleSection,
  };
};

export default useVisibility;
