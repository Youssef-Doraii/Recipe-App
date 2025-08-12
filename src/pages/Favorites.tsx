import { useFavorites } from "../store/useFavorites";
import { Link } from "react-router-dom";

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div className="recipes-container">
      <h1>Your Favorites</h1>
      <div className="recipes-grid">
        {favorites.length ? (
          favorites.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <Link to={`/recipe/${recipe.id}`}>
                <div className="image-wrapper">
                  <img src={recipe.image_url} alt={recipe.title} />
                </div>
                <h2>{recipe.title}</h2>
              </Link>
            </div>
          ))
        ) : (
          <div>No favorite recipes yet.</div>
        )}
      </div>
    </div>
  );
}
