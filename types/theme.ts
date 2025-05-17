export type ThemeType = 'light' | 'dark' | 'system';

export interface ThemeColors {
  primary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
  secondaryText: string;
  tertiaryText: string;
  cardBackground: string;
  tint: string;
  tabBarBackground: string;
  tabBarInactive: string;
  searchBarBackground: string;
}

export interface Theme {
  dark: boolean;
  colors: ThemeColors;
}