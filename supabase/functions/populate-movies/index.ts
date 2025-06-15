import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const TMDB_GENRES = [
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

function getGenreNames(genreIds: number[]): string {
  return genreIds
    .map(id => TMDB_GENRES.find(genre => genre.id === id)?.name)
    .filter(Boolean)
    .join(", ");
}

function generateStreamingSources(tmdbId: number): Array<{source_url: string, quality: string, provider: string}> {
  const sampleVideos = [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
  ];
  
  const videoIndex = tmdbId % sampleVideos.length;
  const baseVideo = sampleVideos[videoIndex];
  
  const qualities = ["1080p", "720p", "480p"];
  return qualities.map((quality, idx) => ({
    source_url: baseVideo,
    quality,
    provider: `server${idx + 1}`
  }));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const tmdbApiKey = '8265bd1679663a7ea12ac168da84d2e8';
    
    // Fetch from multiple TMDB endpoints for comprehensive content
    const endpoints = [
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${tmdbApiKey}`,
      `https://api.themoviedb.org/3/trending/tv/week?api_key=${tmdbApiKey}`,
      `https://api.themoviedb.org/3/movie/popular?api_key=${tmdbApiKey}`,
      `https://api.themoviedb.org/3/tv/popular?api_key=${tmdbApiKey}`,
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${tmdbApiKey}`,
      `https://api.themoviedb.org/3/tv/top_rated?api_key=${tmdbApiKey}`,
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${tmdbApiKey}`,
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${tmdbApiKey}`,
      `https://api.themoviedb.org/3/tv/airing_today?api_key=${tmdbApiKey}`,
      `https://api.themoviedb.org/3/tv/on_the_air?api_key=${tmdbApiKey}`
    ];

    let totalAdded = 0;

    for (const endpoint of endpoints) {
      const response = await fetch(endpoint);
      const data = await response.json();
      
      const isTV = endpoint.includes('/tv/');
      
      for (const item of data.results?.slice(0, 50) || []) {
        // Check if already exists
        const { data: existing } = await supabase
          .from('movies')
          .select('id')
          .eq('tmdb_id', item.id)
          .single();

        if (existing) continue;

        const year = (item.release_date || item.first_air_date || '').split('-')[0] || '2024';
        const title = item.title || item.name || 'Unknown Title';
        const poster = item.poster_path 
          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
          : '/placeholder.svg';

        // Insert movie
        const { data: newMovie, error } = await supabase
          .from('movies')
          .insert({
            tmdb_id: item.id,
            title,
            year,
            rating: item.vote_average || 0,
            genre: getGenreNames(item.genre_ids || []) || 'Drama',
            poster,
            description: item.overview || 'No description available',
            type: isTV ? 'tv' : 'movie',
            duration: isTV ? '45 min/episode' : '120 min',
            director: 'Various',
            movie_cast: ['Actor 1', 'Actor 2', 'Actor 3']
          })
          .select('id')
          .single();

        if (!error && newMovie) {
          // Add streaming sources
          const sources = generateStreamingSources(item.id);
          for (const source of sources) {
            await supabase
              .from('streaming_sources')
              .insert({
                movie_id: newMovie.id,
                ...source
              });
          }
          totalAdded++;
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully added ${totalAdded} movies/shows to database` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error populating movies:', error);
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