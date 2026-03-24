import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storageGet, storageSet } from '../utils/storage';

const KEY = '@comments';
const CommentsContext = createContext(undefined);

export const CommentsProvider = ({ children }) => {
  const [allComments, setAllComments] = useState({});

  useEffect(() => {
    storageGet(KEY).then((v) => setAllComments(v || {}));
  }, []);

  const getComments = useCallback(
    (slug) => allComments[slug] || [],
    [allComments],
  );

  const addComment = useCallback(
    async (slug, text, userEmail) => {
      const comment = {
        id: Date.now().toString(),
        text,
        user: userEmail || 'Ẩn danh',
        createdAt: new Date().toISOString(),
      };
      const updated = { ...allComments, [slug]: [comment, ...(allComments[slug] || [])] };
      setAllComments(updated);
      await storageSet(KEY, updated);
    },
    [allComments],
  );

  const deleteComment = useCallback(
    async (slug, commentId) => {
      const filtered = (allComments[slug] || []).filter((c) => c.id !== commentId);
      const updated = { ...allComments, [slug]: filtered };
      setAllComments(updated);
      await storageSet(KEY, updated);
    },
    [allComments],
  );

  const totalComments = Object.values(allComments).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <CommentsContext.Provider value={{ getComments, addComment, deleteComment, totalComments, allComments }}>
      {children}
    </CommentsContext.Provider>
  );
};

export const useCommentsContext = () => {
  const ctx = useContext(CommentsContext);
  if (!ctx) throw new Error('useCommentsContext must be used within CommentsProvider');
  return ctx;
};
