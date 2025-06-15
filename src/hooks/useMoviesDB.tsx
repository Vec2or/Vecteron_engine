import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Movie {
  id: string;
  tmdb_id?: number;
  title: string;
  year: string;
  rating: number;
  genre: string;
  poster: string;
  description?: string;
  duration?: string;
  director?: string;
  movie_cast?: string[];
  trailer?: string;
  type: string;
}

interface MoviesDBContextType {
  movies: Movie[];
  tvShows: Movie[];
  loading: boolean;
  searchMovies: (query: string) => Promise<Movie[]>;
  getMovieById: (id: string) => Promise<Movie | null>;
  addToWatchlist: (movieId: string) => Promise<void>;
  removeFromWatchlist: (movieId: string) => Promise<void>;
  getWatchlist: () => Promise<Movie[]>;
  addReview: (movieId: string, rating: number, comment: string) => Promise<void>;
  getReviews: (movieId: string) => Promise<any[]>;
}

const MoviesDBContext = createContext<MoviesDBContextType | undefined>(undefined);

export const MoviesDBProvider = ({ children }: { children: ReactNode }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTvShows] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const allMovies = data || [];
      setMovies(allMovies.filter(movie => movie.type === 'movie'));
      setTvShows(allMovies.filter(movie => movie.type === 'tv'));
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchMovies = async (query: string): Promise<Movie[]> => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .or(`title.ilike.%${query}%,genre.ilike.%${query}%,director.ilike.%${query}%`);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching movies:', error);
      return [];
    }
  };

  const getMovieById = async (id: string): Promise<Movie | null> => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching movie:', error);
      return null;
    }
  };

  const addToWatchlist = async (movieId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('watchlist')
        .insert({ user_id: user.id, movie_id: movieId });

      if (error) throw error;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      throw error;
    }
  };

  const removeFromWatchlist = async (movieId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', user.id)
        .eq('movie_id', movieId);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      throw error;
    }
  };

  const getWatchlist = async (): Promise<Movie[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('watchlist')
        .select(`
          movie_id,
          movies (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data?.map(item => item.movies).filter(Boolean) || [];
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      return [];
    }
  };

  const addReview = async (movieId: string, rating: number, comment: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('reviews')
        .upsert({ 
          user_id: user.id, 
          movie_id: movieId, 
          rating, 
          comment 
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  };

  const getReviews = async (movieId: string) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles (display_name, avatar_url)
        `)
        .eq('movie_id', movieId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  };

  return (
    <MoviesDBContext.Provider value={{
      movies,
      tvShows,
      loading,
      searchMovies,
      getMovieById,
      addToWatchlist,
      removeFromWatchlist,
      getWatchlist,
      addReview,
      getReviews
    }}>
      {children}
    </MoviesDBContext.Provider>
  );
};

export const useMoviesDB = () => {
  const context = useContext(MoviesDBContext);
  if (context === undefined) {
    throw new Error('useMoviesDB must be used within a MoviesDBProvider');
  }
  return context;
};

export type { Movie };