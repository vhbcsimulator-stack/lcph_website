-- ==========================================
-- LCPH Realty Inc. — Row Level Security Policies
-- Run this in Supabase SQL Editor AFTER schema.sql
-- Grants: SELECT (view), INSERT+UPDATE (post), DELETE on all tables
-- ==========================================

-- ─── page_content ────────────────────────────────────────────────────────────
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "page_content: anon select"
  ON page_content FOR SELECT TO anon USING (true);

CREATE POLICY "page_content: anon insert"
  ON page_content FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "page_content: anon update"
  ON page_content FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "page_content: anon delete"
  ON page_content FOR DELETE TO anon USING (true);


-- ─── admins ──────────────────────────────────────────────────────────────────
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins: anon select"
  ON admins FOR SELECT TO anon USING (true);

CREATE POLICY "admins: anon insert"
  ON admins FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "admins: anon update"
  ON admins FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "admins: anon delete"
  ON admins FOR DELETE TO anon USING (true);


-- ─── projects ────────────────────────────────────────────────────────────────
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects: anon select"
  ON projects FOR SELECT TO anon USING (true);

CREATE POLICY "projects: anon insert"
  ON projects FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "projects: anon update"
  ON projects FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "projects: anon delete"
  ON projects FOR DELETE TO anon USING (true);


-- ─── properties ──────────────────────────────────────────────────────────────
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "properties: anon select"
  ON properties FOR SELECT TO anon USING (true);

CREATE POLICY "properties: anon insert"
  ON properties FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "properties: anon update"
  ON properties FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "properties: anon delete"
  ON properties FOR DELETE TO anon USING (true);


-- ─── amenities ───────────────────────────────────────────────────────────────
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "amenities: anon select"
  ON amenities FOR SELECT TO anon USING (true);

CREATE POLICY "amenities: anon insert"
  ON amenities FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "amenities: anon update"
  ON amenities FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "amenities: anon delete"
  ON amenities FOR DELETE TO anon USING (true);


-- ─── development_updates ─────────────────────────────────────────────────────
ALTER TABLE development_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "development_updates: anon select"
  ON development_updates FOR SELECT TO anon USING (true);

CREATE POLICY "development_updates: anon insert"
  ON development_updates FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "development_updates: anon update"
  ON development_updates FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "development_updates: anon delete"
  ON development_updates FOR DELETE TO anon USING (true);


-- ─── news_articles ───────────────────────────────────────────────────────────
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "news_articles: anon select"
  ON news_articles FOR SELECT TO anon USING (true);

CREATE POLICY "news_articles: anon insert"
  ON news_articles FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "news_articles: anon update"
  ON news_articles FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "news_articles: anon delete"
  ON news_articles FOR DELETE TO anon USING (true);


-- ─── gallery_items ───────────────────────────────────────────────────────────
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gallery_items: anon select"
  ON gallery_items FOR SELECT TO anon USING (true);

CREATE POLICY "gallery_items: anon insert"
  ON gallery_items FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "gallery_items: anon update"
  ON gallery_items FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "gallery_items: anon delete"
  ON gallery_items FOR DELETE TO anon USING (true);


-- ─── faqs ────────────────────────────────────────────────────────────────────
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "faqs: anon select"
  ON faqs FOR SELECT TO anon USING (true);

CREATE POLICY "faqs: anon insert"
  ON faqs FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "faqs: anon update"
  ON faqs FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "faqs: anon delete"
  ON faqs FOR DELETE TO anon USING (true);


-- ─── career_positions ────────────────────────────────────────────────────────
ALTER TABLE career_positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "career_positions: anon select"
  ON career_positions FOR SELECT TO anon USING (true);

CREATE POLICY "career_positions: anon insert"
  ON career_positions FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "career_positions: anon update"
  ON career_positions FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "career_positions: anon delete"
  ON career_positions FOR DELETE TO anon USING (true);


-- ─── testimonials ────────────────────────────────────────────────────────────
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "testimonials: anon select"
  ON testimonials FOR SELECT TO anon USING (true);

CREATE POLICY "testimonials: anon insert"
  ON testimonials FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "testimonials: anon update"
  ON testimonials FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "testimonials: anon delete"
  ON testimonials FOR DELETE TO anon USING (true);


-- ─── Storage bucket policies ──────────────────────────────────────────────────
-- Allow anon to read, upload, update, and delete files in the media bucket

DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow All Actions for Media Bucket" ON storage.objects;

CREATE POLICY "media: anon select"
  ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'media');

CREATE POLICY "media: anon insert"
  ON storage.objects FOR INSERT TO anon
  WITH CHECK (bucket_id = 'media');

CREATE POLICY "media: anon update"
  ON storage.objects FOR UPDATE TO anon
  USING (bucket_id = 'media')
  WITH CHECK (bucket_id = 'media');

CREATE POLICY "media: anon delete"
  ON storage.objects FOR DELETE TO anon
  USING (bucket_id = 'media');
