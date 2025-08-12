import React, { useRef } from "react";
import "./RandomRecipeButton.css";

type Recipe = {
  id: number | string;
  title: string;
  description: string;
  image_url?: string;
};

interface RandomRecipeButtonProps {
  recipes: Recipe[];
  setSearch: (value: string) => void;
}

const RandomRecipeButton: React.FC<RandomRecipeButtonProps> = ({
  recipes,
  setSearch,
}) => {
  const lastIndexRef = useRef<number | null>(null);

  if (!recipes || recipes.length === 0) {
    return null;
  }

  const handleClick = () => {
    let randomIndex: number;
    do {
      randomIndex = Math.floor(Math.random() * recipes.length);
    } while (recipes.length > 1 && randomIndex === lastIndexRef.current);
    lastIndexRef.current = randomIndex;
    setSearch("");
    setTimeout(() => {
      setSearch(recipes[randomIndex].title);
    }, 0);
  };

  return (
    <button className="random-recipe-btn" onClick={handleClick}>
      Surprise Me!
    </button>
  );
};

export default RandomRecipeButton;
