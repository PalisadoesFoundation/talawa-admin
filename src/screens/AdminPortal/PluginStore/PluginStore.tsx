/**
 * Plugin Store — browse, configure, and upload plugins.
 *
 * Single-page layout:
 *   - Plugin card grid with search/filter (top)
 *   - Upload section with file-structure reference (bottom, always visible)
 *   - Detail view replaces the page when a plugin is selected
 */
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaUpload, FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import { PluginList, UninstallConfirmationModal } from './components';
import { usePluginActions, usePluginFilters } from './hooks';
import { useGetAllPlugins } from 'plugin/graphql-service';
import type { IPluginMeta } from 'plugin';
import { Button } from 'shared-components/Button';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import {
  useApolloClient,
  type ApolloClient,
  type NormalizedCacheObject,
} from '@apollo/client';
import {
  installAdminPluginFromZip,
  validateAdminPluginZip,
  type IAdminPluginManifest,
  type IAdminPluginZipStructure,
} from 'utils/adminPluginInstaller';
import PluginDetailView from './PluginDetailView';
import styles from './PluginStore.module.css';

const STRUCTURE = `plugin.zip
├── admin/              (optional)
│   ├── manifest.json
│   ├── index.tsx
│   └── pages/
│       ├── ComponentA.tsx
│       └── ComponentB.tsx
└── api/                (optional)
    ├── manifest.json
    ├── index.ts
    └── graphql/
        └── resolvers.ts`;

const MANIFEST = `{
  "name": "Plugin Name",
  "pluginId": "pluginName",
  "version": "1.0.0",
  "description": "What the plugin does",
  "author": "Author Name",
  "main": "index.tsx",
  "extensionPoints": {
    "routes": [{
      "pluginId": "pluginName",
      "path": "/plugin-path",
      "component": "ComponentName",
      "exact": true
    }]
  }
}`;

export default function PluginStore() {
  const { t } = useTranslation('translation', { keyPrefix: 'pluginStore' });
  const { t: tCommon } = useTranslation('common');
  const [selectedPlugin, setSelectedPlugin] = useState<IPluginMeta | null>(
    null,
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [manifest, setManifest] = useState<IAdminPluginManifest | null>(null);
  const [zipStructure, setZipStructure] =
    useState<IAdminPluginZipStructure | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [detectedFiles, setDetectedFiles] = useState<string[]>([]);
  const [isInstalling, setIsInstalling] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const apolloClient = useApolloClient();

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

  useEffect(() => {
    setPage(0);
  }, [searchTerm, filterState.option]);

  const paginatedPlugins = filteredPlugins.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );
  const totalPages = Math.ceil(filteredPlugins.length / rowsPerPage);

  // ── Upload handlers ──
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setUploadError(null);
    setManifest(null);
    setZipStructure(null);
    setDetectedFiles([]);

    try {
      const s = await validateAdminPluginZip(file);
      if (!s.hasAdminFolder && !s.hasApiFolder) {
        throw new Error(
          "ZIP must contain either an 'admin' or 'api' folder with a valid plugin structure.",
        );
      }
      const files: string[] = [];
      if (s.hasAdminFolder) {
        files.push('admin/');
        Object.keys(s.files).forEach((f) => files.push(`  ${f}`));
      }
      if (s.hasApiFolder) {
        files.push('api/');
        s.apiFiles?.forEach((f) => files.push(`  ${f}`));
      }
      setDetectedFiles(files);
      setZipStructure(s);
      setManifest(s.adminManifest || s.apiManifest || null);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : t('failedToParsePluginZip'),
      );
    }
  };

  const handleInstall = async () => {
    if (!selectedFile || !manifest || !zipStructure) return;
    setIsInstalling(true);
    try {
      const result = await installAdminPluginFromZip({
        zipFile: selectedFile,
        apolloClient: apolloClient as ApolloClient<NormalizedCacheObject>,
      });
      if (result.success) {
        NotificationToast.success(
          t('pluginUploadedSuccess', {
            components: result.installedComponents.join(' and '),
          }),
        );
        setSelectedFile(null);
        setManifest(null);
        setZipStructure(null);
        setDetectedFiles([]);
        await refetch();
      } else {
        NotificationToast.error(result.error || t('failedToUploadPlugin'));
      }
    } catch {
      NotificationToast.error(t('failedToUploadPlugin'));
    } finally {
      setIsInstalling(false);
    }
  };

  // ── Detail view (replaces page) ──
  if (selectedPlugin) {
    return (
      <div data-testid="plugin-store-page">
        <PluginDetailView
          plugin={selectedPlugin}
          loading={loading || pluginLoading}
          isInstalled={isInstalled}
          getInstalledPlugin={getInstalledPlugin}
          installPlugin={handleInstallPlugin}
          togglePluginStatus={togglePluginStatus}
          uninstallPlugin={uninstallPlugin}
          onBack={() => setSelectedPlugin(null)}
        />
        <UninstallConfirmationModal
          show={showUninstallModal}
          onClose={closeUninstallModal}
          onConfirm={handleUninstallConfirm}
          plugin={pluginToUninstall}
        />
      </div>
    );
  }

  // ── Main page ──
  return (
    <div data-testid="plugin-store-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">{t('title')}</h1>
          <p className="page-subtitle">{t('subtitle')}</p>
        </div>
      </div>

      {/* Toolbar: search + filter */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <svg
            className={styles.searchIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder={t('searchPlugins')}
            onChange={(e) => debouncedSearch(e.target.value)}
            data-testid="searchByName"
          />
        </div>
        <select
          className={styles.filterSelect}
          value={filterState.option}
          onChange={(e) => handleFilterChange(e.target.value)}
          data-testid="filter"
        >
          <option value="all">{t('allPlugins')}</option>
          <option value="installed">{t('installedPlugins')}</option>
        </select>
      </div>

      {/* Plugin cards grid */}
      <div className={styles.grid}>
        <PluginList
          plugins={paginatedPlugins}
          searchTerm={searchTerm}
          filterOption={filterState.option}
          onManagePlugin={(p) => setSelectedPlugin(p)}
        />
      </div>

      {/* Pagination */}
      {filteredPlugins.length > rowsPerPage && (
        <div className={styles.paginationRow}>
          <span>
            {t('showingPlugins', {
              start: page * rowsPerPage + 1,
              end: Math.min(
                (page + 1) * rowsPerPage,
                filteredPlugins.length,
              ),
              total: filteredPlugins.length,
            })}
          </span>
          <div className={styles.paginationControls}>
            <button
              className={styles.paginationBtn}
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
            >
              &lsaquo;
            </button>
            <span>
              {page + 1} / {totalPages}
            </span>
            <button
              className={styles.paginationBtn}
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages - 1}
            >
              &rsaquo;
            </button>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────── */}
      {/* Upload Plugin section — always visible         */}
      {/* ────────────────────────────────────────────── */}
      <div className={styles.uploadSection}>
        <div className={styles.uploadHeader}>
          <h2 className={styles.uploadTitle}>{t('uploadPlugin')}</h2>
          <p className={styles.uploadSubtitle}>
            {t('uploadPluginDescription')}
          </p>
        </div>

        <div className={styles.uploadColumns}>
          {/* Left: dropzone + parsed info */}
          <div className={styles.uploadLeft}>
            <button
              type="button"
              className={styles.dropzone}
              onClick={() => fileRef.current?.click()}
            >
              <FaUpload className={styles.dropzoneIcon} />
              <div className={styles.dropzoneTitle}>
                {selectedFile
                  ? selectedFile.name
                  : tCommon('selectAZipFile')}
              </div>
              <div className={styles.dropzoneHint}>
                {tCommon('clickToBrowseFile')}
              </div>
            </button>

            <input
              ref={fileRef}
              type="file"
              accept=".zip"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />

            {uploadError && (
              <div className={styles.errorBox}>
                <FaExclamationTriangle className={styles.errorIcon} />
                {uploadError}
              </div>
            )}

            {manifest && zipStructure && (
              <div className={styles.pluginInfo}>
                <div className={styles.pluginInfoHeader}>
                  {t('pluginInfo')}
                </div>
                <div className={styles.pluginInfoBody}>
                  <div className={styles.infoRow}>
                    <strong>{tCommon('name')}:</strong> {manifest.name}
                  </div>
                  <div className={styles.infoRow}>
                    <strong>{tCommon('version')}:</strong> {manifest.version}
                  </div>
                  <div className={styles.infoRow}>
                    <strong>{tCommon('author')}:</strong> {manifest.author}
                  </div>
                  <div className={styles.infoRow}>
                    <strong>{tCommon('description')}:</strong>{' '}
                    {manifest.description}
                  </div>
                  <div className={styles.componentsList}>
                    <strong>{t('componentsToInstall')}</strong>
                    {zipStructure.hasAdminFolder && (
                      <div className={styles.componentRow}>
                        <FaCheck className={styles.checkIcon} />
                        <span>{t('adminDashboardComponents')}</span>
                      </div>
                    )}
                    {zipStructure.hasApiFolder && (
                      <div className={styles.componentRow}>
                        <FaCheck className={styles.checkIcon} />
                        <span>{t('apiBackendComponents')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {detectedFiles.length > 0 && (
              <div className={styles.detectedFiles}>
                <div className={styles.refLabel}>{t('detectedFiles')}</div>
                <pre className={styles.codeBlockGreen}>
                  {detectedFiles.join('\n')}
                </pre>
              </div>
            )}

            <div className={styles.uploadBtnWrapper}>
              <Button
                variant="primary"
                onClick={handleInstall}
                disabled={!selectedFile || !manifest || isInstalling}
                fullWidth
                data-testid="upload-plugin-button"
              >
                {isInstalling ? t('uploading') : t('uploadPlugin')}
              </Button>
            </div>
          </div>

          {/* Right: reference guide */}
          <div className={styles.referencePanel}>
            <h3 className={styles.refTitle}>{t('pluginStructure')}</h3>
            <p className={styles.refSubtitle}>
              {t('pluginStructureDescription')}
            </p>

            <div className={styles.refSection}>
              <div className={styles.refLabel}>
                {t('expectedDirectoryStructure')}
              </div>
              <pre className={styles.codeBlock}>{STRUCTURE}</pre>
            </div>

            <div className={styles.refSection}>
              <div className={styles.refLabel}>
                {t('requiredManifestFields')}
              </div>
              <pre className={styles.codeBlock}>{MANIFEST}</pre>
            </div>
          </div>
        </div>
      </div>

      <UninstallConfirmationModal
        show={showUninstallModal}
        onClose={closeUninstallModal}
        onConfirm={handleUninstallConfirm}
        plugin={pluginToUninstall}
      />
    </div>
  );
}
