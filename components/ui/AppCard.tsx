import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useThemeContext } from '../../context/ThemeContext';
import { App } from '../../types/repository';
import { useRouter } from 'expo-router';

interface AppCardProps {
  app: App;
  repoTintColor?: string;
}

export const AppCard: React.FC<AppCardProps> = ({ app, repoTintColor }) => {
  const { theme } = useThemeContext();
  const router = useRouter();

  const version =
    app.version || (app.versions && app.versions.length > 0 ? app.versions[0].version : 'Unknown');
  const tintColor = app.tintColor || repoTintColor || theme.colors.primary;

  const handlePress = () => {
    router.push({
      pathname: '/app/[id]',
      params: { id: app.bundleIdentifier, app: JSON.stringify(app) },
    });
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: theme.colors.cardBackground },
        Platform.OS === 'ios' && styles.iosShadow,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Image source={{ uri: app.iconURL }} style={styles.icon} resizeMode="cover" />
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
            {app.name}
          </Text>
          <Text style={[styles.developer, { color: theme.colors.secondaryText }]} numberOfLines={1}>
            {app.developerName}
          </Text>
        </View>
      </View>

      {!!app.subtitle && (
        <Text style={[styles.subtitle, { color: theme.colors.secondaryText }]} numberOfLines={2}>
          {app.subtitle}
        </Text>
      )}

      <View style={styles.footer}>
        <Text style={[styles.version, { color: theme.colors.tertiaryText }]}>
          Version {version}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 10, // tighter spacing between cards
    marginHorizontal: 16,
  },
  iosShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 10,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  developer: {
    fontSize: 13,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  version: {
    fontSize: 12,
  },
});
