import { useState, useEffect } from "react";

const STORAGE_KEY = "favorite-matches";

export const useFavoriteMatches = () => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (matchId: string) =>
    setFavorites((prev) =>
      prev.includes(matchId)
        ? prev.filter((id) => id !== matchId)
        : [...prev, matchId],
    );

  const isFavorite = (matchId: string) => favorites.includes(matchId);

  return { favorites, toggleFavorite, isFavorite };
};
