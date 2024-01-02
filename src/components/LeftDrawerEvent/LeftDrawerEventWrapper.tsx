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
    organization: {
      _id: string;
    };
  };
  children: React.ReactNode;
}

export const LeftDrawerEventWrapper = (
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
      </div>
    </>
  );
};
