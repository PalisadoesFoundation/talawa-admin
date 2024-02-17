import LeftDrawer from 'components/LeftDrawer/LeftDrawer';
import React, { useEffect, useState } from 'react';
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
        </div>
        {children}
      </div>
    </>
  );
};

export default superAdminScreen;
