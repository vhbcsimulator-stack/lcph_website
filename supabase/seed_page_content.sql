-- Seeds page_content with the default copy for every editable field on the site.
--
-- Safe to re-run: ON CONFLICT DO NOTHING means rows an admin has already edited
-- through the site are left untouched. Nothing here is required for the site to
-- work (src/data/db.ts supplies the same defaults at runtime) — it just makes the
-- copy visible and queryable in the Supabase dashboard.
--
-- Run it in Supabase Studio: SQL Editor -> New query -> paste -> Run.

insert into public.page_content (key, value) values
  -- Site chrome (header, footer, cards)
  ('card_news_cta', 'Read Full Article'),
  ('card_project_cta', 'View Master Plan'),
  ('card_project_lot_sizes_label', 'Lot Sizes'),
  ('card_project_total_area_label', 'Total Area'),
  ('card_update_badge_label', 'Completed'),
  ('card_update_cta', 'Read Full Update Report'),
  ('card_update_progress_label', 'Overall Status'),
  ('footer_company_heading', 'Company'),
  ('footer_copyright', 'LCPH Realty Inc. All rights reserved.'),
  ('footer_legal_heading', 'Legal'),
  ('footer_link_careers', 'Careers'),
  ('footer_link_cookies', 'Cookie Policy'),
  ('footer_link_gallery', 'Gallery'),
  ('footer_link_news', 'News'),
  ('footer_link_privacy', 'Privacy Policy'),
  ('footer_link_terms', 'Terms of Service'),
  ('footer_tagline', 'Building communities where leisure meets luxury. A subsidiary of VHBC dedicated to premium real estate development in the Philippines.'),
  ('header_cta_label', 'Inquire Now'),

  -- Homepage
  ('home_amenities_cta', 'Explore All Amenities'),
  ('home_faq_badge', 'Buyer Guidance'),
  ('home_faq_cta', 'View All Frequently Asked Questions'),
  ('home_faq_title', 'Frequently Asked Questions'),
  ('home_form_label_email', 'Email Address'),
  ('home_form_label_message', 'Message'),
  ('home_form_label_mobile', 'Mobile Number'),
  ('home_form_label_name', 'Full Name'),
  ('home_form_label_project', 'Preferred Project'),
  ('home_form_submit', 'Send Inquiry'),
  ('home_form_success_text', 'Your inquiry has been logged. An LCPH Property Specialist will reach out to you within 24 hours.'),
  ('home_form_success_title', 'Thank You for Reaching Out!'),
  ('home_form_title', 'Send a Direct Inquiry'),
  ('home_hero_subtitle', 'Experience the perfect blend of nature, comfort, and investment potential in the heart of the Philippines.'),
  ('home_projects_badge', 'Flagship Townships'),
  ('home_projects_cta', 'View All Projects'),
  ('home_projects_title', 'Featured Master Developments'),
  ('home_spotlight_cta', 'Explore Project'),
  ('home_spotlight_feature_1', '300 - 800 sqm Lot Sizes'),
  ('home_spotlight_feature_2', 'Clubhouse & Infinity Lakeside Pool'),
  ('home_spotlight_feature_3', '24/7 Premium Security'),
  ('home_spotlight_tag_1', 'Residential'),
  ('home_spotlight_tag_2', 'Commercial'),
  ('home_updates_cta', 'All Progress Reports'),

  -- About page
  ('about_cta_primary', 'Browse Projects'),
  ('about_cta_secondary', 'Contact Corporate Office'),
  ('about_cta_text', 'Discover our active project sites.'),
  ('about_cta_title', 'Partner and Build Your Dream Home with LCPH'),
  ('about_mission_text', 'To develop exceptional, nature-integrated properties that elevate the standard of living while preserving the ecological heritage of the land.'),
  ('about_mission_title', 'Our Mission'),
  ('about_principles_title', 'Core Principles'),
  ('about_value_1', 'Sustainability First'),
  ('about_value_2', 'Architectural Excellence'),
  ('about_value_3', 'Community Focus'),
  ('about_values_title', 'Our Values'),
  ('about_vision_text', 'To be the premier developer recognized for creating timeless, sustainable communities that define premium heritage living.'),
  ('about_vision_title', 'Our Vision'),

  -- Projects page
  ('projects_empty_text', 'No projects found matching the selected filter criteria.'),
  ('projects_featured_badge', 'Featured'),
  ('projects_featured_cta', 'Explore Project'),
  ('projects_filter_cta', 'Apply Filters'),
  ('projects_filter_location', 'Location'),
  ('projects_filter_status', 'Status'),
  ('projects_filter_type', 'Type'),
  ('projects_grid_title', 'All Projects'),
  ('projects_map_cta', 'Open Map View'),
  ('projects_map_text', 'Explore the geographical spread of our developments and nearby landmarks.'),
  ('projects_map_title', 'Interactive Project Map'),

  -- Amenities page
  ('amenities_empty_cta', 'Reset Filters'),
  ('amenities_empty_text', 'Try selecting a different project or category.'),
  ('amenities_empty_title', 'No amenities found'),
  ('amenities_filter_label', 'Filter by Project:'),
  ('amenities_hero_text', 'Experience a world of leisure and convenience with our curated selection of world-class estate amenities.'),
  ('amenities_hero_title', 'Discover Our Amenities'),
  ('amenities_list_badge', 'Curated facilities'),

  -- Contact page
  ('contact_label_email', 'Email Address'),
  ('contact_label_inquiry', 'Inquiry Type'),
  ('contact_label_message', 'Message'),
  ('contact_label_mobile', 'Mobile Number'),
  ('contact_label_name', 'Full Name'),
  ('contact_submit_label', 'Send Message'),
  ('contact_success_text', 'Our customer team will contact you within 24 hours.'),
  ('contact_success_title', 'Inquiry Sent Successfully!'),

  -- FAQ page
  ('faq_cta_button', 'Contact us'),
  ('faq_cta_text', 'Our property specialists are ready to help.'),
  ('faq_cta_title', 'Still have a question?'),
  ('faq_empty_cta', 'Reset filters'),
  ('faq_empty_text', 'Try another keyword or browse all categories.'),
  ('faq_empty_title', 'No matching questions'),
  ('faq_faq-financing_answer', 'We offer flexible in-house financing and partner with major banks (including BDO, BPI, Metrobank, and Security Bank) to provide competitive loan rates tailored to your needs, as well as Pag-IBIG Fund financing options for eligible projects.'),
  ('faq_faq-financing_question', 'What are the financing options?'),
  ('faq_faq-foreign_answer', 'Yes, foreign nationals can purchase condominium units under the Philippine Condominium Act. However, foreign ownership of land (such as house and lot packages) is generally prohibited, though long-term lease options may be available. Please consult with our property specialists for detailed guidance based on your specific situation.'),
  ('faq_faq-foreign_question', 'Can foreign nationals purchase property?'),
  ('faq_faq-timeline_answer', 'The purchasing timeline can vary depending on the specific development phase and payment terms. Generally, for pre-selling properties, the process from reservation to turnover can take 24 to 36 months. For ready-for-occupancy (RFO) units, the process typically takes 3 to 6 months after full down payment and loan approval.'),
  ('faq_faq-timeline_question', 'What is the typical purchasing timeline?'),

  -- Gallery page
  ('gallery_empty_cta', 'View all images'),
  ('gallery_empty_title', 'No images in this collection'),

  -- News page
  ('news_featured_badge', 'Featured story'),
  ('news_featured_cta', 'Read featured story'),
  ('news_latest_title', 'Latest stories'),

  -- Schedule a visit page
  ('schedule_cta_again', 'Book Another Visit'),
  ('schedule_cta_back', 'Back'),
  ('schedule_cta_complete', 'Complete Reservation'),
  ('schedule_cta_continue', 'Continue'),
  ('schedule_hotline_label', 'Contact Hotline:'),
  ('schedule_hotline_value', '+63 917 123 4567'),
  ('schedule_label_date', 'Preferred Date'),
  ('schedule_label_email', 'Email Address'),
  ('schedule_label_mobile', 'Mobile Number'),
  ('schedule_label_name', 'Full Name'),
  ('schedule_label_project', 'Select Project Site'),
  ('schedule_label_time', 'Preferred Time Slot'),
  ('schedule_label_visitors', 'Number of Visitors'),
  ('schedule_meeting_label', 'Meeting Point:'),
  ('schedule_meeting_value', 'Main Gatehouse & Clubhouse'),
  ('schedule_project_label', 'Project Site:'),
  ('schedule_step1_label', 'Select Project'),
  ('schedule_step1_title', 'Step 1: Choose Estate & Preferred Date'),
  ('schedule_step2_label', 'Visitor Info'),
  ('schedule_step2_title', 'Step 2: Enter Visitor Information'),
  ('schedule_step3_label', 'Confirmation'),
  ('schedule_success_title', 'Site Visit Booked Successfully!'),

  -- Partner page
  ('partner_label_category', 'Partnership Category'),
  ('partner_label_email', 'Email Address'),
  ('partner_label_license', 'PRC License / DHSUD Reg No.'),
  ('partner_label_mobile', 'Mobile Number'),
  ('partner_label_name', 'Full Name / Agency'),
  ('partner_submit', 'Submit Accreditation Request'),
  ('partner_success_text', 'Our Broker Network Relations desk will contact you with accreditation terms.'),
  ('partner_success_title', 'Application Submitted!'),

  -- Project detail page
  ('project_detail_back', 'Back to Projects'),
  ('project_detail_book_cta', 'Book a Site Visit'),
  ('project_detail_chat_cta', 'Chat with an Agent'),
  ('project_detail_label_name', 'Full Name'),
  ('project_detail_missing_text', 'The project you are looking for does not exist or has been removed.'),
  ('project_detail_missing_title', 'Project Not Found'),
  ('project_detail_more_amenities', 'View More Amenities'),
  ('project_detail_success_title', 'Visit Scheduled!'),
  ('project_detail_widget_text', 'Schedule an exclusive site visit or speak directly with our premium property consultants.'),

  -- Update detail page
  ('update_detail_back', 'Back to All Updates'),
  ('update_detail_gallery_title', 'Project Progress Gallery'),
  ('update_detail_missing', 'Development update not found.'),
  ('update_detail_missing_cta', 'Back to all updates'),
  ('update_detail_published', 'Published on'),
  ('update_detail_report_title', 'Engineering Progress Report'),

  -- News detail page
  ('news_detail_back', 'Back to News & Events'),
  ('news_detail_byline', 'By'),

  -- 404 page
  ('notfound_code', '404'),
  ('notfound_cta', 'Return to Home'),
  ('notfound_text', 'The page or lot listing you are looking for might have been moved or updated.'),
  ('notfound_title', 'Page Not Found'),

  -- Project detail page
  ('project_detail_amenities_title', 'Exclusive Amenities'),
  ('project_detail_amenity_blurb', 'High-quality township features curated exclusively for LCPH homeowners.'),
  ('project_detail_gallery_title', 'Photo Gallery'),
  ('project_detail_label_date', 'Preferred Date for Visit'),
  ('project_detail_label_email', 'Email Address'),
  ('project_detail_label_phone', 'Phone Number'),
  ('project_detail_overview_title', 'Discover Serenity'),
  ('project_detail_stat_lot_sizes', 'Lot Sizes'),
  ('project_detail_stat_status', 'Status'),
  ('project_detail_stat_turnover', 'Turnover'),
  ('project_detail_stat_type', 'Property Type'),
  ('project_detail_tab_amenities', 'Amenities'),
  ('project_detail_tab_gallery', 'Gallery'),
  ('project_detail_tab_overview', 'Overview'),
  ('project_detail_tab_video', 'Walkthrough Video'),
  ('project_detail_video_empty_text', 'Walkthrough video will be uploaded soon.'),
  ('project_detail_video_empty_title', 'No Video Available'),
  ('project_detail_video_title', 'Walkthrough Video'),
  ('project_detail_widget_title', 'Interested in'),

  -- Property detail page
  ('property_description_title', 'Property Description'),
  ('property_divider_label', 'or'),
  ('property_features_title', 'Key Features & Selling Points'),
  ('property_gallery_cta', 'View Gallery'),
  ('property_label_email', 'Email Address'),
  ('property_label_mobile', 'Mobile Number'),
  ('property_label_name', 'Your Full Name'),
  ('property_landmark_1', 'Premium Education'),
  ('property_landmark_1_distance', '2.5 km'),
  ('property_landmark_2', 'Healthcare facilities'),
  ('property_landmark_2_distance', '4.0 km'),
  ('property_landmark_3', 'Recreation Loops'),
  ('property_landmark_3_distance', '1.2 km'),
  ('property_landmark_4', 'Shopping & Dining strip'),
  ('property_landmark_4_distance', '3.0 km'),
  ('property_landmarks_title', 'Nearby Landmarks'),
  ('property_missing_cta', 'Back to Projects'),
  ('property_missing_text', 'The property you are looking for does not exist or has been removed.'),
  ('property_missing_title', 'Property Not Found'),
  ('property_spec_category', 'Category'),
  ('property_spec_lot_size', 'Lot Size'),
  ('property_spec_lot_unit', 'sqm'),
  ('property_spec_pricing', 'Pricing Tier'),
  ('property_submit_cta', 'Request Sample Computation'),
  ('property_success_text', 'We have received your computation request. An agent will contact you at'),
  ('property_success_text_suffix', 'within 24 hours.'),
  ('property_success_title', 'Inquiry Logged!'),
  ('property_visit_cta', 'Book Site Visit'),
  ('property_widget_text', 'Request sample computation, lot map guidelines, or schedule a viewing.'),
  ('property_widget_title', 'Inquire About'),

  -- Policy pages
  ('policy_privacy_h1', '1. Data Collection'),
  ('policy_privacy_h2', '2. Data Usage & Protection'),
  ('policy_terms_h1', '1. Property Renderings & Disclaimers'),

  -- Other
  ('announcement_text', 'Discover your dream home at Lakeshore. New phases now pre-selling!'),
  ('breadcrumb_home', 'Home'),

  -- Project detail page
  ('project_detail_gallery_cta', 'View Gallery'),

  -- Project detail page
  ('project_detail_stat_type_suffix', 'Estate')
on conflict (key) do nothing;
