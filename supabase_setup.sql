-- WARNING: This will reset the ratings table schema to support both API and Supabase movies
-- RE-RUN THIS ONLY IF YOU GET "invalid input syntax for type uuid" ERROR

-- 0. Add missing column to movies table if needed
ALTER TABLE IF EXISTS public.movies ADD COLUMN IF NOT EXISTS video_url text COLLATE "C";

-- 1. Reset and Create ratings table
DROP TABLE IF EXISTS public.ratings CASCADE;

CREATE TABLE public.ratings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    movie_id text NOT NULL, -- Can be UUID or Slug
    user_email text NOT NULL,
    rating numeric NOT NULL CHECK (rating >= 0 AND rating <= 5),
    movie_title text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(movie_id, user_email)
);

-- 2. Add Row Level Security
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Allow all actions for now for simplicity of development
CREATE POLICY "Allow all manage" ON public.ratings FOR ALL USING (true);
