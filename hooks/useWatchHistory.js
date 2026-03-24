import { useState, useEffect, useCallback } from 'react';
import { storageGet, storageSet } from '../utils/storage';

const KEY = '@watch_history';

export default function useWatchHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    storageGet(KEY).then((v) => setHistory(v || []));
  }, []);

  const saveProgress = useCallback(
    async (movie, episodeName, progress) => {
      const entry = {
        slug: movie.slug,
        name: movie.name,
        poster_url: movie.poster_url,
        episode: episodeName,
        progress,
        updatedAt: Date.now(),
      };
      const filtered = (history || []).filter((h) => h.slug !== movie.slug);
      const next = [entry, ...filtered].slice(0, 50);
      setHistory(next);
      await storageSet(KEY, next);
    },
    [history],
  );

  const getProgress = useCallback(
    (slug) => (history || []).find((h) => h.slug === slug),
    [history],
  );

  const clearHistory = useCallback(async () => {
    setHistory([]);
    await storageSet(KEY, []);
  }, []);

  return { history, saveProgress, getProgress, clearHistory };
}
