/**
 * Modal component for uploading and installing new plugins.
 * Handles ZIP file upload, manifest validation, and plugin installation.
 */
import React, { useRef, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from '@mui/material';
import styles from '../../style/app-fixed.module.css';
import { useTranslation } from 'react-i18next';
import { FaUpload, FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
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
} from '../../utils/adminPluginInstaller';

interface IUploadPluginModalProps {
  show: boolean;
  onHide: () => void;
}

const UploadPluginModal: React.FC<IUploadPluginModalProps> = ({
  show,
  onHide,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'common' });
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
          err instanceof Error ? err.message : 'Failed to parse plugin ZIP',
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
        NotificationToast.success(
          `Plugin uploaded successfully! (${components} components) - You can now install it from the plugin list.`,
        );
        onHide();
      } else {
        NotificationToast.error(result.error || 'Failed to upload plugin');
      }
    } catch {
      NotificationToast.error('Failed to upload plugin. Please try again.');
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
    <Modal show={show} onHide={handleClose} centered dialogClassName="modal-xl">
      <div className={styles.modalContainer}>
        {/* Left Panel - Upload */}
        <div className={styles.leftPanel}>
          <div className={styles.headerSection}>
            <h3>Upload Plugin</h3>
            <p>
              Upload a ZIP file to create a plugin entry. The plugin will be
              available for installation after upload.
            </p>
          </div>

          <div className={styles.uploadArea} onClick={handleUploadClick}>
            <FaUpload className={styles.uploadIcon} />
            <div className={styles.uploadText}>
              {selectedFile ? selectedFile.name : 'Select ZIP file'}
            </div>
            <div className={styles.uploadSubText}>Click to browse files</div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".zip"
            className={styles.hiddenInput}
            onChange={handleFileSelect}
          />

          {error && (
            <div className={styles.errorContainer}>
              <FaExclamationTriangle className={styles.errorIcon} />
              {error}
            </div>
          )}

          {manifest && pluginStructure && (
            <div className={styles.pluginInfoSection}>
              <h5>Plugin Information</h5>
              <div className={styles.pluginInfoDetails}>
                <div className={styles.infoRow}>
                  <strong>Name:</strong> {manifest.name}
                </div>
                <div className={styles.infoRow}>
                  <strong>Version:</strong> {manifest.version}
                </div>
                <div className={styles.infoRow}>
                  <strong>Author:</strong> {manifest.author}
                </div>
                <div className={styles.infoRow}>
                  <strong>Description:</strong> {manifest.description}
                </div>
                <div className={styles.infoRow}>
                  <strong>Plugin ID:</strong> {manifest.pluginId}
                </div>

                {/* Show detected components */}
                <div className={styles.componentList}>
                  <strong>Components to Install:</strong>
                  <div className={styles.componentListContainer}>
                    {pluginStructure.hasAdminFolder && (
                      <div className={styles.componentItem}>
                        <FaCheck className={styles.successIcon} />
                        <span>Admin Dashboard Components</span>
                      </div>
                    )}
                    {pluginStructure.hasApiFolder && (
                      <div className={styles.componentItem}>
                        <FaCheck className={styles.successIcon} />
                        <span>API Backend Components</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={styles.buttonGroup}>
            <Button
              variant="outlined"
              color="secondary"
              className={`${styles.cancelButton} ${styles.flexButton}`}
              onClick={handleClose}
              disabled={isInstalling}
              aria-label={t('cancelUploadPlugin')}
              data-testid="cancel-upload-plugin-button"
            >
              {t('cancel')}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddPlugin}
              disabled={!selectedFile || !manifest || isInstalling}
              aria-label={isInstalling ? t('uploading') : t('uploadPlugin')}
              className={styles.flexButton}
              data-testid="upload-plugin-button"
            >
              {isInstalling ? t('uploading') : t('uploadPlugin')}
            </Button>
          </div>
        </div>

        {/* Right Panel - Plugin Structure */}
        <div className={styles.rightPanel}>
          <div className={styles.headerSection}>
            <h3>Plugin Structure</h3>
            <p>Expected plugin structure with admin and/or API components</p>
          </div>

          {pluginFiles.length > 0 ? (
            <div className={styles.codeBlockContainer}>
              <div className={styles.codeBlockTitle}>Detected Files</div>
              <div className={styles.uploadSubText}>
                <pre className={styles.codeBlockPre}>
                  {pluginFiles.join('\n')}
                </pre>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.codeBlockContainer}>
                <div className={styles.codeBlockTitle}>
                  Expected Directory Structure
                </div>
                <div className={styles.uploadSubText}>
                  <pre className={styles.codeBlockPre}>
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
                <div className={styles.codeBlockTitle}>
                  Required manifest.json Fields
                </div>
                <div className={styles.uploadSubText}>
                  <pre className={styles.codeBlockPre}>
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
      </div>
    </Modal>
  );
};

export default UploadPluginModal;
