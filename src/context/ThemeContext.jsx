import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Load from localStorage or default to 'amphora'
    const savedTheme = localStorage.getItem('calculator-theme');
    return savedTheme || 'amphora';
  });

  useEffect(() => {
    // Save to localStorage whenever theme changes
    localStorage.setItem('calculator-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'amphora' ? 'premium' : 'amphora');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

