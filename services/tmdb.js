const TMDB_API_KEY = "REPLACE_WITH_YOUR_TMDB_API_KEY";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";

export const getImageUrl = (path, size = "w500") => {
  if (!path) return "/placeholder.svg";
  return `${IMAGE_BASE}/${size}${path}`;
};

export const getBackdropUrl = (path) => getImageUrl(path, "original");

const fetchTMDB = async (endpoint, params = {}) => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", TMDB_API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
  return res.json();
};

export const getTrending = (page = "1") => fetchTMDB("/trending/movie/week", { page });
export const getPopular = (page = "1") => fetchTMDB("/movie/popular", { page });
export const getTopRated = (page = "1") => fetchTMDB("/movie/top_rated", { page });
export const getUpcoming = (page = "1") => fetchTMDB("/movie/upcoming", { page });
export const getByGenre = (genreId, page = "1") => fetchTMDB("/discover/movie", { with_genres: genreId, page, sort_by: "popularity.desc" });
export const searchMovies = (query, page = "1") => fetchTMDB("/search/movie", { query, page });
export const getMovieDetails = (id) => fetchTMDB(`/movie/${id}`, { append_to_response: "videos" });

export const GENRES = [
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
