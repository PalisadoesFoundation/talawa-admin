import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import {
  usePluginDrawerItems,
  usePluginRoutes,
  useLoadedPlugins,
  usePluginInjectors,
} from '../hooks';
import { getPluginManager, resetPluginManager } from '../manager';

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
      expect(mockPluginManager.getExtensionPoints).toHaveBeenCalledWith(
        'DA1',
        ['ADMIN'],
        true,
        false,
      );
    });

    it('should return drawer items for admin org', () => {
      const mockItems = [{ label: 'Admin Org Item', path: '/admin-org' }];
      mockPluginManager.getExtensionPoints.mockReturnValue(mockItems);

      const { result } = renderHook(() =>
        usePluginDrawerItems(['ADMIN'], true, true),
      );
      expect(result.current).toEqual(mockItems);
      expect(mockPluginManager.getExtensionPoints).toHaveBeenCalledWith(
        'DA2',
        ['ADMIN'],
        true,
        true,
      );
    });

    it('should return drawer items for user org', () => {
      const mockItems = [{ label: 'User Org Item', path: '/user-org' }];
      mockPluginManager.getExtensionPoints.mockReturnValue(mockItems);

      const { result } = renderHook(() =>
        usePluginDrawerItems(['USER'], false, true),
      );
      expect(result.current).toEqual(mockItems);
      expect(mockPluginManager.getExtensionPoints).toHaveBeenCalledWith(
        'DU1',
        ['USER'],
        false,
        true,
      );
    });

    it('should return drawer items for user global', () => {
      const mockItems = [{ label: 'User Global Item', path: '/user-global' }];
      mockPluginManager.getExtensionPoints.mockReturnValue(mockItems);

      const { result } = renderHook(() =>
        usePluginDrawerItems(['USER'], false, false),
      );
      expect(result.current).toEqual(mockItems);
      expect(mockPluginManager.getExtensionPoints).toHaveBeenCalledWith(
        'DU2',
        ['USER'],
        false,
        false,
      );
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
        usePluginDrawerItems(undefined as any, false, false),
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
      expect(mockPluginManager.getExtensionPoints).toHaveBeenCalledWith(
        'RA1',
        ['ADMIN'],
        true,
        false,
      );
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
      expect(mockPluginManager.getExtensionPoints).toHaveBeenCalledWith(
        'RA2',
        ['ADMIN'],
        true,
        true,
      );
    });

    it('should return routes for user org', () => {
      const mockRoutes = [{ path: '/user-org', component: 'UserOrgComponent' }];
      mockPluginManager.getExtensionPoints.mockReturnValue(mockRoutes);

      const { result } = renderHook(() =>
        usePluginRoutes(['USER'], false, true),
      );
      expect(result.current).toEqual(mockRoutes);
      expect(mockPluginManager.getExtensionPoints).toHaveBeenCalledWith(
        'RU1',
        ['USER'],
        false,
        true,
      );
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
      expect(mockPluginManager.getExtensionPoints).toHaveBeenCalledWith(
        'RU2',
        ['USER'],
        false,
        false,
      );
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
        usePluginRoutes(undefined as any, false, false),
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
    });
  });

  describe('useLoadedPlugins', () => {
    it('should return loaded plugins', () => {
      const mockPlugins = [
        { id: 'plugin1', status: 'active' },
        { id: 'plugin2', status: 'inactive' },
      ];
      mockPluginManager.getLoadedPlugins.mockReturnValue(mockPlugins);

      const { result } = renderHook(() => useLoadedPlugins());
      expect(result.current).toEqual(mockPlugins);
    });

    it('should handle empty plugins list', () => {
      mockPluginManager.getLoadedPlugins.mockReturnValue([]);

      const { result } = renderHook(() => useLoadedPlugins());
      expect(result.current).toEqual([]);
    });

    it('should handle undefined plugins list', () => {
      mockPluginManager.getLoadedPlugins.mockReturnValue(undefined);

      const { result } = renderHook(() => useLoadedPlugins());
      expect(result.current).toBeUndefined();
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
  });

  describe('usePluginInjectors', () => {
    it('should return injectors for G1 type', () => {
      const mockInjectors = [{ type: 'G1', component: 'G1Component' }];
      mockPluginManager.getExtensionPoints.mockReturnValue(mockInjectors);

      const { result } = renderHook(() => usePluginInjectors('G1'));
      expect(result.current).toEqual(mockInjectors);
      expect(mockPluginManager.getExtensionPoints).toHaveBeenCalledWith(
        'G1',
        [],
        false,
        false,
      );
    });

    it('should return injectors for G2 type', () => {
      const mockInjectors = [{ type: 'G2', component: 'G2Component' }];
      mockPluginManager.getExtensionPoints.mockReturnValue(mockInjectors);

      const { result } = renderHook(() => usePluginInjectors('G2'));
      expect(result.current).toEqual(mockInjectors);
      expect(mockPluginManager.getExtensionPoints).toHaveBeenCalledWith(
        'G2',
        [],
        false,
        false,
      );
    });

    it('should return injectors for G3 type', () => {
      const mockInjectors = [{ type: 'G3', component: 'G3Component' }];
      mockPluginManager.getExtensionPoints.mockReturnValue(mockInjectors);

      const { result } = renderHook(() => usePluginInjectors('G3'));
      expect(result.current).toEqual(mockInjectors);
      expect(mockPluginManager.getExtensionPoints).toHaveBeenCalledWith(
        'G3',
        [],
        false,
        false,
      );
    });

    it('should use default G1 type when no type specified', () => {
      const mockInjectors = [{ type: 'G1', component: 'DefaultComponent' }];
      mockPluginManager.getExtensionPoints.mockReturnValue(mockInjectors);

      const { result } = renderHook(() => usePluginInjectors());
      expect(result.current).toEqual(mockInjectors);
      expect(mockPluginManager.getExtensionPoints).toHaveBeenCalledWith(
        'G1',
        [],
        false,
        false,
      );
    });

    it('should handle empty injectors list', () => {
      mockPluginManager.getExtensionPoints.mockReturnValue([]);

      const { result } = renderHook(() => usePluginInjectors('G1'));
      expect(result.current).toEqual([]);
    });

    it('should handle undefined injectors list', () => {
      mockPluginManager.getExtensionPoints.mockReturnValue(undefined);

      const { result } = renderHook(() => usePluginInjectors('G1'));
      expect(result.current).toBeUndefined();
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
    });
  });

  describe('Hook Cleanup', () => {
    it('should cleanup event listeners on unmount', () => {
      // Clear any previous calls
      mockPluginManager.on.mockClear();
      mockPluginManager.off.mockClear();

      const { unmount } = renderHook(() => usePluginDrawerItems());

      // Verify that event listeners were registered
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

      // Clear the on calls to focus on cleanup
      mockPluginManager.on.mockClear();

      // Unmount the hook
      unmount();

      // Verify that event listeners were cleaned up
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
