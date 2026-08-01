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
import Button from 'shared-components/Button/Button';
import {
  IconHome,
  IconPeople,
  IconCalendar,
  IconChat,
  IconDonate,
  IconVolunteer,
  IconOrganizations,
  IconBell,
  IconSettings,
} from './icons';
import { UserNavItem } from './UserNavItem';

interface InterfaceUserSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  orgName?: string;
  avatarURL?: string;
}

export default function UserSidebarComponent({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  orgName,
  avatarURL,
}: InterfaceUserSidebarProps): React.ReactElement {
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

        <Button
          variant="plain"
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
        </Button>

        <div className="context-switcher">
          <Button
            variant="plain"
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
          </Button>
          <Button
            variant="plain"
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
          </Button>
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
            {avatarURL ? (
              <img
                src={avatarURL}
                alt=""
                className="sidebar-org-avatar"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="sidebar-org-avatar">
                {orgName?.slice(0, 2).toUpperCase() || 'O'}
              </div>
            )}
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
                className="sidebar-user-profile-avatar"
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
