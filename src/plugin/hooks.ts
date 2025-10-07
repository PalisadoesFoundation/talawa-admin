/**
 * React hooks for plugin system integration
 */

import { useState, useEffect } from 'react';
import { getPluginManager } from './manager';
import { IDrawerExtension, IRouteExtension, IInjectorExtension } from './types';

export function usePluginDrawerItems(
  userPermissions: string[] = [],
  isAdmin: boolean = false,
  isOrg?: boolean,
): IDrawerExtension[] {
  const [drawerItems, setDrawerItems] = useState<IDrawerExtension[]>([]);

  useEffect(() => {
    const updateDrawerItems = () => {
      // Only update if system is initialized
      if (!getPluginManager().isSystemInitialized()) {
        return;
      }

      let items: IDrawerExtension[] = [];

      if (isAdmin && !isOrg) {
        // Admin global
        items = getPluginManager().getExtensionPoints('DA1');
      } else if (isAdmin && isOrg) {
        // Admin org
        items = getPluginManager().getExtensionPoints('DA2');
      } else if (!isAdmin && isOrg) {
        // User org
        items = getPluginManager().getExtensionPoints('DU1');
      } else if (!isAdmin && !isOrg) {
        // User global
        items = getPluginManager().getExtensionPoints('DU2');
      }

      setDrawerItems(items);
    };

    // Initial load
    updateDrawerItems();

    // Listen for plugin changes
    const handlePluginChange = () => {
      updateDrawerItems();
    };

    getPluginManager().on('plugin:loaded', handlePluginChange);
    getPluginManager().on('plugin:unloaded', handlePluginChange);
    getPluginManager().on('plugin:status-changed', handlePluginChange);
    getPluginManager().on('plugins:initialized', updateDrawerItems);

    return () => {
      getPluginManager().off('plugin:loaded', handlePluginChange);
      getPluginManager().off('plugin:unloaded', handlePluginChange);
      getPluginManager().off('plugin:status-changed', handlePluginChange);
      getPluginManager().off('plugins:initialized', updateDrawerItems);
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
      // Only update if system is initialized
      if (!getPluginManager().isSystemInitialized()) {
        return;
      }

      let routeExtensions: IRouteExtension[] = [];

      if (isAdmin && !isOrg) {
        // Admin global
        routeExtensions = getPluginManager().getExtensionPoints('RA1');
      } else if (isAdmin && isOrg) {
        // Admin org
        routeExtensions = getPluginManager().getExtensionPoints('RA2');
      } else if (!isAdmin && isOrg) {
        // User org
        routeExtensions = getPluginManager().getExtensionPoints('RU1');
      } else if (!isAdmin && !isOrg) {
        // User global
        routeExtensions = getPluginManager().getExtensionPoints('RU2');
      }

      setRoutes(routeExtensions);
    };

    // Initial load
    updateRoutes();

    // Listen for plugin changes
    const handlePluginChange = () => {
      updateRoutes();
    };

    getPluginManager().on('plugin:loaded', handlePluginChange);
    getPluginManager().on('plugin:unloaded', handlePluginChange);
    getPluginManager().on('plugin:status-changed', handlePluginChange);
    getPluginManager().on('plugins:initialized', updateRoutes);

    return () => {
      getPluginManager().off('plugin:loaded', handlePluginChange);
      getPluginManager().off('plugin:unloaded', handlePluginChange);
      getPluginManager().off('plugin:status-changed', handlePluginChange);
      getPluginManager().off('plugins:initialized', updateRoutes);
    };
  }, [userPermissions, isAdmin, isOrg]);

  return routes;
}

/**
 * Hook to get all loaded plugins with their status
 */
export function useLoadedPlugins() {
  const [plugins, setPlugins] = useState(getPluginManager().getLoadedPlugins());

  useEffect(() => {
    const updatePlugins = () => {
      setPlugins(getPluginManager().getLoadedPlugins());
    };

    // Listen for plugin changes
    getPluginManager().on('plugin:loaded', updatePlugins);
    getPluginManager().on('plugin:unloaded', updatePlugins);
    getPluginManager().on('plugin:status-changed', updatePlugins);

    return () => {
      getPluginManager().off('plugin:loaded', updatePlugins);
      getPluginManager().off('plugin:unloaded', updatePlugins);
      getPluginManager().off('plugin:status-changed', updatePlugins);
    };
  }, []);

  return plugins;
}

/**
 * Hook to get plugin injector extensions
 */
export function usePluginInjectors(
  injectorType: 'G1' | 'G2' | 'G3' | 'G4' = 'G1',
): IInjectorExtension[] {
  const [injectors, setInjectors] = useState<IInjectorExtension[]>([]);

  useEffect(() => {
    const updateInjectors = () => {
      // Only update if system is initialized
      if (!getPluginManager().isSystemInitialized()) {
        return;
      }

      const injectorExtensions =
        getPluginManager().getExtensionPoints(injectorType);

      setInjectors(injectorExtensions);
    };

    // Initial load
    updateInjectors();

    // Listen for plugin changes
    const handlePluginChange = () => {
      updateInjectors();
    };

    getPluginManager().on('plugin:loaded', handlePluginChange);
    getPluginManager().on('plugin:unloaded', handlePluginChange);
    getPluginManager().on('plugin:status-changed', handlePluginChange);
    getPluginManager().on('plugins:initialized', updateInjectors);

    return () => {
      getPluginManager().off('plugin:loaded', handlePluginChange);
      getPluginManager().off('plugin:unloaded', handlePluginChange);
      getPluginManager().off('plugin:status-changed', handlePluginChange);
      getPluginManager().off('plugins:initialized', updateInjectors);
    };
  }, [injectorType]);

  return injectors;
}
