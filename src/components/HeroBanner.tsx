import { useState, useEffect } from "react";
import { Play, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TMDBMovie, getBackdropUrl } from "@/services/tmdb";

interface HeroBannerProps {
  movies: TMDBMovie[];
}

const HeroBanner = ({ movies }: HeroBannerProps) => {
  const [current, setCurrent] = useState(0);
  const movie = movies[current];

  useEffect(() => {
    if (movies.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % movies.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [movies.length]);

  if (!movie) return null;

  return (
    <div className="relative h-[70vh] sm:h-[80vh] w-full overflow-hidden">
      {/* Backdrop image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${getBackdropUrl(movie.backdrop_path)})` }}
      />
      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
      <div className="absolute inset-0 gradient-hero" />

      {/* Content */}
      <div className="absolute bottom-[15%] left-0 px-6 sm:px-12 max-w-2xl animate-fade-in">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
          {movie.title}
        </h1>
        <p className="text-sm sm:text-base text-foreground/80 line-clamp-3 mb-6">
          {movie.overview}
        </p>
        <div className="flex items-center gap-3">
          <Link to={`/movie/${movie.id}`}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 text-base px-6 py-5">
              <Play className="w-5 h-5 fill-current" /> Play
            </Button>
          </Link>
          <Link to={`/movie/${movie.id}`}>
            <Button variant="outline" className="border-foreground/30 text-foreground hover:bg-foreground/10 gap-2 text-base px-6 py-5">
              <Info className="w-5 h-5" /> More Info
            </Button>
          </Link>
        </div>

        {/* Rating badge */}
        <div className="mt-4 flex items-center gap-3">
          <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-semibold">
            ★ {movie.vote_average.toFixed(1)}
          </span>
          <span className="text-xs text-muted-foreground">
            {movie.release_date?.slice(0, 4)}
          </span>
        </div>
      </div>

      {/* Dots */}
      {movies.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {movies.slice(0, 5).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-primary w-6" : "bg-foreground/30"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroBanner;
