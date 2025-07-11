import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';

export type ThemeType = 'light' | 'dark';

const lightTheme = {
  background: '#fff',
  text: '#22223b',
  accent: '#6366f1',
  green: '#22c55e',
  inputBg: '#f8faff',
  inputBorder: '#ccc',
  buttonBg: '#22c55e',
  buttonText: '#fff',
  card: '#e0e7ff',
  delete: '#ef4444',
  progressBg: '#e0e7ff',
  progressFill: '#6366f1',
  gray: '#999',
  categoryBg: '#e0e7ff',
  categorySelected: '#6366f1',
  categoryText: '#22223b',
  categoryTextSelected: '#fff',
  subtitle:"#22223b"
};
const darkTheme = {
  background: '#181926',
  text: '#f4f4f4',
  accent: '#a5b4fc',
  green: '#4ade80',
  inputBg: '#232946',
  inputBorder: '#232946',
  buttonBg: '#4ade80',
  buttonText: '#232946',
  card: '#232946',
  delete: '#f87171',
  progressBg: '#232946',
  progressFill: '#a5b4fc',
  gray: '#999',
  categoryBg: '#232946',
  categorySelected: '#6366f1',
  categoryText: '#f4f4f4',
  categoryTextSelected: '#fff',
  subtitle:"#f4f4f4"
};

interface ThemeContextType {
  theme: ThemeType;
  themeObj: typeof lightTheme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used within ThemeProvider');
  return ctx;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemTheme = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
  const [theme, setTheme] = useState<ThemeType>(systemTheme);

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme === 'dark' ? 'dark' : 'light');
    });
    return () => listener.remove();
  }, []);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  const themeObj = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, themeObj, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 