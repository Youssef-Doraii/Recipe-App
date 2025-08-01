import { useQuery } from "@tanstack/react-query";
import { fetchRecipes } from "../services/recipeService";
import type { Recipe } from "../types/recipe";
import { Link } from "react-router-dom";
import React, { useState } from "react";
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

  const [search, setSearch] = useState("");

  // Filter recipes by name or ingredient
  const filteredRecipes = recipes?.filter((recipe) => {
    const query = search.toLowerCase();
    return (
      recipe.title.toLowerCase().includes(query) ||
      recipe.ingredients.some((ing) => ing.name.toLowerCase().includes(query))
    );
  });

  if (isLoading) return <div className="loader"></div>;
  if (error) return <div>Error loading recipes.</div>;

  return (
    <div className="recipes-container">
      <h1>All Recipes</h1>
      <input
        className="search-bar"
        type="text"
        placeholder="Search by name or ingredient..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          marginBottom: "1.5rem",
          width: "100%",
          padding: "0.7rem",
          fontSize: "1rem",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />
      <div className="recipes-grid">
        {filteredRecipes?.length ? (
          filteredRecipes.map((recipe) => (
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
          ))
        ) : (
          <div>No recipes found.</div>
        )}
      </div>
    </div>
  );
}
