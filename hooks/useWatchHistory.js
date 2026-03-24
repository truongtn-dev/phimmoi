import { useState, useEffect, useCallback } from 'react';
import { storageGet, storageSet } from '../utils/storage';

const KEY = '@watch_history';

export default function useWatchHistory() {
  const [history, setHistory] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    storageGet(KEY).then((v) => {
      setHistory(v || []);
      setIsLoaded(true);
    });
  }, []);

  // Persist history changes to storage
  useEffect(() => {
    if (history && history.length > 0) {
      storageSet(KEY, history);
    }
  }, [history]);

  const saveProgress = useCallback(
    async (movie, episodeName, progress, duration) => {
      const entry = {
        slug: movie.slug,
        name: movie.name,
        poster_url: movie.poster_url || movie.thumb_url,
        episode: episodeName,
        progress: progress || 0,
        duration: duration || 0,
        lastWatched: Date.now(),
      };
      
      setHistory((prev) => {
        const filtered = prev.filter((h) => h.slug !== movie.slug);
        const next = [entry, ...filtered].slice(0, 50);
        // Persist immediately in the background
        storageSet(KEY, next);
        return next;
      });
    },
    [],
  );

  const getProgress = useCallback(
    (slug) => history.find((h) => h.slug === slug),
    [history],
  );

  const removeProgress = useCallback(async (slug) => {
    setHistory((prev) => {
      const next = prev.filter((h) => h.slug !== slug);
      if (next.length === 0) storageSet(KEY, []); // Handle empty list
      return next;
    });
  }, []);

  const clearHistory = useCallback(async () => {
    setHistory([]);
    await storageSet(KEY, []);
  }, []);

  return { history, isLoaded, saveProgress, getProgress, removeProgress, clearHistory };
}
