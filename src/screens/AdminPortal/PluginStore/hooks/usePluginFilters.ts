/**
 * Custom hook for handling plugin search and filtering logic
 */
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoadedPlugins } from 'plugin/hooks';
import useDebounce from 'shared-components/useDebounce/useDebounce';
import type { IPluginMeta, IInstalledPlugin } from 'plugin';

import type { IPlugin } from 'plugin/graphql-service';

interface IUsePluginFiltersProps {
  pluginData?: { getPlugins: IPlugin[] };
}

export function usePluginFilters({ pluginData }: IUsePluginFiltersProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'pluginStore' });
  const loadedPlugins = useLoadedPlugins();

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPlugins, setFilteredPlugins] = useState<IPluginMeta[]>([]);
  const [filterState, setFilterState] = useState({
    option: 'all',
    selectedOption: t('allPlugins'),
  });

  const isInstalled = useCallback(
    (pluginName: string): boolean => {
      // Check in loaded plugins
      const isLoaded = loadedPlugins.some(
        (p) => p.manifest.name === pluginName,
      );
      if (isLoaded) return true;

      // Check in GraphQL data
      const graphqlPlugin = pluginData?.getPlugins?.find(
        (p: IPlugin) => p.pluginId === pluginName,
      );
      return graphqlPlugin?.isInstalled || false;
    },
    [loadedPlugins, pluginData],
  );

  const getInstalledPlugin = useCallback(
    (pluginName: string): IInstalledPlugin | undefined => {
      // First check GraphQL data (source of truth for status)
      const graphqlPlugin = pluginData?.getPlugins?.find(
        (p: IPlugin) => p.pluginId === pluginName,
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
          features: [],
          changelog: [],
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
          screenshots: loadedPlugin.info?.screenshots || [],
          homepage: loadedPlugin.manifest.homepage,
          license: loadedPlugin.manifest.license,
          tags: loadedPlugin.manifest.tags,
          features: loadedPlugin.info?.features || [],
          changelog: loadedPlugin.info?.changelog || [],
          status: loadedPlugin.status as 'active' | 'inactive',
        };
      }

      return undefined;
    },
    [loadedPlugins, pluginData],
  );

  // Simple filtering effect - no async operations, no caching, no infinite loops
  useEffect(() => {
    const graphqlPlugins = pluginData?.getPlugins || [];

    // Combine loaded plugins and GraphQL plugins
    const allPlugins: IPluginMeta[] = [
      // Add loaded plugins
      ...loadedPlugins.map((plugin) => ({
        id: plugin.id,
        name: plugin.manifest.name,
        description: plugin.manifest.description,
        author: plugin.manifest.author,
        icon: plugin.manifest.icon || '/images/logo512.png',
      })),
      // Add GraphQL plugins that aren't already loaded
      ...graphqlPlugins
        .filter(
          (gqlPlugin: IPlugin) =>
            !loadedPlugins.some(
              (loadedPlugin) => loadedPlugin.id === gqlPlugin.pluginId,
            ),
        )
        .map((gqlPlugin: IPlugin) => ({
          id: gqlPlugin.pluginId,
          name: gqlPlugin.pluginId,
          description: `Plugin ${gqlPlugin.pluginId}`,
          author: 'Unknown',
          icon: '/images/logo512.png',
        })),
    ];

    // Apply search filter
    let filtered = allPlugins;
    if (searchTerm) {
      filtered = allPlugins.filter(
        (plugin) =>
          plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plugin.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply installed filter
    if (filterState.option === 'installed') {
      filtered = filtered.filter((plugin) => isInstalled(plugin.name));
    }

    setFilteredPlugins(filtered);
  }, [searchTerm, filterState.option, loadedPlugins, pluginData, isInstalled]);

  const handleFilterChange = useCallback(
    (value: string | number): void => {
      const stringValue = String(value);
      setFilterState({
        option: stringValue,
        selectedOption:
          stringValue === 'all' ? t('allPlugins') : t('installedPlugins'),
      });
    },
    [t],
  );

  // Debounced search function following the same pattern as other components
  const doSearch = useCallback((...args: unknown[]) => {
    const value = args[0] as string;
    setSearchTerm(value);
  }, []);

  const { debouncedCallback: debouncedSearch } = useDebounce(doSearch, 100);

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
