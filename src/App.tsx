import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabase/supabaseClient";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import RecipePage from "./pages/RecipePage";
import FavoritesPage from "./pages/FavoritePage";
import { useAuthStore } from "./store/authStore";

function App() {
  const { user: authStoreUser } = useAuthStore();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event: string, session: any) => {
        console.log("Auth event:", _event, session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipe/:id" element={<RecipePage />} />
        <Route
          path="/favorites"
          element={authStoreUser ? <FavoritesPage /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
