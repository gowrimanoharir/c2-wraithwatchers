-- WraithWatchers Database Setup
-- Run this SQL in your Supabase SQL Editor (one time)

-- Create the sightings table
CREATE TABLE IF NOT EXISTS sightings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date_of_sighting DATE NOT NULL,
  latitude DECIMAL(10, 6) NOT NULL,
  longitude DECIMAL(10, 6) NOT NULL,
  city VARCHAR(255) NOT NULL,
  state VARCHAR(100) NOT NULL,
  notes TEXT,
  time_of_day VARCHAR(50),
  tag VARCHAR(100),
  image_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sightings_date ON sightings(date_of_sighting DESC);
CREATE INDEX IF NOT EXISTS idx_sightings_location ON sightings(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_sightings_city_state ON sightings(city, state);
CREATE INDEX IF NOT EXISTS idx_sightings_tag ON sightings(tag);

-- Enable Row Level Security (RLS)
ALTER TABLE sightings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON sightings
  FOR SELECT
  USING (true);

-- Allow public insert (for posting sightings)
CREATE POLICY "Allow public insert" ON sightings
  FOR INSERT
  WITH CHECK (true);

