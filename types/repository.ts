export interface Repository {
  name: string;
  identifier?: string;
  sourceURL?: string;
  subtitle?: string;
  description?: string;
  iconURL?: string;
  headerURL?: string;
  website?: string;
  tintColor?: string;
  featuredApps?: string[];
  apps: App[];
  news?: NewsItem[];
  url?: string; // URL where the repository was fetched from
  userInfo?: Record<string, any>;
}

export interface App {
  name: string;
  bundleIdentifier: string;
  developerName: string;
  subtitle: string;
  localizedDescription: string;
  iconURL: string;
  tintColor?: string;
  size?: number;
  
  // Handle both formats of screenshots
  screenshots?: Screenshot[] | ScreenshotsByDevice;
  screenshotURLs?: string[];
  
  // Handle both formats of versions
  versions?: AppVersion[];
  version?: string;
  versionDate?: string;
  versionDescription?: string;
  downloadURL?: string;
  
  permissions?: AppPermission[];
  appPermissions?: AppPermissions;
}

export interface Screenshot {
  imageURL: string;
  width?: number;
  height?: number;
}

export interface ScreenshotsByDevice {
  iphone?: (string | Screenshot)[];
  ipad?: (string | Screenshot)[];
}

export interface AppVersion {
  version: string;
  date: string;
  size: number;
  downloadURL: string;
  localizedDescription: string;
  minOSVersion?: string;
  maxOSVersion?: string;
}

interface AppPermission {
  type: string;
  usageDescription: string;
}

interface AppPermissions {
  entitlements?: string[];
  privacy?: Record<string, string>;
}

export interface NewsItem {
  title: string;
  identifier: string;
  caption: string;
  date: string;
  tintColor: string;
  imageURL: string;
  notify: boolean;
  url: string;
  appID?: string;
}