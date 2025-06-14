/**
 * Dynamic Plugin Registry
 *
 * This file creates a dynamic registry that automatically discovers and registers
 * all available plugin components based on the GraphQL plugin system.
 * Components are registered automatically when plugins are loaded via the plugin manager.
 */

import React, { lazy } from 'react';
import pluginManager from './manager';
import type {
  IPluginManifest,
  IRouteExtension,
  IDrawerExtension,
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

  return () =>
    React.createElement(
      'div',
      { style: errorStyles.container },
      React.createElement('h3', { style: errorStyles.heading }, 'Plugin Error'),
      React.createElement(
        'p',
        { style: errorStyles.text },
        'Failed to load component: ',
        React.createElement('strong', null, componentName),
      ),
      React.createElement(
        'p',
        { style: errorStyles.text },
        'Plugin: ',
        React.createElement('strong', null, pluginId),
      ),
      React.createElement('p', { style: errorStyles.smallText }, error),
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
      const componentPath = `./available/${pluginId}/pages/${componentName}`;
      const module = await import(componentPath);
      return { default: module.default || module[componentName] };
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

  if (manifest.extensionPoints?.routes) {
    manifest.extensionPoints.routes.forEach((route: IRouteExtension) => {
      if (route.component) {
        componentNames.add(route.component);
      }
    });
  }

  // Drawer items don't have components, they use the path to determine the component
  if (manifest.extensionPoints?.drawer) {
    manifest.extensionPoints.drawer.forEach((item: IDrawerExtension) => {
      // Extract component name from path (e.g., /user/plugin-name -> plugin-name)
      const pathParts = item.path.split('/').filter(Boolean);
      if (pathParts.length > 0) {
        const componentName = pathParts[pathParts.length - 1];
        componentNames.add(componentName);
      }
    });
  }

  return componentNames;
}

/**
 * Register a plugin dynamically by discovering its components from manifest
 */
export async function registerPluginDynamically(
  pluginId: string,
): Promise<void> {
  try {
    if (pluginRegistry[pluginId]) {
      return;
    }

    const loadedPlugin = pluginManager.getLoadedPlugin(pluginId);
    if (!loadedPlugin) {
      console.warn(`Plugin ${pluginId} is not loaded in plugin manager`);
      return;
    }

    if (loadedPlugin.status !== 'active') {
      return;
    }

    const manifest = await getPluginManifest(pluginId);
    if (!manifest) {
      console.warn(`No manifest found for plugin: ${pluginId}`);
      return;
    }

    const componentNames = extractComponentNames(manifest);
    const components: Record<string, React.ComponentType> = {};

    componentNames.forEach((componentName) => {
      components[componentName] = createLazyPluginComponent(
        pluginId,
        componentName,
      );
    });

    pluginRegistry[pluginId] = components;
  } catch (error) {
    console.error(`Failed to register plugin '${pluginId}':`, error);
  }
}

/**
 * Discover and register all plugins from plugin manager
 */
export async function discoverAndRegisterAllPlugins(): Promise<void> {
  try {
    const loadedPlugins = pluginManager.getLoadedPlugins();

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
  return pluginRegistry[pluginId]?.[componentName] || null;
}

/**
 * Initialize the plugin system (call this on app startup)
 */
export async function initializePluginSystem(): Promise<void> {
  await discoverAndRegisterAllPlugins();
}
