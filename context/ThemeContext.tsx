import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Theme, ThemeType } from '../types/theme';
import { getStoredTheme, setStoredTheme } from '../utils/storage';
import { darkTheme, lightTheme } from '../utils/themes';

interface ThemeContextType {
  theme: Theme;
  themeType: ThemeType;
  setThemeType: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  themeType: 'system',
  setThemeType: () => {}
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeType, setThemeType] = useState<ThemeType>('system');

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await getStoredTheme();
      setThemeType(savedTheme);
    };
    
    loadTheme();
  }, []);

  const handleSetThemeType = async (newTheme: ThemeType) => {
    setThemeType(newTheme);
    await setStoredTheme(newTheme);
  };

  const theme = themeType === 'system'
    ? systemColorScheme === 'dark' ? darkTheme : lightTheme
    : themeType === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeType,
        setThemeType: handleSetThemeType
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};