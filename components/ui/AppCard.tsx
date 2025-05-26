import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { useThemeContext } from '../../context/ThemeContext';
import { App } from '../../types/repository';
import { Download } from 'lucide-react-native';
import { handleDownload } from '@/utils/download';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 4;
const CARD_WIDTH = width - (CARD_MARGIN * 4);

interface AppCardProps {
  app: App;
  repoTintColor?: string;
}

export const AppCard: React.FC<AppCardProps> = ({ app, repoTintColor }) => {
  const { theme } = useThemeContext();

  const version =
    app.version || (app.versions && app.versions.length > 0 ? app.versions[0].version : 'Unknown');
  const tintColor = app.tintColor || repoTintColor || theme.colors.primary;

  const handlePress = () => {
    // This is for navigating the main card, keep this.
    // router.push({
    //   pathname: '/app/[id]',
    //   params: { id: app.bundleIdentifier, app: JSON.stringify(app) },
    // });
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: theme.colors.cardBackground },
        Platform.OS === 'ios' && styles.iosShadow,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Image 
            source={{ uri: app.iconURL }} 
            style={[
              styles.icon,
              Platform.OS === 'ios' && styles.iconShadow
            ]} 
            resizeMode="cover" 
          />
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
              {app.name}
            </Text>
            <Text style={[styles.developer, { color: theme.colors.secondaryText }]} numberOfLines={1}>
              {app.developerName}
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.downloadButton, { backgroundColor: tintColor }]}
            onPress={() => app?.downloadURL && handleDownload(app.downloadURL)}
          >
            <Download size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {!!app.subtitle && (
          <Text 
            style={[styles.subtitle, { color: theme.colors.secondaryText }]} 
            numberOfLines={2}
          >
            {app.subtitle}
          </Text>
        )}

        <View style={styles.footer}>
          <View 
            style={[
              styles.versionBadge, 
              { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
            ]}
          >
            <Text style={[styles.version, { color: theme.colors.secondaryText }]}>
              v{version}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_MARGIN,
    marginVertical: CARD_MARGIN,
    borderRadius: 16,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  iosShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 14,
  },
  iconShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  title: {
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  developer: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  versionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  version: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  downloadButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});