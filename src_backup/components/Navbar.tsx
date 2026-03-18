import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Search, Menu, X, LogOut, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background/95 to-background/0 backdrop-blur-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="text-display text-3xl text-primary tracking-wider">
          CINESTREAM
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
            Home
          </Link>
          {user && (
            <Link to="/favorites" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              My List
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="text-sm text-foreground/80 hover:text-foreground transition-colors flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Admin
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Search */}
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2 animate-slide-in">
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Titles, genres..."
                className="bg-secondary border border-border rounded px-3 py-1.5 text-sm text-foreground w-40 sm:w-56 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button type="button" onClick={() => setSearchOpen(false)}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)}>
              <Search className="w-5 h-5 text-foreground/80 hover:text-foreground transition-colors" />
            </button>
          )}

          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground">
                <User className="w-4 h-4" />
              </Link>
              <button onClick={handleLogout}>
                <LogOut className="w-4 h-4 text-foreground/80 hover:text-foreground transition-colors" />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-foreground/80 hover:text-foreground">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">Sign Up</Button>
              </Link>
            </div>
          )}

          {/* Mobile menu */}
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur border-t border-border px-4 py-4 space-y-3 animate-fade-in">
          <Link to="/" className="block text-sm text-foreground/80" onClick={() => setMobileOpen(false)}>Home</Link>
          {user && (
            <Link to="/favorites" className="block text-sm text-foreground/80" onClick={() => setMobileOpen(false)}>My List</Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="block text-sm text-foreground/80" onClick={() => setMobileOpen(false)}>Admin</Link>
          )}
          {user ? (
            <>
              <Link to="/profile" className="block text-sm text-foreground/80" onClick={() => setMobileOpen(false)}>Hồ sơ</Link>
              <button onClick={handleLogout} className="block text-sm text-foreground/80">Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-sm text-foreground/80" onClick={() => setMobileOpen(false)}>Sign In</Link>
              <Link to="/register" className="block text-sm text-primary" onClick={() => setMobileOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
