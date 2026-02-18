import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { ApolloClient } from '@apollo/client';
import {
  PluginManager,
  getPluginManager,
  resetPluginManager,
} from '../manager';
import { PluginStatus } from '../types';

// Mock the manager dependencies
vi.mock('../managers/discovery', () => ({
  DiscoveryManager: vi.fn().mockImplementation(() => ({
    loadPluginIndexFromGraphQL: vi.fn().mockResolvedValue(undefined),
    discoverPlugins: vi.fn().mockResolvedValue([]),
    loadPluginManifest: vi.fn().mockResolvedValue({
      name: 'Test Plugin',
      pluginId: 'test-plugin',
      version: '1.0.0',
      description: 'Test plugin',
      author: 'Test Author',
      main: 'index.js',
    }),
    loadPluginComponents: vi.fn().mockResolvedValue({
      TestComponent: vi.fn(() => null),
    }),
    syncPluginWithGraphQL: vi.fn().mockResolvedValue(undefined),
    removePluginFromGraphQL: vi.fn().mockResolvedValue(undefined),
    updatePluginStatusInGraphQL: vi.fn().mockResolvedValue(undefined),
    isPluginActivated: vi.fn().mockReturnValue(true),
    setGraphQLService: vi.fn(),
  })),
}));

vi.mock('../managers/extension-registry', () => ({
  ExtensionRegistryManager: vi.fn().mockImplementation(() => ({
    getExtensionPoints: vi.fn().mockReturnValue([]),
    registerExtensionPoints: vi.fn(),
    unregisterExtensionPoints: vi.fn(),
  })),
}));

vi.mock('../managers/event-manager', () => ({
  EventManager: vi.fn().mockImplementation(() => ({
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  })),
}));

vi.mock('../managers/lifecycle', () => ({
  LifecycleManager: vi.fn().mockImplementation(() => ({
    loadPlugin: vi.fn().mockResolvedValue(true),
    unloadPlugin: vi.fn().mockResolvedValue(true),
    installPlugin: vi.fn().mockResolvedValue(true),
    uninstallPlugin: vi.fn().mockResolvedValue(true),
    activatePlugin: vi.fn().mockResolvedValue(true),
    deactivatePlugin: vi.fn().mockResolvedValue(true),
    togglePluginStatus: vi.fn().mockResolvedValue(true),
    getLoadedPlugins: vi.fn().mockReturnValue([]),
    getLoadedPlugin: vi.fn().mockReturnValue({
      id: 'test-plugin',
      manifest: {
        name: 'Test Plugin',
        pluginId: 'test-plugin',
        version: '1.0.0',
        description: 'Test plugin',
        author: 'Test Author',
        main: 'index.js',
      },
      components: {
        TestComponent: vi.fn(() => null),
      },
      status: PluginStatus.ACTIVE,
    }),
    getPluginComponent: vi.fn().mockReturnValue(vi.fn(() => null)),
    getPluginCount: vi.fn().mockReturnValue(1),
    getActivePluginCount: vi.fn().mockReturnValue(1),
  })),
}));

vi.mock('../graphql-service', () => ({
  PluginGraphQLService: vi.fn().mockImplementation(() => ({
    getAllPlugins: vi.fn().mockResolvedValue([]),
    createPlugin: vi.fn().mockResolvedValue({}),
    updatePlugin: vi.fn().mockResolvedValue({}),
    deletePlugin: vi.fn().mockResolvedValue({}),
  })),
}));

const mockApolloClient = {
  query: vi.fn(),
  mutate: vi.fn(),
} as unknown as ApolloClient<unknown>;

describe('PluginManager', () => {
  let pluginManager: PluginManager;

  beforeEach(() => {
    vi.clearAllMocks();
    resetPluginManager();
  });

  afterEach(() => {
    resetPluginManager();
    vi.clearAllMocks();
  });

  describe('Constructor and Initialization', () => {
    it('should create a new PluginManager instance', () => {
      pluginManager = new PluginManager();
      expect(pluginManager).toBeInstanceOf(PluginManager);
    });

    it('should create a new PluginManager instance with Apollo client', () => {
      pluginManager = new PluginManager(mockApolloClient);
      expect(pluginManager).toBeInstanceOf(PluginManager);
    });

    it('should initialize managers correctly', () => {
      pluginManager = new PluginManager();
      expect(pluginManager).toBeInstanceOf(PluginManager);
    });
  });

  describe('setApolloClient', () => {
    it('should set Apollo client successfully', () => {
      pluginManager = new PluginManager();
      expect(() =>
        pluginManager.setApolloClient(mockApolloClient),
      ).not.toThrow();
    });

    it('should throw error when Apollo client is null', () => {
      pluginManager = new PluginManager();
      expect(() =>
        pluginManager.setApolloClient(null as unknown as never),
      ).toThrow('Apollo client cannot be null or undefined');
    });

    it('should throw error when Apollo client is undefined', () => {
      pluginManager = new PluginManager();
      expect(() =>
        pluginManager.setApolloClient(undefined as unknown as never),
      ).toThrow('Apollo client cannot be null or undefined');
    });
  });

  describe('Plugin Lifecycle Management', () => {
    beforeEach(() => {
      pluginManager = new PluginManager();
    });

    it('should load plugin successfully', async () => {
      const result = await pluginManager.loadPlugin('test-plugin');
      expect(typeof result).toBe('boolean');
    });

    it('should unload plugin successfully', async () => {
      const result = await pluginManager.unloadPlugin('test-plugin');
      expect(typeof result).toBe('boolean');
    });

    it('should install plugin successfully', async () => {
      const lifecycleManager = pluginManager['lifecycleManager'];
      const result = await pluginManager.installPlugin('test-plugin');
      expect(result).toBe(true);
      expect(lifecycleManager.installPlugin).toHaveBeenCalledWith(
        'test-plugin',
      );
      expect(lifecycleManager.installPlugin).toHaveBeenCalledTimes(1);
    });

    it('should uninstall plugin successfully', async () => {
      const lifecycleManager = pluginManager['lifecycleManager'];
      const result = await pluginManager.uninstallPlugin('test-plugin');
      expect(result).toBe(true);
      expect(lifecycleManager.uninstallPlugin).toHaveBeenCalledWith(
        'test-plugin',
      );
      expect(lifecycleManager.uninstallPlugin).toHaveBeenCalledTimes(1);
    });

    it('should activate plugin successfully', async () => {
      const lifecycleManager = pluginManager['lifecycleManager'];
      const result = await pluginManager.activatePlugin('test-plugin');
      expect(result).toBe(true);
      expect(lifecycleManager.activatePlugin).toHaveBeenCalledWith(
        'test-plugin',
      );
      expect(lifecycleManager.activatePlugin).toHaveBeenCalledTimes(1);
    });

    it('should deactivate plugin successfully', async () => {
      const lifecycleManager = pluginManager['lifecycleManager'];
      const result = await pluginManager.deactivatePlugin('test-plugin');
      expect(result).toBe(true);
      expect(lifecycleManager.deactivatePlugin).toHaveBeenCalledWith(
        'test-plugin',
      );
      expect(lifecycleManager.deactivatePlugin).toHaveBeenCalledTimes(1);
    });

    it('should toggle plugin status successfully', async () => {
      const result = await pluginManager.togglePluginStatus(
        'test-plugin',
        'active',
      );
      expect(typeof result).toBe('boolean');
    });

    it('should toggle plugin status to inactive successfully', async () => {
      const result = await pluginManager.togglePluginStatus(
        'test-plugin',
        'inactive',
      );
      expect(typeof result).toBe('boolean');
    });
  });

  describe('Plugin Information', () => {
    beforeEach(() => {
      pluginManager = new PluginManager();
    });

    it('should get loaded plugins', () => {
      const plugins = pluginManager.getLoadedPlugins();
      expect(Array.isArray(plugins)).toBe(true);
    });

    it('should get specific loaded plugin', () => {
      const plugin = pluginManager.getLoadedPlugin('test-plugin');
      expect(plugin).toBeDefined();
    });

    it('should get plugin component', () => {
      const component = pluginManager.getPluginComponent(
        'test-plugin',
        'TestComponent',
      );
      expect(component).toBeDefined();
    });

    it('should get plugin count', () => {
      const count = pluginManager.getPluginCount();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it('should get active plugin count', () => {
      const count = pluginManager.getActivePluginCount();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Plugin Discovery', () => {
    beforeEach(() => {
      pluginManager = new PluginManager();
    });

    it('should refresh plugin discovery successfully', async () => {
      await expect(
        pluginManager.refreshPluginDiscovery(),
      ).resolves.not.toThrow();
    });
  });

  describe('Extension Points', () => {
    beforeEach(() => {
      pluginManager = new PluginManager();
    });

    it('should get extension points for routes', () => {
      const routes = pluginManager.getExtensionPoints('routes');
      expect(Array.isArray(routes)).toBe(true);
    });

    it('should get extension points for drawer items', () => {
      const drawerItems = pluginManager.getExtensionPoints('drawer');
      expect(Array.isArray(drawerItems)).toBe(true);
    });

    it('should get extension points with admin permissions', () => {
      const routes = pluginManager.getExtensionPoints('RA1');
      expect(Array.isArray(routes)).toBe(true);
    });

    it('should get extension points with user permissions', () => {
      const routes = pluginManager.getExtensionPoints('RU1');
      expect(Array.isArray(routes)).toBe(true);
    });
  });

  describe('Event Management', () => {
    beforeEach(() => {
      pluginManager = new PluginManager();
    });

    it('should register event listener', () => {
      const callback = vi.fn();
      expect(() => pluginManager.on('test-event', callback)).not.toThrow();
    });

    it('should remove event listener', () => {
      const callback = vi.fn();
      pluginManager.on('test-event', callback);
      expect(() => pluginManager.off('test-event', callback)).not.toThrow();
    });
  });

  describe('System Status', () => {
    beforeEach(() => {
      pluginManager = new PluginManager();
    });

    it('should initialize plugin system when not already initialized', async () => {
      const { DiscoveryManager } = await import('../managers/discovery');

      const mockDiscoveryInstance = {
        loadPluginIndexFromGraphQL: vi.fn().mockResolvedValue(undefined),
        discoverPlugins: vi.fn().mockResolvedValue([]),
        setGraphQLService: vi.fn(),
        isPluginActivated: vi.fn().mockReturnValue(false),
        isPluginInstalled: vi.fn().mockReturnValue(false),
      };

      vi.mocked(DiscoveryManager).mockImplementation(
        () =>
          mockDiscoveryInstance as unknown as InstanceType<
            typeof DiscoveryManager
          >,
      );

      resetPluginManager();
      const freshManager = new PluginManager();

      await freshManager.initializePluginSystem();

      expect(freshManager.isSystemInitialized()).toBe(true);
    });

    it('should check if system is initialized', () => {
      const isInitialized = pluginManager.isSystemInitialized();
      expect(typeof isInitialized).toBe('boolean');
    });

    it('should not reinitialize if already initialized', async () => {
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(pluginManager.isSystemInitialized()).toBe(true);

      await pluginManager.initializePluginSystem();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Plugin system is already initialized',
      );
      consoleWarnSpy.mockRestore();
    });
  });

  describe('Async Initialization with Plugins', () => {
    it('should initialize successfully when plugins are discovered', async () => {
      const { DiscoveryManager } = await import('../managers/discovery');
      const { LifecycleManager } = await import('../managers/lifecycle');

      const mockDiscoveryInstance = {
        loadPluginIndexFromGraphQL: vi.fn().mockResolvedValue(undefined),
        discoverPlugins: vi.fn().mockResolvedValue(['plugin1', 'plugin2']),
        setGraphQLService: vi.fn(),
        isPluginActivated: vi.fn().mockReturnValue(true),
        isPluginInstalled: vi.fn().mockReturnValue(true),
      };

      const mockLifecycleInstance = {
        loadPlugin: vi.fn().mockResolvedValue(true),
        unloadPlugin: vi.fn().mockResolvedValue(true),
        installPlugin: vi.fn().mockResolvedValue(true),
        uninstallPlugin: vi.fn().mockResolvedValue(true),
        activatePlugin: vi.fn().mockResolvedValue(true),
        deactivatePlugin: vi.fn().mockResolvedValue(true),
        togglePluginStatus: vi.fn().mockResolvedValue(true),
        getLoadedPlugins: vi.fn().mockReturnValue([]),
        getLoadedPlugin: vi.fn().mockReturnValue(undefined),
        getPluginComponent: vi.fn().mockReturnValue(undefined),
        getPluginCount: vi.fn().mockReturnValue(0),
        getActivePluginCount: vi.fn().mockReturnValue(0),
      };

      vi.mocked(DiscoveryManager).mockImplementation(
        () =>
          mockDiscoveryInstance as unknown as InstanceType<
            typeof DiscoveryManager
          >,
      );
      vi.mocked(LifecycleManager).mockImplementation(
        () =>
          mockLifecycleInstance as unknown as InstanceType<
            typeof LifecycleManager
          >,
      );

      resetPluginManager();
      new PluginManager();

      // Wait for async initialization to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(mockDiscoveryInstance.discoverPlugins).toHaveBeenCalled();
      expect(mockLifecycleInstance.loadPlugin).toHaveBeenCalledWith('plugin1');
      expect(mockLifecycleInstance.loadPlugin).toHaveBeenCalledWith('plugin2');
    });

    it('should handle plugin load errors during initialization', async () => {
      const { DiscoveryManager } = await import('../managers/discovery');
      const { LifecycleManager } = await import('../managers/lifecycle');

      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const mockDiscoveryInstance = {
        loadPluginIndexFromGraphQL: vi.fn().mockResolvedValue(undefined),
        discoverPlugins: vi.fn().mockResolvedValue(['failing-plugin']),
        setGraphQLService: vi.fn(),
        isPluginActivated: vi.fn().mockReturnValue(true),
        isPluginInstalled: vi.fn().mockReturnValue(true),
      };

      const mockLifecycleInstance = {
        loadPlugin: vi.fn().mockRejectedValue(new Error('Plugin load failed')),
        unloadPlugin: vi.fn().mockResolvedValue(true),
        installPlugin: vi.fn().mockResolvedValue(true),
        uninstallPlugin: vi.fn().mockResolvedValue(true),
        activatePlugin: vi.fn().mockResolvedValue(true),
        deactivatePlugin: vi.fn().mockResolvedValue(true),
        togglePluginStatus: vi.fn().mockResolvedValue(true),
        getLoadedPlugins: vi.fn().mockReturnValue([]),
        getLoadedPlugin: vi.fn().mockReturnValue(undefined),
        getPluginComponent: vi.fn().mockReturnValue(undefined),
        getPluginCount: vi.fn().mockReturnValue(0),
        getActivePluginCount: vi.fn().mockReturnValue(0),
      };

      vi.mocked(DiscoveryManager).mockImplementation(
        () =>
          mockDiscoveryInstance as unknown as InstanceType<
            typeof DiscoveryManager
          >,
      );
      vi.mocked(LifecycleManager).mockImplementation(
        () =>
          mockLifecycleInstance as unknown as InstanceType<
            typeof LifecycleManager
          >,
      );

      resetPluginManager();
      new PluginManager();

      // Wait for async initialization to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to load plugin failing-plugin'),
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });

    it('should handle discovery errors during initialization', async () => {
      const { DiscoveryManager } = await import('../managers/discovery');
      const { LifecycleManager } = await import('../managers/lifecycle');

      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const mockDiscoveryInstance = {
        loadPluginIndexFromGraphQL: vi
          .fn()
          .mockRejectedValue(new Error('GraphQL error')),
        discoverPlugins: vi.fn().mockResolvedValue([]),
        setGraphQLService: vi.fn(),
        isPluginActivated: vi.fn().mockReturnValue(true),
        isPluginInstalled: vi.fn().mockReturnValue(true),
      };

      const mockLifecycleInstance = {
        loadPlugin: vi.fn().mockResolvedValue(true),
        unloadPlugin: vi.fn().mockResolvedValue(true),
        installPlugin: vi.fn().mockResolvedValue(true),
        uninstallPlugin: vi.fn().mockResolvedValue(true),
        activatePlugin: vi.fn().mockResolvedValue(true),
        deactivatePlugin: vi.fn().mockResolvedValue(true),
        togglePluginStatus: vi.fn().mockResolvedValue(true),
        getLoadedPlugins: vi.fn().mockReturnValue([]),
        getLoadedPlugin: vi.fn().mockReturnValue(undefined),
        getPluginComponent: vi.fn().mockReturnValue(undefined),
        getPluginCount: vi.fn().mockReturnValue(0),
        getActivePluginCount: vi.fn().mockReturnValue(0),
      };

      vi.mocked(DiscoveryManager).mockImplementation(
        () =>
          mockDiscoveryInstance as unknown as InstanceType<
            typeof DiscoveryManager
          >,
      );
      vi.mocked(LifecycleManager).mockImplementation(
        () =>
          mockLifecycleInstance as unknown as InstanceType<
            typeof LifecycleManager
          >,
      );

      resetPluginManager();
      new PluginManager();

      // Wait for async initialization to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to initialize plugins:',
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });

    it('should mark as initialized when no plugins are discovered', async () => {
      const { DiscoveryManager } = await import('../managers/discovery');
      const { EventManager } = await import('../managers/event-manager');

      const mockEventInstance = {
        emit: vi.fn(),
        on: vi.fn(),
        off: vi.fn(),
      };

      const mockDiscoveryInstance = {
        loadPluginIndexFromGraphQL: vi.fn().mockResolvedValue(undefined),
        discoverPlugins: vi.fn().mockResolvedValue([]),
        setGraphQLService: vi.fn(),
        isPluginActivated: vi.fn().mockReturnValue(true),
        isPluginInstalled: vi.fn().mockReturnValue(true),
      };

      vi.mocked(EventManager).mockImplementation(
        () => mockEventInstance as unknown as InstanceType<typeof EventManager>,
      );
      vi.mocked(DiscoveryManager).mockImplementation(
        () =>
          mockDiscoveryInstance as unknown as InstanceType<
            typeof DiscoveryManager
          >,
      );

      resetPluginManager();
      const manager = new PluginManager();

      // Wait for async initialization to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(mockDiscoveryInstance.discoverPlugins).toHaveBeenCalled();
      expect(mockEventInstance.emit).toHaveBeenCalledWith(
        'plugins:initialized',
      );
      expect(manager.isSystemInitialized()).toBe(true);
    });
  });
});

describe('getPluginManager', () => {
  afterEach(() => {
    resetPluginManager();
  });

  it('should create singleton instance', () => {
    const manager1 = getPluginManager();
    const manager2 = getPluginManager();
    expect(manager1).toBe(manager2);
  });

  it('should set Apollo client on existing instance', () => {
    const manager1 = getPluginManager();
    const manager2 = getPluginManager(mockApolloClient);
    expect(manager1).toBe(manager2);
  });
});

describe('resetPluginManager', () => {
  it('should reset singleton instance', () => {
    const manager1 = getPluginManager();
    resetPluginManager();
    const manager2 = getPluginManager();
    expect(manager1).not.toBe(manager2);
  });
});
