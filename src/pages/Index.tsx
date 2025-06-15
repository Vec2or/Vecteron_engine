import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { MovieRow } from "@/components/MovieRow";

// Mock data for demonstration
const mockMovies = [
  {
    id: "1",
    title: "Inception",
    year: "2010",
    rating: 8.8,
    genre: "Sci-Fi, Thriller",
    poster: "https://images.unsplash.com/photo-1489599735700-3c39022aeb05?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "2", 
    title: "The Matrix",
    year: "1999",
    rating: 8.7,
    genre: "Action, Sci-Fi",
    poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "3",
    title: "Interstellar", 
    year: "2014",
    rating: 8.6,
    genre: "Adventure, Drama",
    poster: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "4",
    title: "Blade Runner 2049",
    year: "2017", 
    rating: 8.0,
    genre: "Action, Drama",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "5",
    title: "Dune",
    year: "2021",
    rating: 8.0,
    genre: "Adventure, Drama", 
    poster: "https://images.unsplash.com/photo-1534809027769-b00d750a6340?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <HeroSection />
        <div className="space-y-8 pb-16">
          <MovieRow title="Trending Now" movies={mockMovies} />
          <MovieRow title="Action & Adventure" movies={mockMovies.slice(0, 4)} />
          <MovieRow title="Sci-Fi Classics" movies={mockMovies.slice(1, 5)} />
          <MovieRow title="Recently Added" movies={mockMovies.slice(0, 3)} />
        </div>
      </main>
    </div>
  );
};

export default Index;
