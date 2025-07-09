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

import LeftDrawer from 'components/LeftDrawer/LeftDrawer';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router';
import styles from 'style/app-fixed.module.css';
import ProfileDropdown from 'components/ProfileDropdown/ProfileDropdown';

const superAdminScreen = (): React.ReactElement => {
  const location = useLocation();
  const titleKey = map[location.pathname.split('/')[1]];
  const { t } = useTranslation('translation', { keyPrefix: titleKey });
  const [hideDrawer, setHideDrawer] = useState<boolean | null>(null);

  /**
   * Handles resizing of the window to show or hide the sidebar.
   */
  const handleResize = (): void => {
    if (window.innerWidth <= 820) {
      setHideDrawer(!hideDrawer);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {hideDrawer ? (
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
      )}

      <LeftDrawer hideDrawer={hideDrawer} setHideDrawer={setHideDrawer} />
      <div
        className={`${styles.pageContainer} ${
          hideDrawer === null
            ? ''
            : hideDrawer
              ? styles.expand
              : styles.contract
        } `}
        data-testid="mainpageright"
      >
        <div>
          <div className={`${styles.navContainer}`}>
            <h1>{t('title')}</h1>
            <ProfileDropdown />
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
> = {
  orglist: 'orgList',
  requests: 'requests',
  users: 'users',
  member: 'memberDetail',
  communityProfile: 'communityProfile',
  pluginstore: 'pluginStore',
};
