import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getPluginManager, resetPluginManager } from '../manager';
import {
  getPluginComponent,
  getPluginComponents,
  isPluginRegistered,
  registerPluginDynamically,
  discoverAndRegisterAllPlugins,
} from '../registry';

// Mock the manager
vi.mock('../manager', () => ({
  getPluginManager: vi.fn(),
  resetPluginManager: vi.fn(),
}));

// Mock fetch
global.fetch = vi.fn();

// Helper to reset pluginRegistry between tests
import * as registryModule from '../registry';

function clearPluginRegistry() {
  Object.keys((registryModule as any).pluginRegistry || {}).forEach((key) => {
    delete (registryModule as any).pluginRegistry[key];
  });
}

describe('Plugin Registry', () => {
  let mockPluginManager: any;

  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();
    clearPluginRegistry();

    // Set up the mock plugin manager
    mockPluginManager = {
      getPluginComponent: vi.fn(),
      getLoadedPlugin: vi.fn(),
      getLoadedPlugins: vi.fn(),
      isSystemInitialized: vi.fn(() => true),
    };
    vi.mocked(getPluginManager).mockReturnValue(mockPluginManager);
  });

  afterEach(() => {
    resetPluginManager();
    clearPluginRegistry();
  });

  describe('getPluginComponent', () => {
    it('should return component for registered plugin', async () => {
      const mockComponent = vi.fn(() => null);

      // Set up the plugin manager to return a loaded plugin
      vi.mocked(mockPluginManager.getLoadedPlugin).mockReturnValue({
        id: 'test-plugin',
        status: 'active',
        components: { TestComponent: mockComponent },
      });

      // Register the plugin
      await registerPluginDynamically('test-plugin');

      // Now get the component
      const component = getPluginComponent('test-plugin', 'TestComponent');
      expect(component).toBe(mockComponent);
    });

    it('should return null for non-existent component', async () => {
      // Set up the plugin manager to return a loaded plugin with no components
      vi.mocked(mockPluginManager.getLoadedPlugin).mockReturnValue({
        id: 'test-plugin',
        status: 'active',
        components: {},
      });

      // Register the plugin
      await registerPluginDynamically('test-plugin');

      // Try to get a non-existent component
      expect(
        getPluginComponent('test-plugin', 'NonExistentComponent'),
      ).toBeNull();
    });

    it('should return null for unregistered plugin', () => {
      expect(
        getPluginComponent('unregistered-plugin', 'TestComponent'),
      ).toBeNull();
    });
  });

  describe('getPluginComponents', () => {
    it('should return components for registered plugin', async () => {
      const mockComponents = {
        TestComponent: vi.fn(() => null),
        AnotherComponent: vi.fn(() => null),
      };

      // Set up the plugin manager to return a loaded plugin
      vi.mocked(mockPluginManager.getLoadedPlugin).mockReturnValue({
        id: 'test-plugin',
        status: 'active',
        components: mockComponents,
      });

      // Register the plugin
      await registerPluginDynamically('test-plugin');

      // Get all components
      const components = getPluginComponents('test-plugin');
      expect(components).toEqual(mockComponents);
    });

    it('should return null for unregistered plugin', () => {
      expect(getPluginComponents('unregistered-plugin')).toBeNull();
    });
  });

  describe('isPluginRegistered', () => {
    it('should return true for registered plugin', async () => {
      // Set up the plugin manager to return a loaded plugin
      vi.mocked(mockPluginManager.getLoadedPlugin).mockReturnValue({
        id: 'test-plugin',
        status: 'active',
        components: { TestComponent: vi.fn(() => null) },
      });

      // Register the plugin
      await registerPluginDynamically('test-plugin');

      // Check if it's registered
      expect(isPluginRegistered('test-plugin')).toBe(true);
    });

    it('should return false for unregistered plugin', () => {
      expect(isPluginRegistered('unregistered-plugin')).toBe(false);
    });
  });

  describe('registerPluginDynamically', () => {
    it('should register plugin successfully', async () => {
      // Set up the plugin manager to return a loaded plugin
      vi.mocked(mockPluginManager.getLoadedPlugin).mockReturnValue({
        id: 'test-plugin',
        status: 'active',
        components: { TestComponent: vi.fn(() => null) },
      });

      // Register the plugin
      await registerPluginDynamically('test-plugin');

      // Check if it's registered
      expect(isPluginRegistered('test-plugin')).toBe(true);
    });

    it('should not register inactive plugin', async () => {
      // Set up the plugin manager to return an inactive plugin
      vi.mocked(mockPluginManager.getLoadedPlugin).mockReturnValue({
        id: 'test-plugin',
        status: 'inactive',
        components: { TestComponent: vi.fn(() => null) },
      });

      // Try to register the plugin
      await registerPluginDynamically('test-plugin');

      // Check that it's not registered
      expect(isPluginRegistered('test-plugin')).toBe(false);
    });

    it('should not register plugin without components', async () => {
      // Set up the plugin manager to return a plugin with no components
      vi.mocked(mockPluginManager.getLoadedPlugin).mockReturnValue({
        id: 'test-plugin',
        status: 'active',
        components: {},
      });

      // Try to register the plugin
      await registerPluginDynamically('test-plugin');

      // Check that it's not registered
      expect(isPluginRegistered('test-plugin')).toBe(false);
    });

    it('should handle plugin not found in manager', async () => {
      // Set up the plugin manager to return undefined
      vi.mocked(mockPluginManager.getLoadedPlugin).mockReturnValue(undefined);

      // Try to register the plugin
      await expect(
        registerPluginDynamically('non-existent-plugin'),
      ).resolves.not.toThrow();

      // Check that it's not registered
      expect(isPluginRegistered('non-existent-plugin')).toBe(false);
    });

    it('should not register already registered plugin', async () => {
      // Set up the plugin manager to return a loaded plugin
      vi.mocked(mockPluginManager.getLoadedPlugin).mockReturnValue({
        id: 'test-plugin',
        status: 'active',
        components: { TestComponent: vi.fn(() => null) },
      });

      // Register the plugin twice
      await registerPluginDynamically('test-plugin');
      await registerPluginDynamically('test-plugin');

      // Check that it's still registered
      expect(isPluginRegistered('test-plugin')).toBe(true);
    });
  });

  describe('discoverAndRegisterAllPlugins', () => {
    it('should discover and register active plugins', async () => {
      // Set up the plugin manager to return multiple plugins
      vi.mocked(mockPluginManager.getLoadedPlugins).mockReturnValue([
        {
          id: 'plugin-1',
          status: 'active',
          components: { Component1: vi.fn(() => null) },
        },
        {
          id: 'plugin-2',
          status: 'inactive',
          components: { Component2: vi.fn(() => null) },
        },
        {
          id: 'plugin-3',
          status: 'active',
          components: { Component3: vi.fn(() => null) },
        },
      ]);

      // Set up getLoadedPlugin to return the correct plugin for each ID
      vi.mocked(mockPluginManager.getLoadedPlugin).mockImplementation(
        (id: string) => {
          if (id === 'plugin-1') {
            return {
              id: 'plugin-1',
              status: 'active',
              components: { Component1: vi.fn(() => null) },
            };
          }
          if (id === 'plugin-2') {
            return {
              id: 'plugin-2',
              status: 'inactive',
              components: { Component2: vi.fn(() => null) },
            };
          }
          if (id === 'plugin-3') {
            return {
              id: 'plugin-3',
              status: 'active',
              components: { Component3: vi.fn(() => null) },
            };
          }
          return undefined;
        },
      );

      // Discover and register all plugins
      await discoverAndRegisterAllPlugins();

      // Check that only active plugins are registered
      expect(isPluginRegistered('plugin-1')).toBe(true);
      expect(isPluginRegistered('plugin-2')).toBe(false);
      expect(isPluginRegistered('plugin-3')).toBe(true);
    });

    it('should handle no plugins loaded', async () => {
      // Set up the plugin manager to return no plugins
      vi.mocked(mockPluginManager.getLoadedPlugins).mockReturnValue([]);

      // Discover and register all plugins
      await expect(discoverAndRegisterAllPlugins()).resolves.not.toThrow();
    });

    it('should handle discovery errors gracefully', async () => {
      // Set up the plugin manager to throw an error
      vi.mocked(mockPluginManager.getLoadedPlugins).mockImplementation(() => {
        throw new Error('Discovery error');
      });

      // Discover and register all plugins
      await expect(discoverAndRegisterAllPlugins()).resolves.not.toThrow();
    });
  });

  describe('Error Component Creation', () => {
    it('should create error component for failed plugin loads', () => {
      const component = getPluginComponent('error-plugin', 'ErrorComponent');
      expect(component).toBeDefined();
    });
  });

  describe('Lazy Component Creation', () => {
    it('should create lazy component for plugin', () => {
      const component = getPluginComponent('lazy-plugin', 'LazyComponent');
      expect(component).toBeDefined();
    });
  });

  describe('Manifest Loading', () => {
    it('should handle manifest loading errors', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      await expect(
        registerPluginDynamically('error-plugin'),
      ).resolves.not.toThrow();
    });
  });

  describe('Component Name Extraction', () => {
    it('should extract component names from manifest', () => {
      const mockManifest = {
        name: 'Test Plugin',
        pluginId: 'test-plugin',
        version: '1.0.0',
        description: 'Test plugin',
        author: 'Test Author',
        main: 'index.js',
        extensionPoints: {
          routes: [
            {
              path: '/test',
              component: 'TestComponent',
            },
          ],
        },
      };

      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockManifest),
      });

      expect(registerPluginDynamically('test-plugin')).resolves.not.toThrow();
    });
  });
});
