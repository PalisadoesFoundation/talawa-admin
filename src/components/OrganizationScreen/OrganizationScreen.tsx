import LeftDrawerOrg from 'components/LeftDrawerOrg/LeftDrawerOrg';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useSelector } from 'react-redux';
import type { TargetsType } from 'state/reducers/routesReducer';
import type { RootState } from 'state/reducers';

export interface InterfaceOrganizationScreenProps {
  title: string; // Multilingual Page title
  screenName: string; // Internal Screen name for developers
  children: React.ReactNode;
}
const organizationScreen = ({
  title,
  screenName,
  children,
}: InterfaceOrganizationScreenProps): JSX.Element => {
  const [hideDrawer, setHideDrawer] = useState<boolean | null>(null);

  const appRoutes: {
    targets: TargetsType[];
    configUrl: string;
  } = useSelector((state: RootState) => state.appRoutes);
  const { targets, configUrl } = appRoutes;

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
    <div className="adminScreenWrapper">
      {hideDrawer ? (
        <Button
          className="openDrawerButton"
          onClick={(): void => {
            setHideDrawer(!hideDrawer);
          }}
          data-testid="openMenu"
        >
          <i className="fa fa-angle-double-right" aria-hidden="true"></i>
        </Button>
      ) : (
        <Button
          className="collapseSidebarButton"
          onClick={(): void => {
            setHideDrawer(!hideDrawer);
          }}
          data-testid="menuBtn"
        >
          <i className="fa fa-angle-double-left" aria-hidden="true"></i>
        </Button>
      )}
      <div className="drawer">
        <LeftDrawerOrg
          orgId={configUrl}
          targets={targets}
          screenName={screenName}
          hideDrawer={hideDrawer}
          setHideDrawer={setHideDrawer}
        />
      </div>
      <div
        className={`pageContainer ${
          hideDrawer === null ? '' : hideDrawer ? 'expand' : 'contract'
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
    </div>
  );
};

export default organizationScreen;
