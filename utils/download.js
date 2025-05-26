import * as WebBrowser from 'expo-web-browser';
import { Linking } from 'react-native';
import { getStoredDownloadOption } from './storage';
import { DOWNLOAD_OPTIONS } from '../types/theme';
import { getStoredCustomScheme } from './storage';

export const handleDownload = async (url) => {
  if (!url) return;

  const downloadOptionId = await getStoredDownloadOption();
  const option = DOWNLOAD_OPTIONS.find(opt => opt.id === downloadOptionId);
  
  let formattedUrl = url;
  if (option) {
    if (option.id === 'custom') {
      const customScheme = await getStoredCustomScheme();
      console.log('Retrieved custom scheme:', customScheme);
      formattedUrl = option.getUrl(url, customScheme);
      console.log('Formatted URL with custom scheme:', formattedUrl);
    } else {
      formattedUrl = option.getUrl(url);
      console.log('Formatted URL with default option:', formattedUrl);
    }
  }

  console.log('Attempting to open URL:', formattedUrl);

  try {
    const canOpen = await Linking.canOpenURL(formattedUrl);
    if (canOpen) {
      await Linking.openURL(formattedUrl);
    } else {
      await WebBrowser.openBrowserAsync(url);
    }
  } catch (e) {
    console.error('Failed to open URL:', e);
  }
}; 