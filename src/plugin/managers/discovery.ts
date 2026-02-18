/**
 * Plugin Discovery Manager
 * Handles plugin discovery, manifest loading, and component loading
 */

import { IPluginManifest } from '../types';
import { PluginGraphQLService, IPlugin } from '../graphql-service';
import { validatePluginManifest } from '../utils';
import React from 'react';

export class DiscoveryManager {
  private graphqlService: PluginGraphQLService | null = null;
  private pluginIndex: IPlugin[] = [];

  constructor(graphqlService?: PluginGraphQLService) {
    this.graphqlService = graphqlService || null;
  }

  setGraphQLService(service: PluginGraphQLService): void {
    this.graphqlService = service;
  }

  getPluginIndex(): IPlugin[] {
    return [...this.pluginIndex];
  }

  setPluginIndex(index: IPlugin[]): void {
    this.pluginIndex = index;
  }

  findPluginInIndex(pluginId: string): IPlugin | undefined {
    return this.pluginIndex.find((p) => p.pluginId === pluginId);
  }

  isPluginActivated(pluginId: string): boolean {
    const plugin = this.findPluginInIndex(pluginId);
    return plugin ? plugin.isActivated : false;
  }

  isPluginInstalled(pluginId: string): boolean {
    const plugin = this.findPluginInIndex(pluginId);
    return plugin ? plugin.isInstalled : false;
  }

  async loadPluginIndexFromGraphQL(): Promise<void> {
    if (!this.graphqlService) return;

    try {
      const plugins = await this.graphqlService.getAllPlugins();
      this.pluginIndex = plugins;
    } catch (error) {
      console.error('Failed to load plugin index from GraphQL:', error);
    }
  }

  async discoverPlugins(): Promise<string[]> {
    let discoveredPlugins: string[] = [];

    if (this.graphqlService) {
      try {
        const plugins = await this.graphqlService.getAllPlugins();
        this.pluginIndex = plugins;
        // Only discover plugins that are actually installed
        const installedPlugins = plugins
          .filter((p) => p.isInstalled)
          .map((p) => p.pluginId);
        // Deduplicate in case GraphQL returns duplicate plugin records
        discoveredPlugins = [...new Set(installedPlugins)];
      } catch (graphqlError) {
        console.error('GraphQL discovery failed:', graphqlError);
      }
    } else {
      console.warn('No GraphQL service available for plugin discovery');
    }

    return discoveredPlugins;
  }

  async loadPluginManifest(pluginId: string): Promise<IPluginManifest> {
    try {
      const response = await fetch(
        `/src/plugin/available/${pluginId}/manifest.json`,
      );

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: Failed to load manifest for plugin ${pluginId}`,
        );
      }

      const manifest = await response.json();

      if (!validatePluginManifest(manifest)) {
        throw new Error('Invalid plugin manifest');
      }

      return manifest;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(
          `Network error loading manifest for plugin ${pluginId}`,
        );
      }
      throw error;
    }
  }

  // Wrapped dynamic import so tests can mock the import result
  // and verify component-loading behavior deterministically.
  private async importPluginModule(
    importPath: string,
  ): Promise<Record<string, unknown>> {
    return await import(/* @vite-ignore */ importPath);
  }

  async loadPluginComponents(
    pluginId: string,
    manifest: IPluginManifest,
  ): Promise<Record<string, React.ComponentType>> {
    try {
      const mainFile = this.normalizeMainFile(manifest.main);
      const importPath = `/src/plugin/available/${pluginId}/${mainFile}`;

      const pluginModule = await this.importPluginModule(importPath);

      const result = pluginModule.default
        ? { [pluginId]: pluginModule.default, ...pluginModule }
        : pluginModule;

      return result as Record<string, React.ComponentType>;
    } catch (error) {
      console.error(`Failed to load components for plugin ${pluginId}:`, error);
      throw new Error(
        `Component loading failed for plugin ${pluginId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  private normalizeMainFile(mainFile: string): string {
    const validExtensions = ['.js', '.ts', '.tsx'];
    return validExtensions.some((ext) => mainFile.endsWith(ext))
      ? mainFile
      : `${mainFile}.js`;
  }

  async syncPluginWithGraphQL(pluginId: string): Promise<void> {
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

  async removePluginFromGraphQL(pluginId: string): Promise<void> {
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

  async updatePluginStatusInGraphQL(
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
}
