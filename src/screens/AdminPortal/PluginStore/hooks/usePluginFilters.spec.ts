import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { usePluginFilters } from './usePluginFilters';
import type { IPlugin } from 'plugin/graphql-service';

// Mock the useTranslation hook
const mockT = vi.fn((key: string) => key);
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT,
  }),
}));

// Mock the useLoadedPlugins hook
const mockLoadedPlugins = [
  {
    id: 'loaded-plugin-1',
    manifest: {
      name: 'Loaded Plugin 1',
      description: 'A loaded plugin for testing',
      author: 'Test Author',
      icon: '/test-icon-1.png',
      version: '1.0.0',
      homepage: 'https://example.com',
      license: 'MIT',
      tags: ['test', 'plugin'],
    },
    status: 'active',
  },
  {
    id: 'loaded-plugin-2',
    manifest: {
      name: 'Loaded Plugin 2',
      description: 'Another loaded plugin',
      author: 'Another Author',
      icon: '/test-icon-2.png',
      version: '2.0.0',
      homepage: 'https://example2.com',
      license: 'GPL',
      tags: ['another', 'test'],
    },
    status: 'inactive',
  },
];

vi.mock('plugin/hooks', () => ({
  useLoadedPlugins: () => mockLoadedPlugins,
}));

// Mock the useDebounce hook
vi.mock('shared-components/useDebounce/useDebounce', () => ({
  default: vi.fn((callback) => ({
    debouncedCallback: (value: string) => {
      callback(value);
    },
    cancel: vi.fn(),
  })),
}));

describe('usePluginFilters', () => {
  const mockPlugins: IPlugin[] = [
    {
      pluginId: 'graphql-plugin-1',
      isInstalled: true,
      isActivated: true,
      id: 'db-plugin-1',
      backup: false,
      createdAt: dayjs.utc().toISOString(),
      updatedAt: dayjs.utc().toISOString(),
    },
    {
      pluginId: 'graphql-plugin-2',
      isInstalled: true,
      isActivated: false,
      id: 'db-plugin-2',
      backup: false,
      createdAt: dayjs.utc().toISOString(),
      updatedAt: dayjs.utc().toISOString(),
    },
    {
      pluginId: 'graphql-plugin-3',
      isInstalled: false,
      isActivated: false,
      id: 'db-plugin-3',
      backup: false,
      createdAt: dayjs.utc().toISOString(),
      updatedAt: dayjs.utc().toISOString(),
    },
  ];

  const stablePluginData = { getPlugins: mockPlugins };

  beforeEach(() => {
    vi.clearAllMocks();
    mockT.mockImplementation((key: string) => key);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() =>
        usePluginFilters({ pluginData: stablePluginData }),
      );

      expect(result.current.searchTerm).toBe('');
      expect(result.current.filteredPlugins).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'loaded-plugin-1',
            name: 'Loaded Plugin 1',
            description: 'A loaded plugin for testing',
            author: 'Test Author',
            icon: '/test-icon-1.png',
          }),
          expect.objectContaining({
            id: 'loaded-plugin-2',
            name: 'Loaded Plugin 2',
            description: 'Another loaded plugin',
            author: 'Another Author',
            icon: '/test-icon-2.png',
          }),
          expect.objectContaining({
            id: 'graphql-plugin-1',
            name: 'graphql-plugin-1',
            description: 'Plugin graphql-plugin-1',
            author: 'Unknown',
            icon: '/images/logo512.png',
          }),
          expect.objectContaining({
            id: 'graphql-plugin-2',
            name: 'graphql-plugin-2',
            description: 'Plugin graphql-plugin-2',
            author: 'Unknown',
            icon: '/images/logo512.png',
          }),
          expect.objectContaining({
            id: 'graphql-plugin-3',
            name: 'graphql-plugin-3',
            description: 'Plugin graphql-plugin-3',
            author: 'Unknown',
            icon: '/images/logo512.png',
          }),
        ]),
      );
      expect(result.current.filterState).toEqual({
        option: 'all',
        selectedOption: 'allPlugins',
      });
      expect(typeof result.current.debouncedSearch).toBe('function');
      expect(typeof result.current.handleFilterChange).toBe('function');
      expect(typeof result.current.isInstalled).toBe('function');
      expect(typeof result.current.getInstalledPlugin).toBe('function');
    });

    it('should handle empty plugin data', () => {
      const { result } = renderHook(() =>
        usePluginFilters({
          pluginData: null as unknown as { getPlugins: IPlugin[] },
        }),
      );

      expect(result.current.filteredPlugins).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'loaded-plugin-1',
            name: 'Loaded Plugin 1',
          }),
          expect.objectContaining({
            id: 'loaded-plugin-2',
            name: 'Loaded Plugin 2',
          }),
        ]),
      );
    });

    it('should handle undefined plugin data', () => {
      const { result } = renderHook(() =>
        usePluginFilters({
          pluginData: undefined as unknown as { getPlugins: IPlugin[] },
        }),
      );

      expect(result.current.filteredPlugins).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'loaded-plugin-1',
            name: 'Loaded Plugin 1',
          }),
          expect.objectContaining({
            id: 'loaded-plugin-2',
            name: 'Loaded Plugin 2',
          }),
        ]),
      );
    });
  });

  describe('Search Functionality', () => {
    it('should filter plugins by name', () => {
      const { result } = renderHook(() =>
        usePluginFilters({ pluginData: stablePluginData }),
      );

      act(() => {
        result.current.debouncedSearch('Loaded Plugin 1');
      });

      expect(result.current.searchTerm).toBe('Loaded Plugin 1');
      expect(result.current.filteredPlugins).toEqual([
        expect.objectContaining({
          id: 'loaded-plugin-1',
          name: 'Loaded Plugin 1',
        }),
      ]);
    });

    it('should filter plugins by description', () => {
      const { result } = renderHook(() =>
        usePluginFilters({ pluginData: stablePluginData }),
      );

      act(() => {
        result.current.debouncedSearch('Another loaded');
      });

      expect(result.current.searchTerm).toBe('Another loaded');
      expect(result.current.filteredPlugins).toEqual([
        expect.objectContaining({
          id: 'loaded-plugin-2',
          name: 'Loaded Plugin 2',
          description: 'Another loaded plugin',
        }),
      ]);
    });

    it('should perform case-insensitive search', () => {
      const { result } = renderHook(() =>
        usePluginFilters({ pluginData: stablePluginData }),
      );

      act(() => {
        result.current.debouncedSearch('PLUGIN 1');
      });

      expect(result.current.filteredPlugins).toEqual([
        expect.objectContaining({
          id: 'loaded-plugin-1',
          name: 'Loaded Plugin 1',
        }),
      ]);
    });

    it('should return all plugins when search term is empty', () => {
      const { result } = renderHook(() =>
        usePluginFilters({ pluginData: stablePluginData }),
      );

      act(() => {
        result.current.debouncedSearch('');
      });

      expect(result.current.searchTerm).toBe('');
      expect(result.current.filteredPlugins).toHaveLength(5); // 2 loaded + 3 GraphQL plugins
    });

    it('should return empty array when no plugins match search', () => {
      const { result } = renderHook(() =>
        usePluginFilters({ pluginData: stablePluginData }),
      );

      act(() => {
        result.current.debouncedSearch('nonexistent plugin');
      });

      expect(result.current.filteredPlugins).toEqual([]);
    });

    it('should search in both name and description', () => {
      const { result } = renderHook(() =>
        usePluginFilters({ pluginData: stablePluginData }),
      );

      act(() => {
        result.current.debouncedSearch('plugin');
      });

      expect(result.current.filteredPlugins).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'loaded-plugin-1',
            name: 'Loaded Plugin 1',
          }),
          expect.objectContaining({
            id: 'loaded-plugin-2',
            name: 'Loaded Plugin 2',
          }),
          expect.objectContaining({
            id: 'graphql-plugin-1',
            name: 'graphql-plugin-1',
          }),
          expect.objectContaining({
            id: 'graphql-plugin-2',
            name: 'graphql-plugin-2',
          }),
          expect.objectContaining({
            id: 'graphql-plugin-3',
            name: 'graphql-plugin-3',
          }),
        ]),
      );
    });
  });

  describe('Filter Functionality', () => {
    it('should show all plugins when filter is "all"', () => {
      const { result } = renderHook(() =>
        usePluginFilters({ pluginData: stablePluginData }),
      );

      act(() => {
        result.current.handleFilterChange('all');
      });

      expect(result.current.filterState).toEqual({
        option: 'all',
        selectedOption: 'allPlugins',
      });
      expect(result.current.filteredPlugins).toHaveLength(5);
    });

    it('should show only installed plugins when filter is "installed"', () => {
      const { result } = renderHook(() =>
        usePluginFilters({ pluginData: stablePluginData }),
      );

      act(() => {
        result.current.handleFilterChange('installed');
      });

      expect(result.current.filterState).toEqual({
        option: 'installed',
        selectedOption: 'installedPlugins',
      });
      expect(result.current.filteredPlugins).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'loaded-plugin-1',
            name: 'Loaded Plugin 1',
          }),
          expect.objectContaining({
            id: 'loaded-plugin-2',
            name: 'Loaded Plugin 2',
          }),
          expect.objectContaining({
            id: 'graphql-plugin-1',
            name: 'graphql-plugin-1',
          }),
          expect.objectContaining({
            id: 'graphql-plugin-2',
            name: 'graphql-plugin-2',
          }),
        ]),
      );
      // Should not include graphql-plugin-3 as it's not installed
      expect(result.current.filteredPlugins).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'graphql-plugin-3',
          }),
        ]),
      );
    });

    it('should combine search and filter correctly', () => {
      const { result } = renderHook(() =>
        usePluginFilters({ pluginData: stablePluginData }),
      );

      // Set filter to installed
      act(() => {
        result.current.handleFilterChange('installed');
      });

      // Search for "Plugin 1"
      act(() => {
        result.current.debouncedSearch('Plugin 1');
      });

      expect(result.current.filteredPlugins).toEqual([
        expect.objectContaining({
          id: 'loaded-plugin-1',
          name: 'Loaded Plugin 1',
        }),
      ]);
    });

    it('should handle search with no matches in installed filter', () => {
      const { result } = renderHook(() =>
        usePluginFilters({ pluginData: stablePluginData }),
      );

      // Set filter to installed
      act(() => {
        result.current.handleFilterChange('installed');
      });

      // Search for something that doesn't exist
      act(() => {
        result.current.debouncedSearch('nonexistent');
      });

      expect(result.current.filteredPlugins).toEqual([]);
    });
  });

  describe('isInstalled Function', () => {
    it('should return true for loaded plugins', () => {
      const { result } = renderHook(() =>
        usePluginFilters({ pluginData: stablePluginData }),
      );

      expect(result.current.isInstalled('Loaded Plugin 1')).toBe(true);
      expect(result.current.isInstalled('Loaded Plugin 2')).toBe(true);
    });

    it('should return true for installed GraphQL plugins', () => {
      const { result } = renderHook(() =>
        usePluginFilters({ pluginData: stablePluginData }),
      );

      expect(result.current.isInstalled('graphql-plugin-1')).toBe(true);
      expect(result.current.isInstalled('graphql-plugin-2')).toBe(true);
    });

    it('should return false for non-installed GraphQL plugins', () => {
      const { result } = renderHook(() =>
        usePluginFilters({ pluginData: stablePluginData }),
      );

      expect(result.current.isInstalled('graphql-plugin-3')).toBe(false);
    });

    it('should return false for non-existent plugins', () => {
      const { result } = renderHook(() =>
        usePluginFilters({ pluginData: stablePluginData }),
      );

      expect(result.current.isInstalled('nonexistent-plugin')).toBe(false);
    });

    it('should handle empty plugin data', () => {
      const { result } = renderHook(() =>
        usePluginFilters({
          pluginData: null as unknown as { getPlugins: IPlugin[] },
        }),
      );

      expect(result.current.isInstalled('Loaded Plugin 1')).toBe(true);
      expect(result.current.isInstalled('graphql-plugin-1')).toBe(false);
    });
  });

  describe('getInstalledPlugin Function', () => {
    it('should return GraphQL plugin data for installed GraphQL plugins', () => {
      const { result } = renderHook(() =>
        usePluginFilters({ pluginData: stablePluginData }),
      );

      const plugin = result.current.getInstalledPlugin('graphql-plugin-1');

      expect(plugin).toEqual({
        id: 'db-plugin-1',
        name: 'graphql-plugin-1',
        description: 'Plugin graphql-plugin-1',
        author: 'Unknown',
        icon: '/images/logo512.png',
        version: '1.0.0',
        cdnUrl: '',
        readme: '',
        screenshots: [],
        homepage: '',
        license: '',
        tags: [],
        status: 'active',
        changelog: [],
        features: [],
      });
    });

    it('should return loaded plugin data for loaded plugins', () => {
      const { result } = renderHook(() =>
        usePluginFilters({ pluginData: stablePluginData }),
      );

      const plugin = result.current.getInstalledPlugin('Loaded Plugin 1');

      expect(plugin).toEqual({
        id: 'loaded-plugin-1',
        name: 'Loaded Plugin 1',
        description: 'A loaded plugin for testing',
        author: 'Test Author',
        icon: '/test-icon-1.png',
        version: '1.0.0',
        cdnUrl: '',
        readme: '',
        screenshots: [],
        homepage: 'https://example.com',
        license: 'MIT',
        tags: ['test', 'plugin'],
        status: 'active',
        changelog: [],
        features: [],
      });
    });

    it('should return undefined for non-installed plugins', () => {
      const { result } = renderHook(() =>
        usePluginFilters({ pluginData: stablePluginData }),
      );

      const plugin = result.current.getInstalledPlugin('nonexistent-plugin');

      expect(plugin).toBeUndefined();
    });

    it('should prioritize GraphQL data over loaded plugin data', () => {
      // Create a scenario where both GraphQL and loaded plugin exist for the same name
      const mockPluginsWithConflict: IPlugin[] = [
        {
          id: 'db-conflict-plugin',
          pluginId: 'Loaded Plugin 1', // Same name as loaded plugin
          isInstalled: true,
          isActivated: false,
          backup: false,
          createdAt: dayjs.utc().toISOString(),
          updatedAt: dayjs.utc().toISOString(),
        },
      ];

      const pluginData = { getPlugins: mockPluginsWithConflict };
      const { result } = renderHook(() => usePluginFilters({ pluginData }));

      const plugin = result.current.getInstalledPlugin('Loaded Plugin 1');

      // Should return GraphQL data (source of truth)
      expect(plugin).toEqual({
        id: 'db-conflict-plugin',
        name: 'Loaded Plugin 1',
        description: 'Plugin Loaded Plugin 1',
        author: 'Unknown',
        icon: '/images/logo512.png',
        version: '1.0.0',
        cdnUrl: '',
        readme: '',
        screenshots: [],
        homepage: '',
        license: '',
        tags: [],
        status: 'inactive',
        changelog: [],
        features: [],
      });
    });
  });

  describe('Debouncing', () => {
    it('should update search term when debounced search is called', () => {
      const { result } = renderHook(() =>
        usePluginFilters({ pluginData: stablePluginData }),
      );

      act(() => {
        result.current.debouncedSearch('test search');
      });

      expect(result.current.searchTerm).toBe('test search');
    });

    it('should handle multiple search calls', () => {
      const { result } = renderHook(() =>
        usePluginFilters({ pluginData: stablePluginData }),
      );

      act(() => {
        result.current.debouncedSearch('first');
        result.current.debouncedSearch('second');
        result.current.debouncedSearch('third');
      });

      expect(result.current.searchTerm).toBe('third');
    });
  });

  describe('Edge Cases', () => {
    it('should handle plugins with duplicate IDs in loaded and GraphQL data', () => {
      const mockPluginsWithDuplicate: IPlugin[] = [
        {
          pluginId: 'loaded-plugin-1', // Same ID as loaded plugin
          isInstalled: true,
          isActivated: true,
          id: '1',
          backup: false,
          createdAt: dayjs.utc().toISOString(),
          updatedAt: dayjs.utc().toISOString(),
        },
      ];

      const pluginData = { getPlugins: mockPluginsWithDuplicate };
      const { result } = renderHook(() => usePluginFilters({ pluginData }));

      // Should not duplicate the plugin in the list
      const loadedPlugin = result.current.filteredPlugins.find(
        (p) => p.id === 'loaded-plugin-1',
      );
      expect(loadedPlugin).toBeDefined();
      expect(
        result.current.filteredPlugins.filter(
          (p) => p.id === 'loaded-plugin-1',
        ),
      ).toHaveLength(1);
    });

    it('should handle plugins with special characters in names', () => {
      const mockPluginsWithSpecialChars: IPlugin[] = [
        {
          id: 'special-plugin',
          pluginId: 'plugin-with-special-chars!@#$%',
          isInstalled: true,
          isActivated: true,
          backup: false,
          createdAt: dayjs.utc().toISOString(),
          updatedAt: dayjs.utc().toISOString(),
        },
      ];

      const pluginData = { getPlugins: mockPluginsWithSpecialChars };
      const { result } = renderHook(() => usePluginFilters({ pluginData }));

      act(() => {
        result.current.debouncedSearch('special');
      });

      expect(result.current.filteredPlugins).toEqual([
        expect.objectContaining({
          id: 'plugin-with-special-chars!@#$%',
          name: 'plugin-with-special-chars!@#$%',
        }),
      ]);
    });

    it('should handle very long search terms', () => {
      const { result } = renderHook(() =>
        usePluginFilters({ pluginData: stablePluginData }),
      );

      const longSearchTerm = 'a'.repeat(1000);

      act(() => {
        result.current.debouncedSearch(longSearchTerm);
      });

      expect(result.current.searchTerm).toBe(longSearchTerm);
      expect(result.current.filteredPlugins).toEqual([]);
    });

    it('should handle empty string filter changes', () => {
      const { result } = renderHook(() =>
        usePluginFilters({ pluginData: stablePluginData }),
      );

      act(() => {
        result.current.handleFilterChange('');
      });

      expect(result.current.filterState.option).toBe('');
      expect(result.current.filterState.selectedOption).toBe(
        'installedPlugins',
      );
    });

    it('should handle null/undefined plugin names in isInstalled', () => {
      const { result } = renderHook(() =>
        usePluginFilters({ pluginData: stablePluginData }),
      );

      expect(result.current.isInstalled(null as unknown as string)).toBe(false);
      expect(result.current.isInstalled(undefined as unknown as string)).toBe(
        false,
      );
      expect(result.current.isInstalled('')).toBe(false);
    });

    it('should handle null/undefined plugin names in getInstalledPlugin', () => {
      const { result } = renderHook(() =>
        usePluginFilters({ pluginData: stablePluginData }),
      );

      expect(
        result.current.getInstalledPlugin(null as unknown as string),
      ).toBeUndefined();
      expect(
        result.current.getInstalledPlugin(undefined as unknown as string),
      ).toBeUndefined();
      expect(result.current.getInstalledPlugin('')).toBeUndefined();
    });
  });

  describe('Translation Integration', () => {
    it('should use translation for filter options', () => {
      renderHook(() => usePluginFilters({ pluginData: stablePluginData }));

      expect(mockT).toHaveBeenCalledWith('allPlugins');
    });

    it('should update translation when filter changes', () => {
      const { result } = renderHook(() =>
        usePluginFilters({ pluginData: stablePluginData }),
      );

      act(() => {
        result.current.handleFilterChange('installed');
      });

      expect(mockT).toHaveBeenCalledWith('installedPlugins');
    });
  });

  describe('Performance and Memory', () => {
    it('should not cause infinite re-renders', () => {
      const { result, rerender } = renderHook(() =>
        usePluginFilters({ pluginData: stablePluginData }),
      );

      const initialPlugins = result.current.filteredPlugins;

      // Rerender with same data
      rerender();

      expect(result.current.filteredPlugins).toEqual(initialPlugins);
    });

    it('should handle large plugin datasets efficiently', () => {
      const largePluginData = {
        getPlugins: Array.from({ length: 1000 }, (_, i) => ({
          id: `plugin-${i}`,
          pluginId: `plugin-${i}`,
          isInstalled: i % 2 === 0,
          isActivated: i % 4 === 0,
          backup: false,
          createdAt: dayjs.utc().toISOString(),
          updatedAt: dayjs.utc().toISOString(),
        })),
      };

      const { result } = renderHook(() =>
        usePluginFilters({ pluginData: largePluginData }),
      );

      expect(result.current.filteredPlugins).toHaveLength(1002); // 1000 GraphQL + 2 loaded plugins
    });
  });
});
