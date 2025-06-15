import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Filter, X } from "lucide-react";

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
}

interface SearchFilters {
  query: string;
  genre: string;
  year: string;
  rating: number[];
  type: string;
}

export const AdvancedSearch = ({ onSearch }: AdvancedSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    genre: '',
    year: '',
    rating: [0],
    type: ''
  });

  const handleSearch = () => {
    onSearch(filters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    const emptyFilters = {
      query: '',
      genre: '',
      year: '',
      rating: [0],
      type: ''
    };
    setFilters(emptyFilters);
    onSearch(emptyFilters);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="glass-card border-0">
          <Filter className="w-4 h-4 mr-2" />
          Advanced Search
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-0 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Advanced Search</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="search-query">Search Term</Label>
            <Input
              id="search-query"
              placeholder="Movie or TV show title..."
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              className="bg-secondary/50"
            />
          </div>

          <div className="space-y-2">
            <Label>Content Type</Label>
            <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
              <SelectTrigger className="bg-secondary/50">
                <SelectValue placeholder="All content" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All content</SelectItem>
                <SelectItem value="movie">Movies</SelectItem>
                <SelectItem value="tv">TV Shows</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Genre</Label>
            <Select value={filters.genre} onValueChange={(value) => setFilters({ ...filters, genre: value })}>
              <SelectTrigger className="bg-secondary/50">
                <SelectValue placeholder="Any genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any genre</SelectItem>
                <SelectItem value="Action">Action</SelectItem>
                <SelectItem value="Comedy">Comedy</SelectItem>
                <SelectItem value="Drama">Drama</SelectItem>
                <SelectItem value="Horror">Horror</SelectItem>
                <SelectItem value="Romance">Romance</SelectItem>
                <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
                <SelectItem value="Thriller">Thriller</SelectItem>
                <SelectItem value="Adventure">Adventure</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Release Year</Label>
            <Select value={filters.year} onValueChange={(value) => setFilters({ ...filters, year: value })}>
              <SelectTrigger className="bg-secondary/50">
                <SelectValue placeholder="Any year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any year</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Minimum Rating: {filters.rating[0]}</Label>
            <Slider
              value={filters.rating}
              onValueChange={(value) => setFilters({ ...filters, rating: value })}
              max={10}
              min={0}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button onClick={handleSearch} className="flex-1">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};