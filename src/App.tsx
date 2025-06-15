import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MoviesProvider } from "@/hooks/useMovies";
import { SupabaseProvider } from "@/hooks/useSupabase";
import { MoviesDBProvider } from "@/hooks/useMoviesDB";
import Index from "./pages/Index";
import Movies from "./pages/Movies";
import TvShows from "./pages/TvShows";
import MyList from "./pages/MyList";
import Auth from "./pages/Auth";
import MovieDetails from "./pages/MovieDetails";
import SearchResults from "./pages/SearchResults";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SupabaseProvider>
          <MoviesDBProvider>
            <MoviesProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/tv-shows" element={<TvShows />} />
                <Route path="/my-list" element={<MyList />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/search" element={<SearchResults />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MoviesProvider>
          </MoviesDBProvider>
        </SupabaseProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
