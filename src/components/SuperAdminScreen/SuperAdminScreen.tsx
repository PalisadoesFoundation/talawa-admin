<<<<<<< HEAD
import LeftDrawer from 'components/LeftDrawer/LeftDrawer';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router-dom';
import styles from './SuperAdminScreen.module.css';
import ProfileDropdown from 'components/ProfileDropdown/ProfileDropdown';

const superAdminScreen = (): JSX.Element => {
  const location = useLocation();
  const titleKey = map[location.pathname.split('/')[1]];
  const { t } = useTranslation('translation', { keyPrefix: titleKey });
  const [hideDrawer, setHideDrawer] = useState<boolean | null>(null);

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
      <LeftDrawer hideDrawer={hideDrawer} setHideDrawer={setHideDrawer} />
=======
import MenuIcon from '@mui/icons-material/Menu';
import LeftDrawer from 'components/LeftDrawer/LeftDrawer';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import styles from './SuperAdminScreen.module.css';

export interface InterfaceSuperAdminScreenProps {
  title: string; // Multilingual Page title
  screenName: string; // Internal Screen name for developers
  children: React.ReactNode;
}
const superAdminScreen = ({
  title,
  screenName,
  children,
}: InterfaceSuperAdminScreenProps): JSX.Element => {
  const [hideDrawer, setHideDrawer] = useState<boolean | null>(null);

  return (
    <>
      <LeftDrawer
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
            <h2>{t('title')}</h2>
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

export default superAdminScreen;
<<<<<<< HEAD

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
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
