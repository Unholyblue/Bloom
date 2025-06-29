/*
  # Create community insights table for shared wisdom

  1. New Tables
    - `community_insights`
      - `id` (serial, primary key)
      - `content` (text, user's insight)
      - `mood_tag` (text, optional mood tag)
      - `created_at` (timestamptz, auto-generated)

  2. Security
    - Enable RLS on `community_insights` table
    - Add policy for public access (read and insert)
*/

CREATE TABLE IF NOT EXISTS community_insights (
  id serial PRIMARY KEY,
  content text NOT NULL,
  mood_tag text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE community_insights ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to community insights"
  ON community_insights
  FOR SELECT
  TO public
  USING (true);

-- Allow public insert access
CREATE POLICY "Allow public insert access to community insights"
  ON community_insights
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS community_insights_created_at_idx ON community_insights(created_at DESC);
CREATE INDEX IF NOT EXISTS community_insights_mood_tag_idx ON community_insights(mood_tag);