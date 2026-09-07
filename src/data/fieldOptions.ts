// Allowed values for the columns Supabase guards with CHECK constraints.
// Inline admin editors must offer these as a fixed list — a free-typed value
// makes the whole save fail with e.g. `projects_status_check`.
import type { Project, Property, Amenity, NewsArticle, GalleryItem } from '../types';

export const PROJECT_STATUS_OPTIONS: Project['status'][] = [
  'Ongoing',
  'Upcoming',
  'Completed',
  'Pre-selling',
];

export const PROJECT_CATEGORY_OPTIONS: Project['category'][] = [
  'Residential',
  'Commercial',
  'Leisure',
  'Mixed-Use',
  'Residential & Commercial',
  'Condominium',
];

export const PROPERTY_STATUS_OPTIONS: Property['status'][] = ['Available', 'Reserved', 'Sold'];

export const PROPERTY_CATEGORY_OPTIONS: Property['category'][] = [
  'Residential Lots',
  'Commercial Properties',
  'Leisure Properties',
  'Villas',
];

export const PROPERTY_LOT_TYPE_OPTIONS: Property['lotType'][] = [
  'Corner Lot',
  'Regular Lot',
  'Lakeside Lot',
  'Park View',
];

export const AMENITY_CATEGORY_OPTIONS: Amenity['category'][] = [
  'Lifestyle',
  'Recreation',
  'Sports',
  'Wellness',
  'Nature',
  'Security',
];

export const NEWS_CATEGORY_OPTIONS: NewsArticle['category'][] = [
  'News',
  'Events',
  'Guides',
  'Announcements',
];

export const GALLERY_CATEGORY_OPTIONS: GalleryItem['category'][] = [
  'Aerial Views',
  'Amenities',
  'Progress',
  'Community',
  'Properties',
];
