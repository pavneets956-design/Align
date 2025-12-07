'use client';

import { useEffect } from 'react';
import { initTheme } from '@/src/lib/theme';

/**
 * Client component that initializes theme on mount
 * Must be used in a client component tree
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initTheme();
  }, []);

  return <>{children}</>;
}

