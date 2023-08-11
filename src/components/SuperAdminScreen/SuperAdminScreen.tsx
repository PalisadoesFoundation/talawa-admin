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
  const [showDrawer, setShowDrawer] = useState<boolean | null>(null);

  return (
    <>
      <LeftDrawer
        screenName={screenName}
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
      />
      <div
        className={`${styles.pageContainer} ${
          showDrawer === null
            ? ''
            : showDrawer
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
              setShowDrawer(!showDrawer);
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
