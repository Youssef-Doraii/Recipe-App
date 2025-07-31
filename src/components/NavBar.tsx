import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { supabase } from "../supabase/supabaseClient";
import "./NavBar.css";

const NavBar: React.FC = () => {
  const { user, loading, fetchUser, logout, setUser } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    fetchUser();
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [fetchUser, setUser]);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  return (
    <nav>
      <Link to="/" className={location.pathname === "/" ? "active" : ""}>
        Home
      </Link>
      <Link
        to="/favorites"
        className={location.pathname === "/favorites" ? "active" : ""}
      >
        Favorites
      </Link>
      <div className="nav-right">
        {loading ? (
          <span>Loading...</span>
        ) : user ? (
          <>
            <span>Welcome, {user.user_metadata?.name || user.email}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <button onClick={handleLogin}>Login with Google</button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
