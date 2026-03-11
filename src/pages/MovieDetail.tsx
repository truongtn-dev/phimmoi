import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Play, Heart, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { getMovieDetails, getBackdropUrl, getImageUrl } from "@/services/tmdb";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showTrailer, setShowTrailer] = useState(false);

  const { data: movie, isLoading } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieDetails(id!),
    enabled: !!id,
  });

  const trailer = movie?.videos?.results?.find(
    (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
  );

  const handleAddToFavorites = async () => {
    if (!user || !movie) return;
    // First, upsert movie to DB
    const { data: dbMovie } = await supabase
      .from("movies")
      .upsert({
        tmdb_id: movie.id,
        title: movie.title,
        description: movie.overview,
        poster_url: movie.poster_path ? getImageUrl(movie.poster_path) : null,
        backdrop_url: movie.backdrop_path ? getBackdropUrl(movie.backdrop_path) : null,
        category: movie.genres?.[0]?.name ?? "Other",
        rating: movie.vote_average,
        release_date: movie.release_date,
      }, { onConflict: "tmdb_id" })
      .select()
      .single();

    if (dbMovie) {
      const { error } = await supabase.from("favorites").upsert({
        user_id: user.id,
        movie_id: dbMovie.id,
      }, { onConflict: "user_id,movie_id" });

      if (!error) toast({ title: "Added to favorites!" });
      else toast({ title: "Already in favorites", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Movie not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Trailer modal */}
      {showTrailer && trailer && (
        <div className="fixed inset-0 z-50 bg-background/90 flex items-center justify-center p-4" onClick={() => setShowTrailer(false)}>
          <div className="w-full max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              className="w-full h-full rounded-lg"
              allowFullScreen
              allow="autoplay"
            />
          </div>
        </div>
      )}

      {/* Hero backdrop */}
      <div className="relative h-[60vh] sm:h-[70vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${getBackdropUrl(movie.backdrop_path)})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />

        <div className="absolute top-20 left-6 sm:left-12">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-foreground/70 hover:text-foreground gap-1">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="relative -mt-48 z-10 px-6 sm:px-12 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 w-48 sm:w-64 mx-auto md:mx-0">
            <img
              src={getImageUrl(movie.poster_path, "w500")}
              alt={movie.title}
              className="rounded-lg shadow-2xl w-full"
            />
          </div>

          {/* Info */}
          <div className="flex-1 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">{movie.title}</h1>
            {movie.tagline && (
              <p className="text-muted-foreground italic mb-4">"{movie.tagline}"</p>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
              <span className="flex items-center gap-1 text-primary font-semibold">
                <Star className="w-4 h-4 fill-current" /> {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-muted-foreground">{movie.release_date?.slice(0, 4)}</span>
              {movie.runtime > 0 && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" /> {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </span>
              )}
              {movie.genres?.map((g) => (
                <span key={g.id} className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded text-xs">
                  {g.name}
                </span>
              ))}
            </div>

            <p className="text-foreground/80 leading-relaxed mb-6 max-w-2xl">{movie.overview}</p>

            <div className="flex flex-wrap gap-3">
              {trailer && (
                <Button
                  onClick={() => setShowTrailer(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                >
                  <Play className="w-4 h-4 fill-current" /> Watch Trailer
                </Button>
              )}
              {user && (
                <Button
                  onClick={handleAddToFavorites}
                  variant="outline"
                  className="border-foreground/20 text-foreground hover:bg-foreground/10 gap-2"
                >
                  <Heart className="w-4 h-4" /> Add to My List
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="h-24" />
    </div>
  );
};

export default MovieDetail;
