import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TMDBSearchResult {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

interface TMDBGenre {
  id: number;
  name: string;
}

const TMDB_GENRES: TMDBGenre[] = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" }
];

// Mock streaming sources - in real implementation, this would scrape from various providers
const STREAMING_PROVIDERS = [
  "streamtape.com",
  "doodstream.com", 
  "upstream.to",
  "mixdrop.co",
  "fembed.com"
];

function getGenreNames(genreIds: number[]): string {
  return genreIds
    .map(id => TMDB_GENRES.find(genre => genre.id === id)?.name)
    .filter(Boolean)
    .join(", ");
}

function generateStreamingSources(movieTitle: string, year: string): Array<{source_url: string, quality: string, provider: string}> {
  // Mock streaming URLs - in real implementation, scrape from actual providers
  const sources = [];
  const cleanTitle = movieTitle.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
  
  STREAMING_PROVIDERS.forEach((provider, index) => {
    const qualities = ["720p", "1080p", "480p"];
    qualities.forEach(quality => {
      sources.push({
        source_url: `https://${provider}/embed/${cleanTitle}-${year}-${quality}`,
        quality,
        provider: provider.split('.')[0]
      });
    });
  });
  
  return sources;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { query, type = 'movie' } = await req.json();
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Search query is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    console.log(`Searching for: ${query} (type: ${type})`);

    // Check if we have cached results
    const { data: cachedResult } = await supabase
      .from('search_history')
      .select('results')
      .eq('query', query)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // 24 hours cache
      .single();

    if (cachedResult?.results) {
      console.log('Returning cached results');
      return new Response(
        JSON.stringify({ success: true, data: cachedResult.results }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use free TMDB API (no key required for basic search)
    const tmdbUrl = type === 'tv' 
      ? `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(query)}`
      : `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`;

    console.log('Fetching from TMDB:', tmdbUrl);

    const tmdbResponse = await fetch(tmdbUrl, {
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!tmdbResponse.ok) {
      throw new Error(`TMDB API error: ${tmdbResponse.status}`);
    }

    const tmdbData = await tmdbResponse.json();
    console.log(`Found ${tmdbData.results?.length || 0} results from TMDB`);

    const movies = [];

    for (const item of tmdbData.results?.slice(0, 10) || []) {
      const year = (item.release_date || item.first_air_date || '').split('-')[0] || 'Unknown';
      const title = item.title || item.name || 'Unknown Title';
      const poster = item.poster_path 
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : '/placeholder.svg';

      // Check if movie already exists in our database
      const { data: existingMovie } = await supabase
        .from('movies')
        .select('id')
        .eq('tmdb_id', item.id)
        .single();

      let movieId = existingMovie?.id;

      if (!existingMovie) {
        // Insert new movie into database
        const { data: newMovie, error: insertError } = await supabase
          .from('movies')
          .insert({
            tmdb_id: item.id,
            title,
            year,
            rating: item.vote_average || 0,
            genre: getGenreNames(item.genre_ids || []) || 'Unknown',
            poster,
            description: item.overview || 'No description available',
            type: type === 'tv' ? 'tv' : 'movie'
          })
          .select('id')
          .single();

        if (insertError) {
          console.error('Error inserting movie:', insertError);
          continue;
        }

        movieId = newMovie.id;

        // Generate and insert streaming sources
        const streamingSources = generateStreamingSources(title, year);
        
        for (const source of streamingSources) {
          await supabase
            .from('streaming_sources')
            .insert({
              movie_id: movieId,
              ...source
            });
        }

        console.log(`Added movie: ${title} (${year}) with ${streamingSources.length} streaming sources`);
      }

      movies.push({
        id: movieId,
        tmdb_id: item.id,
        title,
        year,
        rating: item.vote_average || 0,
        genre: getGenreNames(item.genre_ids || []) || 'Unknown',
        poster,
        description: item.overview || 'No description available',
        type: type === 'tv' ? 'tv' : 'movie'
      });
    }

    // Cache the results
    await supabase
      .from('search_history')
      .insert({
        query,
        results: movies
      });

    console.log(`Successfully processed ${movies.length} movies`);

    return new Response(
      JSON.stringify({ success: true, data: movies }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in movie-scraper:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});