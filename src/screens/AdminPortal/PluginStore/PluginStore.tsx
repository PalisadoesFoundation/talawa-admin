/**
 * A marketplace interface for browsing, installing, and managing Talawa plugins.
 * Provides functionality to search, filter, and paginate through available plugins,
 * with options to install, uninstall, and toggle plugin status.
 */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PluginModal from './PluginModal';
import UploadPluginModal from './UploadPluginModal';
import { PluginList, UninstallConfirmationModal } from './components';
import { usePluginActions, usePluginFilters } from './hooks';
import { useGetAllPlugins } from 'plugin/graphql-service';
import type { IPluginMeta } from 'plugin';
import { useModalState } from 'shared-components/CRUDModalTemplate';

export default function PluginStore() {
  const { t } = useTranslation('translation', { keyPrefix: 'pluginStore' });
  const pluginModal = useModalState();
  const uploadModal = useModalState();
  const [selectedPluginId, setSelectedPluginId] = useState<string | null>(null);
  const [selectedPluginMeta, setSelectedPluginMeta] =
    useState<IPluginMeta | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const {
    data: pluginData,
    loading: pluginLoading,
    error: pluginError,
    refetch,
  } = useGetAllPlugins();

  const {
    searchTerm,
    filteredPlugins,
    filterState,
    debouncedSearch,
    handleFilterChange,
    isInstalled,
    getInstalledPlugin,
  } = usePluginFilters({ pluginData });

  const {
    loading,
    showUninstallModal,
    pluginToUninstall,
    handleInstallPlugin,
    togglePluginStatus,
    uninstallPlugin,
    handleUninstallConfirm,
    closeUninstallModal,
  } = usePluginActions({ pluginData, refetch });

  useEffect(() => {
    if (pluginError) {
      console.error('Failed to fetch plugins via GraphQL:', pluginError);
    }
  }, [pluginError]);

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
    pluginModal.open();
  };

  // Close modal
  const closePluginModal = () => {
    pluginModal.close();
    setSelectedPluginId(null);
    setSelectedPluginMeta(null);
  };

  // Close upload modal
  const closeUploadModal = async () => {
    uploadModal.close();
    await refetch();
  };

  const pluginStoreDropdowns = [
    {
      id: 'plugin-store-filter-dropdown',
      label: t('filterPlugins'),
      type: 'filter' as const,
      options: [
        { label: t('allPlugins'), value: 'all' },
        { label: t('installedPlugins'), value: 'installed' },
      ],
      selectedOption: filterState.selectedOption,
      onOptionChange: handleFilterChange,
      dataTestIdPrefix: 'filterPlugins',
      dropdownTestId: 'filter',
    },
  ];

  const uploadPluginButton = (
    <button
      className="btn btn-primary"
      onClick={uploadModal.open}
      data-testid="uploadPluginBtn"
    >
      + {t('uploadPlugin')}
    </button>
  );

  return (
    <div data-testid="plugin-store-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">{t('title')}</h1>
          <p className="page-subtitle">{t('subtitle')}</p>
        </div>
      </div>

      <div className="grid-3">
        <PluginList
          plugins={paginatedPlugins}
          searchTerm={searchTerm}
          filterOption={filterState.option}
          onManagePlugin={openPlugin}
        />
      </div>

      {/* Plugin Details Modal */}
      <PluginModal
        show={pluginModal.isOpen}
        onHide={closePluginModal}
        pluginId={selectedPluginId}
        meta={selectedPluginMeta}
        loading={loading || pluginLoading}
        isInstalled={isInstalled}
        getInstalledPlugin={getInstalledPlugin}
        installPlugin={handleInstallPlugin}
        togglePluginStatus={togglePluginStatus}
        uninstallPlugin={uninstallPlugin}
        data-testid="plugin-modal"
      />
      {/* Upload Plugin Modal */}
      <UploadPluginModal
        show={uploadModal.isOpen}
        onHide={closeUploadModal}
        data-testid="upload-plugin-modal"
      />
      {/* Uninstall Confirmation Modal */}
      <UninstallConfirmationModal
        show={showUninstallModal}
        onClose={closeUninstallModal}
        onConfirm={handleUninstallConfirm}
        plugin={pluginToUninstall}
      />
    </div>
  );
}
