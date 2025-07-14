/**
 * Plugin Lifecycle Manager
 * Handles plugin loading, unloading, and status management
 */

import React from 'react';
import { ILoadedPlugin, PluginStatus } from '../types';
import { DiscoveryManager } from './discovery';
import { ExtensionRegistryManager } from './extension-registry';
import { EventManager } from './event-manager';

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

    return plugin.components[componentName];
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
    if (!this.isValidPluginId(pluginId)) {
      console.error('Invalid plugin ID provided for status toggle');
      return false;
    }

    if (!['active', 'inactive'].includes(status)) {
      console.error('Invalid status provided. Must be "active" or "inactive"');
      return false;
    }

    const plugin = this.loadedPlugins.get(pluginId);
    if (!plugin) {
      console.error(`Plugin ${pluginId} not found`);
      return false;
    }

    try {
      await this.discoveryManager.updatePluginStatusInGraphQL(pluginId, status);
      this.updateLocalPluginStatus(plugin, pluginId, status);
      await this.updateExtensionPoints(pluginId, status, plugin);

      this.eventManager.emit('plugin:status-changed', pluginId, status);

      return true;
    } catch (error) {
      console.error(`Failed to toggle plugin status for ${pluginId}:`, error);
      return false;
    }
  }

  private isValidPluginId(pluginId: string): boolean {
    return Boolean(
      pluginId && typeof pluginId === 'string' && pluginId.trim().length > 0,
    );
  }

  private determineInitialPluginStatus(pluginId: string): PluginStatus {
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
        const { registerPluginDynamically } = await import('../registry');
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
}
