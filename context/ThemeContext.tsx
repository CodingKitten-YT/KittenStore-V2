import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Theme, ThemeType } from '../types/theme';
import { getStoredTheme, setStoredTheme, getStoredAccentColor, setStoredAccentColor } from '../utils/storage';
import { darkTheme, lightTheme } from '../utils/themes';

interface ThemeContextType {
  theme: Theme;
  themeType: ThemeType;
  accentColor: string;
  setThemeType: (theme: ThemeType) => void;
  setAccentColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  themeType: 'system',
  accentColor: '#007AFF',
  setThemeType: () => {},
  setAccentColor: () => {}
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeType, setThemeType] = useState<ThemeType>('system');
  const [accentColor, setAccentColor] = useState('#007AFF');

  useEffect(() => {
    const loadSettings = async () => {
      const [savedTheme, savedColor] = await Promise.all([
        getStoredTheme(),
        getStoredAccentColor()
      ]);
      setThemeType(savedTheme);
      setAccentColor(savedColor);
    };
    
    loadSettings();
  }, []);

  const handleSetThemeType = async (newTheme: ThemeType) => {
    setThemeType(newTheme);
    await setStoredTheme(newTheme);
  };

  const handleSetAccentColor = async (newColor: string) => {
    setAccentColor(newColor);
    await setStoredAccentColor(newColor);
  };

  const baseTheme = themeType === 'system'
    ? systemColorScheme === 'dark' ? darkTheme : lightTheme
    : themeType === 'dark' ? darkTheme : lightTheme;

  const theme: Theme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: accentColor,
      tint: accentColor
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeType,
        accentColor,
        setThemeType: handleSetThemeType,
        setAccentColor: handleSetAccentColor
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};