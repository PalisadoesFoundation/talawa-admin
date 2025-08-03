/**
 * Plugin System Main Entry Point
 *
 * This file exports all the main plugin system components and utilities
 * for use throughout the application.
 */

export { default as PluginManager } from './manager';

export { default as PluginRoutes } from './routes/PluginRoutes';
export { default as PluginRouteRenderer } from './routes/PluginRouteRenderer';

export {
  usePluginRoutes,
  usePluginDrawerItems,
  useLoadedPlugins,
} from './hooks';

export type {
  IPluginManifest,
  IRouteExtension,
  IDrawerExtension,
  IExtensionPoints,
  IPluginMeta,
  IPluginDetails,
  IInstalledPlugin,
  ILoadedPlugin,
  IExtensionRegistry,
  PluginStatus,
  ExtensionPointType,
  IPluginStoreProps,
  IPluginModalProps,
  IPluginDrawerItemsProps,
  IPluginRouterProps,
} from './types';

export {
  validatePluginManifest,
  generatePluginId,
  sortDrawerItems,
  filterByPermissions,
} from './utils';

export {
  pluginRegistry,
  isPluginRegistered,
  getPluginComponents,
  getPluginComponent,
  registerPluginDynamically,
  discoverAndRegisterAllPlugins,
} from './registry';

export { default as PluginInjector } from './components/PluginInjector';
export { usePluginInjectors } from './hooks';
