import React from 'react';
import {
  IPluginManifest,
  ILoadedPlugin,
  IExtensionRegistry,
  PluginStatus,
  ExtensionPointType,
} from './types';
import { validatePluginManifest, sortDrawerItems } from './utils';
import { PluginGraphQLService, IPlugin } from './graphql-service';

class PluginManager {
  private loadedPlugins: Map<string, ILoadedPlugin> = new Map();
  private extensionRegistry: IExtensionRegistry = {
    routes: [],
    drawer: [],
  };
  private eventListeners: Map<string, Function[]> = new Map();
  private pluginIndex: IPlugin[] = [];
  private graphqlService: PluginGraphQLService | null = null;
  private isInitialized: boolean = false;

  constructor(apolloClient?: any) {
    if (apolloClient) {
      this.graphqlService = new PluginGraphQLService(apolloClient);
    }
    this.initializePlugins();
  }

  setApolloClient(apolloClient: any): void {
    if (!apolloClient) {
      throw new Error('Apollo client cannot be null or undefined');
    }
    this.graphqlService = new PluginGraphQLService(apolloClient);
  }

  private async initializePlugins(): Promise<void> {
    try {
      await this.loadPluginIndexFromGraphQL();
      const availablePlugins = await this.discoverPlugins();

      if (availablePlugins.length === 0) {
        this.markAsInitialized();
        return;
      }

      await Promise.all(
        availablePlugins.map(async (pluginId) => {
          try {
            await this.loadPlugin(pluginId);
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

  private async loadPluginIndexFromGraphQL(): Promise<void> {
    if (!this.graphqlService) return;

    try {
      const plugins = await this.graphqlService.getAllPlugins();
      this.pluginIndex = plugins;
    } catch (error) {
      console.error('Failed to load plugin index from GraphQL:', error);
    }
  }

  private markAsInitialized(): void {
    this.isInitialized = true;
    this.emit('plugins:initialized');
  }

  private async discoverPlugins(): Promise<string[]> {
    try {
      let discoveredPlugins: string[] = [];

      if (this.graphqlService) {
        try {
          const plugins = await this.graphqlService.getAllPlugins();
          this.pluginIndex = plugins;
          const graphqlPlugins = plugins.map((p) => p.pluginId);
          discoveredPlugins = [
            ...new Set([...discoveredPlugins, ...graphqlPlugins]),
          ];
        } catch (graphqlError) {
          console.error('GraphQL discovery failed:', graphqlError);
        }
      } else {
        console.warn('No GraphQL service available for plugin discovery');
      }

      return discoveredPlugins;
    } catch (error) {
      console.error('Could not discover plugins:', error);
      return [];
    }
  }

  private findPluginInIndex(pluginId: string): IPlugin | undefined {
    return this.pluginIndex.find((p) => p.pluginId === pluginId);
  }

  private isPluginActivated(pluginId: string): boolean {
    const plugin = this.findPluginInIndex(pluginId);
    return plugin ? plugin.isActivated : true; // Default to true if not found
  }

  public async loadPlugin(pluginId: string): Promise<boolean> {
    if (!this.isValidPluginId(pluginId)) {
      console.error('Invalid plugin ID provided');
      return false;
    }

    try {
      const manifest = await this.loadPluginManifest(pluginId);
      if (!validatePluginManifest(manifest)) {
        throw new Error('Invalid plugin manifest');
      }

      const components = await this.loadPluginComponents(pluginId, manifest);
      const status = this.determineInitialPluginStatus(pluginId);

      const loadedPlugin: ILoadedPlugin = {
        id: pluginId,
        manifest,
        components,
        status,
      };

      this.loadedPlugins.set(pluginId, loadedPlugin);

      if (status === PluginStatus.ACTIVE) {
        this.registerExtensionPoints(pluginId, manifest);
      }

      await this.syncPluginWithGraphQL(pluginId);

      this.emit('plugin:loaded', pluginId);

      return true;
    } catch (error) {
      this.handlePluginLoadError(pluginId, error);
      return false;
    }
  }

  private isValidPluginId(pluginId: string): boolean {
    return Boolean(
      pluginId && typeof pluginId === 'string' && pluginId.trim().length > 0,
    );
  }

  private determineInitialPluginStatus(pluginId: string): PluginStatus {
    const isActive = this.isPluginActivated(pluginId);
    return isActive ? PluginStatus.ACTIVE : PluginStatus.INACTIVE;
  }

  private async syncPluginWithGraphQL(pluginId: string): Promise<void> {
    const graphqlPlugin = this.findPluginInIndex(pluginId);

    if (!graphqlPlugin && this.graphqlService) {
      try {
        await this.graphqlService.createPlugin({ pluginId });
        const plugins = await this.graphqlService.getAllPlugins();
        this.pluginIndex = plugins;
      } catch (error) {
        console.warn('Failed to sync plugin with GraphQL:', error);
      }
    }
  }

  private handlePluginLoadError(pluginId: string, error: unknown): void {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    console.error(`Failed to load plugin ${pluginId}:`, errorMessage);

    this.loadedPlugins.set(pluginId, {
      id: pluginId,
      manifest: {
        name: pluginId,
        version: '0.0.0',
        description: '',
        author: '',
        main: '',
      },
      components: {},
      status: PluginStatus.ERROR,
      errorMessage,
    });

    this.emit('plugin:error', pluginId, error);
  }

  private async loadPluginManifest(pluginId: string): Promise<IPluginManifest> {
    try {
      const response = await fetch(
        `/src/plugin/available/${pluginId}/manifest.json`,
      );

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: Failed to load manifest for plugin ${pluginId}`,
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(
          `Network error loading manifest for plugin ${pluginId}`,
        );
      }
      throw error;
    }
  }

  private async loadPluginComponents(
    pluginId: string,
    manifest: IPluginManifest,
  ): Promise<Record<string, React.ComponentType>> {
    try {
      const mainFile = this.normalizeMainFile(manifest.main);
      const pluginModule = await import(
        /* @vite-ignore */ `/src/plugin/available/${pluginId}/${mainFile}`
      );

      return pluginModule.default
        ? { [pluginId]: pluginModule.default, ...pluginModule }
        : pluginModule;
    } catch (error) {
      console.error(`Failed to load components for plugin ${pluginId}:`, error);
      throw new Error(`Component loading failed for plugin ${pluginId}`);
    }
  }

  private normalizeMainFile(mainFile: string): string {
    const validExtensions = ['.js', '.ts', '.tsx'];
    return validExtensions.some((ext) => mainFile.endsWith(ext))
      ? mainFile
      : `${mainFile}.js`;
  }

  private registerExtensionPoints(
    pluginId: string,
    manifest: IPluginManifest,
  ): void {
    if (manifest.extensionPoints?.routes) {
      this.extensionRegistry.routes = this.extensionRegistry.routes.filter(
        (route) => route.pluginId !== pluginId,
      );

      manifest.extensionPoints.routes.forEach((route) => {
        this.extensionRegistry.routes.push({
          ...route,
          pluginId,
        });
      });
    }

    if (manifest.extensionPoints?.drawer) {
      this.extensionRegistry.drawer = this.extensionRegistry.drawer.filter(
        (item) => item.pluginId !== pluginId,
      );

      manifest.extensionPoints.drawer.forEach((item) => {
        this.extensionRegistry.drawer.push({
          ...item,
          pluginId,
        });
      });
    }
  }

  public async unloadPlugin(pluginId: string): Promise<boolean> {
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

      this.unregisterExtensionPoints(pluginId);
      this.loadedPlugins.delete(pluginId);

      await this.removePluginFromGraphQL(pluginId);
      await this.attemptPluginDirectoryDeletion(pluginId);

      this.emit('plugin:unloaded', pluginId);

      return true;
    } catch (error) {
      console.error(`Failed to unload plugin ${pluginId}:`, error);
      return false;
    }
  }

  private async removePluginFromGraphQL(pluginId: string): Promise<void> {
    const pluginIndexEntry = this.findPluginInIndex(pluginId);

    if (!pluginIndexEntry || !this.graphqlService) return;

    try {
      await this.graphqlService.deletePlugin({ id: pluginIndexEntry.id });
      const plugins = await this.graphqlService.getAllPlugins();
      this.pluginIndex = plugins;
    } catch (error) {
      console.warn('Failed to delete plugin via GraphQL:', error);
      this.pluginIndex = this.pluginIndex.filter(
        (p) => p.pluginId !== pluginId,
      );
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

  private unregisterExtensionPoints(pluginId: string): void {
    this.extensionRegistry.routes = this.extensionRegistry.routes.filter(
      (route) => route.pluginId !== pluginId,
    );
    this.extensionRegistry.drawer = this.extensionRegistry.drawer.filter(
      (item) => item.pluginId !== pluginId,
    );
  }

  public async togglePluginStatus(
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
      await this.updatePluginStatusInGraphQL(pluginId, status);
      this.updateLocalPluginStatus(plugin, pluginId, status);
      await this.updateExtensionPoints(pluginId, status, plugin);

      this.emit('plugin:status-changed', pluginId, status);

      return true;
    } catch (error) {
      console.error(`Failed to toggle plugin status for ${pluginId}:`, error);
      return false;
    }
  }

  private async updatePluginStatusInGraphQL(
    pluginId: string,
    status: 'active' | 'inactive',
  ): Promise<void> {
    if (!this.graphqlService) return;

    const isActive = status === 'active';
    const graphqlPlugin = this.findPluginInIndex(pluginId);

    if (graphqlPlugin) {
      await this.graphqlService.updatePlugin({
        id: graphqlPlugin.id,
        isActivated: isActive,
      });
    } else {
      const newPlugin = await this.graphqlService.createPlugin({ pluginId });
      if (newPlugin) {
        await this.graphqlService.updatePlugin({
          id: newPlugin.id,
          isActivated: isActive,
        });
      }
    }

    const plugins = await this.graphqlService.getAllPlugins();
    this.pluginIndex = plugins;
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
      this.unregisterExtensionPoints(pluginId);
    } else if (plugin.manifest) {
      this.registerExtensionPoints(pluginId, plugin.manifest);

      try {
        const { registerPluginDynamically } = await import('./registry');
        await registerPluginDynamically(pluginId);
        this.emit('plugin:loaded', pluginId);
      } catch (error) {
        console.warn(
          `Failed to register plugin ${pluginId} dynamically:`,
          error,
        );
      }
    }
  }

  public getLoadedPlugins(): ILoadedPlugin[] {
    return Array.from(this.loadedPlugins.values());
  }

  public getLoadedPlugin(pluginId: string): ILoadedPlugin | undefined {
    if (!this.isValidPluginId(pluginId)) {
      return undefined;
    }
    return this.loadedPlugins.get(pluginId);
  }

  public getExtensionPoints<T extends keyof IExtensionRegistry>(
    type: T,
    userPermissions: string[] = [],
    isAdmin: boolean = false,
  ): IExtensionRegistry[T] {
    if (type === ExtensionPointType.ROUTES) {
      return this.getFilteredRoutes(
        userPermissions,
        isAdmin,
      ) as IExtensionRegistry[T];
    }

    if (type === ExtensionPointType.DRAWER) {
      return this.getFilteredDrawerItems(
        userPermissions,
        isAdmin,
      ) as IExtensionRegistry[T];
    }

    return this.extensionRegistry[type];
  }

  private getFilteredRoutes(userPermissions: string[], isAdmin: boolean) {
    const routes = this.extensionRegistry.routes
      .map((route) => {
        // Determine if this is a user route based on the path
        const isUserRoute = route.path.startsWith('/user/') || !route.isAdmin;

        return {
          ...route,
          // Only add /user prefix if it's a user route and doesn't already have it
          path:
            isUserRoute && !route.path.startsWith('/user/')
              ? `/user${route.path}`
              : route.path,
          // Ensure isAdmin is properly set based on the path
          isAdmin: !isUserRoute,
        };
      })
      .filter((route) => {
        // Admin routes should only be accessible to admins
        if (route.isAdmin && !isAdmin) {
          return false;
        }

        // User routes should not be accessible to admins
        if (!route.isAdmin && isAdmin) {
          return false;
        }

        // If no permissions required, allow access
        if (!route.permissions || route.permissions.length === 0) {
          return true;
        }

        // Check if user has any of the required permissions
        const hasPermission = route.permissions.some((permission) =>
          userPermissions.includes(permission),
        );

        return hasPermission;
      });

    return routes;
  }

  private getFilteredDrawerItems(userPermissions: string[], isAdmin: boolean) {
    const items = this.extensionRegistry.drawer.filter((item) => {
      // Admin users should only see admin items
      if (isAdmin && !item.isAdmin) {
        return false;
      }

      // Non-admin users should only see non-admin items
      if (!isAdmin && item.isAdmin) {
        return false;
      }

      if (!item.permissions || item.permissions.length === 0) {
        return true;
      }

      return item.permissions.some((permission) =>
        userPermissions.includes(permission),
      );
    });

    return sortDrawerItems(items);
  }

  public getPluginComponent(
    pluginId: string,
    componentName: string,
  ): React.ComponentType | undefined {
    if (!this.isValidPluginId(pluginId) || !componentName) {
      return undefined;
    }

    const plugin = this.loadedPlugins.get(pluginId);
    return plugin?.components[componentName];
  }

  public on(event: string, callback: Function): void {
    if (!event || typeof callback !== 'function') {
      throw new Error('Event name and callback function are required');
    }

    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)?.push(callback);
  }

  public off(event: string, callback: Function): void {
    if (!event || typeof callback !== 'function') {
      return;
    }

    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, ...args: any[]): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  public async initializePluginSystem(): Promise<void> {
    try {
      await this.initializePlugins();

      const { discoverAndRegisterAllPlugins } = await import('./registry');
      await discoverAndRegisterAllPlugins();
    } catch (error) {
      console.error('Failed to initialize plugin system:', error);
      throw new Error('Plugin system initialization failed');
    }
  }

  public isSystemInitialized(): boolean {
    return this.isInitialized;
  }

  public getPluginCount(): number {
    return this.loadedPlugins.size;
  }

  public getActivePluginCount(): number {
    return Array.from(this.loadedPlugins.values()).filter(
      (plugin) => plugin.status === PluginStatus.ACTIVE,
    ).length;
  }
}

export default new PluginManager();
