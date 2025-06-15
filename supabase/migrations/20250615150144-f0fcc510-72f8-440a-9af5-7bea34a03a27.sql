-- Add streaming sources table for multiple video sources per movie
CREATE TABLE public.streaming_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  movie_id UUID NOT NULL REFERENCES public.movies(id) ON DELETE CASCADE,
  source_url TEXT NOT NULL,
  quality TEXT DEFAULT '720p',
  provider TEXT,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.streaming_sources ENABLE ROW LEVEL SECURITY;

-- Create policies for streaming sources (public read access for streaming)
CREATE POLICY "Streaming sources are viewable by everyone" 
ON public.streaming_sources 
FOR SELECT 
USING (true);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_streaming_sources_updated_at
BEFORE UPDATE ON public.streaming_sources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add search history table for caching scraped results
CREATE TABLE public.search_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  query TEXT NOT NULL,
  results JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

-- Create policies for search history (public read access)
CREATE POLICY "Search history is viewable by everyone" 
ON public.search_history 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert search history" 
ON public.search_history 
FOR INSERT 
WITH CHECK (true);