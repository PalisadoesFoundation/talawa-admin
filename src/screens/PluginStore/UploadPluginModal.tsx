/**
 * Modal component for uploading and installing new plugins.
 * Handles ZIP file upload, manifest validation, and plugin installation.
 */
import React, { useRef, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from '@mui/material';
import { FaUpload, FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
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
        toast.success(
          `Plugin uploaded successfully! (${components} components) - You can now install it from the plugin list.`,
        );
        onHide();
      } else {
        toast.error(result.error || 'Failed to upload plugin');
      }
    } catch (error) {
      console.error('Failed to upload plugin:', error);
      toast.error('Failed to upload plugin. Please try again.');
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
      <div
        style={{
          position: 'relative',
          display: 'flex',
          minHeight: 500,
          background: '#fff',
          borderRadius: 12,
        }}
      >
        {/* Left Panel - Upload */}
        <div
          style={{
            width: '50%',
            padding: 32,
            borderRight: '1px solid #e7e7e7',
          }}
        >
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ margin: 0, marginBottom: 8 }}>Upload Plugin</h3>
            <p style={{ margin: 0, color: '#666', fontSize: 14 }}>
              Upload a ZIP file to create a plugin entry. The plugin will be
              available for installation after upload.
            </p>
          </div>

          <div
            style={{
              border: '2px dashed #ddd',
              borderRadius: 12,
              padding: 40,
              textAlign: 'center',
              background: '#fafafa',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onClick={handleUploadClick}
          >
            <FaUpload
              style={{ fontSize: 48, color: '#ccc', marginBottom: 16 }}
            />
            <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>
              {selectedFile ? selectedFile.name : 'Select ZIP file'}
            </div>
            <div style={{ fontSize: 14, color: '#666' }}>
              Click to browse files
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".zip"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />

          {error && (
            <div
              style={{
                marginTop: 16,
                padding: 12,
                background: '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: 8,
                color: '#856404',
                fontSize: 14,
              }}
            >
              <FaExclamationTriangle style={{ marginRight: 8 }} />
              {error}
            </div>
          )}

          {manifest && pluginStructure && (
            <div style={{ marginTop: 24 }}>
              <h5 style={{ margin: 0, marginBottom: 16 }}>
                Plugin Information
              </h5>
              <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                <div style={{ marginBottom: 8 }}>
                  <strong>Name:</strong> {manifest.name}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <strong>Version:</strong> {manifest.version}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <strong>Author:</strong> {manifest.author}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <strong>Description:</strong> {manifest.description}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <strong>Plugin ID:</strong> {manifest.pluginId}
                </div>

                {/* Show detected components */}
                <div style={{ marginTop: 16 }}>
                  <strong>Components to Install:</strong>
                  <div style={{ marginTop: 8 }}>
                    {pluginStructure.hasAdminFolder && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: 4,
                        }}
                      >
                        <FaCheck style={{ color: '#28a745', marginRight: 8 }} />
                        <span>Admin Dashboard Components</span>
                      </div>
                    )}
                    {pluginStructure.hasApiFolder && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: 4,
                        }}
                      >
                        <FaCheck style={{ color: '#28a745', marginRight: 8 }} />
                        <span>API Backend Components</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: 32 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddPlugin}
              disabled={!selectedFile || !manifest || isInstalling}
              style={{ width: '100%' }}
              data-testid="upload-plugin-button"
            >
              {isInstalling ? 'Uploading...' : 'Upload Plugin'}
            </Button>
          </div>
        </div>

        {/* Right Panel - Plugin Structure */}
        <div style={{ width: '50%', padding: 32 }}>
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ margin: 0, marginBottom: 8 }}>Plugin Structure</h3>
            <p style={{ margin: 0, color: '#666', fontSize: 14 }}>
              Expected plugin structure with admin and/or API components
            </p>
          </div>

          {pluginFiles.length > 0 ? (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}>
                Detected Files
              </div>
              <div style={{ fontSize: 14, color: '#666' }}>
                <pre
                  style={{
                    background: '#f8f9fa',
                    padding: 16,
                    borderRadius: 8,
                    fontSize: 13,
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {pluginFiles.join('\n')}
                </pre>
              </div>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 24 }}>
                <div
                  style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}
                >
                  Expected Directory Structure
                </div>
                <div style={{ fontSize: 14, color: '#666' }}>
                  <pre
                    style={{
                      background: '#f8f9fa',
                      padding: 16,
                      borderRadius: 8,
                      fontSize: 13,
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
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
                <div
                  style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}
                >
                  Required manifest.json Fields
                </div>
                <div style={{ fontSize: 14, color: '#666' }}>
                  <pre
                    style={{
                      background: '#f8f9fa',
                      padding: 16,
                      borderRadius: 8,
                      fontSize: 13,
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
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
