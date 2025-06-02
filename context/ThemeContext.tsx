import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Theme, ThemeType } from '../types/theme';
import { getStoredTheme, setStoredTheme, getStoredAccentColor, setStoredAccentColor } from '../utils/storage';
import { darkTheme, lightTheme, oledTheme } from '../utils/themes';

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

// Helper function to validate and cast theme type
const validateThemeType = (value: string): ThemeType => {
  const validThemes: ThemeType[] = ['light', 'dark', 'oled', 'system'];
  return validThemes.includes(value as ThemeType) ? (value as ThemeType) : 'system';
};

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
      
      // Validate and set the theme type
      setThemeType(validateThemeType(savedTheme));
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

  const getBaseTheme = () => {
    switch (themeType) {
      case 'light':
        return lightTheme;
      case 'dark':
        return darkTheme;
      case 'oled':
        return oledTheme;
      case 'system':
      default:
        return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    }
  };

  const baseTheme = getBaseTheme();

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