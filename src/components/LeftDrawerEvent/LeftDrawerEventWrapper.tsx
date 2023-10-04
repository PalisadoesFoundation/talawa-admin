import MenuIcon from '@mui/icons-material/Menu';
import LeftDrawerEvent from './LeftDrawerEvent';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import styles from './LeftDrawerEventWrapper.module.css';

export interface InterfacePropType {
  event: {
    _id: string;
    title: string;
    description: string;
  };
  setShowAddEventProjectModal: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}

export const LeftDrawerEventWrapper = (
  props: InterfacePropType
): JSX.Element => {
  const [hideDrawer, setHideDrawer] = useState<boolean | null>(null);

  return (
    <>
      <LeftDrawerEvent
        hideDrawer={hideDrawer}
        setHideDrawer={setHideDrawer}
        {...props}
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
            <h2>Event Dashboard</h2>
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
        {props.children}
      </div>
    </>
  );
};
