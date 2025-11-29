import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import {
  usePluginDrawerItems,
  usePluginRoutes,
  useLoadedPlugins,
  usePluginInjectors,
} from '../hooks';
import { resetPluginManager } from '../manager';

// Create a singleton mockPluginManager
const mockPluginManager = {
  getExtensionPoints: vi.fn().mockReturnValue([]),
  getLoadedPlugins: vi.fn().mockReturnValue([]),
  isSystemInitialized: vi.fn().mockReturnValue(true),
  on: vi.fn(),
  off: vi.fn(),
};

// Mock the manager to always return the singleton
vi.mock('../manager', () => ({
  getPluginManager: vi.fn(() => mockPluginManager),
  resetPluginManager: vi.fn(),
}));

describe('Plugin Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock return values to ensure clean state
    mockPluginManager.getExtensionPoints.mockReturnValue([]);
    mockPluginManager.getLoadedPlugins.mockReturnValue([]);
    mockPluginManager.isSystemInitialized.mockReturnValue(true);
  });

  afterEach(() => {
    resetPluginManager();
    vi.restoreAllMocks();
  });

  describe('usePluginDrawerItems', () => {
    it('should return empty array initially', () => {
      const { result } = renderHook(() => usePluginDrawerItems());
      expect(result.current).toEqual([]);
    });

    it('should return drawer items for admin global', () => {
      const mockItems = [{ label: 'Admin Item', path: '/admin' }];
      mockPluginManager.getExtensionPoints.mockReturnValue(mockItems);

      const { result } = renderHook(() =>
        usePluginDrawerItems(['ADMIN'], true, false),
      );
      expect(result.current).toEqual(mockItems);
      expect(mockPluginManager.getExtensionPoints).toHaveBeenCalled();
      const firstCall = mockPluginManager.getExtensionPoints.mock.calls[0];
      expect(firstCall[0]).toBe('DA1');
    });

    it('should return drawer items for admin org', () => {
      const mockItems = [{ label: 'Admin Org Item', path: '/admin-org' }];
      mockPluginManager.getExtensionPoints.mockReturnValue(mockItems);

      const { result } = renderHook(() =>
        usePluginDrawerItems(['ADMIN'], true, true),
      );
      expect(result.current).toEqual(mockItems);
      expect(mockPluginManager.getExtensionPoints).toHaveBeenCalled();
      const firstCall = mockPluginManager.getExtensionPoints.mock.calls[0];
      expect(firstCall[0]).toBe('DA2');
    });

    it('should return drawer items for user org', () => {
      const mockItems = [{ label: 'User Org Item', path: '/user-org' }];
      mockPluginManager.getExtensionPoints.mockReturnValue(mockItems);

      const { result } = renderHook(() =>
        usePluginDrawerItems(['USER'], false, true),
      );
      expect(result.current).toEqual(mockItems);
      expect(mockPluginManager.getExtensionPoints).toHaveBeenCalled();
      const firstCall = mockPluginManager.getExtensionPoints.mock.calls[0];
      expect(firstCall[0]).toBe('DU1');
    });

    it('should return drawer items for user global', () => {
      const mockItems = [{ label: 'User Global Item', path: '/user-global' }];
      mockPluginManager.getExtensionPoints.mockReturnValue(mockItems);

      const { result } = renderHook(() =>
        usePluginDrawerItems(['USER'], false, false),
      );
      expect(result.current).toEqual(mockItems);
      expect(mockPluginManager.getExtensionPoints).toHaveBeenCalled();
      const firstCall = mockPluginManager.getExtensionPoints.mock.calls[0];
      expect(firstCall[0]).toBe('DU2');
    });

    it('should handle empty permissions', () => {
      const mockItems = [
        { label: 'No Permissions Item', path: '/no-permissions' },
      ];
      mockPluginManager.getExtensionPoints.mockReturnValue(mockItems);

      const { result } = renderHook(() =>
        usePluginDrawerItems([], false, false),
      );
      expect(result.current).toEqual(mockItems);
    });

    it('should handle undefined permissions', () => {
      const mockItems = [
        { label: 'Undefined Permissions Item', path: '/undefined-permissions' },
      ];
      mockPluginManager.getExtensionPoints.mockReturnValue(mockItems);

      const { result } = renderHook(() =>
        usePluginDrawerItems(undefined as unknown as string[], false, false),
      );
      expect(result.current).toEqual(mockItems);
    });

    it('should register event listeners', () => {
      renderHook(() => usePluginDrawerItems());
      expect(mockPluginManager.on).toHaveBeenCalledWith(
        'plugin:loaded',
        expect.any(Function),
      );
      expect(mockPluginManager.on).toHaveBeenCalledWith(
        'plugin:unloaded',
        expect.any(Function),
      );
      expect(mockPluginManager.on).toHaveBeenCalledWith(
        'plugin:status-changed',
        expect.any(Function),
      );
      expect(mockPluginManager.on).toHaveBeenCalledWith(
        'plugins:initialized',
        expect.any(Function),
      );
    });

    it('should not update if system is not initialized', () => {
      vi.mocked(mockPluginManager.isSystemInitialized).mockReturnValue(false);
      const { result } = renderHook(() => usePluginDrawerItems());
      expect(result.current).toEqual([]);
    });

    it('should handle plugin loaded event', async () => {
      const { result } = renderHook(() => usePluginDrawerItems());

      // Simulate plugin loaded event
      const loadedCallback = mockPluginManager.on.mock.calls.find(
        (call) => call[0] === 'plugin:loaded',
      )?.[1];

      if (loadedCallback) {
        loadedCallback();
        await waitFor(() => {
          expect(result.current).toEqual([]);
        });
      }
    });

    it('should handle plugin unloaded event', async () => {
      const { result } = renderHook(() => usePluginDrawerItems());

      // Simulate plugin unloaded event
      const unloadedCallback = mockPluginManager.on.mock.calls.find(
        (call) => call[0] === 'plugin:unloaded',
      )?.[1];

      if (unloadedCallback) {
        unloadedCallback();
        await waitFor(() => {
          expect(result.current).toEqual([]);
        });
      }
    });

    it('should handle plugin status changed event', async () => {
      const { result } = renderHook(() => usePluginDrawerItems());

      // Simulate plugin status changed event
      const statusChangedCallback = mockPluginManager.on.mock.calls.find(
        (call) => call[0] === 'plugin:status-changed',
      )?.[1];

      if (statusChangedCallback) {
        statusChangedCallback();
        await waitFor(() => {
          expect(result.current).toEqual([]);
        });
      }
    });

    it('should handle plugins initialized event', async () => {
      const { result } = renderHook(() => usePluginDrawerItems());

      // Simulate plugins initialized event
      const initializedCallback = mockPluginManager.on.mock.calls.find(
        (call) => call[0] === 'plugins:initialized',
      )?.[1];

      if (initializedCallback) {
        initializedCallback();
        await waitFor(() => {
          expect(result.current).toEqual([]);
        });
      }
    });

    it('should cleanup event listeners on unmount', () => {
      const { unmount } = renderHook(() => usePluginDrawerItems());

      unmount();

      expect(mockPluginManager.off).toHaveBeenCalledWith(
        'plugin:loaded',
        expect.any(Function),
      );
      expect(mockPluginManager.off).toHaveBeenCalledWith(
        'plugin:unloaded',
        expect.any(Function),
      );
      expect(mockPluginManager.off).toHaveBeenCalledWith(
        'plugin:status-changed',
        expect.any(Function),
      );
      expect(mockPluginManager.off).toHaveBeenCalledWith(
        'plugins:initialized',
        expect.any(Function),
      );
    });
  });

  describe('usePluginRoutes', () => {
    it('should return empty array initially', () => {
      const { result } = renderHook(() => usePluginRoutes());
      expect(result.current).toEqual([]);
    });

    it('should return routes for admin global', () => {
      const mockRoutes = [{ path: '/admin', component: 'AdminComponent' }];
      mockPluginManager.getExtensionPoints.mockReturnValue(mockRoutes);

      const { result } = renderHook(() =>
        usePluginRoutes(['ADMIN'], true, false),
      );
      expect(result.current).toEqual(mockRoutes);
      expect(mockPluginManager.getExtensionPoints).toHaveBeenCalled();
      const firstCall = mockPluginManager.getExtensionPoints.mock.calls[0];
      expect(firstCall[0]).toBe('RA1');
    });

    it('should return routes for admin org', () => {
      const mockRoutes = [
        { path: '/admin-org', component: 'AdminOrgComponent' },
      ];
      mockPluginManager.getExtensionPoints.mockReturnValue(mockRoutes);

      const { result } = renderHook(() =>
        usePluginRoutes(['ADMIN'], true, true),
      );
      expect(result.current).toEqual(mockRoutes);
      expect(mockPluginManager.getExtensionPoints).toHaveBeenCalled();
      const firstCall = mockPluginManager.getExtensionPoints.mock.calls[0];
      expect(firstCall[0]).toBe('RA2');
    });

    it('should return routes for user org', () => {
      const mockRoutes = [{ path: '/user-org', component: 'UserOrgComponent' }];
      mockPluginManager.getExtensionPoints.mockReturnValue(mockRoutes);

      const { result } = renderHook(() =>
        usePluginRoutes(['USER'], false, true),
      );
      expect(result.current).toEqual(mockRoutes);
      expect(mockPluginManager.getExtensionPoints).toHaveBeenCalled();
      const firstCall = mockPluginManager.getExtensionPoints.mock.calls[0];
      expect(firstCall[0]).toBe('RU1');
    });

    it('should return routes for user global', () => {
      const mockRoutes = [
        { path: '/user-global', component: 'UserGlobalComponent' },
      ];
      mockPluginManager.getExtensionPoints.mockReturnValue(mockRoutes);

      const { result } = renderHook(() =>
        usePluginRoutes(['USER'], false, false),
      );
      expect(result.current).toEqual(mockRoutes);
      expect(mockPluginManager.getExtensionPoints).toHaveBeenCalled();
      const firstCall = mockPluginManager.getExtensionPoints.mock.calls[0];
      expect(firstCall[0]).toBe('RU2');
    });

    it('should handle empty permissions', () => {
      const mockRoutes = [
        { path: '/no-permissions', component: 'NoPermissionsComponent' },
      ];
      mockPluginManager.getExtensionPoints.mockReturnValue(mockRoutes);

      const { result } = renderHook(() => usePluginRoutes([], false, false));
      expect(result.current).toEqual(mockRoutes);
    });

    it('should handle undefined permissions', () => {
      const mockRoutes = [
        {
          path: '/undefined-permissions',
          component: 'UndefinedPermissionsComponent',
        },
      ];
      mockPluginManager.getExtensionPoints.mockReturnValue(mockRoutes);

      const { result } = renderHook(() =>
        usePluginRoutes(undefined as unknown as string[], false, false),
      );
      expect(result.current).toEqual(mockRoutes);
    });

    it('should register event listeners', () => {
      renderHook(() => usePluginRoutes());
      expect(mockPluginManager.on).toHaveBeenCalledWith(
        'plugin:loaded',
        expect.any(Function),
      );
      expect(mockPluginManager.on).toHaveBeenCalledWith(
        'plugin:unloaded',
        expect.any(Function),
      );
      expect(mockPluginManager.on).toHaveBeenCalledWith(
        'plugin:status-changed',
        expect.any(Function),
      );
      expect(mockPluginManager.on).toHaveBeenCalledWith(
        'plugins:initialized',
        expect.any(Function),
      );
    });

    it('should not update if system is not initialized', () => {
      vi.mocked(mockPluginManager.isSystemInitialized).mockReturnValue(false);
      const { result } = renderHook(() => usePluginRoutes());
      expect(result.current).toEqual([]);
    });

    it('should handle plugin loaded event', async () => {
      const { result } = renderHook(() => usePluginRoutes());

      // Simulate plugin loaded event
      const loadedCallback = mockPluginManager.on.mock.calls.find(
        (call) => call[0] === 'plugin:loaded',
      )?.[1];

      if (loadedCallback) {
        loadedCallback();
        await waitFor(() => {
          expect(result.current).toEqual([]);
        });
      }
    });

    it('should handle plugin unloaded event', async () => {
      const { result } = renderHook(() => usePluginRoutes());

      // Simulate plugin unloaded event
      const unloadedCallback = mockPluginManager.on.mock.calls.find(
        (call) => call[0] === 'plugin:unloaded',
      )?.[1];

      if (unloadedCallback) {
        unloadedCallback();
        await waitFor(() => {
          expect(result.current).toEqual([]);
        });
      }
    });

    it('should handle plugin status changed event', async () => {
      const { result } = renderHook(() => usePluginRoutes());

      // Simulate plugin status changed event
      const statusChangedCallback = mockPluginManager.on.mock.calls.find(
        (call) => call[0] === 'plugin:status-changed',
      )?.[1];

      if (statusChangedCallback) {
        statusChangedCallback();
        await waitFor(() => {
          expect(result.current).toEqual([]);
        });
      }
    });

    it('should handle plugins initialized event', async () => {
      const { result } = renderHook(() => usePluginRoutes());

      // Simulate plugins initialized event
      const initializedCallback = mockPluginManager.on.mock.calls.find(
        (call) => call[0] === 'plugins:initialized',
      )?.[1];

      if (initializedCallback) {
        initializedCallback();
        await waitFor(() => {
          expect(result.current).toEqual([]);
        });
      }
    });

    it('should cleanup event listeners on unmount', () => {
      const { unmount } = renderHook(() => usePluginRoutes());

      unmount();

      expect(mockPluginManager.off).toHaveBeenCalledWith(
        'plugin:loaded',
        expect.any(Function),
      );
      expect(mockPluginManager.off).toHaveBeenCalledWith(
        'plugin:unloaded',
        expect.any(Function),
      );
      expect(mockPluginManager.off).toHaveBeenCalledWith(
        'plugin:status-changed',
        expect.any(Function),
      );
      expect(mockPluginManager.off).toHaveBeenCalledWith(
        'plugins:initialized',
        expect.any(Function),
      );
    });
  });

  describe('useLoadedPlugins', () => {
    it('should return empty array initially', () => {
      const { result } = renderHook(() => useLoadedPlugins());
      expect(result.current).toEqual([]);
    });

    it('should return loaded plugins', () => {
      const mockPlugins = [
        { id: 'plugin1', name: 'Plugin 1' },
        { id: 'plugin2', name: 'Plugin 2' },
      ];
      mockPluginManager.getLoadedPlugins.mockReturnValue(mockPlugins);

      const { result } = renderHook(() => useLoadedPlugins());
      expect(result.current).toEqual(mockPlugins);
    });

    it('should register event listeners', () => {
      renderHook(() => useLoadedPlugins());
      expect(mockPluginManager.on).toHaveBeenCalledWith(
        'plugin:loaded',
        expect.any(Function),
      );
      expect(mockPluginManager.on).toHaveBeenCalledWith(
        'plugin:unloaded',
        expect.any(Function),
      );
      expect(mockPluginManager.on).toHaveBeenCalledWith(
        'plugin:status-changed',
        expect.any(Function),
      );
    });

    it('should not update if system is not initialized', () => {
      vi.mocked(mockPluginManager.isSystemInitialized).mockReturnValue(false);
      const { result } = renderHook(() => useLoadedPlugins());
      expect(result.current).toEqual([]);
    });

    it('should handle plugin loaded event', async () => {
      const { result } = renderHook(() => useLoadedPlugins());

      // Simulate plugin loaded event
      const loadedCallback = mockPluginManager.on.mock.calls.find(
        (call) => call[0] === 'plugin:loaded',
      )?.[1];

      if (loadedCallback) {
        loadedCallback();
        await waitFor(() => {
          expect(result.current).toEqual([]);
        });
      }
    });

    it('should handle plugin unloaded event', async () => {
      const { result } = renderHook(() => useLoadedPlugins());

      // Simulate plugin unloaded event
      const unloadedCallback = mockPluginManager.on.mock.calls.find(
        (call) => call[0] === 'plugin:unloaded',
      )?.[1];

      if (unloadedCallback) {
        unloadedCallback();
        await waitFor(() => {
          expect(result.current).toEqual([]);
        });
      }
    });

    it('should handle plugins initialized event', async () => {
      const { result } = renderHook(() => useLoadedPlugins());

      // Simulate plugins initialized event
      const initializedCallback = mockPluginManager.on.mock.calls.find(
        (call) => call[0] === 'plugin:status-changed',
      )?.[1];

      if (initializedCallback) {
        initializedCallback();
        await waitFor(() => {
          expect(result.current).toEqual([]);
        });
      }
    });

    it('should cleanup event listeners on unmount', () => {
      const { unmount } = renderHook(() => useLoadedPlugins());

      unmount();

      expect(mockPluginManager.off).toHaveBeenCalledWith(
        'plugin:loaded',
        expect.any(Function),
      );
      expect(mockPluginManager.off).toHaveBeenCalledWith(
        'plugin:unloaded',
        expect.any(Function),
      );
      expect(mockPluginManager.off).toHaveBeenCalledWith(
        'plugin:status-changed',
        expect.any(Function),
      );
    });
  });

  describe('usePluginInjectors', () => {
    it('should return empty array initially', () => {
      const { result } = renderHook(() => usePluginInjectors());
      expect(result.current).toEqual([]);
    });

    it('should return injectors for G1 type', () => {
      const mockInjectors = [{ id: 'g1-injector', component: 'G1Injector' }];
      mockPluginManager.getExtensionPoints.mockReturnValue(mockInjectors);

      const { result } = renderHook(() => usePluginInjectors('G1'));
      expect(result.current).toEqual(mockInjectors);
      expect(mockPluginManager.getExtensionPoints).toHaveBeenCalled();
      const firstCall = mockPluginManager.getExtensionPoints.mock.calls[0];
      expect(firstCall[0]).toBe('G1');
    });

    it('should return injectors for G2 type', () => {
      const mockInjectors = [{ id: 'g2-injector', component: 'G2Injector' }];
      mockPluginManager.getExtensionPoints.mockReturnValue(mockInjectors);

      const { result } = renderHook(() => usePluginInjectors('G2'));
      expect(result.current).toEqual(mockInjectors);
      expect(mockPluginManager.getExtensionPoints).toHaveBeenCalled();
      const firstCall = mockPluginManager.getExtensionPoints.mock.calls[0];
      expect(firstCall[0]).toBe('G2');
    });

    it('should return injectors for G3 type', () => {
      const mockInjectors = [{ id: 'g3-injector', component: 'G3Injector' }];
      mockPluginManager.getExtensionPoints.mockReturnValue(mockInjectors);

      const { result } = renderHook(() => usePluginInjectors('G3'));
      expect(result.current).toEqual(mockInjectors);
      expect(mockPluginManager.getExtensionPoints).toHaveBeenCalled();
      const firstCall = mockPluginManager.getExtensionPoints.mock.calls[0];
      expect(firstCall[0]).toBe('G3');
    });

    it('should handle empty permissions', () => {
      const mockInjectors = [
        { id: 'no-permissions-injector', component: 'NoPermissionsInjector' },
      ];
      mockPluginManager.getExtensionPoints.mockReturnValue(mockInjectors);

      const { result } = renderHook(() => usePluginInjectors());
      expect(result.current).toEqual(mockInjectors);
    });

    it('should handle undefined permissions', () => {
      const mockInjectors = [
        {
          id: 'undefined-permissions-injector',
          component: 'UndefinedPermissionsInjector',
        },
      ];
      mockPluginManager.getExtensionPoints.mockReturnValue(mockInjectors);

      const { result } = renderHook(() => usePluginInjectors());
      expect(result.current).toEqual(mockInjectors);
    });

    it('should register event listeners', () => {
      renderHook(() => usePluginInjectors());
      expect(mockPluginManager.on).toHaveBeenCalledWith(
        'plugin:loaded',
        expect.any(Function),
      );
      expect(mockPluginManager.on).toHaveBeenCalledWith(
        'plugin:unloaded',
        expect.any(Function),
      );
      expect(mockPluginManager.on).toHaveBeenCalledWith(
        'plugin:status-changed',
        expect.any(Function),
      );
      expect(mockPluginManager.on).toHaveBeenCalledWith(
        'plugins:initialized',
        expect.any(Function),
      );
    });

    it('should not update if system is not initialized', () => {
      vi.mocked(mockPluginManager.isSystemInitialized).mockReturnValue(false);
      const { result } = renderHook(() => usePluginInjectors());
      expect(result.current).toEqual([]);
    });

    it('should handle plugin loaded event', async () => {
      const { result } = renderHook(() => usePluginInjectors());

      // Simulate plugin loaded event
      const loadedCallback = mockPluginManager.on.mock.calls.find(
        (call) => call[0] === 'plugin:loaded',
      )?.[1];

      if (loadedCallback) {
        loadedCallback();
        await waitFor(() => {
          expect(result.current).toEqual([]);
        });
      }
    });

    it('should handle plugin unloaded event', async () => {
      const { result } = renderHook(() => usePluginInjectors());

      // Simulate plugin unloaded event
      const unloadedCallback = mockPluginManager.on.mock.calls.find(
        (call) => call[0] === 'plugin:unloaded',
      )?.[1];

      if (unloadedCallback) {
        unloadedCallback();
        await waitFor(() => {
          expect(result.current).toEqual([]);
        });
      }
    });

    it('should handle plugin status changed event', async () => {
      const { result } = renderHook(() => usePluginInjectors());

      // Simulate plugin status changed event
      const statusChangedCallback = mockPluginManager.on.mock.calls.find(
        (call) => call[0] === 'plugin:status-changed',
      )?.[1];

      if (statusChangedCallback) {
        statusChangedCallback();
        await waitFor(() => {
          expect(result.current).toEqual([]);
        });
      }
    });

    it('should handle plugins initialized event', async () => {
      const { result } = renderHook(() => usePluginInjectors());

      // Simulate plugins initialized event
      const initializedCallback = mockPluginManager.on.mock.calls.find(
        (call) => call[0] === 'plugins:initialized',
      )?.[1];

      if (initializedCallback) {
        initializedCallback();
        await waitFor(() => {
          expect(result.current).toEqual([]);
        });
      }
    });

    it('should cleanup event listeners on unmount', () => {
      const { unmount } = renderHook(() => usePluginInjectors());

      unmount();

      expect(mockPluginManager.off).toHaveBeenCalledWith(
        'plugin:loaded',
        expect.any(Function),
      );
      expect(mockPluginManager.off).toHaveBeenCalledWith(
        'plugin:unloaded',
        expect.any(Function),
      );
      expect(mockPluginManager.off).toHaveBeenCalledWith(
        'plugin:status-changed',
        expect.any(Function),
      );
      expect(mockPluginManager.off).toHaveBeenCalledWith(
        'plugins:initialized',
        expect.any(Function),
      );
    });
  });
});
