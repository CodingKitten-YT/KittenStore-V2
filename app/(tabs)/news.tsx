import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  FlatList,
  RefreshControl
} from 'react-native';
import { useThemeContext } from '@/context/ThemeContext';
import { useRepositoryContext } from '@/context/RepositoryContext';
import { NewsCard } from '@/components/ui/NewsCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { NewsItem } from '@/types/repository';

export default function NewsScreen() {
  const { theme } = useThemeContext();
  const { repositories, refreshRepositories } = useRepositoryContext();
  const [refreshing, setRefreshing] = React.useState(false);
  
  // Get all news items
  const allNews = React.useMemo(() => {
    const news: NewsItem[] = [];
    
    repositories.forEach(repo => {
      if (repo.news && repo.news.length > 0) {
        news.push(...repo.news);
      }
    });
    
    // Sort by date (newest first)
    return news.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [repositories]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refreshRepositories();
    setRefreshing(false);
  }, [refreshRepositories]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          News
        </Text>
      </View>

      {allNews.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState
            title="No News"
            message="There are no news items to display."
          />
        </View>
      ) : (
        <FlatList
          data={allNews}
          renderItem={({ item }) => <NewsCard news={item} />}
          keyExtractor={(item) => item.identifier}
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
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingHorizontal: 0, // match index page (FlashList has no horizontal padding)
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});