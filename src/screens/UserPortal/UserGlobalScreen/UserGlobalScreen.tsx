/**
 * UserGlobalScreen component serves as the main layout for user global routes.
 * It manages the sidebar visibility and displays content for routes that don't require an orgId.
 *
 * @component
 *
 * @remarks
 * - Uses UserSidebar instead of UserSidebarOrg since no orgId is required.
 * - Adjusts the sidebar visibility based on the screen width.
 * - Renders the Outlet for nested routes.
 *
 * @returns {JSX.Element} The rendered UserGlobalScreen component.
 *
 * @example
 * ```tsx
 * <Route path="/user/test/global" element={<UserGlobalScreen />} />
 * ```
 *
 * @property {boolean | null} hideDrawer - State to manage the visibility of the sidebar.
 *
 * @function handleResize
 * Toggles the sidebar visibility based on the screen width.
 *
 * @hook useEffect
 * Sets up and cleans up the window resize event listener.
 */
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import styles from 'style/app-fixed.module.css';
import Button from 'react-bootstrap/Button';
import UserSidebar from 'components/UserPortal/UserSidebar/UserSidebar';
import ProfileDropdown from 'components/ProfileDropdown/ProfileDropdown';

const UserGlobalScreen = (): JSX.Element => {
  const [hideDrawer, setHideDrawer] = useState<boolean>(false);

  /**
   * Handles window resize events to toggle the sidebar visibility
   * based on the screen width.
   */
  const handleResize = (): void => {
    if (window.innerWidth <= 820) {
      setHideDrawer(!hideDrawer);
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
      <div className={styles.drawer}>
        <UserSidebar hideDrawer={hideDrawer} setHideDrawer={setHideDrawer} />
      </div>
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
        <div className="d-flex justify-content-between align-items-center">
          <div style={{ flex: 1 }}>
            <h1>Global Features</h1>
          </div>
          <ProfileDropdown />
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default UserGlobalScreen;
