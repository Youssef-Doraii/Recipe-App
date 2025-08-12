import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { supabase } from "../supabase/supabaseClient";
import AuthModal from "./AuthModal";
import ThemeSwitch from "./ThemeSwitch";
import "./NavBar.css";
import { FaBars, FaTimes } from "react-icons/fa";

const NavBar: React.FC = () => {
  const { user, fetchUser, logout, setUser } = useAuthStore();
  const location = useLocation();
  const [darkMode, setDarkMode] = React.useState(
    localStorage.getItem("theme") === "dark" ||
      document.documentElement.getAttribute("data-theme") === "dark"
  );
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLButtonElement>(null);

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

  // Close menu on navigation
  React.useEffect(() => {
    setMenuOpen(false);
    closeDropdown();
  }, [location.pathname]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && dropdownOpen) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen]);

  const closeDropdown = () => {
    if (!dropdownOpen) return;

    setIsClosing(true);
    setTimeout(() => {
      setDropdownOpen(false);
      setIsClosing(false);
    }, 200); // Match this with animation duration
  };

  // Get avatar URL from user metadata if available
  const avatarUrl = user?.user_metadata?.avatar_url || null;
  // Get initials for fallback avatar
  const getInitials = () => {
    if (!user) return "";
    const name = user.user_metadata?.display_name || user.email || "";
    return name
      .split(" ")
      .map((n: string) => n[0]?.toUpperCase() || "")
      .join("")
      .slice(0, 2);
  };

  // Get the user's name from user metadata
  const userName =
    user?.user_metadata?.display_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    "there";

  return (
    <nav style={{ position: "relative" }}>
      <button
        className="hamburger"
        aria-label="Open menu"
        onClick={() => setMenuOpen((v) => !v)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>
      {user && (
        <div className="welcome-message">
          Hi {userName}, ready to discover something delicious?
        </div>
      )}
      <div className={`nav-links${menuOpen ? " open" : ""}`}>
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
          {user ? (
            <div className="profile-dropdown-container" ref={dropdownRef}>
              <button
                className="avatar-button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="User menu"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                ref={avatarRef}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="User avatar"
                    className="user-avatar"
                  />
                ) : (
                  <div className="avatar-initials">{getInitials()}</div>
                )}
              </button>
              {dropdownOpen && (
                <div
                  className={`dropdown-menu ${
                    isClosing ? "dropdown-closing" : ""
                  }`}
                >
                  <Link to="/profile" onClick={closeDropdown}>
                    Profile
                  </Link>
                  <div className="dropdown-item theme-item">
                    <span>Theme</span>
                    <ThemeSwitch
                      darkMode={darkMode}
                      setDarkMode={setDarkMode}
                    />
                  </div>
                  <button
                    onClick={() => {
                      closeDropdown();
                      logout();
                    }}
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
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
