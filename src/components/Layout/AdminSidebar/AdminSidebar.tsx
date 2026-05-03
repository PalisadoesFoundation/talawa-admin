/**
 * AdminSidebar — Talawa dark sidebar for admin portal.
 *
 * Features:
 * - Context switcher (Admin/User)
 * - Collapsible (icon-only mode with tooltips)
 * - SVG Lucide-style icons
 * - Green accent active state with left bar indicator
 * - Org selector (when orgId is present)
 * - Profile section at bottom
 * - Mobile: slides in/out via hamburger in Topbar
 *
 * @remarks
 * This component replaces LeftDrawer and LeftDrawerOrg.
 * It reads the current route to determine which nav item is active.
 */
import React, { useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import useLocalStorage from 'utils/useLocalstorage';
import { sanitizeAvatarURL } from 'utils/sanitizeAvatar';
import SignOut from 'components/SignOut/SignOut';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  /** 'super' for global admin views, 'org' for org-specific views */
  variant: 'super' | 'org';
  /** Organization name (for org variant) */
  orgName?: string;
}

export default function AdminSidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  variant,
  orgName,
}: AdminSidebarProps): React.ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
  const { orgId } = useParams();
  const { getItem } = useLocalStorage();
  const { t } = useTranslation('common');

  const userName = (getItem('name') as string) || 'User';
  const userEmail = (getItem('email') as string) || '';
  const userImage = sanitizeAvatarURL(getItem('UserImage') as string);
  const initials = userName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Close mobile sidebar on route change
  useEffect(() => {
    onCloseMobile();
  }, [location.pathname]);

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) onCloseMobile();
    },
    [mobileOpen, onCloseMobile],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Determine active route segment
  const pathSegments = location.pathname.split('/');
  const activeSegment = pathSegments[2] || '';

  const isActive = (segment: string): boolean => activeSegment === segment;

  const sidebarClasses = [
    'sidebar',
    collapsed ? 'collapsed' : '',
    mobileOpen ? 'mobile-open' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <aside className={sidebarClasses} aria-label="Main navigation">
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">T</div>
          <span className="sidebar-brand-text">Talawa</span>
        </div>

        {/* Collapse toggle */}
        <button
          className="sidebar-collapse-btn"
          title="Toggle sidebar"
          onClick={onToggleCollapse}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 17l-5-5 5-5" />
            <path d="M18 17l-5-5 5-5" />
          </svg>
        </button>

        {/* Context Switcher */}
        <div className="context-switcher">
          <button
            className="context-btn active"
            data-context="admin"
            onClick={() => {
              if (orgId) {
                navigate(`/admin/orgdash/${orgId}`);
              } else {
                navigate('/admin/orglist');
              }
            }}
          >
            <span className="icon">
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M12 15l-2-2h-4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-4l-2 2z" />
              </svg>
            </span>
            <span className="ctx-label">Admin</span>
          </button>
          <button
            className="context-btn"
            data-context="user"
            onClick={() => navigate('/user/organizations')}
          >
            <span className="icon">
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" />
                <path d="M20 21a8 8 0 0 0-16 0" />
              </svg>
            </span>
            <span className="ctx-label">User</span>
          </button>
        </div>

        {/* Org selector (org variant only) */}
        {variant === 'org' && orgId && (
          <div
            className="sidebar-org"
            role="button"
            tabIndex={0}
            onClick={() => navigate('/admin/orglist')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') navigate('/admin/orglist');
            }}
          >
            <div className="sidebar-org-avatar">
              {(orgName || 'Org').substring(0, 2).toUpperCase()}
            </div>
            <div className="sidebar-org-info">
              <div className="sidebar-org-name">
                {orgName || t('organization')}
              </div>
              <div className="sidebar-org-label">{t('organization')}</div>
            </div>
            <span className="sidebar-org-chevron">›</span>
          </div>
        )}

        {/* Navigation */}
        <div className="sidebar-section">
          {variant === 'super' && (
            <div className="sidebar-section-label">Super Admin</div>
          )}
          <ul className="sidebar-nav">
            {variant === 'super' ? (
              <>
                <NavItem
                  href="/admin/orglist"
                  label={t('myOrganizations')}
                  icon={IconOrganizations}
                  active={isActive('orglist')}
                  tooltip="Organizations"
                />
                <NavItem
                  href="/admin/users"
                  label={t('users')}
                  icon={IconUsers}
                  active={isActive('users')}
                  tooltip="Users"
                />
                <NavItem
                  href="/admin/communityProfile"
                  label={t('communityProfile')}
                  icon={IconCommunity}
                  active={isActive('communityProfile')}
                  tooltip="Community"
                />
                <NavItem
                  href="/admin/pluginstore"
                  label={t('pluginStore')}
                  icon={IconPlugins}
                  active={isActive('pluginstore')}
                  tooltip="Plugins"
                />
                <NavItem
                  href="/admin/notification"
                  label={t('notifications')}
                  icon={IconBell}
                  active={isActive('notification')}
                  tooltip="Notifications"
                />
              </>
            ) : (
              <>
                <NavItem
                  href={`/admin/orgdash/${orgId}`}
                  label={t('dashboard')}
                  icon={IconDashboard}
                  active={isActive('orgdash')}
                  tooltip="Dashboard"
                />
                <NavItem
                  href={`/admin/orgpeople/${orgId}`}
                  label={t('members')}
                  icon={IconUsers}
                  active={isActive('orgpeople')}
                  tooltip="Members"
                />
                <NavItem
                  href={`/admin/orgevents/${orgId}`}
                  label={t('events')}
                  icon={IconCalendar}
                  active={isActive('orgevents')}
                  tooltip="Events"
                />
                <NavItem
                  href={`/admin/orgpost/${orgId}`}
                  label={t('posts')}
                  icon={IconPosts}
                  active={isActive('orgpost')}
                  tooltip="Posts"
                />
                <NavItem
                  href={`/admin/orgchat/${orgId}`}
                  label={t('chat')}
                  icon={IconChat}
                  active={isActive('orgchat')}
                  tooltip="Chat"
                />
                <NavItem
                  href={`/admin/orgfunds/${orgId}`}
                  label={t('funds')}
                  icon={IconFunds}
                  active={isActive('orgfunds')}
                  tooltip="Funds"
                />
                <NavItem
                  href={`/admin/orgvenues/${orgId}`}
                  label={t('venues')}
                  icon={IconVenues}
                  active={isActive('orgvenues')}
                  tooltip="Venues"
                />
                <NavItem
                  href={`/admin/requests/${orgId}`}
                  label={t('requests')}
                  icon={IconRequests}
                  active={isActive('requests')}
                  tooltip="Requests"
                />
                <NavItem
                  href={`/admin/blockuser/${orgId}`}
                  label={t('blockedUsers')}
                  icon={IconBlocked}
                  active={isActive('blockuser')}
                  tooltip="Blocked"
                />
              </>
            )}
          </ul>
        </div>

        {/* Settings section (org variant) */}
        {variant === 'org' && orgId && (
          <div className="sidebar-section">
            <div className="sidebar-section-label">{t('settings')}</div>
            <ul className="sidebar-nav">
              <NavItem
                href={`/admin/orgsetting/${orgId}`}
                label={t('general')}
                icon={IconSettings}
                active={isActive('orgsetting')}
                tooltip="Settings"
              />
              <NavItem
                href="/admin/pluginstore"
                label={t('plugins')}
                icon={IconPlugins}
                active={isActive('pluginstore')}
                tooltip="Plugins"
              />
            </ul>
          </div>
        )}

        <div className="sidebar-spacer" />

        {/* Sign Out */}
        <SignOut hideDrawer={collapsed} />

        {/* Profile */}
        <div
          className="sidebar-profile"
          role="button"
          tabIndex={0}
          onClick={() => navigate('/admin/profile')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') navigate('/admin/profile');
          }}
        >
          <div className="sidebar-profile-avatar">
            {userImage ? (
              <img
                src={userImage}
                alt=""
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              initials
            )}
          </div>
          <div>
            <div className="sidebar-profile-name">{userName}</div>
            <div className="sidebar-profile-email">{userEmail}</div>
          </div>
          <div className="sidebar-profile-dot" aria-hidden="true" />
        </div>
      </aside>

      {/* Mobile backdrop */}
      <div
        className={`sidebar-backdrop ${mobileOpen ? 'show' : ''}`}
        onClick={onCloseMobile}
      />
    </>
  );
}

/* ── Nav Item ────────────────────────────────────────────────────────────── */
function NavItem({
  href,
  label,
  icon: Icon,
  active,
  tooltip,
}: {
  href: string;
  label: string;
  icon: React.FC;
  active: boolean;
  tooltip: string;
}) {
  const navigate = useNavigate();
  return (
    <li>
      <a
        href={href}
        className={`sidebar-nav-item ${active ? 'active' : ''}`}
        aria-current={active ? 'page' : undefined}
        data-tooltip={tooltip}
        title={tooltip}
        onClick={(e) => {
          e.preventDefault();
          navigate(href);
        }}
      >
        <span className="icon">
          <Icon />
        </span>
        <span className="nav-label">{label}</span>
      </a>
    </li>
  );
}

/* ── SVG Icons (Lucide-style, stroke-based) ──────────────────────────────── */
const IconDashboard = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);
const IconUsers = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconCalendar = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const IconPosts = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);
const IconChat = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const IconFunds = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);
const IconVenues = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IconRequests = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
);
const IconBlocked = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
);
const IconSettings = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const IconPlugins = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <rect x="2" y="2" width="8" height="8" rx="1" />
    <rect x="14" y="2" width="8" height="8" rx="1" />
    <rect x="2" y="14" width="8" height="8" rx="1" />
    <path d="M14 18h8M18 14v8" />
  </svg>
);
const IconBell = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const IconOrganizations = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a4 4 0 0 0-8 0v2" />
  </svg>
);
const IconCommunity = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
