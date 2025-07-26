/**
 * Dynamic Plugin Registry
 *
 * This file creates a dynamic registry that automatically discovers and registers
 * all available plugin components based on the GraphQL plugin system.
 * Components are registered automatically when plugins are loaded via the plugin manager.
 */

import React, { lazy } from 'react';
import { getPluginManager } from './manager';
import type {
  IPluginManifest,
  IRouteExtension,
  IDrawerExtension,
  IInjectorExtension,
} from './types';

/**
 * Dynamic Plugin Component Registry
 * This will be populated automatically based on discovered plugins
 */
export const pluginRegistry: Record<
  string,
  Record<string, React.ComponentType>
> = {};

// Cache for plugin manifests to avoid repeated fetches
const manifestCache: Record<string, IPluginManifest> = {};

/**
 * Create an error component for failed plugin loads
 */
function createErrorComponent(
  pluginId: string,
  componentName: string,
  error: string,
): React.ComponentType {
  const errorStyles = {
    container: {
      padding: '40px',
      textAlign: 'center' as const,
      backgroundColor: '#f8f9fa',
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      margin: '20px',
    },
    heading: {
      color: '#dc3545',
      marginBottom: '16px',
    },
    text: {
      color: '#6c757d',
      marginBottom: '8px',
    },
    smallText: {
      color: '#6c757d',
      fontSize: '14px',
    },
  };

  return () => (
    <div style={errorStyles.container}>
      <h3 style={errorStyles.heading}>Plugin Error</h3>
      <p style={errorStyles.text}>
        Failed to load component: <strong>{componentName}</strong>
      </p>
      <p style={errorStyles.text}>
        Plugin: <strong>{pluginId}</strong>
      </p>
      <p style={errorStyles.smallText}>{error}</p>
    </div>
  );
}

/**
 * Dynamically import a plugin component with lazy loading
 */
function createLazyPluginComponent(
  pluginId: string,
  componentName: string,
): React.ComponentType {
  return lazy(async () => {
    try {
      // Use the plugin manager to get the component
      const component = getPluginManager().getPluginComponent(
        pluginId,
        componentName,
      );

      if (component) {
        return { default: component };
      } else {
        throw new Error(
          `Component ${componentName} not found in plugin ${pluginId}`,
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error(
        `Failed to load component ${componentName} from plugin ${pluginId}:`,
        error,
      );
      return {
        default: createErrorComponent(pluginId, componentName, errorMessage),
      };
    }
  });
}

/**
 * Get plugin manifest from cache or load it
 */
async function getPluginManifest(
  pluginId: string,
): Promise<IPluginManifest | null> {
  if (manifestCache[pluginId]) {
    return manifestCache[pluginId];
  }

  try {
    const response = await fetch(
      `/src/plugin/available/${pluginId}/manifest.json`,
    );
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to load manifest`);
    }
    const manifest = await response.json();
    manifestCache[pluginId] = manifest;
    return manifest;
  } catch (error) {
    console.error(`Failed to load manifest for plugin ${pluginId}:`, error);
    return null;
  }
}

/**
 * Extract component names from plugin manifest
 */
function extractComponentNames(manifest: IPluginManifest): Set<string> {
  const componentNames = new Set<string>();

  console.log('=== EXTRACTING COMPONENT NAMES ===');
  console.log('Plugin manifest:', manifest.pluginId);

  // Handle all route types
  const routeArrays = [
    manifest.extensionPoints?.routes,
    manifest.extensionPoints?.RA1,
    manifest.extensionPoints?.RA2,
    manifest.extensionPoints?.RU1,
    manifest.extensionPoints?.RU2,
  ];

  routeArrays.forEach((routes, index) => {
    if (routes) {
      const routeType = ['routes', 'RA1', 'RA2', 'RU1', 'RU2'][index];
      console.log(`${routeType} found:`, routes.length);
      routes.forEach((route: IRouteExtension) => {
        console.log('Route:', route.path, 'Component:', route.component);
        if (route.component) {
          componentNames.add(route.component);
        }
      });
    }
  });

  // Handle all drawer types
  const drawerArrays = [
    manifest.extensionPoints?.drawer,
    manifest.extensionPoints?.DA1,
    manifest.extensionPoints?.DA2,
    manifest.extensionPoints?.DU1,
    manifest.extensionPoints?.DU2,
  ];

  drawerArrays.forEach((drawer, index) => {
    if (drawer) {
      const drawerType = ['drawer', 'DA1', 'DA2', 'DU1', 'DU2'][index];
      console.log(`${drawerType} found:`, drawer.length);
    }
  });

  // Handle all injector types
  const injectorArrays = [
    manifest.extensionPoints?.G1,
    manifest.extensionPoints?.G2,
    manifest.extensionPoints?.G3,
  ];

  injectorArrays.forEach((injectors, index) => {
    if (injectors) {
      const injectorType = ['G1', 'G2', 'G3'][index];
      console.log(`${injectorType} found:`, injectors.length);
      injectors.forEach((injector: IInjectorExtension) => {
        console.log(
          'Injector:',
          injector.injector,
          'Description:',
          injector.description,
        );
        if (injector.injector) {
          componentNames.add(injector.injector);
        }
      });
    }
  });

  console.log('=== COMPONENT NAMES EXTRACTED ===');
  console.log('Component names:', Array.from(componentNames));
  return componentNames;
}

/**
 * Register a plugin dynamically by discovering its components from manifest
 */
export async function registerPluginDynamically(
  pluginId: string,
): Promise<void> {
  try {
    console.log(`=== REGISTERING PLUGIN: ${pluginId} ===`);

    if (pluginRegistry[pluginId]) {
      console.log(`Plugin ${pluginId} already registered, skipping`);
      return;
    }

    const loadedPlugin = getPluginManager().getLoadedPlugin(pluginId);
    if (!loadedPlugin) {
      console.warn(`Plugin ${pluginId} not found in plugin manager`);
      return;
    }

    console.log(`Plugin status: ${loadedPlugin.status}`);
    if (loadedPlugin.status !== 'active') {
      console.log(`Plugin ${pluginId} is not active, skipping`);
      return;
    }

    // Use the components that are already loaded by the plugin manager
    const components = loadedPlugin.components;

    console.log(
      `Components from plugin manager:`,
      Object.keys(components || {}),
    );

    if (components && Object.keys(components).length > 0) {
      pluginRegistry[pluginId] = components;
      console.log(
        `Plugin ${pluginId} registered successfully with components:`,
        Object.keys(components),
      );
    } else {
      console.warn(`No components found for plugin ${pluginId}`);
    }

    console.log(`=== END REGISTERING PLUGIN: ${pluginId} ===`);
  } catch (error) {
    console.error(`Failed to register plugin '${pluginId}':`, error);
  }
}

/**
 * Discover and register all plugins from plugin manager
 */
export async function discoverAndRegisterAllPlugins(): Promise<void> {
  try {
    const loadedPlugins = getPluginManager().getLoadedPlugins();

    if (!loadedPlugins?.length) {
      console.warn('No plugins loaded in plugin manager');
      return;
    }

    const activePlugins = loadedPlugins
      .filter((plugin) => plugin.status === 'active')
      .map((plugin) => plugin.id);

    await Promise.all(
      activePlugins.map((pluginId) => registerPluginDynamically(pluginId)),
    );
  } catch (error) {
    console.error('Failed to discover and register plugins:', error);
  }
}

/**
 * Check if a plugin is registered
 */
export function isPluginRegistered(pluginId: string): boolean {
  return Boolean(pluginRegistry[pluginId]);
}

/**
 * Get all components for a plugin
 */
export function getPluginComponents(
  pluginId: string,
): Record<string, React.ComponentType> | null {
  return pluginRegistry[pluginId] || null;
}

/**
 * Get a specific component from a plugin
 */
export function getPluginComponent(
  pluginId: string,
  componentName: string,
): React.ComponentType | null {
  // First try the registry
  const registryComponent = pluginRegistry[pluginId]?.[componentName];
  if (registryComponent) {
    return registryComponent;
  }

  // Fallback to plugin manager
  return getPluginManager().getPluginComponent(pluginId, componentName) || null;
}

/**
 * Initialize the plugin system (call this on app startup)
 */
export async function initializePluginSystem(): Promise<void> {
  await discoverAndRegisterAllPlugins();
}

// Export internal functions for testing
export {
  createErrorComponent,
  createLazyPluginComponent,
  getPluginManifest,
  extractComponentNames,
  manifestCache,
};
