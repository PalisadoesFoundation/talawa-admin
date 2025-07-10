import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  PluginManager,
  getPluginManager,
  resetPluginManager,
} from '../manager';
import { PluginStatus } from '../types';

// Mock the manager dependencies with controlled behavior
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
};

describe('PluginManager', () => {
  let pluginManager: PluginManager;

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();

    // Reset plugin manager to ensure clean state
    resetPluginManager();

    // Clear any timers that might be running
    vi.clearAllTimers();
  });

  afterEach(() => {
    // Ensure plugin manager is reset after each test
    resetPluginManager();

    // Clean up any remaining timers
    vi.clearAllTimers();
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
    beforeEach(() => {
      pluginManager = new PluginManager();
    });

    it('should set Apollo client successfully', () => {
      expect(() =>
        pluginManager.setApolloClient(mockApolloClient),
      ).not.toThrow();
    });

    it('should throw error when Apollo client is null', () => {
      expect(() => pluginManager.setApolloClient(null as any)).toThrow(
        'Apollo client cannot be null or undefined',
      );
    });

    it('should throw error when Apollo client is undefined', () => {
      expect(() => pluginManager.setApolloClient(undefined as any)).toThrow(
        'Apollo client cannot be null or undefined',
      );
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

  describe('Extension Points', () => {
    beforeEach(() => {
      pluginManager = new PluginManager();
    });

    it('should get extension points for routes', () => {
      const routes = pluginManager.getExtensionPoints('routes', [], false);
      expect(Array.isArray(routes)).toBe(true);
    });

    it('should get extension points for drawer items', () => {
      const drawerItems = pluginManager.getExtensionPoints('drawer', [], false);
      expect(Array.isArray(drawerItems)).toBe(true);
    });

    it('should get extension points with admin permissions', () => {
      const routes = pluginManager.getExtensionPoints('RA1', ['admin'], true);
      expect(Array.isArray(routes)).toBe(true);
    });

    it('should get extension points with user permissions', () => {
      const routes = pluginManager.getExtensionPoints(
        'RU1',
        ['user'],
        false,
        true,
      );
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

    it('should initialize plugin system', async () => {
      await expect(
        pluginManager.initializePluginSystem(),
      ).resolves.not.toThrow();
    });

    it('should check if system is initialized', () => {
      const isInitialized = pluginManager.isSystemInitialized();
      expect(typeof isInitialized).toBe('boolean');
    });

    it('should not reinitialize if already initialized', async () => {
      await pluginManager.initializePluginSystem();
      await expect(
        pluginManager.initializePluginSystem(),
      ).resolves.not.toThrow();
    });
  });
});

describe('getPluginManager', () => {
  beforeEach(() => {
    // Ensure clean state before each test
    resetPluginManager();
  });

  afterEach(() => {
    // Clean up after each test
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

  it('should properly clean up state when reset', () => {
    // Create an instance and verify it exists
    const manager1 = getPluginManager();
    expect(manager1).toBeDefined();

    // Reset and create new instance
    resetPluginManager();
    const manager2 = getPluginManager();

    // Should be different instances
    expect(manager1).not.toBe(manager2);
    expect(manager2).toBeDefined();
  });
});
