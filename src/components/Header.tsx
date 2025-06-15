import { Search, Bell, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMovies } from "@/hooks/useMovies";
import { useMoviesDB } from "@/hooks/useMoviesDB";
import { useSupabase } from "@/hooks/useSupabase";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const Header = () => {
  const { searchTerm, setSearchTerm } = useMovies();
  const { scrapeAndSearchMovies } = useMoviesDB();
  const { user, signOut } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim() && !isSearching) {
      setIsSearching(true);
      toast({
        title: "Searching...",
        description: `Scraping results for "${localSearch.trim()}"`,
      });
      
      try {
        // Trigger live scraping
        await scrapeAndSearchMovies(localSearch.trim());
        setSearchTerm(localSearch.trim());
        navigate('/search');
        toast({
          title: "Search Complete",
          description: "Found fresh results from the web!",
        });
      } catch (error) {
        console.error('Search error:', error);
        toast({
          title: "Search Error",
          description: "Failed to scrape results. Showing cached data.",
          variant: "destructive",
        });
        setSearchTerm(localSearch.trim());
        navigate('/search');
      } finally {
        setIsSearching(false);
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">V</span>
            </div>
            <span className="text-xl font-bold text-foreground">Vecteron</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">Home</Link>
            <Link to="/movies" className="text-muted-foreground hover:text-primary transition-colors">Movies</Link>
            <Link to="/tv-shows" className="text-muted-foreground hover:text-primary transition-colors">TV Shows</Link>
            <Link to="/my-list" className="text-muted-foreground hover:text-primary transition-colors">My List</Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search movies, shows..." 
              className="pl-10 w-64 bg-secondary/50 border-border"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </form>
          {user ? (
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="w-5 h-5" />
            </Button>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};