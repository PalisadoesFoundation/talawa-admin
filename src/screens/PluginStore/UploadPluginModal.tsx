/**
 * Modal component for uploading and installing new plugins.
 * Handles ZIP file upload, manifest validation, and plugin installation.
 */
import React, { useRef, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from '@mui/material';
import { FaUpload, FaExclamationTriangle } from 'react-icons/fa';
import JSZip from 'jszip';
import { useCreatePlugin } from '../../plugin/graphql-service';
import { toast } from 'react-toastify';
import pluginManager from '../../plugin/manager';

interface UploadPluginModalProps {
  show: boolean;
  onHide: () => void;
}

interface PluginManifest {
  name: string;
  version: string;
  description: string;
  author: string;
  main: string;
  pluginId: string;
  extensionPoints?: {
    routes?: Array<{
      pluginId: string;
      path: string;
      component: string;
      exact: boolean;
    }>;
  };
}

const UploadPluginModal: React.FC<UploadPluginModalProps> = ({
  show,
  onHide,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [manifest, setManifest] = useState<PluginManifest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pluginFiles, setPluginFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [createPlugin] = useCreatePlugin();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setManifest(null);
      setPluginFiles([]);

      try {
        const zip = new JSZip();
        const zipContent = await zip.loadAsync(file);

        // Get all file paths and filter out hidden/system files
        const files = Object.keys(zipContent.files).filter((file) => {
          const isHidden = file.split('/').some((part) => part.startsWith('.'));
          const isSystemDir = file
            .split('/')
            .some((part) => part.startsWith('__'));
          return !isHidden && !isSystemDir;
        });

        // Organize files into a tree structure
        const fileTree = files.reduce((tree: any, file) => {
          const parts = file.split('/');
          let current = tree;

          parts.forEach((part, index) => {
            if (!current[part]) {
              current[part] = index === parts.length - 1 ? null : {};
            }
            if (index < parts.length - 1) {
              current = current[part];
            }
          });

          return tree;
        }, {});

        // Convert tree to display format
        const formatTree = (
          tree: any,
          prefix = '',
          isLast = true,
        ): string[] => {
          const entries = Object.entries(tree);
          return entries.flatMap(([name, children], index) => {
            const isLastEntry = index === entries.length - 1;
            const currentPrefix = prefix + (isLast ? '    ' : '│   ');
            const connector = isLastEntry ? '└── ' : '├── ';

            if (children === null) {
              return [`${prefix}${connector}${name}`];
            }

            return [
              `${prefix}${connector}${name}/`,
              ...formatTree(children, currentPrefix, isLastEntry),
            ];
          });
        };

        const formattedFiles = formatTree(fileTree);
        setPluginFiles(formattedFiles);

        // Check if manifest.json exists
        const manifestFile = zipContent.file('manifest.json');
        if (!manifestFile) {
          throw new Error('manifest.json not found in the plugin ZIP');
        }

        // Read and parse manifest.json
        const manifestContent = await manifestFile.async('string');
        const manifestData = JSON.parse(manifestContent) as PluginManifest;

        // Validate required fields
        const requiredFields = [
          'name',
          'version',
          'description',
          'author',
          'main',
        ];
        const missingFields = requiredFields.filter(
          (field) => !manifestData[field as keyof PluginManifest],
        );

        if (missingFields.length > 0) {
          throw new Error(
            `Missing required fields in manifest.json: ${missingFields.join(', ')}`,
          );
        }

        setManifest(manifestData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to parse plugin ZIP',
        );
        setManifest(null);
        setPluginFiles([]);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddPlugin = async () => {
    if (!manifest) return;

    try {
      // Create plugin in GraphQL
      await createPlugin({
        variables: {
          input: {
            pluginId: manifest.pluginId,
          },
        },
      });

      // Load the plugin through plugin manager
      const success = await pluginManager.loadPlugin(manifest.pluginId);
      if (!success) {
        throw new Error('Failed to load plugin');
      }

      toast.success('Plugin added successfully!');
      onHide();
    } catch (error) {
      console.error('Failed to add plugin:', error);
      toast.error('Failed to add plugin. Please try again.');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered dialogClassName="modal-xl">
      <div
        style={{
          position: 'relative',
          display: 'flex',
          minHeight: 500,
          background: '#fff',
          borderRadius: 12,
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          aria-label="Close"
          onClick={onHide}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 10,
            background: 'none',
            border: 'none',
            fontSize: 28,
            color: '#888',
            cursor: 'pointer',
            lineHeight: 1,
          }}
        >
          &times;
        </button>

        {/* Left Section - Upload */}
        <div
          style={{
            width: 320,
            background: '#f8f9fa',
            color: '#222',
            padding: 32,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
            borderRight: '1px solid #e7e7e7',
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 22,
              marginBottom: 24,
              textAlign: 'center',
            }}
          >
            Upload Plugin
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".zip"
            style={{ display: 'none' }}
          />

          <Button
            variant="contained"
            color={selectedFile ? 'inherit' : 'primary'}
            onClick={handleUploadClick}
            startIcon={<FaUpload />}
            sx={{
              width: '100%',
              height: '38px',
              fontSize: '14px',
              fontWeight: 500,
              boxShadow: 'none',
              border: '1px solid #dee2e6',
              marginBottom: 4,
              textTransform: 'none',
              bgcolor: selectedFile ? '#e9ecef' : undefined,
              color: selectedFile ? '#495057' : undefined,
              '&:hover': {
                bgcolor: selectedFile ? '#dee2e6' : undefined,
              },
            }}
          >
            {selectedFile ? selectedFile.name : 'Select ZIP File'}
          </Button>

          {error && (
            <div
              style={{
                fontSize: 14,
                color: '#dc3545',
                textAlign: 'center',
                padding: 12,
                background: '#fff',
                borderRadius: 8,
                border: '1px solid #dc3545',
                width: '100%',
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>
              <p style={{ marginBottom: 20 }}>
                Talawa plugins extend the functionality of your organization's
                portal. Browse our collection of official and community plugins
                at{' '}
                <a
                  href="https://github.com/PalisadoesFoundation/talawa-plugin"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#0d6efd', textDecoration: 'none' }}
                >
                  GitHub
                </a>
                .
              </p>
              <div style={{ marginBottom: 12 }}>
                <strong style={{ color: '#444' }}>Before uploading:</strong>
                <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
                  <li>
                    Ensure your plugin follows the directory structure shown in
                    the right section
                  </li>
                  <li>
                    Include a valid manifest.json file with all required fields
                  </li>
                  <li>
                    Zip the entire plugin directory (not just its contents)
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: '#dc3545',
                marginBottom: 16,
              }}
            >
              <FaExclamationTriangle />
              <div style={{ fontWeight: 600, fontSize: 16 }}>
                Security Warning
              </div>
            </div>
            <div style={{ color: '#666', fontSize: 14, lineHeight: 1.5 }}>
              Only install plugins from trusted sources. Talawa is not
              responsible for any consequences arising from the use of
              third-party plugins. Plugins have access to your organization's
              data and can potentially compromise security.
            </div>
          </div>
        </div>

        {/* Right Section - Plugin Info or Guidelines */}
        <div
          style={{
            flex: 1,
            background: '#fff',
            color: '#222',
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
            padding: 32,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {manifest ? (
            <>
              <div
                style={{
                  width: '100%',
                  background: '#fff',
                  borderRadius: 8,
                  padding: 16,
                  border: '1px solid #e7e7e7',
                  marginBottom: 16,
                }}
              >
                <div
                  style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}
                >
                  Plugin Information
                </div>
                <div style={{ fontSize: 14, color: '#555' }}>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ fontWeight: 500 }}>Plugin ID:</span>{' '}
                    {manifest.pluginId}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ fontWeight: 500 }}>Name:</span>{' '}
                    {manifest.name}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ fontWeight: 500 }}>Version:</span>{' '}
                    {manifest.version}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ fontWeight: 500 }}>Author:</span>{' '}
                    {manifest.author}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ fontWeight: 500 }}>Description:</span>{' '}
                    {manifest.description}
                  </div>
                  {manifest.extensionPoints?.routes && (
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ fontWeight: 500 }}>Routes:</span>
                      <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
                        {manifest.extensionPoints.routes.map((route, index) => (
                          <li key={index} style={{ fontSize: 13 }}>
                            {route.path} ({route.component})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div style={{ marginTop: 16 }}>
                    <span style={{ fontWeight: 500 }}>Plugin Files:</span>
                    <div
                      style={{
                        background: '#f8f9fa',
                        padding: 12,
                        borderRadius: 6,
                        marginTop: 8,
                        fontSize: 13,
                        fontFamily: 'monospace',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        whiteSpace: 'pre',
                      }}
                    >
                      {pluginFiles.map((file, index) => (
                        <div
                          key={index}
                          style={{
                            padding: '2px 0',
                            color: file.endsWith('.json')
                              ? '#0d6efd'
                              : file.endsWith('.ts') || file.endsWith('.tsx')
                                ? '#198754'
                                : file.endsWith('/')
                                  ? '#6c757d'
                                  : '#212529',
                          }}
                        >
                          {file}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  width: '100%',
                  marginTop: 16,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddPlugin}
                  sx={{
                    flex: 1,
                    height: '38px',
                    fontSize: '14px',
                    fontWeight: 500,
                    boxShadow: 'none',
                    border: '1px solid #dee2e6',
                    textTransform: 'none',
                  }}
                >
                  Add Plugin
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    setSelectedFile(null);
                    setManifest(null);
                    setError(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  sx={{
                    flex: 1,
                    height: '38px',
                    fontSize: '14px',
                    fontWeight: 500,
                    boxShadow: 'none',
                    border: '1px solid #dc3545',
                    textTransform: 'none',
                  }}
                >
                  Discard
                </Button>
              </div>
            </>
          ) : (
            <>
              <div style={{ marginBottom: 24 }}>
                <div
                  style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}
                >
                  Plugin Directory Structure
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
                    {`plugin-name/
├── manifest.json    
├── index.ts        
└── pages/           
    ├── TodoList.tsx
    └── TodoListManage.tsx`}
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
  "pluginId": "plugin-id",
  "version": "1.0.0",
  "description": "Plugin description",
  "author": "Author Name",
  "main": "index.ts",
  "extensionPoints": {
    "routes": [
      {
        "pluginId": "plugin-id",
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
