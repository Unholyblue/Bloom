/*
  # Add follow-up tracking to mood logs

  1. Changes
    - Add `is_followup` column to track follow-up interactions
    - Add `session_id` column to group related conversations
    - Add `reflection_depth` column to track conversation depth

  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns to mood_logs table
DO $$
BEGIN
  -- Add is_followup column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'mood_logs' AND column_name = 'is_followup'
  ) THEN
    ALTER TABLE mood_logs ADD COLUMN is_followup boolean DEFAULT false;
  END IF;

  -- Add session_id column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'mood_logs' AND column_name = 'session_id'
  ) THEN
    ALTER TABLE mood_logs ADD COLUMN session_id text;
  END IF;

  -- Add reflection_depth column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'mood_logs' AND column_name = 'reflection_depth'
  ) THEN
    ALTER TABLE mood_logs ADD COLUMN reflection_depth integer DEFAULT 1;
  END IF;
END $$;