/**
 * A modal dialog that displays detailed information about a selected plugin.
 * Shows plugin details, features, and changelog in a tabbed interface,
 * with options to install, uninstall, or toggle the plugin's status.
 */
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaPowerOff, FaTrash, FaSpinner } from 'react-icons/fa';
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

  // Fetch plugin details when modal opens
  useEffect(() => {
    if (show && pluginId) {
      setFetching(true);
      setTab('Details');

      const fetchPluginDetails = async () => {
        try {
          const response = await fetch(
            `https://dummy-cdn.talawa.io/plugins/${pluginId}`,
          );
          if (response.ok) {
            const data = await response.json();
            setDetails(data);
          }
        } catch (error) {
          // Silently handle any errors
          setDetails(null);
        } finally {
          setFetching(false);
        }
      };

      fetchPluginDetails();
    } else {
      setDetails(null);
      setFetching(false);
    }
  }, [show, pluginId]);

  // Use details if loaded, else fallback to meta
  const plugin = details || meta;

  // Extract features from readme if available
  const features = details?.readme
    ? details.readme
        .split('Features:')[1]
        ?.split('\n')
        .filter((line) => line.trim().startsWith('-'))
        .map((line) => line.replace('-', '').trim())
    : [];

  // Use changelog from details if available
  const changelog = details?.changelog || [];

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
              <div style={{ fontSize: 14, color: '#888', marginBottom: 8 }}>
                v{details.version}
              </div>
              <div style={{ fontSize: 14, color: '#888', marginBottom: 8 }}>
                {details.downloads?.toLocaleString()} downloads
              </div>
              <div style={{ fontSize: 14, color: '#888', marginBottom: 16 }}>
                ★ {details.rating} / 5
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
          }}
        >
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
                    tab === t ? '3px solid #4caf50' : '3px solid transparent',
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
                <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>
                  Description
                </div>
                <div style={{ marginBottom: 24 }}>{plugin?.description}</div>
                {details?.screenshots && details.screenshots.length > 0 && (
                  <>
                    <div
                      style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}
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
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
                {details?.readme && (
                  <>
                    <div
                      style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}
                    >
                      Readme
                    </div>
                    <pre
                      style={{
                        background: '#f8f9fa',
                        color: '#222',
                        padding: 16,
                        borderRadius: 8,
                        fontSize: 14,
                        whiteSpace: 'pre-wrap',
                        maxHeight: 250,
                        overflow: 'auto',
                      }}
                    >
                      {details.readme}
                    </pre>
                  </>
                )}
                {fetching && (
                  <div style={{ color: '#888', fontSize: 15, marginTop: 24 }}>
                    Loading details...
                  </div>
                )}
              </>
            )}
            {tab === 'Features' && (
              <>
                <div
                  style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}
                >
                  Features
                </div>
                <ul style={{ color: '#555', fontSize: 15, paddingLeft: 24 }}>
                  {features && features.length > 0 ? (
                    features.map((f, i) => <li key={i}>{f}</li>)
                  ) : (
                    <li>No features listed.</li>
                  )}
                </ul>
                {fetching && (
                  <div style={{ color: '#888', fontSize: 15, marginTop: 24 }}>
                    Loading features...
                  </div>
                )}
              </>
            )}
            {tab === 'Changelog' && (
              <>
                <div
                  style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}
                >
                  Changelog
                </div>
                {changelog.map((entry, idx) => (
                  <div key={idx} style={{ marginBottom: 24 }}>
                    <div
                      style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}
                    >
                      v{entry.version} - {entry.date}
                    </div>
                    <ul
                      style={{ color: '#555', fontSize: 15, paddingLeft: 24 }}
                    >
                      {entry.changes.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                {fetching && (
                  <div style={{ color: '#888', fontSize: 15, marginTop: 24 }}>
                    Loading changelog...
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PluginModal;
