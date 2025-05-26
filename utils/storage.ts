import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_REPOSITORIES } from './api';

// Storage keys
const REPOSITORIES_KEY = '@altstore-browser:repositories';
const THEME_KEY = '@altstore-browser:theme';
const ACCENT_COLOR_KEY = '@altstore-browser:accent-color';
const DOWNLOAD_OPTION_KEY = '@altstore-browser:download-option';
const CUSTOM_SCHEME_KEY = '@altstore-browser:custom-scheme';

// Repository storage
export const getStoredRepositories = async (): Promise<{ name: string, url: string }[]> => {
  try {
    const data = await AsyncStorage.getItem(REPOSITORIES_KEY);
    
    if (!data) {
      // If no repositories are stored, return the default ones
      await AsyncStorage.setItem(REPOSITORIES_KEY, JSON.stringify(DEFAULT_REPOSITORIES));
      return DEFAULT_REPOSITORIES;
    }
    
    return JSON.parse(data);
  } catch (error) {
    console.error('Error getting stored repositories:', error);
    return DEFAULT_REPOSITORIES;
  }
};

export const addRepository = async (name: string, url: string): Promise<void> => {
  try {
    const repositories = await getStoredRepositories();
    
    // Check if the repository already exists
    if (repositories.find(repo => repo.url === url)) {
      return;
    }
    
    repositories.push({ name, url });
    await AsyncStorage.setItem(REPOSITORIES_KEY, JSON.stringify(repositories));
  } catch (error) {
    console.error('Error adding repository:', error);
    throw error;
  }
};

export const removeRepository = async (url: string): Promise<void> => {
  try {
    const repositories = await getStoredRepositories();
    const updatedRepositories = repositories.filter(repo => repo.url !== url);
    await AsyncStorage.setItem(REPOSITORIES_KEY, JSON.stringify(updatedRepositories));
  } catch (error) {
    console.error('Error removing repository:', error);
    throw error;
  }
};

// Theme storage
export const getStoredTheme = async () => {
  try {
    const theme = await AsyncStorage.getItem(THEME_KEY);
    return theme || 'system';
  } catch (error) {
    console.error('Error getting stored theme:', error);
    return 'system';
  }
};

export const setStoredTheme = async (theme: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.error('Error setting stored theme:', error);
    throw error;
  }
};

// Accent color storage
export const getStoredAccentColor = async (): Promise<string> => {
  try {
    const color = await AsyncStorage.getItem(ACCENT_COLOR_KEY);
    return color || '#007AFF'; // Default blue
  } catch (error) {
    console.error('Error getting stored accent color:', error);
    return '#007AFF';
  }
};

export const setStoredAccentColor = async (color: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(ACCENT_COLOR_KEY, color);
  } catch (error) {
    console.error('Error setting stored accent color:', error);
    throw error;
  }
};

// Download option storage
export const getStoredDownloadOption = async (): Promise<string> => {
  try {
    const option = await AsyncStorage.getItem(DOWNLOAD_OPTION_KEY);
    return option || 'default';
  } catch (error) {
    console.error('Error getting stored download option:', error);
    return 'default';
  }
};

export const setStoredDownloadOption = async (option: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(DOWNLOAD_OPTION_KEY, option);
  } catch (error) {
    console.error('Error setting stored download option:', error);
    throw error;
  }
};

// Custom Scheme storage
export const getStoredCustomScheme = async (): Promise<string> => {
  try {
    const scheme = await AsyncStorage.getItem(CUSTOM_SCHEME_KEY);
    return scheme || '';
  } catch (error) {
    console.error('Error getting stored custom scheme:', error);
    return '';
  }
};

export const setStoredCustomScheme = async (scheme: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(CUSTOM_SCHEME_KEY, scheme);
  } catch (error) {
    console.error('Error setting stored custom scheme:', error);
    throw error;
  }
};