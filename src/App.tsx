import { useEffect, useState } from "react";
import { supabase } from "./supabase/client";

function App() {
  const [recipes, setRecipes] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("recipes").select("*");
      if (error) {
        console.error("Supabase error:", error);
      } else {
        setRecipes(data || []);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Recipes</h1>
      {recipes.length === 0 && <p>No recipes found</p>}
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            ID: {recipe.id}, Created At: {recipe.created_at}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
