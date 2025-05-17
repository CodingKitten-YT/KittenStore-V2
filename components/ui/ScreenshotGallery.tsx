import React, { useState } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Modal, 
  View, 
  Dimensions, 
  StatusBar,
  Platform
} from 'react-native';
import { X } from 'lucide-react-native';
import { Screenshot, ScreenshotsByDevice } from '../../types/repository';
import { useThemeContext } from '../../context/ThemeContext';

interface ScreenshotGalleryProps {
  screenshots: Screenshot[] | ScreenshotsByDevice;
}

export const ScreenshotGallery: React.FC<ScreenshotGalleryProps> = ({ screenshots }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { theme } = useThemeContext();
  const { width: SCREEN_WIDTH } = Dimensions.get('window');

  // Process screenshots to get uniform array
  const processedScreenshots: Screenshot[] = React.useMemo(() => {
    if (!screenshots) {
      return [];
    }

    if (Array.isArray(screenshots)) {
      return screenshots.map(screenshot => 
        typeof screenshot === 'string' 
          ? { imageURL: screenshot } 
          : screenshot
      );
    } else {
      // Handle device-specific screenshots
      const iPhoneScreenshots = (screenshots && screenshots.iphone ? screenshots.iphone : []).map(s => 
        typeof s === 'string' ? { imageURL: s } : s
      );
      
      // Only use iPhone screenshots for simplicity in this gallery
      return iPhoneScreenshots;
    }
  }, [screenshots]);

  const handleImagePress = (imageURL: string) => {
    setSelectedImage(imageURL);
    setModalVisible(true);
  };

  if (!processedScreenshots.length) {
    return null;
  }

  return (
    <>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {processedScreenshots.map((screenshot, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.screenshotContainer}
            onPress={() => handleImagePress(screenshot.imageURL)}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: screenshot.imageURL }}
              style={[
                styles.screenshot,
                screenshot.width && screenshot.height 
                  ? { aspectRatio: screenshot.width / screenshot.height }
                  : null
              ]}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.9)' }]}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <X color="#FFFFFF" size={24} />
          </TouchableOpacity>
          
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  screenshotContainer: {
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden',
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
  screenshot: {
    width: 180,
    height: 320,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
});