/**
 * Centralized type definitions for the Talawa plugin system
 */

import React from 'react';

// Plugin Manifest Types
export interface IPluginManifest {
  name: string;
  pluginId: string;
  version: string;
  description: string;
  author: string;
  main: string;
  extensionPoints?: IExtensionPoints;
  icon?: string;
  homepage?: string;
  license?: string;
  tags?: string[];
}

// Extension Point Types
export interface IExtensionPoints {
  routes?: IRouteExtension[];
  drawer?: IDrawerExtension[];
}

export interface IRouteExtension {
  pluginId: string;
  path: string;
  component: string;
  exact?: boolean;
  isAdmin?: boolean;
  permissions?: string[];
}

export interface IDrawerExtension {
  pluginId: string;
  label: string;
  icon: string;
  path: string;
  isAdmin?: boolean;
  permissions?: string[];
  order?: number;
}

// Plugin Store Types
export interface IPluginMeta {
  id: string;
  name: string;
  description: string;
  author: string;
  icon: string;
}

export interface IPluginDetails extends IPluginMeta {
  version: string;
  cdnUrl: string;
  readme: string;
  screenshots: string[];
  homepage?: string;
  license?: string;
  tags?: string[];
  downloads?: number;
  rating?: number;
  changelog: Array<{
    version: string;
    date: string;
    changes: string[];
  }>;
}

export interface IInstalledPlugin extends IPluginDetails {
  status: 'active' | 'inactive';
}

// Plugin Manager Types
export interface ILoadedPlugin {
  id: string;
  manifest: IPluginManifest;
  components: Record<string, React.ComponentType>;
  status: PluginStatus;
  errorMessage?: string;
}

export interface IExtensionRegistry {
  routes: IRouteExtension[];
  drawer: IDrawerExtension[];
}

// Enums
export enum PluginStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error',
}

export enum ExtensionPointType {
  ROUTES = 'routes',
  DRAWER = 'drawer',
}

// Plugin Store Component Props
export interface IPluginStoreProps {
  userPermissions?: string[];
  isAdmin?: boolean;
}

export interface IPluginModalProps {
  show: boolean;
  onHide: () => void;
  pluginId: string | null;
  meta: IPluginMeta | null;
  loading: boolean;
  isInstalled: (pluginName: string) => boolean;
  getInstalledPlugin: (pluginName: string) => IInstalledPlugin | undefined;
  installPlugin: (plugin: IPluginMeta) => void;
  togglePluginStatus: (
    plugin: IPluginMeta,
    status: 'active' | 'inactive',
  ) => void;
  uninstallPlugin: (plugin: IPluginMeta) => void;
}

export interface IPluginDrawerItemsProps {
  userPermissions?: string[];
  isAdmin?: boolean;
  className?: string;
  itemClassName?: string;
  activeClassName?: string;
  onItemClick?: (item: IDrawerExtension) => void;
}

export interface IPluginRouterProps {
  userPermissions?: string[];
  isAdmin?: boolean;
}
