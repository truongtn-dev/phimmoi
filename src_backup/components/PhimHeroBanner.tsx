import { useState, useEffect } from "react";
import { Play, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PhimItem, getPhimImageUrl } from "@/services/phimapi";

interface PhimHeroBannerProps {
  movies: PhimItem[];
}

const PhimHeroBanner = ({ movies }: PhimHeroBannerProps) => {
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
      {/* Backdrop image - use thumb_url for wider image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${getPhimImageUrl(movie.thumb_url)})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
      <div className="absolute inset-0 gradient-hero" />

      {/* Content */}
      <div className="absolute bottom-[15%] left-0 px-6 sm:px-12 max-w-2xl animate-fade-in">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-2 leading-tight">
          {movie.name}
        </h1>
        <p className="text-sm text-muted-foreground mb-1">{movie.origin_name}</p>
        <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
          {movie.quality && (
            <span className="bg-primary/20 text-primary px-2 py-0.5 rounded font-semibold">{movie.quality}</span>
          )}
          <span className="text-muted-foreground">{movie.year}</span>
          <span className="text-muted-foreground">{movie.lang}</span>
          {movie.episode_current && (
            <span className="text-muted-foreground">{movie.episode_current}</span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {movie.category?.slice(0, 3).map((cat) => (
            <span key={cat.id} className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded text-xs">
              {cat.name}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link to={`/watch/${movie.slug}`}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 text-base px-6 py-5">
              <Play className="w-5 h-5 fill-current" /> Xem Phim
            </Button>
          </Link>
          <Link to={`/movie/${movie.slug}`}>
            <Button variant="outline" className="border-foreground/30 text-foreground hover:bg-foreground/10 gap-2 text-base px-6 py-5">
              <Info className="w-5 h-5" /> Chi Tiết
            </Button>
          </Link>
        </div>

        {movie.tmdb?.vote_average ? (
          <div className="mt-4 flex items-center gap-3">
            <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-semibold">
              ★ {movie.tmdb.vote_average.toFixed(1)}
            </span>
          </div>
        ) : null}
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

export default PhimHeroBanner;
