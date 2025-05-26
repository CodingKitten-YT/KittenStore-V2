import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { useThemeContext } from '@/context/ThemeContext';
import { useRepositoryContext } from '@/context/RepositoryContext';
import { RepositoryCard } from '@/components/ui/RepositoryCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { AddRepositoryForm } from '@/components/ui/AddRepositoryForm';
import { PackagePlus, Moon, Sun, Smartphone } from 'lucide-react-native';
import { ThemeType, ACCENT_COLORS, DOWNLOAD_OPTIONS } from '@/types/theme';
import { getStoredDownloadOption, setStoredDownloadOption, getStoredCustomScheme, setStoredCustomScheme } from '@/utils/storage';
import appJson from '../../app.json';
import { TextInput } from 'react-native';

export default function SettingsScreen() {
  const { theme, themeType, setThemeType, accentColor, setAccentColor } = useThemeContext();
  const { repositories, removeRepository } = useRepositoryContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDownloadOption, setSelectedDownloadOption] = React.useState('default');
  const [customScheme, setCustomScheme] = React.useState('hyquiz');

  React.useEffect(() => {
    const loadSettings = async () => {
      getStoredDownloadOption().then(setSelectedDownloadOption);
      getStoredCustomScheme().then(setCustomScheme);
    };

    loadSettings();
  }, []);

  const handleRemoveRepository = (url: string) => {
    Alert.alert('Remove Repository', 'Are you sure you want to remove this repository?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => removeRepository(url),
      },
    ]);
  };

  const handleDownloadOptionChange = async (optionId: string) => {
    setSelectedDownloadOption(optionId);
    await setStoredDownloadOption(optionId);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* REPOSITORIES */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Repositories</Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => setModalVisible(true)}
            >
              <PackagePlus size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {repositories.length === 0 ? (
            <View style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}>
              <EmptyState
                title="No Repositories"
                message="Add a repository to browse apps."
                action={{ label: 'Add Repository', onPress: () => setModalVisible(true) }}
              />
            </View>
          ) : (
            repositories.map((repo) => {
              if (!repo.url) return null;
              return (
                <RepositoryCard
                  key={repo.url}
                  repository={repo}
                  onRemove={() => repo.url && handleRemoveRepository(repo.url)}
                />
              );
            })
          )}
        </View>

        {/* DOWNLOAD OPTIONS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Download Method</Text>
          </View>

          <View style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}>
            {DOWNLOAD_OPTIONS.map((option, index) => (
              <React.Fragment key={option.id}>
                <TouchableOpacity
                  style={styles.settingItem}
                  onPress={() => handleDownloadOptionChange(option.id)}
                >
                  <View style={styles.settingContent}>
                    <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                      {option.label}
                    </Text>
                  </View>
                  {selectedDownloadOption === option.id && (
                    <View style={[styles.radioButton, { borderColor: theme.colors.primary }]}>
                      <View style={[styles.radioButtonInner, { backgroundColor: theme.colors.primary }]} />
                    </View>
                  )}
                </TouchableOpacity>
                {index < DOWNLOAD_OPTIONS.length - 1 && option.id !== 'custom' && (
                  <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />
                )}
              </React.Fragment>
            ))}

            {selectedDownloadOption === 'custom' && (
              <View style={styles.customSchemeContainer}>
                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Custom URL Scheme:</Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      color: theme.colors.text,
                      backgroundColor: theme.colors.searchBarBackground,
                      borderColor: theme.colors.border
                    }
                  ]}
                  placeholder="e.g., myscheme"
                  placeholderTextColor={theme.colors.tertiaryText}
                  autoCapitalize="none"
                  value={customScheme}
                  onChangeText={(text: string) => {
                    setCustomScheme(text);
                    setStoredCustomScheme(text);
                  }}
                />
              </View>
            )}
          </View>
        </View>

        {/* THEME */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Theme</Text>
          </View>

          <View style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}>
            {(['light', 'dark', 'system'] as ThemeType[]).map((type) => {
              const Icon = type === 'light' ? Sun : type === 'dark' ? Moon : Smartphone;
              const label = type.charAt(0).toUpperCase() + type.slice(1);

              return (
                <React.Fragment key={type}>
                  <TouchableOpacity style={styles.settingItem} onPress={() => setThemeType(type)}>
                    <View style={styles.settingContent}>
                      <Icon size={20} color={theme.colors.text} style={styles.settingIcon} />
                      <Text style={[styles.settingLabel, { color: theme.colors.text }]}>{label}</Text>
                    </View>
                    {themeType === type && (
                      <View style={[styles.radioButton, { borderColor: theme.colors.primary }]}>
                        <View style={[styles.radioButtonInner, { backgroundColor: theme.colors.primary }]} />
                      </View>
                    )}
                  </TouchableOpacity>
                  {type !== 'system' && (
                    <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />
                  )}
                </React.Fragment>
              );
            })}
          </View>
        </View>

        {/* ACCENT COLOR */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Accent Color</Text>
          </View>

          <View style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}>
            {ACCENT_COLORS.map((color, index) => (
              <React.Fragment key={color.id}>
                <TouchableOpacity
                  style={styles.settingItem}
                  onPress={() => setAccentColor(color.color)}
                >
                  <View style={styles.settingContent}>
                    <View
                      style={[styles.colorSwatch, { backgroundColor: color.color }]}
                    />
                    <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                      {color.label}
                    </Text>
                  </View>
                  {accentColor === color.color && (
                    <View style={[styles.radioButton, { borderColor: color.color }]}>
                      <View style={[styles.radioButtonInner, { backgroundColor: color.color }]} />
                    </View>
                  )}
                </TouchableOpacity>
                {index < ACCENT_COLORS.length - 1 && (
                  <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* ABOUT */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>About</Text>
          </View>

          <View style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}>
            <View style={styles.aboutItem}>
              <Text style={[styles.aboutLabel, { color: theme.colors.secondaryText }]}>Version</Text>
              <Text style={[styles.aboutValue, { color: theme.colors.text }]}>
                {appJson.expo.version}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* UPDATED MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: theme.colors.cardBackground }]}>
            <AddRepositoryForm onClose={closeModal} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
  },
  content: { flex: 1 },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  separator: {
    height: 1,
    marginHorizontal: 16,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  aboutLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  aboutValue: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  // UPDATED MODAL STYLES
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    zIndex: 1000,
    elevation: 1000,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 20,
    zIndex: 1001,
  },
  customSchemeContainer: {
    padding: 16,
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
});