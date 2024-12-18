import LeftDrawerOrg from 'components/LeftDrawerOrg/LeftDrawerOrg';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import { updateTargets } from 'state/action-creators';
import { useAppDispatch } from 'state/hooks';
import type { RootState } from 'state/reducers';
import type { TargetsType } from 'state/reducers/routesReducer';
import styles from './EventDashboardScreen.module.css';
import ProfileDropdown from 'components/ProfileDropdown/ProfileDropdown';
import useLocalStorage from 'utils/useLocalstorage';
import type { InterfaceMapType } from 'utils/interfaces';

/**
 * The EventDashboardScreen component is the main dashboard view for event management.
 * It includes navigation, a sidebar, and a profile dropdown.
 *
 * @returns JSX.Element - The rendered EventDashboardScreen component.
 */
const EventDashboardScreen = (): JSX.Element => {
  const { getItem } = useLocalStorage();
  const isLoggedIn = getItem('IsLoggedIn');
  const adminFor = getItem('AdminFor');
  const location = useLocation();
  const titleKey: string | undefined = map[location.pathname.split('/')[2]];
  const { t } = useTranslation('translation', { keyPrefix: titleKey });
  const [hideDrawer, setHideDrawer] = useState<boolean | null>(null);
  const { orgId } = useParams();

  // Redirect to home if orgId is not present or if user is not logged in
  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }

  if (isLoggedIn === false) return <Navigate to="/" replace />;
  if (adminFor === null) {
    return (
      <>
        <div className={`d-flex flex-row ${styles.containerHeight}`}>
          <div className={`${styles.colorLight} ${styles.mainContainer}`}>
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
  const appRoutes: {
    targets: TargetsType[];
  } = useSelector((state: RootState) => state.appRoutes);
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
          <ProfileDropdown />
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
  orgactionitems: 'organizationActionItems',
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
