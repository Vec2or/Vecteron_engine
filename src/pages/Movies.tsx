import { Header } from "@/components/Header";
import { MovieCard } from "@/components/MovieCard";
import { GenreFilter } from "@/components/GenreFilter";
import { FloatingOrbs } from "@/components/FloatingOrbs";
import { useMoviesDB } from "@/hooks/useMoviesDB";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";

const Movies = () => {
  const { movies, loading } = useMoviesDB();
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredMovies = selectedGenre 
    ? movies.filter(movie => movie.genre.toLowerCase().includes(selectedGenre.toLowerCase()))
    : movies;

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <FloatingOrbs />
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading movies...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingOrbs />
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Movies</h1>
              <p className="text-muted-foreground">Discover amazing movies from our collection</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <GenreFilter 
                availableGenres={['Action', 'Drama', 'Comedy', 'Thriller', 'Sci-Fi', 'Horror', 'Romance', 'Adventure']}
                selectedGenres={selectedGenre ? [selectedGenre] : []}
                onGenreChange={(genres) => setSelectedGenre(genres[0] || '')}
              />
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {filteredMovies.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                No movies found
              </h2>
              <p className="text-muted-foreground">
                Try adjusting your filters or check back later for new content.
              </p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6"
                : "space-y-4"
            }>
              {filteredMovies.map((movie) => (
                <div key={movie.id} className={viewMode === 'list' ? 'w-full' : ''}>
                  <MovieCard {...movie} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Movies;