-- Supabase Setup Script
-- 0. Ensure movies columns exists
ALTER TABLE IF EXISTS public.movies ADD COLUMN IF NOT EXISTS video_url text;
ALTER TABLE IF EXISTS public.movies ADD COLUMN IF NOT EXISTS episodes jsonb DEFAULT '[]'::jsonb;
ALTER TABLE IF EXISTS public.movies ADD COLUMN IF NOT EXISTS is_api_source boolean DEFAULT false;

-- 1. Create ratings table
CREATE TABLE IF NOT EXISTS public.ratings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    movie_id text NOT NULL, -- Can be UUID or Slug
    user_email text NOT NULL,
    rating numeric NOT NULL CHECK (rating >= 0 AND rating <= 5),
    movie_title text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(movie_id, user_email)
);

-- 2. Create blocked_movies table (for hiding API content)
CREATE TABLE IF NOT EXISTS public.blocked_movies (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    movie_slug text UNIQUE NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Row Level Security policies
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_movies ENABLE ROW LEVEL SECURITY;

-- Allow everything for development (adjust for production if needed)
CREATE POLICY "Public read all" ON public.ratings FOR SELECT USING (true);
CREATE POLICY "Public read blocked" ON public.blocked_movies FOR SELECT USING (true);
CREATE POLICY "Admin manage all" ON public.ratings FOR ALL USING (true);
CREATE POLICY "Admin manage blocked" ON public.blocked_movies FOR ALL USING (true);
