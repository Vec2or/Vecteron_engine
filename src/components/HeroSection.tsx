import { Play, Info, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center justify-start bg-gradient-to-r from-background/90 to-background/20">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1489599735700-3c39022aeb05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
      
      <div className="relative z-10 container mx-auto px-4 max-w-2xl">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
              Featured
            </Badge>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-muted-foreground">8.5 IMDb</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            The Dark Knight
          </h1>
          
          <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
            When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, 
            Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.
          </p>
          
          <div className="flex items-center space-x-4">
            <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90">
              <Play className="w-5 h-5 mr-2" />
              Play Now
            </Button>
            <Button variant="secondary" size="lg">
              <Info className="w-5 h-5 mr-2" />
              More Info
            </Button>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>2008</span>
            <span>•</span>
            <span>2h 32m</span>
            <span>•</span>
            <span>Action, Crime, Drama</span>
          </div>
        </div>
      </div>
    </section>
  );
};