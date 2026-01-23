/*
 * Copyright 2025 Palisadoes Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Toggles the visibility of the uninstall confirmation modal.
 * Sets the selected plugin for uninstallation.
 *
 * @param plugin - The plugin to be uninstalled (optional).
 */
/**
 * PluginStore Screen
 *
 * This screen displays the marketplace of available plugins.
 * It allows administrators to browse, install, and uninstall plugins
 * for the organization.
 *
 * @returns The rendered PluginStore screen.
 */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'shared-components/Button/Button';
import styles from './PluginStore.module.css';
import PaginationList from 'components/Pagination/PaginationList/PaginationList';
import PluginModal from './PluginModal';
import UploadPluginModal from './UploadPluginModal';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import PluginList from './components/PluginList';
import UninstallConfirmationModal from 'components/AdminPortal/PluginStore/components/UninstallConfirmationModal/UninstallConfirmationModal';
import { usePluginActions, usePluginFilters } from './hooks';
import { useGetAllPlugins } from 'plugin/graphql-service';
import type { IPluginMeta } from 'plugin';

export default function PluginStore() {
  const { t } = useTranslation('translation', { keyPrefix: 'pluginStore' });
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
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
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedPluginId(null);
    setSelectedPluginMeta(null);
  };

  // Close upload modal
  const closeUploadModal = async () => {
    setShowUploadModal(false);
    // Refresh plugin data after upload
    await refetch();
    // Reload the page to ensure all plugin states are properly updated
    window.location.reload();
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
    <Button
      className={`${styles.dropdown} ${styles.createorgdropdown}`}
      onClick={() => setShowUploadModal(true)}
      data-testid="uploadPluginBtn"
    >
      <i className={'fa fa-plus me-2'} />
      {t('uploadPlugin')}
    </Button>
  );

  return (
    <div className={styles.pageContent} data-testid="plugin-store-page">
      <SearchFilterBar
        searchPlaceholder={t('searchPlaceholder')}
        searchValue={searchTerm}
        onSearchChange={debouncedSearch}
        searchInputTestId="searchPlugins"
        searchButtonTestId="searchPluginsBtn"
        hasDropdowns={true}
        dropdowns={pluginStoreDropdowns}
        additionalButtons={uploadPluginButton}
      />
      <div className={styles.pluginListContainer}>
        <PluginList
          plugins={paginatedPlugins}
          searchTerm={searchTerm}
          filterOption={filterState.option}
          onManagePlugin={openPlugin}
        />
      </div>
      {/* Pagination Controls */}
      <div className={styles.paginationContainer}>
        <table>
          <tbody>
            <tr>
              <PaginationList
                count={filteredPlugins.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                data-testid="plugin-pagination"
              />
            </tr>
          </tbody>
        </table>
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
        installPlugin={handleInstallPlugin}
        togglePluginStatus={togglePluginStatus}
        uninstallPlugin={uninstallPlugin}
        data-testid="plugin-modal"
      />
      {/* Upload Plugin Modal */}
      <UploadPluginModal
        show={showUploadModal}
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
