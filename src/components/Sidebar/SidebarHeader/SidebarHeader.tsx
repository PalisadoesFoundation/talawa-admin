/**
 * SidebarHeader Component
 *
 * A shared component for rendering the sidebar header with branding and toggle functionality.
 * Used across Admin Portal (LeftDrawer, LeftDrawerOrg) and User Portal (UserSidebar, UserSidebarOrg).
 *
 * @component
 * @param {ISidebarHeaderProps} props - The props for the component.
 * @param {boolean} props.hideDrawer - State indicating whether the sidebar is collapsed.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setHideDrawer - Function to toggle sidebar visibility.
 * @param {string} props.portalTitle - The title text to display (e.g., "Talawa Admin Portal" or "Talawa User Portal").
 * @param {boolean} [props.persistState=false] - Whether to persist the sidebar state to localStorage.
 *
 * @returns {JSX.Element} The rendered SidebarHeader component.
 *
 * @example
 * ```tsx
 * <SidebarHeader
 *   hideDrawer={false}
 *   setHideDrawer={setHideDrawer}
 *   portalTitle="Talawa Admin Portal"
 *   persistState={true}
 * />
 * ```
 */

import React from 'react';
import { FaBars } from 'react-icons/fa';
import TalawaLogo from 'assets/svgs/talawa.svg?react';
import styles from 'style/app-fixed.module.css';
import useLocalStorage from 'utils/useLocalstorage';

export interface ISidebarHeaderProps {
  hideDrawer: boolean;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  portalTitle: string;
  persistState?: boolean;
}

const SidebarHeader = ({
  hideDrawer,
  setHideDrawer,
  portalTitle,
  persistState = false,
}: ISidebarHeaderProps): JSX.Element => {
  const { setItem } = useLocalStorage();

  const handleToggle = (): void => {
    const newState = !hideDrawer;
    if (persistState) {
      setItem('sidebar', newState.toString());
    }
    setHideDrawer(newState);
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div
      className={`d-flex align-items-center ${hideDrawer ? 'justify-content-center' : 'justify-content-between'}`}
    >
      <button
        type="button"
        className="d-flex align-items-center btn p-0 border-0 bg-transparent"
        data-testid="toggleBtn"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        aria-label="Toggle sidebar"
      >
        <FaBars
          className={styles.hamburgerIcon}
          aria-hidden="true"
          size={22}
          style={{
            cursor: 'pointer',
            height: '38px',
            marginLeft: hideDrawer ? '0px' : '10px',
          }}
        />
      </button>
      <div
        style={{
          display: hideDrawer ? 'none' : 'flex',
          alignItems: 'center',
          marginRight: 'auto',
          paddingLeft: '5px',
        }}
      >
        <TalawaLogo className={styles.talawaLogo} />
        <div className={`${styles.talawaText} ${styles.sidebarText}`}>
          {portalTitle}
        </div>
      </div>
    </div>
  );
};

export default SidebarHeader;
