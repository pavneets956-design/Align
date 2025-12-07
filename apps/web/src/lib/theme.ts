/**
 * Theme management for ALIGN
 * Supports light (default) and dark themes
 */

export type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'align-theme';

/**
 * Get current theme from localStorage or default to light
 */
export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') {
    return stored;
  }
  
  return 'light';
}

/**
 * Set theme and update DOM
 */
export function setTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  
  const html = document.documentElement;
  if (theme === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
}

/**
 * Initialize theme on page load
 */
export function initTheme(): void {
  if (typeof window === 'undefined') return;
  
  const theme = getTheme();
  setTheme(theme);
}

/**
 * Toggle between light and dark
 */
export function toggleTheme(): Theme {
  const current = getTheme();
  const next = current === 'light' ? 'dark' : 'light';
  setTheme(next);
  return next;
}
