import React, { createContext, useContext, useState } from "react";
import { themes } from "./theme";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState("dark"); // Koyu tema ile başla

  const theme = themes[currentTheme] || themes.dark;

  const setTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      // Local storage'a kaydet
      localStorage.setItem("selectedTheme", themeName);
    }
  };

  // Sayfa yüklendiğinde kaydedilmiş temayı kontrol et
  React.useEffect(() => {
    const savedTheme = localStorage.getItem("selectedTheme");
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  const value = {
    theme: {
      ...theme,
      name: currentTheme
    },
    currentTheme,
    setTheme,
    availableThemes: Object.keys(themes).map((key) => ({
      id: key,
      name: themes[key].name,
    })),
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
