import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Check, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WatchlistButtonProps {
  movieId: string;
  movieTitle: string;
  variant?: "default" | "icon";
  size?: "sm" | "default" | "lg";
}

export const WatchlistButton = ({ movieId, movieTitle, variant = "default", size = "default" }: WatchlistButtonProps) => {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const toggleWatchlist = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call - replace with actual logic
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsInWatchlist(!isInWatchlist);
      
      toast({
        title: isInWatchlist ? "Removed from My List" : "Added to My List",
        description: isInWatchlist 
          ? `${movieTitle} has been removed from your watchlist.`
          : `${movieTitle} has been added to your watchlist.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update watchlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === "icon") {
    return (
      <Button
        onClick={toggleWatchlist}
        variant="ghost"
        size="icon"
        disabled={isLoading}
        className={`${size === "sm" ? "h-8 w-8" : "h-10 w-10"} ${
          isInWatchlist ? "text-primary" : "text-muted-foreground"
        } hover:text-primary transition-colors`}
      >
        {isInWatchlist ? (
          <Heart className={`${size === "sm" ? "w-3 h-3" : "w-4 h-4"} fill-current`} />
        ) : (
          <Plus className={`${size === "sm" ? "w-3 h-3" : "w-4 h-4"}`} />
        )}
      </Button>
    );
  }

  return (
    <Button
      onClick={toggleWatchlist}
      variant={isInWatchlist ? "secondary" : "outline"}
      size={size}
      disabled={isLoading}
      className="flex items-center space-x-2"
    >
      {isInWatchlist ? (
        <>
          <Check className="w-4 h-4" />
          <span>In My List</span>
        </>
      ) : (
        <>
          <Plus className="w-4 h-4" />
          <span>Add to List</span>
        </>
      )}
    </Button>
  );
};