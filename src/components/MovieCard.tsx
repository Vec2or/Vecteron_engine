import { Play, Plus, ThumbsUp, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface MovieCardProps {
  id: string;
  title: string;
  year: string;
  rating: number;
  genre: string;
  poster: string;
}

export const MovieCard = ({ id, title, year, rating, genre, poster }: MovieCardProps) => {
  return (
    <Link to={`/movie/${id}`}>
      <Card className="group relative overflow-hidden glass-card hover:scale-105 transition-all duration-300 cursor-pointer border-0">
      <div className="aspect-[2/3] relative">
        <img 
          src={poster || '/placeholder.svg'} 
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground text-sm">{title}</h3>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{year}</span>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{rating}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{genre}</p>
            
            <div className="flex items-center space-x-2 pt-2">
              <Button size="sm" variant="secondary" className="h-8 px-3">
                <Play className="w-3 h-3 mr-1" />
                Play
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Plus className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <ThumbsUp className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
    </Link>
  );
};