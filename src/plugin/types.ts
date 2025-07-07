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
  G3?: IInjectorExtension[]; // General Injector 3 - Code injection for general components
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
  G1: IInjectorExtension[]; // General Injector 1
  G2: IInjectorExtension[]; // General Injector 2
  G3: IInjectorExtension[]; // General Injector 3
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
