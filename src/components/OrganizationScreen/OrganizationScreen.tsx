<<<<<<< HEAD
import LeftDrawerOrg from 'components/LeftDrawerOrg/LeftDrawerOrg';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import { updateTargets } from 'state/action-creators';
import type { RootState } from 'state/reducers';
import type { TargetsType } from 'state/reducers/routesReducer';
import styles from './OrganizationScreen.module.css';
import ProfileDropdown from 'components/ProfileDropdown/ProfileDropdown';

const OrganizationScreen = (): JSX.Element => {
  const location = useLocation();
  const titleKey: string | undefined = map[location.pathname.split('/')[1]];
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
=======
import MenuIcon from '@mui/icons-material/Menu';
import LeftDrawerOrg from 'components/LeftDrawerOrg/LeftDrawerOrg';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import styles from './OrganizationScreen.module.css';
import { useSelector } from 'react-redux';
import type { TargetsType } from 'state/reducers/routesReducer';
import type { RootState } from 'state/reducers';

export interface InterfaceOrganizationScreenProps {
  title: string; // Multilingual Page title
  screenName: string; // Internal Screen name for developers
  children: React.ReactNode;
}
const organizationScreen = ({
  title,
  screenName,
  children,
}: InterfaceOrganizationScreenProps): JSX.Element => {
  const [hideDrawer, setHideDrawer] = useState<boolean | null>(null);

  const appRoutes: {
    targets: TargetsType[];
    configUrl: string;
  } = useSelector((state: RootState) => state.appRoutes);
  const { targets, configUrl } = appRoutes;
  return (
    <>
      <LeftDrawerOrg
        orgId={configUrl}
        targets={targets}
        screenName={screenName}
        hideDrawer={hideDrawer}
        setHideDrawer={setHideDrawer}
      />
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      <div
        className={`${styles.pageContainer} ${
          hideDrawer === null
            ? ''
            : hideDrawer
<<<<<<< HEAD
              ? styles.expand
              : styles.contract
=======
            ? styles.expand
            : styles.contract
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        } `}
        data-testid="mainpageright"
      >
        <div className="d-flex justify-content-between align-items-center">
          <div style={{ flex: 1 }}>
<<<<<<< HEAD
            <h1>{t('title')}</h1>
          </div>
          <ProfileDropdown />
        </div>
        <Outlet />
=======
            <h2>{title}</h2>
          </div>
          <Button
            className="ms-2"
            onClick={(): void => {
              setHideDrawer(!hideDrawer);
            }}
            data-testid="menuBtn"
          >
            <MenuIcon fontSize="medium" />
          </Button>
        </div>
        {children}
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      </div>
    </>
  );
};

<<<<<<< HEAD
export default OrganizationScreen;

interface InterfaceMapType {
  [key: string]: string;
}

const map: InterfaceMapType = {
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
=======
export default organizationScreen;
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
