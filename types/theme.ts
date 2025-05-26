export type ThemeType = 'light' | 'dark' | 'system';

type AccentColor = {
  id: string;
  label: string;
  color: string;
};

export const ACCENT_COLORS: AccentColor[] = [
  { id: 'blue', label: 'Blue', color: '#007AFF' },
  { id: 'purple', label: 'Purple', color: '#AF52DE' },
  { id: 'pink', label: 'Pink', color: '#FF2D55' },
  { id: 'red', label: 'Red', color: '#FF3B30' },
  { id: 'orange', label: 'Orange', color: '#FF9500' },
  { id: 'yellow', label: 'Yellow', color: '#FFCC00' },
  { id: 'green', label: 'Green', color: '#34C759' },
  { id: 'teal', label: 'Teal', color: '#5AC8FA' },
];

type DownloadOption = {
  id: string;
  label: string;
  getUrl: (downloadUrl: string) => string;
};

export const DOWNLOAD_OPTIONS: DownloadOption[] = [
  { 
    id: 'default', 
    label: 'Default (download)',
    getUrl: (url) => url
  },
  { 
    id: 'trollstore', 
    label: 'TrollStore',
    getUrl: (url) => `apple-magnifier://install?url=${encodeURIComponent(url)}`
  },
  { 
    id: 'sidestore', 
    label: 'SideStore',
    getUrl: (url) => `sidestore://source?url=${encodeURIComponent(url)}`
  },
  { 
    id: 'scarlet', 
    label: 'Scarlet',
    getUrl: (url) => `scarlet://install?url=${encodeURIComponent(url)}`
  },
  { 
    id: 'altstore', 
    label: 'AltStore',
    getUrl: (url) => `altstore://install?url=${encodeURIComponent(url)}`
  },
  { 
    id: 'tanarasign', 
    label: 'TanaraSign',
    getUrl: (url) => `opium://install=${encodeURIComponent(url)}`
  }
];

interface ThemeColors {
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