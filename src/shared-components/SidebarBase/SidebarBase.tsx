import React from 'react';
import { useTranslation } from 'react-i18next';
import TalawaLogo from 'assets/svgs/talawa.svg?react';
import { FaBars } from 'react-icons/fa';
import styles from './SidebarBase.module.css';
import useLocalStorage from 'utils/useLocalstorage';
import type { ISidebarBaseProps } from '../../types/SidebarBase/interface';

/**
 * SidebarBase Component
 *
 * This is the foundational component for all sidebars in both Admin and User portals.
 * It provides common functionality including toggle behavior, branding, and layout structure.
 *
 * @param props - The props for the component
 * @returns The rendered SidebarBase component
 */

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
      setItem('sidebar', newState);
    }
    setHideDrawer(newState);
  };

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    const isToggleKey =
      event.key === 'Enter' ||
      event.key === ' ' ||
      event.key === 'Space' ||
      event.key === 'Spacebar';
    if (isToggleKey) {
      event.preventDefault();
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
          type="button"
          aria-label={tCommon('toggleSidebar')}
        >
          <FaBars
            className={`${styles.hamburgerIcon} ${
              hideDrawer
                ? styles.hamburgerIconCollapsed
                : styles.hamburgerIconExpanded
            }`}
            size={22}
          />
        </button>
        <div
          className={
            hideDrawer
              ? styles.sidebarBrandingContainerHidden
              : styles.sidebarBrandingContainer
          }
        >
          <TalawaLogo className={styles.talawaLogo} />
          <div className={`${styles.talawaText} ${styles.sidebarText}`}>
            {tCommon(portalText)}
          </div>
        </div>
      </div>

      {/* Optional Header Content (e.g., Organization Section) */}
      {headerContent}

      {/* Main Content Area (Navigation Items) */}
      <div className={`d-flex flex-column ${styles.sidebarcompheight}`}>
        <div className={styles.optionList}>{children}</div>
      </div>

      {/* Footer Section (Profile Card, Sign Out, etc.) */}
      {footerContent && (
        <div className={styles.userSidebarOrgFooter}>{footerContent}</div>
      )}
    </div>
  );
};

export default SidebarBase;
