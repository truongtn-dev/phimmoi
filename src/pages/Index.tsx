import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import PhimHeroBanner from "@/components/PhimHeroBanner";
import PhimCarousel from "@/components/PhimCarousel";
import AdBanner from "@/components/AdBanner";
import { getPhimList, getPhimByCategory } from "@/services/phimapi";

const Index = () => {
  const phimBo = useQuery({ queryKey: ["phim-bo"], queryFn: () => getPhimList("phim-bo", 1, 20) });
  const phimLe = useQuery({ queryKey: ["phim-le"], queryFn: () => getPhimList("phim-le", 1, 20) });
  const tvShows = useQuery({ queryKey: ["tv-shows"], queryFn: () => getPhimList("tv-shows", 1, 20) });
  const hoatHinh = useQuery({ queryKey: ["hoat-hinh"], queryFn: () => getPhimList("hoat-hinh", 1, 20) });
  const hanhDong = useQuery({ queryKey: ["cat-hanh-dong"], queryFn: () => getPhimByCategory("hanh-dong", 1, 20) });
  const tinhCam = useQuery({ queryKey: ["cat-tinh-cam"], queryFn: () => getPhimByCategory("tinh-cam", 1, 20) });
  const kinhDi = useQuery({ queryKey: ["cat-kinh-di"], queryFn: () => getPhimByCategory("kinh-di", 1, 20) });
  const coTrang = useQuery({ queryKey: ["cat-co-trang"], queryFn: () => getPhimByCategory("co-trang", 1, 20) });

  const heroMovies = phimBo.data?.data?.items?.slice(0, 5) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PhimHeroBanner movies={heroMovies} />

      <div className="-mt-20 relative z-10 space-y-2">
        <AdBanner position="home_top" className="px-6 sm:px-12 max-w-[1400px] mx-auto mb-4" />
        <PhimCarousel title="Phim Bộ Mới" movies={phimBo.data?.data?.items ?? []} loading={phimBo.isLoading} />
        <PhimCarousel title="Phim Lẻ Mới" movies={phimLe.data?.data?.items ?? []} loading={phimLe.isLoading} />
        <PhimCarousel title="TV Shows" movies={tvShows.data?.data?.items ?? []} loading={tvShows.isLoading} />
        <PhimCarousel title="Hoạt Hình" movies={hoatHinh.data?.data?.items ?? []} loading={hoatHinh.isLoading} />
        <AdBanner position="home_mid" className="px-6 sm:px-12 max-w-[1400px] mx-auto my-4" />
        <PhimCarousel title="Hành Động" movies={hanhDong.data?.data?.items ?? []} loading={hanhDong.isLoading} />
        <PhimCarousel title="Tình Cảm" movies={tinhCam.data?.data?.items ?? []} loading={tinhCam.isLoading} />
        <PhimCarousel title="Kinh Dị" movies={kinhDi.data?.data?.items ?? []} loading={kinhDi.isLoading} />
        <PhimCarousel title="Cổ Trang" movies={coTrang.data?.data?.items ?? []} loading={coTrang.isLoading} />
        <AdBanner position="home_bottom" className="px-6 sm:px-12 max-w-[1400px] mx-auto mt-4" />
      </div>

      <footer className="py-12 px-6 sm:px-12 text-center text-muted-foreground text-xs mt-8">
        <p>© 2026 CineStream. Dữ liệu phim từ PhimAPI.</p>
      </footer>
    </div>
  );
};

export default Index;
