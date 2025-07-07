/**
 * React hooks for plugin system integration
 */

import { useState, useEffect } from 'react';
import pluginManager from './manager';
import { IDrawerExtension, IRouteExtension } from './types';

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
      let items: IDrawerExtension[] = [];

      if (isAdmin && !isOrg) {
        // Admin global
        items = pluginManager.getExtensionPoints(
          'DA1',
          userPermissions,
          isAdmin,
          isOrg,
        );
      } else if (isAdmin && isOrg) {
        // Admin org
        items = pluginManager.getExtensionPoints(
          'DA2',
          userPermissions,
          isAdmin,
          isOrg,
        );
      } else if (!isAdmin && isOrg) {
        // User org
        items = pluginManager.getExtensionPoints(
          'DU1',
          userPermissions,
          isAdmin,
          isOrg,
        );
      } else if (!isAdmin && !isOrg) {
        // User global
        items = pluginManager.getExtensionPoints(
          'DU2',
          userPermissions,
          isAdmin,
          isOrg,
        );
      }

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
      let routeExtensions: IRouteExtension[] = [];

      if (isAdmin && !isOrg) {
        // Admin global
        routeExtensions = pluginManager.getExtensionPoints(
          'RA1',
          userPermissions,
          isAdmin,
          isOrg,
        );
      } else if (isAdmin && isOrg) {
        // Admin org
        routeExtensions = pluginManager.getExtensionPoints(
          'RA2',
          userPermissions,
          isAdmin,
          isOrg,
        );
      } else if (!isAdmin && isOrg) {
        // User org
        routeExtensions = pluginManager.getExtensionPoints(
          'RU1',
          userPermissions,
          isAdmin,
          isOrg,
        );
      } else if (!isAdmin && !isOrg) {
        // User global
        routeExtensions = pluginManager.getExtensionPoints(
          'RU2',
          userPermissions,
          isAdmin,
          isOrg,
        );
      }

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

/**
 * Hook to get plugin injector extensions
 */
export function usePluginInjectors(
  injectorType: 'G1' | 'G2' | 'G3' = 'G1',
): any[] {
  const [injectors, setInjectors] = useState<any[]>([]);

  useEffect(() => {
    const updateInjectors = () => {
      const injectorExtensions = pluginManager.getExtensionPoints(
        injectorType,
        [],
        false,
        false,
      );

      setInjectors(injectorExtensions);
    };

    // Initial load
    updateInjectors();

    // Listen for plugin changes
    const handlePluginChange = () => {
      updateInjectors();
    };

    pluginManager.on('plugin:loaded', handlePluginChange);
    pluginManager.on('plugin:unloaded', handlePluginChange);
    pluginManager.on('plugin:status-changed', handlePluginChange);

    return () => {
      pluginManager.off('plugin:loaded', handlePluginChange);
      pluginManager.off('plugin:unloaded', handlePluginChange);
      pluginManager.off('plugin:status-changed', handlePluginChange);
    };
  }, [injectorType]);

  return injectors;
}
