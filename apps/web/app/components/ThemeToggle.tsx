'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { getTheme, toggleTheme } from '@/src/lib/theme';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setTheme(getTheme());
  }, []);

  const handleToggle = () => {
    const newTheme = toggleTheme();
    setTheme(newTheme);
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
      ) : (
        <Sun className="w-5 h-5 text-slate-700 dark:text-slate-300" />
      )}
    </button>
  );
}

