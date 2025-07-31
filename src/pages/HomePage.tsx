import { useQuery } from "@tanstack/react-query";
import { fetchRecipes } from "../services/recipeService";
import type { Recipe } from "../types/recipe";
import { Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  const {
    data: recipes,
    isLoading,
    error,
  } = useQuery<Recipe[]>({
    queryKey: ["recipes"],
    queryFn: fetchRecipes,
  });

  if (isLoading) return <div className="loader"></div>;
  if (error) return <div>Error loading recipes.</div>;

  return (
    <div className="recipes-container">
      <h1>All Recipes</h1>
      <div className="recipes-grid">
        {recipes?.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <Link to={`/recipe/${recipe.id}`}>
              <div className="image-wrapper">
                <img src={recipe.image_url} alt={recipe.title} />
              </div>
              <h2>{recipe.title}</h2>
              <ul className="card-ingredients-list">
                {recipe.ingredients.slice(0, 4).map((ing, idx) => (
                  <li key={idx} className="card-ingredient">
                    {ing.name}
                  </li>
                ))}
                {recipe.ingredients.length > 4 && (
                  <li className="card-ingredient">...</li>
                )}
              </ul>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
