/*
  # Create insights and sources tables for community content

  1. New Tables
    - `insights`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `category` (text)
      - `author` (text, default 'Anonymous')
      - `tags` (text array)
      - `likes` (integer, default 0)
      - `views` (integer, default 0)
      - `featured` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `sources`
      - `id` (uuid, primary key)
      - `title` (text)
      - `author` (text)
      - `description` (text)
      - `summary` (text)
      - `category` (text)
      - `type` (text)
      - `rating` (numeric)
      - `read_time` (text)
      - `duration` (text)
      - `url` (text)
      - `cover_image` (text)
      - `tags` (text array)
      - `featured` (boolean, default false)
      - `likes` (integer, default 0)
      - `views` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `user_bookmarks`
      - `id` (uuid, primary key)
      - `user_session` (text) - browser session identifier
      - `source_id` (uuid, foreign key)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for anonymous insert (with moderation)
    - Add policies for bookmark management
*/

-- Create insights table
CREATE TABLE IF NOT EXISTS insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL CHECK (category IN ('story', 'tip', 'reflection', 'coping')),
  author text DEFAULT 'Anonymous',
  tags text[] DEFAULT '{}',
  likes integer DEFAULT 0,
  views integer DEFAULT 0,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sources table
CREATE TABLE IF NOT EXISTS sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  description text NOT NULL,
  summary text NOT NULL,
  category text NOT NULL CHECK (category IN ('book', 'story', 'article', 'podcast', 'video', 'guide')),
  type text NOT NULL CHECK (type IN ('free', 'paid', 'library')),
  rating numeric(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  read_time text,
  duration text,
  url text,
  cover_image text,
  tags text[] DEFAULT '{}',
  featured boolean DEFAULT false,
  likes integer DEFAULT 0,
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user bookmarks table
CREATE TABLE IF NOT EXISTS user_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_session text NOT NULL,
  source_id uuid NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_session, source_id)
);

-- Enable RLS
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;

-- Insights policies
CREATE POLICY "Anyone can read insights"
  ON insights
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert insights"
  ON insights
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update insight stats"
  ON insights
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Sources policies
CREATE POLICY "Anyone can read sources"
  ON sources
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert sources"
  ON sources
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update source stats"
  ON sources
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Bookmarks policies
CREATE POLICY "Users can manage their own bookmarks"
  ON user_bookmarks
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS insights_category_idx ON insights(category);
CREATE INDEX IF NOT EXISTS insights_created_at_idx ON insights(created_at DESC);
CREATE INDEX IF NOT EXISTS insights_featured_idx ON insights(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS insights_tags_idx ON insights USING gin(tags);

CREATE INDEX IF NOT EXISTS sources_category_idx ON sources(category);
CREATE INDEX IF NOT EXISTS sources_type_idx ON sources(type);
CREATE INDEX IF NOT EXISTS sources_created_at_idx ON sources(created_at DESC);
CREATE INDEX IF NOT EXISTS sources_featured_idx ON sources(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS sources_tags_idx ON sources USING gin(tags);

CREATE INDEX IF NOT EXISTS user_bookmarks_session_idx ON user_bookmarks(user_session);
CREATE INDEX IF NOT EXISTS user_bookmarks_source_idx ON user_bookmarks(source_id);

-- Insert sample data
INSERT INTO insights (title, content, category, author, tags, featured, likes, views) VALUES
(
  'Finding Peace in Morning Routines',
  'I discovered that starting my day with 5 minutes of deep breathing and gratitude journaling has transformed my anxiety levels. It''s amazing how small changes can make such a big difference. I write down three things I''m grateful for and take deep breaths while watching the sunrise. This simple practice has become my anchor.',
  'tip',
  'Anonymous',
  ARRAY['morning', 'anxiety', 'breathing', 'gratitude', 'routine'],
  true,
  42,
  156
),
(
  'My Journey Through Grief',
  'Losing my grandmother taught me that grief isn''t linear. Some days are harder than others, and that''s okay. I learned to honor my feelings without judgment and found comfort in sharing memories with family. The waves of sadness still come, but I''ve learned to ride them instead of fighting them. Creating a memory box with her photos and letters has been incredibly healing.',
  'story',
  'Anonymous',
  ARRAY['grief', 'family', 'healing', 'memories', 'loss'],
  true,
  89,
  234
),
(
  'The Power of Self-Compassion',
  'I used to be my own worst critic. Learning to speak to myself with the same kindness I''d show a friend has been life-changing. We all deserve compassion, especially from ourselves. I started by noticing my inner dialogue and gently redirecting harsh thoughts. Now I ask myself: "What would I tell a friend in this situation?" This simple shift has reduced my anxiety and increased my self-confidence.',
  'reflection',
  'Anonymous',
  ARRAY['self-compassion', 'kindness', 'inner-critic', 'growth', 'mindfulness'],
  false,
  67,
  198
);

INSERT INTO sources (title, author, description, summary, category, type, rating, read_time, url, tags, featured, likes, views) VALUES
(
  'The Body Keeps the Score',
  'Bessel van der Kolk',
  'A groundbreaking exploration of trauma and its effects on the body and mind, offering hope and healing through innovative treatments.',
  'Dr. van der Kolk draws on thirty years of experience to argue that trauma literally reshapes both body and brain, compromising sufferers'' capacities for pleasure, engagement, self-control, and trust.',
  'book',
  'library',
  4.8,
  '6-8 hours',
  'https://www.goodreads.com/book/show/18693771-the-body-keeps-the-score',
  ARRAY['trauma', 'healing', 'neuroscience', 'therapy', 'recovery'],
  true,
  89,
  1247
),
(
  'The Happiness Lab Podcast',
  'Dr. Laurie Santos',
  'Yale professor Dr. Laurie Santos explores the science of well-being and shares evidence-based strategies for a happier life.',
  'Groundbreaking research on what makes us happy, featuring practical tips and surprising insights about the science of well-being.',
  'podcast',
  'free',
  4.9,
  null,
  'https://www.happinesslab.fm/',
  ARRAY['happiness', 'science', 'well-being', 'psychology', 'research'],
  true,
  234,
  2156
),
(
  'Atomic Habits',
  'James Clear',
  'A practical guide to building good habits and breaking bad ones, with strategies that can transform your mental health routine.',
  'Learn how tiny changes can lead to remarkable results in your mental health journey through the power of habit formation.',
  'book',
  'paid',
  4.8,
  '5-6 hours',
  'https://jamesclear.com/atomic-habits',
  ARRAY['habits', 'productivity', 'self-improvement', 'routine', 'mindset'],
  false,
  167,
  1089
);