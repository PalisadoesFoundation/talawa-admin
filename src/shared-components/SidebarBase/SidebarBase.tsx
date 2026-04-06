import React from 'react';
import { useTranslation } from 'react-i18next';
import TalawaLogo from 'assets/svgs/talawa.svg?react';
import { FaBars, FaChevronLeft } from 'react-icons/fa';
import Button from 'shared-components/Button';
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
      {/* Branding / Toggle Section */}
      {hideDrawer ? (
        // Collapsed: hamburger button to expand
        <Button
          variant="link"
          className={`${styles.toggleBtn} ${styles.toggleBtnCollapsed}`}
          data-testid="toggleBtn"
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          type="button"
          aria-label={tCommon('toggleSidebar')}
        >
          <FaBars className={styles.hamburgerIcon} size={22} />
        </Button>
      ) : (
        // Expanded: branding display only (no hamburger)
        <div
          className={`${styles.toggleBtn} ${styles.toggleBtnExpanded} ${styles.brandingOnly}`}
        >
          <TalawaLogo className={styles.talawaLogo} />
          <div className={`${styles.talawaText} ${styles.sidebarText}`}>
            {tCommon(portalText)}
          </div>
        </div>
      )}

      {/* Circle collapse button — full-height wrapper centers button via flexbox, no transforms */}
      {!hideDrawer && (
        <div className={styles.collapseWrapper}>
          <Button
            variant="link"
            className={styles.collapseCircleBtn}
            data-testid="toggleBtn"
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            type="button"
            aria-label={tCommon('toggleSidebar')}
          >
            <FaChevronLeft size={14} />
          </Button>
        </div>
      )}

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
