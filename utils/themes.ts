import { Platform, useColorScheme } from 'react-native';
import { Theme, ThemeType } from '../types/theme';

// Light theme
export const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: '#007AFF',
    background: '#F2F2F7',
    card: '#FFFFFF',
    text: '#000000',
    border: '#C6C6C8',
    notification: '#FF3B30',
    secondaryText: '#6C6C70',
    tertiaryText: '#8E8E93',
    cardBackground: '#FFFFFF',
    tint: '#007AFF',
    tabBarBackground: '#FFFFFF',
    tabBarInactive: '#8E8E93',
    searchBarBackground: '#E5E5EA'
  }
};

// Dark theme
export const darkTheme: Theme = {
  dark: true,
  colors: {
    primary: '#0A84FF',
    background: '#000000',
    card: '#1C1C1E',
    text: '#FFFFFF',
    border: '#38383A',
    notification: '#FF453A',
    secondaryText: '#8E8E93',
    tertiaryText: '#636366',
    cardBackground: '#1C1C1E',
    tint: '#0A84FF',
    tabBarBackground: '#1C1C1E',
    tabBarInactive: '#8E8E93',
    searchBarBackground: '#1C1C1E'
  }
};

export const oledTheme: Theme = {
  dark: true,
  colors: {
    primary: '#007AFF',
    background: '#000000',
    card: '#000000',
    text: '#FFFFFF',
    border: '#1C1C1E',
    notification: '#FF453A',
    secondaryText: '#8E8E93',
    tertiaryText: '#48484A',
    cardBackground: '#000000',
    tint: '#007AFF',
    tabBarBackground: '#000000',
    tabBarInactive: '#8E8E93',
    searchBarBackground: '#1C1C1E',
  },
};

// Use theme based on preference
const useTheme = (themePreference: ThemeType): Theme => {
  const systemTheme = useColorScheme();
  
  if (themePreference === 'system') {
    return systemTheme === 'dark' ? darkTheme : lightTheme;
  }
  
  return themePreference === 'dark' ? darkTheme : lightTheme;
};

// Common iOS styles
const shadowStyle = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2
  },
  android: {
    elevation: 2
  },
  default: {}
});