import { Header } from "@/components/Header";
import { MovieCard } from "@/components/MovieCard";
import { FloatingOrbs } from "@/components/FloatingOrbs";
import { useMoviesDB } from "@/hooks/useMoviesDB";
import { useSupabase } from "@/hooks/useSupabase";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import type { Movie } from "@/hooks/useMoviesDB";

const MyList = () => {
  const { getWatchlist } = useMoviesDB();
  const { user } = useSupabase();
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWatchlist();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchWatchlist = async () => {
    try {
      const data = await getWatchlist();
      setWatchlist(data);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <FloatingOrbs />
        <Header />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center py-16">
              <LogIn className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-foreground mb-4">Sign in to view your list</h1>
              <p className="text-muted-foreground mb-8">
                Create an account to save your favorite movies and TV shows
              </p>
              <Link to="/auth">
                <Button size="lg">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <FloatingOrbs />
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading your list...</p>
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
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">My List</h1>
            <p className="text-muted-foreground">Your personal collection of saved content</p>
          </div>

          {watchlist.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Your list is empty
              </h2>
              <p className="text-muted-foreground mb-8">
                Start adding movies and TV shows to build your personal collection
              </p>
              <div className="flex justify-center space-x-4">
                <Link to="/movies">
                  <Button>Browse Movies</Button>
                </Link>
                <Link to="/tv-shows">
                  <Button variant="outline">Browse TV Shows</Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">
                  {watchlist.length} item{watchlist.length !== 1 ? 's' : ''} in your list
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {watchlist.map((item) => (
                  <div key={item.id}>
                    <MovieCard {...item} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyList;