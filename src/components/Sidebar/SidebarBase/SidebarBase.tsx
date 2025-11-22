/**
 * SidebarBase Component
 *
 * This is the foundational component for all sidebars in both Admin and User portals.
 * It provides common functionality including toggle behavior, branding, and layout structure.
 *
 * @component
 * @param {ISidebarBaseProps} props - The props for the component
 * @param {boolean} props.hideDrawer - State indicating whether the sidebar is hidden
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setHideDrawer - Function to toggle sidebar visibility
 * @param {'admin' | 'user'} props.portalType - Type of portal (admin or user)
 * @param {React.ReactNode} props.children - Navigation items and other content
 * @param {React.ReactNode} [props.headerContent] - Optional content after branding (e.g., org section)
 * @param {React.ReactNode} [props.footerContent] - Optional footer content
 * @param {string} [props.backgroundColor] - Optional background color override
 * @param {boolean} [props.persistToggleState] - Whether to persist toggle state to localStorage
 *
 * @returns {React.ReactElement} The rendered SidebarBase component
 *
 * @example
 * ```tsx
 * <SidebarBase
 *   hideDrawer={hideDrawer}
 *   setHideDrawer={setHideDrawer}
 *   portalType="admin"
 *   headerContent={<OrgSection />}
 *   footerContent={<><ProfileCard /><SignOut /></>}
 * >
 *   <NavigationItems />
 * </SidebarBase>
 * ```
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import TalawaLogo from 'assets/svgs/talawa.svg?react';
import { FaBars } from 'react-icons/fa';
import styles from '../../../style/app-fixed.module.css';
import useLocalStorage from 'utils/useLocalstorage';

export interface ISidebarBaseProps {
  hideDrawer: boolean;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  portalType: 'admin' | 'user';
  children: React.ReactNode;
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
  backgroundColor?: string;
  persistToggleState?: boolean;
}

const SidebarBase = ({
  hideDrawer,
  setHideDrawer,
  portalType,
  children,
  headerContent,
  footerContent,
  backgroundColor,
  persistToggleState = false,
}: ISidebarBaseProps): React.ReactElement => {
  const { t: tCommon } = useTranslation('common');
  const { setItem } = useLocalStorage();

  const handleToggle = (): void => {
    const newState = !hideDrawer;
    if (persistToggleState) {
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

  const portalText = portalType === 'admin' ? 'adminPortal' : 'userPortal';

  return (
    <div
      className={`${styles.leftDrawer} ${
        hideDrawer ? styles.collapsedDrawer : styles.expandedDrawer
      }`}
      style={backgroundColor ? { backgroundColor } : undefined}
      data-testid="leftDrawerContainer"
    >
      {/* Branding Section */}
      <div
        className={`d-flex align-items-center ${
          hideDrawer ? 'justify-content-center' : 'justify-content-between'
        }`}
      >
        <button
          className="d-flex align-items-center btn p-0 border-0 bg-transparent"
          data-testid="toggleBtn"
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          type="button"
        >
          <FaBars
            className={styles.hamburgerIcon}
            aria-label="Toggle sidebar"
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
            {tCommon(portalText)}
          </div>
        </div>
      </div>

      {/* Optional Header Content (e.g., Organization Section) */}
      {headerContent && headerContent}

      {/* Main Content Area (Navigation Items) */}
      <div className={`d-flex flex-column ${styles.sidebarcompheight}`}>
        {children}
      </div>

      {/* Footer Section (Profile Card, Sign Out, etc.) */}
      {footerContent && (
        <div className={styles.userSidebarOrgFooter}>{footerContent}</div>
      )}
    </div>
  );
};

export default SidebarBase;
