import { supabase } from '../lib/supabase';
import type { Project, Property, Amenity, DevelopmentUpdate } from '../types';

// ─── Default page content (used as seed/fallback) ────────────────────────────
export const defaultPageContent: Record<string, string> = {
  // Homepage hero
  'home_hero_title': 'Building Communities Where Leisure Meets Luxury',
  'home_hero_tagline': 'Premium Real Estate',
  'home_hero_image': '/src/assets/herolcn.jpeg',
  'home_hero_cta_primary': 'Explore Our Projects',
  'home_hero_cta_secondary': 'Schedule a Site Visit',

  // Homepage introduction
  'home_intro_badge': 'Institutional Excellence',
  'home_intro_title': 'Building a Legacy of Excellence',
  'home_intro_text': 'As a proud subsidiary of VHBC, LCPH Realty Inc. is dedicated to crafting master-planned communities that elevate lifestyles. We specialize in transforming prime locations into vibrant, sustainable ecosystems where families thrive and businesses prosper, grounded in a heritage of premium quality and enduring value.',

  // Homepage featured spotlight
  'home_spotlight_badge': 'Featured Flagship Spotlight',
  'home_spotlight_title': 'LCN - Lakeshore Community North',
  'home_spotlight_location': 'Lakeshore Community North',
  'home_spotlight_image': '/src/assets/masterplan.jpg',
  'home_spotlight_description': 'Our flagship master-planned estate offering exclusive lakeside living in Lakeshore North. Featuring expansive residential lots, world-class amenities, and thoughtfully integrated commercial districts designed for a balanced, luxurious lifestyle.',

  // Homepage amenities preview
  'home_amenities_badge': 'World-Class Lifestyle',
  'home_amenities_title': 'Experience Resort-Style Everyday Amenities',
  'home_amenities_description': 'Designed for wellness, active outdoor living, and family togetherness.',

  // Homepage contact form text
  'home_contact_badge': 'Get in Touch',
  'home_contact_title': 'Reserve Your Lakeside Legacy Lot Today.',
  'home_contact_desc': 'Connect with our certified property specialists for custom sample computations, site tour arrangements, or master plan inquiries.',
  'home_contact_phone': 'Sales Hotline: +63 (917) 123-4567',
  'home_contact_email': 'Email: inquire@lcphrealty.com',
  'home_contact_address': 'Location: KM 71 NLEX Interchange, Mexico, Pampanga',

  // Homepage updates section
  'home_updates_badge': 'Site Engineering',
  'home_updates_title': 'Recent Construction Progress',

  // About Page Header
  'about_hero_title': 'Building Premium Heritage',
  'about_hero_tagline': 'About LCPH Realty Inc.',
  'about_hero_text': 'Crafting serene, nature-inspired living spaces that blend luxury with the timeless beauty of the landscape.',
  'about_hero_image': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDZNX9VXWaZMZNcutPqkEZhRiN4ZctJn6NQyHsf2CCcVweXRLmaE9hZrf4s7o1FIq12NohHTSUk9NlyM8K7hKLEfbqGscTl1k10BeH5uh392VlJv2DgUEi_3D78MGsR8Rc4etIZZFr3zwoYivWShL5MaAbS2K9VYhxD9wHHE3902QevaR8vh3CMvbyUYJdsIhm2pXQxXY79jeToydVw73v5bAUP0wYCccR3zaIcGzNuAozqnMJyRkk',
  'about_story_image': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAixpiV7Sb8jC5EH8TpjenEVyMT5Z-R3AZgIm843vJcQqAH5tfzSTn3p2wsU71tzi_Arbzw8vjPOwdJ0BsWLS19BDbPeCPWqGDkA0ccX29LEIbopl_AsQqXsKAlUzkDB0ZsRYGgSHtHZAJIcPf2ihhqMCmS6U5XeVo9Rma0x3DCfkVwlPty88CnuLThFkNnlnLJ8X5PAuczN5khYvXpftblYFC4ketk5X1SfhlPwl9RPEL6ItDk3qW2',

  // About Page Story
  'about_story_title': 'Our Story & Legacy',
  'about_story_p1': 'LCPH Realty Inc. was established to address the growing demand for premier residential and commercial properties that offer both top-tier engineering and premium natural landscapes. As a dedicated subsidiary of VHBC, we inherit a strong institutional foundation of stability, growth, and structural excellence.',
  'about_story_p2': 'Our mission is to create spaces where residents experience everyday resort living. By combining advanced infrastructure with nature-rich environments, our projects preserve natural resources while providing modern, upscale spaces.',

  // About Page Pillars
  'about_pillars_title': 'Our Core Pillars',
  'about_pillar1_title': 'Heritage Quality',
  'about_pillar1_desc': 'We construct structures and estates meant to endure for generations, built with architectural integrity.',
  'about_pillar2_title': 'Balanced Leisure',
  'about_pillar2_desc': 'We believe in daily relaxation, integrating lakes, trails, and wellness facilities into everyday life.',
  'about_pillar3_title': 'Sustainable Growth',
  'about_pillar3_desc': 'Our master-planned ecosystems support green energy, smart fencing, and botanical corridors.',

  // Projects Page Header
  'projects_hero_title': 'Master-Planned Communities',
  'projects_hero_tagline': 'Our Flagship Projects',
  'projects_hero_text': 'Discover LCPH Realty Inc.\'s premier townships and estates in prime locations.',

  // Projects Page Investment Card
  'projects_invest_title': 'Investment Potential',
  'projects_invest_text': 'LCN offers a projected 12% ROI within the first 3 years of development completion.',

  // Contact Page
  'contact_title': 'Contact Us',
  'contact_subtitle': 'Get in touch with us to find your dream property. Our team is here to help.',
  'contact_form_title': 'General Inquiry Form',
  'contact_info_title': 'Office Information',
  'contact_info_address': 'KM 71 NLEX, Mexico, Pampanga',
  'contact_info_phone': '+63 917 123 4567',
  'contact_info_email': 'inquire@lcphrealty.com',
  'contact_info_hours': 'Monday - Saturday: 8:00 AM - 5:00 PM\nSunday: 9:00 AM - 4:00 PM (Site Office)',

  // FAQ Page
  'faq_title': 'Frequently Asked Questions',
  'faq_subtitle': 'Got questions? We\'ve got answers. Explore our frequently asked questions to learn more about our properties, purchasing process, and enclaves.',

  // Careers Page
  'careers_title': 'Careers at LCPH',
  'careers_status': 'Coming Soon',
  'careers_text': 'We are currently restructuring our talent recruitment system to support our expanding township developments. Stay tuned for future opportunities to shape the landscape of luxury and leisure with LCPH Realty Inc.',

  // Partner Page
  'partner_title': 'Partner With Lakeshore Community Philippines',
  'partner_subtitle': 'Broker Accreditation, Corporate Sales Partnerships, Supplier & Contractor Registration.',
  'partner_form_title': 'Broker & Partner Application Form',
  'partner_benefits_title': 'Broker Benefits',
  'partner_benefit1': 'Competitive & Timely Commission Structures',
  'partner_benefit2': 'Dedicated Broker Relations Officer',
  'partner_benefit3': 'Access to VIP Client Golf-Cart Site Tours',

  // Gallery Page
  'gallery_title': 'Photo & Render Gallery',
  'gallery_subtitle': 'Browse aerial lake perspectives, architectural models, amenity facilities, and real site construction photos.',

  // Updates Page
  'updates_title': 'Development Progress Reports',
  'updates_subtitle': 'Real-time milestones, civil infrastructure paving logs, underground utility installations, and site photos demonstrating our continuous progress.',

  // News Page
  'news_title': 'News, Events & Property Guides',
  'news_subtitle': 'Stay updated with corporate announcements, lakeside festivals, and expert real estate guides.',

  // Schedule Visit Page
  'schedule_title': 'Schedule Your Guided Lakeshore Tour',
  'schedule_subtitle': 'Book a complimentary private golf-cart tour of our master-planned estates and world-class lakeside amenities.',

  // Policy Pages
  'policy_privacy_title': 'Privacy Policy',
  'policy_privacy_content_p1': 'Lakeshore Community Philippines (LCPH), a subsidiary of VHBC, is committed to protecting the privacy of prospective lot buyers, site visitors, and clients.',
  'policy_privacy_content_p2': 'We collect personal information voluntarily submitted via inquiry forms, site visit bookings, and broker accreditation applications (such as full name, email, mobile phone number, and lot preferences).',
  'policy_privacy_content_p3': 'Your data is used strictly by accredited LCPH property specialists for lot availability updates, tour confirmations, and contract documentation in compliance with Republic Act No. 10173 (Data Privacy Act of 2012).',
  'policy_terms_title': 'Terms of Use',
  'policy_terms_content_p1': 'Welcome to the official website of Lakeshore Community Philippines (LCPH). By using this platform, you agree to these terms.',
  'policy_terms_content_p2': 'All lot dimensions, architectural renders, amenity visualizations, and maps are presented for illustrative purposes ("Artist\'s Perspective"). Verified lot titles, exact boundary points, and contract terms are specified in the official Contract to Sell (CTS).',
  'policy_cookies_title': 'Cookie Policy',
  'policy_cookies_content_p1': 'This website uses essential session cookies to enhance navigation, remember search filters, and ensure secure form submissions.',
};

// ─── Field mapping helpers ────────────────────────────────────────────────────

function mapProject(row: any): Project {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    location: row.location,
    status: row.status,
    category: row.category,
    description: row.description,
    longDescription: row.long_description,
    image: row.image,
    gallery: row.gallery ?? [],
    specs: {
      totalArea: row.total_area,
      totalUnits: row.total_units,
      lotSizes: row.lot_sizes,
      priceRange: row.price_range,
    },
    amenities: row.amenities ?? [],
    featured: row.featured,
    video: row.video,
  };
}

function projectToRow(p: Project) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    location: p.location,
    status: p.status,
    category: p.category,
    description: p.description,
    long_description: p.longDescription,
    image: p.image,
    gallery: p.gallery ?? [],
    total_area: p.specs?.totalArea ?? '',
    total_units: p.specs?.totalUnits ?? '',
    lot_sizes: p.specs?.lotSizes ?? '',
    price_range: p.specs?.priceRange ?? '',
    amenities: p.amenities ?? [],
    featured: p.featured ?? false,
    video: p.video ?? null,
  };
}

function mapProperty(row: any): Property {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    projectId: row.project_id,
    projectName: row.project_name,
    location: row.location,
    category: row.category,
    lotSize: row.lot_size,
    floorArea: row.floor_area,
    pricePlaceholder: row.price_placeholder,
    status: row.status,
    lotType: row.lot_type,
    description: row.description,
    features: row.features ?? [],
    images: row.images ?? [],
    featured: row.featured,
  };
}

function propertyToRow(p: Property) {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    project_id: p.projectId,
    project_name: p.projectName,
    location: p.location,
    category: p.category,
    lot_size: p.lotSize,
    floor_area: p.floorArea ?? null,
    price_placeholder: p.pricePlaceholder,
    status: p.status,
    lot_type: p.lotType,
    description: p.description,
    features: p.features ?? [],
    images: p.images ?? [],
    featured: p.featured ?? false,
  };
}

function mapAmenity(row: any): Amenity {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    image: row.image,
    highlights: row.highlights ?? [],
  };
}

function amenityToRow(a: Amenity) {
  return {
    id: a.id,
    name: a.name,
    category: a.category,
    description: a.description,
    image: a.image,
    highlights: a.highlights ?? [],
  };
}

function mapUpdate(row: any): DevelopmentUpdate {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    date: row.date,
    projectId: row.project_id,
    projectName: row.project_name,
    progressPercentage: row.progress_percentage,
    summary: row.summary,
    content: row.content,
    image: row.image,
    gallery: row.gallery ?? [],
    featured: row.featured,
  };
}

function updateToRow(u: DevelopmentUpdate) {
  return {
    id: u.id,
    slug: u.slug,
    title: u.title,
    date: u.date,
    project_id: u.projectId,
    project_name: u.projectName,
    progress_percentage: u.progressPercentage,
    summary: u.summary,
    content: u.content,
    image: u.image,
    gallery: u.gallery ?? [],
    featured: u.featured ?? false,
  };
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) { console.error('getProjects:', error.message); return []; }
  return (data ?? []).map(mapProject);
}

export async function saveProjects(projects: Project[]): Promise<void> {
  const rows = projects.map(projectToRow);
  const { error } = await supabase.from('projects').upsert(rows, { onConflict: 'id' });
  if (error) console.error('saveProjects:', error.message);
}

export async function deleteProjectById(id: string): Promise<void> {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) console.error('deleteProjectById:', error.message);
}

// ─── Properties ───────────────────────────────────────────────────────────────

export async function getProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) { console.error('getProperties:', error.message); return []; }
  return (data ?? []).map(mapProperty);
}

export async function saveProperties(properties: Property[]): Promise<void> {
  const rows = properties.map(propertyToRow);
  const { error } = await supabase.from('properties').upsert(rows, { onConflict: 'id' });
  if (error) console.error('saveProperties:', error.message);
}

// ─── Amenities ────────────────────────────────────────────────────────────────

export async function getAmenities(): Promise<Amenity[]> {
  const { data, error } = await supabase
    .from('amenities')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) { console.error('getAmenities:', error.message); return []; }
  return (data ?? []).map(mapAmenity);
}

export async function saveAmenities(amenities: Amenity[]): Promise<void> {
  const rows = amenities.map(amenityToRow);
  const { error } = await supabase.from('amenities').upsert(rows, { onConflict: 'id' });
  if (error) console.error('saveAmenities:', error.message);
}

export async function deleteAmenityById(id: string): Promise<void> {
  const { error } = await supabase.from('amenities').delete().eq('id', id);
  if (error) console.error('deleteAmenityById:', error.message);
}

// ─── Development Updates ──────────────────────────────────────────────────────

export async function getUpdates(): Promise<DevelopmentUpdate[]> {
  const { data, error } = await supabase
    .from('development_updates')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) { console.error('getUpdates:', error.message); return []; }
  return (data ?? []).map(mapUpdate);
}

export async function saveUpdates(updates: DevelopmentUpdate[]): Promise<void> {
  const rows = updates.map(updateToRow);
  const { error } = await supabase.from('development_updates').upsert(rows, { onConflict: 'id' });
  if (error) console.error('saveUpdates:', error.message);
}

// ─── Page Content ─────────────────────────────────────────────────────────────

export async function getPageContent(): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from('page_content')
    .select('key, value');
  if (error) { console.error('getPageContent:', error.message); return { ...defaultPageContent }; }
  // Start with defaults, overlay with whatever is stored in DB
  const result: Record<string, string> = { ...defaultPageContent };
  (data ?? []).forEach((row: any) => { result[row.key] = row.value; });
  return result;
}

export async function updatePageContentValue(key: string, value: string): Promise<void> {
  const { error } = await supabase
    .from('page_content')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  if (error) console.error('updatePageContentValue:', error.message);
}
