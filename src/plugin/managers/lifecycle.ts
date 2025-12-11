/**
 * Plugin Lifecycle Manager
 * Handles plugin loading, unloading, and status management
 */

import React from 'react';
import { ILoadedPlugin, PluginStatus } from '../types';
import { DiscoveryManager } from './discovery';
import { ExtensionRegistryManager } from './extension-registry';
import { EventManager } from './event-manager';
import { registerPluginDynamically } from '../registry';

export class LifecycleManager {
  private loadedPlugins: Map<string, ILoadedPlugin> = new Map();

  constructor(
    private discoveryManager: DiscoveryManager,
    private extensionRegistry: ExtensionRegistryManager,
    private eventManager: EventManager,
  ) {}

  getLoadedPlugins(): ILoadedPlugin[] {
    return Array.from(this.loadedPlugins.values());
  }

  getLoadedPlugin(pluginId: string): ILoadedPlugin | undefined {
    if (!this.isValidPluginId(pluginId)) {
      return undefined;
    }
    return this.loadedPlugins.get(pluginId);
  }

  getPluginComponent(
    pluginId: string,
    componentName: string,
  ): React.ComponentType | undefined {
    if (!this.isValidPluginId(pluginId) || !componentName) {
      return undefined;
    }

    const plugin = this.loadedPlugins.get(pluginId);
    if (!plugin || plugin.status !== PluginStatus.ACTIVE) {
      return undefined;
    }

    return plugin.components?.[componentName];
  }

  getPluginCount(): number {
    return this.loadedPlugins.size;
  }

  getActivePluginCount(): number {
    return this.getLoadedPlugins().filter(
      (plugin) => plugin.status === PluginStatus.ACTIVE,
    ).length;
  }

  async loadPlugin(pluginId: string): Promise<boolean> {
    if (!this.isValidPluginId(pluginId)) {
      console.error('Invalid plugin ID provided');
      return false;
    }

    // Check if plugin is installed before loading
    if (!this.discoveryManager.isPluginInstalled(pluginId)) {
      console.warn(`Plugin ${pluginId} is not installed, skipping load`);
      return false;
    }

    try {
      const manifest = await this.discoveryManager.loadPluginManifest(pluginId);
      const components = await this.discoveryManager.loadPluginComponents(
        pluginId,
        manifest,
      );
      const status = this.determineInitialPluginStatus(pluginId);

      const loadedPlugin: ILoadedPlugin = {
        id: pluginId,
        manifest,
        components,
        status,
      };

      this.loadedPlugins.set(pluginId, loadedPlugin);

      if (status === PluginStatus.ACTIVE) {
        this.extensionRegistry.registerExtensionPoints(pluginId, manifest);
      }

      await this.discoveryManager.syncPluginWithGraphQL(pluginId);

      this.eventManager.emit('plugin:loaded', pluginId);

      return true;
    } catch (error) {
      this.handlePluginLoadError(pluginId, error);
      return false;
    }
  }

  async unloadPlugin(pluginId: string): Promise<boolean> {
    if (!this.isValidPluginId(pluginId)) {
      console.error('Invalid plugin ID provided for unloading');
      return false;
    }

    try {
      const plugin = this.loadedPlugins.get(pluginId);
      if (!plugin) {
        console.warn(`Plugin ${pluginId} not found for unloading`);
        return false;
      }

      this.extensionRegistry.unregisterExtensionPoints(pluginId);
      this.loadedPlugins.delete(pluginId);

      await this.discoveryManager.removePluginFromGraphQL(pluginId);
      await this.attemptPluginDirectoryDeletion(pluginId);

      this.eventManager.emit('plugin:unloaded', pluginId);

      return true;
    } catch (error) {
      console.error(`Failed to unload plugin ${pluginId}:`, error);
      return false;
    }
  }

  async togglePluginStatus(
    pluginId: string,
    status: 'active' | 'inactive',
  ): Promise<boolean> {
    if (status === 'active') {
      return this.activatePlugin(pluginId);
    } else {
      return this.deactivatePlugin(pluginId);
    }
  }

  async activatePlugin(pluginId: string): Promise<boolean> {
    if (!this.isValidPluginId(pluginId)) {
      console.error('Invalid plugin ID provided for activation');
      return false;
    }

    const plugin = this.loadedPlugins.get(pluginId);
    if (!plugin) {
      console.error(`Plugin ${pluginId} not found for activation`);
      return false;
    }

    try {
      // Call onActivate lifecycle hook
      await this.callOnActivateHook(pluginId, plugin.components);

      // Update database status
      await this.discoveryManager.updatePluginStatusInGraphQL(
        pluginId,
        'active',
      );

      // Update local status
      this.updateLocalPluginStatus(plugin, pluginId, 'active');

      // Register extension points
      await this.updateExtensionPoints(pluginId, 'active', plugin);

      this.eventManager.emit('plugin:activated', pluginId);
      return true;
    } catch (error) {
      console.error(`Failed to activate plugin ${pluginId}:`, error);
      return false;
    }
  }

  async deactivatePlugin(pluginId: string): Promise<boolean> {
    if (!this.isValidPluginId(pluginId)) {
      console.error('Invalid plugin ID provided for deactivation');
      return false;
    }

    const plugin = this.loadedPlugins.get(pluginId);
    if (!plugin) {
      console.error(`Plugin ${pluginId} not found for deactivation`);
      return false;
    }

    try {
      // Call onDeactivate lifecycle hook
      await this.callOnDeactivateHook(pluginId, plugin.components);

      // Update database status
      await this.discoveryManager.updatePluginStatusInGraphQL(
        pluginId,
        'inactive',
      );

      // Update local status
      this.updateLocalPluginStatus(plugin, pluginId, 'inactive');

      // Unregister extension points
      await this.updateExtensionPoints(pluginId, 'inactive', plugin);

      this.eventManager.emit('plugin:deactivated', pluginId);
      return true;
    } catch (error) {
      console.error(`Failed to deactivate plugin ${pluginId}:`, error);
      return false;
    }
  }

  async installPlugin(pluginId: string): Promise<boolean> {
    if (!this.isValidPluginId(pluginId)) {
      console.error('Invalid plugin ID provided for installation');
      return false;
    }

    try {
      // Check if plugin is already loaded
      const existingPlugin = this.loadedPlugins.get(pluginId);
      if (existingPlugin) {
        // Plugin is already loaded, just call onInstall hook
        await this.callOnInstallHook(pluginId, existingPlugin.components);
        this.eventManager.emit('plugin:installed', pluginId);
        return true;
      }

      // Load the plugin directly without checking installation status
      let manifest;
      let components;

      try {
        manifest = await this.discoveryManager.loadPluginManifest(pluginId);
        components = await this.discoveryManager.loadPluginComponents(
          pluginId,
          manifest,
        );
      } catch (loadError) {
        console.error(
          `Failed to load plugin files for ${pluginId}:`,
          loadError,
        );
        throw loadError;
      }

      const loadedPlugin: ILoadedPlugin = {
        id: pluginId,
        manifest,
        components,
        status: PluginStatus.INACTIVE, // Start as inactive
      };

      this.loadedPlugins.set(pluginId, loadedPlugin);

      // Call onInstall lifecycle hook
      await this.callOnInstallHook(pluginId, components);

      this.eventManager.emit('plugin:installed', pluginId);
      return true;
    } catch (error) {
      console.error(`Failed to install plugin ${pluginId}:`, error);
      return false;
    }
  }

  async uninstallPlugin(pluginId: string): Promise<boolean> {
    if (!this.isValidPluginId(pluginId)) {
      console.error('Invalid plugin ID provided for uninstallation');
      return false;
    }

    const plugin = this.loadedPlugins.get(pluginId);
    if (!plugin) {
      console.error(`Plugin ${pluginId} not found for uninstallation`);
      return false;
    }

    try {
      // Call onUninstall lifecycle hook
      await this.callOnUninstallHook(pluginId, plugin.components);

      // Unload the plugin
      await this.unloadPlugin(pluginId);

      this.eventManager.emit('plugin:uninstalled', pluginId);
      return true;
    } catch (error) {
      console.error(`Failed to uninstall plugin ${pluginId}:`, error);
      return false;
    }
  }

  private isValidPluginId(pluginId: string): boolean {
    if (!pluginId || typeof pluginId !== 'string') {
      return false;
    }

    // Plugin ID should support camelCase, PascalCase, and underscore formats
    // Must start with a letter, can contain letters, numbers, and underscores
    // No hyphens allowed since plugin IDs will be prefixed to GraphQL queries/mutations
    const pluginIdRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
    return pluginIdRegex.test(pluginId);
  }

  private determineInitialPluginStatus(pluginId: string): PluginStatus {
    // Check if plugin is installed first
    if (!this.discoveryManager.isPluginInstalled(pluginId)) {
      return PluginStatus.INACTIVE;
    }

    // Then check if it's activated
    const isActive = this.discoveryManager.isPluginActivated(pluginId);
    return isActive ? PluginStatus.ACTIVE : PluginStatus.INACTIVE;
  }

  private handlePluginLoadError(pluginId: string, error: unknown): void {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    console.error(`Failed to load plugin ${pluginId}:`, errorMessage);

    this.loadedPlugins.set(pluginId, {
      id: pluginId,
      manifest: {
        name: pluginId,
        pluginId: pluginId,
        version: '0.0.0',
        description: '',
        author: '',
        main: '',
      },
      components: {},
      status: PluginStatus.ERROR,
      errorMessage,
    });

    this.eventManager.emit('plugin:error', pluginId, error);
  }

  private updateLocalPluginStatus(
    plugin: ILoadedPlugin,
    pluginId: string,
    status: 'active' | 'inactive',
  ): void {
    plugin.status =
      status === 'active' ? PluginStatus.ACTIVE : PluginStatus.INACTIVE;
    this.loadedPlugins.set(pluginId, plugin);
  }

  private async updateExtensionPoints(
    pluginId: string,
    status: 'active' | 'inactive',
    plugin: ILoadedPlugin,
  ): Promise<void> {
    if (status === 'inactive') {
      this.extensionRegistry.unregisterExtensionPoints(pluginId);
    } else if (plugin.manifest) {
      this.extensionRegistry.registerExtensionPoints(pluginId, plugin.manifest);

      try {
        await registerPluginDynamically(pluginId);
        this.eventManager.emit('plugin:loaded', pluginId);
      } catch (error) {
        console.warn(
          `Failed to register plugin ${pluginId} dynamically:`,
          error,
        );
      }
    }
  }

  private async attemptPluginDirectoryDeletion(
    pluginId: string,
  ): Promise<void> {
    try {
      const response = await fetch(`/src/plugin/available/${pluginId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        console.warn(
          `Plugin directory deletion returned HTTP ${response.status}`,
        );
      }
    } catch (error) {
      console.warn(`Could not delete plugin directory for ${pluginId}:`, error);
    }
  }

  /**
   * Call the onInstall lifecycle hook for a plugin
   */
  private async callOnInstallHook(
    pluginId: string,
    components: Record<string, React.ComponentType> | undefined,
  ): Promise<void> {
    if (!components) return;

    try {
      // Look for the default export which should contain the lifecycle hooks
      const defaultExport = components.default;
      if (
        defaultExport &&
        typeof defaultExport === 'object' &&
        'onInstall' in defaultExport
      ) {
        const lifecycle = defaultExport as { onInstall?: () => Promise<void> };
        if (typeof lifecycle.onInstall === 'function') {
          await lifecycle.onInstall();
        }
      }
    } catch (error) {
      console.error(
        `Error calling onInstall lifecycle hook for plugin ${pluginId}:`,
        error,
      );
      // Don't throw error - this shouldn't prevent the plugin from loading
    }
  }

  /**
   * Call the onActivate lifecycle hook for a plugin
   */
  private async callOnActivateHook(
    pluginId: string,
    components: Record<string, React.ComponentType> | undefined,
  ): Promise<void> {
    if (!components) return;

    try {
      // Look for the default export which should contain the lifecycle hooks
      const defaultExport = components.default;
      if (
        defaultExport &&
        typeof defaultExport === 'object' &&
        'onActivate' in defaultExport
      ) {
        const lifecycle = defaultExport as { onActivate?: () => Promise<void> };
        if (typeof lifecycle.onActivate === 'function') {
          await lifecycle.onActivate();
        }
      }
    } catch (error) {
      console.error(
        `Error calling onActivate lifecycle hook for plugin ${pluginId}:`,
        error,
      );
      // Don't throw error - this shouldn't prevent the plugin from activating
    }
  }

  /**
   * Call the onDeactivate lifecycle hook for a plugin
   */
  private async callOnDeactivateHook(
    pluginId: string,
    components: Record<string, React.ComponentType> | undefined,
  ): Promise<void> {
    if (!components) return;

    try {
      // Look for the default export which should contain the lifecycle hooks
      const defaultExport = components.default;
      if (
        defaultExport &&
        typeof defaultExport === 'object' &&
        'onDeactivate' in defaultExport
      ) {
        const lifecycle = defaultExport as {
          onDeactivate?: () => Promise<void>;
        };
        if (typeof lifecycle.onDeactivate === 'function') {
          await lifecycle.onDeactivate();
        }
      }
    } catch (error) {
      console.error(
        `Error calling onDeactivate lifecycle hook for plugin ${pluginId}:`,
        error,
      );
      // Don't throw error - this shouldn't prevent the plugin from deactivating
    }
  }

  /**
   * Call the onUninstall lifecycle hook for a plugin
   */
  private async callOnUninstallHook(
    pluginId: string,
    components: Record<string, React.ComponentType> | undefined,
  ): Promise<void> {
    if (!components) return;

    try {
      // Look for the default export which should contain the lifecycle hooks
      const defaultExport = components.default;
      if (
        defaultExport &&
        typeof defaultExport === 'object' &&
        'onUninstall' in defaultExport
      ) {
        const lifecycle = defaultExport as {
          onUninstall?: () => Promise<void>;
        };
        if (typeof lifecycle.onUninstall === 'function') {
          await lifecycle.onUninstall();
        }
      }
    } catch (error) {
      console.error(
        `Error calling onUninstall lifecycle hook for plugin ${pluginId}:`,
        error,
      );
      // Don't throw error - this shouldn't prevent the plugin from uninstalling
    }
  }
}
