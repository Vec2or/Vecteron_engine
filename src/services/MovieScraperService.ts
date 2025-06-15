import { supabase } from '@/integrations/supabase/client';

export interface ScrapedMovie {
  id: string;
  tmdb_id?: number;
  title: string;
  year: string;
  rating: number;
  genre: string;
  poster: string;
  description?: string;
  type: string;
}

export interface StreamingSource {
  id: string;
  source_url: string;
  quality: string;
  provider: string;
  language: string;
}

export class MovieScraperService {
  static async searchAndScrapeMovies(query: string, type: 'movie' | 'tv' = 'movie'): Promise<ScrapedMovie[]> {
    try {
      console.log(`Searching for: "${query}" (type: ${type})`);
      
      const { data, error } = await supabase.functions.invoke('movie-scraper', {
        body: { query, type }
      });

      if (error) {
        console.error('Error calling movie-scraper function:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to scrape movies');
      }

      console.log(`Found ${data.data.length} movies from scraper`);
      return data.data;
    } catch (error) {
      console.error('Error in searchAndScrapeMovies:', error);
      throw error;
    }
  }

  static async getStreamingSources(movieId: string): Promise<StreamingSource[]> {
    try {
      const { data, error } = await supabase
        .from('streaming_sources')
        .select('*')
        .eq('movie_id', movieId)
        .order('quality', { ascending: false }); // Prioritize higher quality

      if (error) {
        console.error('Error fetching streaming sources:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getStreamingSources:', error);
      return [];
    }
  }

  static async getMovieWithSources(movieId: string): Promise<{ movie: any; sources: StreamingSource[] } | null> {
    try {
      // Get movie details
      const { data: movie, error: movieError } = await supabase
        .from('movies')
        .select('*')
        .eq('id', movieId)
        .single();

      if (movieError || !movie) {
        console.error('Error fetching movie:', movieError);
        return null;
      }

      // Get streaming sources
      const sources = await this.getStreamingSources(movieId);

      return { movie, sources };
    } catch (error) {
      console.error('Error in getMovieWithSources:', error);
      return null;
    }
  }

  static async addCustomStreamingSource(movieId: string, sourceUrl: string, quality: string, provider: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('streaming_sources')
        .insert({
          movie_id: movieId,
          source_url: sourceUrl,
          quality,
          provider,
          language: 'en'
        });

      if (error) {
        console.error('Error adding streaming source:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in addCustomStreamingSource:', error);
      return false;
    }
  }
}