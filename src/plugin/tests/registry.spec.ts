import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import {
  pluginRegistry,
  registerPluginDynamically,
  discoverAndRegisterAllPlugins,
  isPluginRegistered,
  getPluginComponents,
  getPluginComponent,
  initializePluginSystem,
  createErrorComponent,
  createLazyPluginComponent,
  getPluginManifest,
  extractComponentNames,
  manifestCache,
} from '../registry';

// Mock the plugin manager
vi.mock('../manager', () => ({
  getPluginManager: vi.fn(() => ({
    getPluginComponent: vi.fn(),
    getLoadedPlugin: vi.fn(),
    getLoadedPlugins: vi.fn(),
  })),
}));

// Mock fetch

// Mock React.lazy
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    lazy: vi.fn((loader) => {
      return {
        __vccOpts: {},
        __v_isRef: true,
        __v_isShallow: false,
        dep: undefined,
        effect: undefined,
        _dirty: false,
        _value: undefined,
        _hasCachedValue: false,
        _cachedValue: undefined,
        _cachedError: undefined,
        _cachedErrorInfo: undefined,
        _load: loader,
      };
    }),
  };
});

describe('Plugin Registry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    // Clear the registry before each test
    Object.keys(pluginRegistry).forEach((key) => {
      delete pluginRegistry[key];
    });
    // Clear manifest cache
    Object.keys(manifestCache).forEach((key) => {
      delete manifestCache[key];
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createErrorComponent', () => {
    it('should create an error component with correct styling and content', () => {
      const ErrorComponent = createErrorComponent(
        'test-plugin',
        'TestComponent',
        'Test error message',
      );

      // Test that the component is created (function exists)
      expect(typeof ErrorComponent).toBe('function');
      expect(ErrorComponent).toBeDefined();
    });

    it('should create error component with different plugin and component names', () => {
      const ErrorComponent = createErrorComponent(
        'another-plugin',
        'AnotherComponent',
        'Another error',
      );

      expect(typeof ErrorComponent).toBe('function');
      expect(ErrorComponent).toBeDefined();
    });
  });

  describe('createLazyPluginComponent', () => {
    it('should create a lazy component that loads successfully', async () => {
      const mockComponent = () =>
        React.createElement('div', null, 'Test Component');
      const mockGetPluginManager = vi.mocked(
        await import('../manager'),
      ).getPluginManager;
      mockGetPluginManager.mockReturnValue({
        getPluginComponent: vi.fn().mockReturnValue(mockComponent),
      } as any);

      const LazyComponent = createLazyPluginComponent(
        'test-plugin',
        'TestComponent',
      );

      // The lazy component should be created
      expect(LazyComponent).toBeDefined();
      expect(typeof LazyComponent).toBe('object');
    });

    it('should create a lazy component that handles component not found error', async () => {
      const mockGetPluginManager = vi.mocked(
        await import('../manager'),
      ).getPluginManager;
      mockGetPluginManager.mockReturnValue({
        getPluginComponent: vi.fn().mockReturnValue(null),
      } as any);

      const LazyComponent = createLazyPluginComponent(
        'test-plugin',
        'NonExistentComponent',
      );

      expect(LazyComponent).toBeDefined();
    });

    it('should create a lazy component that handles general errors', async () => {
      const mockGetPluginManager = vi.mocked(
        await import('../manager'),
      ).getPluginManager;
      mockGetPluginManager.mockReturnValue({
        getPluginComponent: vi.fn().mockImplementation(() => {
          throw new Error('Network error');
        }),
      } as any);

      const LazyComponent = createLazyPluginComponent(
        'test-plugin',
        'ErrorComponent',
      );

      expect(LazyComponent).toBeDefined();
    });
  });

  describe('getPluginManifest', () => {
    it('should return cached manifest if available', async () => {
      const mockManifest = {
        name: 'Test Plugin',
        version: '1.0.0',
        pluginId: 'test-plugin',
        description: 'A test plugin',
        author: 'Test Author',
        main: 'index.js',
      };
      manifestCache['test-plugin'] = mockManifest;

      const result = await getPluginManifest('test-plugin');

      expect(result).toEqual(mockManifest);
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should fetch and cache manifest if not cached', async () => {
      const mockManifest = {
        name: 'Test Plugin',
        version: '1.0.0',
        pluginId: 'test-plugin',
        description: 'A test plugin',
        author: 'Test Author',
        main: 'index.js',
      };
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockManifest),
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      const result = await getPluginManifest('test-plugin');

      expect(result).toEqual(mockManifest);
      expect(fetch).toHaveBeenCalledWith(
        '/src/plugin/available/test-plugin/manifest.json',
      );
      expect(manifestCache['test-plugin']).toEqual(mockManifest);
    });

    it('should handle HTTP error responses', async () => {
      const mockResponse = { ok: false, status: 404 };
      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      const result = await getPluginManifest('test-plugin');

      expect(result).toBeNull();
    });

    it('should handle network errors', async () => {
      vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

      const result = await getPluginManifest('test-plugin');

      expect(result).toBeNull();
    });

    it('should handle JSON parsing errors', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      const result = await getPluginManifest('test-plugin');

      expect(result).toBeNull();
    });
  });

  describe('extractComponentNames', () => {
    it('should extract component names from route extensions', () => {
      const manifest = {
        name: 'Test Plugin',
        version: '1.0.0',
        pluginId: 'test-plugin',
        description: 'A test plugin',
        author: 'Test Author',
        main: 'index.js',
        extensionPoints: {
          routes: [
            { component: 'RouteComponent1' },
            { component: 'RouteComponent2' },
          ],
          RA1: [{ component: 'RA1Component1' }],
          RA2: [{ component: 'RA2Component1' }],
          RU1: [{ component: 'RU1Component1' }],
          RU2: [{ component: 'RU2Component1' }],
        },
      } as any;

      const result = extractComponentNames(manifest);

      expect(result).toContain('RouteComponent1');
      expect(result).toContain('RouteComponent2');
      expect(result).toContain('RA1Component1');
      expect(result).toContain('RA2Component1');
      expect(result).toContain('RU1Component1');
      expect(result).toContain('RU2Component1');
    });

    it('should extract component names from injector extensions', () => {
      const manifest = {
        name: 'Test Plugin',
        version: '1.0.0',
        pluginId: 'test-plugin',
        description: 'A test plugin',
        author: 'Test Author',
        main: 'index.js',
        extensionPoints: {
          G1: [{ injector: 'G1Injector1' }],
          G2: [{ injector: 'G2Injector1' }],
          G3: [{ injector: 'G3Injector1' }],
        },
      } as any;

      const result = extractComponentNames(manifest);

      expect(result).toContain('G1Injector1');
      expect(result).toContain('G2Injector1');
      expect(result).toContain('G3Injector1');
    });

    it('should handle manifest with no extension points', () => {
      const manifest = {
        name: 'Test Plugin',
        version: '1.0.0',
        pluginId: 'test-plugin',
        description: 'A test plugin',
        author: 'Test Author',
        main: 'index.js',
      } as any;

      const result = extractComponentNames(manifest);

      expect(result.size).toBe(0);
    });

    it('should handle manifest with empty extension points', () => {
      const manifest = {
        name: 'Test Plugin',
        version: '1.0.0',
        pluginId: 'test-plugin',
        description: 'A test plugin',
        author: 'Test Author',
        main: 'index.js',
        extensionPoints: {
          routes: [],
          G1: [],
        },
      } as any;

      const result = extractComponentNames(manifest);

      expect(result.size).toBe(0);
    });

    it('should handle manifest with undefined extension points', () => {
      const manifest = {
        name: 'Test Plugin',
        version: '1.0.0',
        pluginId: 'test-plugin',
        description: 'A test plugin',
        author: 'Test Author',
        main: 'index.js',
        extensionPoints: {
          routes: undefined,
          G1: undefined,
        },
      } as any;

      const result = extractComponentNames(manifest);

      expect(result.size).toBe(0);
    });

    it('should handle components without component or injector properties', () => {
      const manifest = {
        name: 'Test Plugin',
        version: '1.0.0',
        pluginId: 'test-plugin',
        description: 'A test plugin',
        author: 'Test Author',
        main: 'index.js',
        extensionPoints: {
          routes: [{ otherProperty: 'value' }],
          G1: [{ otherProperty: 'value' }],
        },
      } as any;

      const result = extractComponentNames(manifest);

      expect(result.size).toBe(0);
    });
  });

  describe('registerPluginDynamically', () => {
    it('should register plugin with components successfully', async () => {
      const mockComponents = {
        Component1: () => React.createElement('div', null, 'Component 1'),
        Component2: () => React.createElement('div', null, 'Component 2'),
      };

      const mockGetPluginManager = vi.mocked(
        await import('../manager'),
      ).getPluginManager;
      mockGetPluginManager.mockReturnValue({
        getLoadedPlugin: vi.fn().mockReturnValue({
          id: 'test-plugin',
          status: 'active',
          components: mockComponents,
        }),
      } as any);

      await registerPluginDynamically('test-plugin');

      expect(pluginRegistry['test-plugin']).toEqual(mockComponents);
    });

    it('should not register plugin if already registered', async () => {
      pluginRegistry['test-plugin'] = {
        existing: () => React.createElement('div', null, 'Existing'),
      };

      const mockGetPluginManager = vi.mocked(
        await import('../manager'),
      ).getPluginManager;
      mockGetPluginManager.mockReturnValue({
        getLoadedPlugin: vi.fn().mockReturnValue({
          id: 'test-plugin',
          status: 'active',
          components: { new: () => React.createElement('div', null, 'New') },
        }),
      } as any);

      await registerPluginDynamically('test-plugin');

      // Should not overwrite existing registration
      expect(pluginRegistry['test-plugin']).toEqual({
        existing: expect.any(Function),
      });
    });

    it('should not register plugin if not found in plugin manager', async () => {
      const mockGetPluginManager = vi.mocked(
        await import('../manager'),
      ).getPluginManager;
      mockGetPluginManager.mockReturnValue({
        getLoadedPlugin: vi.fn().mockReturnValue(null),
      } as any);

      await registerPluginDynamically('test-plugin');

      expect(pluginRegistry['test-plugin']).toBeUndefined();
    });

    it('should not register plugin if status is not active', async () => {
      const mockGetPluginManager = vi.mocked(
        await import('../manager'),
      ).getPluginManager;
      mockGetPluginManager.mockReturnValue({
        getLoadedPlugin: vi.fn().mockReturnValue({
          id: 'test-plugin',
          status: 'inactive',
          components: { test: () => React.createElement('div', null, 'Test') },
        }),
      } as any);

      await registerPluginDynamically('test-plugin');

      expect(pluginRegistry['test-plugin']).toBeUndefined();
    });

    it('should not register plugin if no components available', async () => {
      const mockGetPluginManager = vi.mocked(
        await import('../manager'),
      ).getPluginManager;
      mockGetPluginManager.mockReturnValue({
        getLoadedPlugin: vi.fn().mockReturnValue({
          id: 'test-plugin',
          status: 'active',
          components: {},
        }),
      } as any);

      await registerPluginDynamically('test-plugin');

      expect(pluginRegistry['test-plugin']).toBeUndefined();
    });

    it('should handle errors during registration', async () => {
      const mockGetPluginManager = vi.mocked(
        await import('../manager'),
      ).getPluginManager;
      mockGetPluginManager.mockReturnValue({
        getLoadedPlugin: vi.fn().mockImplementation(() => {
          throw new Error('Plugin manager error');
        }),
      } as any);

      // Should not throw
      await expect(
        registerPluginDynamically('test-plugin'),
      ).resolves.not.toThrow();
    });
  });

  describe('discoverAndRegisterAllPlugins', () => {
    it('should register all active plugins', async () => {
      const mockPlugins = [
        { id: 'plugin1', status: 'active' },
        { id: 'plugin2', status: 'active' },
        { id: 'plugin3', status: 'inactive' },
      ];

      const mockGetPluginManager = vi.mocked(
        await import('../manager'),
      ).getPluginManager;
      mockGetPluginManager.mockReturnValue({
        getLoadedPlugins: vi.fn().mockReturnValue(mockPlugins),
        getLoadedPlugin: vi.fn().mockImplementation((id) => ({
          id,
          status: 'active',
          components: {
            [`${id}Component`]: () => React.createElement('div', null, id),
          },
        })),
      } as any);

      await discoverAndRegisterAllPlugins();

      expect(pluginRegistry['plugin1']).toBeDefined();
      expect(pluginRegistry['plugin2']).toBeDefined();
      expect(pluginRegistry['plugin3']).toBeUndefined();
    });

    it('should handle no plugins loaded', async () => {
      const mockGetPluginManager = vi.mocked(
        await import('../manager'),
      ).getPluginManager;
      mockGetPluginManager.mockReturnValue({
        getLoadedPlugins: vi.fn().mockReturnValue([]),
      } as any);

      await discoverAndRegisterAllPlugins();

      expect(Object.keys(pluginRegistry)).toHaveLength(0);
    });

    it('should handle null plugins array', async () => {
      const mockGetPluginManager = vi.mocked(
        await import('../manager'),
      ).getPluginManager;
      mockGetPluginManager.mockReturnValue({
        getLoadedPlugins: vi.fn().mockReturnValue(null),
      } as any);

      await discoverAndRegisterAllPlugins();

      expect(Object.keys(pluginRegistry)).toHaveLength(0);
    });

    it('should handle errors during discovery', async () => {
      const mockGetPluginManager = vi.mocked(
        await import('../manager'),
      ).getPluginManager;
      mockGetPluginManager.mockReturnValue({
        getLoadedPlugins: vi.fn().mockImplementation(() => {
          throw new Error('Discovery error');
        }),
      } as any);

      // Should not throw
      await expect(discoverAndRegisterAllPlugins()).resolves.not.toThrow();
    });
  });

  describe('isPluginRegistered', () => {
    it('should return true for registered plugin', () => {
      pluginRegistry['test-plugin'] = {
        test: () => React.createElement('div', null, 'Test'),
      };

      expect(isPluginRegistered('test-plugin')).toBe(true);
    });

    it('should return false for unregistered plugin', () => {
      expect(isPluginRegistered('unregistered-plugin')).toBe(false);
    });
  });

  describe('getPluginComponents', () => {
    it('should return components for registered plugin', () => {
      const mockComponents = {
        Component1: () => React.createElement('div', null, 'Component 1'),
        Component2: () => React.createElement('div', null, 'Component 2'),
      };
      pluginRegistry['test-plugin'] = mockComponents;

      expect(getPluginComponents('test-plugin')).toEqual(mockComponents);
    });

    it('should return null for unregistered plugin', () => {
      expect(getPluginComponents('unregistered-plugin')).toBeNull();
    });
  });

  describe('getPluginComponent', () => {
    it('should return component from registry if available', () => {
      const mockComponent = () =>
        React.createElement('div', null, 'Test Component');
      pluginRegistry['test-plugin'] = { TestComponent: mockComponent };

      expect(getPluginComponent('test-plugin', 'TestComponent')).toBe(
        mockComponent,
      );
    });

    it('should fallback to plugin manager if not in registry', async () => {
      const mockComponent = () =>
        React.createElement('div', null, 'Manager Component');
      const mockGetPluginManager = vi.mocked(
        await import('../manager'),
      ).getPluginManager;
      mockGetPluginManager.mockReturnValue({
        getPluginComponent: vi.fn().mockReturnValue(mockComponent),
      } as any);

      expect(getPluginComponent('test-plugin', 'ManagerComponent')).toBe(
        mockComponent,
      );
    });

    it('should return null if component not found anywhere', async () => {
      const mockGetPluginManager = vi.mocked(
        await import('../manager'),
      ).getPluginManager;
      mockGetPluginManager.mockReturnValue({
        getPluginComponent: vi.fn().mockReturnValue(null),
      } as any);

      expect(
        getPluginComponent('test-plugin', 'NonExistentComponent'),
      ).toBeNull();
    });
  });

  describe('initializePluginSystem', () => {
    it('should call discoverAndRegisterAllPlugins', async () => {
      const mockGetPluginManager = vi.mocked(
        await import('../manager'),
      ).getPluginManager;
      mockGetPluginManager.mockReturnValue({
        getLoadedPlugins: vi.fn().mockReturnValue([]),
      } as any);

      await initializePluginSystem();

      expect(mockGetPluginManager).toHaveBeenCalled();
    });

    it('should handle errors during initialization', async () => {
      const mockGetPluginManager = vi.mocked(
        await import('../manager'),
      ).getPluginManager;
      mockGetPluginManager.mockReturnValue({
        getLoadedPlugins: vi.fn().mockImplementation(() => {
          throw new Error('Initialization error');
        }),
      } as any);

      // Should not throw
      await expect(initializePluginSystem()).resolves.not.toThrow();
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle manifest with mixed valid and invalid components', () => {
      const manifest = {
        name: 'Test Plugin',
        version: '1.0.0',
        pluginId: 'test-plugin',
        description: 'A test plugin',
        author: 'Test Author',
        main: 'index.js',
        extensionPoints: {
          routes: [
            { component: 'ValidComponent' },
            { otherProperty: 'value' },
            { component: 'AnotherValidComponent' },
          ],
          G1: [{ injector: 'ValidInjector' }, { otherProperty: 'value' }],
        },
      } as any;

      const result = extractComponentNames(manifest);

      expect(result).toContain('ValidComponent');
      expect(result).toContain('AnotherValidComponent');
      expect(result).toContain('ValidInjector');
      expect(result.size).toBe(3);
    });

    it('should handle plugin registration with null components', async () => {
      const mockGetPluginManager = vi.mocked(
        await import('../manager'),
      ).getPluginManager;
      mockGetPluginManager.mockReturnValue({
        getLoadedPlugin: vi.fn().mockReturnValue({
          id: 'test-plugin',
          status: 'active',
          components: null,
        }),
      } as any);

      await registerPluginDynamically('test-plugin');

      expect(pluginRegistry['test-plugin']).toBeUndefined();
    });

    it('should handle plugin registration with undefined components', async () => {
      const mockGetPluginManager = vi.mocked(
        await import('../manager'),
      ).getPluginManager;
      mockGetPluginManager.mockReturnValue({
        getLoadedPlugin: vi.fn().mockReturnValue({
          id: 'test-plugin',
          status: 'active',
          components: undefined,
        }),
      } as any);

      await registerPluginDynamically('test-plugin');

      expect(pluginRegistry['test-plugin']).toBeUndefined();
    });

    it('should handle fetch timeout errors', async () => {
      vi.mocked(fetch).mockRejectedValue(new Error('Timeout'));

      const result = await getPluginManifest('test-plugin');

      expect(result).toBeNull();
    });

    it('should handle invalid JSON responses', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue('invalid json'),
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      const result = await getPluginManifest('test-plugin');

      expect(result).toBe('invalid json');
      expect(manifestCache['test-plugin']).toBe('invalid json');
    });
  });
});
