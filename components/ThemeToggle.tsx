'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-card-light dark:hover:bg-card-dark transition-colors duration-200"
      aria-label={theme === 'light' ? 'Включить темную тему' : 'Включить светлую тему'}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-muted-light" />
      ) : (
        <Sun className="w-5 h-5 text-muted-dark" />
      )}
    </button>
  );
}