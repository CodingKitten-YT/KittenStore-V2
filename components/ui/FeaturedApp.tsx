import React from 'react';
import { StyleSheet, View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { App } from '../../types/repository';
import { useThemeContext } from '../../context/ThemeContext';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';

interface FeaturedAppProps {
  app: App;
}

export const FeaturedApp: React.FC<FeaturedAppProps> = ({ app }) => {
  const { theme } = useThemeContext();
  const router = useRouter();
  
  const handlePress = () => {
    router.push({
      pathname: '/app/[id]',
      params: { id: app.bundleIdentifier, app: JSON.stringify(app) }
    });
  };
  
  // Extract first screenshot URL for background
  let screenshotUrl = '';
  if (Array.isArray(app.screenshots) && app.screenshots.length > 0) {
    screenshotUrl = typeof app.screenshots[0] === 'string' 
      ? app.screenshots[0] 
      : app.screenshots[0].imageURL;
  } else if (app.screenshots && 'iphone' in app.screenshots && app.screenshots.iphone && app.screenshots.iphone.length > 0) {
    screenshotUrl = typeof app.screenshots.iphone[0] === 'string'
      ? app.screenshots.iphone[0]
      : app.screenshots.iphone[0].imageURL;
  }

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <ImageBackground
        source={{ uri: screenshotUrl }}
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        <View style={[styles.overlay, { backgroundColor: `${app.tintColor}D9` || '#007AFFD9' }]}>
          <View style={styles.content}>
            <Text style={styles.featuredLabel}>FEATURED</Text>
            <Text style={styles.title} numberOfLines={2}>{app.name}</Text>
            <Text style={styles.subtitle} numberOfLines={2}>{app.subtitle}</Text>
            
            <View style={styles.viewButton}>
              <Text style={styles.viewButtonText}>View</Text>
              <ChevronRight size={16} color="#FFFFFF" />
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 180,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  background: {
    flex: 1,
  },
  backgroundImage: {
    borderRadius: 12,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
    borderRadius: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  featuredLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    opacity: 0.9,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 15,
    opacity: 0.9,
    marginBottom: 12,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginRight: 4,
  },
});