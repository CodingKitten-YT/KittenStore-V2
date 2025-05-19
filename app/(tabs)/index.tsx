import React, { useState, useCallback, useRef } from 'react';
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
import { App, Repository } from '@/types/repository';
import { RefreshCw } from 'lucide-react-native';
import { useFocusEffect } from 'expo-router';

type AppWithRepo = { app: App; repo: Repository };

type ListItem = 
  | { type: 'header'; title: string }
  | { type: 'item'; app: App; repo: Repository };

export default function HomeScreen() {
  const { theme } = useThemeContext();
  const { repositories, loading, error, refreshRepositories } = useRepositoryContext();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  // Refs for scroll position management
  const listRef = useRef<FlashList<ListItem>>(null);
  const scrollPosition = useRef(0);
  
  const filteredApps = React.useMemo(() => {
    if (!searchQuery) return [];

    const query = searchQuery.toLowerCase();
    const apps: AppWithRepo[] = [];

    repositories.forEach(repo => {
      repo.apps.forEach(app => {
        if (
          app.name.toLowerCase().includes(query) ||
          app.developerName.toLowerCase().includes(query) ||
          app.subtitle.toLowerCase().includes(query) ||
          app.localizedDescription.toLowerCase().includes(query)
        ) {
          apps.push({ app, repo });
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

  const listData: ListItem[] = React.useMemo(() => {
    const items: ListItem[] = [];

    if (searchQuery) {
      if (filteredApps.length > 0) {
        items.push({ type: 'header', title: 'Search Results' });
        filteredApps.forEach(({ app, repo }) => {
          items.push({ type: 'item', app, repo });
        });
      }
    } else {
      repositories.forEach(repo => {
        if (repo.apps.length > 0) {
          items.push({ type: 'header', title: repo.name });
          repo.apps.forEach(app => {
            items.push({ type: 'item', app, repo });
          });
        }
      });
    }

    return items;
  }, [repositories, searchQuery, filteredApps]);

  // Save scroll position when leaving the screen
  const handleScroll = useCallback((event: { nativeEvent: { contentOffset: { y: number } } }) => {
    scrollPosition.current = event.nativeEvent.contentOffset.y;
  }, []);

  // Restore scroll position when returning to the screen
  useFocusEffect(
    useCallback(() => {
      if (listRef.current && scrollPosition.current > 0) {
        // Use a small timeout to ensure the list has rendered
        setTimeout(() => {
          listRef.current?.scrollToOffset({
            offset: scrollPosition.current,
            animated: false
          });
        }, 50);
      }
    }, [])
  );

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

      <FlashList
        ref={listRef}
        data={listData}
        estimatedItemSize={100}
        onScroll={handleScroll}
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
          } else {
            return (
              <AppCard app={item.app} repoTintColor={item.repo.tintColor} />
            );
          }
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