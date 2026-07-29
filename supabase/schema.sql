-- ==========================================
-- LCPH Realty Inc. Supabase Database Schema
-- ==========================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── 1. PAGE CONTENT TABLE ──────────────────────────────────────────────────
-- Stores static editable text fields across the website pages
CREATE TABLE IF NOT EXISTS page_content (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ─── 2. ADMIN AUTHENTICATION TABLE ──────────────────────────────────────────
-- Stores admin credentials for dashboard access
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Plain text or hashed password (e.g. bcrypt)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed default admin user (Username: admin, Password: LCPH2026)
INSERT INTO admins (username, password)
VALUES ('admin', 'LCPH2026')
ON CONFLICT (username) DO NOTHING;

-- Enable RLS on admins table
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Allow the anon key to read rows (needed for login verification)
CREATE POLICY "Allow anon select on admins"
ON admins FOR SELECT
TO anon
USING (true);

-- Allow all operations for authenticated users (service_role key, future admin management)
CREATE POLICY "Allow all for authenticated"
ON admins FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ─── 3. PROJECTS TABLE ──────────────────────────────────────────────────────
-- Stores flagship enclaves and developments
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY, -- Matches frontend string IDs
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Ongoing', 'Upcoming', 'Completed', 'Pre-selling')),
    category TEXT NOT NULL CHECK (category IN ('Residential', 'Commercial', 'Leisure', 'Mixed-Use', 'Residential & Commercial', 'Condominium')),
    description TEXT NOT NULL,
    long_description TEXT NOT NULL,
    image TEXT NOT NULL, -- URL to main cover photo in bucket
    gallery TEXT[] NOT NULL DEFAULT '{}', -- Array of image URLs in bucket
    total_area TEXT NOT NULL, -- Specs
    total_units TEXT NOT NULL,
    lot_sizes TEXT NOT NULL,
    price_range TEXT NOT NULL,
    amenities TEXT[] NOT NULL DEFAULT '{}', -- Array of highlighting amenity names
    featured BOOLEAN NOT NULL DEFAULT false,
    video TEXT, -- YouTube walkthrough URL
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ─── 4. PROPERTIES TABLE ────────────────────────────────────────────────────
-- Stores individual lots and real estate properties for sale
CREATE TABLE IF NOT EXISTS properties (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    location TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Residential Lots', 'Commercial Properties', 'Leisure Properties', 'Villas')),
    lot_size NUMERIC NOT NULL, -- in sqm
    floor_area NUMERIC, -- in sqm (optional)
    price_placeholder TEXT NOT NULL, -- e.g. "₱4.5M - ₱6M"
    status TEXT NOT NULL CHECK (status IN ('Available', 'Reserved', 'Sold')),
    lot_type TEXT NOT NULL CHECK (lot_type IN ('Corner Lot', 'Regular Lot', 'Lakeside Lot', 'Park View')),
    description TEXT NOT NULL,
    features TEXT[] NOT NULL DEFAULT '{}',
    images TEXT[] NOT NULL DEFAULT '{}', -- URLs to photos in bucket
    featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ─── 5. AMENITIES TABLE ─────────────────────────────────────────────────────
-- Stores resort-style facilities
CREATE TABLE IF NOT EXISTS amenities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Lifestyle', 'Recreation', 'Sports', 'Wellness', 'Nature', 'Security')),
    description TEXT NOT NULL,
    image TEXT NOT NULL, -- URL to photo in bucket
    highlights TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ─── 6. DEVELOPMENT UPDATES TABLE ──────────────────────────────────────────
-- Stores construction progress reports and news updates
CREATE TABLE IF NOT EXISTS development_updates (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    progress_percentage INTEGER NOT NULL CHECK (progress_percentage BETWEEN 0 AND 100),
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    image TEXT NOT NULL, -- URL to photo in bucket
    gallery TEXT[] NOT NULL DEFAULT '{}', -- URLs to photos in bucket
    featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ─── 7. NEWS ARTICLES TABLE ─────────────────────────────────────────────────
-- Stores press releases, announcements, and guides
CREATE TABLE IF NOT EXISTS news_articles (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('News', 'Events', 'Guides', 'Announcements')),
    author TEXT NOT NULL,
    read_time TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    image TEXT NOT NULL, -- URL to photo in bucket
    featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ─── 8. GALLERY ITEMS TABLE ─────────────────────────────────────────────────
-- Stores media items for photo galleries
CREATE TABLE IF NOT EXISTS gallery_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Aerial Views', 'Amenities', 'Progress', 'Community', 'Properties')),
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
    url TEXT NOT NULL, -- URL to media in bucket
    thumbnail TEXT NOT NULL, -- URL to thumbnail in bucket
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ─── 9. FAQS TABLE ──────────────────────────────────────────────────────────
-- Stores frequently asked questions
CREATE TABLE IF NOT EXISTS faqs (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('About LCPH', 'Projects', 'Properties', 'Reservation', 'Payment Terms', 'Site Visits')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ─── 10. CAREER POSITIONS TABLE ─────────────────────────────────────────────
-- Stores job postings
CREATE TABLE IF NOT EXISTS career_positions (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    department TEXT NOT NULL CHECK (department IN ('Sales & Marketing', 'Engineering & Architecture', 'Property Management', 'Corporate Operations')),
    location TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Full-Time', 'Contract')),
    description TEXT NOT NULL,
    requirements TEXT[] NOT NULL DEFAULT '{}',
    responsibilities TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ─── 11. TESTIMONIALS TABLE ─────────────────────────────────────────────────
-- Stores customer testimonials
CREATE TABLE IF NOT EXISTS testimonials (
    id TEXT PRIMARY KEY,
    quote TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    property_bought TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    avatar TEXT NOT NULL, -- URL to photo in bucket
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- ==========================================
-- SUPABASE STORAGE BUCKET CONFIGURATIONS
-- ==========================================

-- Create storage bucket for files
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to files inside media bucket
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- Allow anyone (or admins) to insert/edit/delete files for media bucket
CREATE POLICY "Allow All Actions for Media Bucket"
ON storage.objects FOR ALL
USING (bucket_id = 'media')
WITH CHECK (bucket_id = 'media');


-- ==========================================
-- SUPABASE REALTIME ENABLEMENT
-- ==========================================

-- Enable Realtime updates for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE page_content;
ALTER PUBLICATION supabase_realtime ADD TABLE admins;
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
ALTER PUBLICATION supabase_realtime ADD TABLE properties;
ALTER PUBLICATION supabase_realtime ADD TABLE amenities;
ALTER PUBLICATION supabase_realtime ADD TABLE development_updates;
ALTER PUBLICATION supabase_realtime ADD TABLE news_articles;
ALTER PUBLICATION supabase_realtime ADD TABLE gallery_items;
ALTER PUBLICATION supabase_realtime ADD TABLE faqs;
ALTER PUBLICATION supabase_realtime ADD TABLE career_positions;
ALTER PUBLICATION supabase_realtime ADD TABLE testimonials;
