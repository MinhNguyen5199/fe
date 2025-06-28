// src/app/components/ui/ThemeProvider.tsx
'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [hasMounted, setHasMounted] = useState(false);

  // This effect runs once on the client after the component mounts.
  useEffect(() => {
    setHasMounted(true); // Signal that the component has mounted.

    const savedTheme = localStorage.getItem('theme');
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    let initialMode = false;
    if (savedTheme) {
      initialMode = savedTheme === 'dark';
    } else {
      initialMode = prefersDarkMode;
    }
    
    setIsDarkMode(initialMode);
    
  }, []);

  // This effect runs whenever isDarkMode changes, but only after mounting.
  useEffect(() => {
    if (hasMounted) {
      const html = document.documentElement;
      if (isDarkMode) {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  }, [isDarkMode, hasMounted]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Crucially, we don't render the children until the component has mounted on the client.
  // This ensures the server and initial client render are identical.
  if (!hasMounted) {
    return null; // Or you could return a loading spinner if you prefer.
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};