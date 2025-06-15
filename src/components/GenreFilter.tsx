import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface GenreFilterProps {
  availableGenres: string[];
  selectedGenres: string[];
  onGenreChange: (genres: string[]) => void;
}

export const GenreFilter = ({ availableGenres, selectedGenres, onGenreChange }: GenreFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      onGenreChange(selectedGenres.filter(g => g !== genre));
    } else {
      onGenreChange([...selectedGenres, genre]);
    }
  };

  const clearFilters = () => {
    onGenreChange([]);
  };

  return (
    <div className="flex items-center space-x-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="glass-card border-0">
            <Filter className="w-4 h-4 mr-2" />
            Genres
            {selectedGenres.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {selectedGenres.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="glass-card border-0 w-80" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Filter by Genre</h3>
              {selectedGenres.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {availableGenres.map((genre) => (
                <Button
                  key={genre}
                  variant={selectedGenres.includes(genre) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleGenre(genre)}
                  className="justify-start"
                >
                  {genre}
                </Button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Display selected genres */}
      {selectedGenres.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedGenres.map((genre) => (
            <Badge
              key={genre}
              variant="secondary"
              className="flex items-center gap-1 bg-primary/20 text-primary border-primary/30"
            >
              {genre}
              <Button
                variant="ghost"
                size="icon"
                className="h-3 w-3 p-0 hover:bg-primary/20"
                onClick={() => toggleGenre(genre)}
              >
                <X className="w-2 h-2" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};