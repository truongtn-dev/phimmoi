import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import PhimCard from "@/components/PhimCard";
import MovieCardSkeleton from "@/components/MovieCardSkeleton";
import AdBanner from "@/components/AdBanner";
import SEOHead from "@/components/SEOHead";
import { searchPhim, getPhimByCategory, PHIM_CATEGORIES } from "@/services/phimapi";
import { useState } from "react";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  const searchResults = useQuery({
    queryKey: ["phim-search", query],
    queryFn: () => searchPhim(query),
    enabled: !!query,
  });

  const catResults = useQuery({
    queryKey: ["phim-cat-search", selectedCat],
    queryFn: () => getPhimByCategory(selectedCat!),
    enabled: !!selectedCat,
  });

  const movies = query
    ? searchResults.data?.data?.items ?? []
    : selectedCat
    ? catResults.data?.data?.items ?? []
    : [];

  const isLoading = query ? searchResults.isLoading : catResults.isLoading;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={query ? `Tìm kiếm: ${query}` : "Tìm kiếm phim"}
        description={query ? `Kết quả tìm kiếm cho "${query}" trên CineStream` : "Tìm kiếm phim online miễn phí trên CineStream"}
        canonical={`https://cinestream.lovable.app/search${query ? `?q=${query}` : ''}`}
      />
      <Navbar />
      <div className="pt-24 px-6 sm:px-12 max-w-[1400px] mx-auto">
        <AdBanner position="search_top" className="mb-6" />
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          {query ? `Kết quả tìm kiếm "${query}"` : "Duyệt theo thể loại"}
        </h1>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {PHIM_CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCat(cat.slug === selectedCat ? null : cat.slug)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                cat.slug === selectedCat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {isLoading
            ? Array.from({ length: 12 }).map((_, i) => <MovieCardSkeleton key={i} />)
            : movies.map((movie) => <PhimCard key={movie._id} movie={movie} />)}
        </div>

        {!isLoading && movies.length === 0 && (query || selectedCat) && (
          <p className="text-center text-muted-foreground mt-12">Không tìm thấy phim nào.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
