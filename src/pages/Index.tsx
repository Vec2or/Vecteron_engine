import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { MovieRow } from "@/components/MovieRow";
import { FloatingOrbs } from "@/components/FloatingOrbs";
import { useMoviesDB } from "@/hooks/useMoviesDB";

const Index = () => {
  const { movies, tvShows } = useMoviesDB();
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingOrbs />
      <Header />
      <main className="pt-16">
        <HeroSection />
        <div className="space-y-8 pb-16">
          <MovieRow title="Trending Movies" movies={movies.slice(0, 6)} />
          <MovieRow title="Action & Adventure" movies={movies.filter(m => m.genre.includes('Action')).slice(0, 6)} />
          <MovieRow title="Drama" movies={movies.filter(m => m.genre.includes('Drama')).slice(0, 6)} />
          <MovieRow title="Comedy" movies={movies.filter(m => m.genre.includes('Comedy')).slice(0, 6)} />
          <MovieRow title="TV Shows" movies={tvShows.slice(0, 6)} />
          <MovieRow title="Recently Added" movies={[...movies, ...tvShows].slice(0, 6)} />
        </div>
      </main>
    </div>
  );
};

export default Index;
