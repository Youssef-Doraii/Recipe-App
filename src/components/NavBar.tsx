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

  // Get display name or fallback to email
  const displayName = user?.user_metadata?.display_name || user?.email || "";

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
        <div className="user-info">
          {user ? (
            <>
              <span>Welcome, {displayName}</span>
              <button onClick={logout}>Log Out</button>
            </>
          ) : (
            <button onClick={() => setAuthOpen(true)}>Sign In</button>
          )}
        </div>
      </div>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </nav>
  );
};

export default NavBar;
