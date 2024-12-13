import { useState, useEffect } from 'react';

type Theme = 'dark' | 'light';
type Font = 'JetBrains Mono' | 'Fira Code' | 'Source Code Pro';
type Background = 'gradient-dark' | 'gradient-light' | 'solid';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [font, setFont] = useState<Font>('JetBrains Mono');
  const [background, setBackground] = useState<Background>('gradient-dark');

  const toggleTheme = () => {
    setTheme(current => current === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    document.body.className = `bg-${background} font-${font.replace(' ', '-').toLowerCase()}`;
  }, [background, font]);

  return { theme, toggleTheme, font, setFont, background, setBackground };
}