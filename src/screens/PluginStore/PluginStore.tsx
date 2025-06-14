/**
 * A marketplace interface for browsing, installing, and managing Talawa plugins.
 * Provides functionality to search, filter, and paginate through available plugins,
 * with options to install, uninstall, and toggle plugin status.
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material';
import styles from 'style/app-fixed.module.css';
import SearchBar from 'subComponents/SearchBar';
import PaginationList from 'components/Pagination/PaginationList/PaginationList';
import PluginModal from './PluginModal';
import UploadPluginModal from './UploadPluginModal';
import SortingButton from 'subComponents/SortingButton';
import { useLoadedPlugins } from 'plugin/hooks';
import pluginManager from 'plugin/manager';
import type { IPluginMeta } from 'plugin';
import {
  useGetAllPlugins,
  useCreatePlugin,
  useUpdatePlugin,
  useDeletePlugin,
} from 'plugin/graphql-service';

// Removed PLUGIN_STORE_URL - now using GraphQL for plugin data

// Debounce hook for search
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

export default function PluginStore() {
  const { t } = useTranslation('translation', { keyPrefix: 'pluginStore' });
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [selectedPluginId, setSelectedPluginId] = useState<string | null>(null);
  const [selectedPluginMeta, setSelectedPluginMeta] =
    useState<IPluginMeta | null>(null);
  const loadedPlugins = useLoadedPlugins();
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPlugins, setFilteredPlugins] = useState<IPluginMeta[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterState, setFilterState] = useState({
    option: 'all',
    selectedOption: t('allPlugins'),
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUninstallModal, setShowUninstallModal] = useState(false);
  const [pluginToUninstall, setPluginToUninstall] =
    useState<IPluginMeta | null>(null);

  // GraphQL hooks
  const {
    data: pluginData,
    loading: pluginLoading,
    error: pluginError,
    refetch,
  } = useGetAllPlugins();
  const [createPlugin] = useCreatePlugin();
  const [updatePlugin] = useUpdatePlugin();
  const [deletePlugin] = useDeletePlugin();

  // Plugin data now comes entirely from GraphQL - no local file fetching needed

  // Handle GraphQL plugin data
  useEffect(() => {
    if (pluginError) {
      console.error('Failed to fetch plugins via GraphQL:', pluginError);
    }
  }, [pluginError]);

  // Debounced search handler
  const debouncedSearch = useDebounce<string>((value: string) => {
    setSearchTerm(value);
  }, 300);

  useEffect(() => {
    // Combine GraphQL plugins and loaded plugins
    const graphqlPlugins = pluginData?.plugins || [];

    const allPluginsForDisplay = [
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
          (gqlPlugin) =>
            !loadedPlugins.some(
              (loadedPlugin) => loadedPlugin.id === gqlPlugin.pluginId,
            ),
        )
        .map((gqlPlugin) => ({
          id: gqlPlugin.pluginId,
          name: gqlPlugin.pluginId,
          description: `Plugin ${gqlPlugin.pluginId}`,
          author: 'Unknown',
          icon: '/images/logo512.png',
        })),
    ];

    console.log('All plugins for display:', allPluginsForDisplay);
    console.log('GraphQL plugins:', graphqlPlugins);

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
  }, [searchTerm, filterState.option, loadedPlugins, pluginData]);

  // Reset to first page if search/filter changes
  useEffect(() => {
    setPage(0);
  }, [searchTerm, filterState.option]);

  // Paginated plugins
  const paginatedPlugins = filteredPlugins.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  // Pagination handlers
  const handleChangePage = (
    event: React.MouseEvent | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<{ value: string }>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Open plugin details modal
  const openPlugin = (plugin: IPluginMeta) => {
    setSelectedPluginId(plugin.id);
    setSelectedPluginMeta(plugin);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedPluginId(null);
    setSelectedPluginMeta(null);
  };

  // Check if plugin is installed (loaded by plugin manager or in GraphQL)
  const isInstalled = (pluginName: string): boolean => {
    // Check in loaded plugins
    const isLoaded = loadedPlugins.some((p) => p.manifest.name === pluginName);
    if (isLoaded) return true;

    // Check in GraphQL data
    const graphqlPlugin = pluginData?.plugins?.find(
      (p) => p.pluginId === pluginName,
    );
    return graphqlPlugin?.isInstalled || false;
  };

  // Get installed plugin info (adapter for PluginModal interface)
  const getInstalledPlugin = (pluginName: string): any => {
    // First check loaded plugins
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

    // Then check GraphQL data
    const graphqlPlugin = pluginData?.plugins?.find(
      (p) => p.pluginId === pluginName,
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

    return undefined;
  };

  // Install plugin (load through plugin manager and create in GraphQL)
  const installPlugin = async (plugin: IPluginMeta) => {
    setLoading(true);
    try {
      // Create plugin in GraphQL first
      const existingPlugin = pluginData?.plugins?.find(
        (p) => p.pluginId === plugin.id,
      );
      if (!existingPlugin) {
        await createPlugin({
          variables: {
            input: {
              pluginId: plugin.id,
            },
          },
        });
      } else {
        // Update to installed status
        await updatePlugin({
          variables: {
            input: {
              id: existingPlugin.id,
              isInstalled: true,
            },
          },
        });
      }

      // Use plugin manager to load the plugin
      const success = await pluginManager.loadPlugin(plugin.id);
      if (!success) {
        throw new Error('Failed to load plugin');
      }

      // Refetch plugin data to update UI
      await refetch();
    } catch (error) {
      console.error('Failed to install plugin:', error);
    } finally {
      setLoading(false);
    }
  };

  // Activate/deactivate plugin
  const togglePluginStatus = async (
    plugin: IPluginMeta,
    status: 'active' | 'inactive',
  ) => {
    setLoading(true);
    try {
      // Update plugin status in GraphQL
      const existingPlugin = pluginData?.plugins?.find(
        (p) => p.pluginId === plugin.id,
      );
      if (existingPlugin) {
        await updatePlugin({
          variables: {
            input: {
              id: existingPlugin.id,
              isActivated: status === 'active',
            },
          },
        });
      }

      // Update plugin manager status
      const success = await pluginManager.togglePluginStatus(plugin.id, status);
      if (!success) {
        throw new Error('Failed to toggle plugin status');
      }

      // Refetch plugin data to update UI
      await refetch();
    } catch (error) {
      console.error('Failed to toggle plugin status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Uninstall plugin
  const uninstallPlugin = async (plugin: IPluginMeta) => {
    setPluginToUninstall(plugin);
    setShowUninstallModal(true);
  };

  const handleUninstallConfirm = async (keepData: boolean) => {
    if (!pluginToUninstall) return;

    setLoading(true);
    try {
      const existingPlugin = pluginData?.plugins?.find(
        (p) => p.pluginId === pluginToUninstall.id,
      );
      if (existingPlugin) {
        if (keepData) {
          // Keep data - update plugin status
          await updatePlugin({
            variables: {
              input: {
                id: existingPlugin.id,
                isInstalled: false,
                isActivated: false,
                backup: true,
              },
            },
          });
        } else {
          // Remove permanently - delete from database
          await deletePlugin({
            variables: {
              input: {
                id: existingPlugin.id,
              },
            },
          });
        }
      }

      // Unload from plugin manager
      const success = await pluginManager.unloadPlugin(pluginToUninstall.id);
      if (!success) {
        throw new Error('Failed to uninstall plugin');
      }

      // Refetch plugin data to update UI
      await refetch();
    } catch (error) {
      console.error('Failed to uninstall plugin:', error);
    } finally {
      setLoading(false);
      setShowUninstallModal(false);
      setPluginToUninstall(null);
      closeModal();
    }
  };

  const handleFilterChange = (value: string): void => {
    setFilterState({
      option: value,
      selectedOption: value === 'all' ? t('allPlugins') : t('installedPlugins'),
    });
  };

  // Close upload modal
  const closeUploadModal = async () => {
    setShowUploadModal(false);
    // Refresh plugin data after upload
    await refetch();
  };

  return (
    <div className={styles.pageContent} style={{ paddingRight: 24 }}>
      <div className={styles.btnsContainerSearchBar}>
        <SearchBar
          placeholder={t('searchPlaceholder')}
          onSearch={debouncedSearch}
          inputTestId="searchPlugins"
          buttonTestId="searchPluginsBtn"
        />
        <div className={styles.btnsBlockSearchBar}>
          <SortingButton
            title="Filter plugins"
            sortingOptions={[
              { label: t('allPlugins'), value: 'all' },
              { label: t('installedPlugins'), value: 'installed' },
            ]}
            selectedOption={filterState.selectedOption}
            onSortChange={handleFilterChange}
            dataTestIdPrefix="filterPlugins"
            dropdownTestId="filter"
            type="filter"
          />
          <Button
            className={`${styles.dropdown} ${styles.createorgdropdown}`}
            onClick={() => setShowUploadModal(true)}
            data-testid="uploadPluginBtn"
          >
            <i className={'fa fa-plus me-2'} />
            Upload Plugin
          </Button>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          marginTop: 24,
        }}
      >
        {paginatedPlugins.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              background: '#fff',
              borderRadius: 12,
              border: '1px solid #e7e7e7',
            }}
          >
            <div style={{ fontSize: 18, color: '#666', marginBottom: 8 }}>
              {filteredPlugins.length === 0 && searchTerm
                ? t('noPluginsFound')
                : filterState.option === 'installed'
                  ? t('noInstalledPlugins')
                  : t('noPluginsAvailable')}
            </div>
            <div style={{ fontSize: 14, color: '#888' }}>
              {filterState.option === 'installed'
                ? t('installPluginsToSeeHere')
                : t('checkBackLater')}
            </div>
          </div>
        ) : (
          paginatedPlugins.map((plugin) => {
            const installed = isInstalled(plugin.name);
            return (
              <div
                key={plugin.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#fff',
                  borderRadius: 12,
                  boxShadow: '0 1px 4px rgba(60,64,67,0.07)',
                  border: '1px solid #e7e7e7',
                  padding: '16px 24px',
                  minHeight: 80,
                  transition: 'box-shadow 0.2s',
                }}
              >
                {/* Icon */}
                <img
                  src={plugin.icon}
                  alt="Plugin Icon"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    objectFit: 'cover',
                    background: '#f5f5f5',
                    marginRight: 24,
                  }}
                />
                {/* Name, Description, Author */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 18,
                      marginBottom: 2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {plugin.name}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: '#555',
                      marginBottom: 2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {plugin.description}
                  </div>
                  <div style={{ fontSize: 13, color: '#888' }}>
                    {plugin.author}
                  </div>
                </div>
                {/* View/Manage Button */}
                <div style={{ marginLeft: 24, minWidth: 120 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => openPlugin(plugin)}
                    className="w-100 mb-2"
                  >
                    {installed ? 'Manage' : 'View'}
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
      {/* Pagination Controls */}
      <div style={{ marginTop: 32, display: 'flex', justifyContent: 'end' }}>
        <PaginationList
          count={filteredPlugins.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
      {/* Plugin Details Modal */}
      <PluginModal
        show={showModal}
        onHide={closeModal}
        pluginId={selectedPluginId}
        meta={selectedPluginMeta}
        loading={loading || pluginLoading}
        isInstalled={isInstalled}
        getInstalledPlugin={getInstalledPlugin}
        installPlugin={installPlugin}
        togglePluginStatus={togglePluginStatus}
        uninstallPlugin={uninstallPlugin}
      />
      {/* Upload Plugin Modal */}
      <UploadPluginModal show={showUploadModal} onHide={closeUploadModal} />
      {/* Uninstall Confirmation Modal */}
      <Dialog
        open={showUninstallModal}
        onClose={() => setShowUninstallModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>Uninstall Plugin</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            How would you like to uninstall {pluginToUninstall?.name}?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Keep data: The plugin will be removed but its data will be
            preserved for future use
            <br />• Remove permanently: The plugin and all its data will be
            permanently removed
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setShowUninstallModal(false)}
            color="inherit"
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleUninstallConfirm(false)}
            color="error"
            variant="outlined"
            sx={{ mr: 1 }}
          >
            Remove Permanently
          </Button>
          <Button
            onClick={() => handleUninstallConfirm(true)}
            color="primary"
            variant="contained"
          >
            Keep Data
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
