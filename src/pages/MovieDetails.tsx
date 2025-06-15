import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Plus, Share, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMovies } from '@/hooks/useMovies';
import { MovieRow } from '@/components/MovieRow';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { getMovieById, movies } = useMovies();
  
  const movie = id ? getMovieById(id) : null;
  
  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Movie not found</h1>
          <Link to="/">
            <Button variant="secondary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedMovies = movies.filter(m => 
    m.id !== movie.id && 
    m.genre.split(', ').some(genre => movie.genre.includes(genre))
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${movie.poster})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/30" />
        
        {/* Navigation */}
        <div className="relative z-10 p-6">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>

        {/* Movie Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-16">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center space-x-2 mb-4">
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                {movie.year}
              </Badge>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-muted-foreground">{movie.rating} IMDb</span>
              </div>
              <span className="text-sm text-muted-foreground">{movie.duration}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
              {movie.title}
            </h1>
            
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
              {movie.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genre.split(', ').map((genre) => (
                <Badge key={genre} variant="outline">
                  {genre}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center space-x-4 mb-6">
              <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90">
                <Play className="w-5 h-5 mr-2" />
                Play Now
              </Button>
              <Button variant="secondary" size="lg">
                <Plus className="w-5 h-5 mr-2" />
                My List
              </Button>
              <Button variant="ghost" size="lg">
                <Share className="w-5 h-5 mr-2" />
                Share
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Director</h3>
                <p className="text-muted-foreground">{movie.director}</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Cast</h3>
                <p className="text-muted-foreground">{movie.cast?.join(', ')}</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Duration</h3>
                <p className="text-muted-foreground">{movie.duration}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Movies */}
      {relatedMovies.length > 0 && (
        <div className="py-8">
          <MovieRow title="More Like This" movies={relatedMovies} />
        </div>
      )}
    </div>
  );
};

export default MovieDetails;