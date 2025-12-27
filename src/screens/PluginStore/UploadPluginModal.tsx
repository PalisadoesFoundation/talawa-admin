/**
 * Modal component for uploading and installing new plugins.
 * Handles ZIP file upload, manifest validation, and plugin installation.
 */
import React, { useRef, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from '@mui/material';
import { FaUpload, FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
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
} from '../../utils/adminPluginInstaller';

interface IUploadPluginModalProps {
  show: boolean;
  onHide: () => void;
}

const UploadPluginModal: React.FC<IUploadPluginModalProps> = ({
  show,
  onHide,
}) => {
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
    } catch (error) {
      console.error('Failed to upload plugin:', error);
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
      <div className={styles.container}>
        {/* Left Panel - Upload */}
        <div className={`${styles.panel} ${styles.leftPanel}`}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Upload Plugin</h3>
            <p className={styles.sectionDescription}>
              Upload a ZIP file to create a plugin entry. The plugin will be
              available for installation after upload.
            </p>
          </div>

          <div className={styles.dropzone} onClick={handleUploadClick}>
            <FaUpload className={styles.uploadIcon} />
            <div className={styles.dropzoneTitle}>
              {selectedFile ? selectedFile.name : 'Select ZIP file'}
            </div>
            <div className={styles.dropzoneHint}>Click to browse files</div>
          </div>

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
              <h5 className={styles.pluginInfoTitle}>Plugin Information</h5>
              <div className={styles.pluginInfoBody}>
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
                <div className={styles.componentsSection}>
                  <strong>Components to Install:</strong>
                  <div className={styles.componentsList}>
                    {pluginStructure.hasAdminFolder && (
                      <div className={styles.componentRow}>
                        <FaCheck className={styles.checkIcon} />
                        <span>Admin Dashboard Components</span>
                      </div>
                    )}
                    {pluginStructure.hasApiFolder && (
                      <div className={styles.componentRow}>
                        <FaCheck className={styles.checkIcon} />
                        <span>API Backend Components</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={styles.uploadButtonWrapper}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddPlugin}
              disabled={!selectedFile || !manifest || isInstalling}
              fullWidth
              data-testid="upload-plugin-button"
            >
              {isInstalling ? 'Uploading...' : 'Upload Plugin'}
            </Button>
          </div>
        </div>

        {/* Right Panel - Plugin Structure */}
        <div className={styles.panel}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Plugin Structure</h3>
            <p className={styles.sectionDescription}>
              Expected plugin structure with admin and/or API components
            </p>
          </div>

          {pluginFiles.length > 0 ? (
            <div className={styles.codeSection}>
              <div className={styles.codeHeading}>Detected Files</div>
              <div className={styles.codeText}>
                <pre className={styles.codeBlock}>{pluginFiles.join('\n')}</pre>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.codeSection}>
                <div className={styles.codeHeading}>
                  Expected Directory Structure
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
                  Required manifest.json Fields
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
      </div>
    </Modal>
  );
};

export default UploadPluginModal;
