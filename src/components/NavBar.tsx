import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { supabase } from "../supabase/supabaseClient";
import AuthModal from "./AuthModal";
import "./NavBar.css";

const NavBar: React.FC = () => {
  const { user, loading, fetchUser, logout, setUser } = useAuthStore();
  const location = useLocation();
  const [darkMode, setDarkMode] = React.useState(
    document.documentElement.getAttribute("data-theme") === "dark"
  );
  const [authOpen, setAuthOpen] = useState(false);

  React.useEffect(() => {
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

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      document.documentElement.setAttribute(
        "data-theme",
        newMode ? "dark" : "light"
      );
      return newMode;
    });
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
        <label className="theme-switch">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={toggleDarkMode}
            aria-label="Toggle dark mode"
          />
          <span className="slider"></span>
        </label>
        {loading ? (
          <span>Loading...</span>
        ) : user ? (
          <>
            <span>Welcome, {user.user_metadata?.name || user.email}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <button onClick={() => setAuthOpen(true)}>Sign In</button>
        )}
      </div>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </nav>
  );
};

export default NavBar;
