import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { LifecycleManager } from '../../managers/lifecycle';
import { DiscoveryManager } from '../../managers/discovery';
import { ExtensionRegistryManager } from '../../managers/extension-registry';
import { EventManager } from '../../managers/event-manager';
import { ILoadedPlugin, PluginStatus, IPluginManifest } from '../../types';
import React from 'react';

// Mock the managers
vi.mock('../../managers/discovery');
vi.mock('../../managers/extension-registry');
vi.mock('../../managers/event-manager');

// Mock fetch globally
global.fetch = vi.fn();

describe('LifecycleManager', () => {
  let lifecycleManager: LifecycleManager;
  let mockDiscoveryManager: Partial<DiscoveryManager>;
  let mockExtensionRegistry: Partial<ExtensionRegistryManager>;
  let mockEventManager: Partial<EventManager>;

  const mockManifest: IPluginManifest = {
    name: 'Test Plugin',
    pluginId: 'test-plugin',
    version: '1.0.0',
    description: 'A test plugin',
    author: 'Test Author',
    main: 'index.ts',
    extensionPoints: {
      routes: [
        {
          path: '/test',
          component: 'TestComponent',
        },
      ],
    },
  };

  const mockComponents: Record<string, React.ComponentType> = {
    TestComponent: vi.fn(() => React.createElement('div', {}, 'TestComponent')),
    AnotherComponent: vi.fn(() =>
      React.createElement('span', {}, 'AnotherComponent'),
    ),
  };

  const mockLoadedPlugin: ILoadedPlugin = {
    id: 'test-plugin',
    manifest: mockManifest,
    components: mockComponents,
    status: PluginStatus.ACTIVE,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mocks
    mockDiscoveryManager = {
      loadPluginManifest: vi.fn(),
      loadPluginComponents: vi.fn(),
      syncPluginWithGraphQL: vi.fn(),
      removePluginFromGraphQL: vi.fn(),
      updatePluginStatusInGraphQL: vi.fn(),
      isPluginActivated: vi.fn(),
    };

    mockExtensionRegistry = {
      registerExtensionPoints: vi.fn(),
      unregisterExtensionPoints: vi.fn(),
    };

    mockEventManager = {
      emit: vi.fn(),
    };

    lifecycleManager = new LifecycleManager(
      mockDiscoveryManager as DiscoveryManager,
      mockExtensionRegistry as ExtensionRegistryManager,
      mockEventManager as EventManager,
    );
  });

  describe('Constructor and Initialization', () => {
    it('should initialize with empty loaded plugins', () => {
      expect(lifecycleManager.getLoadedPlugins()).toEqual([]);
      expect(lifecycleManager.getPluginCount()).toBe(0);
      expect(lifecycleManager.getActivePluginCount()).toBe(0);
    });
  });

  describe('Plugin Loading', () => {
    beforeEach(() => {
      (mockDiscoveryManager.loadPluginManifest as Mock).mockResolvedValue(
        mockManifest,
      );
      (mockDiscoveryManager.loadPluginComponents as Mock).mockResolvedValue(
        mockComponents,
      );
      (mockDiscoveryManager.syncPluginWithGraphQL as Mock).mockResolvedValue(
        undefined,
      );
      (mockDiscoveryManager.isPluginActivated as Mock).mockReturnValue(true);
    });

    it('should successfully load a plugin', async () => {
      const result = await lifecycleManager.loadPlugin('testPlugin');

      expect(result).toBe(true);
      expect(mockDiscoveryManager.loadPluginManifest).toHaveBeenCalledWith(
        'testPlugin',
      );
      expect(mockDiscoveryManager.loadPluginComponents).toHaveBeenCalledWith(
        'testPlugin',
        mockManifest,
      );
      expect(mockDiscoveryManager.syncPluginWithGraphQL).toHaveBeenCalledWith(
        'testPlugin',
      );
      expect(
        mockExtensionRegistry.registerExtensionPoints,
      ).toHaveBeenCalledWith('testPlugin', mockManifest);
      expect(mockEventManager.emit).toHaveBeenCalledWith(
        'plugin:loaded',
        'testPlugin',
      );
    });

    it('should load plugin as inactive when not activated', async () => {
      (mockDiscoveryManager.isPluginActivated as Mock).mockReturnValue(false);

      const result = await lifecycleManager.loadPlugin('testPlugin');

      expect(result).toBe(true);
      expect(
        mockExtensionRegistry.registerExtensionPoints,
      ).not.toHaveBeenCalled();

      const loadedPlugins = lifecycleManager.getLoadedPlugins();
      expect(loadedPlugins).toHaveLength(1);
      expect(loadedPlugins[0].status).toBe(PluginStatus.INACTIVE);
    });

    it('should handle invalid plugin ID', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const result1 = await lifecycleManager.loadPlugin('');
      const result2 = await lifecycleManager.loadPlugin('   ');

      expect(result1).toBe(false);
      expect(result2).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Invalid plugin ID provided');

      consoleSpy.mockRestore();
    });

    it('should handle manifest loading failure', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const manifestError = new Error('Manifest not found');
      (mockDiscoveryManager.loadPluginManifest as Mock).mockRejectedValue(
        manifestError,
      );

      const result = await lifecycleManager.loadPlugin('testPlugin');

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to load plugin testPlugin:',
        'Manifest not found',
      );
      expect(mockEventManager.emit).toHaveBeenCalledWith(
        'plugin:error',
        'testPlugin',
        manifestError,
      );

      // Should create error plugin entry
      const loadedPlugins = lifecycleManager.getLoadedPlugins();
      expect(loadedPlugins).toHaveLength(1);
      expect(loadedPlugins[0].status).toBe(PluginStatus.ERROR);
      expect(loadedPlugins[0].errorMessage).toBe('Manifest not found');

      consoleSpy.mockRestore();
    });

    it('should handle component loading failure', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const componentError = new Error('Components not found');
      (mockDiscoveryManager.loadPluginComponents as Mock).mockRejectedValue(
        componentError,
      );

      const result = await lifecycleManager.loadPlugin('testPlugin');

      expect(result).toBe(false);
      expect(mockEventManager.emit).toHaveBeenCalledWith(
        'plugin:error',
        'testPlugin',
        componentError,
      );

      consoleSpy.mockRestore();
    });

    it('should handle unknown error types', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      (mockDiscoveryManager.loadPluginManifest as Mock).mockRejectedValue(
        'String error',
      );

      const result = await lifecycleManager.loadPlugin('testPlugin');

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to load plugin testPlugin:',
        'Unknown error',
      );

      const loadedPlugins = lifecycleManager.getLoadedPlugins();
      expect(loadedPlugins[0].errorMessage).toBe('Unknown error');

      consoleSpy.mockRestore();
    });
  });

  describe('Plugin Unloading', () => {
    beforeEach(async () => {
      (mockDiscoveryManager.loadPluginManifest as Mock).mockResolvedValue(
        mockManifest,
      );
      (mockDiscoveryManager.loadPluginComponents as Mock).mockResolvedValue(
        mockComponents,
      );
      (mockDiscoveryManager.syncPluginWithGraphQL as Mock).mockResolvedValue(
        undefined,
      );
      (mockDiscoveryManager.isPluginActivated as Mock).mockReturnValue(true);
      (mockDiscoveryManager.removePluginFromGraphQL as Mock).mockResolvedValue(
        undefined,
      );

      // Load a plugin first
      await lifecycleManager.loadPlugin('testPlugin');
    });

    it('should successfully unload a plugin', async () => {
      const fetchSpy = vi
        .mocked(fetch)
        .mockResolvedValue(new Response('', { status: 200 }));

      const result = await lifecycleManager.unloadPlugin('testPlugin');

      expect(result).toBe(true);
      expect(
        mockExtensionRegistry.unregisterExtensionPoints,
      ).toHaveBeenCalledWith('testPlugin');
      expect(mockDiscoveryManager.removePluginFromGraphQL).toHaveBeenCalledWith(
        'testPlugin',
      );
      expect(mockEventManager.emit).toHaveBeenCalledWith(
        'plugin:unloaded',
        'testPlugin',
      );
      expect(fetchSpy).toHaveBeenCalledWith(
        '/src/plugin/available/testPlugin',
        { method: 'DELETE' },
      );

      expect(lifecycleManager.getLoadedPlugins()).toHaveLength(0);
    });

    it('should handle invalid plugin ID for unloading', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const result = await lifecycleManager.unloadPlugin('');

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Invalid plugin ID provided for unloading',
      );

      consoleSpy.mockRestore();
    });

    it('should handle unloading non-existent plugin', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = await lifecycleManager.unloadPlugin('nonExistent');

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Plugin nonExistent not found for unloading',
      );

      consoleSpy.mockRestore();
    });

    it('should handle GraphQL removal failure', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const graphQLError = new Error('GraphQL error');
      (mockDiscoveryManager.removePluginFromGraphQL as Mock).mockRejectedValue(
        graphQLError,
      );

      const result = await lifecycleManager.unloadPlugin('testPlugin');

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to unload plugin testPlugin:',
        graphQLError,
      );

      consoleSpy.mockRestore();
    });

    it('should handle directory deletion failure gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const fetchSpy = vi
        .mocked(fetch)
        .mockResolvedValue(new Response('', { status: 404 }));

      const result = await lifecycleManager.unloadPlugin('testPlugin');

      expect(result).toBe(true); // Should still succeed
      expect(consoleSpy).toHaveBeenCalledWith(
        'Plugin directory deletion returned HTTP 404',
      );

      consoleSpy.mockRestore();
    });

    it('should handle directory deletion network error gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const fetchSpy = vi
        .mocked(fetch)
        .mockRejectedValue(new Error('Network error'));

      const result = await lifecycleManager.unloadPlugin('testPlugin');

      expect(result).toBe(true); // Should still succeed
      expect(consoleSpy).toHaveBeenCalledWith(
        'Could not delete plugin directory for testPlugin:',
        new Error('Network error'),
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Plugin Status Toggle', () => {
    beforeEach(async () => {
      (mockDiscoveryManager.loadPluginManifest as Mock).mockResolvedValue(
        mockManifest,
      );
      (mockDiscoveryManager.loadPluginComponents as Mock).mockResolvedValue(
        mockComponents,
      );
      (mockDiscoveryManager.syncPluginWithGraphQL as Mock).mockResolvedValue(
        undefined,
      );
      (mockDiscoveryManager.isPluginActivated as Mock).mockReturnValue(true);
      (
        mockDiscoveryManager.updatePluginStatusInGraphQL as Mock
      ).mockResolvedValue(undefined);

      // Load a plugin first
      await lifecycleManager.loadPlugin('testPlugin');
    });

    it('should successfully toggle plugin to inactive', async () => {
      const result = await lifecycleManager.togglePluginStatus(
        'testPlugin',
        'inactive',
      );

      expect(result).toBe(true);
      expect(
        mockDiscoveryManager.updatePluginStatusInGraphQL,
      ).toHaveBeenCalledWith('testPlugin', 'inactive');

      const plugin = lifecycleManager.getLoadedPlugin('testPlugin');
      expect(plugin?.status).toBe(PluginStatus.INACTIVE);
    });

    it('should successfully toggle plugin to active', async () => {
      // First set to inactive
      await lifecycleManager.togglePluginStatus('testPlugin', 'inactive');

      // Then toggle back to active
      const result = await lifecycleManager.togglePluginStatus(
        'testPlugin',
        'active',
      );

      expect(result).toBe(true);
      expect(
        mockDiscoveryManager.updatePluginStatusInGraphQL,
      ).toHaveBeenCalledWith('testPlugin', 'active');

      const plugin = lifecycleManager.getLoadedPlugin('testPlugin');
      expect(plugin?.status).toBe(PluginStatus.ACTIVE);
    });

    it('should handle dynamic registration failure gracefully', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      (
        mockExtensionRegistry.registerExtensionPoints as Mock
      ).mockImplementation(() => {
        throw new Error('Registration failed');
      });

      const result = await lifecycleManager.togglePluginStatus(
        'testPlugin',
        'active',
      );

      expect(result).toBe(false); // Should fail
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to toggle plugin status for testPlugin:',
        new Error('Registration failed'),
      );

      consoleSpy.mockRestore();
    });

    it('should handle invalid plugin ID for status toggle', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const result = await lifecycleManager.togglePluginStatus('', 'active');

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Invalid plugin ID provided for status toggle',
      );

      consoleSpy.mockRestore();
    });

    it('should handle invalid status value', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const result = await lifecycleManager.togglePluginStatus(
        'testPlugin',
        'invalid' as any,
      );

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Invalid status provided. Must be "active" or "inactive"',
      );

      consoleSpy.mockRestore();
    });

    it('should handle non-existent plugin for status toggle', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const result = await lifecycleManager.togglePluginStatus(
        'nonExistent',
        'active',
      );

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Plugin nonExistent not found');

      consoleSpy.mockRestore();
    });

    it('should handle GraphQL status update failure', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const graphQLError = new Error('GraphQL error');
      (
        mockDiscoveryManager.updatePluginStatusInGraphQL as Mock
      ).mockRejectedValue(graphQLError);

      const result = await lifecycleManager.togglePluginStatus(
        'testPlugin',
        'inactive',
      );

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to toggle plugin status for testPlugin:',
        graphQLError,
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Plugin Getters', () => {
    beforeEach(async () => {
      (mockDiscoveryManager.loadPluginManifest as Mock).mockResolvedValue(
        mockManifest,
      );
      (mockDiscoveryManager.loadPluginComponents as Mock).mockResolvedValue(
        mockComponents,
      );
      (mockDiscoveryManager.syncPluginWithGraphQL as Mock).mockResolvedValue(
        undefined,
      );
      (mockDiscoveryManager.isPluginActivated as Mock).mockReturnValue(true);

      // Load a plugin first
      await lifecycleManager.loadPlugin('testPlugin');
    });

    it('should return loaded plugin by ID', () => {
      const plugin = lifecycleManager.getLoadedPlugin('testPlugin');

      expect(plugin).toBeDefined();
      expect(plugin?.id).toBe('testPlugin');
      expect(plugin?.manifest).toEqual(mockManifest);
    });

    it('should return undefined for non-existent plugin', () => {
      const plugin = lifecycleManager.getLoadedPlugin('nonExistent');

      expect(plugin).toBeUndefined();
    });

    it('should return undefined for invalid plugin ID', () => {
      const plugin = lifecycleManager.getLoadedPlugin('');

      expect(plugin).toBeUndefined();
    });

    it('should return plugin component', () => {
      const component = lifecycleManager.getPluginComponent(
        'testPlugin',
        'TestComponent',
      );

      expect(component).toBe(mockComponents.TestComponent);
    });

    it('should return undefined for non-existent component', () => {
      const component = lifecycleManager.getPluginComponent(
        'testPlugin',
        'NonExistentComponent',
      );

      expect(component).toBeUndefined();
    });

    it('should return undefined for invalid parameters in getPluginComponent', () => {
      const component1 = lifecycleManager.getPluginComponent(
        '',
        'TestComponent',
      );
      const component2 = lifecycleManager.getPluginComponent('testPlugin', '');

      expect(component1).toBeUndefined();
      expect(component2).toBeUndefined();
    });

    it('should return undefined for inactive plugin component', async () => {
      await lifecycleManager.togglePluginStatus('testPlugin', 'inactive');

      const component = lifecycleManager.getPluginComponent(
        'testPlugin',
        'TestComponent',
      );

      expect(component).toBeUndefined();
    });

    it('should return correct plugin counts', () => {
      expect(lifecycleManager.getPluginCount()).toBe(1);
      expect(lifecycleManager.getActivePluginCount()).toBe(1);
    });

    it('should return correct counts with inactive plugins', async () => {
      await lifecycleManager.togglePluginStatus('testPlugin', 'inactive');

      expect(lifecycleManager.getPluginCount()).toBe(1);
      expect(lifecycleManager.getActivePluginCount()).toBe(0);
    });

    it('should return all loaded plugins', () => {
      const plugins = lifecycleManager.getLoadedPlugins();

      expect(plugins).toHaveLength(1);
      expect(plugins[0].id).toBe('testPlugin');
    });
  });

  describe('Plugin ID Validation', () => {
    it('should validate plugin IDs correctly', () => {
      // Valid plugin IDs
      expect(lifecycleManager.getLoadedPlugin('validPlugin')).toBeUndefined();
      expect(lifecycleManager.getLoadedPlugin('ValidPlugin')).toBeUndefined();
      expect(lifecycleManager.getLoadedPlugin('valid_plugin')).toBeUndefined();

      // Invalid plugin IDs
      expect(lifecycleManager.getLoadedPlugin('')).toBeUndefined();
      expect(lifecycleManager.getLoadedPlugin('123plugin')).toBeUndefined();
      expect(
        lifecycleManager.getLoadedPlugin('plugin-with-hyphen'),
      ).toBeUndefined();
    });
  });

  describe('Multiple Plugin Management', () => {
    beforeEach(async () => {
      (mockDiscoveryManager.loadPluginManifest as Mock).mockResolvedValue(
        mockManifest,
      );
      (mockDiscoveryManager.loadPluginComponents as Mock).mockResolvedValue(
        mockComponents,
      );
      (mockDiscoveryManager.syncPluginWithGraphQL as Mock).mockResolvedValue(
        undefined,
      );
      (mockDiscoveryManager.isPluginActivated as Mock).mockReturnValue(true);
      (mockDiscoveryManager.removePluginFromGraphQL as Mock).mockResolvedValue(
        undefined,
      );
    });

    it('should manage multiple plugins independently', async () => {
      await lifecycleManager.loadPlugin('testPlugin');
      await lifecycleManager.loadPlugin('secondPlugin');

      expect(lifecycleManager.getPluginCount()).toBe(2);
      expect(lifecycleManager.getActivePluginCount()).toBe(2);

      const plugins = lifecycleManager.getLoadedPlugins();
      expect(plugins).toHaveLength(2);
      expect(plugins.map((p) => p.id)).toContain('testPlugin');
      expect(plugins.map((p) => p.id)).toContain('secondPlugin');
    });

    it('should toggle status independently for multiple plugins', async () => {
      await lifecycleManager.loadPlugin('testPlugin');
      await lifecycleManager.loadPlugin('secondPlugin');

      await lifecycleManager.togglePluginStatus('testPlugin', 'inactive');

      expect(lifecycleManager.getActivePluginCount()).toBe(1);
      expect(lifecycleManager.getLoadedPlugin('testPlugin')?.status).toBe(
        PluginStatus.INACTIVE,
      );
      expect(lifecycleManager.getLoadedPlugin('secondPlugin')?.status).toBe(
        PluginStatus.ACTIVE,
      );
    });

    it('should unload specific plugin without affecting others', async () => {
      await lifecycleManager.loadPlugin('testPlugin');
      await lifecycleManager.loadPlugin('secondPlugin');

      await lifecycleManager.unloadPlugin('testPlugin');

      expect(lifecycleManager.getPluginCount()).toBe(1);
      expect(lifecycleManager.getLoadedPlugin('testPlugin')).toBeUndefined();
      expect(lifecycleManager.getLoadedPlugin('secondPlugin')).toBeDefined();
    });
  });

  describe('Error Plugin Management', () => {
    it('should create error plugin entry when loading fails', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      (mockDiscoveryManager.loadPluginManifest as Mock).mockRejectedValue(
        new Error('Load failed'),
      );

      await lifecycleManager.loadPlugin('errorPlugin');

      const errorPlugin = lifecycleManager.getLoadedPlugin('errorPlugin');
      expect(errorPlugin).toBeDefined();
      expect(errorPlugin?.status).toBe(PluginStatus.ERROR);
      expect(errorPlugin?.errorMessage).toBe('Load failed');

      consoleSpy.mockRestore();
    });

    it('should not return components for error plugins', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      (mockDiscoveryManager.loadPluginManifest as Mock).mockRejectedValue(
        new Error('Load failed'),
      );

      await lifecycleManager.loadPlugin('errorPlugin');

      const component = lifecycleManager.getPluginComponent(
        'errorPlugin',
        'TestComponent',
      );

      expect(component).toBeUndefined();

      consoleSpy.mockRestore();
    });

    it('should include error plugins in counts', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      (mockDiscoveryManager.loadPluginManifest as Mock).mockRejectedValue(
        new Error('Load failed'),
      );

      await lifecycleManager.loadPlugin('errorPlugin');

      expect(lifecycleManager.getPluginCount()).toBe(1);
      expect(lifecycleManager.getActivePluginCount()).toBe(0); // Error plugins are not active

      consoleSpy.mockRestore();
    });
  });
});
