-- ==========================================
-- LCPH Realty Inc. — one-off content seed
-- ==========================================
-- The site no longer bundles any fallback copy: every field is read from Supabase
-- (through the TanStack Query cache). This file moves the copy that used to live in
-- defaultPageContent and faqsData into the database.
--
-- Run it ONCE in the Supabase SQL editor. Every statement is ON CONFLICT DO NOTHING,
-- so it never overwrites anything an admin has already edited and re-running is safe.

-- ─── 1. page_content — the 93 keys that had no row yet ────────────────────
-- Image keys hold the /src/assets/... paths that the client still rewrites to the
-- bundled asset URLs at read time; swap them for Storage URLs when convenient.

INSERT INTO page_content (key, value) VALUES
  ('partner_tracks_json', '[{"id":"broker","icon":"BadgeCheck","title":"Licensed Broker","desc":"PRC-licensed brokers accrediting their own sales organisation."},{"id":"agent","icon":"Users","title":"Sales Agent","desc":"Individual agents selling under an accredited broker."},{"id":"supplier","icon":"Package","title":"Supplier","desc":"Material providers serving our township build-out."},{"id":"contractor","icon":"HardHat","title":"Civil Contractor","desc":"Earthworks, roads and utilities contractors."}]'),
  ('home_hero_title', 'Building Communities Where Leisure Meets Luxury'),
  ('home_hero_tagline', 'Premium Real Estate'),
  ('home_hero_cta_primary', 'Explore Our Projects'),
  ('home_hero_cta_secondary', 'Schedule a Site Visit'),
  ('home_intro_badge', 'Institutional Excellence'),
  ('home_intro_title', 'Building a Legacy of Excellence'),
  ('home_intro_text', 'As a proud subsidiary of VHBC, LCPH Realty Inc. is dedicated to crafting master-planned communities that elevate lifestyles. We specialize in transforming prime locations into vibrant, sustainable ecosystems where families thrive and businesses prosper, grounded in a heritage of premium quality and enduring value.'),
  ('home_spotlight_badge', 'Featured Flagship Spotlight'),
  ('home_spotlight_title', 'LCN - Lakeshore Community North'),
  ('home_spotlight_location', 'Lakeshore Community North'),
  ('home_spotlight_description', 'Our flagship master-planned estate offering exclusive lakeside living in Lakeshore North. Featuring expansive residential lots, world-class amenities, and thoughtfully integrated commercial districts designed for a balanced, luxurious lifestyle.'),
  ('home_amenities_badge', 'World-Class Lifestyle'),
  ('home_amenities_title', 'Experience Resort-Style Everyday Amenities'),
  ('home_amenities_description', 'Designed for wellness, active outdoor living, and family togetherness.'),
  ('home_contact_badge', 'Get in Touch'),
  ('home_contact_title', 'Reserve Your Lakeside Legacy Lot Today.'),
  ('home_contact_desc', 'Connect with our certified property specialists for custom sample computations, site tour arrangements, or master plan inquiries.'),
  ('home_updates_badge', 'Site Engineering'),
  ('home_updates_title', 'Recent Construction Progress'),
  ('about_hero_title', 'Building Premium Heritage'),
  ('about_hero_tagline', 'About LCPH Realty Inc.'),
  ('about_hero_text', 'Crafting serene, nature-inspired living spaces that blend luxury with the timeless beauty of the landscape.'),
  ('about_story_title', 'Our Story & Legacy'),
  ('about_story_p1', 'LCPH Realty Inc. was established to address the growing demand for premier residential and commercial properties that offer both top-tier engineering and premium natural landscapes. As a dedicated subsidiary of VHBC, we inherit a strong institutional foundation of stability, growth, and structural excellence.'),
  ('about_story_p2', 'Our mission is to create spaces where residents experience everyday resort living. By combining advanced infrastructure with nature-rich environments, our projects preserve natural resources while providing modern, upscale spaces.'),
  ('about_pillars_title', 'Our Core Pillars'),
  ('about_pillar1_title', 'Heritage Quality'),
  ('about_pillar1_desc', 'We construct structures and estates meant to endure for generations, built with architectural integrity.'),
  ('about_pillar2_title', 'Balanced Leisure'),
  ('about_pillar2_desc', 'We believe in daily relaxation, integrating lakes, trails, and wellness facilities into everyday life.'),
  ('about_pillar3_title', 'Sustainable Growth'),
  ('about_pillar3_desc', 'Our master-planned ecosystems support green energy, smart fencing, and botanical corridors.'),
  ('projects_hero_title', 'Master-Planned Communities'),
  ('projects_hero_tagline', 'Our Flagship Projects'),
  ('projects_hero_text', 'Discover LCPH Realty Inc.''s premier townships and estates in prime locations.'),
  ('projects_invest_title', 'Investment Potential'),
  ('projects_invest_text', 'LCN offers a projected 12% ROI within the first 3 years of development completion.'),
  ('contact_title', 'Contact Us'),
  ('contact_subtitle', 'Get in touch with us to find your dream property. Our team is here to help.'),
  ('contact_form_title', 'General Inquiry Form'),
  ('contact_info_title', 'Office Information'),
  ('faq_title', 'Frequently Asked Questions'),
  ('faq_subtitle', 'Got questions? We''ve got answers. Explore our frequently asked questions to learn more about our properties, purchasing process, and enclaves.'),
  ('careers_title', 'Careers at LCPH'),
  ('careers_status', 'Coming Soon'),
  ('careers_text', 'We are currently restructuring our talent recruitment system to support our expanding township developments. Stay tuned for future opportunities to shape the landscape of luxury and leisure with LCPH Realty Inc.'),
  ('partner_hero_image', '/src/assets/lcngate.png'),
  ('partner_eyebrow', 'Partner Program'),
  ('partner_title', 'Partner With Lakeshore Community Philippines'),
  ('partner_subtitle', 'Broker Accreditation, Corporate Sales Partnerships, Supplier & Contractor Registration.'),
  ('partner_cta_primary', 'Apply for Accreditation'),
  ('partner_cta_secondary', 'Talk to Broker Relations'),
  ('partner_form_title', 'Broker & Partner Application Form'),
  ('partner_form_note', 'All fields are required. Your details are used solely to process your accreditation.'),
  ('partner_benefits_title', 'Broker Benefits'),
  ('partner_benefit1', 'Competitive & Timely Commission Structures'),
  ('partner_benefit2', 'Dedicated Broker Relations Officer'),
  ('partner_benefit3', 'Access to VIP Client Golf-Cart Site Tours'),
  ('partner_categories_badge', 'Who We Partner With'),
  ('partner_categories_title', 'Choose Your Partnership Track'),
  ('partner_process_title', 'How Accreditation Works'),
  ('partner_step1_title', 'Submit Your Application'),
  ('partner_step1_desc', 'Send the form with your licence or registration details.'),
  ('partner_step2_title', 'Document Verification'),
  ('partner_step2_desc', 'Our Broker Network Relations desk reviews your credentials.'),
  ('partner_step3_title', 'Accreditation & Onboarding'),
  ('partner_step3_desc', 'Receive your terms, sales kit and a dedicated relations officer.'),
  ('partner_placeholder_name', 'e.g. Juan Dela Cruz / Apex Realty'),
  ('partner_placeholder_license', 'PRC Reg. No.'),
  ('partner_placeholder_email', 'broker@agency.com'),
  ('partner_placeholder_mobile', '+63 917 000 0000'),
  ('partner_help_title', 'Questions Before Applying?'),
  ('partner_help_text', 'Our Broker Network Relations desk can walk you through commission terms and requirements.'),
  ('partner_help_cta', 'Contact the Team'),
  ('partner_success_reset', 'Submit Another Application'),
  ('gallery_title', 'Photo & Render Gallery'),
  ('gallery_subtitle', 'Browse aerial lake perspectives, architectural models, amenity facilities, and real site construction photos.'),
  ('updates_title', 'Development Progress Reports'),
  ('updates_subtitle', 'Real-time milestones, civil infrastructure paving logs, underground utility installations, and site photos demonstrating our continuous progress.'),
  ('news_title', 'News, Events & Property Guides'),
  ('news_subtitle', 'Stay updated with corporate announcements, lakeside festivals, and expert real estate guides.'),
  ('schedule_title', 'Schedule Your Guided Lakeshore Tour'),
  ('schedule_subtitle', 'Book a complimentary private golf-cart tour of our master-planned estates and world-class lakeside amenities.'),
  ('policy_privacy_title', 'Privacy Policy'),
  ('policy_cookies_title', 'Cookie Policy'),
  ('news_detail_missing', 'Article not found.'),
  ('news_detail_missing_cta', 'Back to News & Events'),
  ('updates_empty_title', 'No progress reports published yet'),
  ('updates_empty_text', 'Check back soon for construction milestones and site photos.'),
  ('updates_cta_title', 'Build your Legacy with LCPH'),
  ('updates_cta_text', 'Our team is on hand to walk you through unit availability, pricing, and the current construction timeline. Reach out to inquire or book a site visit.'),
  ('updates_cta_primary', 'Inquire Now'),
  ('updates_cta_secondary', 'View Projects')
ON CONFLICT (key) DO NOTHING;

-- ─── 2. faqs — the list the FAQ pages used to bundle ───────────────────────────
-- The Home and FAQ pages now read this table. The old faq_<id>_question / _answer
-- keys in page_content are dead once this runs; see the optional cleanup below.

INSERT INTO faqs (id, category, question, answer) VALUES
  ('faq-timeline', 'About LCPH', 'What is the typical purchasing timeline?', 'The purchasing timeline can vary depending on the specific development phase and payment terms. Generally, for pre-selling properties, the process from reservation to turnover can take 24 to 36 months. For ready-for-occupancy (RFO) units, the process typically takes 3 to 6 months after full down payment and loan approval.'),
  ('faq-foreign', 'Properties', 'Can foreign nationals purchase property?', 'Yes, foreign nationals can purchase condominium units under the Philippine Condominium Act. However, foreign ownership of land (such as house and lot packages) is generally prohibited, though long-term lease options may be available. Please consult with our property specialists for detailed guidance based on your specific situation.'),
  ('faq-financing', 'Payment Terms', 'What are the financing options?', 'We offer flexible in-house financing and partner with major banks (including BDO, BPI, Metrobank, and Security Bank) to provide competitive loan rates tailored to your needs, as well as Pag-IBIG Fund financing options for eligible projects.')
ON CONFLICT (id) DO NOTHING;

-- ─── 3. Optional cleanup ──────────────────────────────────────────────────────
-- Only once you have confirmed the FAQ pages render from the table:
-- DELETE FROM page_content WHERE key LIKE 'faq\_faq-%';
