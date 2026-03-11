import { Link } from "react-router-dom";
import { Play, Plus, Star } from "lucide-react";
import { TMDBMovie, getImageUrl } from "@/services/tmdb";

interface MovieCardProps {
  movie: TMDBMovie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group relative flex-shrink-0 w-[140px] sm:w-[180px] md:w-[200px] rounded-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:z-10"
    >
      {/* Poster */}
      <div className="aspect-[2/3] bg-muted overflow-hidden">
        <img
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full h-full object-cover transition-opacity duration-300"
          loading="lazy"
        />
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
        <h3 className="text-sm font-semibold line-clamp-2 mb-1">{movie.title}</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-0.5 text-primary">
            <Star className="w-3 h-3 fill-current" />
            {movie.vote_average.toFixed(1)}
          </span>
          <span>{movie.release_date?.slice(0, 4)}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
            <Play className="w-3.5 h-3.5 fill-current text-primary-foreground" />
          </div>
          <div className="w-7 h-7 rounded-full border border-foreground/30 flex items-center justify-center hover:border-foreground transition-colors">
            <Plus className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
