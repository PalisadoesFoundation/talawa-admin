import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, Mocked } from 'vitest';

import { usePluginActions } from './usePluginActions';
import { getPluginManager } from 'plugin/manager';
import type { IPluginMeta } from 'plugin';
import { adminPluginFileService } from 'plugin/services/AdminPluginFileService';

// Mock the plugin manager
vi.mock('plugin/manager', () => ({
  getPluginManager: vi.fn(),
}));

// Mock the GraphQL hooks
const mockCreatePlugin = vi.fn();
const mockUpdatePlugin = vi.fn();
const mockDeletePlugin = vi.fn();
const mockInstallPlugin = vi.fn();

vi.mock('plugin/graphql-service', () => ({
  useCreatePlugin: () => [mockCreatePlugin],
  useUpdatePlugin: () => [mockUpdatePlugin],
  useDeletePlugin: () => [mockDeletePlugin],
  useInstallPlugin: () => [mockInstallPlugin],
}));

// Mock AdminPluginFileService once, then tweak behaviour per test
vi.mock('plugin/services/AdminPluginFileService', () => ({
  adminPluginFileService: {
    removePlugin: vi.fn(),
  },
}));

type AdminServiceMock = Mocked<typeof adminPluginFileService>;
const adminServiceMock = adminPluginFileService as AdminServiceMock;

// Mock window.location.reload
const mockReload = vi.fn();
const originalLocation = window.location;
const locationStub = { reload: mockReload } as unknown as Location;

beforeAll(() => {
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: locationStub,
    writable: true,
  });
});

afterAll(() => {
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: originalLocation,
  });
});

describe('usePluginActions', () => {
  const mockPlugin: IPluginMeta = {
    id: 'test-plugin',
    name: 'Test Plugin',
    description: 'A test plugin',
    author: 'Test Author',
    icon: '/test-icon.png',
  };

  const mockPluginData = {
    getPlugins: [
      {
        id: 'db-plugin-id',
        pluginId: 'test-plugin',
        isInstalled: true,
        isActivated: true,
      },
    ],
  };

  const mockRefetch = vi.fn();
  const mockPluginManager = {
    installPlugin: vi.fn(),
    togglePluginStatus: vi.fn(),
    uninstallPlugin: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (
      getPluginManager as unknown as {
        mockReturnValue(value: unknown): void;
      }
    ).mockReturnValue(mockPluginManager);

    mockRefetch.mockResolvedValue({});
    mockCreatePlugin.mockResolvedValue({});
    mockUpdatePlugin.mockResolvedValue({});
    mockDeletePlugin.mockResolvedValue({});
    mockInstallPlugin.mockResolvedValue({});

    adminServiceMock.removePlugin.mockReset();
    adminServiceMock.removePlugin.mockResolvedValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() =>
      usePluginActions({
        pluginData: mockPluginData,
        refetch: mockRefetch,
      }),
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.showUninstallModal).toBe(false);
    expect(result.current.pluginToUninstall).toBe(null);
    expect(typeof result.current.handleInstallPlugin).toBe('function');
    expect(typeof result.current.togglePluginStatus).toBe('function');
    expect(typeof result.current.uninstallPlugin).toBe('function');
    expect(typeof result.current.handleUninstallConfirm).toBe('function');
    expect(typeof result.current.closeUninstallModal).toBe('function');
  });

  it('should successfully install a plugin', async () => {
    mockInstallPlugin.mockResolvedValue({});
    mockPluginManager.installPlugin.mockResolvedValue(true);

    const { result } = renderHook(() =>
      usePluginActions({
        pluginData: mockPluginData,
        refetch: mockRefetch,
      }),
    );

    await act(async () => {
      await result.current.handleInstallPlugin(mockPlugin);
    });

    expect(mockInstallPlugin).toHaveBeenCalledWith({
      variables: {
        input: {
          pluginId: 'test-plugin',
        },
      },
    });
    expect(mockPluginManager.installPlugin).toHaveBeenCalledWith('test-plugin');
    expect(mockRefetch).toHaveBeenCalled();
    expect(mockReload).toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it('should successfully activate a plugin', async () => {
    mockUpdatePlugin.mockResolvedValue({});
    mockPluginManager.togglePluginStatus.mockResolvedValue(true);

    const { result } = renderHook(() =>
      usePluginActions({
        pluginData: mockPluginData,
        refetch: mockRefetch,
      }),
    );

    await act(async () => {
      await result.current.togglePluginStatus(mockPlugin, 'active');
    });

    expect(mockUpdatePlugin).toHaveBeenCalledWith({
      variables: {
        input: {
          id: 'db-plugin-id',
          isActivated: true,
        },
      },
    });
    expect(mockPluginManager.togglePluginStatus).toHaveBeenCalledWith(
      'test-plugin',
      'active',
    );
    expect(mockRefetch).toHaveBeenCalled();
    expect(mockReload).toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it('should set plugin to uninstall and show modal', () => {
    const { result } = renderHook(() =>
      usePluginActions({
        pluginData: mockPluginData,
        refetch: mockRefetch,
      }),
    );

    act(() => {
      result.current.uninstallPlugin(mockPlugin);
    });

    expect(result.current.showUninstallModal).toBe(true);
    expect(result.current.pluginToUninstall).toEqual(mockPlugin);
  });

  it('should close modal and clear plugin to uninstall', () => {
    const { result } = renderHook(() =>
      usePluginActions({
        pluginData: mockPluginData,
        refetch: mockRefetch,
      }),
    );

    // Set plugin to uninstall first
    act(() => {
      result.current.uninstallPlugin(mockPlugin);
    });

    expect(result.current.showUninstallModal).toBe(true);
    expect(result.current.pluginToUninstall).toEqual(mockPlugin);

    // Close modal
    act(() => {
      result.current.closeUninstallModal();
    });

    expect(result.current.showUninstallModal).toBe(false);
    expect(result.current.pluginToUninstall).toBe(null);
  });

  it('should handle uninstall when no plugin is set', async () => {
    const { result } = renderHook(() =>
      usePluginActions({
        pluginData: mockPluginData,
        refetch: mockRefetch,
      }),
    );

    await act(async () => {
      await result.current.handleUninstallConfirm();
    });

    expect(mockRefetch).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it('should handle installation failure in GraphQL', async () => {
    mockInstallPlugin.mockRejectedValue(new Error('GraphQL error'));

    const { result } = renderHook(() =>
      usePluginActions({
        pluginData: mockPluginData,
        refetch: mockRefetch,
      }),
    );

    await act(async () => {
      await result.current.handleInstallPlugin(mockPlugin);
    });

    expect(result.current.loading).toBe(false);
  });

  it('should handle installation failure in plugin manager', async () => {
    mockInstallPlugin.mockResolvedValue({});
    mockPluginManager.installPlugin.mockResolvedValue(false);

    const { result } = renderHook(() =>
      usePluginActions({
        pluginData: mockPluginData,
        refetch: mockRefetch,
      }),
    );

    await act(async () => {
      await result.current.handleInstallPlugin(mockPlugin);
    });

    expect(result.current.loading).toBe(false);
  });

  it('should handle toggle failure in plugin manager', async () => {
    mockUpdatePlugin.mockResolvedValue({});
    mockPluginManager.togglePluginStatus.mockResolvedValue(false);

    const { result } = renderHook(() =>
      usePluginActions({
        pluginData: mockPluginData,
        refetch: mockRefetch,
      }),
    );

    await act(async () => {
      await result.current.togglePluginStatus(mockPlugin, 'active');
    });

    expect(result.current.loading).toBe(false);
  });

  it('should handle GraphQL update error in toggle', async () => {
    mockUpdatePlugin.mockRejectedValue(new Error('GraphQL error'));

    const { result } = renderHook(() =>
      usePluginActions({
        pluginData: mockPluginData,
        refetch: mockRefetch,
      }),
    );

    await act(async () => {
      await result.current.togglePluginStatus(mockPlugin, 'active');
    });

    expect(result.current.loading).toBe(false);
  });

  it('should handle plugin not found in GraphQL data during toggle', async () => {
    mockUpdatePlugin.mockResolvedValue({});
    mockPluginManager.togglePluginStatus.mockResolvedValue(true);

    const { result } = renderHook(() =>
      usePluginActions({
        pluginData: { getPlugins: [] }, // No plugins
        refetch: mockRefetch,
      }),
    );

    await act(async () => {
      await result.current.togglePluginStatus(mockPlugin, 'active');
    });

    expect(mockUpdatePlugin).not.toHaveBeenCalled();
    expect(mockPluginManager.togglePluginStatus).toHaveBeenCalledWith(
      'test-plugin',
      'active',
    );
  });

  it('should handle plugin not found in GraphQL data during uninstall', async () => {
    mockDeletePlugin.mockResolvedValue({});
    mockPluginManager.uninstallPlugin.mockResolvedValue(true);

    const { result } = renderHook(() =>
      usePluginActions({
        pluginData: { getPlugins: [] }, // No plugins
        refetch: mockRefetch,
      }),
    );

    // Set plugin to uninstall
    act(() => {
      result.current.uninstallPlugin(mockPlugin);
    });

    await act(async () => {
      await result.current.handleUninstallConfirm();
    });

    expect(mockDeletePlugin).not.toHaveBeenCalled();
    expect(mockPluginManager.uninstallPlugin).toHaveBeenCalledWith(
      'test-plugin',
    );
  });

  it('should handle plugin manager uninstall failure', async () => {
    mockDeletePlugin.mockResolvedValue({});
    mockPluginManager.uninstallPlugin.mockResolvedValue(false);

    const { result } = renderHook(() =>
      usePluginActions({
        pluginData: mockPluginData,
        refetch: mockRefetch,
      }),
    );

    // Set plugin to uninstall
    act(() => {
      result.current.uninstallPlugin(mockPlugin);
    });

    await act(async () => {
      await result.current.handleUninstallConfirm();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.showUninstallModal).toBe(false);
    expect(result.current.pluginToUninstall).toBe(null);
  });

  it('should handle GraphQL delete error', async () => {
    mockDeletePlugin.mockRejectedValue(new Error('GraphQL error'));

    const { result } = renderHook(() =>
      usePluginActions({
        pluginData: mockPluginData,
        refetch: mockRefetch,
      }),
    );

    // Set plugin to uninstall
    act(() => {
      result.current.uninstallPlugin(mockPlugin);
    });

    await act(async () => {
      await result.current.handleUninstallConfirm();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.showUninstallModal).toBe(false);
    expect(result.current.pluginToUninstall).toBe(null);
  });

  it('should handle AdminPluginFileService.removePlugin failure (catch branch)', async () => {
    mockDeletePlugin.mockResolvedValue({});
    adminServiceMock.removePlugin.mockRejectedValue(new Error('fs error'));
    mockPluginManager.uninstallPlugin.mockResolvedValue(true);

    const { result } = renderHook(() =>
      usePluginActions({
        pluginData: mockPluginData,
        refetch: mockRefetch,
      }),
    );

    act(() => {
      result.current.uninstallPlugin(mockPlugin);
    });

    await act(async () => {
      await result.current.handleUninstallConfirm();
    });

    // still proceeds to uninstall even if removePlugin throws
    expect(mockPluginManager.uninstallPlugin).toHaveBeenCalledWith(
      'test-plugin',
    );
  });

  it('should fully uninstall plugin including removing plugin directory (try branch)', async () => {
    mockDeletePlugin.mockResolvedValue({});
    adminServiceMock.removePlugin.mockResolvedValue(true);
    mockPluginManager.uninstallPlugin.mockResolvedValue(true);

    const { result } = renderHook(() =>
      usePluginActions({
        pluginData: mockPluginData,
        refetch: mockRefetch,
      }),
    );

    act(() => {
      result.current.uninstallPlugin(mockPlugin);
    });

    await act(async () => {
      await result.current.handleUninstallConfirm();
    });

    expect(mockDeletePlugin).toHaveBeenCalledWith({
      variables: {
        input: { id: 'db-plugin-id' },
      },
    });
    expect(adminServiceMock.removePlugin).toHaveBeenCalledWith('test-plugin');
    expect(mockPluginManager.uninstallPlugin).toHaveBeenCalledWith(
      'test-plugin',
    );
    expect(mockRefetch).toHaveBeenCalled();
    expect(mockReload).toHaveBeenCalled();
  });

  it('should handle deactivate plugin status', async () => {
    mockUpdatePlugin.mockResolvedValue({});
    mockPluginManager.togglePluginStatus.mockResolvedValue(true);

    const { result } = renderHook(() =>
      usePluginActions({
        pluginData: mockPluginData,
        refetch: mockRefetch,
      }),
    );

    await act(async () => {
      await result.current.togglePluginStatus(mockPlugin, 'inactive');
    });

    expect(mockUpdatePlugin).toHaveBeenCalledWith({
      variables: {
        input: {
          id: 'db-plugin-id',
          isActivated: false,
        },
      },
    });
    expect(mockPluginManager.togglePluginStatus).toHaveBeenCalledWith(
      'test-plugin',
      'inactive',
    );
  });

  it('should set loading state correctly during installation', async () => {
    mockInstallPlugin.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );
    mockPluginManager.installPlugin.mockResolvedValue(true);

    const { result } = renderHook(() =>
      usePluginActions({
        pluginData: mockPluginData,
        refetch: mockRefetch,
      }),
    );

    // Start installation
    act(() => {
      result.current.handleInstallPlugin(mockPlugin);
    });

    // Should be loading
    expect(result.current.loading).toBe(true);

    // Wait for completion
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 150));
    });

    expect(result.current.loading).toBe(false);
  });
});
