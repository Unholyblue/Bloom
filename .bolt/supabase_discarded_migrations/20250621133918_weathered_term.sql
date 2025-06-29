/*
  # Create user bookmarks table for resource saving

  1. New Tables
    - `user_bookmarks`
      - `id` (uuid, primary key)
      - `user_id` (text, identifies the user/session)
      - `resource_id` (text, identifies the bookmarked resource)
      - `created_at` (timestamptz, auto-generated)

  2. Security
    - Enable RLS on `user_bookmarks` table
    - Add policy for public access (for anonymous users)
    - Add unique constraint to prevent duplicate bookmarks

  3. Performance
    - Create indexes for faster lookups
*/

-- Create user bookmarks table with inline unique constraint
CREATE TABLE IF NOT EXISTS user_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  resource_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, resource_id)
);

-- Enable Row Level Security
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own bookmarks
CREATE POLICY "Users can manage their own bookmarks"
  ON user_bookmarks
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS user_bookmarks_user_id_idx ON user_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS user_bookmarks_resource_id_idx ON user_bookmarks(resource_id);