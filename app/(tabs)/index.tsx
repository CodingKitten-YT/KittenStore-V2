import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useThemeContext } from '@/context/ThemeContext';
import { useRepositoryContext } from '@/context/RepositoryContext';
import { SearchBar } from '@/components/ui/SearchBar';
import { AppCard } from '@/components/ui/AppCard';
import { EmptyState } from '@/components/ui/EmptyState';
import type { App, Repository } from '@/types/repository';
import { RefreshCw } from 'lucide-react-native';

type AppWithRepo = { app: App; repo: Repository };

type ListItem = 
  | { type: 'header'; title: string }
  | { type: 'item'; app: App; repo: Repository };

export default function HomeScreen() {
  const { theme } = useThemeContext();
  const { repositories, loading, error, refreshRepositories } = useRepositoryContext();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  const filteredApps = React.useMemo(() => {
    const apps: AppWithRepo[] = [];

    for (const repo of repositories) {
      for (const app of repo.apps) {
        // Apply search filter
        const matchesSearch = !searchQuery || 
          app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.developerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.localizedDescription.toLowerCase().includes(searchQuery.toLowerCase());

        if (matchesSearch) {
          apps.push({ app, repo });
        }
      }
    }

    return apps;
  }, [repositories, searchQuery]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshRepositories();
    setRefreshing(false);
  }, [refreshRepositories]);

  const listData: ListItem[] = React.useMemo(() => {
    const items: ListItem[] = [];

    if (searchQuery) {
      if (filteredApps.length > 0) {
        items.push({ type: 'header', title: 'Search Results' });
        for (const { app, repo } of filteredApps) {
          items.push({ type: 'item', app, repo });
        }
      }
    } else {
      for (const repo of repositories) {
        if (repo.apps.length > 0) {
          items.push({ type: 'header', title: repo.name });
          for (const app of repo.apps) {
            items.push({ type: 'item', app, repo });
          }
        }
      }
    }

    return items;
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
      <FlashList
        data={listData}
        estimatedItemSize={100}
        keyExtractor={(item, index) =>
          item.type === 'item' ? item.app.bundleIdentifier ?? index.toString() : `header-${index}`
        }
        renderItem={({ item }) => {
          if (item.type === 'header') {
            return (
              <View style={[styles.sectionHeader, { backgroundColor: theme.colors.background }]}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  {item.title}
                </Text>
              </View>
            );
          }
          return (
            <View style={{ alignItems: 'center' }}>
              <AppCard app={item.app} repoTintColor={item.repo.tintColor} />
            </View>
          );
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListHeaderComponent={
          <>
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
          </>
        }
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