import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { useThemeContext } from '../../context/ThemeContext';
import { NewsItem } from '../../types/repository';
import { ChevronRight, Star } from 'lucide-react-native';
import { formatDate } from '../../utils/api';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';

// Normalize hex colors
const normalizeColor = (color?: string): string | undefined => {
  if (!color) return undefined;
  return color.startsWith('#') ? color : `#${color}`;
};

interface NewsCardProps {
  news: NewsItem;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const { theme } = useThemeContext();
  const tintColor = normalizeColor(news.tintColor) || theme.colors.primary;
  const router = useRouter();

  const handlePress = async () => {
    if (news.appID) {
      // Push to the app detail page if appID is present
      router.push(`/app/${news.appID}?source=${encodeURIComponent(news.url)}`);
    } else if (news.url) {
      // Fallback to opening in web browser
      await WebBrowser.openBrowserAsync(news.url);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: theme.colors.cardBackground },
        Platform.OS === 'ios' && styles.iosShadow
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={!news.url && !news.appID}
    >
      {news.imageURL ? (
        <Image
          source={{ uri: news.imageURL }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : null}

      <View style={styles.content}>
        <View style={styles.header}>
          {news.notify && (
            <View style={[styles.notifyBadge, { backgroundColor: tintColor }]}>
              <Star size={12} color="#FFFFFF" />
            </View>
          )}
          <Text style={[styles.date, { color: theme.colors.tertiaryText }]}>
            {formatDate(news.date)}
          </Text>
        </View>

        <Text style={[styles.title, { color: theme.colors.text }]}>
          {news.title}
        </Text>

        <Text style={[styles.caption, { color: theme.colors.secondaryText }]} numberOfLines={3}>
          {news.caption}
        </Text>

        {(news.url || news.appID) && (
          <View style={styles.footer}>
            <Text style={[styles.readMore, { color: tintColor }]}>
              {news.appID ? 'View App' : 'Read More'}
            </Text>
            <ChevronRight size={16} color={tintColor} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  iosShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    height: 160,
    width: '100%',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  notifyBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  date: {
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMore: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
});
