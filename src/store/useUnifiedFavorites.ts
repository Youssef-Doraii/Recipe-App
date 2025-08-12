import { useEffect } from "react";
import { useAuthStore } from "./authStore";
import { useFavorites as useDbFavorites } from "./useFavorites";
import { useGuestFavorites } from "./guestFavorites";
import type { Recipe } from "../types/recipe";

type UnifiedFavorites = {
  favorites: Recipe[];
  addFavorite: (recipe: Recipe) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
};

export function useUnifiedFavorites(): UnifiedFavorites {
  const { user } = useAuthStore();
  const db = useDbFavorites();
  const guest = useGuestFavorites();

  useEffect(() => {
    if (user && guest.favorites.length) {
      guest.clear();
      localStorage.removeItem("guest-favorites");
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      const handler = () => localStorage.removeItem("guest-favorites");
      window.addEventListener("beforeunload", handler);
      return () => window.removeEventListener("beforeunload", handler);
    }
  }, [user]);

  return user
    ? {
        favorites: db.favorites ?? [],
        addFavorite: db.addFavorite,
        removeFavorite: db.removeFavorite,
        isFavorite: db.isFavorite,
      }
    : {
        favorites: guest.favorites ?? [],
        addFavorite: guest.addFavorite,
        removeFavorite: guest.removeFavorite,
        isFavorite: guest.isFavorite,
      };
}
