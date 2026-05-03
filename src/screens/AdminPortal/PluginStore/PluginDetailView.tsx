/**
 * Inline plugin detail view — replaces the card grid when a plugin is selected.
 * Shows plugin info, features, changelog, and install/toggle/uninstall actions.
 */
import React, { useEffect, useState } from 'react';
import { FaPowerOff, FaTrash } from 'react-icons/fa';
import { AdminPluginFileService } from '../../../plugin/services/AdminPluginFileService';
import type { IPluginDetails, IPluginMeta, IInstalledPlugin } from 'plugin';
import { useTranslation } from 'react-i18next';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import StatusBadge from 'shared-components/StatusBadge/StatusBadge';
import styles from './PluginDetailView.module.css';

const TABS = ['details', 'features', 'changelog'] as const;
type TabType = (typeof TABS)[number];

interface IPluginDetailViewProps {
  plugin: IPluginMeta;
  loading: boolean;
  isInstalled: (name: string) => boolean;
  getInstalledPlugin: (name: string) => IInstalledPlugin | undefined;
  installPlugin: (meta: IPluginMeta) => Promise<void>;
  togglePluginStatus: (
    meta: IPluginMeta,
    status: 'active' | 'inactive',
  ) => Promise<void>;
  uninstallPlugin: (meta: IPluginMeta) => void;
  onBack: () => void;
}

function isImageUrl(icon: string | undefined): boolean {
  if (!icon) return false;
  return (
    icon.startsWith('http') ||
    icon.startsWith('/') ||
    icon.startsWith('data:')
  );
}

export default function PluginDetailView({
  plugin,
  loading,
  isInstalled,
  getInstalledPlugin,
  installPlugin,
  togglePluginStatus,
  uninstallPlugin,
  onBack,
}: IPluginDetailViewProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'pluginStore' });
  const { t: tCommon } = useTranslation('common');

  const [details, setDetails] = useState<IPluginDetails | null>(null);
  const [fetching, setFetching] = useState(false);
  const [tab, setTab] = useState<TabType>('details');

  useEffect(() => {
    setFetching(true);
    setTab('details');
    const loadDetails = async () => {
      try {
        const d = await AdminPluginFileService.getPluginDetails(plugin.id);
        setDetails(d);
      } catch {
        NotificationToast.error(t('errorInstalling'));
        setDetails(null);
      } finally {
        setFetching(false);
      }
    };
    loadDetails();
  }, [plugin.id]);

  const info = details || plugin;
  const installed = getInstalledPlugin(plugin.name);
  const isActive = installed?.status === 'active';

  const features =
    details?.features ||
    (details?.readme
      ? details.readme
          .split('Features:')[1]
          ?.split('\n')
          .filter((line) => line.trim().startsWith('-'))
          .map((line) => line.replace('-', '').trim())
      : []);
  const changelog = details?.changelog || [];

  return (
    <div>
      {/* Back button */}
      <div className={styles.backRow}>
        <button className={styles.backBtn} onClick={onBack}>
          <span className={styles.backArrow}>&larr;</span>
          {t('title')}
        </button>
      </div>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroIcon}>
          {isImageUrl(info.icon) ? (
            <img src={info.icon} alt={info.name} />
          ) : (
            <span>{info.icon || '\u{1F50C}'}</span>
          )}
        </div>
        <div className={styles.heroInfo}>
          <h1 className={styles.heroName}>{info.name}</h1>
          <div className={styles.heroAuthor}>
            {(info as IPluginDetails).author || 'Unknown author'}
          </div>
          {details && (
            <div className={styles.heroVersion}>v{details.version}</div>
          )}
          <div className={styles.heroActions}>
            {isInstalled(plugin.name) ? (
              <>
                <span className={styles.statusBadge}>
                  <StatusBadge
                    variant={isActive ? 'active' : 'inactive'}
                    size="md"
                    dataTestId="plugin-status-badge"
                    ariaLabel={isActive ? 'active' : 'inactive'}
                  />
                </span>
                <button
                  className={styles.actionBtn}
                  onClick={() =>
                    togglePluginStatus(
                      plugin,
                      isActive ? 'inactive' : 'active',
                    )
                  }
                  disabled={loading}
                >
                  <FaPowerOff className={styles.iconSmall} />
                  {isActive ? t('deactivate') : t('activate')}
                </button>
                <button
                  className={styles.actionBtnDanger}
                  onClick={() => uninstallPlugin(plugin)}
                  disabled={loading}
                >
                  <FaTrash className={styles.iconSmall} />
                  {t('uninstall')}
                </button>
              </>
            ) : (
              <button
                className={styles.installBtn}
                onClick={() => installPlugin(plugin)}
                disabled={loading}
              >
                {loading ? t('installing', { elapsed: '' }) : t('install')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs} role="tablist">
        {TABS.map((name) => (
          <button
            key={name}
            role="tab"
            aria-selected={tab === name}
            onClick={() => setTab(name)}
            className={tab === name ? styles.tabActive : styles.tab}
          >
            {t(name)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className={styles.tabContent}>
        {tab === 'details' && (
          <>
            <div className={styles.sectionTitle}>
              {tCommon('description')}
            </div>
            <div className={styles.description}>{info.description}</div>

            {details?.screenshots && details.screenshots.length > 0 && (
              <>
                <div className={styles.sectionTitle}>{t('screenshots')}</div>
                <div className={styles.screenshotsRow}>
                  {details.screenshots.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`${t('ss')} ${i + 1}`}
                      className={styles.screenshotThumb}
                    />
                  ))}
                </div>
              </>
            )}
            {fetching && (
              <div className={styles.loadingText}>{t('loadingDetails')}</div>
            )}
          </>
        )}

        {tab === 'features' && (
          <>
            {features && features.length > 0 ? (
              <ul className={styles.featuresList}>
                {features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            ) : (
              <div className={styles.noInfo}>
                {t('noFeaturesInfoAvailableForThisPlugin')}
              </div>
            )}
            {fetching && (
              <div className={styles.loadingText}>{t('loadingFeatures')}</div>
            )}
          </>
        )}

        {tab === 'changelog' && (
          <>
            {changelog.length > 0 ? (
              changelog.map((entry, i) => (
                <div key={i} className={styles.changelogEntry}>
                  <div className={styles.changelogVersion}>
                    v{entry.version} &mdash; {entry.date}
                  </div>
                  <ul className={styles.changelogList}>
                    {entry.changes.map((c, j) => (
                      <li key={j}>{c}</li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <div className={styles.noInfo}>{t('loadingChangelog')}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
