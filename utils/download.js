import * as WebBrowser from 'expo-web-browser';
import { Linking } from 'react-native';
import { getStoredDownloadOption } from './storage';
import { DOWNLOAD_OPTIONS } from '../types/theme';

export const handleDownload = async (url) => {
  if (!url) return;

  const downloadOptionId = await getStoredDownloadOption();
  const option = DOWNLOAD_OPTIONS.find(opt => opt.id === downloadOptionId);
  const formattedUrl = option ? option.getUrl(url) : url;

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