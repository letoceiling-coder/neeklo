import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove('light-mode', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark';
      
      if (systemTheme === 'light') {
        root.classList.add('light-mode');
      }
    } else if (theme === 'light') {
      root.classList.add('light-mode');
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  return { theme, setTheme };
}
