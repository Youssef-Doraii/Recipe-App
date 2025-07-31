export interface Ingredient {
  id: number;
  name: string;
  quantity: string;
}

export interface Recipe {
  id: number;
  title: string;
  description: string;
  ingredients: Ingredient[];
  image_url?: string;
}
