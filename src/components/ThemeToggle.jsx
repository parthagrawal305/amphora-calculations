import React from 'react';
import { Palette } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
        theme === 'apple'
          ? 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 hover:shadow-xl'
          : 'bg-purple-600 hover:bg-purple-700 text-white hover:shadow-xl hover:scale-105'
      }`}
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'amphora' ? 'Apple' : 'Amphora'} theme`}
    >
      <Palette className="w-5 h-5" />
    </button>
  );
};

export default ThemeToggle;

