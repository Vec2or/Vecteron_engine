import { Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MovieCard } from '@/components/MovieCard';
import { useMovies } from '@/hooks/useMovies';

const SearchResults = () => {
  const { searchTerm, searchResults } = useMovies();

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <h1 className="text-2xl font-bold text-foreground">
              Search results for "{searchTerm}"
            </h1>
          </div>
        </div>

        {searchResults.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No results found
            </h2>
            <p className="text-muted-foreground">
              Try searching with different keywords
            </p>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground mb-6">
              Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {searchResults.map((movie) => (
                <div key={movie.id} className="w-full">
                  <MovieCard {...movie} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;