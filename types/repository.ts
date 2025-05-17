export interface Repository {
  name: string;
  subtitle: string;
  description: string;
  iconURL: string;
  headerURL: string;
  website: string;
  tintColor: string;
  featuredApps: string[];
  apps: App[];
  news: NewsItem[];
  url: string; // URL where the repository was fetched from
}

export interface App {
  name: string;
  bundleIdentifier: string;
  developerName: string;
  subtitle: string;
  localizedDescription: string;
  iconURL: string;
  tintColor: string;
  screenshots: Screenshot[] | ScreenshotsByDevice;
  versions: AppVersion[];
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

export interface AppPermissions {
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
  url?: string;
  appID?: string;
}