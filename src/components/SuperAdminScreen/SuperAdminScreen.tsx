import MenuIcon from '@mui/icons-material/Menu';
import LeftDrawer from 'components/LeftDrawer/LeftDrawer';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import type { InterfaceUserType } from 'utils/interfaces';
import styles from './SuperAdminScreen.module.css';

/**
 * Props for the `superAdminScreen` component.
 * @typedef {Object} InterfaceSuperAdminScreenProps
 * @property {string} title - Multilingual page title.
 * @property {string} screenName - Internal screen name for developers.
 * @property {InterfaceUserType | undefined} data - User data for the screen.
 * @property {React.ReactNode} children - React nodes representing the content of the screen.
 */

/**
 * `superAdminScreen` is a layout component for Super Admin screens.
 * It includes a left navigation drawer, page title, and toggle menu button.
 * @component
 *
 * @param {InterfaceSuperAdminScreenProps} props - The props object containing screen data.
 * @returns {JSX.Element} A JSX element representing the Super Admin screen layout.
 *
 * Example usage:
 * ```jsx
 * <superAdminScreen
 *   title="Super Admin Dashboard"
 *   screenName="SuperAdminDashboard"
 *   data={userData}
 * >
 *   {//Content of the SuperAdmin Screen}
 *   <div>
 *     {...}
 *   </div>
 * </superAdminScreen>
 * ```
 */


export interface InterfaceSuperAdminScreenProps {
  title: string; // Multilingual Page title
  screenName: string; // Internal Screen name for developers
  data: InterfaceUserType | undefined;
  children: React.ReactNode;
}
const superAdminScreen = ({
  title,
  screenName,
  data,
  children,
}: InterfaceSuperAdminScreenProps): JSX.Element => {
  const [showDrawer, setShowDrawer] = useState(true);

  return (
    <>
      <LeftDrawer
        data={data}
        screenName={screenName}
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
