/**
 * A modal dialog that displays detailed information about a selected plugin.
 * Shows plugin details, features, and changelog in a tabbed interface,
 * with options to install, uninstall, or toggle the plugin's status.
 */
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface IPluginMeta {
  id: string;
  name: string;
  description: string;
  author: string;
  icon: string;
}

interface IPluginDetails extends IPluginMeta {
  version: string;
  cdnUrl: string;
  readme: string;
  screenshots: string[];
  homepage?: string;
  license?: string;
  tags?: string[];
  downloads?: number;
  rating?: number;
}

interface IInstalledPlugin extends IPluginDetails {
  status: 'active' | 'inactive';
}

interface IPluginModalProps {
  show: boolean;
  onHide: () => void;
  pluginId: string | null;
  meta: IPluginMeta | null;
  loading: boolean;
  isInstalled: (pluginName: string) => boolean;
  getInstalledPlugin: (pluginName: string) => IInstalledPlugin | undefined;
  installPlugin: (plugin: IPluginMeta) => void;
  togglePluginStatus: (
    plugin: IPluginMeta,
    status: 'active' | 'inactive',
  ) => void;
  uninstallPlugin: (plugin: IPluginMeta) => void;
}

// Dummy details for all plugins (simulate CDN fetch)
const dummyDetails: Record<string, IPluginDetails> = {
  calendar: {
    id: 'calendar',
    name: 'Calendar',
    description: 'A plugin to add calendar functionality to your community.',
    author: 'Talawa Team',
    icon: '/images/logo512.png',
    version: '1.0.0',
    cdnUrl: 'https://cdn.example.com/plugins/calendar.js',
    readme:
      'This plugin adds a calendar to your community portal.\n\nFeatures:\n- Add, edit, and delete events\n- View by month, week, or day',
    screenshots: ['/images/logo512.png', '/images/logo512.png'],
    homepage: 'https://talawa.io/calendar',
    license: 'MIT',
    tags: ['calendar', 'events', 'scheduling'],
    downloads: 2572256,
    rating: 4.8,
  },
  polls: {
    id: 'polls',
    name: 'Polls',
    description: 'A plugin to create and manage polls.',
    author: 'Talawa Team',
    icon: '/images/logo512.png',
    version: '1.0.0',
    cdnUrl: 'https://cdn.example.com/plugins/polls.js',
    readme:
      'This plugin allows you to create and manage polls.\n\nFeatures:\n- Multiple choice\n- Anonymous voting',
    screenshots: ['/images/logo512.png'],
    homepage: 'https://talawa.io/polls',
    license: 'MIT',
    tags: ['polls', 'voting'],
    downloads: 1200000,
    rating: 4.5,
  },
  events: {
    id: 'events',
    name: 'Events',
    description: 'A plugin to manage events and RSVPs.',
    author: 'Talawa Team',
    icon: '/images/logo512.png',
    version: '1.0.0',
    cdnUrl: 'https://cdn.example.com/plugins/events.js',
    readme:
      'This plugin helps you manage events and RSVPs.\n\nFeatures:\n- RSVP\n- Event reminders',
    screenshots: ['/images/logo512.png'],
    homepage: 'https://talawa.io/events',
    license: 'MIT',
    tags: ['events', 'rsvp'],
    downloads: 900000,
    rating: 4.6,
  },
  chat: {
    id: 'chat',
    name: 'Chat',
    description: 'A real-time chat plugin for members to communicate.',
    author: 'Talawa Team',
    icon: '/images/logo512.png',
    version: '1.2.0',
    cdnUrl: 'https://cdn.example.com/plugins/chat.js',
    readme:
      'Adds real-time messaging features to your community platform.\n\nFeatures:\n- Group chat\n- Direct messages',
    screenshots: ['/images/logo512.png'],
    homepage: 'https://talawa.io/chat',
    license: 'MIT',
    tags: ['chat', 'messaging'],
    downloads: 1500000,
    rating: 4.7,
  },
  filesharing: {
    id: 'filesharing',
    name: 'FileSharing',
    description: 'Enables users to upload and share files securely.',
    author: 'Talawa Team',
    icon: '/images/logo512.png',
    version: '1.1.0',
    cdnUrl: 'https://cdn.example.com/plugins/filesharing.js',
    readme:
      'This plugin lets users upload and share files within the community.\n\nFeatures:\n- Secure uploads\n- File previews',
    screenshots: ['/images/logo512.png'],
    homepage: 'https://talawa.io/filesharing',
    license: 'MIT',
    tags: ['files', 'sharing'],
    downloads: 800000,
    rating: 4.4,
  },
  forums: {
    id: 'forums',
    name: 'Forums',
    description: 'A plugin for threaded community discussions.',
    author: 'Talawa Team',
    icon: '/images/logo512.png',
    version: '2.0.0',
    cdnUrl: 'https://cdn.example.com/plugins/forums.js',
    readme:
      'Facilitates structured discussions with threads and moderation.\n\nFeatures:\n- Threaded replies\n- Moderation tools',
    screenshots: ['/images/logo512.png'],
    homepage: 'https://talawa.io/forums',
    license: 'MIT',
    tags: ['forums', 'discussion'],
    downloads: 600000,
    rating: 4.3,
  },
  donations: {
    id: 'donations',
    name: 'Donations',
    description:
      'Allows collection of donations via multiple payment gateways.',
    author: 'Talawa Team',
    icon: '/images/logo512.png',
    version: '1.3.0',
    cdnUrl: 'https://cdn.example.com/plugins/donations.js',
    readme:
      'Enable your community to accept and track donations easily.\n\nFeatures:\n- Multiple payment gateways\n- Donation tracking',
    screenshots: ['/images/logo512.png'],
    homepage: 'https://talawa.io/donations',
    license: 'MIT',
    tags: ['donations', 'payments'],
    downloads: 400000,
    rating: 4.2,
  },
  analytics: {
    id: 'analytics',
    name: 'Analytics',
    description: 'Provides usage statistics and insights.',
    author: 'Talawa Team',
    icon: '/images/logo512.png',
    version: '1.0.1',
    cdnUrl: 'https://cdn.example.com/plugins/analytics.js',
    readme:
      'Track and analyze user engagement within your community.\n\nFeatures:\n- User analytics\n- Engagement graphs',
    screenshots: ['/images/logo512.png'],
    homepage: 'https://talawa.io/analytics',
    license: 'MIT',
    tags: ['analytics', 'insights'],
    downloads: 300000,
    rating: 4.1,
  },
};

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

  // Lazy load details when modal opens
  useEffect(() => {
    if (show && pluginId) {
      setFetching(true);
      setTab('Details');
      setTimeout(() => {
        setDetails(dummyDetails[pluginId] || null);
        setFetching(false);
      }, 600);
    } else {
      setDetails(null);
      setFetching(false);
    }
  }, [show, pluginId]);

  // Use details if loaded, else fallback to meta
  const plugin = details || meta;

  // Dummy features and changelog
  const features = details?.readme
    ? details.readme
        .split('Features:')[1]
        ?.split('\n')
        .filter((line) => line.trim().startsWith('-'))
        .map((line) => line.replace('-', '').trim())
    : [];
  const changelog = [
    {
      version: details?.version || '1.0.0',
      date: '2024-06-01',
      changes: ['Initial release', 'Bug fixes', 'Performance improvements'],
    },
  ];

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
                      ? 'secondary'
                      : 'success'
                  }
                  className="w-100 mb-2"
                  onClick={() =>
                    togglePluginStatus(
                      meta,
                      getInstalledPlugin(plugin.name)?.status === 'active'
                        ? 'inactive'
                        : 'active',
                    )
                  }
                  disabled={loading}
                >
                  {getInstalledPlugin(plugin.name)?.status === 'active'
                    ? 'Deactivate'
                    : 'Activate'}
                </Button>
                <Button
                  variant="danger"
                  className="w-100"
                  onClick={() => uninstallPlugin(meta)}
                  disabled={loading}
                >
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
