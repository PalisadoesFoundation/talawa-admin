import LeftDrawerEvent from './LeftDrawerEvent';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import styles from './LeftDrawerEventWrapper.module.css';

export interface InterfacePropType {
  event: {
    _id: string;
    title: string;
    description: string;
    organization: {
      _id: string;
    };
  };
  setShowAddEventProjectModal: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}

export const LeftDrawerEventWrapper = (
  props: InterfacePropType
): JSX.Element => {
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
      <div className={styles.drawer}>
        <LeftDrawerEvent
          key={`${props.event?._id || 'loading'}EventWrapper`}
          hideDrawer={hideDrawer}
          setHideDrawer={setHideDrawer}
          {...props}
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
            <h2>Event Management</h2>
          </div>
        </div>
        {props.children}
      </div>
    </>
  );
};
