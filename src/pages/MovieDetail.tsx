import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Play, Heart, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import AdBanner from "@/components/AdBanner";
import SEOHead from "@/components/SEOHead";
import { getPhimDetail, getPhimImageUrl } from "@/services/phimapi";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ["phim-detail", id],
    queryFn: () => getPhimDetail(id!),
    enabled: !!id,
  });

  const movie = data?.movie;
  const episodes = data?.episodes ?? [];
  const firstEp = episodes[0]?.server_data?.[0];

  const handleAddToFavorites = async () => {
    if (!user || !movie) return;
    const { data: dbMovie } = await supabase
      .from("movies")
      .upsert({
        tmdb_id: movie.tmdb?.id ? parseInt(movie.tmdb.id) : null,
        title: movie.name,
        description: movie.content,
        poster_url: getPhimImageUrl(movie.poster_url),
        backdrop_url: getPhimImageUrl(movie.thumb_url),
        category: movie.category?.[0]?.name ?? "Khác",
        rating: movie.tmdb?.vote_average ?? 0,
        release_date: String(movie.year),
      }, { onConflict: "tmdb_id" })
      .select()
      .single();

    if (dbMovie) {
      const { error } = await supabase.from("favorites").upsert({
        user_id: user.id,
        movie_id: dbMovie.id,
      }, { onConflict: "user_id,movie_id" });

      if (!error) toast({ title: "Đã thêm vào danh sách yêu thích!" });
      else toast({ title: "Đã có trong danh sách", variant: "destructive" });
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
        <p className="text-muted-foreground">Không tìm thấy phim</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={movie.name}
        description={movie.content?.replace(/<[^>]*>/g, '').slice(0, 155) || `Xem phim ${movie.name} online miễn phí chất lượng cao`}
        canonical={`https://cinestream.lovable.app/movie/${id}`}
        type="video.movie"
        image={getPhimImageUrl(movie.poster_url)}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Movie",
          "name": movie.name,
          "description": movie.content?.replace(/<[^>]*>/g, '').slice(0, 300),
          "image": getPhimImageUrl(movie.poster_url),
          "dateCreated": movie.year?.toString(),
        }}
      />
      <Navbar />

      {/* Hero backdrop */}
      <div className="relative h-[60vh] sm:h-[70vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${getPhimImageUrl(movie.thumb_url)})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />

        <div className="absolute top-20 left-6 sm:left-12">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-foreground/70 hover:text-foreground gap-1">
              <ArrowLeft className="w-4 h-4" /> Trang chủ
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
              src={getPhimImageUrl(movie.poster_url)}
              alt={movie.name}
              className="rounded-lg shadow-2xl w-full"
            />
          </div>

          {/* Info */}
          <div className="flex-1 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-1">{movie.name}</h1>
            <p className="text-muted-foreground italic mb-4">{movie.origin_name}</p>

            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
              {movie.tmdb?.vote_average ? (
                <span className="flex items-center gap-1 text-primary font-semibold">
                  <Star className="w-4 h-4 fill-current" /> {movie.tmdb.vote_average.toFixed(1)}
                </span>
              ) : null}
              <span className="text-muted-foreground">{movie.year}</span>
              <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-semibold">{movie.quality}</span>
              <span className="text-muted-foreground">{movie.lang}</span>
              {movie.time && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" /> {movie.time}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {movie.category?.map((cat) => (
                <span key={cat.id} className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded text-xs">
                  {cat.name}
                </span>
              ))}
            </div>

            <div className="text-sm text-muted-foreground mb-2">
              <span className="text-foreground/80 font-medium">Trạng thái:</span> {movie.episode_current}
              {movie.episode_total && ` / ${movie.episode_total} tập`}
            </div>

            {movie.actor?.length > 0 && movie.actor[0] !== "Đang cập nhật" && (
              <div className="text-sm text-muted-foreground mb-2">
                <span className="text-foreground/80 font-medium">Diễn viên:</span> {movie.actor.join(", ")}
              </div>
            )}

            {movie.country?.length > 0 && (
              <div className="text-sm text-muted-foreground mb-4">
                <span className="text-foreground/80 font-medium">Quốc gia:</span> {movie.country.map(c => c.name).join(", ")}
              </div>
            )}

            <p className="text-foreground/80 leading-relaxed mb-6 max-w-2xl" dangerouslySetInnerHTML={{ __html: movie.content }} />

            <div className="flex flex-wrap gap-3">
              {firstEp && (
                <Link to={`/watch/${movie.slug}`}>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                    <Play className="w-4 h-4 fill-current" /> Xem Phim
                  </Button>
                </Link>
              )}
              {movie.trailer_url && (
                <a href={movie.trailer_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-foreground/20 text-foreground hover:bg-foreground/10 gap-2">
                    <Play className="w-4 h-4" /> Trailer
                  </Button>
                </a>
              )}
              {user && (
                <Button
                  onClick={handleAddToFavorites}
                  variant="outline"
                  className="border-foreground/20 text-foreground hover:bg-foreground/10 gap-2"
                >
                  <Heart className="w-4 h-4" /> Yêu thích
                </Button>
              )}
            </div>

            {/* Episode list preview */}
            {episodes.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3">Danh sách tập ({movie.episode_current})</h3>
                <div className="flex flex-wrap gap-2">
                  {episodes[0]?.server_data?.slice(0, 20).map((ep) => (
                    <Link
                      key={ep.slug}
                      to={`/watch/${movie.slug}?tap=${ep.slug}`}
                      className="px-3 py-2 rounded text-xs font-medium bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {ep.name}
                    </Link>
                  ))}
                  {(episodes[0]?.server_data?.length ?? 0) > 20 && (
                    <Link
                      to={`/watch/${movie.slug}`}
                      className="px-3 py-2 rounded text-xs font-medium bg-accent text-accent-foreground"
                    >
                      Xem thêm...
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <AdBanner position="detail_sidebar" className="mt-8" />
      </div>

      <div className="h-24" />
    </div>
  );
};

export default MovieDetail;
