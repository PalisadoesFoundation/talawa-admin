/**
 * Main Plugin Manager
 * Coordinates all plugin management functionality through dedicated manager classes
 */

import React from 'react';
import type { ApolloClient } from '@apollo/client';
import { ILoadedPlugin, IExtensionRegistry } from './types';
import { PluginGraphQLService } from './graphql-service';
import { DiscoveryManager } from './managers/discovery';
import { ExtensionRegistryManager } from './managers/extension-registry';
import { EventManager } from './managers/event-manager';
import { LifecycleManager } from './managers/lifecycle';

export class PluginManager {
  private discoveryManager: DiscoveryManager;
  private extensionRegistry: ExtensionRegistryManager;
  private eventManager: EventManager;
  private lifecycleManager: LifecycleManager;
  private isInitialized: boolean = false;

  constructor(apolloClient?: ApolloClient<unknown>) {
    // Initialize managers
    this.eventManager = new EventManager();
    this.extensionRegistry = new ExtensionRegistryManager();

    // Initialize discovery manager with GraphQL service if available
    const graphqlService = apolloClient
      ? new PluginGraphQLService(apolloClient)
      : undefined;
    this.discoveryManager = new DiscoveryManager(graphqlService);

    // Initialize lifecycle manager with dependencies
    this.lifecycleManager = new LifecycleManager(
      this.discoveryManager,
      this.extensionRegistry,
      this.eventManager,
    );

    this.initializePlugins();
  }

  setApolloClient(apolloClient: ApolloClient<unknown>): void {
    if (!apolloClient) {
      throw new Error('Apollo client cannot be null or undefined');
    }
    const graphqlService = new PluginGraphQLService(apolloClient);
    this.discoveryManager.setGraphQLService(graphqlService);
  }

  private async initializePlugins(): Promise<void> {
    try {
      await this.discoveryManager.loadPluginIndexFromGraphQL();
      const availablePlugins = await this.discoveryManager.discoverPlugins();

      if (availablePlugins.length === 0) {
        this.markAsInitialized();
        return;
      }

      await Promise.all(
        availablePlugins.map(async (pluginId) => {
          try {
            await this.lifecycleManager.loadPlugin(pluginId);
          } catch (error) {
            console.error(
              `Failed to load plugin ${pluginId} during initialization:`,
              error,
            );
          }
        }),
      );

      this.markAsInitialized();
    } catch (error) {
      console.error('Failed to initialize plugins:', error);
      this.markAsInitialized();
    }
  }

  private markAsInitialized(): void {
    this.isInitialized = true;
    this.eventManager.emit('plugins:initialized');
  }

  // Public API - Plugin Lifecycle Management
  async loadPlugin(pluginId: string): Promise<boolean> {
    return this.lifecycleManager.loadPlugin(pluginId);
  }

  async unloadPlugin(pluginId: string): Promise<boolean> {
    return this.lifecycleManager.unloadPlugin(pluginId);
  }

  async installPlugin(pluginId: string): Promise<boolean> {
    return this.lifecycleManager.installPlugin(pluginId);
  }

  async uninstallPlugin(pluginId: string): Promise<boolean> {
    return this.lifecycleManager.uninstallPlugin(pluginId);
  }

  async activatePlugin(pluginId: string): Promise<boolean> {
    return this.lifecycleManager.activatePlugin(pluginId);
  }

  async deactivatePlugin(pluginId: string): Promise<boolean> {
    return this.lifecycleManager.deactivatePlugin(pluginId);
  }

  async togglePluginStatus(
    pluginId: string,
    status: 'active' | 'inactive',
  ): Promise<boolean> {
    return this.lifecycleManager.togglePluginStatus(pluginId, status);
  }

  // Public API - Plugin Discovery
  async refreshPluginDiscovery(): Promise<void> {
    await this.discoveryManager.loadPluginIndexFromGraphQL();
  }

  // Public API - Plugin Information
  getLoadedPlugins(): ILoadedPlugin[] {
    return this.lifecycleManager.getLoadedPlugins();
  }

  getLoadedPlugin(pluginId: string): ILoadedPlugin | undefined {
    return this.lifecycleManager.getLoadedPlugin(pluginId);
  }

  getPluginComponent(
    pluginId: string,
    componentName: string,
  ): React.ComponentType | undefined {
    return this.lifecycleManager.getPluginComponent(pluginId, componentName);
  }

  getPluginCount(): number {
    return this.lifecycleManager.getPluginCount();
  }

  getActivePluginCount(): number {
    return this.lifecycleManager.getActivePluginCount();
  }

  // Public API - Extension Points
  getExtensionPoints<T extends keyof IExtensionRegistry>(
    type: T,
  ): IExtensionRegistry[T] {
    return this.extensionRegistry.getExtensionPoints(type);
  }

  // Public API - Event Management
  on(event: string, callback: (...args: unknown[]) => void): void {
    this.eventManager.on(event, callback);
  }

  off(event: string, callback: (...args: unknown[]) => void): void {
    this.eventManager.off(event, callback);
  }

  // Public API - System Status
  async initializePluginSystem(): Promise<void> {
    if (this.isInitialized) {
      console.warn('Plugin system is already initialized');
      return;
    }

    await this.initializePlugins();
  }

  isSystemInitialized(): boolean {
    return this.isInitialized;
  }
}

// Create and export singleton instance
let pluginManagerInstance: PluginManager | null = null;

export function getPluginManager(
  apolloClient?: ApolloClient<unknown>,
): PluginManager {
  if (!pluginManagerInstance) {
    pluginManagerInstance = new PluginManager(apolloClient);
  } else if (apolloClient) {
    pluginManagerInstance.setApolloClient(apolloClient);
  }
  return pluginManagerInstance;
}

export function resetPluginManager(): void {
  pluginManagerInstance = null;
}

export default PluginManager;
