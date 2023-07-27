import MenuIcon from '@mui/icons-material/Menu';
import LeftDrawer from 'components/LeftDrawer/LeftDrawer';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import type { InterfaceUserType } from 'utils/interfaces';
import styles from './SuperAdminScreen.module.css';

export interface InterfaceSuperAdminScreenProps {
  title: string;
  data: InterfaceUserType | undefined;
  children: React.ReactNode;
}
const superAdminScreen = ({
  title,
  data,
  children,
}: InterfaceSuperAdminScreenProps): JSX.Element => {
  const [showDrawer, setShowDrawer] = useState(true);

  return (
    <>
      <LeftDrawer
        data={data}
        screenName={title}
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
      />
      <div
        className={`${styles.pageContainer} ${
          showDrawer ? styles.contract : styles.expand
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
