const BASE_URL = "https://phimapi.com";
const CDN_IMAGE = "https://phimimg.com";

// Helper to get full image URL
export const getPhimImageUrl = (path: string | null | undefined): string => {
  if (!path) return "/placeholder.svg";
  if (path.startsWith("http")) return path;
  return `${CDN_IMAGE}/${path}`;
};

// Types
export interface PhimItem {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  type: string;
  poster_url: string;
  thumb_url: string;
  year: number;
  quality: string;
  lang: string;
  episode_current: string;
  time: string;
  category: { id: string; name: string; slug: string }[];
  country: { id: string; name: string; slug: string }[];
  tmdb?: { type: string; id: string; vote_average: number };
  sub_docquyen: boolean;
  chieurap: boolean;
  modified?: { time: string };
}

export interface PhimListResponse {
  status: boolean;
  data: {
    items: PhimItem[];
    titlePage: string;
    params: {
      pagination: {
        totalItems: number;
        totalItemsPerPage: number;
        currentPage: number;
        totalPages: number;
      };
    };
    APP_DOMAIN_CDN_IMAGE: string;
  };
}

export interface EpisodeData {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
}

export interface EpisodeServer {
  server_name: string;
  server_data: EpisodeData[];
}

export interface PhimDetail {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  content: string;
  type: string;
  status: string;
  poster_url: string;
  thumb_url: string;
  year: number;
  quality: string;
  lang: string;
  episode_current: string;
  episode_total: string;
  time: string;
  trailer_url: string;
  actor: string[];
  director: string[];
  category: { id: string; name: string; slug: string }[];
  country: { id: string; name: string; slug: string }[];
  tmdb?: { type: string; id: string; vote_average: number; vote_count: number };
}

export interface PhimDetailResponse {
  status: boolean;
  movie: PhimDetail;
  episodes: EpisodeServer[];
}

// API functions
const fetchPhimApi = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`PhimAPI error: ${res.status}`);
  return res.json();
};

// Get movie list by type
export const getPhimList = (
  type: string = "phim-bo",
  page = 1,
  limit = 20
) =>
  fetchPhimApi<PhimListResponse>(
    `${BASE_URL}/v1/api/danh-sach/${type}?page=${page}&limit=${limit}&sort_field=modified.time&sort_type=desc`
  );

// Get movie detail by slug
export const getPhimDetail = (slug: string) =>
  fetchPhimApi<PhimDetailResponse>(`${BASE_URL}/phim/${slug}`);

// Search movies
export const searchPhim = (keyword: string, page = 1, limit = 20) =>
  fetchPhimApi<PhimListResponse>(
    `${BASE_URL}/v1/api/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${page}&limit=${limit}`
  );

// Get by category
export const getPhimByCategory = (categorySlug: string, page = 1, limit = 20) =>
  fetchPhimApi<PhimListResponse>(
    `${BASE_URL}/v1/api/the-loai/${categorySlug}?page=${page}&limit=${limit}&sort_field=modified.time&sort_type=desc`
  );

// Get by country
export const getPhimByCountry = (countrySlug: string, page = 1, limit = 20) =>
  fetchPhimApi<PhimListResponse>(
    `${BASE_URL}/v1/api/quoc-gia/${countrySlug}?page=${page}&limit=${limit}&sort_field=modified.time&sort_type=desc`
  );

// Categories list
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

// Type lists
export const PHIM_TYPES = [
  { name: "Phim Bộ", slug: "phim-bo" },
  { name: "Phim Lẻ", slug: "phim-le" },
  { name: "TV Shows", slug: "tv-shows" },
  { name: "Hoạt Hình", slug: "hoat-hinh" },
];
