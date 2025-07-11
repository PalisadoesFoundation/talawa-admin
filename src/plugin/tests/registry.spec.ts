import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getPluginManager, resetPluginManager } from '../manager';
import {
  getPluginComponent,
  getPluginComponents,
  isPluginRegistered,
  registerPluginDynamically,
  discoverAndRegisterAllPlugins,
  initializePluginSystem,
  pluginRegistry,
} from '../registry';
import type { IPluginManifest } from '../types';
import React from 'react';
import { Mock } from 'vitest';
import { ILoadedPlugin, PluginStatus } from '../types';

// Mock the manager
vi.mock('../manager', () => ({
  getPluginManager: vi.fn(),
  resetPluginManager: vi.fn(),
}));

// Mock React
vi.mock('react', () => ({
  lazy: vi.fn((importFn) => importFn),
  createElement: vi.fn((type, props, ...children) => ({
    type,
    props,
    children,
  })),
  default: {
    lazy: vi.fn((importFn) => importFn),
    createElement: vi.fn((type, props, ...children) => ({
      type,
      props,
      children,
    })),
  },
}));

// Mock fetch globally
global.fetch = vi.fn();

// Helper to clear plugin registry
function clearPluginRegistry() {
  Object.keys(pluginRegistry).forEach((key) => {
    delete pluginRegistry[key];
  });
}

// Mock plugin manager instance
const mockPluginManager = {
  getPluginComponent: vi.fn(),
  getLoadedPlugins: vi.fn(),
  getLoadedPlugin: vi.fn(),
};

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

  describe('isPluginRegistered', () => {
    it('should return false when plugin is not registered', () => {
      expect(isPluginRegistered('non-existent-plugin')).toBe(false);
    });

    it('should return true when plugin is registered', () => {
      pluginRegistry['test-plugin'] = { TestComponent: vi.fn() };
      expect(isPluginRegistered('test-plugin')).toBe(true);
    });
  });

  describe('getPluginComponents', () => {
    it('should return null when plugin is not registered', () => {
      expect(getPluginComponents('non-existent-plugin')).toBeNull();
    });

    it('should return components when plugin is registered', () => {
      const components = { TestComponent: vi.fn() };
      pluginRegistry['test-plugin'] = components;
      expect(getPluginComponents('test-plugin')).toBe(components);
    });
  });

  describe('getPluginComponent', () => {
    it('should return null when plugin is not registered and manager has no component', () => {
      mockPluginManager.getPluginComponent.mockReturnValue(null);
      expect(
        getPluginComponent('non-existent-plugin', 'TestComponent'),
      ).toBeNull();
    });

    it('should return component from registry when available', () => {
      const component = vi.fn();
      pluginRegistry['test-plugin'] = { TestComponent: component };
      expect(getPluginComponent('test-plugin', 'TestComponent')).toBe(
        component,
      );
    });

    it('should fallback to plugin manager when not in registry', () => {
      const component = vi.fn();
      mockPluginManager.getPluginComponent.mockReturnValue(component);
      expect(getPluginComponent('test-plugin', 'TestComponent')).toBe(
        component,
      );
    });

    it('should return null when component not found anywhere', () => {
      mockPluginManager.getPluginComponent.mockReturnValue(null);
      expect(getPluginComponent('test-plugin', 'NonExistent')).toBeNull();
    });
  });

  describe('registerPluginDynamically', () => {
    it('should skip registration if plugin already registered', async () => {
      pluginRegistry['test-plugin'] = { TestComponent: vi.fn() };

      await registerPluginDynamically('test-plugin');

      expect(console.log).toHaveBeenCalledWith(
        'Plugin test-plugin already registered, skipping',
      );
    });

    it('should warn when plugin not found in manager', async () => {
      mockPluginManager.getLoadedPlugin.mockReturnValue(null);

      await registerPluginDynamically('non-existent-plugin');

      expect(console.warn).toHaveBeenCalledWith(
        'Plugin non-existent-plugin not found in plugin manager',
      );
    });

    it('should skip registration when plugin is not active', async () => {
      mockPluginManager.getLoadedPlugin.mockReturnValue({
        id: 'test-plugin',
        status: 'inactive',
        components: {},
      });

      await registerPluginDynamically('test-plugin');

      expect(console.log).toHaveBeenCalledWith(
        'Plugin test-plugin is not active, skipping',
      );
    });

    it('should register plugin with components when active', async () => {
      const components = { TestComponent: vi.fn(), AnotherComponent: vi.fn() };
      mockPluginManager.getLoadedPlugin.mockReturnValue({
        id: 'test-plugin',
        status: 'active',
        components,
      });

      await registerPluginDynamically('test-plugin');

      expect(pluginRegistry['test-plugin']).toBe(components);
      expect(console.log).toHaveBeenCalledWith(
        'Plugin test-plugin registered successfully with components:',
        ['TestComponent', 'AnotherComponent'],
      );
    });

    it('should warn when no components found', async () => {
      mockPluginManager.getLoadedPlugin.mockReturnValue({
        id: 'test-plugin',
        status: 'active',
        components: {},
      });

      await registerPluginDynamically('test-plugin');

      expect(console.warn).toHaveBeenCalledWith(
        'No components found for plugin test-plugin',
      );
    });

    it('should handle plugin with null components', async () => {
      mockPluginManager.getLoadedPlugin.mockReturnValue({
        id: 'test-plugin',
        status: 'active',
        components: null,
      });

      await registerPluginDynamically('test-plugin');

      expect(console.warn).toHaveBeenCalledWith(
        'No components found for plugin test-plugin',
      );
    });

    it('should handle errors during registration', async () => {
      mockPluginManager.getLoadedPlugin.mockImplementation(() => {
        throw new Error('Plugin manager error');
      });

      await registerPluginDynamically('error-plugin');

      expect(console.error).toHaveBeenCalledWith(
        "Failed to register plugin 'error-plugin':",
        expect.any(Error),
      );
    });
  });

  describe('discoverAndRegisterAllPlugins', () => {
    it('should warn when no plugins loaded', async () => {
      mockPluginManager.getLoadedPlugins.mockReturnValue([]);

      await discoverAndRegisterAllPlugins();

      expect(console.warn).toHaveBeenCalledWith(
        'No plugins loaded in plugin manager',
      );
    });

    it('should warn when loaded plugins is null', async () => {
      mockPluginManager.getLoadedPlugins.mockReturnValue(null);

      await discoverAndRegisterAllPlugins();

      expect(console.warn).toHaveBeenCalledWith(
        'No plugins loaded in plugin manager',
      );
    });

    it('should register only active plugins', async () => {
      const plugins = [
        { id: 'plugin1', status: 'active', components: { Comp1: vi.fn() } },
        { id: 'plugin2', status: 'inactive', components: { Comp2: vi.fn() } },
        { id: 'plugin3', status: 'active', components: { Comp3: vi.fn() } },
      ];

      mockPluginManager.getLoadedPlugins.mockReturnValue(plugins);
      mockPluginManager.getLoadedPlugin.mockImplementation((id: string) =>
        plugins.find((p) => p.id === id),
      );

      await discoverAndRegisterAllPlugins();

      expect(pluginRegistry['plugin1']).toBeDefined();
      expect(pluginRegistry['plugin2']).toBeUndefined();
      expect(pluginRegistry['plugin3']).toBeDefined();
    });

    it('should handle errors during discovery', async () => {
      mockPluginManager.getLoadedPlugins.mockImplementation(() => {
        throw new Error('Manager error');
      });

      await discoverAndRegisterAllPlugins();

      expect(console.error).toHaveBeenCalledWith(
        'Failed to discover and register plugins:',
        expect.any(Error),
      );
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
        throw new Error('Initialization failed');
      });

      await initializePluginSystem();

      expect(console.error).toHaveBeenCalledWith(
        'Failed to discover and register plugins:',
        expect.any(Error),
      );
    });
  });

  describe('Error Component Creation', () => {
    it('should handle error component creation through plugin manager fallback', async () => {
      // Test error handling when plugin manager returns null
      mockPluginManager.getPluginComponent.mockReturnValue(null);

      const result = getPluginComponent('test-plugin', 'NonExistentComponent');
      expect(result).toBeNull();
      expect(mockPluginManager.getPluginComponent).toHaveBeenCalledWith(
        'test-plugin',
        'NonExistentComponent',
      );
    });

    it('should handle plugin manager errors gracefully', async () => {
      // Test error handling when plugin manager throws
      mockPluginManager.getPluginComponent.mockImplementation(() => {
        throw new Error('Plugin manager error');
      });

      expect(() => getPluginComponent('test-plugin', 'ErrorComponent')).toThrow(
        'Plugin manager error',
      );
    });
  });

  describe('Registry State Management', () => {
    it('should maintain registry state across multiple operations', async () => {
      const components1 = { Component1: vi.fn() };
      const components2 = { Component2: vi.fn() };

      const plugin1 = {
        id: 'plugin1',
        status: 'active' as const,
        components: components1,
      };

      const plugin2 = {
        id: 'plugin2',
        status: 'active' as const,
        components: components2,
      };

      mockPluginManager.getLoadedPlugin.mockImplementation((id: string) => {
        if (id === 'plugin1') return plugin1;
        if (id === 'plugin2') return plugin2;
        return null;
      });

      await registerPluginDynamically('plugin1');
      await registerPluginDynamically('plugin2');

      expect(isPluginRegistered('plugin1')).toBe(true);
      expect(isPluginRegistered('plugin2')).toBe(true);
      expect(getPluginComponents('plugin1')).toBe(components1);
      expect(getPluginComponents('plugin2')).toBe(components2);
    });

    it('should handle plugin registration with missing components gracefully', async () => {
      const plugin = {
        id: 'missing-components-plugin',
        status: 'active' as const,
        components: undefined,
      };

      mockPluginManager.getLoadedPlugin.mockReturnValue(plugin);
      await registerPluginDynamically('missing-components-plugin');

      expect(console.warn).toHaveBeenCalledWith(
        'No components found for plugin missing-components-plugin',
      );
    });
  });

  describe('Plugin Discovery Error Scenarios', () => {
    it('should handle getLoadedPlugins returning undefined', async () => {
      mockPluginManager.getLoadedPlugins.mockReturnValue(undefined);

      await discoverAndRegisterAllPlugins();

      expect(console.warn).toHaveBeenCalledWith(
        'No plugins loaded in plugin manager',
      );
    });

    it('should handle mixed plugin statuses during discovery', async () => {
      const plugins = [
        {
          id: 'active-plugin',
          status: 'active',
          components: { ActiveComp: vi.fn() },
        },
        {
          id: 'inactive-plugin',
          status: 'inactive',
          components: { InactiveComp: vi.fn() },
        },
        {
          id: 'error-plugin',
          status: 'error',
          components: { ErrorComp: vi.fn() },
        },
        {
          id: 'loading-plugin',
          status: 'loading',
          components: { LoadingComp: vi.fn() },
        },
      ];

      mockPluginManager.getLoadedPlugins.mockReturnValue(plugins);
      mockPluginManager.getLoadedPlugin.mockImplementation((id: string) =>
        plugins.find((p) => p.id === id),
      );

      await discoverAndRegisterAllPlugins();

      // Only active plugins should be registered
      expect(pluginRegistry['active-plugin']).toBeDefined();
      expect(pluginRegistry['inactive-plugin']).toBeUndefined();
      expect(pluginRegistry['error-plugin']).toBeUndefined();
      expect(pluginRegistry['loading-plugin']).toBeUndefined();
    });

    it('should handle plugin registration throwing errors', async () => {
      const plugins = [
        {
          id: 'good-plugin',
          status: 'active',
          components: { GoodComp: vi.fn() },
        },
        {
          id: 'bad-plugin',
          status: 'active',
          components: { BadComp: vi.fn() },
        },
      ];

      mockPluginManager.getLoadedPlugins.mockReturnValue(plugins);
      mockPluginManager.getLoadedPlugin.mockImplementation((id: string) => {
        if (id === 'bad-plugin') {
          throw new Error('Plugin loading error');
        }
        return plugins.find((p) => p.id === id);
      });

      await discoverAndRegisterAllPlugins();

      // Good plugin should still be registered despite bad plugin error
      expect(pluginRegistry['good-plugin']).toBeDefined();
      expect(pluginRegistry['bad-plugin']).toBeUndefined();
      expect(console.error).toHaveBeenCalledWith(
        "Failed to register plugin 'bad-plugin':",
        expect.any(Error),
      );
    });
  });

  describe('Advanced Plugin Scenarios', () => {
    it('should handle plugins with large component sets', async () => {
      const manyComponents: Record<string, any> = {};
      for (let i = 1; i <= 20; i++) {
        manyComponents[`Component${i}`] = vi.fn();
      }

      const plugin = {
        id: 'large-plugin',
        status: 'active' as const,
        components: manyComponents,
      };

      mockPluginManager.getLoadedPlugin.mockReturnValue(plugin);
      await registerPluginDynamically('large-plugin');

      expect(pluginRegistry['large-plugin']).toBe(manyComponents);
      expect(Object.keys(pluginRegistry['large-plugin'])).toHaveLength(20);
      expect(console.log).toHaveBeenCalledWith(
        'Plugin large-plugin registered successfully with components:',
        Object.keys(manyComponents),
      );
    });

    it('should handle plugins with duplicate component names', async () => {
      const plugin1 = {
        id: 'plugin-with-common-name',
        status: 'active' as const,
        components: { CommonComponent: vi.fn() },
      };

      const plugin2 = {
        id: 'another-plugin-with-common-name',
        status: 'active' as const,
        components: { CommonComponent: vi.fn() },
      };

      mockPluginManager.getLoadedPlugin.mockImplementation((id: string) => {
        if (id === 'plugin-with-common-name') return plugin1;
        if (id === 'another-plugin-with-common-name') return plugin2;
        return null;
      });

      await registerPluginDynamically('plugin-with-common-name');
      await registerPluginDynamically('another-plugin-with-common-name');

      // Each plugin should maintain its own component instance
      expect(
        getPluginComponent('plugin-with-common-name', 'CommonComponent'),
      ).toBe(plugin1.components.CommonComponent);
      expect(
        getPluginComponent(
          'another-plugin-with-common-name',
          'CommonComponent',
        ),
      ).toBe(plugin2.components.CommonComponent);
      expect(plugin1.components.CommonComponent).not.toBe(
        plugin2.components.CommonComponent,
      );
    });

    it('should handle rapid sequential registrations', async () => {
      const plugins = Array.from({ length: 10 }, (_, i) => ({
        id: `rapid-plugin-${i}`,
        status: 'active' as const,
        components: { [`Component${i}`]: vi.fn() },
      }));

      mockPluginManager.getLoadedPlugin.mockImplementation(
        (id: string) => plugins.find((p) => p.id === id) || null,
      );

      // Register all plugins sequentially
      for (const plugin of plugins) {
        await registerPluginDynamically(plugin.id);
      }

      // All should be registered
      expect(Object.keys(pluginRegistry)).toHaveLength(10);
      plugins.forEach((plugin) => {
        expect(pluginRegistry[plugin.id]).toBe(plugin.components);
      });
    });

    it('should handle plugin status transitions', async () => {
      const components = { TransitionComponent: vi.fn() };

      // Start with inactive plugin
      let plugin: {
        id: string;
        status: 'inactive' | 'active';
        components: any;
      } = {
        id: 'transition-plugin',
        status: 'inactive' as const,
        components,
      };

      mockPluginManager.getLoadedPlugin.mockReturnValue(plugin);
      await registerPluginDynamically('transition-plugin');

      // Should not be registered
      expect(pluginRegistry['transition-plugin']).toBeUndefined();

      // Change to active
      plugin = {
        id: 'transition-plugin',
        status: 'active' as const,
        components,
      };

      mockPluginManager.getLoadedPlugin.mockReturnValue(plugin);
      await registerPluginDynamically('transition-plugin');

      // Should now be registered
      expect(pluginRegistry['transition-plugin']).toBe(components);
    });
  });

  describe('Registry Cache Management', () => {
    it('should handle registry clearing during multiple registrations', async () => {
      const plugins = [
        { id: 'plugin1', status: 'active', components: { Comp1: vi.fn() } },
        { id: 'plugin2', status: 'active', components: { Comp2: vi.fn() } },
      ];

      mockPluginManager.getLoadedPlugin.mockImplementation((id: string) =>
        plugins.find((p) => p.id === id),
      );

      await registerPluginDynamically('plugin1');
      expect(pluginRegistry['plugin1']).toBeDefined();

      // Clear and re-register
      Object.keys(pluginRegistry).forEach((key) => {
        delete pluginRegistry[key];
      });

      await registerPluginDynamically('plugin2');
      expect(pluginRegistry['plugin1']).toBeUndefined();
      expect(pluginRegistry['plugin2']).toBeDefined();
    });

    it('should handle registry state during concurrent operations', async () => {
      const plugins = [
        {
          id: 'concurrent1',
          status: 'active',
          components: { ConcComp1: vi.fn() },
        },
        {
          id: 'concurrent2',
          status: 'active',
          components: { ConcComp2: vi.fn() },
        },
        {
          id: 'concurrent3',
          status: 'active',
          components: { ConcComp3: vi.fn() },
        },
      ];

      mockPluginManager.getLoadedPlugin.mockImplementation((id: string) =>
        plugins.find((p) => p.id === id),
      );

      // Simulate concurrent registrations
      const promises = [
        registerPluginDynamically('concurrent1'),
        registerPluginDynamically('concurrent2'),
        registerPluginDynamically('concurrent3'),
      ];

      await Promise.all(promises);

      expect(Object.keys(pluginRegistry)).toHaveLength(3);
      expect(pluginRegistry['concurrent1']).toBeDefined();
      expect(pluginRegistry['concurrent2']).toBeDefined();
      expect(pluginRegistry['concurrent3']).toBeDefined();
    });
  });

  describe('Error Handling Edge Cases', () => {
    it('should handle plugin manager getLoadedPlugin returning undefined', async () => {
      mockPluginManager.getLoadedPlugin.mockReturnValue(undefined);

      await registerPluginDynamically('undefined-plugin');

      expect(console.warn).toHaveBeenCalledWith(
        'Plugin undefined-plugin not found in plugin manager',
      );
    });

    it('should handle plugin with invalid status values', async () => {
      const pluginWithInvalidStatus = {
        id: 'invalid-status-plugin',
        status: 'some-invalid-status',
        components: { TestComp: vi.fn() },
      };

      mockPluginManager.getLoadedPlugin.mockReturnValue(
        pluginWithInvalidStatus,
      );

      await registerPluginDynamically('invalid-status-plugin');

      expect(console.log).toHaveBeenCalledWith(
        'Plugin invalid-status-plugin is not active, skipping',
      );
    });

    it('should handle empty component objects', async () => {
      const pluginWithEmptyComponents = {
        id: 'empty-components-plugin',
        status: 'active',
        components: {},
      };

      mockPluginManager.getLoadedPlugin.mockReturnValue(
        pluginWithEmptyComponents,
      );

      await registerPluginDynamically('empty-components-plugin');

      expect(console.warn).toHaveBeenCalledWith(
        'No components found for plugin empty-components-plugin',
      );
    });

    it('should handle components that are not functions', async () => {
      const pluginWithInvalidComponents = {
        id: 'invalid-components-plugin',
        status: 'active',
        components: {
          ValidComponent: vi.fn(),
          InvalidComponent: 'not-a-function',
          NullComponent: null,
        },
      };

      mockPluginManager.getLoadedPlugin.mockReturnValue(
        pluginWithInvalidComponents,
      );

      await registerPluginDynamically('invalid-components-plugin');

      expect(pluginRegistry['invalid-components-plugin']).toBe(
        pluginWithInvalidComponents.components,
      );
    });
  });

  describe('Component Retrieval Edge Cases', () => {
    it('should handle getPluginComponent with registry priority', () => {
      const registryComponent = vi.fn();
      const managerComponent = vi.fn();

      // Set up both registry and manager to have the component
      pluginRegistry['test-plugin'] = { TestComponent: registryComponent };
      mockPluginManager.getPluginComponent.mockReturnValue(managerComponent);

      const result = getPluginComponent('test-plugin', 'TestComponent');

      // Should prefer registry over manager
      expect(result).toBe(registryComponent);
      expect(mockPluginManager.getPluginComponent).not.toHaveBeenCalled();
    });

    it('should fallback to manager when component not in registry', () => {
      const managerComponent = vi.fn();

      // Registry has plugin but not the specific component
      pluginRegistry['test-plugin'] = { OtherComponent: vi.fn() };
      mockPluginManager.getPluginComponent.mockReturnValue(managerComponent);

      const result = getPluginComponent('test-plugin', 'TestComponent');

      expect(result).toBe(managerComponent);
      expect(mockPluginManager.getPluginComponent).toHaveBeenCalledWith(
        'test-plugin',
        'TestComponent',
      );
    });

    it('should handle null values in components object', async () => {
      const plugin = {
        id: 'null-component-plugin',
        status: 'active' as const,
        components: {
          ValidComponent: vi.fn(),
          NullComponent: null,
          UndefinedComponent: undefined,
        },
      };

      mockPluginManager.getLoadedPlugin.mockReturnValue(plugin);
      await registerPluginDynamically('null-component-plugin');

      // Should still register the plugin with all components (including null/undefined)
      expect(pluginRegistry['null-component-plugin']).toBe(plugin.components);
      expect(pluginRegistry['null-component-plugin'].NullComponent).toBeNull();
      expect(
        pluginRegistry['null-component-plugin'].UndefinedComponent,
      ).toBeUndefined();
    });
  });

  describe('Initialization System', () => {
    it('should properly initialize with empty plugin manager', async () => {
      mockPluginManager.getLoadedPlugins.mockReturnValue([]);

      await initializePluginSystem();

      expect(mockPluginManager.getLoadedPlugins).toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalledWith(
        'No plugins loaded in plugin manager',
      );
    });

    it('should initialize with multiple plugins successfully', async () => {
      const plugins = [
        {
          id: 'init-plugin1',
          status: 'active',
          components: { Comp1: vi.fn() },
        },
        {
          id: 'init-plugin2',
          status: 'active',
          components: { Comp2: vi.fn() },
        },
        {
          id: 'init-plugin3',
          status: 'inactive',
          components: { Comp3: vi.fn() },
        },
      ];

      mockPluginManager.getLoadedPlugins.mockReturnValue(plugins);
      mockPluginManager.getLoadedPlugin.mockImplementation((id: string) =>
        plugins.find((p) => p.id === id),
      );

      await initializePluginSystem();

      expect(Object.keys(pluginRegistry)).toHaveLength(2); // Only active plugins
      expect(pluginRegistry['init-plugin1']).toBeDefined();
      expect(pluginRegistry['init-plugin2']).toBeDefined();
      expect(pluginRegistry['init-plugin3']).toBeUndefined();
    });
  });

  describe('Complex Integration Scenarios', () => {
    it('should handle plugin re-registration after clearing', async () => {
      const components = { TestComp: vi.fn() };
      const plugin = {
        id: 'reregister-plugin',
        status: 'active' as const,
        components,
      };

      mockPluginManager.getLoadedPlugin.mockReturnValue(plugin);

      // First registration
      await registerPluginDynamically('reregister-plugin');
      expect(pluginRegistry['reregister-plugin']).toBe(components);

      // Clear registry
      delete pluginRegistry['reregister-plugin'];
      expect(isPluginRegistered('reregister-plugin')).toBe(false);

      // Re-register
      await registerPluginDynamically('reregister-plugin');
      expect(pluginRegistry['reregister-plugin']).toBe(components);
    });

    it('should handle concurrent registration with different component sets', async () => {
      const plugin1Components = { Comp1A: vi.fn(), Comp1B: vi.fn() };
      const plugin2Components = { Comp2A: vi.fn(), Comp2B: vi.fn() };

      const plugins = [
        { id: 'concurrent-a', status: 'active', components: plugin1Components },
        { id: 'concurrent-b', status: 'active', components: plugin2Components },
      ];

      mockPluginManager.getLoadedPlugin.mockImplementation((id: string) =>
        plugins.find((p) => p.id === id),
      );

      await Promise.all([
        registerPluginDynamically('concurrent-a'),
        registerPluginDynamically('concurrent-b'),
      ]);

      expect(pluginRegistry['concurrent-a']).toBe(plugin1Components);
      expect(pluginRegistry['concurrent-b']).toBe(plugin2Components);

      // Verify cross-plugin component isolation
      expect(getPluginComponent('concurrent-a', 'Comp1A')).toBe(
        plugin1Components.Comp1A,
      );
      expect(getPluginComponent('concurrent-a', 'Comp2A')).toBeNull();
      expect(getPluginComponent('concurrent-b', 'Comp2A')).toBe(
        plugin2Components.Comp2A,
      );
      expect(getPluginComponent('concurrent-b', 'Comp1A')).toBeNull();
    });
  });
});
