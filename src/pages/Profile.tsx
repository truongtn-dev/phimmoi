import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Lock, Camera, Save, ArrowLeft, Heart, Clock } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);

  // Password change
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: favCount } = useQuery({
    queryKey: ["fav-count", user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("favorites")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user!.id);
      return count ?? 0;
    },
    enabled: !!user,
  });

  const { data: watchlistCount } = useQuery({
    queryKey: ["watchlist-count", user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("watchlist")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user!.id);
      return count ?? 0;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setAvatarUrl(profile.avatar_url || "");
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ name, avatar_url: avatarUrl || null })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Đã cập nhật hồ sơ!" });
      queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast({ title: "Lỗi", description: "Mật khẩu phải ít nhất 6 ký tự", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Lỗi", description: "Mật khẩu xác nhận không khớp", variant: "destructive" });
      return;
    }
    setChangingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setChangingPassword(false);
    if (error) {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Đã đổi mật khẩu thành công!" });
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center pt-32">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 px-6 sm:px-12 max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold mb-8">Hồ Sơ Cá Nhân</h1>

        {/* Avatar & Stats */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-muted border-2 border-border flex items-center justify-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-muted-foreground" />
              )}
            </div>
            <div className="absolute inset-0 rounded-full bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-5 h-5 text-foreground" />
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-semibold">{profile?.name || "Chưa đặt tên"}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Tham gia: {profile ? new Date(profile.created_at).toLocaleDateString("vi-VN") : ""}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
            <Heart className="w-5 h-5 text-primary" />
            <div>
              <p className="text-lg font-bold">{favCount ?? 0}</p>
              <p className="text-xs text-muted-foreground">Yêu thích</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <p className="text-lg font-bold">{watchlistCount ?? 0}</p>
              <p className="text-xs text-muted-foreground">Danh sách xem</p>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-5 mb-6">
          <h3 className="font-semibold flex items-center gap-2">
            <User className="w-4 h-4 text-primary" /> Thông tin cá nhân
          </h3>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Email</label>
            <div className="flex items-center gap-2 bg-secondary rounded-md px-3 py-2.5 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              {user?.email}
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Tên hiển thị</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-secondary"
              placeholder="Nhập tên của bạn"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">URL Ảnh đại diện</label>
            <Input
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="bg-secondary"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <Button onClick={handleSaveProfile} disabled={saving} className="bg-primary text-primary-foreground gap-2">
            <Save className="w-4 h-4" />
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>

        {/* Password Change */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-5 mb-12">
          <h3 className="font-semibold flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" /> Bảo mật
          </h3>

          {!showPasswordForm ? (
            <Button
              variant="outline"
              onClick={() => setShowPasswordForm(true)}
              className="border-border text-foreground gap-2"
            >
              <Lock className="w-4 h-4" /> Đổi mật khẩu
            </Button>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Mật khẩu mới</label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-secondary"
                  placeholder="Ít nhất 6 ký tự"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Xác nhận mật khẩu mới</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-secondary"
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleChangePassword} disabled={changingPassword} className="bg-primary text-primary-foreground">
                  {changingPassword ? "Đang xử lý..." : "Xác nhận đổi"}
                </Button>
                <Button variant="outline" onClick={() => { setShowPasswordForm(false); setNewPassword(""); setConfirmPassword(""); }} className="border-border text-foreground">
                  Hủy
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
