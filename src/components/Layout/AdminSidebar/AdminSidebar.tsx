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
import Button from 'shared-components/Button/Button';
import {
  IconBell,
  IconOrganizations,
  IconCalendar,
  IconChat,
  IconCommunity,
  IconDashboard,
  IconFunds,
  IconPlugins,
  IconPosts,
  IconRequests,
  IconSettings,
  IconUsers,
  IconVenues,
  IconBlocked,
} from './icons';
import { NavItem } from './NavItem';

interface InterfaceAdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  /** 'super' for global admin views, 'org' for org-specific views */
  variant: 'super' | 'org';
  /** Organization name (for org variant) */
  orgName?: string;
  avatarURL?: string;
}

export default function AdminSidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  variant,
  orgName,
  avatarURL,
}: InterfaceAdminSidebarProps): React.ReactElement {
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

        {/* Context Switcher */}
        <div className="context-switcher">
          <Button
            variant="plain"
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
          </Button>
          <Button
            variant="plain"
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
          </Button>
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

      {/* Mobile backdrop */}
      <div
        className={`sidebar-backdrop ${mobileOpen ? 'show' : ''}`}
        onClick={onCloseMobile}
      />
    </>
  );
}
