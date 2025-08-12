import { useUnifiedFavorites } from "../store/useUnifiedFavorites";
import { Link } from "react-router-dom";

export default function Favorites() {
  const { favorites } = useUnifiedFavorites();
  const list = Array.isArray(favorites) ? favorites : [];

  return (
    <div className="recipes-container">
      <h1>Your Favorites</h1>
      <div className="recipes-grid">
        {list.length ? (
          list.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <Link to={`/recipe/${recipe.id}`}>
                <div className="image-wrapper">
                  {recipe.image_url ? (
                    <img src={recipe.image_url} alt={recipe.title} />
                  ) : null}
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
