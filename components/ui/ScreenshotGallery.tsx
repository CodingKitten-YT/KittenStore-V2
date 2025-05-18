import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  View,
  Dimensions,
  Platform,
  FlatList,
  Text,
} from 'react-native';
import { X, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Screenshot, ScreenshotsByDevice } from '../../types/repository';
import { useThemeContext } from '../../context/ThemeContext';

interface ScreenshotGalleryProps {
  screenshots: Screenshot[] | ScreenshotsByDevice;
}

export const ScreenshotGallery: React.FC<ScreenshotGalleryProps> = ({ screenshots }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const themeContext = useThemeContext();
  const theme = themeContext.theme;
  const { width: SCREEN_WIDTH } = Dimensions.get('window');
  const scrollViewRef = useRef<ScrollView>(null);
  const flatListRef = useRef<FlatList>(null);

  const processedScreenshots: Screenshot[] = React.useMemo(() => {
    if (!screenshots) return [];
    if (Array.isArray(screenshots)) {
      return screenshots.map(s => (typeof s === 'string' ? { imageURL: s } : s));
    } else {
      return (screenshots.iphone ?? []).map(s => (typeof s === 'string' ? { imageURL: s } : s));
    }
  }, [screenshots]);

  const selectedImage = processedScreenshots[currentImageIndex]?.imageURL || null;

  const handleImagePress = (index: number) => {
    setCurrentImageIndex(index);
    setModalVisible(true);
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index, animated: false });
    }, 0);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const navigateToThumbnail = (index: number) => {
    scrollViewRef.current?.scrollTo({ x: index * (180 + 16), animated: true });
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentImageIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const viewabilityConfig = { itemVisiblePercentThreshold: 50 };

  if (!processedScreenshots.length) return null;

  return (
    <>
      {/* Thumbnails */}
      <View style={styles.galleryContainer}>
        <Text style={[styles.galleryTitle, { color: theme.colors.text }]}>
          Screenshots ({processedScreenshots.length})
        </Text>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.container}
          snapToInterval={180 + 16}
          decelerationRate="fast"
        >
          {processedScreenshots.map((screenshot, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.screenshotContainer,
                currentImageIndex === index && modalVisible && styles.screenshotSelected,
              ]}
              onPress={() => handleImagePress(index)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: screenshot.imageURL }}
                style={[
                  styles.screenshot,
                  screenshot.width && screenshot.height
                    ? { aspectRatio: screenshot.width / screenshot.height }
                    : null,
                ]}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Modal Gallery */}
      <Modal animationType="fade" transparent visible={modalVisible} onRequestClose={closeModal}>
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.95)' }]}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <X color="#fff" size={24} />
          </TouchableOpacity>

          {/* Counter + Swipe Tip */}
          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>
              {currentImageIndex + 1} / {processedScreenshots.length}
            </Text>
          </View>

          {/* Image Carousel */}
          <FlatList
            ref={flatListRef}
            horizontal
            pagingEnabled
            data={processedScreenshots}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.fullScreenImageContainer}>
                <Image
                  source={{ uri: item.imageURL }}
                  style={styles.fullScreenImage}
                  resizeMode="contain"
                />
              </View>
            )}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            initialScrollIndex={currentImageIndex}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
          />

          {/* Swipe indicators */}
          {currentImageIndex > 0 && (
            <View style={styles.swipeIndicatorLeft}>
              <ChevronLeft color="rgba(255,255,255,0.5)" size={30} />
            </View>
          )}
          {currentImageIndex < processedScreenshots.length - 1 && (
            <View style={styles.swipeIndicatorRight}>
              <ChevronRight color="rgba(255,255,255,0.5)" size={30} />
            </View>
          )}

          {/* Pagination Dots */}
          <View style={styles.paginationContainer}>
            {processedScreenshots.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  flatListRef.current?.scrollToIndex({ index, animated: true });
                  navigateToThumbnail(index);
                }}
              >
                <View
                  style={[
                    styles.paginationDot,
                    currentImageIndex === index && styles.paginationDotActive,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  galleryContainer: {
    marginVertical: 16,
  },
  galleryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 16,
    marginBottom: 8,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  screenshotContainer: {
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  screenshotSelected: {
    borderWidth: 3,
    borderColor: Platform.OS === 'ios' ? '#007AFF' : '#3498db',
  },
  screenshot: {
    width: 180,
    height: 320,
    borderRadius: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImageContainer: {
    width: Dimensions.get('window').width,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '90%',
    height: '75%',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 20,
    zIndex: 10,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  counterContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding: 8,
    paddingHorizontal: 12,
  },
  counterText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  swipeIndicatorLeft: {
    position: 'absolute',
    left: 20,
    top: '50%',
    transform: [{ translateY: -15 }],
    opacity: 0.7,
  },
  swipeIndicatorRight: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -15 }],
    opacity: 0.7,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  paginationDotActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
});
