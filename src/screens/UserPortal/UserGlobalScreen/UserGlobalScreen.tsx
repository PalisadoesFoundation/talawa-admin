/**
 * Main layout for user routes that do not require an orgId.
 * Manages sidebar visibility and displays nested content via the router outlet.
 *
 * @returns {JSX.Element} The rendered UserGlobalScreen component.
 *
 * @remarks
 * - Uses UserSidebar instead of UserSidebarOrg because no orgId is needed.
 * - Hides the sidebar on narrow screens and shows it on wider screens.
 * - Renders the page title area without a profile dropdown.
 *
 * @example
 * ```tsx
 * <Route path="/user/test/global" element={<UserGlobalScreen />} />
 * ```
 */
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import styles from 'style/app-fixed.module.css';
import localStyles from './UserGlobalScreen.module.css';
import UserSidebar from 'components/UserPortal/UserSidebar/UserSidebar';
import { UserPortalNavigationBar } from 'components/UserPortal/UserPortalNavigationBar/UserPortalNavigationBar';

const UserGlobalScreen = (): JSX.Element => {
  const { t } = useTranslation('translation');
  const [hideDrawer, setHideDrawer] = useState<boolean>(false);

  /**
   * Handles window resize events to toggle the sidebar visibility
   * based on the screen width.
   */
  const handleResize = (): void => {
    if (window.innerWidth <= 820) {
      setHideDrawer(true); // Hide on mobile
    } else {
      setHideDrawer(false); // Show on desktop
    }
  };

  // Set up event listener for window resize and clean up on unmount
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const location = useLocation();
  const currentPage = location.pathname;
  return (
    <div className={localStyles.pageContainer}>
      <UserPortalNavigationBar
        mode="user"
        variant="dark"
        currentPage={currentPage}
      />
      <div className={localStyles.flexContainer}>
        <div className={styles.drawer}>
          <UserSidebar hideDrawer={hideDrawer} setHideDrawer={setHideDrawer} />
        </div>
        <div
          className={`${hideDrawer ? styles.expand : styles.contract} ${localStyles.mainContent}`}
          data-testid="mainpageright"
        >
          <div className="d-flex justify-content-between align-items-center">
            <div className={localStyles.titleWrapper}>
              <h1>{t('userGlobalScreen.title')}</h1>
            </div>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserGlobalScreen;
