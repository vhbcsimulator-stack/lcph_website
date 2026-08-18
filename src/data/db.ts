import { supabase } from '../lib/supabase';
import type { Project, Property, Amenity, DevelopmentUpdate, NewsArticle, GalleryItem } from '../types';

// ─── Default page content (used as seed/fallback) ────────────────────────────
export const defaultPageContent: Record<string, string> = {
  // Homepage hero
  'home_hero_title': 'Building Communities Where Leisure Meets Luxury',
  'home_hero_tagline': 'Premium Real Estate',
  'home_hero_image': '/src/assets/herolcn.png',
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
  'home_contact_address': 'Location: Brgy. Buted, Talugtug, Nueva Ecija',

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
  'contact_info_address': 'Ground Floor, Freluz Building, Jose Abad Santos Ave., Brgy. Dolores, City of San Fernando, Pampanga 2000',
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
  'partner_hero_image': '/src/assets/lcngate.png',
  'partner_eyebrow': 'Partner Program',
  'partner_title': 'Partner With Lakeshore Community Philippines',
  'partner_subtitle': 'Broker Accreditation, Corporate Sales Partnerships, Supplier & Contractor Registration.',
  'partner_cta_primary': 'Apply for Accreditation',
  'partner_cta_secondary': 'Talk to Broker Relations',
  'partner_form_title': 'Broker & Partner Application Form',
  'partner_form_note': 'All fields are required. Your details are used solely to process your accreditation.',
  'partner_benefits_title': 'Broker Benefits',
  'partner_benefit1': 'Competitive & Timely Commission Structures',
  'partner_benefit2': 'Dedicated Broker Relations Officer',
  'partner_benefit3': 'Access to VIP Client Golf-Cart Site Tours',

  // Partner Page — partnership categories.
  // The tracks themselves live in the partner_tracks_json key, written by the page when an admin
  // adds or removes one; their starting copy is DEFAULT_TRACKS in PartnerPage.tsx.
  'partner_categories_badge': 'Who We Partner With',
  'partner_categories_title': 'Choose Your Partnership Track',

  // Partner Page — accreditation process
  'partner_process_title': 'How Accreditation Works',
  'partner_step1_title': 'Submit Your Application',
  'partner_step1_desc': 'Send the form with your licence or registration details.',
  'partner_step2_title': 'Document Verification',
  'partner_step2_desc': 'Our Broker Network Relations desk reviews your credentials.',
  'partner_step3_title': 'Accreditation & Onboarding',
  'partner_step3_desc': 'Receive your terms, sales kit and a dedicated relations officer.',

  // Partner Page — form field placeholders
  'partner_placeholder_name': 'e.g. Juan Dela Cruz / Apex Realty',
  'partner_placeholder_license': 'PRC Reg. No.',
  'partner_placeholder_email': 'broker@agency.com',
  'partner_placeholder_mobile': '+63 917 000 0000',

  // Partner Page — sidebar help card
  'partner_help_title': 'Questions Before Applying?',
  'partner_help_text': 'Our Broker Network Relations desk can walk you through commission terms and requirements.',
  'partner_help_cta': 'Contact the Team',
  'partner_success_reset': 'Submit Another Application',

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
  'policy_terms_title': 'Terms of Use',
  'policy_terms_content_p1': 'Welcome to the official website of Lakeshore Community Philippines (LCPH). By using this platform, you agree to these terms.',
  'policy_cookies_title': 'Cookie Policy',
  'policy_cookies_content_p1': 'This website uses essential session cookies to enhance navigation, remember search filters, and ensure secure form submissions.',

  // ─── Added with the editable-content pass ───────────────────────────────────
  // Site chrome (header, footer, cards)
  'card_news_cta': 'Read Full Article',
  'card_project_cta': 'View Master Plan',
  'card_project_lot_sizes_label': 'Lot Sizes',
  'card_project_total_area_label': 'Total Area',
  'card_update_badge_label': 'Completed',
  'card_update_cta': 'Read Full Update Report',
  'card_update_progress_label': 'Overall Status',

  // Homepage
  'home_amenities_cta': 'Explore All Amenities',
  'home_faq_badge': 'Buyer Guidance',
  'home_faq_cta': 'View All Frequently Asked Questions',
  'home_faq_title': 'Frequently Asked Questions',
  'home_form_label_email': 'Email Address',
  'home_form_label_message': 'Message',
  'home_form_label_mobile': 'Mobile Number',
  'home_form_label_name': 'Full Name',
  'home_form_label_project': 'Preferred Project',
  'home_form_submit': 'Send Inquiry',
  'home_form_success_text': 'Your inquiry has been logged. An LCPH Property Specialist will reach out to you within 24 hours.',
  'home_form_success_title': 'Thank You for Reaching Out!',
  'home_form_title': 'Send a Direct Inquiry',
  'home_hero_subtitle': 'Experience the perfect blend of nature, comfort, and investment potential in the heart of the Philippines.',
  'home_projects_badge': 'Flagship Townships',
  'home_projects_cta': 'View All Projects',
  'home_projects_empty_text': 'Our flagship townships are being prepared for launch. Please check back soon.',
  'home_projects_empty_title': 'No developments listed yet',
  'home_projects_title': 'Featured Master Developments',
  'home_spotlight_cta': 'Explore Project',
  'home_spotlight_feature_1': '300 - 800 sqm Lot Sizes',
  'home_spotlight_feature_2': 'Clubhouse & Infinity Lakeside Pool',
  'home_spotlight_feature_3': '24/7 Premium Security',
  'home_spotlight_tag_1': 'Residential',
  'home_spotlight_tag_2': 'Commercial',
  'home_updates_cta': 'All Progress Reports',
  'home_updates_empty_text': 'Construction milestones and site photos will be posted here as work progresses.',
  'home_updates_empty_title': 'No progress reports yet',

  // About page
  'about_cta_primary': 'Browse Projects',
  'about_cta_secondary': 'Contact Corporate Office',
  'about_cta_text': 'Discover our active project sites.',
  'about_cta_title': 'Partner and Build Your Dream Home with LCPH',
  'about_mission_text': 'To develop exceptional, nature-integrated properties that elevate the standard of living while preserving the ecological heritage of the land.',
  'about_mission_title': 'Our Mission',
  'about_principles_title': 'Core Principles',
  'about_value_1': 'Sustainability First',
  'about_value_2': 'Architectural Excellence',
  'about_value_3': 'Community Focus',
  'about_values_title': 'Our Values',
  'about_vision_text': 'To be the premier developer recognized for creating timeless, sustainable communities that define premium heritage living.',
  'about_vision_title': 'Our Vision',

  // Projects page
  'projects_empty_cta': 'Reset Filters',
  'projects_empty_text': 'No projects found matching the selected filter criteria.',
  'projects_empty_title': 'No projects to show',
  'projects_featured_badge': 'Featured',
  'projects_featured_cta': 'Explore Project',
  'projects_filter_cta': 'Apply Filters',
  'projects_filter_location': 'Location',
  'projects_filter_status': 'Status',
  'projects_filter_type': 'Type',
  'projects_grid_title': 'All Projects',
  'projects_map_cta': 'Open Map View',
  'projects_map_text': 'Explore the geographical spread of our developments and nearby landmarks.',
  'projects_map_title': 'Interactive Project Map',

  // Amenities page
  'amenities_empty_cta': 'Reset Filters',
  'amenities_empty_text': 'Try selecting a different project or category.',
  'amenities_empty_title': 'No amenities found',
  'amenities_filter_label': 'Filter by Project:',
  'amenities_hero_text': 'Experience a world of leisure and convenience with our curated selection of world-class estate amenities.',
  'amenities_hero_title': 'Discover Our Amenities',
  'amenities_list_badge': 'Curated facilities',

  // Contact page
  'contact_label_email': 'Email Address',
  'contact_label_inquiry': 'Inquiry Type',
  'contact_label_message': 'Message',
  'contact_label_mobile': 'Mobile Number',
  'contact_label_name': 'Full Name',
  'contact_submit_label': 'Send Message',
  'contact_success_text': 'Our customer team will contact you within 24 hours.',
  'contact_success_title': 'Inquiry Sent Successfully!',

  // FAQ page
  'faq_cta_button': 'Contact us',
  'faq_cta_text': 'Our property specialists are ready to help.',
  'faq_cta_title': 'Still have a question?',
  'faq_empty_cta': 'Reset filters',
  'faq_empty_text': 'Try another keyword or browse all categories.',
  'faq_empty_title': 'No matching questions',
  'faq_faq-financing_answer': 'We offer flexible in-house financing and partner with major banks (including BDO, BPI, Metrobank, and Security Bank) to provide competitive loan rates tailored to your needs, as well as Pag-IBIG Fund financing options for eligible projects.',
  'faq_faq-financing_question': 'What are the financing options?',
  'faq_faq-foreign_answer': 'Yes, foreign nationals can purchase condominium units under the Philippine Condominium Act. However, foreign ownership of land (such as house and lot packages) is generally prohibited, though long-term lease options may be available. Please consult with our property specialists for detailed guidance based on your specific situation.',
  'faq_faq-foreign_question': 'Can foreign nationals purchase property?',
  'faq_faq-timeline_answer': 'The purchasing timeline can vary depending on the specific development phase and payment terms. Generally, for pre-selling properties, the process from reservation to turnover can take 24 to 36 months. For ready-for-occupancy (RFO) units, the process typically takes 3 to 6 months after full down payment and loan approval.',
  'faq_faq-timeline_question': 'What is the typical purchasing timeline?',

  // Gallery page
  'gallery_empty_cta': 'View all images',
  'gallery_empty_title': 'No images in this collection',

  // News page
  'news_featured_badge': 'Featured story',
  'news_featured_cta': 'Read featured story',
  'news_latest_title': 'Latest stories',

  // Schedule a visit page
  'schedule_cta_again': 'Book Another Visit',
  'schedule_cta_back': 'Back',
  'schedule_cta_complete': 'Complete Reservation',
  'schedule_cta_continue': 'Continue',
  'schedule_hotline_label': 'Contact Hotline:',
  'schedule_hotline_value': '+63 917 123 4567',
  'schedule_label_date': 'Preferred Date',
  'schedule_label_email': 'Email Address',
  'schedule_label_mobile': 'Mobile Number',
  'schedule_label_name': 'Full Name',
  'schedule_label_project': 'Select Project Site',
  'schedule_label_time': 'Preferred Time Slot',
  'schedule_label_visitors': 'Number of Visitors',
  'schedule_meeting_label': 'Meeting Point:',
  'schedule_meeting_value': 'Main Gatehouse & Clubhouse',
  'schedule_project_label': 'Project Site:',
  'schedule_step1_label': 'Select Project',
  'schedule_step1_title': 'Step 1: Choose Estate & Preferred Date',
  'schedule_step2_label': 'Visitor Info',
  'schedule_step2_title': 'Step 2: Enter Visitor Information',
  'schedule_step3_label': 'Confirmation',
  'schedule_success_title': 'Site Visit Booked Successfully!',

  // Partner page
  'partner_label_category': 'Partnership Category',
  'partner_label_email': 'Email Address',
  'partner_label_license': 'PRC License / DHSUD Reg No.',
  'partner_label_mobile': 'Mobile Number',
  'partner_label_name': 'Full Name / Agency',
  'partner_submit': 'Submit Accreditation Request',
  'partner_success_text': 'Our Broker Network Relations desk will contact you with accreditation terms.',
  'partner_success_title': 'Application Submitted!',

  // Project detail page
  'project_detail_back': 'Back to Projects',
  'project_detail_book_cta': 'Book a Site Visit',
  'project_detail_chat_cta': 'Chat with an Agent',
  'project_detail_label_name': 'Full Name',
  'project_detail_missing_text': 'The project you are looking for does not exist or has been removed.',
  'project_detail_missing_title': 'Project Not Found',
  'project_detail_more_amenities': 'View More Amenities',
  'project_detail_success_title': 'Visit Scheduled!',
  'project_detail_widget_text': 'Schedule an exclusive site visit or speak directly with our premium property consultants.',

  // Update detail page
  'update_detail_back': 'Back to All Updates',
  'update_detail_gallery_title': 'Project Progress Gallery',
  'update_detail_missing': 'Development update not found.',
  'update_detail_missing_cta': 'Back to all updates',
  'update_detail_published': 'Published on',
  'update_detail_progress_label': 'Overall Progress',
  'update_detail_report_title': 'Engineering Progress Report',

  // News detail page
  'news_detail_back': 'Back to News & Events',
  'news_detail_byline': 'By',

  // 404 page
  'notfound_code': '404',
  'notfound_cta': 'Return to Home',
  'notfound_text': 'The page or lot listing you are looking for might have been moved or updated.',
  'notfound_title': 'Page Not Found',

  // Project detail page
  'project_detail_amenities_title': 'Exclusive Amenities',
  'project_detail_amenity_blurb': 'High-quality township features curated exclusively for LCPH homeowners.',
  'project_detail_gallery_title': 'Photo Gallery',
  'project_detail_label_date': 'Preferred Date for Visit',
  'project_detail_label_email': 'Email Address',
  'project_detail_label_phone': 'Phone Number',
  'project_detail_overview_title': 'Discover Serenity',
  'project_detail_stat_lot_sizes': 'Lot Sizes',
  'project_detail_stat_status': 'Status',
  'project_detail_stat_turnover': 'Turnover',
  'project_detail_stat_type': 'Property Type',
  'project_detail_tab_amenities': 'Amenities',
  'project_detail_tab_gallery': 'Gallery',
  'project_detail_tab_overview': 'Overview',
  'project_detail_tab_video': 'Walkthrough Video',
  'project_detail_video_empty_text': 'Walkthrough video will be uploaded soon.',
  'project_detail_video_empty_title': 'No Video Available',
  'project_detail_video_title': 'Walkthrough Video',
  'project_detail_widget_title': 'Interested in',

  // Property detail page
  'property_description_title': 'Property Description',
  'property_divider_label': 'or',
  'property_features_title': 'Key Features & Selling Points',
  'property_gallery_cta': 'View Gallery',
  'property_label_email': 'Email Address',
  'property_label_mobile': 'Mobile Number',
  'property_label_name': 'Your Full Name',
  'property_landmark_1': 'Premium Education',
  'property_landmark_1_distance': '2.5 km',
  'property_landmark_2': 'Healthcare facilities',
  'property_landmark_2_distance': '4.0 km',
  'property_landmark_3': 'Recreation Loops',
  'property_landmark_3_distance': '1.2 km',
  'property_landmark_4': 'Shopping & Dining strip',
  'property_landmark_4_distance': '3.0 km',
  'property_landmarks_title': 'Nearby Landmarks',
  'property_missing_cta': 'Back to Projects',
  'property_missing_text': 'The property you are looking for does not exist or has been removed.',
  'property_missing_title': 'Property Not Found',
  'property_spec_category': 'Category',
  'property_spec_lot_size': 'Lot Size',
  'property_spec_lot_unit': 'sqm',
  'property_spec_pricing': 'Pricing Tier',
  'property_submit_cta': 'Request Sample Computation',
  'property_success_text': 'We have received your computation request. An agent will contact you at',
  'property_success_text_suffix': 'within 24 hours.',
  'property_success_title': 'Inquiry Logged!',
  'property_visit_cta': 'Book Site Visit',
  'property_widget_text': 'Request sample computation, lot map guidelines, or schedule a viewing.',
  'property_widget_title': 'Inquire About',

  // Policy pages

  // Other
  'announcement_text': 'Discover your dream home at Lakeshore. New phases now pre-selling!',
  'breadcrumb_home': 'Home',

  // Project detail page
  'project_detail_gallery_cta': 'View Gallery',

  // Project detail page
  'project_detail_stat_type_suffix': 'Estate',

  // Other
  'contact_map_embed': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3853.1134835949197!2d120.6810847761108!3d15.041838066119714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396f766478da7d5%3A0x37161103f245a3f9!2sLCPH%20REALTY%20INC.%20%E2%80%9CLeisure%20Community%20PH%E2%80%9D!5e0!3m2!1sen!2sph!4v1785566513008!5m2!1sen!2sph',
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
    status: row.status ?? '',
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
    // The column is NOT NULL, so an empty label has to become the default rather than null.
    status: u.status?.trim() || 'Under Construction',
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
  if (error) { console.error('saveProjects:', error.message); throw new Error(error.message); }
}

export async function deleteProjectById(id: string): Promise<void> {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) { console.error('deleteProjectById:', error.message); throw new Error(error.message); }
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
  if (error) { console.error('saveProperties:', error.message); throw new Error(error.message); }
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
  if (error) { console.error('saveAmenities:', error.message); throw new Error(error.message); }
}

export async function deleteAmenityById(id: string): Promise<void> {
  const { error } = await supabase.from('amenities').delete().eq('id', id);
  if (error) { console.error('deleteAmenityById:', error.message); throw new Error(error.message); }
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
  if (error) { console.error('saveUpdates:', error.message); throw new Error(error.message); }
}

export async function deleteUpdateById(id: string): Promise<void> {
  const { error } = await supabase.from('development_updates').delete().eq('id', id);
  if (error) { console.error('deleteUpdateById:', error.message); throw new Error(error.message); }
}

// ─── News ─────────────────────────────────────────────────────────────────────

function mapNews(row: any): NewsArticle {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    date: row.date,
    category: row.category,
    author: row.author,
    readTime: row.read_time,
    excerpt: row.excerpt,
    content: row.content,
    image: row.image,
    featured: row.featured,
  };
}

function newsToRow(n: NewsArticle) {
  return {
    id: n.id,
    slug: n.slug,
    title: n.title,
    date: n.date,
    category: n.category,
    author: n.author,
    read_time: n.readTime,
    excerpt: n.excerpt,
    content: n.content,
    image: n.image,
    featured: n.featured ?? false,
  };
}

/** Falls back to the bundled articles when the table is missing (migration not run yet). */
export async function getNews(): Promise<NewsArticle[]> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) { console.error('getNews:', error.message); throw new Error(error.message); }
  return (data ?? []).map(mapNews);
}

export async function saveNews(items: NewsArticle[]): Promise<void> {
  const { error } = await supabase.from('news').upsert(items.map(newsToRow), { onConflict: 'id' });
  if (error) { console.error('saveNews:', error.message); throw new Error(error.message); }
}

export async function deleteNewsById(id: string): Promise<void> {
  const { error } = await supabase.from('news').delete().eq('id', id);
  if (error) { console.error('deleteNewsById:', error.message); throw new Error(error.message); }
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

function mapGallery(row: any): GalleryItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    mediaType: row.media_type,
    url: row.url,
    thumbnail: row.thumbnail,
  };
}

function galleryToRow(g: GalleryItem) {
  return {
    id: g.id,
    title: g.title,
    category: g.category,
    media_type: g.mediaType,
    url: g.url,
    thumbnail: g.thumbnail,
  };
}

/** Falls back to the bundled gallery when the table is missing (migration not run yet). */
export async function getGallery(): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) { console.error('getGallery:', error.message); throw new Error(error.message); }
  return (data ?? []).map(mapGallery);
}

export async function saveGallery(items: GalleryItem[]): Promise<void> {
  const { error } = await supabase.from('gallery').upsert(items.map(galleryToRow), { onConflict: 'id' });
  if (error) { console.error('saveGallery:', error.message); throw new Error(error.message); }
}

export async function deleteGalleryById(id: string): Promise<void> {
  const { error } = await supabase.from('gallery').delete().eq('id', id);
  if (error) { console.error('deleteGalleryById:', error.message); throw new Error(error.message); }
}

// ─── Page Content ─────────────────────────────────────────────────────────────

export async function getPageContent(): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from('page_content')
    .select('key, value');
  if (error) { console.error('getPageContent:', error.message); throw new Error(error.message); }
  const result: Record<string, string> = {};
  (data ?? []).forEach((row: any) => { result[row.key] = row.value; });
  return result;
}

export async function updatePageContentValue(key: string, value: string): Promise<void> {
  const { error } = await supabase
    .from('page_content')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  if (error) { console.error('updatePageContentValue:', error.message); throw new Error(error.message); }
}
