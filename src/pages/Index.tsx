import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { MovieRow } from "@/components/MovieRow";
import { useMovies } from "@/hooks/useMovies";

const Index = () => {
  const { movies } = useMovies();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <HeroSection />
        <div className="space-y-8 pb-16">
          <MovieRow title="Trending Now" movies={movies} />
          <MovieRow title="Action & Adventure" movies={movies.filter(m => m.genre.includes('Action')).slice(0, 4)} />
          <MovieRow title="Sci-Fi Classics" movies={movies.filter(m => m.genre.includes('Sci-Fi')).slice(0, 4)} />
          <MovieRow title="Recently Added" movies={movies.slice(0, 3)} />
        </div>
      </main>
    </div>
  );
};

export default Index;
