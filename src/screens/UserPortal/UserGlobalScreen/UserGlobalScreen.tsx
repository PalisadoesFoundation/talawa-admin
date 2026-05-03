/**
 * UserGlobalScreen — layout for user routes without orgId.
 *
 * Uses UserSidebar in global mode (no org selector, shows Organizations/Notifications/Settings).
 */
import React, { useEffect, useState, useCallback } from 'react';
import { Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';
import useLocalStorage from 'utils/useLocalstorage';
import UserSidebarComponent from 'components/Layout/UserSidebar/UserSidebar';
import Topbar from 'components/Layout/Topbar/Topbar';

const UserGlobalScreen = (): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userGlobalScreen',
  });
  const { getItem, setItem } = useLocalStorage();

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    return getItem('sidebarCollapsed') === 'true';
  });
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

  useEffect(() => {
    document.body.classList.toggle('sidebar-collapsed', collapsed);
  }, [collapsed]);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <UserSidebarComponent
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={handleCloseMobile}
      />

      <Topbar
        title={t('globalFeatures')}
        onHamburgerClick={handleOpenMobile}
      />

      <main id="main-content" className="main" data-testid="mainpageright">
        <Outlet />
      </main>
    </>
  );
};

export default UserGlobalScreen;
