/**
 * Main screen layout for the Super Admin interface.
 *
 * Uses the new AdminSidebar (dark, collapsible) and Topbar (frosted glass).
 * Dynamic page titles based on route. Responsive with mobile hamburger menu.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router';
import AdminSidebar from 'components/Layout/AdminSidebar/AdminSidebar';
import Topbar from 'components/Layout/Topbar/Topbar';
import useLocalStorage from 'utils/useLocalstorage';

const SuperAdminScreen = (): React.ReactElement => {
  const location = useLocation();
  const { getItem, setItem } = useLocalStorage();
  const segment = location.pathname.split('/')[2] || 'default';
  const titleKey = map[segment] ?? map.default;
  const { t } = useTranslation('translation', { keyPrefix: titleKey });

  // Sidebar collapse state (persisted)
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    return getItem('sidebarCollapsed') === 'true';
  });

  // Mobile sidebar state
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleCollapse = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      setItem('sidebarCollapsed', next.toString());
      document.body.classList.toggle('sidebar-collapsed', next);
      return next;
    });
  }, [setItem]);

  const handleCloseMobile = useCallback(() => {
    setMobileOpen(false);
    document.body.style.overflow = '';
  }, []);

  const handleOpenMobile = useCallback(() => {
    setMobileOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  // Sync body class on mount
  useEffect(() => {
    document.body.classList.toggle('sidebar-collapsed', collapsed);
  }, [collapsed]);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <AdminSidebar
        variant="super"
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={handleCloseMobile}
      />

      <Topbar title={t('title')} onHamburgerClick={handleOpenMobile} />

      <main id="main-content" className="main" data-testid="mainpageright">
        <Outlet />
      </main>
    </>
  );
};

export default SuperAdminScreen;

/**
 * Map of route segments to translation keys for page titles.
 */
const map: Record<string, string> = {
  orglist: 'orgList',
  requests: 'requests',
  users: 'users',
  member: 'memberDetail',
  profile: 'adminProfile',
  communityProfile: 'communityProfile',
  pluginstore: 'pluginStore',
  notification: 'notification',
  default: 'orgList',
};
