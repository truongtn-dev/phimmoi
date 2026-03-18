import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const Favorites = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: favorites, isLoading } = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select("*, movies(*)")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const removeFavorite = async (favoriteId: string) => {
    await supabase.from("favorites").delete().eq("id", favoriteId);
    queryClient.invalidateQueries({ queryKey: ["favorites"] });
    toast({ title: "Removed from favorites" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 px-6 sm:px-12 max-w-[1400px] mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8">My List</h1>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-muted rounded-md animate-pulse" />
            ))}
          </div>
        ) : favorites?.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">Your list is empty</p>
            <Link to="/">
              <Button className="bg-primary text-primary-foreground">Browse Movies</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {favorites?.map((fav) => {
              const movie = fav.movies as any;
              if (!movie) return null;
              return (
                <div key={fav.id} className="group relative rounded-md overflow-hidden">
                  <Link to={`/movie/${movie.tmdb_id}`}>
                    <img
                      src={movie.poster_url || "/placeholder.svg"}
                      alt={movie.title}
                      className="w-full aspect-[2/3] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                      <h3 className="text-sm font-semibold">{movie.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Star className="w-3 h-3 text-primary fill-current" />
                        {movie.rating?.toFixed(1)}
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={() => removeFavorite(fav.id)}
                    className="absolute top-2 right-2 bg-background/80 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
