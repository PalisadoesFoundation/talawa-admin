/**
 * UserSidebar — Talawa dark sidebar for user portal.
 *
 * Same visual design as AdminSidebar but with user-specific nav items.
 * Context switcher shows "User" as active.
 */
import React, { useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import useLocalStorage from 'utils/useLocalstorage';
import SignOut from 'components/SignOut/SignOut';
import { sanitizeAvatarURL } from 'utils/sanitizeAvatar';

interface UserSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  orgName?: string;
}

export default function UserSidebarComponent({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  orgName,
}: UserSidebarProps): React.ReactElement {
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

  useEffect(() => {
    onCloseMobile();
  }, [location.pathname]);

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
      <aside className={sidebarClasses} aria-label="User navigation">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">T</div>
          <span className="sidebar-brand-text">Talawa</span>
        </div>

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

        <div className="context-switcher">
          <button
            className="context-btn"
            data-context="admin"
            onClick={() => navigate('/admin/orglist')}
          >
            <span className="icon">
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M12 15l-2-2h-4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-4l-2 2z" />
              </svg>
            </span>
            <span className="ctx-label">Admin</span>
          </button>
          <button
            className="context-btn active"
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

        {orgId && (
          <div
            className="sidebar-org"
            role="button"
            tabIndex={0}
            onClick={() => navigate('/user/organizations')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') navigate('/user/organizations');
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

        <div className="sidebar-section">
          <ul className="sidebar-nav">
            {orgId ? (
              <>
                <UserNavItem
                  href={`/user/organization/${orgId}`}
                  label={t('home')}
                  icon={IconHome}
                  active={isActive('organization')}
                  tooltip="Home"
                />
                <UserNavItem
                  href={`/user/people/${orgId}`}
                  label={t('people')}
                  icon={IconPeople}
                  active={isActive('people')}
                  tooltip="People"
                />
                <UserNavItem
                  href={`/user/events/${orgId}`}
                  label={t('events')}
                  icon={IconCalendar}
                  active={isActive('events')}
                  tooltip="Events"
                />
                <UserNavItem
                  href={`/user/chat/${orgId}`}
                  label={t('chat')}
                  icon={IconChat}
                  active={isActive('chat')}
                  tooltip="Chat"
                />
                <UserNavItem
                  href={`/user/donate/${orgId}`}
                  label={t('donate')}
                  icon={IconDonate}
                  active={isActive('donate')}
                  tooltip="Donate"
                />
                <UserNavItem
                  href={`/user/volunteer/${orgId}`}
                  label={t('volunteer')}
                  icon={IconVolunteer}
                  active={isActive('volunteer')}
                  tooltip="Volunteer"
                />
              </>
            ) : (
              <>
                <UserNavItem
                  href="/user/organizations"
                  label={t('organizations')}
                  icon={IconOrganizations}
                  active={isActive('organizations')}
                  tooltip="Organizations"
                />
                <UserNavItem
                  href="/user/notification"
                  label={t('notifications')}
                  icon={IconBell}
                  active={isActive('notification')}
                  tooltip="Notifications"
                />
                <UserNavItem
                  href="/user/settings"
                  label={t('settings')}
                  icon={IconSettings}
                  active={isActive('settings')}
                  tooltip="Settings"
                />
              </>
            )}
          </ul>
        </div>

        <div className="sidebar-spacer" />

        <SignOut hideDrawer={collapsed} />

        <div
          className="sidebar-profile"
          role="button"
          tabIndex={0}
          onClick={() => navigate('/user/settings')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') navigate('/user/settings');
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

      <div
        className={`sidebar-backdrop ${mobileOpen ? 'show' : ''}`}
        onClick={onCloseMobile}
      />
    </>
  );
}

/* ── Nav Item ────────────────────────────────────────────────────────────── */
function UserNavItem({
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

/* ── SVG Icons ───────────────────────────────────────────────────────────── */
const IconHome = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const IconPeople = () => (
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
const IconChat = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const IconDonate = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const IconVolunteer = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" />
    <line x1="10" y1="1" x2="10" y2="4" />
    <line x1="14" y1="1" x2="14" y2="4" />
  </svg>
);
const IconOrganizations = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a4 4 0 0 0-8 0v2" />
  </svg>
);
const IconBell = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const IconSettings = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
