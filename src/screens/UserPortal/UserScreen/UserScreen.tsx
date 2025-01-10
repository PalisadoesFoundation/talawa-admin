import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import { updateTargets } from 'state/action-creators';
import { useAppDispatch } from 'state/hooks';
import type { RootState } from 'state/reducers';
import type { TargetsType } from 'state/reducers/routesReducer';
import styles from './UserScreen.module.css';
import { Button } from 'react-bootstrap';
import UserSidebarOrg from 'components/UserPortal/UserSidebarOrg/UserSidebarOrg';
import ProfileDropdown from 'components/ProfileDropdown/ProfileDropdown';
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

/**
 * The UserScreen component serves as a container for user-specific pages
 * within an organization context. It provides layout and sidebar navigation
 * functionality based on the current organization ID and user roles.
 *
 * @returns The UserScreen component.
 */
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

  const userRoutes: {
    targets: TargetsType[];
  } = useSelector((state: RootState) => state.userRoutes);

  const { targets } = userRoutes;
  const [hideDrawer, setHideDrawer] = useState<boolean | null>(null);

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
        <UserSidebarOrg
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
          <ProfileDropdown />
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default UserScreen;
