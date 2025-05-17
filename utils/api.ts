import { Repository } from '../types/repository';

// Default repositories
export const DEFAULT_REPOSITORIES = [
  {
    name: 'SideStore Community',
    url: 'https://community-apps.sidestore.io/sidecommunity.json'
  }
];

/**
 * Fetches a repository from a URL
 * @param url The URL to fetch from
 */
export const fetchRepository = async (url: string): Promise<Repository> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch repository: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Add the URL to the repository object
    return { ...data, url };
  } catch (error) {
    console.error('Error fetching repository:', error);
    throw error;
  }
};

/**
 * Formats the file size in a human-readable format
 * @param bytes File size in bytes
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Formats date string to a readable format
 * @param dateString ISO date string
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};