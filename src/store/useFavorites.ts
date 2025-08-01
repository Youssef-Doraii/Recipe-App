import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Recipe } from "../types/recipe";

type FavoritesState = {
  favorites: Recipe[];
  addFavorite: (recipe: Recipe) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
};

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (recipe) =>
        set((state) =>
          state.favorites.some((fav) => fav.id === recipe.id)
            ? state
            : { favorites: [...state.favorites, recipe] }
        ),
      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((fav) => String(fav.id) !== id),
        })),
      isFavorite: (id) => get().favorites.some((fav) => String(fav.id) === id),
    }),
    {
      name: "favorites-storage", // localStorage key
    }
  )
);
