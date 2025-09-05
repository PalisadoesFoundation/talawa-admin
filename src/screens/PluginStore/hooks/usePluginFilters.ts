/**
 * Custom hook for handling plugin search and filtering logic
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoadedPlugins } from 'plugin/hooks';
import { AdminPluginFileService } from 'plugin/services/AdminPluginFileService';
import type { IPluginMeta } from 'plugin';

function useDebounce<T>(fn: (value: T) => void, delay: number) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  return useCallback(
    (value: T) => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        fn(value);
      }, delay) as unknown as ReturnType<typeof setTimeout>;
    },
    [fn, delay],
  );
}

interface UsePluginFiltersProps {
  pluginData: any;
}

export function usePluginFilters({ pluginData }: UsePluginFiltersProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'pluginStore' });
  const loadedPlugins = useLoadedPlugins();

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPlugins, setFilteredPlugins] = useState<IPluginMeta[]>([]);
  const [filterState, setFilterState] = useState({
    option: 'all',
    selectedOption: t('allPlugins'),
  });
  const [pluginDetailsCache, setPluginDetailsCache] = useState<
    Record<string, IPluginMeta>
  >({});

  const debouncedSearch = useDebounce<string>((value: string) => {
    setSearchTerm(value);
  }, 300);

  const loadPluginDetails = useCallback(
    async (pluginId: string): Promise<IPluginMeta | null> => {
      try {
        const details = await AdminPluginFileService.getPluginDetails(pluginId);
        if (details) {
          return {
            id: details.id,
            name: details.name,
            description: details.description,
            author: details.author,
            icon: details.icon,
          };
        }
      } catch (error) {
        console.error(`Failed to load plugin details for ${pluginId}:`, error);
      }
      return null;
    },
    [],
  );

  const isInstalled = useCallback(
    (pluginName: string): boolean => {
      // Check in loaded plugins
      const isLoaded = loadedPlugins.some(
        (p) => p.manifest.name === pluginName,
      );
      if (isLoaded) return true;

      // Check in GraphQL data
      const graphqlPlugin = pluginData?.getPlugins?.find(
        (p: any) => p.pluginId === pluginName,
      );
      return graphqlPlugin?.isInstalled || false;
    },
    [loadedPlugins, pluginData],
  );

  const getInstalledPlugin = useCallback(
    (pluginName: string): any => {
      // First check GraphQL data (source of truth for status)
      const graphqlPlugin = pluginData?.getPlugins?.find(
        (p: any) => p.pluginId === pluginName,
      );
      if (graphqlPlugin) {
        return {
          id: graphqlPlugin.id,
          name: pluginName,
          description: `Plugin ${pluginName}`,
          author: 'Unknown',
          icon: '/images/logo512.png',
          version: '1.0.0',
          cdnUrl: '',
          readme: '',
          screenshots: [],
          homepage: '',
          license: '',
          tags: [],
          status: graphqlPlugin.isActivated ? 'active' : 'inactive',
        };
      }

      // Then check loaded plugins (fallback)
      const loadedPlugin = loadedPlugins.find(
        (p) => p.manifest.name === pluginName,
      );
      if (loadedPlugin) {
        return {
          id: loadedPlugin.id,
          name: loadedPlugin.manifest.name,
          description: loadedPlugin.manifest.description,
          author: loadedPlugin.manifest.author,
          icon: loadedPlugin.manifest.icon || '/images/logo512.png',
          version: loadedPlugin.manifest.version,
          cdnUrl: '',
          readme: '',
          screenshots: [],
          homepage: loadedPlugin.manifest.homepage,
          license: loadedPlugin.manifest.license,
          tags: loadedPlugin.manifest.tags,
          status: loadedPlugin.status,
        };
      }

      return undefined;
    },
    [loadedPlugins, pluginData],
  );

  useEffect(() => {
    const graphqlPlugins = pluginData?.getPlugins || [];

    const processPlugins = async () => {
      const allPluginsForDisplay = [
        ...loadedPlugins.map((plugin) => ({
          id: plugin.id,
          name: plugin.manifest.name,
          description: plugin.manifest.description,
          author: plugin.manifest.author,
          icon: plugin.manifest.icon || '/images/logo512.png',
        })),
      ];

      for (const gqlPlugin of graphqlPlugins) {
        const isAlreadyLoaded = loadedPlugins.some(
          (loadedPlugin) => loadedPlugin.id === gqlPlugin.pluginId,
        );

        if (!isAlreadyLoaded) {
          let pluginDetails = pluginDetailsCache[gqlPlugin.pluginId];

          if (!pluginDetails) {
            // Load details from files
            const loadedDetails = await loadPluginDetails(gqlPlugin.pluginId);

            if (loadedDetails) {
              // Cache the details
              setPluginDetailsCache((prev) => ({
                ...prev,
                [gqlPlugin.pluginId]: loadedDetails,
              }));
              pluginDetails = loadedDetails;
            }
          }

          // Use loaded details or fallback to basic info
          if (pluginDetails) {
            allPluginsForDisplay.push(pluginDetails);
          } else {
            allPluginsForDisplay.push({
              id: gqlPlugin.pluginId,
              name: gqlPlugin.pluginId,
              description: `Plugin ${gqlPlugin.pluginId}`,
              author: 'Unknown',
              icon: '/images/logo512.png',
            });
          }
        }
      }

      if (!searchTerm) {
        if (filterState.option === 'all') {
          setFilteredPlugins(allPluginsForDisplay);
        } else {
          setFilteredPlugins(
            allPluginsForDisplay.filter((plugin) => isInstalled(plugin.name)),
          );
        }
      } else {
        const searchFiltered = allPluginsForDisplay.filter(
          (plugin) =>
            plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plugin.description.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        if (filterState.option === 'all') {
          setFilteredPlugins(searchFiltered);
        } else {
          setFilteredPlugins(
            searchFiltered.filter((plugin) => isInstalled(plugin.name)),
          );
        }
      }
    };

    processPlugins();
  }, [
    searchTerm,
    filterState.option,
    loadedPlugins,
    pluginData,
    pluginDetailsCache,
    loadPluginDetails,
    isInstalled,
  ]);

  const handleFilterChange = useCallback(
    (value: string): void => {
      setFilterState({
        option: value,
        selectedOption:
          value === 'all' ? t('allPlugins') : t('installedPlugins'),
      });
    },
    [t],
  );

  return {
    searchTerm,
    filteredPlugins,
    filterState,
    debouncedSearch,
    handleFilterChange,
    isInstalled,
    getInstalledPlugin,
  };
}
