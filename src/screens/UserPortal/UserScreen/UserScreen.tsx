/**
 * UserScreen component serves as the main layout for the user portal.
 * It manages the sidebar visibility, handles routing, and displays
 * the appropriate content based on the current route and organization ID.
 *
 * @component
 *
 * @remarks
 * - Redirects to the home page if `orgId` is not present in the URL.
 * - Dynamically updates the Redux store with targets based on the `orgId`.
 * - Adjusts the sidebar visibility based on the screen width.
 *
 * @returns {JSX.Element} The rendered UserScreen component.
 *
 * @example
 * ```tsx
 * <Route path="/user/:orgId/*" element={<UserScreen />} />
 * ```
 *
 * @property {string} orgId - The organization ID retrieved from the URL parameters.
 * @property {boolean | null} hideDrawer - State to manage the visibility of the sidebar.
 * @property {TargetsType[]} targets - List of user-specific routes fetched from the Redux store.
 *
 * @function handleResize
 * Toggles the sidebar visibility based on the screen width.
 *
 * @hook useEffect
 * - Updates targets in the Redux store when `orgId` changes.
 * - Sets up and cleans up the window resize event listener.
 *
 * @dependencies
 * - `react-router-dom` for routing and navigation.
 * - `react-redux` for state management.
 * - `react-bootstrap` for UI components.
 * - `react-i18next` for internationalization.
 */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation, useParams } from 'react-router';
import { updateTargets } from 'state/action-creators';
import { useAppDispatch } from 'state/hooks';
import type { RootState } from 'state/reducers';
import type { TargetsType } from 'state/reducers/routesReducer';
import styles from 'style/app-fixed.module.css';
import UserSidebarOrg from 'components/UserPortal/UserSidebarOrg/UserSidebarOrg';
import type { InterfaceMapType } from 'utils/interfaces';
import { useTranslation } from 'react-i18next';

const map: InterfaceMapType = {
  organization: 'home',
  people: 'people',
  events: 'userEvents',
  donate: 'donate',
  chat: 'userChat',
  campaigns: 'userCampaigns',
  pledges: 'userPledges',
  volunteer: 'userVolunteer',
  leaveorg: 'leaveOrganization',
};

const UserScreen = (): JSX.Element => {
  // Get the current location path for debugging or conditional rendering
  const location = useLocation();

  /**
   * State to manage the visibility of the sidebar (drawer).
   */

  const { orgId } = useParams();

  // Redirect to home if orgId is not present
  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }

  const titleKey: string | undefined = map[location.pathname.split('/')[2]];
  const { t } = useTranslation('translation', { keyPrefix: titleKey });

  const userRoutes: { targets: TargetsType[] } = useSelector(
    (state: RootState) => state.userRoutes,
  );

  const { targets } = userRoutes;
  const [hideDrawer, setHideDrawer] = useState<boolean | null>(false);

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
    dispatch(updateTargets(orgId));
  }, [orgId]);

  /**
   * Handles window resize events to toggle the sidebar visibility
   * based on the screen width.
   */
  const handleResize = (): void => {
    if (window.innerWidth <= 820) {
      setHideDrawer(true);
    } else {
      setHideDrawer(false);
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
        <UserSidebarOrg
          orgId={orgId}
          targets={targets}
          hideDrawer={hideDrawer}
          setHideDrawer={setHideDrawer}
        />
      </div>
      <div
        className={`${hideDrawer ? styles.expand : styles.contract}`}
        style={{ marginLeft: hideDrawer ? '100px' : '' }}
        data-testid="mainpageright"
      >
        <div className="d-flex justify-content-between align-items-center">
          <div style={{ flex: 1 }}>
            <h1>{t('title')}</h1>
          </div>
          {/* <ProfileDropdown /> */}
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default UserScreen;
