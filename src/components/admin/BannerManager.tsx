import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Plus, ToggleLeft, ToggleRight } from "lucide-react";

const POSITIONS = [
  { value: "home_top", label: "Trang chủ - Trên cùng" },
  { value: "home_mid", label: "Trang chủ - Giữa trang" },
  { value: "home_bottom", label: "Trang chủ - Cuối trang" },
  { value: "detail_sidebar", label: "Chi tiết phim - Sidebar" },
  { value: "watch_top", label: "Trang xem - Trên player" },
  { value: "watch_bottom", label: "Trang xem - Dưới player" },
  { value: "search_top", label: "Trang tìm kiếm - Trên cùng" },
];

const BannerManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    image_url: "",
    link_url: "",
    position: "home_top",
    sort_order: "0",
    is_active: true,
  });

  const { data: banners, isLoading } = useQuery({
    queryKey: ["admin-banners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .order("position")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const resetForm = () => {
    setForm({ title: "", image_url: "", link_url: "", position: "home_top", sort_order: "0", is_active: true });
    setEditId(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!form.image_url) {
      toast({ title: "Lỗi", description: "Vui lòng nhập URL hình ảnh", variant: "destructive" });
      return;
    }

    const bannerData = {
      title: form.title,
      image_url: form.image_url,
      link_url: form.link_url,
      position: form.position,
      sort_order: parseInt(form.sort_order) || 0,
      is_active: form.is_active,
    };

    if (editId) {
      const { error } = await supabase.from("banners").update(bannerData).eq("id", editId);
      if (error) { toast({ title: "Lỗi", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Đã cập nhật banner" });
    } else {
      const { error } = await supabase.from("banners").insert(bannerData);
      if (error) { toast({ title: "Lỗi", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Đã thêm banner" });
    }
    queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
    queryClient.invalidateQueries({ queryKey: ["banners"] });
    resetForm();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("banners").delete().eq("id", id);
    if (!error) {
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      toast({ title: "Đã xóa banner" });
    }
  };

  const handleToggle = async (id: string, currentActive: boolean) => {
    const { error } = await supabase.from("banners").update({ is_active: !currentActive }).eq("id", id);
    if (!error) {
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    }
  };

  const handleEdit = (banner: any) => {
    setForm({
      title: banner.title || "",
      image_url: banner.image_url || "",
      link_url: banner.link_url || "",
      position: banner.position,
      sort_order: String(banner.sort_order || 0),
      is_active: banner.is_active,
    });
    setEditId(banner.id);
    setShowForm(true);
  };

  const getPositionLabel = (pos: string) =>
    POSITIONS.find((p) => p.value === pos)?.label || pos;

  return (
    <div>
      <Button onClick={() => { resetForm(); setShowForm(true); }} className="bg-primary text-primary-foreground mb-4 gap-2">
        <Plus className="w-4 h-4" /> Thêm Banner
      </Button>

      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6 mb-6 animate-scale-in space-y-4">
          <h3 className="font-semibold">{editId ? "Sửa Banner" : "Thêm Banner"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground">Tiêu đề</label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-secondary" placeholder="Tên quảng cáo" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Vị trí</label>
              <select
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-secondary px-3 text-sm text-foreground"
              >
                {POSITIONS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">URL Hình ảnh Banner</label>
              <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="bg-secondary" placeholder="https://..." />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Link khi click</label>
              <Input value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} className="bg-secondary" placeholder="https://..." />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Thứ tự</label>
              <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="bg-secondary" />
            </div>
            <div className="flex items-end gap-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="accent-primary"
                />
                Kích hoạt
              </label>
            </div>
          </div>

          {form.image_url && (
            <div>
              <label className="text-xs text-muted-foreground">Xem trước</label>
              <img src={form.image_url} alt="Preview" className="max-h-[120px] rounded-md border border-border mt-1" />
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleSave} className="bg-primary text-primary-foreground">
              {editId ? "Cập nhật" : "Thêm"}
            </Button>
            <Button variant="outline" onClick={resetForm} className="border-border text-foreground">Hủy</Button>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left p-3 text-muted-foreground font-medium">Banner</th>
              <th className="text-left p-3 text-muted-foreground font-medium hidden sm:table-cell">Vị trí</th>
              <th className="text-left p-3 text-muted-foreground font-medium hidden md:table-cell">Trạng thái</th>
              <th className="text-right p-3 text-muted-foreground font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {banners?.map((banner) => (
              <tr key={banner.id} className="border-b border-border/50 hover:bg-muted/30">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    {banner.image_url && (
                      <img src={banner.image_url} alt="" className="w-16 h-10 object-cover rounded border border-border" />
                    )}
                    <div>
                      <p className="font-medium text-foreground">{banner.title || "Không có tiêu đề"}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">{banner.link_url}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3 hidden sm:table-cell text-muted-foreground text-xs">{getPositionLabel(banner.position)}</td>
                <td className="p-3 hidden md:table-cell">
                  <span className={`text-xs px-2 py-0.5 rounded ${banner.is_active ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}>
                    {banner.is_active ? "Đang hiển thị" : "Đã tắt"}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button onClick={() => handleToggle(banner.id, banner.is_active)} className="p-1.5 hover:text-primary transition-colors" title="Bật/Tắt">
                    {banner.is_active ? <ToggleRight className="w-4 h-4 text-green-400" /> : <ToggleLeft className="w-4 h-4" />}
                  </button>
                  <button onClick={() => handleEdit(banner)} className="p-1.5 hover:text-primary transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(banner.id)} className="p-1.5 hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {(!banners || banners.length === 0) && (
              <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Chưa có banner nào</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BannerManager;
