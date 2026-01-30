/**
 * A modal dialog that displays detailed information about a selected plugin.
 * Shows plugin details, features, and changelog in a tabbed interface,
 * with options to install, uninstall, or toggle the plugin's status.
 */
import React, { useEffect, useState } from 'react';
import {
  FaPowerOff,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { AdminPluginFileService } from '../../../plugin/services/AdminPluginFileService';
import type { IPluginDetails, IPluginModalProps } from 'plugin';
import styles from './PluginModal.module.css';
import { useInstallTimer } from './hooks/useInstallTimer';
import LoadingState from '../../../shared-components/LoadingState/LoadingState';
import { useTranslation } from 'react-i18next';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import StatusBadge from 'shared-components/StatusBadge/StatusBadge';
import { Button } from 'shared-components/Button';
import { CRUDModalTemplate } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';

const TABS = ['details', 'features', 'changelog'] as const;
type TabType = (typeof TABS)[number];

/**
 * Modal dialog showing plugin details with install, uninstall,
 * and active/inactive status actions.
 *
 * @param props - PluginModal props.
 * @returns JSX.Element
 */
const PluginModal = (props: IPluginModalProps): JSX.Element => {
  const {
    show,
    onHide,
    pluginId,
    meta,
    loading,
    isInstalled,
    getInstalledPlugin,
    installPlugin,
    togglePluginStatus,
    uninstallPlugin,
  } = props;

  const { t } = useTranslation('translation', { keyPrefix: 'pluginStore' });
  const { t: tCommon } = useTranslation('common');

  const [details, setDetails] = useState<IPluginDetails | null>(null);
  const [fetching, setFetching] = useState(false);
  const [tab, setTab] = useState<TabType>('details');
  const installElapsed = useInstallTimer(loading);
  const [screenshotViewer, setScreenshotViewer] = useState<{
    open: boolean;
    currentIndex: number;
    screenshots: string[];
  }>({
    open: false,
    currentIndex: 0,
    screenshots: [],
  });

  // Load plugin details from local files when modal opens
  useEffect(() => {
    if (show && pluginId) {
      setFetching(true);
      setTab('details');
      setScreenshotViewer({ open: false, currentIndex: 0, screenshots: [] }); // Reset screenshot viewer

      const loadPluginDetails = async () => {
        try {
          const pluginDetails =
            await AdminPluginFileService.getPluginDetails(pluginId);
          setDetails(pluginDetails);
        } catch {
          NotificationToast.error(t('errorInstalling'));
          setDetails(null);
        } finally {
          setFetching(false);
        }
      };

      loadPluginDetails();
    } else {
      setDetails(null);
      setFetching(false);
      setScreenshotViewer({ open: false, currentIndex: 0, screenshots: [] });
    }
  }, [show, pluginId]);

  // Ticker for elapsed install time while loading
  useEffect(() => {
    if (!loading) {
      // Reset handled by useInstallTimer when loading becomes false
      return;
    }
  }, [loading]);

  // Use details if loaded, else fallback to meta
  const plugin = details || meta;
  const installedPlugin = plugin ? getInstalledPlugin(plugin.name) : undefined;
  const isPluginActive = installedPlugin?.status === 'active';

  // Get features from details (loaded from info.json) or extract from readme as fallback
  const features =
    details?.features ||
    (details?.readme
      ? details.readme
          .split('Features:')[1]
          ?.split('\n')
          .filter((line) => line.trim().startsWith('-'))
          .map((line) => line.replace('-', '').trim())
      : []);

  // Use changelog from details if available
  const changelog = details?.changelog || [];

  // Screenshot viewer functions
  const openScreenshotViewer = (screenshots: string[], index: number) => {
    setScreenshotViewer({
      open: true,
      currentIndex: index,
      screenshots: screenshots,
    });
  };

  const closeScreenshotViewer = () => {
    setScreenshotViewer({
      open: false,
      currentIndex: 0,
      screenshots: [],
    });
  };

  const nextScreenshot = () => {
    setScreenshotViewer((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.screenshots.length,
    }));
  };

  const previousScreenshot = () => {
    setScreenshotViewer((prev) => ({
      ...prev,
      currentIndex:
        prev.currentIndex === 0
          ? prev.screenshots.length - 1
          : prev.currentIndex - 1,
    }));
  };

  // Keyboard navigation for screenshot viewer
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (screenshotViewer.open) {
        if (e.key === 'Escape') {
          closeScreenshotViewer();
        } else if (e.key === 'ArrowRight') {
          nextScreenshot();
        } else if (e.key === 'ArrowLeft') {
          previousScreenshot();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [screenshotViewer.open]);

  return (
    <CRUDModalTemplate
      open={show}
      onClose={onHide}
      title={t('details')}
      size="xl"
      showFooter={false}
      className={styles.modalContainer}
    >
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <img
          src={plugin?.icon}
          alt={t('pluginIcon')}
          className={styles.pluginIcon}
        />
        <div className={styles.pluginName}>{plugin?.name}</div>
        <div className={styles.pluginAuthor}>{plugin?.author}</div>
        {details && (
          <div className={styles.pluginVersion}>v{details.version}</div>
        )}
        {plugin && isInstalled(plugin.name) && (
          <div className="mb-2 d-flex justify-content-center">
            <StatusBadge
              variant={isPluginActive ? 'active' : 'inactive'}
              size="md"
              dataTestId="plugin-status-badge"
              ariaLabel={isPluginActive ? 'active' : 'inactive'}
            />
          </div>
        )}

        <div className={styles.actionButtons}>
          {plugin && isInstalled(plugin.name) && meta && (
            <>
              <LoadingState isLoading={loading} variant="inline">
                <Button
                  variant="light"
                  className={`w-100 mb-2 d-flex align-items-center justify-content-center gap-2 ${styles.actionButton}`}
                  onClick={() =>
                    togglePluginStatus(
                      meta,
                      isPluginActive ? 'inactive' : 'active',
                    )
                  }
                >
                  <FaPowerOff />
                  {isPluginActive ? t('deactivate') : t('activate')}
                </Button>
              </LoadingState>
              <LoadingState isLoading={loading} variant="inline">
                <Button
                  variant="light"
                  className={`w-100 d-flex align-items-center justify-content-center gap-2 ${styles.actionButtonDanger}`}
                  onClick={() => uninstallPlugin(meta)}
                >
                  <FaTrash className={styles.iconTrash} />
                  {t('uninstall')}
                </Button>
              </LoadingState>
            </>
          )}
          {plugin && !isInstalled(plugin.name) && meta && (
            <>
              <LoadingState isLoading={loading} variant="inline">
                <Button
                  variant="primary"
                  className="w-100 d-flex align-items-center justify-content-center gap-2"
                  onClick={() => installPlugin(meta)}
                >
                  {loading
                    ? t('installing', { elapsed: installElapsed })
                    : t('install')}
                </Button>
              </LoadingState>
            </>
          )}
        </div>
      </div>
      {/* Main Content */}
      <div className={styles.mainContent}>
        {screenshotViewer.open ? (
          /* Screenshot Viewer */
          <div className={styles.screenshotViewer}>
            {/* Header with back button */}
            <div className={styles.screenshotHeader}>
              <button
                type="button"
                onClick={closeScreenshotViewer}
                className={styles.backButton}
                aria-label={t('backToDetails')}
              >
                {t('backToDetails')}
              </button>

              {screenshotViewer.screenshots.length > 1 && (
                <div className={styles.screenshotCounter}>
                  {t('screenshotCounter', {
                    current: screenshotViewer.currentIndex + 1,
                    total: screenshotViewer.screenshots.length,
                  })}
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            {screenshotViewer.screenshots.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={previousScreenshot}
                  className={styles.navigationButtonLeft}
                  title={`${t('previousImage')}`}
                  aria-label={`${t('previousImage')}`}
                >
                  <FaChevronLeft />
                </button>
                <button
                  type="button"
                  onClick={nextScreenshot}
                  className={styles.navigationButtonRight}
                  title={`${t('nextImage')}`}
                  aria-label={`${t('nextImage')}`}
                >
                  <FaChevronRight />
                </button>
              </>
            )}

            {/* Image */}
            <div className={styles.screenshotImageContainer}>
              <img
                key={screenshotViewer.currentIndex}
                src={
                  screenshotViewer.screenshots[screenshotViewer.currentIndex]
                }
                alt={`${t('ss')} ${screenshotViewer.currentIndex + 1}`}
                className={styles.screenshotImage}
              />
            </div>

            {/* Dot indicators */}
            {screenshotViewer.screenshots.length > 1 &&
              screenshotViewer.screenshots.length <= 5 && (
                <div className={styles.dotIndicators}>
                  {screenshotViewer.screenshots.map((_, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => {
                        setScreenshotViewer((prev) => ({
                          ...prev,
                          currentIndex: index,
                        }));
                      }}
                      className={
                        index === screenshotViewer.currentIndex
                          ? styles.dotIndicatorActive
                          : styles.dotIndicator
                      }
                      title={`${t('screenshot', { number: index + 1 })}`}
                      aria-label={`${t('screenshot', { number: index + 1 })}`}
                    />
                  ))}
                </div>
              )}
          </div>
        ) : (
          /* Plugin Details Content */
          <>
            {/* Tabs */}
            <div className={styles.tabsContainer} role="tablist">
              {TABS.map((tName) => (
                <button
                  key={tName}
                  id={`tab-${tName}`}
                  type="button"
                  role="tab"
                  aria-selected={tab === tName}
                  aria-controls={`panel-${tName}`}
                  onClick={() => setTab(tName)}
                  className={tab === tName ? styles.tabActive : styles.tab}
                >
                  {t(tName)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className={styles.tabContent}>
              <div
                role="tabpanel"
                id="panel-details"
                aria-labelledby="tab-details"
                hidden={tab !== 'details'}
              >
                {tab === 'details' && (
                  <>
                    <div className={styles.sectionTitle}>
                      {tCommon('description')}
                    </div>
                    <div className={styles.description}>
                      {plugin?.description}
                    </div>

                    {details?.screenshots && details.screenshots.length > 0 && (
                      <>
                        <div className={styles.sectionTitle}>
                          {t('screenshots')}
                        </div>
                        <div className={styles.screenshotsContainer}>
                          {details.screenshots.map((src, idx) => (
                            <button
                              key={idx}
                              type="button"
                              className={styles.screenshotThumbnailButton}
                              onClick={() =>
                                openScreenshotViewer(details.screenshots, idx)
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  openScreenshotViewer(
                                    details.screenshots,
                                    idx,
                                  );
                                }
                              }}
                              title={t('clickToViewFullSize')}
                            >
                              <img
                                src={src}
                                alt={`${t('ss')} ${idx + 1}`}
                                className={styles.screenshotThumbnail}
                              />
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                    {fetching && (
                      <div className={styles.loadingText}>
                        {t('loadingDetails')}
                      </div>
                    )}
                  </>
                )}
              </div>
              <div
                role="tabpanel"
                id="panel-features"
                aria-labelledby="tab-features"
                hidden={tab !== 'features'}
              >
                {tab === 'features' && (
                  <>
                    <div className={styles.sectionTitleLarge}>
                      {t('features')}
                    </div>
                    {features && features.length > 0 ? (
                      <ul className={styles.featuresList}>
                        {features.map((f, i) => (
                          <li key={i} className={styles.featuresListItem}>
                            {f}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className={styles.noFeaturesMessage}>
                        {t('noFeaturesInfoAvailableForThisPlugin')}
                      </div>
                    )}
                    {fetching && (
                      <div className={styles.loadingText}>
                        {t('loadingFeatures')}
                      </div>
                    )}
                  </>
                )}
              </div>
              <div
                role="tabpanel"
                id="panel-changelog"
                aria-labelledby="tab-changelog"
                hidden={tab !== 'changelog'}
              >
                {tab === 'changelog' && (
                  <>
                    <div className={styles.sectionTitleLarge}>
                      {t('changelog')}
                    </div>
                    {changelog.map((entry, idx) => (
                      <div key={idx} className={styles.changelogEntry}>
                        <div className={styles.changelogVersion}>
                          {t('v')} {entry.version} - {entry.date}
                        </div>
                        <ul className={styles.changelogList}>
                          {entry.changes.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    {fetching && (
                      <div className={styles.loadingText}>
                        {t('loadingChangelog')}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </CRUDModalTemplate>
  );
};

export default PluginModal;
