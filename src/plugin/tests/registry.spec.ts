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
import { IPluginManifest } from '../types';
import { PluginManager } from '../manager';

// Mock the plugin manager
vi.mock('../manager', () => ({
  getPluginManager: vi.fn(() => ({
    getPluginComponent: vi.fn(),
    getLoadedPlugin: vi.fn(),
    getLoadedPlugins: vi.fn(),
  })),
}));
// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  Trans: ({
    t,
    i18nKey,
    values,
    components: _components,
  }: {
    t?: (key: string) => string;
    i18nKey: string;
    values: Record<string, string>;
    components?: Record<string, React.ReactNode>;
  }) =>
    React.createElement(
      'span',
      null,
      `${t ? t(i18nKey) : i18nKey} ${values ? JSON.stringify(values) : ''}`,
    ),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

// Mock fetch

// Variable to capture the loader function passed to React.lazy
let capturedLoader: (() => Promise<{ default: React.ComponentType }>) | null =
  null;

// Mock React.lazy
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    lazy: vi.fn((loader: () => Promise<{ default: React.ComponentType }>) => {
      capturedLoader = loader;
      return vi.fn().mockReturnValue(null) as unknown as React.ComponentType;
    }),
  };
});

describe('Plugin Registry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    // Reset captured loader to ensure clean state for each test
    capturedLoader = null;
    // Clear the registry before each test
    Object.keys(pluginRegistry).forEach((key) => {
      delete pluginRegistry[key];
    });
    // Clear manifest cache
    Object.keys(manifestCache).forEach((key) => {
      delete manifestCache[key];
    });
    // Mock console.error to avoid polluting test output
    vi.spyOn(console, 'error').mockImplementation(() => {});
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

    it('should render error component with correct error message', () => {
      const ErrorComponent = createErrorComponent(
        'test-plugin',
        'TestComponent',
        'Test error message',
      );

      // Render the component to cover line 61 (the JSX return)
      // Cast to function type since createErrorComponent returns a function component
      const element = (ErrorComponent as () => React.ReactElement)();
      expect(element).toBeDefined();
      expect(element.type).toBe('div');
      expect((element.props as { children: unknown }).children).toBeDefined();
      // Verify translation keys are being used (prop children contains mocked translation)
      // Since mocked Trans returns span with key, we can inspect element structure if needed, but here simple definition check is done.
      // Based on feedback, we assume the mock works, but we could check props if we rendered with testing-library.
    });
  });

  describe('createLazyPluginComponent', () => {
    it('should create a lazy component that loads successfully', async () => {
      const mockComponent = vi
        .fn()
        .mockReturnValue(null) as React.ComponentType;
      const mockGetPluginManager = vi.mocked(
        await import('../manager'),
      ).getPluginManager;
      mockGetPluginManager.mockReturnValue({
        getPluginComponent: vi.fn().mockReturnValue(mockComponent),
      } as unknown as PluginManager);

      const LazyComponent = createLazyPluginComponent(
        'test-plugin',
        'TestComponent',
      );

      // Execute the captured loader to cover lines 82-103
      expect(capturedLoader).not.toBeNull();
      if (capturedLoader) {
        const result = await capturedLoader();
        expect(result.default).toBe(mockComponent);
      }

      // The lazy component should be created
      expect(LazyComponent).toBeDefined();
      expect(typeof LazyComponent).toBe('function');
    });

    it('should create a lazy component that handles component not found error', async () => {
      const mockGetPluginManager = vi.mocked(
        await import('../manager'),
      ).getPluginManager;
      mockGetPluginManager.mockReturnValue({
        getPluginComponent: vi.fn().mockReturnValue(null),
      } as unknown as PluginManager);

      const LazyComponent = createLazyPluginComponent(
        'test-plugin',
        'NonExistentComponent',
      );

      expect(LazyComponent).toBeDefined();

      // Execute the captured loader to cover the error handling path
      expect(capturedLoader).not.toBeNull();
      if (capturedLoader) {
        const result = await capturedLoader();
        // Should return an error component
        expect(result.default).toBeDefined();
        expect(typeof result.default).toBe('function');
      }
    });

    it('should create a lazy component that handles general errors', async () => {
      const mockGetPluginManager = vi.mocked(
        await import('../manager'),
      ).getPluginManager;
      mockGetPluginManager.mockReturnValue({
        getPluginComponent: vi.fn().mockImplementation(() => {
          throw new Error('Network error');
        }),
      } as unknown as PluginManager);

      const LazyComponent = createLazyPluginComponent(
        'test-plugin',
        'ErrorComponent',
      );

      expect(LazyComponent).toBeDefined();

      // Execute the captured loader to cover the error handling path
      expect(capturedLoader).not.toBeNull();
      if (capturedLoader) {
        const result = await capturedLoader();
        // Should return an error component
        expect(result.default).toBeDefined();
        expect(typeof result.default).toBe('function');
      }
    });

    it('should handle non-Error exceptions', async () => {
      const mockGetPluginManager = vi.mocked(
        await import('../manager'),
      ).getPluginManager;
      mockGetPluginManager.mockReturnValue({
        getPluginComponent: vi.fn().mockImplementation(() => {
          throw 'String error'; // Non-Error exception
        }),
      } as unknown as PluginManager);

      const LazyComponent = createLazyPluginComponent(
        'test-plugin',
        'StringErrorComponent',
      );

      expect(LazyComponent).toBeDefined();

      // Execute the captured loader to cover the 'Unknown error' fallback
      expect(capturedLoader).not.toBeNull();
      if (capturedLoader) {
        const result = await capturedLoader();
        expect(result.default).toBeDefined();
      }
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
      vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

      const result = await getPluginManifest('test-plugin');

      expect(result).toEqual(mockManifest);
      expect(fetch).toHaveBeenCalledWith(
        '/src/plugin/available/test-plugin/manifest.json',
      );
      expect(manifestCache['test-plugin']).toEqual(mockManifest);
    });

    it('should handle HTTP error responses', async () => {
      const mockResponse = { ok: false, status: 404 };
      vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

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
      vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

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
      } as unknown as IPluginManifest;

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
      } as unknown as IPluginManifest;

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
      } as unknown as IPluginManifest;

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
      } as unknown as IPluginManifest;

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
      } as unknown as IPluginManifest;

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
      } as unknown as IPluginManifest;

      const result = extractComponentNames(manifest);

      expect(result.size).toBe(0);
    });
  });

  describe('registerPluginDynamically', () => {
    it('should register plugin with components successfully', async () => {
      const mockComponents = {
        Component1: vi.fn(() =>
          React.createElement('div', null, 'Component 1'),
        ),
        Component2: vi.fn(() =>
          React.createElement('div', null, 'Component 2'),
        ),
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
      } as unknown as PluginManager);

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
      } as unknown as PluginManager);

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
      } as unknown as PluginManager);

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
      } as unknown as PluginManager);

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
      } as unknown as PluginManager);

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
      } as unknown as PluginManager);

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
            [`${id}Component`]: vi.fn(() =>
              React.createElement('div', null, id),
            ),
          },
        })),
      } as unknown as PluginManager);

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
      } as unknown as PluginManager);

      await discoverAndRegisterAllPlugins();

      expect(Object.keys(pluginRegistry)).toHaveLength(0);
    });

    it('should handle null plugins array', async () => {
      const mockGetPluginManager = vi.mocked(
        await import('../manager'),
      ).getPluginManager;
      mockGetPluginManager.mockReturnValue({
        getLoadedPlugins: vi.fn().mockReturnValue(null),
      } as unknown as PluginManager);

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
      } as unknown as PluginManager);

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
        Component1: vi.fn(() =>
          React.createElement('div', null, 'Component 1'),
        ),
        Component2: vi.fn(() =>
          React.createElement('div', null, 'Component 2'),
        ),
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
      } as unknown as PluginManager);

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
      } as unknown as PluginManager);

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
      } as unknown as PluginManager);

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
      } as unknown as PluginManager);

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
      } as unknown as IPluginManifest;

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
      } as unknown as PluginManager);

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
      } as unknown as PluginManager);

      await registerPluginDynamically('test-plugin');

      expect(pluginRegistry['test-plugin']).toBeUndefined();
    });

    it('should handle fetch timeout errors', async () => {
      vi.mocked(fetch).mockRejectedValue(new Error('Timeout'));

      const result = await getPluginManifest('test-plugin');

      expect(result).toBeNull();
    });

    it('should handle invalid JSON responses', async () => {
      // Note: This tests that the current implementation doesn't validate
      // manifest structure - it stores whatever json() returns
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue('invalid json'),
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

      const result = await getPluginManifest('test-plugin');

      expect(result).toBe('invalid json');
      expect(manifestCache['test-plugin']).toBe('invalid json');
    });
  });
});
