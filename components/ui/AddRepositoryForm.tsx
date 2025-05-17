import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { useThemeContext } from '../../context/ThemeContext';
import { useRepositoryContext } from '../../context/RepositoryContext';
import { Plus, X } from 'lucide-react-native';

interface AddRepositoryFormProps {
  onClose: () => void;
}

export const AddRepositoryForm: React.FC<AddRepositoryFormProps> = ({ onClose }) => {
  const { theme } = useThemeContext();
  const { addRepository } = useRepositoryContext();
  
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleAddRepository = async () => {
    if (!url) {
      setError('Repository URL is required');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await addRepository(name, url);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add repository');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.cardBackground }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Add Repository
        </Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          disabled={loading}
        >
          <X size={20} color={theme.colors.secondaryText} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.secondaryText }]}>
            Repository Name (Optional)
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                color: theme.colors.text,
                backgroundColor: theme.colors.searchBarBackground,
                borderColor: theme.colors.border
              }
            ]}
            placeholder="My Repository"
            placeholderTextColor={theme.colors.tertiaryText}
            value={name}
            onChangeText={setName}
            editable={!loading}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.secondaryText }]}>
            Repository URL
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                color: theme.colors.text,
                backgroundColor: theme.colors.searchBarBackground,
                borderColor: error ? theme.colors.notification : theme.colors.border
              }
            ]}
            placeholder="https://example.com/repo.json"
            placeholderTextColor={theme.colors.tertiaryText}
            autoCapitalize="none"
            keyboardType="url"
            value={url}
            onChangeText={(text) => {
              setUrl(text);
              if (error) setError(null);
            }}
            editable={!loading}
          />
          {error && (
            <Text style={[styles.errorText, { color: theme.colors.notification }]}>
              {error}
            </Text>
          )}
        </View>
      </View>
      
      <TouchableOpacity
        style={[
          styles.addButton,
          { backgroundColor: theme.colors.primary },
          loading && { opacity: 0.7 }
        ]}
        onPress={handleAddRepository}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Plus size={16} color="#FFFFFF" style={styles.addIcon} />
            <Text style={styles.addButtonText}>Add Repository</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  form: {
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  addButton: {
    height: 48,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    marginRight: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});