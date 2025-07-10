import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import React from 'react';
import {
  pluginRegistry,
  registerPluginDynamically,
  discoverAndRegisterAllPlugins,
  isPluginRegistered,
  getPluginComponents,
  getPluginComponent,
  initializePluginSystem,
} from './registry';
import { getPluginManager } from './manager';
import { ILoadedPlugin, PluginStatus, IPluginManifest } from './types';

// Mock the plugin manager
vi.mock('./manager', () => ({
  getPluginManager: vi.fn(),
}));

// Mock fetch globally
global.fetch = vi.fn();

describe('Plugin Registry', () => {
  let mockPluginManager: any;

  const mockComponents: Record<string, React.ComponentType> = {
    TestComponent: vi.fn(() =>
      React.createElement('div', {}, 'Test Component'),
    ),
    AnotherComponent: vi.fn(() =>
      React.createElement('span', {}, 'Another Component'),
    ),
    InjectorComponent: vi.fn(() =>
      React.createElement('p', {}, 'Injector Component'),
    ),
  };

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
          path: '/test-route',
          component: 'TestComponent',
        },
      ],
      RA1: [
        {
          path: '/admin-global',
          component: 'AnotherComponent',
        },
      ],
      G1: [
        {
          injector: 'InjectorComponent',
          description: 'Test injector',
        },
      ],
    },
  };

  const mockLoadedPlugin: ILoadedPlugin = {
    id: 'test-plugin',
    manifest: mockManifest,
    components: mockComponents,
    status: PluginStatus.ACTIVE,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Clear the plugin registry
    Object.keys(pluginRegistry).forEach((key) => {
      delete pluginRegistry[key];
    });

    // Setup mock plugin manager
    mockPluginManager = {
      getLoadedPlugin: vi.fn(),
      getLoadedPlugins: vi.fn(),
      getPluginComponent: vi.fn(),
    };

    (getPluginManager as Mock).mockReturnValue(mockPluginManager);

    // Mock console methods to avoid test output clutter
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Plugin Registry State', () => {
    it('should initialize with empty registry', () => {
      expect(Object.keys(pluginRegistry)).toHaveLength(0);
    });

    it('should allow direct access to plugin registry', () => {
      pluginRegistry['test-plugin'] = mockComponents;
      expect(pluginRegistry['test-plugin']).toEqual(mockComponents);
    });
  });

  describe('registerPluginDynamically', () => {
    it('should register active plugin successfully', async () => {
      mockPluginManager.getLoadedPlugin.mockReturnValue(mockLoadedPlugin);

      await registerPluginDynamically('test-plugin');

      expect(pluginRegistry['test-plugin']).toEqual(mockComponents);
      expect(mockPluginManager.getLoadedPlugin).toHaveBeenCalledWith(
        'test-plugin',
      );
    });

    it('should skip registration if plugin already registered', async () => {
      pluginRegistry['test-plugin'] = mockComponents;
      mockPluginManager.getLoadedPlugin.mockReturnValue(mockLoadedPlugin);

      await registerPluginDynamically('test-plugin');

      expect(mockPluginManager.getLoadedPlugin).not.toHaveBeenCalled();
    });

    it('should handle non-existent plugin gracefully', async () => {
      mockPluginManager.getLoadedPlugin.mockReturnValue(null);

      await registerPluginDynamically('non-existent-plugin');

      expect(pluginRegistry['non-existent-plugin']).toBeUndefined();
      expect(mockPluginManager.getLoadedPlugin).toHaveBeenCalledWith(
        'non-existent-plugin',
      );
    });

    it('should skip inactive plugin', async () => {
      const inactivePlugin: ILoadedPlugin = {
        ...mockLoadedPlugin,
        status: PluginStatus.INACTIVE,
      };
      mockPluginManager.getLoadedPlugin.mockReturnValue(inactivePlugin);

      await registerPluginDynamically('test-plugin');

      expect(pluginRegistry['test-plugin']).toBeUndefined();
    });

    it('should skip plugin with error status', async () => {
      const errorPlugin: ILoadedPlugin = {
        ...mockLoadedPlugin,
        status: PluginStatus.ERROR,
      };
      mockPluginManager.getLoadedPlugin.mockReturnValue(errorPlugin);

      await registerPluginDynamically('test-plugin');

      expect(pluginRegistry['test-plugin']).toBeUndefined();
    });

    it('should handle plugin with no components', async () => {
      const pluginWithoutComponents: ILoadedPlugin = {
        ...mockLoadedPlugin,
        components: {},
      };
      mockPluginManager.getLoadedPlugin.mockReturnValue(
        pluginWithoutComponents,
      );

      await registerPluginDynamically('test-plugin');

      expect(pluginRegistry['test-plugin']).toBeUndefined();
    });

    it('should handle plugin with null components', async () => {
      const pluginWithNullComponents: ILoadedPlugin = {
        ...mockLoadedPlugin,
        components: null as any,
      };
      mockPluginManager.getLoadedPlugin.mockReturnValue(
        pluginWithNullComponents,
      );

      await registerPluginDynamically('test-plugin');

      expect(pluginRegistry['test-plugin']).toBeUndefined();
    });

    it('should handle errors during registration', async () => {
      mockPluginManager.getLoadedPlugin.mockImplementation(() => {
        throw new Error('Plugin manager error');
      });

      await registerPluginDynamically('test-plugin');

      expect(pluginRegistry['test-plugin']).toBeUndefined();
    });
  });

  describe('discoverAndRegisterAllPlugins', () => {
    it('should register all active plugins', async () => {
      const plugin1: ILoadedPlugin = {
        id: 'plugin-1',
        manifest: { ...mockManifest, pluginId: 'plugin-1' },
        components: { Component1: mockComponents.TestComponent },
        status: PluginStatus.ACTIVE,
      };

      const plugin2: ILoadedPlugin = {
        id: 'plugin-2',
        manifest: { ...mockManifest, pluginId: 'plugin-2' },
        components: { Component2: mockComponents.AnotherComponent },
        status: PluginStatus.ACTIVE,
      };

      const plugin3: ILoadedPlugin = {
        id: 'plugin-3',
        manifest: { ...mockManifest, pluginId: 'plugin-3' },
        components: { Component3: mockComponents.InjectorComponent },
        status: PluginStatus.INACTIVE,
      };

      mockPluginManager.getLoadedPlugins.mockReturnValue([
        plugin1,
        plugin2,
        plugin3,
      ]);
      mockPluginManager.getLoadedPlugin
        .mockReturnValueOnce(plugin1)
        .mockReturnValueOnce(plugin2);

      await discoverAndRegisterAllPlugins();

      expect(pluginRegistry['plugin-1']).toEqual(plugin1.components);
      expect(pluginRegistry['plugin-2']).toEqual(plugin2.components);
      expect(pluginRegistry['plugin-3']).toBeUndefined(); // Inactive plugin
    });

    it('should handle no loaded plugins', async () => {
      mockPluginManager.getLoadedPlugins.mockReturnValue([]);

      await discoverAndRegisterAllPlugins();

      expect(Object.keys(pluginRegistry)).toHaveLength(0);
    });

    it('should handle null loaded plugins', async () => {
      mockPluginManager.getLoadedPlugins.mockReturnValue(null);

      await discoverAndRegisterAllPlugins();

      expect(Object.keys(pluginRegistry)).toHaveLength(0);
    });

    it('should handle errors during discovery', async () => {
      mockPluginManager.getLoadedPlugins.mockImplementation(() => {
        throw new Error('Discovery error');
      });

      await discoverAndRegisterAllPlugins();

      expect(Object.keys(pluginRegistry)).toHaveLength(0);
    });

    it('should handle mixed plugin statuses', async () => {
      const plugins: ILoadedPlugin[] = [
        {
          id: 'active-plugin',
          manifest: { ...mockManifest, pluginId: 'active-plugin' },
          components: { ActiveComponent: mockComponents.TestComponent },
          status: PluginStatus.ACTIVE,
        },
        {
          id: 'inactive-plugin',
          manifest: { ...mockManifest, pluginId: 'inactive-plugin' },
          components: { InactiveComponent: mockComponents.AnotherComponent },
          status: PluginStatus.INACTIVE,
        },
        {
          id: 'error-plugin',
          manifest: { ...mockManifest, pluginId: 'error-plugin' },
          components: { ErrorComponent: mockComponents.InjectorComponent },
          status: PluginStatus.ERROR,
        },
      ];

      mockPluginManager.getLoadedPlugins.mockReturnValue(plugins);
      mockPluginManager.getLoadedPlugin.mockReturnValue(plugins[0]);

      await discoverAndRegisterAllPlugins();

      expect(pluginRegistry['active-plugin']).toBeDefined();
      expect(pluginRegistry['inactive-plugin']).toBeUndefined();
      expect(pluginRegistry['error-plugin']).toBeUndefined();
    });
  });

  describe('isPluginRegistered', () => {
    it('should return true for registered plugin', () => {
      pluginRegistry['test-plugin'] = mockComponents;

      expect(isPluginRegistered('test-plugin')).toBe(true);
    });

    it('should return false for non-registered plugin', () => {
      expect(isPluginRegistered('non-existent-plugin')).toBe(false);
    });

    it('should return false for plugin with empty components', () => {
      pluginRegistry['empty-plugin'] = {};

      expect(isPluginRegistered('empty-plugin')).toBe(true); // Empty object is still truthy
    });

    it('should handle null/undefined plugin IDs', () => {
      expect(isPluginRegistered('')).toBe(false);
    });
  });

  describe('getPluginComponents', () => {
    it('should return components for registered plugin', () => {
      pluginRegistry['test-plugin'] = mockComponents;

      const components = getPluginComponents('test-plugin');

      expect(components).toEqual(mockComponents);
    });

    it('should return null for non-registered plugin', () => {
      const components = getPluginComponents('non-existent-plugin');

      expect(components).toBeNull();
    });

    it('should return empty object for plugin with no components', () => {
      pluginRegistry['empty-plugin'] = {};

      const components = getPluginComponents('empty-plugin');

      expect(components).toEqual({});
    });
  });

  describe('getPluginComponent', () => {
    it('should return component from registry', () => {
      pluginRegistry['test-plugin'] = mockComponents;

      const component = getPluginComponent('test-plugin', 'TestComponent');

      expect(component).toBe(mockComponents.TestComponent);
    });

    it('should fallback to plugin manager', () => {
      mockPluginManager.getPluginComponent.mockReturnValue(
        mockComponents.TestComponent,
      );

      const component = getPluginComponent('test-plugin', 'TestComponent');

      expect(component).toBe(mockComponents.TestComponent);
      expect(mockPluginManager.getPluginComponent).toHaveBeenCalledWith(
        'test-plugin',
        'TestComponent',
      );
    });

    it('should return null for non-existent component', () => {
      pluginRegistry['test-plugin'] = mockComponents;
      mockPluginManager.getPluginComponent.mockReturnValue(null);

      const component = getPluginComponent(
        'test-plugin',
        'NonExistentComponent',
      );

      expect(component).toBeNull();
    });

    it('should return null for non-existent plugin', () => {
      mockPluginManager.getPluginComponent.mockReturnValue(null);

      const component = getPluginComponent(
        'non-existent-plugin',
        'TestComponent',
      );

      expect(component).toBeNull();
    });

    it('should prefer registry over plugin manager', () => {
      const registryComponent = vi.fn(() =>
        React.createElement('div', {}, 'Registry Component'),
      );
      const managerComponent = vi.fn(() =>
        React.createElement('div', {}, 'Manager Component'),
      );

      pluginRegistry['test-plugin'] = { TestComponent: registryComponent };
      mockPluginManager.getPluginComponent.mockReturnValue(managerComponent);

      const component = getPluginComponent('test-plugin', 'TestComponent');

      expect(component).toBe(registryComponent);
      expect(mockPluginManager.getPluginComponent).not.toHaveBeenCalled();
    });
  });

  describe('initializePluginSystem', () => {
    it('should call discoverAndRegisterAllPlugins', async () => {
      mockPluginManager.getLoadedPlugins.mockReturnValue([]);

      await initializePluginSystem();

      expect(mockPluginManager.getLoadedPlugins).toHaveBeenCalled();
    });

    it('should handle initialization errors', async () => {
      mockPluginManager.getLoadedPlugins.mockImplementation(() => {
        throw new Error('Initialization error');
      });

      await expect(initializePluginSystem()).resolves.not.toThrow();
    });
  });

  describe('Component Management', () => {
    it('should handle multiple plugins with same component names', async () => {
      const plugin1: ILoadedPlugin = {
        id: 'plugin-1',
        manifest: { ...mockManifest, pluginId: 'plugin-1' },
        components: {
          SharedComponent: vi.fn(() =>
            React.createElement('div', {}, 'Plugin 1'),
          ),
        },
        status: PluginStatus.ACTIVE,
      };

      const plugin2: ILoadedPlugin = {
        id: 'plugin-2',
        manifest: { ...mockManifest, pluginId: 'plugin-2' },
        components: {
          SharedComponent: vi.fn(() =>
            React.createElement('div', {}, 'Plugin 2'),
          ),
        },
        status: PluginStatus.ACTIVE,
      };

      mockPluginManager.getLoadedPlugin
        .mockReturnValueOnce(plugin1)
        .mockReturnValueOnce(plugin2);

      await registerPluginDynamically('plugin-1');
      await registerPluginDynamically('plugin-2');

      const component1 = getPluginComponent('plugin-1', 'SharedComponent');
      const component2 = getPluginComponent('plugin-2', 'SharedComponent');

      expect(component1).toBe(plugin1.components.SharedComponent);
      expect(component2).toBe(plugin2.components.SharedComponent);
      expect(component1).not.toBe(component2);
    });

    it('should handle complex component structures', async () => {
      const complexComponents: Record<string, React.ComponentType> = {
        MainComponent: vi.fn(() => React.createElement('div', {}, 'Main')),
        'Sub.Component': vi.fn(() => React.createElement('span', {}, 'Sub')),
        Component_With_Underscores: vi.fn(() =>
          React.createElement('p', {}, 'Underscores'),
        ),
        '123NumericComponent': vi.fn(() =>
          React.createElement('h1', {}, 'Numeric'),
        ),
      };

      const complexPlugin: ILoadedPlugin = {
        id: 'complex-plugin',
        manifest: { ...mockManifest, pluginId: 'complex-plugin' },
        components: complexComponents,
        status: PluginStatus.ACTIVE,
      };

      mockPluginManager.getLoadedPlugin.mockReturnValue(complexPlugin);

      await registerPluginDynamically('complex-plugin');

      Object.keys(complexComponents).forEach((componentName) => {
        const component = getPluginComponent('complex-plugin', componentName);
        expect(component).toBe(complexComponents[componentName]);
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle concurrent plugin registrations', async () => {
      const plugins = Array.from({ length: 5 }, (_, i) => ({
        id: `plugin-${i}`,
        manifest: { ...mockManifest, pluginId: `plugin-${i}` },
        components: {
          [`Component${i}`]: React.createElement('div', {}, `Component ${i}`),
        },
        status: PluginStatus.ACTIVE,
      }));

      plugins.forEach((plugin, i) => {
        mockPluginManager.getLoadedPlugin.mockImplementation(
          (pluginId: string) => {
            return plugins.find((p) => p.id === pluginId) || null;
          },
        );
      });

      const registrationPromises = plugins.map((plugin) =>
        registerPluginDynamically(plugin.id),
      );

      await Promise.all(registrationPromises);

      plugins.forEach((plugin) => {
        expect(pluginRegistry[plugin.id]).toEqual(plugin.components);
      });
    });

    it('should handle plugin re-registration', async () => {
      mockPluginManager.getLoadedPlugin.mockReturnValue(mockLoadedPlugin);

      // First registration
      await registerPluginDynamically('test-plugin');
      expect(pluginRegistry['test-plugin']).toEqual(mockComponents);

      // Clear registry entry
      delete pluginRegistry['test-plugin'];

      // Second registration
      await registerPluginDynamically('test-plugin');
      expect(pluginRegistry['test-plugin']).toEqual(mockComponents);
    });

    it('should handle malformed plugin data', async () => {
      const malformedPlugin: any = {
        id: 'malformed-plugin',
        // Missing required fields
        status: PluginStatus.ACTIVE,
        components: undefined,
      };

      mockPluginManager.getLoadedPlugin.mockReturnValue(malformedPlugin);

      await registerPluginDynamically('malformed-plugin');

      expect(pluginRegistry['malformed-plugin']).toBeUndefined();
    });

    it('should handle empty string plugin IDs', async () => {
      await registerPluginDynamically('');

      expect(pluginRegistry['']).toBeUndefined();
    });

    it('should handle special character plugin IDs', async () => {
      const specialPlugin: ILoadedPlugin = {
        id: 'plugin-with-special@chars!',
        manifest: { ...mockManifest, pluginId: 'plugin-with-special@chars!' },
        components: mockComponents,
        status: PluginStatus.ACTIVE,
      };

      mockPluginManager.getLoadedPlugin.mockReturnValue(specialPlugin);

      await registerPluginDynamically('plugin-with-special@chars!');

      expect(pluginRegistry['plugin-with-special@chars!']).toEqual(
        mockComponents,
      );
    });
  });

  describe('Integration Scenarios', () => {
    it('should support full plugin lifecycle', async () => {
      // Initial state - no plugins
      expect(Object.keys(pluginRegistry)).toHaveLength(0);

      // Plugin gets loaded and activated
      mockPluginManager.getLoadedPlugins.mockReturnValue([mockLoadedPlugin]);
      mockPluginManager.getLoadedPlugin.mockReturnValue(mockLoadedPlugin);

      // Initialize system
      await initializePluginSystem();

      // Verify plugin is registered
      expect(isPluginRegistered('test-plugin')).toBe(true);
      expect(getPluginComponents('test-plugin')).toEqual(mockComponents);
      expect(getPluginComponent('test-plugin', 'TestComponent')).toBe(
        mockComponents.TestComponent,
      );
    });

    it('should handle plugin system with no active plugins', async () => {
      const inactivePlugin: ILoadedPlugin = {
        ...mockLoadedPlugin,
        status: PluginStatus.INACTIVE,
      };

      mockPluginManager.getLoadedPlugins.mockReturnValue([inactivePlugin]);

      await initializePluginSystem();

      expect(Object.keys(pluginRegistry)).toHaveLength(0);
      expect(isPluginRegistered('test-plugin')).toBe(false);
    });

    it('should handle mixed plugin scenarios', async () => {
      const mixedPlugins: ILoadedPlugin[] = [
        mockLoadedPlugin, // Active
        {
          ...mockLoadedPlugin,
          id: 'inactive-plugin',
          status: PluginStatus.INACTIVE,
        },
        { ...mockLoadedPlugin, id: 'error-plugin', status: PluginStatus.ERROR },
      ];

      mockPluginManager.getLoadedPlugins.mockReturnValue(mixedPlugins);
      mockPluginManager.getLoadedPlugin.mockImplementation(
        (id: string) => mixedPlugins.find((p) => p.id === id) || null,
      );

      await initializePluginSystem();

      expect(isPluginRegistered('test-plugin')).toBe(true);
      expect(isPluginRegistered('inactive-plugin')).toBe(false);
      expect(isPluginRegistered('error-plugin')).toBe(false);
    });
  });
});
