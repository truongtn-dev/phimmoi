import { Link } from "react-router-dom";
import { PHIM_CATEGORIES, PHIM_TYPES } from "@/services/phimapi";

const Footer = () => {
  return (
    <footer className="border-t border-border/40 mt-12 bg-background">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 py-10">
        {/* Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Loại Phim</h3>
            <ul className="space-y-1.5">
              {PHIM_TYPES.map((t) => (
                <li key={t.slug}>
                  <Link
                    to={`/search?q=&type=${t.slug}`}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Thể Loại</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {PHIM_CATEGORIES.slice(0, 12).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/search?q=&cat=${cat.slug}`}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Thêm Thể Loại</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {PHIM_CATEGORIES.slice(12).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/search?q=&cat=${cat.slug}`}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border/30 pt-6 text-center">
          <p className="text-xs text-muted-foreground">© 2026 CineStream</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
