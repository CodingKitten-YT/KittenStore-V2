import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useThemeContext } from '../../context/ThemeContext';
import { PackageSearch, RefreshCw } from 'lucide-react-native';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon,
  action
}) => {
  const { theme } = useThemeContext();
  
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {icon || <PackageSearch size={48} color={theme.colors.secondaryText} />}
      </View>
      
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {title}
      </Text>
      
      <Text style={[styles.message, { color: theme.colors.secondaryText }]}>
        {message}
      </Text>
      
      {action && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={action.onPress}
        >
          <RefreshCw size={16} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>{action.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});