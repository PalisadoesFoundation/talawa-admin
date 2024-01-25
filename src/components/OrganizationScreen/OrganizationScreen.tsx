import LeftDrawerOrg from 'components/LeftDrawerOrg/LeftDrawerOrg';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import styles from './OrganizationScreen.module.css';
import { useSelector, useDispatch } from 'react-redux';
import type { TargetsType } from 'state/reducers/routesReducer';
import type { RootState } from 'state/reducers';
import { updateTargets } from 'state/action-creators';
import { Navigate, useParams, useLocation, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const organizationScreen = (): JSX.Element => {
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
  }, []);

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
          data-testid="menuBtn"
        >
          <i className="fa fa-angle-double-left" aria-hidden="true"></i>
        </Button>
      )}
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
            <h2>{t('title')}</h2>
          </div>
        </div>
        <Outlet />
        {/* {children} */}
      </div>
    </>
  );
};

export default organizationScreen;

const map: any = {
  orgdash: 'dashboard',
  orgpeople: 'organizationPeople',
  orgads: 'advertisement',
  member: 'memberDetail',
  orgevents: 'organizationEvents',
  orgcontribution: 'orgContribution',
  orgpost: 'orgPost',
  orgsetting: 'orgSettings',
  orgstore: 'addOnStore',
  blockuser: 'blockUnblockUser',
  event: 'blockUnblockUser',
};
