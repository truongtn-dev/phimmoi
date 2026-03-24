import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storageGet, storageSet } from '../utils/storage';

const KEY = '@favorites';
const FavoritesContext = createContext(undefined);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    storageGet(KEY).then((v) => setFavorites(v || []));
  }, []);

  const isFavorite = useCallback(
    (slug) => favorites.some((f) => f.slug === slug),
    [favorites],
  );

  const toggleFavorite = useCallback(
    async (movie) => {
      let next;
      if (favorites.some((f) => f.slug === movie.slug)) {
        next = favorites.filter((f) => f.slug !== movie.slug);
      } else {
        next = [
          { slug: movie.slug, name: movie.name, poster_url: movie.poster_url, origin_name: movie.origin_name, year: movie.year },
          ...favorites,
        ];
      }
      setFavorites(next);
      await storageSet(KEY, next);
    },
    [favorites],
  );

  const removeFavorite = useCallback(
    async (slug) => {
      const next = favorites.filter((f) => f.slug !== slug);
      setFavorites(next);
      await storageSet(KEY, next);
    },
    [favorites],
  );

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavoritesContext = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavoritesContext must be used within FavoritesProvider');
  return ctx;
};
