import { useParams, useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { getPhimDetail, getPhimImageUrl } from "@/services/phimapi";
import { useState } from "react";

const WatchPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const initialEp = searchParams.get("tap") || "tap-01";
  const initialServer = parseInt(searchParams.get("server") || "0");

  const [selectedServer, setSelectedServer] = useState(initialServer);
  const [selectedEp, setSelectedEp] = useState(initialEp);
  const [showAllEps, setShowAllEps] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["phim-watch", slug],
    queryFn: () => getPhimDetail(slug!),
    enabled: !!slug,
  });

  const movie = data?.movie;
  const episodes = data?.episodes ?? [];
  const currentServer = episodes[selectedServer];
  const currentEpData = currentServer?.server_data?.find(
    (ep) => ep.slug === selectedEp
  );

  // Show limited episodes unless expanded
  const visibleEps = showAllEps
    ? currentServer?.server_data
    : currentServer?.server_data?.slice(0, 50);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!movie || episodes.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Không tìm thấy phim</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-16">
        {/* Video Player */}
        <div className="w-full bg-black">
          <div className="max-w-[1200px] mx-auto">
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              {currentEpData ? (
                <iframe
                  key={currentEpData.link_embed}
                  src={currentEpData.link_embed}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                  allow="autoplay; fullscreen; encrypted-media"
                  style={{ border: "none" }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  Chọn tập để xem phim
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Movie info & episodes */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
          {/* Back + title */}
          <div className="flex items-start gap-4 mb-6">
            <Link to={`/movie/${slug}`}>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1 shrink-0">
                <ArrowLeft className="w-4 h-4" /> Chi tiết
              </Button>
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold truncate">{movie.name}</h1>
              <p className="text-sm text-muted-foreground">
                {movie.origin_name} • {movie.year} • {movie.quality} • {movie.lang}
              </p>
              {currentEpData && (
                <p className="text-sm text-primary mt-1">
                  Đang xem: {currentEpData.name}
                </p>
              )}
            </div>
          </div>

          {/* Server selection */}
          {episodes.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {episodes.map((server, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedServer(i);
                    setSelectedEp(episodes[i]?.server_data?.[0]?.slug || "tap-01");
                  }}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    i === selectedServer
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-accent"
                  }`}
                >
                  {server.server_name}
                </button>
              ))}
            </div>
          )}

          {/* Episode list */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground/80 mb-3">Danh sách tập</h3>
            <div className="flex flex-wrap gap-2">
              {visibleEps?.map((ep) => (
                <button
                  key={ep.slug}
                  onClick={() => setSelectedEp(ep.slug)}
                  className={`px-3 py-2 rounded text-xs font-medium transition-all ${
                    ep.slug === selectedEp
                      ? "bg-primary text-primary-foreground scale-105"
                      : "bg-secondary text-secondary-foreground hover:bg-accent"
                  }`}
                >
                  {ep.name}
                </button>
              ))}
            </div>
            {currentServer?.server_data?.length > 50 && !showAllEps && (
              <button
                onClick={() => setShowAllEps(true)}
                className="mt-3 flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <ChevronDown className="w-3 h-3" /> Xem thêm {currentServer.server_data.length - 50} tập
              </button>
            )}
          </div>

          {/* Movie thumb + description */}
          <div className="flex gap-4 mt-4">
            <img
              src={getPhimImageUrl(movie.poster_url)}
              alt={movie.name}
              className="w-24 sm:w-32 rounded-lg object-cover shrink-0"
            />
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2 mb-2">
                {movie.category?.map((cat) => (
                  <span key={cat.id} className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded text-xs">
                    {cat.name}
                  </span>
                ))}
              </div>
              <p className="text-sm text-foreground/70 line-clamp-4" dangerouslySetInnerHTML={{ __html: movie.content }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
