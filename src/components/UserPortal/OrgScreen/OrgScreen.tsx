import OrgLeftDrawer from '../OrgLeftDrawer/OrgLeftDrawer';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import styles from './OrgScreen.module.css';

export interface InterfaceOrgScreenProps {
  screenName: string;
  children: React.ReactNode;
}

const orgScreen = ({
  screenName,
  children,
}: InterfaceOrgScreenProps): JSX.Element => {
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
      {hideDrawer && (
        <Button
          className={styles.opendrawer}
          onClick={(): void => {
            setHideDrawer(!hideDrawer);
          }}
        >
          <i className="fa fa-angle-double-right" aria-hidden="true"></i>
        </Button>
      )}
      <OrgLeftDrawer
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
      >
        {children}
      </div>
    </>
  );
};

export default orgScreen;
