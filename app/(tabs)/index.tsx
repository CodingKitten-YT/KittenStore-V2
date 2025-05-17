import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  SectionList,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useThemeContext } from '@/context/ThemeContext';
import { useRepositoryContext } from '@/context/RepositoryContext';
import { SearchBar } from '@/components/ui/SearchBar';
import { AppCard } from '@/components/ui/AppCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { App, Repository } from '@/types/repository';
import { RefreshCw } from 'lucide-react-native';

export default function HomeScreen() {
  const { theme } = useThemeContext();
  const { repositories, loading, error, refreshRepositories } = useRepositoryContext();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  // Filter apps based on search query
  const filteredApps = React.useMemo(() => {
    if (!searchQuery) return [];
    
    const query = searchQuery.toLowerCase();
    const apps: {app: App, repo: Repository}[] = [];
    
    repositories.forEach(repo => {
      repo.apps.forEach(app => {
        if (
          app.name.toLowerCase().includes(query) ||
          app.developerName.toLowerCase().includes(query) ||
          app.subtitle.toLowerCase().includes(query) ||
          app.localizedDescription.toLowerCase().includes(query)
        ) {
          apps.push({app, repo});
        }
      });
    });
    
    return apps;
  }, [repositories, searchQuery]);
  
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshRepositories();
    setRefreshing(false);
  }, [refreshRepositories]);
  
  // Create sections for section list
  const sections = React.useMemo(() => {
    if (searchQuery) {
      // If searching, just show search results
      return [
        {
          title: 'Search Results',
          data: filteredApps,
          renderItem: ({ item }: { item: {app: App, repo: Repository} }) => (
            <AppCard app={item.app} repoTintColor={item.repo.tintColor} />
          )
        }
      ];
    }
    
    const sectionsData = [];
    
    // Apps by repository
    repositories.forEach(repo => {
      if (repo.apps.length > 0) {
        sectionsData.push({
          title: repo.name,
          data: repo.apps,
          renderItem: ({ item }: { item: App }) => (
            <AppCard app={item} repoTintColor={repo.tintColor} />
          )
        });
      }
    });
    
    return sectionsData;
  }, [repositories, searchQuery, filteredApps]);
  
  if (loading && !refreshing && repositories.length === 0) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.secondaryText }]}>
          Loading repositories...
        </Text>
      </View>
    );
  }
  
  if (error && repositories.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <EmptyState
          title="Couldn't Load Repositories"
          message={error}
          action={{
            label: 'Try Again',
            onPress: refreshRepositories
          }}
          icon={<RefreshCw size={48} color={theme.colors.secondaryText} />}
        />
      </SafeAreaView>
    );
  }
  
  if (repositories.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <EmptyState
          title="No Repositories"
          message="Add a repository in the Settings tab to get started."
        />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          KittenStore
        </Text>
      </View>
      
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={() => setSearchQuery('')}
      />
      
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => {
          if ('bundleIdentifier' in item) return item.bundleIdentifier;
          if ('identifier' in item) return item.identifier;
          return index.toString();
        }}
        renderSectionHeader={({ section }) => (
          <View style={[styles.sectionHeader, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {section.title}
            </Text>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
  },
  listContent: {
    paddingBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
  },
});