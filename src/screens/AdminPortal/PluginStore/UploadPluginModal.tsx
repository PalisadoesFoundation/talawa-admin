/**
 * Modal component for uploading and installing new plugins.
 * Handles ZIP file upload, manifest validation, and plugin installation.
 */
import React, { useRef, useState } from 'react';
import { FaUpload, FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import { CRUDModalTemplate } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
import { Button } from 'shared-components/Button';
import styles from './UploadPluginModal.module.css';
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
import { useTranslation } from 'react-i18next';

interface IUploadPluginModalProps {
  show: boolean;
  onHide: () => void;
}

const EXPECTED_STRUCTURE = `plugin.zip
├── admin/          (optional)
│   ├── manifest.json
│   ├── index.tsx
│   └── pages/
│       ├── ComponentA.tsx
│       └── ComponentB.tsx
└── api/            (optional)
    ├── manifest.json
    ├── index.ts
    └── graphql/
        └── resolvers.ts`;

const MANIFEST_EXAMPLE = `{
  "name": "Plugin Name",
  "pluginId": "pluginName",
  "version": "1.0.0",
  "description": "Plugin description",
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

const UploadPluginModal: React.FC<IUploadPluginModalProps> = ({
  show,
  onHide,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'pluginStore' });
  const { t: tCommon } = useTranslation('common');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [manifest, setManifest] = useState<IAdminPluginManifest | null>(null);
  const [pluginStructure, setPluginStructure] =
    useState<IAdminPluginZipStructure | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pluginFiles, setPluginFiles] = useState<string[]>([]);
  const [isInstalling, setIsInstalling] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const apolloClient = useApolloClient();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setManifest(null);
      setPluginStructure(null);
      setPluginFiles([]);

      try {
        const structure = await validateAdminPluginZip(file);

        if (!structure.hasAdminFolder && !structure.hasApiFolder) {
          throw new Error(
            "Zip file must contain either 'admin' or 'api' folder with valid plugin structure",
          );
        }

        const filesList: string[] = [];
        if (structure.hasAdminFolder) {
          filesList.push('admin/');
          Object.keys(structure.files).forEach((file) => {
            filesList.push(`  ${file}`);
          });
        }
        if (structure.hasApiFolder) {
          filesList.push('api/');
          structure.apiFiles?.forEach((file) => {
            filesList.push(`  ${file}`);
          });
        }

        setPluginFiles(filesList);
        setPluginStructure(structure);
        setManifest(structure.adminManifest || structure.apiManifest || null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : t('failedToParsePluginZip'),
        );
        setManifest(null);
        setPluginStructure(null);
        setPluginFiles([]);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddPlugin = async () => {
    if (!selectedFile || !manifest || !pluginStructure) return;

    setIsInstalling(true);
    try {
      const result = await installAdminPluginFromZip({
        zipFile: selectedFile,
        apolloClient: apolloClient as ApolloClient<NormalizedCacheObject>,
      });

      if (result.success) {
        const components = result.installedComponents.join(' and ');
        NotificationToast.success(t('pluginUploadedSuccess', { components }));
        onHide();
      } else {
        NotificationToast.error(result.error || t('failedToUploadPlugin'));
      }
    } catch {
      NotificationToast.error(t('failedToUploadPlugin'));
    } finally {
      setIsInstalling(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setManifest(null);
    setPluginStructure(null);
    setError(null);
    setPluginFiles([]);
    setIsInstalling(false);
    onHide();
  };

  return (
    <CRUDModalTemplate
      open={show}
      onClose={handleClose}
      title={t('uploadPlugin')}
      size="lg"
      showFooter={false}
    >
      <div className={styles.content}>
        {/* Upload area */}
        <div className={styles.section}>
          <p className={styles.sectionDescription}>
            {t('uploadPluginDescription')}
          </p>
        </div>

        <Button
          type="button"
          className={styles.dropzone}
          onClick={handleUploadClick}
        >
          <FaUpload className={styles.uploadIcon} />
          <div className={styles.dropzoneTitle}>
            {selectedFile ? selectedFile.name : tCommon('selectAZipFile')}
          </div>
          <div className={styles.dropzoneHint}>
            {tCommon('clickToBrowseFile')}
          </div>
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".zip"
          className={styles.hiddenInput}
          onChange={handleFileSelect}
        />

        {/* Error */}
        {error && (
          <div className={styles.errorBox}>
            <FaExclamationTriangle className={styles.inlineIcon} />
            {error}
          </div>
        )}

        {/* Parsed plugin info */}
        {manifest && pluginStructure && (
          <div className={styles.pluginInfoSection}>
            <div className={styles.pluginInfoHeader}>{t('pluginInfo')}</div>
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

              <div className={styles.componentsSection}>
                <strong>{t('componentsToInstall')}</strong>
                <div className={styles.componentsList}>
                  {pluginStructure.hasAdminFolder && (
                    <div className={styles.componentRow}>
                      <FaCheck className={styles.checkIcon} />
                      <span>{t('adminDashboardComponents')}</span>
                    </div>
                  )}
                  {pluginStructure.hasApiFolder && (
                    <div className={styles.componentRow}>
                      <FaCheck className={styles.checkIcon} />
                      <span>{t('apiBackendComponents')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detected files or expected structure */}
        <div className={styles.structureSection}>
          {pluginFiles.length > 0 ? (
            <>
              <div className={styles.structureLabel}>{t('detectedFiles')}</div>
              <pre className={styles.codeBlock}>{pluginFiles.join('\n')}</pre>
            </>
          ) : (
            <>
              <div className={styles.structureLabel}>
                {t('expectedDirectoryStructure')}
              </div>
              <pre className={styles.codeBlock}>{EXPECTED_STRUCTURE}</pre>

              <div
                className={styles.structureLabel}
                style={{ marginTop: 16 }}
              >
                {t('requiredManifestFields')}
              </div>
              <pre className={styles.codeBlock}>{MANIFEST_EXAMPLE}</pre>
            </>
          )}
        </div>

        {/* Upload button */}
        <div className={styles.uploadButtonWrapper}>
          <Button
            variant="primary"
            onClick={handleAddPlugin}
            disabled={!selectedFile || !manifest || isInstalling}
            fullWidth
            data-testid="upload-plugin-button"
          >
            {isInstalling ? t('uploading') : t('uploadPlugin')}
          </Button>
        </div>
      </div>
    </CRUDModalTemplate>
  );
};

export default UploadPluginModal;
