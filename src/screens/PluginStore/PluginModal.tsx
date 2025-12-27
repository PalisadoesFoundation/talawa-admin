/**
 * A modal dialog that displays detailed information about a selected plugin.
 * Shows plugin details, features, and changelog in a tabbed interface,
 * with options to install, uninstall, or toggle the plugin's status.
 */
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {
  FaPowerOff,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { AdminPluginFileService } from '../../plugin/services/AdminPluginFileService';
import type { IPluginDetails, IPluginModalProps } from 'plugin';
import styles from './PluginModal.module.css';
import { useInstallTimer } from './hooks/useInstallTimer';
import LoadingState from '../../shared-components/LoadingState/LoadingState';

const TABS = ['Details', 'Features', 'Changelog'] as const;
type TabType = (typeof TABS)[number];

const PluginModal: React.FC<IPluginModalProps> = ({
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
}) => {
  const [details, setDetails] = useState<IPluginDetails | null>(null);
  const [fetching, setFetching] = useState(false);
  const [tab, setTab] = useState<TabType>('Details');
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
      setTab('Details');
      setScreenshotViewer({ open: false, currentIndex: 0, screenshots: [] }); // Reset screenshot viewer

      const loadPluginDetails = async () => {
        try {
          const pluginDetails =
            await AdminPluginFileService.getPluginDetails(pluginId);
          setDetails(pluginDetails);
        } catch (error) {
          console.error('Failed to load plugin details:', error);
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
    <Modal show={show} onHide={onHide} centered dialogClassName="modal-xl">
      <div className={styles.modalContainer}>
        {/* Close Button */}
        <button
          type="button"
          aria-label="Close"
          onClick={onHide}
          className={styles.closeButton}
        >
          &times;
        </button>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <img
            src={plugin?.icon}
            alt="Plugin Icon"
            className={styles.pluginIcon}
          />
          <div className={styles.pluginName}>{plugin?.name}</div>
          <div className={styles.pluginAuthor}>{plugin?.author}</div>
          {details && (
            <>
              <div className={styles.pluginVersion}>v{details.version}</div>
            </>
          )}
          <div className={styles.actionButtons}>
            {plugin && isInstalled(plugin.name) && meta && (
              <>
                <LoadingState isLoading={loading} variant="inline">
                  <Button
                    variant={
                      getInstalledPlugin(plugin.name)?.status === 'active'
                        ? 'light'
                        : 'primary'
                    }
                    className={`w-100 mb-2 d-flex align-items-center justify-content-center gap-2 ${
                      getInstalledPlugin(plugin.name)?.status === 'active'
                        ? styles.actionButtonLight
                        : styles.actionButton
                    }`}
                    onClick={() =>
                      togglePluginStatus(
                        meta,
                        getInstalledPlugin(plugin.name)?.status === 'active'
                          ? 'inactive'
                          : 'active',
                      )
                    }
                  >
                    <FaPowerOff
                      style={{
                        fontSize: '14px',
                        color:
                          getInstalledPlugin(plugin.name)?.status === 'active'
                            ? '#6c757d'
                            : '#fff',
                      }}
                    />
                    {getInstalledPlugin(plugin.name)?.status === 'active'
                      ? 'Deactivate'
                      : 'Activate'}
                  </Button>
                </LoadingState>
                <LoadingState isLoading={loading} variant="inline">
                  <Button
                    variant="light"
                    className={`w-100 d-flex align-items-center justify-content-center gap-2 ${styles.actionButtonDanger}`}
                    onClick={() => uninstallPlugin(meta)}
                  >
                    <FaTrash style={{ fontSize: '14px' }} />
                    Uninstall
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
                      ? `Installing${installElapsed ? ` (${installElapsed})` : ''}`
                      : 'Install'}
                  </Button>
                </LoadingState>
                <LoadingState isLoading={loading} variant="inline">
                  <Button
                    variant="light"
                    className={`w-100 d-flex align-items-center justify-content-center gap-2 ${styles.actionButtonDanger}`}
                    onClick={() => uninstallPlugin(meta)}
                  >
                    <FaTrash style={{ fontSize: '14px' }} />
                    Uninstall
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
                  onClick={closeScreenshotViewer}
                  className={styles.backButton}
                >
                  ← Back to Details
                </button>

                {screenshotViewer.screenshots.length > 1 && (
                  <div className={styles.screenshotCounter}>
                    {screenshotViewer.currentIndex + 1} of{' '}
                    {screenshotViewer.screenshots.length}
                  </div>
                )}
              </div>

              {/* Navigation buttons */}
              {screenshotViewer.screenshots.length > 1 && (
                <>
                  <button
                    onClick={previousScreenshot}
                    className={styles.navigationButtonLeft}
                    title="Previous image (←)"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={nextScreenshot}
                    className={styles.navigationButtonRight}
                    title="Next image (→)"
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
                  alt={`Screenshot ${screenshotViewer.currentIndex + 1}`}
                  className={styles.screenshotImage}
                />
              </div>

              {/* Dot indicators */}
              {screenshotViewer.screenshots.length > 1 &&
                screenshotViewer.screenshots.length <= 5 && (
                  <div className={styles.dotIndicators}>
                    {screenshotViewer.screenshots.map((_, index) => (
                      <button
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
                        title={`Go to screenshot ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
            </div>
          ) : (
            /* Plugin Details Content */
            <>
              {/* Tabs */}
              <div className={styles.tabsContainer}>
                {TABS.map((t) => (
                  <div
                    key={t}
                    onClick={() => setTab(t)}
                    className={tab === t ? styles.tabActive : styles.tab}
                  >
                    {t}
                  </div>
                ))}
              </div>

              {/* Tab Content */}
              <div className={styles.tabContent}>
                {tab === 'Details' && (
                  <>
                    <div className={styles.sectionTitle}>Description</div>
                    <div className={styles.description}>
                      {plugin?.description}
                    </div>

                    {details?.screenshots && details.screenshots.length > 0 && (
                      <>
                        <div className={styles.sectionTitle}>Screenshots</div>
                        <div className={styles.screenshotsContainer}>
                          {details.screenshots.map((src, idx) => (
                            <img
                              key={idx}
                              src={src}
                              alt={`Screenshot ${idx + 1}`}
                              className={styles.screenshotThumbnail}
                              onClick={() =>
                                openScreenshotViewer(details.screenshots, idx)
                              }
                              title="Click to view full size"
                            />
                          ))}
                        </div>
                      </>
                    )}
                    {fetching && (
                      <div className={styles.loadingText}>
                        Loading details...
                      </div>
                    )}
                  </>
                )}
                {tab === 'Features' && (
                  <>
                    <div className={styles.sectionTitleLarge}>Features</div>
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
                        No features information available for this plugin.
                      </div>
                    )}
                    {fetching && (
                      <div className={styles.loadingText}>
                        Loading features...
                      </div>
                    )}
                  </>
                )}
                {tab === 'Changelog' && (
                  <>
                    <div className={styles.sectionTitleLarge}>Changelog</div>
                    {changelog.map((entry, idx) => (
                      <div key={idx} className={styles.changelogEntry}>
                        <div className={styles.changelogVersion}>
                          v{entry.version} - {entry.date}
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
                        Loading changelog...
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PluginModal;
