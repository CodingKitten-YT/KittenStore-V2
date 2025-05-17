import React, { createContext, useContext, useState, useEffect } from 'react';
import { Repository } from '../types/repository';
import { fetchRepository } from '../utils/api';
import { getStoredRepositories, addRepository as addStoredRepository, removeRepository as removeStoredRepository } from '../utils/storage';

interface RepositoryContextType {
  repositories: Repository[];
  loading: boolean;
  error: string | null;
  refreshRepositories: () => Promise<void>;
  addRepository: (name: string, url: string) => Promise<void>;
  removeRepository: (url: string) => Promise<void>;
}

const RepositoryContext = createContext<RepositoryContextType>({
  repositories: [],
  loading: false,
  error: null,
  refreshRepositories: async () => {},
  addRepository: async () => {},
  removeRepository: async () => {}
});

export const useRepositoryContext = () => useContext(RepositoryContext);

export const RepositoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadRepositories = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const storedRepos = await getStoredRepositories();
      const loadedRepos: Repository[] = [];
      
      for (const repo of storedRepos) {
        try {
          const repoData = await fetchRepository(repo.url);
          loadedRepos.push(repoData);
        } catch (error) {
          console.error(`Error loading repository ${repo.url}:`, error);
          // Continue loading other repositories even if one fails
        }
      }
      
      setRepositories(loadedRepos);
    } catch (error) {
      console.error('Error loading repositories:', error);
      setError('Failed to load repositories. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRepositories();
  }, []);

  const refreshRepositories = async () => {
    await loadRepositories();
  };

  const addRepository = async (name: string, url: string) => {
    try {
      // First, check if the URL is a valid repository
      const newRepo = await fetchRepository(url);
      
      // Add to storage
      await addStoredRepository(name || newRepo.name, url);
      
      // Add to state
      setRepositories([...repositories, newRepo]);
    } catch (error) {
      console.error('Error adding repository:', error);
      throw new Error('Invalid repository URL. Please check the URL and try again.');
    }
  };

  const removeRepository = async (url: string) => {
    try {
      // Remove from storage
      await removeStoredRepository(url);
      
      // Remove from state
      setRepositories(repositories.filter(repo => repo.url !== url));
    } catch (error) {
      console.error('Error removing repository:', error);
      throw error;
    }
  };

  return (
    <RepositoryContext.Provider
      value={{
        repositories,
        loading,
        error,
        refreshRepositories,
        addRepository,
        removeRepository
      }}
    >
      {children}
    </RepositoryContext.Provider>
  );
};