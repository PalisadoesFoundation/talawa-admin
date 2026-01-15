/**
 * UserScreen component serves as the main layout for the user portal.
 * It manages the sidebar visibility, handles routing, and displays
 * the appropriate content based on the current route and organization ID.
 *
 * @remarks
 * - Redirects to the home page if `orgId` is not present in the URL.
 * - Dynamically updates the Redux store with targets based on the `orgId`.
 * - Adjusts the sidebar visibility based on the screen width.
 *
 *
 * ### Internal Functions
 * - `handleResize`: Toggles the sidebar visibility based on the screen width.
 *
 * ### Hooks
 * - `useEffect`:
 *   - Updates targets in the Redux store when `orgId` changes.
 *   - Sets up and cleans up the window resize event listener.
 *
 * ### Dependencies
 * - `react-router-dom` for routing and navigation.
 * - `react-redux` for state management.
 * - `react-bootstrap` for UI components.
 * - `react-i18next` for internationalization.
 *
 * @param props - The props for the UserSidebar component:
 * - `orgId`: The organization ID retrieved from the URL parameters.
 * - `hideDrawer`: State to manage the visibility of the sidebar.
 * - `targets`: List of user-specific routes fetched from the Redux store.
 *
 * @returns A JSX.Element representing the rendered UserScreen component.
 *
 * @example
 * ```tsx
 * <Route path="/user/:orgId/*" element={<UserScreen />} />
 * ```
 */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useLocation, useParams } from 'react-router';
import { updateTargets } from 'state/action-creators';
import { useAppDispatch } from 'state/hooks';
import type { RootState } from 'state/reducers';
import type { TargetsType } from 'state/reducers/routesReducer';
import styles from './UserScreen.module.css';
import UserSidebarOrg from 'components/UserPortal/UserSidebarOrg/UserSidebarOrg';
import UserSidebar from 'components/UserPortal/UserSidebar/UserSidebar';
import type { InterfaceMapType } from 'utils/interfaces';
import { useTranslation } from 'react-i18next';
import useLocalStorage from 'utils/useLocalstorage';
const map: InterfaceMapType = {
  organization: 'home',
  people: 'people',
  events: 'userEvents',
  donate: 'donate',
  transactions: 'transactions',
  chat: 'userChat',
  campaigns: 'userCampaigns',
  pledges: 'userPledges',
  volunteer: 'userVolunteer',
  leaveorg: 'leaveOrganization',
  notification: 'notification',
  organizations: 'userOrganizations',
  settings: 'settings',
};

const UserScreen = (): React.JSX.Element => {
  // Get the current location path for debugging or conditional rendering
  const location = useLocation();
  const { getItem, setItem } = useLocalStorage();
  const [hideDrawer, setHideDrawer] = useState<boolean>(() => {
    const stored = getItem('sidebar');
    return stored === 'true';
  });

  const { orgId } = useParams();

  // Note: some user routes (for example global user pages like /user/notification)
  // don't include an `orgId`. In that case render the global user sidebar
  // instead of redirecting to home.

  /* titleKey defaults to 'common' when the path segment is not found in the map.
   * This allows using the existing 'common.title' ("User Portal") from translation.json
   * without adding a new root-level title key.
   */
  const titleKey: string = map[location.pathname.split('/')[2]] || 'common';
  const { t: tScoped } = useTranslation('translation', { keyPrefix: titleKey });

  const userRoutes: { targets: TargetsType[] } = useSelector(
    (state: RootState) => state.userRoutes,
  );

  const { targets } = userRoutes;

  /**
   * Retrieves the organization ID from the URL parameters.
   */

  // Initialize Redux dispatch
  const dispatch = useAppDispatch();

  /**
   * Effect hook to update targets based on the organization ID.
   * This hook is triggered when the orgId changes.
   */
  useEffect(() => {
    if (orgId) {
      dispatch(updateTargets(orgId));
    }
  }, [orgId]);

  /**
   * Handles window resize events to toggle the sidebar visibility
   * based on the screen width.
   */
  const handleResize = (): void => {
    if (window.innerWidth <= 820) {
      setHideDrawer(true);
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
      <div className={styles.drawer}>
        {orgId ? (
          <UserSidebarOrg
            orgId={orgId}
            targets={targets}
            hideDrawer={hideDrawer}
            setHideDrawer={setHideDrawer}
          />
        ) : (
          <UserSidebar hideDrawer={hideDrawer} setHideDrawer={setHideDrawer} />
        )}
      </div>
      <div
        className={`${hideDrawer ? styles.expand : styles.contract} ${hideDrawer ? styles.contentContainer : ''}`}
        data-testid="mainpageright"
      >
        <div className="d-flex justify-content-between align-items-center">
          <div className={styles.titleContainer}>
            <h1>{tScoped('title')}</h1>
          </div>
          {/* <ProfileDropdown /> */}
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default UserScreen;
