import React, { createContext, useContext, useState, useLayoutEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme-preference');
    if (saved) return saved === 'dark';
    return true; // dark by default
  });

  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem('theme-preference', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  useLayoutEffect(() => {
    if (isAdmin) {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }
  }, [isDark, isAdmin]);

  return (
    <ThemeContext.Provider value={{ isDark: isAdmin ? false : isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
