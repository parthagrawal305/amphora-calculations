import React from 'react';
import { Palette } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center touch-manipulation ${
        theme === 'premium'
          ? 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 hover:from-purple-700 hover:via-pink-600 hover:to-orange-600 text-white hover:shadow-2xl hover:scale-110 active:scale-95'
          : 'bg-purple-600 hover:bg-purple-700 text-white hover:shadow-xl hover:scale-105 active:scale-95'
      }`}
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'amphora' ? 'Premium' : 'Amphora'} theme`}
    >
      <Palette className="w-4 h-4 sm:w-5 sm:h-5" />
    </button>
  );
};

export default ThemeToggle;

