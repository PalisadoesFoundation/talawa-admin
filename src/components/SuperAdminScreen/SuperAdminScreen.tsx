/**
 * SuperAdminScreen component.
 *
 * This component serves as the main screen for the Super Admin interface.
 * It includes a collapsible sidebar (LeftDrawer), a dynamic page title based
 * on the current route, and a profile dropdown for user actions. The layout
 * adjusts responsively based on the window size.
 *
 * @component
 * @returns {JSX.Element} The rendered SuperAdminScreen component.
 *
 * @remarks
 * - The sidebar visibility is toggled based on the window width or user interaction.
 * - The page title is dynamically translated using the `react-i18next` library.
 * - The `map` object maps route segments to translation keys for page titles.
 *
 * @example
 * ```tsx
 * import SuperAdminScreen from './SuperAdminScreen';
 *
 * function App() {
 *   return <SuperAdminScreen />;
 * }
 * ```
 *
 * @see {@link LeftDrawer} for the sidebar component.
 * @see {@link ProfileDropdown} for the profile dropdown component.
 *
 * @property {boolean | null} hideDrawer - State to control the visibility of the sidebar.
 * @property {Function} setHideDrawer - Function to update the `hideDrawer` state.
 * @property {Object} map - A mapping of route segments to translation keys for page titles.
 *
 * @listens window:resize - Adjusts the sidebar visibility on window resize.
 */
import LeftDrawer from 'components/LeftDrawer/LeftDrawer';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router';
import styles from 'style/app-fixed.module.css';
import ProfileDropdown from 'components/ProfileDropdown/ProfileDropdown';

const superAdminScreen = (): JSX.Element => {
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
  'orgList' | 'requests' | 'users' | 'memberDetail' | 'communityProfile'
> = {
  orglist: 'orgList',
  requests: 'requests',
  users: 'users',
  member: 'memberDetail',
  communityProfile: 'communityProfile',
};
