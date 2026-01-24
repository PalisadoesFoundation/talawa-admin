/**
 * Dynamic Plugin Registry
 *
 * This file creates a dynamic registry that automatically discovers and registers
 * all available plugin components based on the GraphQL plugin system.
 * Components are registered automatically when plugins are loaded via the plugin manager.
 */

import React, { lazy } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { getPluginManager } from './manager';
import type {
  IPluginManifest,
  IRouteExtension,
  IInjectorExtension,
} from './types';
import styles from './registry.module.css';

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
  return function ErrorComponent() {
    const { t } = useTranslation('translation', { keyPrefix: 'plugin' });
    return (
      <div className={styles.errorContainer}>
        <h3 className={styles.errorHeading}>{t('error')}</h3>
        <p className={styles.errorText}>
          <Trans
            t={t}
            i18nKey="failedToLoad"
            values={{ componentName }}
            components={{ 1: <strong /> }}
          />
        </p>
        <p className={styles.errorText}>
          <Trans
            t={t}
            i18nKey="id"
            values={{ pluginId }}
            components={{ 1: <strong /> }}
          />
        </p>
        <p className={styles.errorSmallText}>{error}</p>
      </div>
    );
  };
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

  // Handle all route types
  const routeArrays = [
    manifest.extensionPoints?.routes,
    manifest.extensionPoints?.RA1,
    manifest.extensionPoints?.RA2,
    manifest.extensionPoints?.RU1,
    manifest.extensionPoints?.RU2,
  ];

  routeArrays.forEach((routes) => {
    if (routes) {
      routes.forEach((route: IRouteExtension) => {
        if (route.component) {
          componentNames.add(route.component);
        }
      });
    }
  });

  // Handle all injector types
  const injectorArrays = [
    manifest.extensionPoints?.G1,
    manifest.extensionPoints?.G2,
    manifest.extensionPoints?.G3,
    manifest.extensionPoints?.G4,
  ];

  injectorArrays.forEach((injectors) => {
    if (injectors) {
      injectors.forEach((injector: IInjectorExtension) => {
        if (injector.injector) {
          componentNames.add(injector.injector);
        }
      });
    }
  });

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

    const loadedPlugin = getPluginManager().getLoadedPlugin(pluginId);
    if (!loadedPlugin) {
      console.warn(`Plugin ${pluginId} not found in plugin manager`);
      return;
    }

    if (loadedPlugin.status !== 'active') {
      return;
    }

    // Use the components that are already loaded by the plugin manager
    const components = loadedPlugin.components;

    if (components && Object.keys(components).length > 0) {
      pluginRegistry[pluginId] = components;
    } else {
      console.warn(`No components found for plugin ${pluginId}`);
    }
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
