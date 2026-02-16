/**
 * Main screen layout for the Super Admin interface.
 *
 * Includes a collapsible sidebar (`LeftDrawer`), dynamic page titles based on the current route,
 * and a profile dropdown for user actions. The layout is responsive and adapts to window size.
 *
 * @remarks
 * - Sidebar visibility is toggled based on window width or user interaction.
 * - Page titles are dynamically translated using `react-i18next`.
 * - Route segments are mapped to translation keys via the `map` object.
 *
 * @returns The rendered `SuperAdminScreen` component.
 *
 * @example
 * ```tsx
 * import SuperAdminScreen from './SuperAdminScreen';
 *
 * function App() {
 *   return <SuperAdminScreen />;
 * }
 * ```
 */

import LeftDrawer from 'components/AdminPortal/LeftDrawer/LeftDrawer';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router';
import styles from './SuperAdminScreen.module.css';
import useLocalStorage from 'utils/useLocalstorage';

const superAdminScreen = (): React.ReactElement => {
  const location = useLocation();
  const { getItem, setItem } = useLocalStorage();
  const segment = location.pathname.split('/')[2] || 'default';
  const titleKey = map[segment] ?? map.default;
  const { t } = useTranslation('translation', { keyPrefix: titleKey });
  const [hideDrawer, setHideDrawer] = useState<boolean>(() => {
    const stored = getItem('sidebar');
    return stored === 'true';
  });

  /**
   * Handles resizing of the window to show or hide the sidebar.
   */
  const handleResize = (): void => {
    if (window.innerWidth <= 820) {
      setHideDrawer(!hideDrawer);
    }
  };

  // Set up event listener for window resize
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setItem('sidebar', hideDrawer.toString());
  }, [hideDrawer, setItem]);

  return (
    <>
      {/* {hideDrawer ? (
        <Button
          className={styles.opendrawer}
          onClick={(): void => {
            setHideDrawer(!hideDrawer);
          }}
          data-testid="openMenu"
        >
          <i className="fa fa-angle-double-right" aria-hidden="true"></i>
        </Button>
      ) : (
        <Button
          className={styles.collapseSidebarButton}
          onClick={(): void => {
            setHideDrawer(!hideDrawer);
          }}
          data-testid="closeMenu"
        >
          <i className="fa fa-angle-double-left" aria-hidden="true"></i>
        </Button>
      )} */}

      <LeftDrawer hideDrawer={hideDrawer} setHideDrawer={setHideDrawer} />
      <div
        className={`${styles.pageContainer} ${hideDrawer ? styles.expand : styles.contract} `}
        data-testid="mainpageright"
      >
        <div>
          <div className={`${styles.navContainer}`}>
            <h1>{t('title')}</h1>
          </div>
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default superAdminScreen;

/**
 * Map of route segments to translation keys for page titles.
 */
const map: Record<
  string,
  | 'orgList'
  | 'requests'
  | 'users'
  | 'memberDetail'
  | 'communityProfile'
  | 'pluginStore'
  | 'notification'
  | 'adminProfile'
> = {
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
