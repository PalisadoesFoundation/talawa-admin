/**
 * React hooks for plugin system integration
 */

import { useState, useEffect } from 'react';
import pluginManager from './manager';
import { ExtensionPointType, IDrawerExtension, IRouteExtension } from './types';

export function usePluginDrawerItems(
  userPermissions: string[] = [],
  isAdmin: boolean = false,
  isOrg?: boolean,
): IDrawerExtension[] {
  const [drawerItems, setDrawerItems] = useState<IDrawerExtension[]>([]);

  useEffect(() => {
    if (!pluginManager.isSystemInitialized()) {
      return;
    }

    const updateDrawerItems = () => {
      const items = pluginManager.getExtensionPoints(
        ExtensionPointType.DRAWER,
        userPermissions,
        isAdmin,
        isOrg,
      );
      setDrawerItems(items);
    };

    // Initial load
    updateDrawerItems();

    // Listen for plugin changes
    const handlePluginChange = () => {
      updateDrawerItems();
    };

    pluginManager.on('plugin:loaded', handlePluginChange);
    pluginManager.on('plugin:unloaded', handlePluginChange);
    pluginManager.on('plugin:status-changed', handlePluginChange);
    pluginManager.on('plugins:initialized', updateDrawerItems);

    return () => {
      pluginManager.off('plugin:loaded', handlePluginChange);
      pluginManager.off('plugin:unloaded', handlePluginChange);
      pluginManager.off('plugin:status-changed', handlePluginChange);
      pluginManager.off('plugins:initialized', updateDrawerItems);
    };
  }, [userPermissions, isAdmin, isOrg]);

  return drawerItems;
}

/**
 * Hook to get plugin routes
 */
export function usePluginRoutes(
  userPermissions: string[] = [],
  isAdmin: boolean = false,
  isOrg?: boolean,
): IRouteExtension[] {
  const [routes, setRoutes] = useState<IRouteExtension[]>([]);

  useEffect(() => {
    const updateRoutes = () => {
      const routeExtensions = pluginManager.getExtensionPoints(
        ExtensionPointType.ROUTES,
        userPermissions,
        isAdmin,
        isOrg,
      );

      setRoutes(routeExtensions);
    };

    // Initial load
    updateRoutes();

    // Listen for plugin changes
    const handlePluginChange = () => {
      updateRoutes();
    };

    pluginManager.on('plugin:loaded', handlePluginChange);
    pluginManager.on('plugin:unloaded', handlePluginChange);
    pluginManager.on('plugin:status-changed', handlePluginChange);

    return () => {
      pluginManager.off('plugin:loaded', handlePluginChange);
      pluginManager.off('plugin:unloaded', handlePluginChange);
      pluginManager.off('plugin:status-changed', handlePluginChange);
    };
  }, [userPermissions, isAdmin, isOrg]);

  return routes;
}

/**
 * Hook to get all loaded plugins with their status
 */
export function useLoadedPlugins() {
  const [plugins, setPlugins] = useState(pluginManager.getLoadedPlugins());

  useEffect(() => {
    const updatePlugins = () => {
      setPlugins(pluginManager.getLoadedPlugins());
    };

    // Listen for plugin changes
    pluginManager.on('plugin:loaded', updatePlugins);
    pluginManager.on('plugin:unloaded', updatePlugins);
    pluginManager.on('plugin:status-changed', updatePlugins);

    return () => {
      pluginManager.off('plugin:loaded', updatePlugins);
      pluginManager.off('plugin:unloaded', updatePlugins);
      pluginManager.off('plugin:status-changed', updatePlugins);
    };
  }, []);

  return plugins;
}
