import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { useThemeContext } from '../../context/ThemeContext';
import { Repository } from '../../types/repository';
import { ExternalLink, Trash2 } from 'lucide-react-native';
import * as WebBrowser from 'expo-web-browser';

interface RepositoryCardProps {
  repository: Repository;
  onRemove?: () => void;
  showActions?: boolean;
}

export const RepositoryCard: React.FC<RepositoryCardProps> = ({ 
  repository, 
  onRemove,
  showActions = true
}) => {
  const { theme } = useThemeContext();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'cors'>('loading');
  
  useEffect(() => {
    checkRepositoryStatus();
  }, [repository.url]);

  const checkRepositoryStatus = async () => {
    if (!repository.url) {
      setStatus('error');
      return;
    }

    try {
      const response = await fetch(repository.url);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      // Check if it's a CORS error
      if (error instanceof TypeError && error.message.includes('CORS')) {
        setStatus('cors');
      } else {
        setStatus('error');
      }
    }
  };
  
  const handleWebsitePress = async () => {
    if (repository.website) {
      await WebBrowser.openBrowserAsync(repository.website);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return '#34C759'; // Green
      case 'error':
        return '#FF3B30'; // Red
      case 'cors':
        return '#5856D6'; // Purple/Blue
      default:
        return theme.colors.secondaryText;
    }
  };
  
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.cardBackground },
        Platform.OS === 'ios' && styles.iosShadow
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
            {repository.name}
          </Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
            <Text style={[styles.appCount, { color: theme.colors.secondaryText }]}>
              {repository.apps.length} {repository.apps.length === 1 ? 'app' : 'apps'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.textBlock}>
        {!!repository.subtitle && (
          <Text style={[styles.subtitle, { color: theme.colors.secondaryText }]} numberOfLines={1}>
            {repository.subtitle}
          </Text>
        )}
        {!!repository.description && (
          <Text style={[styles.description, { color: theme.colors.secondaryText }]} numberOfLines={3}>
            {repository.description}
          </Text>
        )}
      </View>
      
      {showActions && (
        <View style={styles.actions}>
          {repository.website && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                { borderColor: theme.colors.border }
              ]}
              onPress={handleWebsitePress}
            >
              <ExternalLink size={16} color={theme.colors.secondaryText} style={styles.actionIcon} />
              <Text style={[styles.actionText, { color: theme.colors.text }]}>
                Visit Website
              </Text>
            </TouchableOpacity>
          )}
          
          {onRemove && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.removeButton,
                { borderColor: theme.colors.notification }
              ]}
              onPress={onRemove}
            >
              <Trash2 size={16} color={theme.colors.notification} style={styles.actionIcon} />
              <Text style={[styles.actionText, { color: theme.colors.notification }]}>
                Remove
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  iosShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  appCount: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },
  textBlock: {
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  removeButton: {
    borderColor: '#FF3B30',
  },
  actionIcon: {
    marginRight: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});