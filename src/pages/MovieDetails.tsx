import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Plus, Share, Star, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMoviesDB } from '@/hooks/useMoviesDB';
import { VideoPlayer } from '@/components/VideoPlayer';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { getMovieById, getMovieWithSources, movies, addToWatchlist } = useMoviesDB();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<any>(null);
  const [streamingSources, setStreamingSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedSource, setSelectedSource] = useState<any>(null);

  useEffect(() => {
    if (id) {
      loadMovieData();
    }
  }, [id]);

  const loadMovieData = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const result = await getMovieWithSources(id);
      if (result) {
        setMovie(result.movie);
        setStreamingSources(result.sources);
      } else {
        // Fallback to basic movie data
        const movieData = await getMovieById(id);
        setMovie(movieData);
      }
    } catch (error) {
      console.error('Error loading movie:', error);
      toast({
        title: "Error",
        description: "Failed to load movie details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlayMovie = () => {
    const bestSource = streamingSources.find(s => s.quality === '1080p') || streamingSources[0];
    if (bestSource) {
      setSelectedSource(bestSource);
      setShowPlayer(true);
    } else {
      toast({
        title: "No Sources Available",
        description: "No streaming sources found for this movie",
        variant: "destructive",
      });
    }
  };

  const handleAddToWatchlist = async () => {
    if (!movie) return;
    
    try {
      await addToWatchlist(movie.id);
      toast({
        title: "Added to Watchlist",
        description: `${movie.title} has been added to your watchlist`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to watchlist. Please sign in.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading movie details...</p>
        </div>
      </div>
    );
  }
  
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
              <Button 
                size="lg" 
                className="bg-foreground text-background hover:bg-foreground/90"
                onClick={handlePlayMovie}
                disabled={streamingSources.length === 0}
              >
                <Play className="w-5 h-5 mr-2" />
                {streamingSources.length > 0 ? 'Play Now' : 'No Sources Available'}
              </Button>
              <Button variant="secondary" size="lg" onClick={handleAddToWatchlist}>
                <Plus className="w-5 h-5 mr-2" />
                My List
              </Button>
              {streamingSources.length > 0 && (
                <Button variant="ghost" size="lg">
                  <Settings className="w-5 h-5 mr-2" />
                  {streamingSources.length} Sources
                </Button>
              )}
            </div>
            
            {/* Streaming Sources */}
            {streamingSources.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-2">Available Sources:</h3>
                <div className="flex flex-wrap gap-2">
                  {streamingSources.slice(0, 5).map((source, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {source.provider} ({source.quality})
                    </Badge>
                  ))}
                  {streamingSources.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{streamingSources.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
            
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

      {/* Video Player */}
      {showPlayer && selectedSource && (
        <VideoPlayer
          src={selectedSource.source_url}
          poster={movie.poster}
          title={movie.title}
          onClose={() => setShowPlayer(false)}
        />
      )}
    </div>
  );
};

export default MovieDetails;