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
      </div>
    </>
  );
};

export default organizationScreen;
