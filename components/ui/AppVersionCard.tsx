import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useThemeContext } from '../../context/ThemeContext';
import { AppVersion } from '../../types/repository';
import { formatDate, formatFileSize } from '../../utils/api';
import { ChevronDown, ChevronUp, Download } from 'lucide-react-native';

interface AppVersionCardProps {
  version: AppVersion;
  expanded?: boolean;
  onToggleExpand?: () => void;
  tintColor?: string;
  onDownload?: () => void;  // <-- Added this line
}

export const AppVersionCard: React.FC<AppVersionCardProps> = ({
  version,
  expanded = false,
  onToggleExpand,
  tintColor,
  onDownload,  // <-- Added this here
}) => {
  const { theme } = useThemeContext();
  const color = tintColor || theme.colors.primary;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.cardBackground,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.header}
        onPress={onToggleExpand}
        activeOpacity={0.7}
      >
        <View style={styles.versionInfo}>
          <Text style={[styles.versionNumber, { color: theme.colors.text }]}>
            Version {version.version}
          </Text>
          <Text style={[styles.versionDate, { color: theme.colors.secondaryText }]}>
            {formatDate(version.date)}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.downloadButton, { backgroundColor: color }]}
            onPress={onDownload}  // <-- Add this handler here
          >
            <Download size={16} color="#FFFFFF" />
          </TouchableOpacity>

          {expanded ? (
            <ChevronUp size={20} color={theme.colors.secondaryText} />
          ) : (
            <ChevronDown size={20} color={theme.colors.secondaryText} />
          )}
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.secondaryText }]}>
              Size:
            </Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {formatFileSize(version.size)}
            </Text>
          </View>

          {version.minOSVersion && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.secondaryText }]}>
                Minimum OS:
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                iOS {version.minOSVersion}+
              </Text>
            </View>
          )}

          {version.maxOSVersion && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.secondaryText }]}>
                Maximum OS:
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                iOS {version.maxOSVersion}
              </Text>
            </View>
          )}

          <Text style={[styles.description, { color: theme.colors.text }]}>
            {version.localizedDescription}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  versionInfo: {
    flex: 1,
  },
  versionNumber: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  versionDate: {
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  content: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    width: 100,
    fontSize: 14,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
});
