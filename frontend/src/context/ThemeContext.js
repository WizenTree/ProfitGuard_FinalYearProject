import React, { createContext, useContext, useState, useEffect } from "react";
import { themes } from "../styles/themeConfig";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Default to 'classic' as requested
  const [themeMode, setThemeMode] = useState(localStorage.getItem("appTheme") || "classic");
  const [activeTheme, setActiveTheme] = useState(themes.classic);

  useEffect(() => {
    localStorage.setItem("appTheme", themeMode);

    if (themeMode === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setActiveTheme(prefersDark ? themes.dark : themes.light);

      // Listen for system changes
      const listener = (e) => setActiveTheme(e.matches ? themes.dark : themes.light);
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", listener);
      return () => window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", listener);
    } else {
      setActiveTheme(themes[themeMode]);
    }
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, theme: activeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};