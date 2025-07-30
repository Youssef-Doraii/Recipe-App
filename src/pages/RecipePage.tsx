import { useParams } from "react-router-dom";

export default function RecipePage() {
  const { id } = useParams();
  return <h1>Recipe Details for Recipe ID: {id}</h1>;
}
