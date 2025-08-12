import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchRecipeById } from "../services/recipeService";
import type { Recipe } from "../types/recipe";
import "./RecipePage.css";
import { useUnifiedFavorites } from "../store/useUnifiedFavorites";

export default function RecipePage() {
  const { id } = useParams();
  const {
    data: recipe,
    isLoading,
    error,
  } = useQuery<Recipe | null>({
    queryKey: ["recipe", id],
    queryFn: () => fetchRecipeById(id!),
    enabled: !!id,
  });
  const { addFavorite, removeFavorite, isFavorite } = useUnifiedFavorites();
  const favorite = isFavorite(recipe?.id?.toString() ?? "");

  if (isLoading) return <div className="loader"></div>;
  if (error || !recipe) return <div>Recipe not found.</div>;

  return (
    <div className="recipe-detail-container">
      <div className="recipe-header">
        <img
          src={recipe.image_url}
          alt={recipe.title}
          className="recipe-detail-img"
        />
        <h1 className="recipe-detail-title">{recipe.title}</h1>
        <button
          className={`favorite-btn${favorite ? " active" : ""}`}
          onClick={() =>
            favorite
              ? removeFavorite(recipe.id.toString())
              : addFavorite(recipe)
          }
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            stroke="currentColor"
            strokeWidth="2"
            fill={favorite ? "currentColor" : "none"}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
      <div className="recipe-detail-content">
        <section className="recipe-section">
          <h2>Ingredients</h2>
          <ul className="ingredients-list">
            {recipe.ingredients.map((ing, idx) => (
              <li key={idx}>
                <span className="ingredient-name">{ing.name}</span>
                {ing.quantity && (
                  <span className="ingredient-qty"> — {ing.quantity}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
        <section className="recipe-section">
          <h2>Instructions</h2>
          <p className="instructions">{recipe.description}</p>
        </section>
      </div>
    </div>
  );
}
