/**
 * Centralized type definitions for the Talawa plugin system
 */

import React from 'react';

// Plugin Manifest Types (Technical Configuration)
export interface IPluginManifest {
  name: string;
  pluginId: string;
  version: string;
  description: string;
  author: string;
  main: string;
  extensionPoints?: IExtensionPoints;
  icon?: string;
  homepage?: string; // Add missing homepage property
  license?: string; // Add missing license property
  tags?: string[]; // Add missing tags property
}

// Plugin Info Types (Descriptive/Marketing Data)
export interface IPluginInfo {
  homepage?: string;
  license?: string;
  tags?: string[];
  screenshots?: string[];
  features?: string[];
  changelog?: Array<{
    version: string;
    date: string;
    changes: string[];
  }>;
  requirements?: {
    talawaVersion?: string;
    nodeVersion?: string;
    dependencies?: Record<string, string>;
  };
  permissions?: string[];
  categories?: string[];
}

// Extension Point Types
export interface IExtensionPoints {
  routes?: IRouteExtension[];
  drawer?: IDrawerExtension[];
  // Route extensions with descriptive IDs and descriptions
  RA1?: IRouteExtension[]; // Route Admin Global - Routes accessible to global admins
  RA2?: IRouteExtension[]; // Route Admin Org - Routes accessible to organization admins
  RU1?: IRouteExtension[]; // Route User Org - Routes accessible to organization users
  RU2?: IRouteExtension[]; // Route User Global - Routes accessible to global users
  // Drawer extensions with descriptive IDs and descriptions
  DA1?: IDrawerExtension[]; // Drawer Admin Global - Drawer items for global admins
  DA2?: IDrawerExtension[]; // Drawer Admin Org - Drawer items for organization admins
  DU1?: IDrawerExtension[]; // Drawer User Org - Drawer items for organization users
  DU2?: IDrawerExtension[]; // Drawer User Global - Drawer items for global users
  // Injector extensions with descriptive IDs and descriptions
  G1?: IInjectorExtension[]; // General Injector 1 - Code injection for general components
  G2?: IInjectorExtension[]; // General Injector 2 - Code injection for general components
  G3?: IInjectorExtension[]; // General Injector 3 - Organization posts
  G4?: IInjectorExtension[]; // General Injector 4 - User portal posts
}

export interface IRouteExtension {
  pluginId?: string; // Optional in manifest, injected by plugin manager
  path: string;
  component: string;
  exact?: boolean;
  permissions?: string[];
}

export interface IDrawerExtension {
  pluginId?: string; // Optional in manifest, injected by plugin manager
  label: string;
  icon: string;
  path: string;
  permissions?: string[];
  order?: number;
}

export interface IInjectorExtension {
  pluginId?: string; // Optional in manifest, injected by plugin manager
  injector: string; // Component name to inject
  description?: string; // Description of what this injector does
  target?: string; // Optional target identifier for specific injection points
  order?: number; // Optional display order
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
  features?: string[];
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
  info?: IPluginInfo;
  status: 'active' | 'inactive' | 'error';
  error?: string;
  errorMessage?: string; // Additional error message property
  components?: Record<string, React.ComponentType<Record<string, unknown>>>; // Plugin components
}

export interface IExtensionRegistry {
  routes: IRouteExtension[];
  drawer: IDrawerExtension[];
  // Route extensions with descriptive IDs
  RA1: IRouteExtension[]; // Route Admin Global
  RA2: IRouteExtension[]; // Route Admin Org
  RU1: IRouteExtension[]; // Route User Org
  RU2: IRouteExtension[]; // Route User Global
  // Drawer extensions with descriptive IDs
  DA1: IDrawerExtension[]; // Drawer Admin Global
  DA2: IDrawerExtension[]; // Drawer Admin Org
  DU1: IDrawerExtension[]; // Drawer User Org
  DU2: IDrawerExtension[]; // Drawer User Global
  // Injector extensions with descriptive IDs
  G1: IInjectorExtension[]; // General Injector 1 - User transactions
  G2: IInjectorExtension[]; // General Injector 2 - Organization transactions
  G3: IInjectorExtension[]; // General Injector 3 - Organization posts
  G4: IInjectorExtension[]; // General Injector 4 - User portal posts
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

// Plugin Lifecycle Types
export interface IPluginLifecycle {
  onActivate?: () => Promise<void>;
  onDeactivate?: () => Promise<void>;
  onInstall?: () => Promise<void>;
  onUninstall?: () => Promise<void>;
  onUpdate?: (fromVersion: string, toVersion: string) => Promise<void>;
}
