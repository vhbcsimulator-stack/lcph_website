/**
 * Page / section visibility.
 *
 * Admins can hide any registered page or section from the public site. The hidden set is stored in
 * the existing `page_content` table under one key, so it rides the same staged-edit, undo/redo,
 * realtime and save plumbing as every other CMS value and needs no schema change.
 *
 * Nothing here deletes content: hiding is reversible, and admins still see hidden blocks (dimmed,
 * with a toggle) while editing so they can find and restore them.
 */

/** page_content key holding the serialized hidden set. */
export const VISIBILITY_KEY = 'site_visibility';

export interface VisibilityPage {
  /** Route path, and the id used in the hidden set. */
  id: string;
  label: string;
  /** Pages the site cannot function without — offered read-only in the admin panel. */
  locked?: boolean;
}

export interface VisibilitySection {
  id: string;
  label: string;
  /** Page id (route path) this section belongs to, for grouping in the admin panel. */
  page: string;
}

/**
 * Every hideable route. Detail routes (`/projects/:slug`) follow their index page: hiding
 * `/projects` hides the detail pages under it too — see `isPathHidden`.
 */
export const VISIBILITY_PAGES: VisibilityPage[] = [
  { id: '/', label: 'Home', locked: true },
  { id: '/about', label: 'About Us' },
  { id: '/projects', label: 'Projects' },
  { id: '/amenities', label: 'Amenities' },
  { id: '/updates', label: 'Updates' },
  { id: '/news', label: 'News' },
  { id: '/gallery', label: 'Gallery' },
  { id: '/contact', label: 'Contact Us' },
  { id: '/schedule-site-visit', label: 'Schedule a Site Visit' },
  { id: '/faqs', label: 'FAQs' },
  { id: '/careers', label: 'Careers' },
  { id: '/partner-with-us', label: 'Partner With Us' },
  { id: '/privacy-policy', label: 'Privacy Policy' },
  { id: '/terms', label: 'Terms of Service' },
  { id: '/cookie-policy', label: 'Cookie Policy' },
];

/** Every hideable section, in the order it appears on its page. */
export const VISIBILITY_SECTIONS: VisibilitySection[] = [
  // Site-wide chrome
  { id: 'chrome.announcement', label: 'Announcement bar', page: 'chrome' },
  { id: 'chrome.header_cta', label: 'Header "Inquire Now" button', page: 'chrome' },
  { id: 'chrome.footer_company', label: 'Footer: Company links', page: 'chrome' },
  { id: 'chrome.footer_legal', label: 'Footer: Legal links', page: 'chrome' },

  // Home
  { id: 'home.hero', label: 'Hero', page: '/' },
  { id: 'home.intro', label: 'Introduction', page: '/' },
  { id: 'home.spotlight', label: 'Featured flagship spotlight', page: '/' },
  { id: 'home.projects', label: 'Projects grid', page: '/' },
  { id: 'home.amenities', label: 'Amenities preview', page: '/' },
  { id: 'home.updates', label: 'Development progress updates', page: '/' },
  { id: 'home.faq', label: 'Frequently asked questions', page: '/' },
  { id: 'home.contact', label: 'Inquiry and contact form', page: '/' },

  // About
  { id: 'about.hero', label: 'Page header', page: '/about' },
  { id: 'about.overview', label: 'Company overview', page: '/about' },
  { id: 'about.pillars', label: 'Mission, vision and values', page: '/about' },
  { id: 'about.cta', label: 'Closing call to action', page: '/about' },

  // Projects
  { id: 'projects.header', label: 'Page header and featured project', page: '/projects' },
  { id: 'projects.grid', label: 'All projects grid', page: '/projects' },

  // Amenities
  { id: 'amenities.header', label: 'Page header', page: '/amenities' },
  { id: 'amenities.grid', label: 'Amenities grid', page: '/amenities' },

  // Updates
  { id: 'updates.header', label: 'Page header', page: '/updates' },
  { id: 'updates.feed', label: 'Report feed', page: '/updates' },

  // News
  { id: 'news.header', label: 'Page header', page: '/news' },
  { id: 'news.feed', label: 'Article feed', page: '/news' },

  // Gallery
  { id: 'gallery.header', label: 'Page header', page: '/gallery' },
  { id: 'gallery.grid', label: 'Media grid', page: '/gallery' },

  // FAQ
  { id: 'faq.header', label: 'Page header', page: '/faqs' },
  { id: 'faq.list', label: 'Question list', page: '/faqs' },

  // Contact
  { id: 'contact.body', label: 'Form and office information', page: '/contact' },
  { id: 'contact.map', label: 'Location map', page: '/contact' },
];

const SECTION_IDS = new Set(VISIBILITY_SECTIONS.map((section) => section.id));
const LOCKED_PAGE_IDS = new Set(VISIBILITY_PAGES.filter((page) => page.locked).map((page) => page.id));

export interface VisibilityState {
  pages: string[];
  sections: string[];
}

export const EMPTY_VISIBILITY: VisibilityState = { pages: [], sections: [] };

/**
 * Reads the stored value defensively: it is hand-editable JSON in a text column, and an unreadable
 * value must fall back to "everything visible" rather than blanking the site.
 *
 * Ids no longer in the registry are dropped, and locked pages can never be hidden even if an older
 * value says so.
 */
export const parseVisibility = (raw: string | undefined): VisibilityState => {
  if (!raw) return EMPTY_VISIBILITY;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return EMPTY_VISIBILITY;
    const list = (value: unknown, keep: (id: string) => boolean) =>
      Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string' && keep(id)) : [];
    return {
      pages: list(parsed.pages, (id) => !LOCKED_PAGE_IDS.has(id)),
      sections: list(parsed.sections, (id) => SECTION_IDS.has(id)),
    };
  } catch {
    return EMPTY_VISIBILITY;
  }
};

export const serializeVisibility = (state: VisibilityState): string =>
  JSON.stringify({ pages: [...state.pages].sort(), sections: [...state.sections].sort() });

/**
 * A route is hidden when its own path is hidden, or when it sits under a hidden index page — so
 * hiding `/projects` also hides `/projects/lakeshore-community-north`.
 */
export const isPathHidden = (pathname: string, hiddenPages: readonly string[]): boolean =>
  hiddenPages.some((id) => (id === '/' ? pathname === '/' : pathname === id || pathname.startsWith(`${id}/`)));
