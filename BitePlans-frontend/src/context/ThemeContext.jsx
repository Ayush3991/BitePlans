import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context for theme
const ThemeContext = createContext();

// Custom hook to access the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return context;
};

// ThemeProvider component to wrap the app
export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  // Runs once on mount - checks saved theme or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) setIsDark(true);
    }
  }, []);

  // Whenever theme changes, update <html> class and save it
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Toggle function to switch between dark and light
  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
