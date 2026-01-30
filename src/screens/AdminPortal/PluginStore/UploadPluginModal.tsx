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
} from '../../../utils/adminPluginInstaller';
import { useTranslation } from 'react-i18next';

interface IUploadPluginModalProps {
  show: boolean;
  onHide: () => void;
}

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
        // Validate the plugin zip structure
        const structure = await validateAdminPluginZip(file);

        if (!structure.hasAdminFolder && !structure.hasApiFolder) {
          throw new Error(
            "Zip file must contain either 'admin' or 'api' folder with valid plugin structure",
          );
        }

        // Format files for display
        const filesList: string[] = [];

        if (structure.hasAdminFolder) {
          filesList.push('admin/');
          Object.keys(structure.files).forEach((file) => {
            filesList.push(`    ${file}`);
          });
        }

        if (structure.hasApiFolder) {
          filesList.push('api/');
          structure.apiFiles?.forEach((file) => {
            filesList.push(`    ${file}`);
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
      size="xl"
      showFooter={false}
      className={styles.container}
    >
      {/* Left Panel - Upload */}
      <div className={`${styles.panel} ${styles.leftPanel}`}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>{t('uploadPlugin')}</h3>
          <p className={styles.sectionDescription}>
            {t('uploadPluginDescription')}
          </p>
        </div>

        <button
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
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".zip"
          className={styles.hiddenInput}
          onChange={handleFileSelect}
        />

        {error && (
          <div className={styles.errorBox}>
            <FaExclamationTriangle className={styles.inlineIcon} />
            {error}
          </div>
        )}

        {manifest && pluginStructure && (
          <div className={styles.pluginInfoSection}>
            <h5 className={styles.pluginInfoTitle}>{t('pluginInfo')}</h5>
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
              <div className={styles.infoRow}>
                <strong>{t('pluginId')}:</strong> {manifest.pluginId}
              </div>

              {/* Show detected components */}
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

      {/* Right Panel - Plugin Structure */}
      <div className={styles.panel}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>{t('pluginStructure')}</h3>
          <p className={styles.sectionDescription}>
            {t('pluginStructureDescription')}
          </p>
        </div>

        {pluginFiles.length > 0 ? (
          <div className={styles.codeSection}>
            <div className={styles.codeHeading}>{t('detectedFiles')}</div>
            <div className={styles.codeText}>
              <pre className={styles.codeBlock}>{pluginFiles.join('\n')}</pre>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.codeSection}>
              <div className={styles.codeHeading}>
                {t('expectedDirectoryStructure')}
              </div>
              <div className={styles.codeText}>
                <pre className={styles.codeBlock}>
                  {`plugin.zip
                  ├── admin/ (optional)
                  │   ├── manifest.json    
                  │   ├── index.tsx        
                  │   └── pages/           
                  │       ├── ComponentA.tsx
                  │       └── ComponentB.tsx
                  └── api/ (optional)
                      ├── manifest.json
                      ├── index.ts
                      └── graphql/
                          └── resolvers.ts`}
                </pre>
              </div>
            </div>

            <div>
              <div className={styles.codeHeading}>
                {t('requiredManifestFields')}
              </div>
              <div className={styles.codeText}>
                <pre className={styles.codeBlock}>
                  {`{
                    "name": "Plugin Name",
                    "pluginId": "pluginName",
                    "version": "1.0.0",
                    "description": "Plugin description",
                    "author": "Author Name",
                    "main": "index.tsx",
                    "extensionPoints": {
                      "routes": [
                        {
                          "pluginId": "pluginName",
                          "path": "/plugin-path",
                          "component": "ComponentName",
                          "exact": true
                        }
                      ]
                    }
                  }`}
                </pre>
              </div>
            </div>
          </>
        )}
      </div>
    </CRUDModalTemplate>
  );
};

export default UploadPluginModal;
