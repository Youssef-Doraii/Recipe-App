import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Recipe } from "../types/recipe";

type GuestFavoritesState = {
  favorites: Recipe[];
  addFavorite: (recipe: Recipe) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clear: () => void;
};

export const useGuestFavorites = create<GuestFavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (recipe) =>
        set((state) =>
          state.favorites.some((fav) => String(fav.id) === String(recipe.id))
            ? state
            : { favorites: [...state.favorites, recipe] }
        ),
      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((fav) => String(fav.id) !== id),
        })),
      isFavorite: (id) => get().favorites.some((fav) => String(fav.id) === id),
      clear: () => set({ favorites: [] }),
    }),
    {
      name: "guest-favorites",
    }
  )
);
