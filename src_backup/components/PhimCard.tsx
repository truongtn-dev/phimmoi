import { Link } from "react-router-dom";
import { Play, Star } from "lucide-react";
import { PhimItem, getPhimImageUrl } from "@/services/phimapi";

interface PhimCardProps {
  movie: PhimItem;
}

const PhimCard = ({ movie }: PhimCardProps) => {
  return (
    <Link
      to={`/movie/${movie.slug}`}
      className="group relative flex-shrink-0 w-[140px] sm:w-[180px] md:w-[200px] rounded-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:z-10"
    >
      {/* Poster */}
      <div className="aspect-[2/3] bg-muted overflow-hidden">
        <img
          src={getPhimImageUrl(movie.poster_url)}
          alt={movie.name}
          className="w-full h-full object-cover transition-opacity duration-300"
          loading="lazy"
        />
      </div>

      {/* Quality + Lang badges */}
      <div className="absolute top-2 left-2 flex gap-1">
        {movie.quality && (
          <span className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded font-semibold">
            {movie.quality}
          </span>
        )}
        {movie.lang && (
          <span className="bg-secondary text-secondary-foreground text-[10px] px-1.5 py-0.5 rounded">
            {movie.lang.includes("Vietsub") ? "VS" : movie.lang.includes("Lồng") ? "LT" : "TM"}
          </span>
        )}
      </div>

      {/* Episode badge */}
      {movie.episode_current && (
        <div className="absolute top-2 right-2">
          <span className="bg-background/80 text-foreground text-[10px] px-1.5 py-0.5 rounded">
            {movie.episode_current}
          </span>
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
        <h3 className="text-sm font-semibold line-clamp-2 mb-0.5">{movie.name}</h3>
        <p className="text-[11px] text-muted-foreground line-clamp-1 mb-1">{movie.origin_name}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {movie.tmdb?.vote_average ? (
            <span className="flex items-center gap-0.5 text-primary">
              <Star className="w-3 h-3 fill-current" />
              {movie.tmdb.vote_average.toFixed(1)}
            </span>
          ) : null}
          <span>{movie.year}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
            <Play className="w-3.5 h-3.5 fill-current text-primary-foreground" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PhimCard;
