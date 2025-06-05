/**
 * A marketplace interface for browsing, installing, and managing Talawa plugins.
 * Provides functionality to search, filter, and paginate through available plugins,
 * with options to install, uninstall, and toggle plugin status.
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import styles from 'style/app-fixed.module.css';
import SearchBar from 'subComponents/SearchBar';
import PaginationList from 'components/Pagination/PaginationList/PaginationList';
import PluginModal from './PluginModal';

// Types
interface IPluginMeta {
  id: string;
  name: string;
  description: string;
  author: string;
  icon: string;
}

interface IPluginDetails extends IPluginMeta {
  version: string;
  cdnUrl: string;
  readme: string;
  screenshots: string[];
  homepage?: string;
  license?: string;
  tags?: string[];
}

interface IInstalledPlugin extends IPluginDetails {
  status: 'active' | 'inactive';
}

// Dummy CDN plugins meta array (minimal info for list)
const availablePlugins: IPluginMeta[] = [
  {
    id: 'calendar',
    name: 'Calendar',
    description: 'A plugin to add calendar functionality to your community.',
    author: 'Talawa Team',
    icon: '/images/logo512.png',
  },
];

// Debounce hook
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

// Helper to fetch installed plugins from local JSON
async function fetchInstalledPlugins(): Promise<IInstalledPlugin[]> {
  const res = await window.fetch('/plugins.json');
  if (!res.ok) return [];
  return res.json();
}

export default function PluginStore() {
  const { t } = useTranslation('translation', { keyPrefix: 'pluginStore' });
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedPluginId, setSelectedPluginId] = useState<string | null>(null);
  const [selectedPluginMeta, setSelectedPluginMeta] =
    useState<IPluginMeta | null>(null);
  const [installedPlugins, setInstalledPlugins] = useState<IInstalledPlugin[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPlugins, setFilteredPlugins] =
    useState<IPluginMeta[]>(availablePlugins);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Debounced search handler
  const debouncedSearch = useDebounce<string>((value: string) => {
    setSearchTerm(value);
  }, 300);

  // Load installed plugins on mount
  useEffect(() => {
    document.title = t('title');
    fetchInstalledPlugins().then(setInstalledPlugins);
  }, [t]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredPlugins(availablePlugins);
    } else {
      setFilteredPlugins(
        availablePlugins.filter(
          (plugin) =>
            plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plugin.description.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      );
    }
  }, [searchTerm]);

  // Reset to first page if search/filter changes
  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

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

  // Check if plugin is installed
  const isInstalled = (pluginName: string): boolean =>
    installedPlugins.some((p) => p.name === pluginName);

  // Get installed plugin info
  const getInstalledPlugin = (
    pluginName: string,
  ): IInstalledPlugin | undefined =>
    installedPlugins.find((p) => p.name === pluginName);

  // Install plugin (simulate file creation and update plugins.json)
  const installPlugin = async (plugin: IPluginMeta) => {
    setLoading(true);
    await window.fetch('/api/install-plugin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plugin }),
    });
    const updated = await fetchInstalledPlugins();
    setInstalledPlugins(updated);
    setLoading(false);
  };

  // Activate/deactivate plugin
  const togglePluginStatus = async (
    plugin: IPluginMeta,
    status: 'active' | 'inactive',
  ) => {
    setLoading(true);
    await window.fetch('/api/toggle-plugin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plugin, status }),
    });
    const updated = await fetchInstalledPlugins();
    setInstalledPlugins(updated);
    setLoading(false);
  };

  // Uninstall plugin
  const uninstallPlugin = async (plugin: IPluginMeta) => {
    setLoading(true);
    await window.fetch('/api/uninstall-plugin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plugin }),
    });
    const updated = await fetchInstalledPlugins();
    setInstalledPlugins(updated);
    setLoading(false);
    closeModal();
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
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          marginTop: 24,
        }}
      >
        {paginatedPlugins.map((plugin) => {
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
                border: installed ? '2px solid #4caf50' : '1px solid #e7e7e7',
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
                  variant="primary"
                  onClick={() => openPlugin(plugin)}
                  className="w-100 mb-2"
                >
                  {installed ? 'Manage' : 'View'}
                </Button>
                {installed && (
                  <div
                    className="text-success text-center"
                    style={{ fontSize: 12 }}
                  >
                    Installed
                  </div>
                )}
              </div>
            </div>
          );
        })}
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
        loading={loading}
        isInstalled={isInstalled}
        getInstalledPlugin={getInstalledPlugin}
        installPlugin={installPlugin}
        togglePluginStatus={togglePluginStatus}
        uninstallPlugin={uninstallPlugin}
      />
    </div>
  );
}
