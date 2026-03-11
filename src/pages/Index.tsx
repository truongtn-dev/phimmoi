import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import MovieCarousel from "@/components/MovieCarousel";
import { getTrending, getPopular, getTopRated, getUpcoming, getByGenre, GENRES } from "@/services/tmdb";

const Index = () => {
  const trending = useQuery({ queryKey: ["trending"], queryFn: () => getTrending() });
  const popular = useQuery({ queryKey: ["popular"], queryFn: () => getPopular() });
  const topRated = useQuery({ queryKey: ["topRated"], queryFn: () => getTopRated() });
  const upcoming = useQuery({ queryKey: ["upcoming"], queryFn: () => getUpcoming() });
  const action = useQuery({ queryKey: ["genre", 28], queryFn: () => getByGenre("28") });
  const comedy = useQuery({ queryKey: ["genre", 35], queryFn: () => getByGenre("35") });
  const horror = useQuery({ queryKey: ["genre", 27], queryFn: () => getByGenre("27") });
  const scifi = useQuery({ queryKey: ["genre", 878], queryFn: () => getByGenre("878") });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroBanner movies={trending.data?.results?.slice(0, 5) ?? []} />

      <div className="-mt-20 relative z-10 space-y-2">
        <MovieCarousel title="Trending Now" movies={trending.data?.results ?? []} loading={trending.isLoading} />
        <MovieCarousel title="Popular" movies={popular.data?.results ?? []} loading={popular.isLoading} />
        <MovieCarousel title="Top Rated" movies={topRated.data?.results ?? []} loading={topRated.isLoading} />
        <MovieCarousel title="Coming Soon" movies={upcoming.data?.results ?? []} loading={upcoming.isLoading} />
        <MovieCarousel title="Action" movies={action.data?.results ?? []} loading={action.isLoading} />
        <MovieCarousel title="Comedy" movies={comedy.data?.results ?? []} loading={comedy.isLoading} />
        <MovieCarousel title="Horror" movies={horror.data?.results ?? []} loading={horror.isLoading} />
        <MovieCarousel title="Sci-Fi" movies={scifi.data?.results ?? []} loading={scifi.isLoading} />
      </div>

      {/* Footer */}
      <footer className="py-12 px-6 sm:px-12 text-center text-muted-foreground text-xs mt-8">
        <p>© 2026 CineStream. Powered by TMDB.</p>
      </footer>
    </div>
  );
};

export default Index;
