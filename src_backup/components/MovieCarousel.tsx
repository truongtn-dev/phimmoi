import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";
import { TMDBMovie } from "@/services/tmdb";
import MovieCardSkeleton from "./MovieCardSkeleton";

interface MovieCarouselProps {
  title: string;
  movies: TMDBMovie[];
  loading?: boolean;
}

const MovieCarousel = ({ title, movies, loading }: MovieCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group/carousel mb-8">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 px-6 sm:px-12">{title}</h2>

      <div className="relative">
        {/* Scroll buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-0 z-10 w-10 bg-background/60 opacity-0 group-hover/carousel:opacity-100 transition-opacity flex items-center justify-center hover:bg-background/80"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-0 z-10 w-10 bg-background/60 opacity-0 group-hover/carousel:opacity-100 transition-opacity flex items-center justify-center hover:bg-background/80"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Movies row */}
        <div
          ref={scrollRef}
          className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide px-6 sm:px-12 pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <MovieCardSkeleton key={i} />)
            : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      </div>
    </div>
  );
};

export default MovieCarousel;
