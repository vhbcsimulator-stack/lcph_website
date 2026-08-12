export interface Project {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  location: string;
  status: 'Ongoing' | 'Upcoming' | 'Completed' | 'Pre-selling';
  category: 'Residential' | 'Commercial' | 'Leisure' | 'Mixed-Use' | 'Residential & Commercial' | 'Condominium';
  description: string;
  longDescription: string;
  image: string;
  gallery: string[];
  specs: {
    totalArea: string;
    totalUnits: string;
    lotSizes: string;
    priceRange: string;
  };
  amenities: string[];
  featured?: boolean;
  video?: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  projectId: string;
  projectName: string;
  location: string;
  category: 'Residential Lots' | 'Commercial Properties' | 'Leisure Properties' | 'Villas';
  lotSize: number; // in sqm
  floorArea?: number; // in sqm
  pricePlaceholder: string;
  status: 'Available' | 'Reserved' | 'Sold';
  lotType: 'Corner Lot' | 'Regular Lot' | 'Lakeside Lot' | 'Park View';
  description: string;
  features: string[];
  images: string[];
  featured?: boolean;
}

export interface Amenity {
  id: string;
  name: string;
  category: 'Lifestyle' | 'Recreation' | 'Sports' | 'Wellness' | 'Nature' | 'Security';
  description: string;
  image: string;
  highlights: string[];
}

export interface DevelopmentUpdate {
  id: string;
  slug: string;
  title: string;
  date: string;
  projectId: string;
  projectName: string;
  progressPercentage: number;
  summary: string;
  content: string;
  image: string;
  gallery: string[];
  featured?: boolean;
  /** Label for the outlined chip on the card; falls back to a progress-derived one when blank. */
  status?: string;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: 'News' | 'Events' | 'Guides' | 'Announcements';
  author: string;
  readTime: string;
  excerpt: string;
  content: string;
  image: string;
  featured?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Aerial Views' | 'Amenities' | 'Progress' | 'Community' | 'Properties';
  mediaType: 'image' | 'video';
  url: string;
  thumbnail: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  /** Free-form: admins can create their own. FAQ_CATEGORIES in data/faqContent holds the suggested set. */
  category: string;
}

export interface CareerPosition {
  id: string;
  slug: string;
  title: string;
  department: 'Sales & Marketing' | 'Engineering & Architecture' | 'Property Management' | 'Corporate Operations';
  location: string;
  type: 'Full-Time' | 'Contract';
  description: string;
  requirements: string[];
  responsibilities: string[];
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  propertyBought: string;
  rating: number;
  avatar: string;
}
