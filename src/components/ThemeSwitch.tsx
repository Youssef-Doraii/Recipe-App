import React from "react";
import "./NavBar.css";

const ThemeSwitch: React.FC<{
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}> = ({ darkMode, setDarkMode }) => {
  const handleToggle = () => {
    setDarkMode(!darkMode);
    document.documentElement.setAttribute(
      "data-theme",
      !darkMode ? "dark" : "light"
    );
    localStorage.setItem("theme", !darkMode ? "dark" : "light");
  };

  return (
    <label className="theme-switch" tabIndex={0}>
      <input
        type="checkbox"
        checked={darkMode}
        onChange={handleToggle}
        aria-label="Toggle dark mode"
      />
      <span className="slider"></span>
    </label>
  );
};

export default ThemeSwitch;
