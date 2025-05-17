import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Platform } from 'react-native';
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
  
  const handleWebsitePress = async () => {
    if (repository.website) {
      await WebBrowser.openBrowserAsync(repository.website);
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
        <Image
          source={{ uri: repository.iconURL }}
          style={styles.icon}
          resizeMode="cover"
        />
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
            {repository.name}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.secondaryText }]} numberOfLines={1}>
            {repository.subtitle}
          </Text>
        </View>
      </View>
      
      <Text style={[styles.description, { color: theme.colors.secondaryText }]} numberOfLines={2}>
        {repository.description}
      </Text>
      
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
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 8,
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
  subtitle: {
    fontSize: 14,
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
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