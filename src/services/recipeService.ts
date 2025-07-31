import type { Recipe } from "../types/recipe";

export async function fetchRecipes(): Promise<Recipe[]> {
  const letters = "abcdefghijklmnopqrstuvwxyz".split("");
  const allMeals: Recipe[] = [];

  await Promise.all(
    letters.map(async (letter) => {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
      );
      const data = await res.json();
      if (data.meals) {
        allMeals.push(
          ...data.meals.map((meal: any) => ({
            id: Number(meal.idMeal),
            title: meal.strMeal,
            description: meal.strInstructions,
            image_url: meal.strMealThumb,
            ingredients: Array.from({ length: 20 })
              .map((_, i) => ({
                id: i + 1,
                name: meal[`strIngredient${i + 1}`],
                quantity: meal[`strMeasure${i + 1}`],
              }))
              .filter((ing) => ing.name && ing.name.trim() !== ""),
          }))
        );
      }
    })
  );

  return allMeals;
}

export async function fetchRecipeById(id: string): Promise<Recipe | null> {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const data = await res.json();
  const meal = data.meals?.[0];
  if (!meal) return null;
  return {
    id: Number(meal.idMeal),
    title: meal.strMeal,
    description: meal.strInstructions,
    image_url: meal.strMealThumb,
    ingredients: Array.from({ length: 20 })
      .map((_, i) => ({
        id: i + 1,
        name: meal[`strIngredient${i + 1}`],
        quantity: meal[`strMeasure${i + 1}`],
      }))
      .filter((ing) => ing.name && ing.name.trim() !== ""),
  };
}
