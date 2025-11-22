/**
 * EventDashboardScreen Component
 *
 * This component serves as the main dashboard screen for events within an organization.
 * It handles the layout, sidebar drawer functionality, and routing for various event-related
 * pages. The component also manages user authentication and organization-specific data.
 *
 * Features:
 * - Redirects users to the home page if `orgId` is missing or the user is not logged in.
 * - Dynamically updates the sidebar targets based on the selected organization.
 * - Responsive sidebar drawer that toggles visibility based on window size.
 * - Displays a title and profile dropdown in the header.
 * - Renders nested routes using React Router's `Outlet`.
 *
 * Hooks:
 * - `useLocalStorage`: Retrieves user authentication and organization data from local storage.
 * - `useSelector`: Accesses Redux store to fetch application routes and targets.
 * - `useAppDispatch`: Dispatches actions to update Redux state.
 * - `useEffect`: Handles side effects such as updating targets and managing window resize events.
 *
 * Props:
 * - None
 *
 * State:
 * - `hideDrawer` (boolean | null): Tracks the visibility of the sidebar drawer.
 *
 * Dependencies:
 * - React Router for navigation and route management.
 * - Redux for state management.
 * - `useTranslation` for internationalization.
 *
 * @returns The rendered EventDashboardScreen component.
 */
import LeftDrawerOrg from 'components/LeftDrawerOrg/LeftDrawerOrg';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation, useParams } from 'react-router';
import { updateTargets } from 'state/action-creators';
import { useAppDispatch } from 'state/hooks';
import type { RootState } from 'state/reducers';
import type { TargetsType } from 'state/reducers/routesReducer';
import styles from 'style/app-fixed.module.css';
import ProfileDropdown from 'components/ProfileDropdown/ProfileDropdown';
import useLocalStorage from 'utils/useLocalstorage';
import type { InterfaceMapType } from 'utils/interfaces';

const EventDashboardScreen = (): React.JSX.Element => {
  const { getItem } = useLocalStorage();
  const isLoggedIn = getItem('IsLoggedIn');
  const adminFor = getItem('AdminFor');
  const location = useLocation();
  const titleKey: string | undefined = map[location.pathname.split('/')[2]];
  const { t } = useTranslation('translation', { keyPrefix: titleKey });
  const [hideDrawer, setHideDrawer] = useState<boolean>(() => {
    const stored = getItem('sidebar');
    return stored === 'true';
  });
  const { orgId } = useParams();

  // Redirect to home if orgId is not present or if user is not logged in
  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }

  if (isLoggedIn === 'false') return <Navigate to="/" replace />;
  if (adminFor === null) {
    return (
      <>
        <div className={`d-flex flex-row ${styles.containerHeightEventDash}`}>
          <div
            className={`${styles.colorLight} ${styles.mainContainerEventDashboard}`}
          >
            <div
              className={`d-flex flex-row justify-content-between flex-wrap ${styles.gap}`}
            >
              <div style={{ flex: 1 }}>
                <h1>{t('title')}</h1>
              </div>
              <Outlet />
            </div>
          </div>
        </div>
      </>
    );
  }

  // Access targets from Redux store
  const appRoutes: { targets: TargetsType[] } = useSelector(
    (state: RootState) => state.appRoutes,
  );
  const { targets } = appRoutes;

  const dispatch = useAppDispatch();

  // Update targets when orgId changes
  useEffect(() => {
    dispatch(updateTargets(orgId));
  }, [orgId]);

  /**
   * Handles window resize events to toggle the visibility of the sidebar drawer.
   */
  const handleResize = (): void => {
    if (window.innerWidth <= 820 && !hideDrawer) {
      setHideDrawer(true);
    }
  };

  /**
   * Toggles the visibility of the sidebar drawer.
   */
  const toggleDrawer = (): void => {
    setHideDrawer(!hideDrawer);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [hideDrawer]);

  return (
    <>
      <button
        className={
          hideDrawer ? styles.opendrawer : styles.collapseSidebarButton
        }
        onClick={toggleDrawer}
        data-testid="toggleMenuBtn"
      >
        <i
          className={
            hideDrawer ? 'fa fa-angle-double-right' : 'fa fa-angle-double-left'
          }
          aria-hidden="true"
        ></i>
      </button>
      <div className={styles.drawer}>
        <LeftDrawerOrg
          orgId={orgId}
          targets={targets}
          hideDrawer={hideDrawer}
          setHideDrawer={setHideDrawer}
        />
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
            <h1>{t('title')}</h1>
          </div>
          <ProfileDropdown portal="admin" />
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default EventDashboardScreen;

const map: InterfaceMapType = {
  orgdash: 'dashboard',
  orgpeople: 'organizationPeople',
  requests: 'requests',
  orgads: 'advertisement',
  member: 'memberDetail',
  orgevents: 'organizationEvents',
  orgcontribution: 'orgContribution',
  orgpost: 'orgPost',
  orgfunds: 'funds',
  orgfundcampaign: 'fundCampaign',
  fundCampaignPledge: 'pledges',
  orgsetting: 'orgSettings',
  orgstore: 'addOnStore',
  blockuser: 'blockUnblockUser',
  orgvenues: 'organizationVenues',
  event: 'eventManagement',
};
