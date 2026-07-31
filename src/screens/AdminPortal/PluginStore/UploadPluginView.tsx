/**
 * Inline upload view with side-by-side reference guide.
 * Left: upload form + parsed info.  Right: expected structure & manifest docs.
 */
import React, { useRef, useState } from 'react';
import { FaUpload, FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import Button from 'shared-components/Button';
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
import styles from './UploadPluginView.module.css';

interface IUploadPluginViewProps {
  onBack: () => void;
  onSuccess: () => void;
}

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
    "routes": [
      {
        "pluginId": "pluginName",
        "path": "/plugin-path",
        "component": "ComponentName",
        "exact": true
      }
    ]
  }
}`;

export default function UploadPluginView({
  onBack,
  onSuccess,
}: IUploadPluginViewProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'pluginStore' });
  const { t: tCommon } = useTranslation('common');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [manifest, setManifest] = useState<IAdminPluginManifest | null>(null);
  const [structure, setStructure] = useState<IAdminPluginZipStructure | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [detectedFiles, setDetectedFiles] = useState<string[]>([]);
  const [isInstalling, setIsInstalling] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const apolloClient = useApolloClient();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setError(null);
    setManifest(null);
    setStructure(null);
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
      setStructure(s);
      setManifest(s.adminManifest || s.apiManifest || null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t('failedToParsePluginZip'),
      );
    }
  };

  const handleInstall = async () => {
    if (!selectedFile || !manifest || !structure) return;
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
        onSuccess();
      } else {
        NotificationToast.error(result.error || t('failedToUploadPlugin'));
      }
    } catch {
      NotificationToast.error(t('failedToUploadPlugin'));
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <div>
      {/* Back */}
      <div className={styles.backRow}>
        <Button variant="plain" className={styles.backBtn} onClick={onBack}>
          <span>&larr;</span>
          {t('title')}
        </Button>
      </div>

      <h1 className={styles.title}>{t('uploadPlugin')}</h1>
      <p className={styles.subtitle}>{t('uploadPluginDescription')}</p>

      <div className={styles.columns}>
        {/* ── Left: upload form ── */}
        <div className={styles.uploadPanel}>
          <Button
            type="button"
            className={styles.dropzone}
            onClick={() => fileRef.current?.click()}
          >
            <FaUpload className={styles.dropzoneIcon} />
            <div className={styles.dropzoneTitle}>
              {selectedFile ? selectedFile.name : tCommon('selectAZipFile')}
            </div>
            <div className={styles.dropzoneHint}>
              {tCommon('clickToBrowseFile')}
            </div>
          </Button>

          <input
            ref={fileRef}
            type="file"
            accept=".zip"
            className={styles.hiddenInput}
            onChange={handleFileSelect}
          />

          {error && (
            <div className={styles.errorBox}>
              <FaExclamationTriangle className={styles.errorIcon} />
              {error}
            </div>
          )}

          {manifest && structure && (
            <div className={styles.pluginInfo}>
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

                <div className={styles.componentsList}>
                  <strong>{t('componentsToInstall')}</strong>
                  {structure.hasAdminFolder && (
                    <div className={styles.componentRow}>
                      <FaCheck className={styles.checkIcon} />
                      <span>{t('adminDashboardComponents')}</span>
                    </div>
                  )}
                  {structure.hasApiFolder && (
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
              <div className={styles.detectedLabel}>{t('detectedFiles')}</div>
              <pre className={styles.detectedCode}>
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

        {/* ── Right: reference guide ── */}
        <div className={styles.referencePanel}>
          <h2 className={styles.refTitle}>{t('pluginStructure')}</h2>
          <p className={styles.refSubtitle}>
            {t('pluginStructureDescription')}
          </p>

          <div className={styles.refSection}>
            <div className={styles.refLabel}>
              {t('expectedDirectoryStructure')}
            </div>
            <pre className={styles.codeBlock}>{STRUCTURE}</pre>
            <p className={styles.refNote}>
              Your ZIP must contain at least one of these folders.
            </p>
          </div>

          <div className={styles.refSection}>
            <div className={styles.refLabel}>{t('requiredManifestFields')}</div>
            <pre className={styles.codeBlock}>{MANIFEST}</pre>
            <p className={styles.refNote}>
              Each folder needs its own manifest.json with these fields.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
