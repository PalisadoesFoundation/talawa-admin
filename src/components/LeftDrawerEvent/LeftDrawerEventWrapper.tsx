<<<<<<< HEAD
import LeftDrawerEvent from './LeftDrawerEvent';
import React, { useEffect, useState } from 'react';
=======
import MenuIcon from '@mui/icons-material/Menu';
import LeftDrawerEvent from './LeftDrawerEvent';
import React, { useState } from 'react';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
=======
  setShowAddEventProjectModal: React.Dispatch<React.SetStateAction<boolean>>;
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  children: React.ReactNode;
}

export const LeftDrawerEventWrapper = (
<<<<<<< HEAD
  props: InterfacePropType,
): JSX.Element => {
  const [hideDrawer, setHideDrawer] = useState<boolean | null>(null);
  const { event, children } = props;
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
          key={`${event?._id || 'loading'}EventWrapper`}
          hideDrawer={hideDrawer}
          setHideDrawer={setHideDrawer}
          {...props}
        />
      </div>
=======
  props: InterfacePropType
): JSX.Element => {
  const [hideDrawer, setHideDrawer] = useState<boolean | null>(null);

  return (
    <>
      <LeftDrawerEvent
        key={`${props.event?._id || 'loading'}EventWrapper`}
        hideDrawer={hideDrawer}
        setHideDrawer={setHideDrawer}
        {...props}
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
<<<<<<< HEAD
          <div className={styles.screenTitle}>
            <h2>Event Management</h2>
          </div>
        </div>
        {children}
=======
          <div style={{ flex: 1 }}>
            <h2>Event Management</h2>
          </div>
          <Button
            className="ms-2"
            onClick={(): void => {
              setHideDrawer(!hideDrawer);
            }}
            data-testid="closeLeftDrawerBtn"
          >
            <MenuIcon fontSize="medium" />
          </Button>
        </div>
        {props.children}
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      </div>
    </>
  );
};
