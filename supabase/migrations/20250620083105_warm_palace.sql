/*
  # Create mood logs table for Bloom therapy app

  1. New Tables
    - `mood_logs`
      - `id` (serial, primary key)
      - `feeling` (text, user's emotional input)
      - `response_text` (text, AI's therapeutic response)
      - `created_at` (timestamptz, auto-generated)

  2. Security
    - Enable RLS on `mood_logs` table
    - Add policy for public access (since this is a demo app)
*/

CREATE TABLE IF NOT EXISTS mood_logs (
  id serial PRIMARY KEY,
  feeling text NOT NULL,
  response_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;

-- Allow public access for demo purposes
-- In production, you'd want to restrict this to authenticated users
CREATE POLICY "Allow public access to mood logs"
  ON mood_logs
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);