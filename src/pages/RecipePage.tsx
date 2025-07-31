import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchRecipeById } from "../services/recipeService";
import type { Recipe } from "../types/recipe";
import "./RecipePage.css";

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
