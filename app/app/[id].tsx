import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  SafeAreaView,
  Platform
} from 'react-native';
import { useThemeContext } from '@/context/ThemeContext';
import { useRepositoryContext } from '@/context/RepositoryContext';
import { ScreenshotGallery } from '@/components/ui/ScreenshotGallery';
import { AppVersionCard } from '@/components/ui/AppVersionCard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { App, AppVersion } from '@/types/repository';
import { ChevronLeft, Download } from 'lucide-react-native';
import * as WebBrowser from 'expo-web-browser';

export default function AppDetailScreen() {
  const { theme } = useThemeContext();
  const { repositories } = useRepositoryContext();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [expandedVersion, setExpandedVersion] = useState<string | null>(null);
  
  // Try to get app from parameters or find in repositories
  let app: App | undefined;
  
  if (params.app && typeof params.app === 'string') {
    try {
      app = JSON.parse(params.app) as App;
    } catch (e) {
      console.error('Failed to parse app data:', e);
    }
  }
  
  if (!app && params.id && typeof params.id === 'string') {
    // Try to find app in repositories
    for (const repo of repositories) {
      const foundApp = repo.apps.find(a => a.bundleIdentifier === params.id);
      if (foundApp) {
        app = foundApp;
        break;
      }
    }
  }
  
  if (!app) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            App Not Found
          </Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.text }]}>
            The requested app could not be found.
          </Text>
          <TouchableOpacity
            style={[styles.backToHomeButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.backToHomeText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  // Convert single version format to versions array format if needed
  const appVersions: AppVersion[] = app.versions || (app.version ? [{
    version: app.version,
    date: app.versionDate || new Date().toISOString(),
    size: app.size || 0,
    downloadURL: app.downloadURL || '',
    localizedDescription: app.versionDescription || ''
  }] : []);
  
  // Convert screenshotURLs to screenshots format if needed
  const screenshots = app.screenshots || (app.screenshotURLs ? 
    app.screenshotURLs.map(url => ({ imageURL: url })) : 
    []);
  
  const toggleVersionExpand = (version: string) => {
    if (expandedVersion === version) {
      setExpandedVersion(null);
    } else {
      setExpandedVersion(version);
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]} numberOfLines={1}>
          {app.name}
        </Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.appHeader}>
          <Image
            source={{ uri: app.iconURL }}
            style={styles.appIcon}
            resizeMode="cover"
          />
          <View style={styles.appInfo}>
            <Text style={[styles.appName, { color: theme.colors.text }]}>
              {app.name}
            </Text>
            <Text style={[styles.appDeveloper, { color: theme.colors.secondaryText }]}>
              {app.developerName}
            </Text>
            <TouchableOpacity
              style={[
                styles.downloadButton,
                { backgroundColor: app.tintColor || theme.colors.primary }
              ]}
            >
              <Download size={18} color="#FFFFFF" style={styles.downloadIcon} />
              <Text style={styles.downloadText}>
                Download
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {(screenshots && Array.isArray(screenshots) && screenshots.length > 0) && (
          <View style={styles.screenshotSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Screenshots
            </Text>
            <ScreenshotGallery screenshots={screenshots} />
          </View>
        )}
        
        <View style={styles.descriptionSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Description
          </Text>
          <Text style={[styles.description, { color: theme.colors.text }]}>
            {app.localizedDescription}
          </Text>
        </View>
        
        {app.permissions && app.permissions.length > 0 && (
          <View style={styles.permissionsSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              App Permissions
            </Text>
            
            {app.permissions.map((permission, index) => (
              <View key={index} style={styles.permissionGroup}>
                <Text style={[styles.permissionGroupTitle, { color: theme.colors.text }]}>
                  {permission.type}
                </Text>
                <Text 
                  style={[styles.permissionItem, { color: theme.colors.secondaryText }]}
                >
                  • {permission.usageDescription}
                </Text>
              </View>
            ))}
          </View>
        )}
        
        {app.appPermissions && (
          <View style={styles.permissionsSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              App Permissions
            </Text>
            
            {app.appPermissions.entitlements && app.appPermissions.entitlements.length > 0 && (
              <View style={styles.permissionGroup}>
                <Text style={[styles.permissionGroupTitle, { color: theme.colors.text }]}>
                  Entitlements
                </Text>
                {app.appPermissions.entitlements.map((entitlement, index) => (
                  <Text 
                    key={index}
                    style={[styles.permissionItem, { color: theme.colors.secondaryText }]}
                  >
                    • {entitlement}
                  </Text>
                ))}
              </View>
            )}
            
            {app.appPermissions.privacy && Object.keys(app.appPermissions.privacy).length > 0 && (
              <View style={styles.permissionGroup}>
                <Text style={[styles.permissionGroupTitle, { color: theme.colors.text }]}>
                  Privacy
                </Text>
                {Object.entries(app.appPermissions.privacy).map(([key, value], index) => (
                  <View key={index} style={styles.privacyItem}>
                    <Text style={[styles.privacyKey, { color: theme.colors.text }]}>
                      {key}:
                    </Text>
                    <Text style={[styles.privacyValue, { color: theme.colors.secondaryText }]}>
                      {value}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
        
        {appVersions.length > 0 && (
          <View style={styles.versionsSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Versions
            </Text>
            
            {appVersions.map((version, index) => (
              <AppVersionCard
                key={index}
                version={version}
                expanded={expandedVersion === version.version}
                onToggleExpand={() => toggleVersionExpand(version.version)}
                tintColor={app.tintColor}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  backToHomeButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backToHomeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  appHeader: {
    flexDirection: 'row',
    padding: 16,
  },
  appIcon: {
    width: 100,
    height: 100,
    borderRadius: 20,
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
  appInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  appName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  appDeveloper: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  downloadIcon: {
    marginRight: 6,
  },
  downloadText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  screenshotSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  description: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  permissionsSection: {
    marginBottom: 24,
  },
  permissionGroup: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  permissionGroupTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  permissionItem: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginLeft: 8,
  },
  privacyItem: {
    marginBottom: 8,
  },
  privacyKey: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  privacyValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginLeft: 8,
  },
  versionsSection: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
});