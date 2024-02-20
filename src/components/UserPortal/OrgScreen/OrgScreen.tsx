import OrgLeftDrawer from '../OrgLeftDrawer/OrgLeftDrawer';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';

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
    <div className="userScreenWrapper">
      {hideDrawer && (
        <Button
          className="openDrawerButton"
          onClick={(): void => {
            setHideDrawer(!hideDrawer);
          }}
          data-testid="expandButton"
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
        className={`pageContainer ${
          hideDrawer === null ? '' : hideDrawer ? 'expand' : 'contract'
        } `}
        data-testid="childrenContainer"
      >
        {children}
      </div>
    </div>
  );
};

export default orgScreen;
