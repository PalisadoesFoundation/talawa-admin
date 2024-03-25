import LeftDrawerOrg from 'components/LeftDrawerOrg/LeftDrawerOrg';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import { updateTargets } from 'state/action-creators';
import type { RootState } from 'state/reducers';
import type { TargetsType } from 'state/reducers/routesReducer';
import styles from './OrganizationScreen.module.css';
import ProfileDropdown from 'components/ProfileDropdown/profileDropdown';

const OrganizationScreen = (): JSX.Element => {
  const location = useLocation();
  const titleKey = map[location.pathname.split('/')[1]];
  const { t } = useTranslation('translation', { keyPrefix: titleKey });
  const [hideDrawer, setHideDrawer] = useState<boolean | null>(null);
  const { orgId } = useParams();

  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }

  const appRoutes: {
    targets: TargetsType[];
  } = useSelector((state: RootState) => state.appRoutes);
  const { targets } = appRoutes;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(updateTargets(orgId));
  }, [orgId]); // Added orgId to the dependency array

  const handleResize = (): void => {
    if (window.innerWidth <= 820 && !hideDrawer) {
      setHideDrawer(true);
    }
  };

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
      <Button
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
      </Button>
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

export default OrganizationScreen;

const map: any = {
  orgdash: 'dashboard',
  orgpeople: 'organizationPeople',
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
  event: 'blockUnblockUser',
};
