import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

/**
 * Theme Provider - Manages dark/light mode with localStorage persistence
 */
export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('taskmanager-theme');
    if (saved) {
      return saved === 'dark';
    }
    // Default to light mode
    return false;
  });

  useEffect(() => {
    // Update document class and localStorage
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('taskmanager-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('taskmanager-theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme context
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
