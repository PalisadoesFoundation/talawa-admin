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

export default superAdminScreen;
