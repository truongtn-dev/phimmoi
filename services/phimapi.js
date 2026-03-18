const BASE_URL = "https://phimapi.com";
const CDN_IMAGE = "https://phimimg.com";

export const getPhimImageUrl = (path) => {
  if (!path) return "/placeholder.svg";
  if (path.startsWith("http")) return path;
  return `${CDN_IMAGE}/${path}`;
};

export const getPhimList = (type = "phim-bo", page = 1, limit = 20) =>
  fetch(`${BASE_URL}/v1/api/danh-sach/${type}?page=${page}&limit=${limit}&sort_field=modified.time&sort_type=desc`).then((r) => {
    if (!r.ok) throw new Error(`PhimAPI error: ${r.status}`);
    return r.json();
  });

export const getPhimDetail = (slug) =>
  fetch(`${BASE_URL}/phim/${slug}`).then((r) => {
    if (!r.ok) throw new Error(`PhimAPI error: ${r.status}`);
    return r.json();
  });

export const searchPhim = (keyword, page = 1, limit = 20) =>
  fetch(`${BASE_URL}/v1/api/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${page}&limit=${limit}`).then((r) => {
    if (!r.ok) throw new Error(`PhimAPI error: ${r.status}`);
    return r.json();
  });

export const getPhimByCategory = (categorySlug, page = 1, limit = 20) =>
  fetch(`${BASE_URL}/v1/api/the-loai/${categorySlug}?page=${page}&limit=${limit}&sort_field=modified.time&sort_type=desc`).then((r) => {
    if (!r.ok) throw new Error(`PhimAPI error: ${r.status}`);
    return r.json();
  });

export const PHIM_CATEGORIES = [
  { name: "Hành Động", slug: "hanh-dong" },
  { name: "Tình Cảm", slug: "tinh-cam" },
  { name: "Hài Hước", slug: "hai-huoc" },
  { name: "Cổ Trang", slug: "co-trang" },
  { name: "Tâm Lý", slug: "tam-ly" },
  { name: "Hình Sự", slug: "hinh-su" },
  { name: "Chiến Tranh", slug: "chien-tranh" },
  { name: "Thể Thao", slug: "the-thao" },
  { name: "Võ Thuật", slug: "vo-thuat" },
  { name: "Viễn Tưởng", slug: "vien-tuong" },
  { name: "Phiêu Lưu", slug: "phieu-luu" },
  { name: "Khoa Học", slug: "khoa-hoc" },
  { name: "Kinh Dị", slug: "kinh-di" },
  { name: "Âm Nhạc", slug: "am-nhac" },
  { name: "Chính Kịch", slug: "chinh-kich" },
  { name: "Bí Ẩn", slug: "bi-an" },
  { name: "Hoạt Hình", slug: "hoat-hinh" },
  { name: "Gia Đình", slug: "gia-dinh" },
];

export const PHIM_TYPES = [
  { name: "Phim Bộ", slug: "phim-bo" },
  { name: "Phim Lẻ", slug: "phim-le" },
  { name: "TV Shows", slug: "tv-shows" },
  { name: "Hoạt Hình", slug: "hoat-hinh" },
];
