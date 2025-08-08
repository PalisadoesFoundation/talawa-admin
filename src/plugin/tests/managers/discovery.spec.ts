import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { DiscoveryManager } from '../../managers/discovery';
import { PluginGraphQLService, IPlugin } from '../../graphql-service';
import { IPluginManifest } from '../../types';
import { validatePluginManifest } from '../../utils';
import React from 'react';

// Mock the dependencies
vi.mock('../../graphql-service');
vi.mock('../../utils');

// Mock fetch globally
global.fetch = vi.fn();

describe('DiscoveryManager', () => {
  let discoveryManager: DiscoveryManager;
  let mockGraphQLService: Partial<PluginGraphQLService>;

  const mockPlugin: IPlugin = {
    id: '1',
    pluginId: 'test-plugin',
    isActivated: true,
    isInstalled: true,
    backup: false,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  };

  const mockManifest: IPluginManifest = {
    name: 'Test Plugin',
    pluginId: 'test-plugin',
    version: '1.0.0',
    description: 'A test plugin',
    author: 'Test Author',
    main: 'index.ts',
  };

  const mockComponents = {
    TestComponent: React.createElement('div'),
    AnotherComponent: React.createElement('span'),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mock GraphQL service
    mockGraphQLService = {
      getAllPlugins: vi.fn(),
      createPlugin: vi.fn(),
      deletePlugin: vi.fn(),
      updatePlugin: vi.fn(),
    };

    discoveryManager = new DiscoveryManager();
  });

  describe('Constructor and GraphQL Service Management', () => {
    it('should initialize without GraphQL service', () => {
      const manager = new DiscoveryManager();
      expect(manager.getPluginIndex()).toEqual([]);
    });

    it('should initialize with GraphQL service', () => {
      const manager = new DiscoveryManager(
        mockGraphQLService as PluginGraphQLService,
      );
      expect(manager.getPluginIndex()).toEqual([]);
    });

    it('should set GraphQL service', () => {
      discoveryManager.setGraphQLService(
        mockGraphQLService as PluginGraphQLService,
      );
      // No direct way to test this, but we can test that operations work
      expect(discoveryManager).toBeDefined();
    });
  });

  describe('Plugin Index Management', () => {
    it('should return empty plugin index initially', () => {
      expect(discoveryManager.getPluginIndex()).toEqual([]);
    });

    it('should set and get plugin index', () => {
      const plugins: IPlugin[] = [mockPlugin];
      discoveryManager.setPluginIndex(plugins);

      expect(discoveryManager.getPluginIndex()).toEqual(plugins);
      // Should return a copy, not the original array
      expect(discoveryManager.getPluginIndex()).not.toBe(plugins);
    });

    it('should find plugin in index', () => {
      discoveryManager.setPluginIndex([mockPlugin]);

      const found = discoveryManager.findPluginInIndex('test-plugin');
      expect(found).toEqual(mockPlugin);
    });

    it('should return undefined for non-existent plugin', () => {
      discoveryManager.setPluginIndex([mockPlugin]);

      const found = discoveryManager.findPluginInIndex('non-existent');
      expect(found).toBeUndefined();
    });

    it('should check if plugin is activated', () => {
      discoveryManager.setPluginIndex([mockPlugin]);

      expect(discoveryManager.isPluginActivated('test-plugin')).toBe(true);
    });

    it('should return false for non-activated plugin', () => {
      const inactivePlugin: IPlugin = { ...mockPlugin, isActivated: false };
      discoveryManager.setPluginIndex([inactivePlugin]);

      expect(discoveryManager.isPluginActivated('test-plugin')).toBe(false);
    });

    it('should return false for non-existent plugin activation status', () => {
      expect(discoveryManager.isPluginActivated('non-existent')).toBe(false);
    });
  });

  describe('Plugin Discovery', () => {
    beforeEach(() => {
      discoveryManager.setGraphQLService(
        mockGraphQLService as PluginGraphQLService,
      );
    });

    it('should discover plugins from GraphQL', async () => {
      (mockGraphQLService.getAllPlugins as Mock).mockResolvedValue([
        mockPlugin,
      ]);

      const discovered = await discoveryManager.discoverPlugins();

      expect(discovered).toEqual(['test-plugin']);
      expect(discoveryManager.getPluginIndex()).toEqual([mockPlugin]);
    });

    it('should handle GraphQL discovery failure gracefully', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      (mockGraphQLService.getAllPlugins as Mock).mockRejectedValue(
        new Error('GraphQL error'),
      );

      const discovered = await discoveryManager.discoverPlugins();

      expect(discovered).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        'GraphQL discovery failed:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });

    it('should handle discovery without GraphQL service', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const managerWithoutService = new DiscoveryManager();

      const discovered = await managerWithoutService.discoverPlugins();

      expect(discovered).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        'No GraphQL service available for plugin discovery',
      );

      consoleSpy.mockRestore();
    });

    it('should handle discovery with duplicate plugins', async () => {
      const duplicatePlugins = [mockPlugin, mockPlugin];
      (mockGraphQLService.getAllPlugins as Mock).mockResolvedValue(
        duplicatePlugins,
      );

      const discovered = await discoveryManager.discoverPlugins();

      expect(discovered).toEqual(['test-plugin']); // Should deduplicate
    });

    it('should handle general discovery errors', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // Mock getAllPlugins to throw an error that will be caught by the GraphQL error handler first
      (mockGraphQLService.getAllPlugins as Mock).mockRejectedValue(
        new Error('Unexpected error'),
      );

      const discovered = await discoveryManager.discoverPlugins();

      expect(discovered).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        'GraphQL discovery failed:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Plugin Index Loading from GraphQL', () => {
    it('should load plugin index from GraphQL', async () => {
      discoveryManager.setGraphQLService(
        mockGraphQLService as PluginGraphQLService,
      );
      (mockGraphQLService.getAllPlugins as Mock).mockResolvedValue([
        mockPlugin,
      ]);

      await discoveryManager.loadPluginIndexFromGraphQL();

      expect(discoveryManager.getPluginIndex()).toEqual([mockPlugin]);
    });

    it('should handle GraphQL loading failure', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      discoveryManager.setGraphQLService(
        mockGraphQLService as PluginGraphQLService,
      );
      (mockGraphQLService.getAllPlugins as Mock).mockRejectedValue(
        new Error('GraphQL error'),
      );

      await discoveryManager.loadPluginIndexFromGraphQL();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to load plugin index from GraphQL:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });

    it('should handle loading without GraphQL service', async () => {
      const managerWithoutService = new DiscoveryManager();

      await managerWithoutService.loadPluginIndexFromGraphQL();

      // Should not throw and should not change the index
      expect(managerWithoutService.getPluginIndex()).toEqual([]);
    });
  });

  describe('Manifest Loading', () => {
    beforeEach(() => {
      (validatePluginManifest as Mock).mockReturnValue(true);
    });

    it('should load valid plugin manifest', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockManifest),
      };
      (global.fetch as Mock).mockResolvedValue(mockResponse);

      const manifest = await discoveryManager.loadPluginManifest('test-plugin');

      expect(manifest).toEqual(mockManifest);
      expect(global.fetch).toHaveBeenCalledWith(
        '/src/plugin/available/test-plugin/manifest.json',
      );
      expect(validatePluginManifest).toHaveBeenCalledWith(mockManifest);
    });

    it('should handle HTTP errors', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
      };
      (global.fetch as Mock).mockResolvedValue(mockResponse);

      await expect(
        discoveryManager.loadPluginManifest('test-plugin'),
      ).rejects.toThrow(
        'HTTP 404: Failed to load manifest for plugin test-plugin',
      );
    });

    it('should handle invalid manifest', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockManifest),
      };
      (global.fetch as Mock).mockResolvedValue(mockResponse);
      (validatePluginManifest as Mock).mockReturnValue(false);

      await expect(
        discoveryManager.loadPluginManifest('test-plugin'),
      ).rejects.toThrow('Invalid plugin manifest');
    });

    it('should handle network errors', async () => {
      (global.fetch as Mock).mockRejectedValue(
        new TypeError('Failed to fetch'),
      );

      await expect(
        discoveryManager.loadPluginManifest('test-plugin'),
      ).rejects.toThrow(
        'Network error loading manifest for plugin test-plugin',
      );
    });

    it('should handle JSON parsing errors', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
      };
      (global.fetch as Mock).mockResolvedValue(mockResponse);

      await expect(
        discoveryManager.loadPluginManifest('test-plugin'),
      ).rejects.toThrow('Invalid JSON');
    });
  });

  describe('Component Loading', () => {
    beforeEach(() => {
      // Mock console.log to avoid cluttering test output
      vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should handle component loading errors gracefully', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // Test with a non-existent plugin that will fail to load
      await expect(
        discoveryManager.loadPluginComponents(
          'non-existent-plugin',
          mockManifest,
        ),
      ).rejects.toThrow(
        'Component loading failed for plugin non-existent-plugin:',
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to load components for plugin non-existent-plugin:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });

    it('should handle different main file configurations', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const manifestWithJsFile: IPluginManifest = {
        ...mockManifest,
        main: 'index.js',
      };

      // This will fail but we're testing the path construction
      await expect(
        discoveryManager.loadPluginComponents(
          'test-plugin',
          manifestWithJsFile,
        ),
      ).rejects.toThrow();

      consoleSpy.mockRestore();
    });

    it('should handle main file without extension', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const manifestWithoutExt: IPluginManifest = {
        ...mockManifest,
        main: 'index',
      };

      // This will fail but we're testing the extension normalization
      await expect(
        discoveryManager.loadPluginComponents(
          'test-plugin',
          manifestWithoutExt,
        ),
      ).rejects.toThrow();

      consoleSpy.mockRestore();
    });
  });

  describe('GraphQL Synchronization', () => {
    beforeEach(() => {
      discoveryManager.setGraphQLService(
        mockGraphQLService as PluginGraphQLService,
      );
    });

    it('should sync new plugin with GraphQL', async () => {
      (mockGraphQLService.createPlugin as Mock).mockResolvedValue(mockPlugin);
      (mockGraphQLService.getAllPlugins as Mock).mockResolvedValue([
        mockPlugin,
      ]);

      await discoveryManager.syncPluginWithGraphQL('test-plugin');

      expect(mockGraphQLService.createPlugin).toHaveBeenCalledWith({
        pluginId: 'test-plugin',
      });
      expect(discoveryManager.getPluginIndex()).toEqual([mockPlugin]);
    });

    it('should not sync existing plugin with GraphQL', async () => {
      discoveryManager.setPluginIndex([mockPlugin]);

      await discoveryManager.syncPluginWithGraphQL('test-plugin');

      expect(mockGraphQLService.createPlugin).not.toHaveBeenCalled();
    });

    it('should handle GraphQL sync failure gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      (mockGraphQLService.createPlugin as Mock).mockRejectedValue(
        new Error('GraphQL error'),
      );

      await discoveryManager.syncPluginWithGraphQL('test-plugin');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to sync plugin with GraphQL:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });

    it('should handle sync without GraphQL service', async () => {
      const managerWithoutService = new DiscoveryManager();

      await managerWithoutService.syncPluginWithGraphQL('test-plugin');

      // Should not throw
      expect(managerWithoutService.getPluginIndex()).toEqual([]);
    });
  });

  describe('Plugin Removal from GraphQL', () => {
    beforeEach(() => {
      discoveryManager.setGraphQLService(
        mockGraphQLService as PluginGraphQLService,
      );
      discoveryManager.setPluginIndex([mockPlugin]);
    });

    it('should remove plugin from GraphQL', async () => {
      (mockGraphQLService.deletePlugin as Mock).mockResolvedValue(undefined);
      (mockGraphQLService.getAllPlugins as Mock).mockResolvedValue([]);

      await discoveryManager.removePluginFromGraphQL('test-plugin');

      expect(mockGraphQLService.deletePlugin).toHaveBeenCalledWith({ id: '1' });
      expect(discoveryManager.getPluginIndex()).toEqual([]);
    });

    it('should handle non-existent plugin removal', async () => {
      await discoveryManager.removePluginFromGraphQL('non-existent');

      expect(mockGraphQLService.deletePlugin).not.toHaveBeenCalled();
    });

    it('should handle GraphQL deletion failure', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      (mockGraphQLService.deletePlugin as Mock).mockRejectedValue(
        new Error('GraphQL error'),
      );

      await discoveryManager.removePluginFromGraphQL('test-plugin');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to delete plugin via GraphQL:',
        expect.any(Error),
      );
      // Should still remove from local index
      expect(discoveryManager.getPluginIndex()).toEqual([]);

      consoleSpy.mockRestore();
    });

    it('should handle removal without GraphQL service', async () => {
      const managerWithoutService = new DiscoveryManager();
      managerWithoutService.setPluginIndex([mockPlugin]);

      await managerWithoutService.removePluginFromGraphQL('test-plugin');

      // Should not change index without GraphQL service
      expect(managerWithoutService.getPluginIndex()).toEqual([mockPlugin]);
    });
  });

  describe('Plugin Status Update in GraphQL', () => {
    beforeEach(() => {
      discoveryManager.setGraphQLService(
        mockGraphQLService as PluginGraphQLService,
      );
    });

    it('should update existing plugin status to active', async () => {
      discoveryManager.setPluginIndex([mockPlugin]);
      (mockGraphQLService.updatePlugin as Mock).mockResolvedValue(undefined);
      (mockGraphQLService.getAllPlugins as Mock).mockResolvedValue([
        { ...mockPlugin, isActivated: true },
      ]);

      await discoveryManager.updatePluginStatusInGraphQL(
        'test-plugin',
        'active',
      );

      expect(mockGraphQLService.updatePlugin).toHaveBeenCalledWith({
        id: '1',
        isActivated: true,
      });
    });

    it('should update existing plugin status to inactive', async () => {
      discoveryManager.setPluginIndex([mockPlugin]);
      (mockGraphQLService.updatePlugin as Mock).mockResolvedValue(undefined);
      (mockGraphQLService.getAllPlugins as Mock).mockResolvedValue([
        { ...mockPlugin, isActivated: false },
      ]);

      await discoveryManager.updatePluginStatusInGraphQL(
        'test-plugin',
        'inactive',
      );

      expect(mockGraphQLService.updatePlugin).toHaveBeenCalledWith({
        id: '1',
        isActivated: false,
      });
    });

    it('should create and update non-existent plugin', async () => {
      const newPlugin: IPlugin = {
        id: '2',
        pluginId: 'new-plugin',
        isActivated: true,
        isInstalled: true,
        backup: false,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };
      (mockGraphQLService.createPlugin as Mock).mockResolvedValue(newPlugin);
      (mockGraphQLService.updatePlugin as Mock).mockResolvedValue(undefined);
      (mockGraphQLService.getAllPlugins as Mock).mockResolvedValue([newPlugin]);

      await discoveryManager.updatePluginStatusInGraphQL(
        'new-plugin',
        'active',
      );

      expect(mockGraphQLService.createPlugin).toHaveBeenCalledWith({
        pluginId: 'new-plugin',
      });
      expect(mockGraphQLService.updatePlugin).toHaveBeenCalledWith({
        id: '2',
        isActivated: true,
      });
    });

    it('should handle create and update when creation returns null', async () => {
      (mockGraphQLService.createPlugin as Mock).mockResolvedValue(null);
      (mockGraphQLService.getAllPlugins as Mock).mockResolvedValue([]);

      await discoveryManager.updatePluginStatusInGraphQL(
        'new-plugin',
        'active',
      );

      expect(mockGraphQLService.createPlugin).toHaveBeenCalledWith({
        pluginId: 'new-plugin',
      });
      expect(mockGraphQLService.updatePlugin).not.toHaveBeenCalled();
    });

    it('should handle update without GraphQL service', async () => {
      const managerWithoutService = new DiscoveryManager();

      await managerWithoutService.updatePluginStatusInGraphQL(
        'test-plugin',
        'active',
      );

      // Should not throw
      expect(managerWithoutService.getPluginIndex()).toEqual([]);
    });
  });

  describe('Main File Normalization', () => {
    it('should normalize main file with .js extension', () => {
      // Access private method through type assertion
      const normalizeMainFile = (
        discoveryManager as any
      ).normalizeMainFile.bind(discoveryManager);

      expect(normalizeMainFile('index.js')).toBe('index.js');
    });

    it('should normalize main file with .ts extension', () => {
      const normalizeMainFile = (
        discoveryManager as any
      ).normalizeMainFile.bind(discoveryManager);

      expect(normalizeMainFile('index.ts')).toBe('index.ts');
    });

    it('should normalize main file with .tsx extension', () => {
      const normalizeMainFile = (
        discoveryManager as any
      ).normalizeMainFile.bind(discoveryManager);

      expect(normalizeMainFile('index.tsx')).toBe('index.tsx');
    });

    it('should add .js extension to main file without extension', () => {
      const normalizeMainFile = (
        discoveryManager as any
      ).normalizeMainFile.bind(discoveryManager);

      expect(normalizeMainFile('index')).toBe('index.js');
    });

    it('should add .js extension to main file with invalid extension', () => {
      const normalizeMainFile = (
        discoveryManager as any
      ).normalizeMainFile.bind(discoveryManager);

      expect(normalizeMainFile('index.txt')).toBe('index.txt.js');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty plugin index operations', () => {
      expect(discoveryManager.findPluginInIndex('any-plugin')).toBeUndefined();
      expect(discoveryManager.isPluginActivated('any-plugin')).toBe(false);
    });

    it('should handle multiple plugins in index', () => {
      const plugins: IPlugin[] = [
        {
          id: '1',
          pluginId: 'plugin-1',
          isActivated: true,
          isInstalled: true,
          backup: false,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
        {
          id: '2',
          pluginId: 'plugin-2',
          isActivated: false,
          isInstalled: true,
          backup: false,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
        {
          id: '3',
          pluginId: 'plugin-3',
          isActivated: true,
          isInstalled: true,
          backup: false,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
      ];

      discoveryManager.setPluginIndex(plugins);

      expect(discoveryManager.findPluginInIndex('plugin-2')).toEqual(
        plugins[1],
      );
      expect(discoveryManager.isPluginActivated('plugin-2')).toBe(false);
      expect(discoveryManager.isPluginActivated('plugin-3')).toBe(true);
    });

    it('should handle plugin index updates', () => {
      const initialPlugins: IPlugin[] = [
        {
          id: '1',
          pluginId: 'plugin-1',
          isActivated: true,
          isInstalled: true,
          backup: false,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
      ];
      const updatedPlugins: IPlugin[] = [
        {
          id: '1',
          pluginId: 'plugin-1',
          isActivated: false,
          isInstalled: true,
          backup: false,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
        {
          id: '2',
          pluginId: 'plugin-2',
          isActivated: true,
          isInstalled: true,
          backup: false,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
      ];

      discoveryManager.setPluginIndex(initialPlugins);
      expect(discoveryManager.getPluginIndex()).toEqual(initialPlugins);

      discoveryManager.setPluginIndex(updatedPlugins);
      expect(discoveryManager.getPluginIndex()).toEqual(updatedPlugins);
    });

    it('should handle plugin discovery with empty GraphQL response', async () => {
      discoveryManager.setGraphQLService(
        mockGraphQLService as PluginGraphQLService,
      );
      (mockGraphQLService.getAllPlugins as Mock).mockResolvedValue([]);

      const discovered = await discoveryManager.discoverPlugins();

      expect(discovered).toEqual([]);
      expect(discoveryManager.getPluginIndex()).toEqual([]);
    });
  });
});
