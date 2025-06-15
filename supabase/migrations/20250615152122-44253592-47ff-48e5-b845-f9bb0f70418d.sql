-- Add missing columns to movies table for complete movie details
ALTER TABLE public.movies 
ADD COLUMN IF NOT EXISTS director TEXT DEFAULT 'Various',
ADD COLUMN IF NOT EXISTS duration TEXT DEFAULT '120 min',
ADD COLUMN IF NOT EXISTS movie_cast TEXT[] DEFAULT ARRAY['Actor 1', 'Actor 2', 'Actor 3'],
ADD COLUMN IF NOT EXISTS trailer TEXT;