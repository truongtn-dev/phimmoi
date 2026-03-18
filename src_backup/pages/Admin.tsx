import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Plus, Film, Users, Image } from "lucide-react";
import BannerManager from "@/components/admin/BannerManager";

type Tab = "movies" | "users" | "banners";

const Admin = () => {
  const [tab, setTab] = useState<Tab>("movies");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", description: "", poster_url: "", trailer_url: "", category: "Action", rating: "0",
  });

  const movies = useQuery({
    queryKey: ["admin-movies"],
    queryFn: async () => {
      const { data, error } = await supabase.from("movies").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const users = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: tab === "users",
  });

  const resetForm = () => {
    setForm({ title: "", description: "", poster_url: "", trailer_url: "", category: "Action", rating: "0" });
    setEditId(null);
    setShowForm(false);
  };

  const handleSaveMovie = async () => {
    const movieData = {
      title: form.title,
      description: form.description,
      poster_url: form.poster_url || null,
      trailer_url: form.trailer_url || null,
      category: form.category,
      rating: parseFloat(form.rating) || 0,
    };
    if (editId) {
      const { error } = await supabase.from("movies").update(movieData).eq("id", editId);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Movie updated" });
    } else {
      const { error } = await supabase.from("movies").insert(movieData);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Movie added" });
    }
    queryClient.invalidateQueries({ queryKey: ["admin-movies"] });
    resetForm();
  };

  const handleDeleteMovie = async (id: string) => {
    const { error } = await supabase.from("movies").delete().eq("id", id);
    if (!error) {
      queryClient.invalidateQueries({ queryKey: ["admin-movies"] });
      toast({ title: "Movie deleted" });
    }
  };

  const handleEdit = (movie: any) => {
    setForm({
      title: movie.title, description: movie.description || "", poster_url: movie.poster_url || "",
      trailer_url: movie.trailer_url || "", category: movie.category, rating: String(movie.rating || 0),
    });
    setEditId(movie.id);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 px-6 sm:px-12 max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="flex gap-2 mb-6 flex-wrap">
          {([
            { key: "movies" as Tab, icon: Film, label: "Movies" },
            { key: "banners" as Tab, icon: Image, label: "Banners" },
            { key: "users" as Tab, icon: Users, label: "Users" },
          ]).map((t) => (
            <Button
              key={t.key}
              variant={tab === t.key ? "default" : "outline"}
              onClick={() => setTab(t.key)}
              className={tab === t.key ? "bg-primary text-primary-foreground" : "border-border text-foreground"}
            >
              <t.icon className="w-4 h-4 mr-2" /> {t.label}
            </Button>
          ))}
        </div>

        {tab === "movies" && (
          <>
            <Button onClick={() => { resetForm(); setShowForm(true); }} className="bg-primary text-primary-foreground mb-4 gap-2">
              <Plus className="w-4 h-4" /> Add Movie
            </Button>
            {showForm && (
              <div className="bg-card border border-border rounded-lg p-6 mb-6 animate-scale-in space-y-4">
                <h3 className="font-semibold">{editId ? "Edit Movie" : "Add Movie"}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="text-xs text-muted-foreground">Title</label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-secondary" /></div>
                  <div><label className="text-xs text-muted-foreground">Category</label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="bg-secondary" /></div>
                  <div><label className="text-xs text-muted-foreground">Poster URL</label><Input value={form.poster_url} onChange={(e) => setForm({ ...form, poster_url: e.target.value })} className="bg-secondary" /></div>
                  <div><label className="text-xs text-muted-foreground">Trailer URL</label><Input value={form.trailer_url} onChange={(e) => setForm({ ...form, trailer_url: e.target.value })} className="bg-secondary" /></div>
                  <div><label className="text-xs text-muted-foreground">Rating</label><Input type="number" step="0.1" min="0" max="10" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="bg-secondary" /></div>
                </div>
                <div><label className="text-xs text-muted-foreground">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-secondary border border-border rounded-md p-2 text-sm text-foreground min-h-[80px]" /></div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveMovie} className="bg-primary text-primary-foreground">{editId ? "Update" : "Add"}</Button>
                  <Button variant="outline" onClick={resetForm} className="border-border text-foreground">Cancel</Button>
                </div>
              </div>
            )}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border bg-muted/50"><th className="text-left p-3 text-muted-foreground font-medium">Title</th><th className="text-left p-3 text-muted-foreground font-medium hidden sm:table-cell">Category</th><th className="text-left p-3 text-muted-foreground font-medium hidden md:table-cell">Rating</th><th className="text-right p-3 text-muted-foreground font-medium">Actions</th></tr></thead>
                <tbody>
                  {movies.data?.map((movie) => (
                    <tr key={movie.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="p-3">{movie.title}</td>
                      <td className="p-3 hidden sm:table-cell text-muted-foreground">{movie.category}</td>
                      <td className="p-3 hidden md:table-cell text-muted-foreground">{movie.rating}</td>
                      <td className="p-3 text-right">
                        <button onClick={() => handleEdit(movie)} className="p-1.5 hover:text-primary transition-colors"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteMovie(movie.id)} className="p-1.5 hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                  {movies.data?.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">No movies yet</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === "banners" && <BannerManager />}

        {tab === "users" && (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50"><th className="text-left p-3 text-muted-foreground font-medium">Name</th><th className="text-left p-3 text-muted-foreground font-medium hidden sm:table-cell">Joined</th></tr></thead>
              <tbody>
                {users.data?.map((profile) => (
                  <tr key={profile.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="p-3">{profile.name}</td>
                    <td className="p-3 hidden sm:table-cell text-muted-foreground">{new Date(profile.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
