import AsyncStorage from '@react-native-async-storage/async-storage';
import { Repository } from '../types/repository';
import { ThemeType } from '../types/theme';
import { DEFAULT_REPOSITORIES } from './api';

// Storage keys
const REPOSITORIES_KEY = '@altstore-browser:repositories';
const THEME_KEY = '@altstore-browser:theme';

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
export const getStoredTheme = async (): Promise<ThemeType> => {
  try {
    const theme = await AsyncStorage.getItem(THEME_KEY);
    return (theme as ThemeType) || 'system';
  } catch (error) {
    console.error('Error getting stored theme:', error);
    return 'system';
  }
};

export const setStoredTheme = async (theme: ThemeType): Promise<void> => {
  try {
    await AsyncStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.error('Error setting stored theme:', error);
    throw error;
  }
};