import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import MovieCardSkeleton from "@/components/MovieCardSkeleton";
import { searchMovies, getByGenre, GENRES } from "@/services/tmdb";
import { useState } from "react";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  const searchResults = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchMovies(query),
    enabled: !!query,
  });

  const genreResults = useQuery({
    queryKey: ["genre-search", selectedGenre],
    queryFn: () => getByGenre(String(selectedGenre!)),
    enabled: !!selectedGenre,
  });

  const movies = query
    ? searchResults.data?.results ?? []
    : selectedGenre
    ? genreResults.data?.results ?? []
    : [];

  const isLoading = query ? searchResults.isLoading : genreResults.isLoading;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 px-6 sm:px-12 max-w-[1400px] mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          {query ? `Results for "${query}"` : "Browse by Category"}
        </h1>

        {/* Genre filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {GENRES.map((genre) => (
            <button
              key={genre.id}
              onClick={() => setSelectedGenre(genre.id === selectedGenre ? null : genre.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                genre.id === selectedGenre
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>

        {/* Results grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {isLoading
            ? Array.from({ length: 12 }).map((_, i) => <MovieCardSkeleton key={i} />)
            : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        </div>

        {!isLoading && movies.length === 0 && (query || selectedGenre) && (
          <p className="text-center text-muted-foreground mt-12">No movies found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
