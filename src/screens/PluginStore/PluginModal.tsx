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
  FaSpinner,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { AdminPluginFileService } from '../../plugin/services/AdminPluginFileService';
import type {
  IPluginMeta,
  IPluginDetails,
  IInstalledPlugin,
  IPluginModalProps,
} from 'plugin';

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
        {/* Sidebar */}
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
          <img
            src={plugin?.icon}
            alt="Plugin Icon"
            style={{
              width: 80,
              height: 80,
              borderRadius: 16,
              objectFit: 'cover',
              background: '#f5f5f5',
              marginBottom: 24,
            }}
          />
          <div
            style={{
              fontWeight: 700,
              fontSize: 22,
              marginBottom: 8,
              textAlign: 'center',
            }}
          >
            {plugin?.name}
          </div>
          <div
            style={{
              fontSize: 15,
              color: '#555',
              marginBottom: 8,
              textAlign: 'center',
            }}
          >
            {plugin?.author}
          </div>
          {details && (
            <>
              <div style={{ fontSize: 14, color: '#888', marginBottom: 16 }}>
                v{details.version}
              </div>
            </>
          )}
          <div style={{ width: '100%', marginTop: 16 }}>
            {plugin && isInstalled(plugin.name) && meta && (
              <>
                <Button
                  variant={
                    getInstalledPlugin(plugin.name)?.status === 'active'
                      ? 'light'
                      : 'primary'
                  }
                  className="w-100 mb-2 d-flex align-items-center justify-content-center gap-2"
                  onClick={() =>
                    togglePluginStatus(
                      meta,
                      getInstalledPlugin(plugin.name)?.status === 'active'
                        ? 'inactive'
                        : 'active',
                    )
                  }
                  disabled={loading}
                  style={{
                    height: '38px',
                    fontSize: '14px',
                    fontWeight: 500,
                    boxShadow: 'none',
                    border: '1px solid #dee2e6',
                  }}
                >
                  {loading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaPowerOff
                      style={{
                        fontSize: '14px',
                        color:
                          getInstalledPlugin(plugin.name)?.status === 'active'
                            ? '#6c757d'
                            : '#fff',
                      }}
                    />
                  )}
                  {getInstalledPlugin(plugin.name)?.status === 'active'
                    ? 'Deactivate'
                    : 'Activate'}
                </Button>
                <Button
                  variant="light"
                  className="w-100 d-flex align-items-center justify-content-center gap-2"
                  onClick={() => uninstallPlugin(meta)}
                  disabled={loading}
                  style={{
                    height: '38px',
                    fontSize: '14px',
                    fontWeight: 500,
                    boxShadow: 'none',
                    border: '1px solid #dee2e6',
                    color: '#dc3545',
                  }}
                >
                  {loading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaTrash style={{ fontSize: '14px' }} />
                  )}
                  Uninstall
                </Button>
              </>
            )}
            {plugin && !isInstalled(plugin.name) && meta && (
              <Button
                variant="primary"
                className="w-100"
                onClick={() => installPlugin(meta)}
                disabled={loading}
              >
                Install
              </Button>
            )}
          </div>
        </div>
        {/* Main Content */}
        <div
          style={{
            flex: 1,
            background: '#fff',
            color: '#222',
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            transition: 'all 0.3s ease',
          }}
        >
          {screenshotViewer.open ? (
            /* Screenshot Viewer */
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'fadeIn 0.3s ease-out',
                borderRadius: '0 12px 12px 0',
              }}
            >
              {/* Header with back button */}
              <div
                style={{
                  position: 'absolute',
                  top: 20,
                  left: 0,
                  right: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 30px',
                  zIndex: 10,
                }}
              >
                <button
                  onClick={closeScreenshotViewer}
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    color: '#495057',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 12px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.95)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 2px 8px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  ← Back to Details
                </button>

                {screenshotViewer.screenshots.length > 1 && (
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      color: '#495057',
                      padding: '8px 16px',
                      borderRadius: '16px',
                      fontSize: 14,
                      fontWeight: 600,
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                  >
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
                    style={{
                      position: 'absolute',
                      left: 30,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '50%',
                      width: 48,
                      height: 48,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: '#495057',
                      fontSize: 18,
                      cursor: 'pointer',
                      zIndex: 10,
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.transform =
                        'translateY(-50%) scale(1.05)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 12px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.95)';
                      e.currentTarget.style.transform =
                        'translateY(-50%) scale(1)';
                      e.currentTarget.style.boxShadow =
                        '0 2px 8px rgba(0, 0, 0, 0.1)';
                    }}
                    title="Previous image (←)"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={nextScreenshot}
                    style={{
                      position: 'absolute',
                      right: 30,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '50%',
                      width: 48,
                      height: 48,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: '#495057',
                      fontSize: 18,
                      cursor: 'pointer',
                      zIndex: 10,
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.transform =
                        'translateY(-50%) scale(1.05)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 12px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.95)';
                      e.currentTarget.style.transform =
                        'translateY(-50%) scale(1)';
                      e.currentTarget.style.boxShadow =
                        '0 2px 8px rgba(0, 0, 0, 0.1)';
                    }}
                    title="Next image (→)"
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}

              {/* Image */}
              <div
                style={{
                  maxWidth: 'calc(100% - 160px)',
                  maxHeight: 'calc(100% - 160px)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <img
                  key={screenshotViewer.currentIndex}
                  src={
                    screenshotViewer.screenshots[screenshotViewer.currentIndex]
                  }
                  alt={`Screenshot ${screenshotViewer.currentIndex + 1}`}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    boxShadow:
                      '0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08)',
                    background: '#ffffff',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    animation: 'imageSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              </div>

              {/* Dot indicators */}
              {screenshotViewer.screenshots.length > 1 &&
                screenshotViewer.screenshots.length <= 5 && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 30,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      gap: 12,
                      alignItems: 'center',
                    }}
                  >
                    {screenshotViewer.screenshots.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setScreenshotViewer((prev) => ({
                            ...prev,
                            currentIndex: index,
                          }));
                        }}
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          border: 'none',
                          background:
                            index === screenshotViewer.currentIndex
                              ? '#495057'
                              : 'rgba(73, 80, 87, 0.3)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          transform:
                            index === screenshotViewer.currentIndex
                              ? 'scale(1.3)'
                              : 'scale(1)',
                        }}
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
              <div
                style={{
                  display: 'flex',
                  borderBottom: '1px solid #e7e7e7',
                  background: '#f8f9fa',
                  borderTopRightRadius: 12,
                }}
              >
                {TABS.map((t) => (
                  <div
                    key={t}
                    onClick={() => setTab(t)}
                    style={{
                      padding: '18px 32px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      color: tab === t ? '#222' : '#888',
                      borderBottom:
                        tab === t
                          ? '3px solid #4caf50'
                          : '3px solid transparent',
                      fontSize: 16,
                      letterSpacing: 0.2,
                      transition: 'color 0.2s',
                      background: 'none',
                    }}
                  >
                    {t}
                  </div>
                ))}
              </div>

              {/* Tab Content */}
              <div
                style={{
                  flex: 1,
                  padding: '32px 40px',
                  minHeight: 420,
                  maxHeight: '70vh',
                  overflowY: 'auto',
                  transition: 'min-height 0.2s, max-height 0.2s',
                }}
              >
                {tab === 'Details' && (
                  <>
                    <div
                      style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}
                    >
                      Description
                    </div>
                    <div style={{ marginBottom: 24 }}>
                      {plugin?.description}
                    </div>

                    {details?.screenshots && details.screenshots.length > 0 && (
                      <>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 18,
                            marginBottom: 8,
                          }}
                        >
                          Screenshots
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            gap: 8,
                            overflowX: 'auto',
                            paddingBottom: 8,
                            marginBottom: 24,
                          }}
                        >
                          {details.screenshots.map((src, idx) => (
                            <img
                              key={idx}
                              src={src}
                              alt={`Screenshot ${idx + 1}`}
                              style={{
                                width: 120,
                                height: 80,
                                objectFit: 'cover',
                                borderRadius: 6,
                                border: '1px solid #eee',
                                background: '#fafbfc',
                                cursor: 'pointer',
                                transition: 'transform 0.2s ease-in-out',
                              }}
                              onClick={() =>
                                openScreenshotViewer(details.screenshots, idx)
                              }
                              onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                              }}
                              title="Click to view full size"
                            />
                          ))}
                        </div>
                      </>
                    )}
                    {fetching && (
                      <div
                        style={{ color: '#888', fontSize: 15, marginTop: 24 }}
                      >
                        Loading details...
                      </div>
                    )}
                  </>
                )}
                {tab === 'Features' && (
                  <>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 18,
                        marginBottom: 16,
                      }}
                    >
                      Features
                    </div>
                    {features && features.length > 0 ? (
                      <ul
                        style={{
                          color: '#555',
                          fontSize: 15,
                          paddingLeft: 24,
                          lineHeight: 1.6,
                        }}
                      >
                        {features.map((f, i) => (
                          <li key={i} style={{ marginBottom: 8 }}>
                            {f}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div
                        style={{
                          color: '#888',
                          fontSize: 15,
                          fontStyle: 'italic',
                          background: '#f8f9fa',
                          padding: 16,
                          borderRadius: 8,
                          border: '1px solid #e9ecef',
                        }}
                      >
                        No features information available for this plugin.
                      </div>
                    )}
                    {fetching && (
                      <div
                        style={{ color: '#888', fontSize: 15, marginTop: 24 }}
                      >
                        Loading features...
                      </div>
                    )}
                  </>
                )}
                {tab === 'Changelog' && (
                  <>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 18,
                        marginBottom: 16,
                      }}
                    >
                      Changelog
                    </div>
                    {changelog.map((entry, idx) => (
                      <div key={idx} style={{ marginBottom: 24 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 15,
                            marginBottom: 4,
                          }}
                        >
                          v{entry.version} - {entry.date}
                        </div>
                        <ul
                          style={{
                            color: '#555',
                            fontSize: 15,
                            paddingLeft: 24,
                          }}
                        >
                          {entry.changes.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    {fetching && (
                      <div
                        style={{ color: '#888', fontSize: 15, marginTop: 24 }}
                      >
                        Loading changelog...
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}

          {/* Add CSS animations */}
          <style>{`
            @keyframes fadeIn {
              from { 
                opacity: 0;
              }
              to { 
                opacity: 1;
              }
            }
            
            @keyframes imageSlideIn {
              from { 
                opacity: 0;
                transform: scale(0.98);
              }
              to { 
                opacity: 1;
                transform: scale(1);
              }
            }
          `}</style>
        </div>
      </div>
    </Modal>
  );
};

export default PluginModal;
