const TMDB_API_KEY = "REPLACE_WITH_YOUR_TMDB_API_KEY";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";

export const getImageUrl = (path: string | null, size: string = "w500") => {
  if (!path) return "/placeholder.svg";
  return `${IMAGE_BASE}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null) => getImageUrl(path, "original");

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
}

export interface TMDBResponse {
  results: TMDBMovie[];
  page: number;
  total_pages: number;
  total_results: number;
}

export interface TMDBMovieDetail extends TMDBMovie {
  genres: { id: number; name: string }[];
  runtime: number;
  tagline: string;
  videos?: {
    results: { key: string; site: string; type: string; name: string }[];
  };
}

const fetchTMDB = async <T>(endpoint: string, params: Record<string, string> = {}): Promise<T> => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", TMDB_API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
  return res.json();
};

export const getTrending = (page = "1") =>
  fetchTMDB<TMDBResponse>("/trending/movie/week", { page });

export const getPopular = (page = "1") =>
  fetchTMDB<TMDBResponse>("/movie/popular", { page });

export const getTopRated = (page = "1") =>
  fetchTMDB<TMDBResponse>("/movie/top_rated", { page });

export const getUpcoming = (page = "1") =>
  fetchTMDB<TMDBResponse>("/movie/upcoming", { page });

export const getByGenre = (genreId: string, page = "1") =>
  fetchTMDB<TMDBResponse>("/discover/movie", { with_genres: genreId, page, sort_by: "popularity.desc" });

export const searchMovies = (query: string, page = "1") =>
  fetchTMDB<TMDBResponse>("/search/movie", { query, page });

export const getMovieDetails = (id: string) =>
  fetchTMDB<TMDBMovieDetail>(`/movie/${id}`, { append_to_response: "videos" });

export const GENRES: { id: number; name: string }[] = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 27, name: "Horror" },
  { id: 18, name: "Drama" },
  { id: 878, name: "Sci-Fi" },
  { id: 10749, name: "Romance" },
  { id: 53, name: "Thriller" },
  { id: 16, name: "Animation" },
  { id: 99, name: "Documentary" },
  { id: 14, name: "Fantasy" },
];
