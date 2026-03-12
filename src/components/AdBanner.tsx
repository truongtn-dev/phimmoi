import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface AdBannerProps {
  position: string;
  className?: string;
}

const AdBanner = ({ position, className = "" }: AdBannerProps) => {
  const { data: banners, isLoading } = useQuery({
    queryKey: ["banners", position],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .eq("position", position)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className={`w-full ${className}`}>
        <Skeleton className="w-full h-[90px] rounded-lg bg-muted" />
      </div>
    );
  }

  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <div className={`w-full flex flex-col gap-2 ${className}`}>
      {banners.map((banner) => (
        <a
          key={banner.id}
          href={banner.link_url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="block w-full overflow-hidden rounded-lg transition-opacity hover:opacity-90"
        >
          <img
            src={banner.image_url}
            alt={banner.title || "Quảng cáo"}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </a>
      ))}
    </div>
  );
};

export default AdBanner;
