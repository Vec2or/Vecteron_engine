import { createContext, useContext, useState, ReactNode } from 'react';

interface Movie {
  id: string;
  title: string;
  year: string;
  rating: number;
  genre: string;
  poster: string;
  description?: string;
  duration?: string;
  director?: string;
  cast?: string[];
  trailer?: string;
}

interface MoviesContextType {
  movies: Movie[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: Movie[];
  getMovieById: (id: string) => Movie | undefined;
}

const MoviesContext = createContext<MoviesContextType | undefined>(undefined);

// Extended mock data with more details
const mockMovies: Movie[] = [
  {
    id: "1",
    title: "Inception",
    year: "2010",
    rating: 8.8,
    genre: "Sci-Fi, Thriller",
    poster: "https://images.unsplash.com/photo-1489599735700-3c39022aeb05?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    duration: "2h 28m",
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Marion Cotillard", "Tom Hardy"],
    trailer: "https://example.com/inception-trailer"
  },
  {
    id: "2", 
    title: "The Matrix",
    year: "1999",
    rating: 8.7,
    genre: "Action, Sci-Fi",
    poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    duration: "2h 16m",
    director: "The Wachowskis",
    cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
    trailer: "https://example.com/matrix-trailer"
  },
  {
    id: "3",
    title: "Interstellar", 
    year: "2014",
    rating: 8.6,
    genre: "Adventure, Drama",
    poster: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    duration: "2h 49m",
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    trailer: "https://example.com/interstellar-trailer"
  },
  {
    id: "4",
    title: "Blade Runner 2049",
    year: "2017", 
    rating: 8.0,
    genre: "Action, Drama",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    description: "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard.",
    duration: "2h 44m",
    director: "Denis Villeneuve",
    cast: ["Ryan Gosling", "Harrison Ford", "Ana de Armas"],
    trailer: "https://example.com/blade-runner-trailer"
  },
  {
    id: "5",
    title: "Dune",
    year: "2021",
    rating: 8.0,
    genre: "Adventure, Drama", 
    poster: "https://images.unsplash.com/photo-1534809027769-b00d750a6340?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    description: "Paul Atreides arrives on Arrakis after his father accepts the stewardship of the dangerous planet.",
    duration: "2h 35m",
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Rebecca Ferguson", "Oscar Isaac"],
    trailer: "https://example.com/dune-trailer"
  }
];

export const MoviesProvider = ({ children }: { children: ReactNode }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const searchResults = searchTerm 
    ? mockMovies.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.year.includes(searchTerm)
      )
    : [];

  const getMovieById = (id: string) => mockMovies.find(movie => movie.id === id);

  return (
    <MoviesContext.Provider value={{
      movies: mockMovies,
      searchTerm,
      setSearchTerm,
      searchResults,
      getMovieById
    }}>
      {children}
    </MoviesContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MoviesContext);
  if (context === undefined) {
    throw new Error('useMovies must be used within a MoviesProvider');
  }
  return context;
};

export type { Movie };