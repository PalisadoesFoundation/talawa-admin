/**
 * LeftDrawer Component
 *
 * This component represents the left navigation drawer for the Talawa Admin Portal.
 * It provides navigation options for different sections of the application, such as
 * organizations, users, and community profile. The drawer's visibility can be toggled
 * based on the screen size or user interaction.
 *
 * @component
 * @param {InterfaceLeftDrawerProps} props - The props for the LeftDrawer component.
 * @param {boolean | null} props.hideDrawer - Determines the visibility of the drawer.
 *                                            `null` indicates the initial state.
 * @param {React.Dispatch<React.SetStateAction<boolean | null>>} props.setHideDrawer -
 *                                            Function to update the visibility state of the drawer.
 *
 * @returns {JSX.Element} The rendered LeftDrawer component.
 *
 * @remarks
 * - The component uses `useTranslation` for internationalization.
 * - The drawer automatically hides on smaller screens (width <= 820px) when a link is clicked.
 * - The `SuperAdmin` status is retrieved from local storage to conditionally render the "Users" section.
 *
 * @example
 * ```tsx
 * <LeftDrawer
 *   hideDrawer={false}
 *   setHideDrawer={setHideDrawerFunction}
 * />
 * ```
 *
 * @fileoverview
 * - Contains navigation links for "My Organizations", "Users" (if SuperAdmin), and "Community Profile".
 * - Uses SVG icons for visual representation of navigation options.
 * - Applies dynamic styles based on the drawer's visibility state and active navigation link.
 */
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
import OrganizationsIcon from 'assets/svgs/organizations.svg?react';
import RolesIcon from 'assets/svgs/roles.svg?react';
import SettingsIcon from 'assets/svgs/settings.svg?react';
import TalawaLogo from 'assets/svgs/talawa.svg?react';
import styles from 'style/app-fixed.module.css';
import useLocalStorage from 'utils/useLocalstorage';

export interface InterfaceLeftDrawerProps {
  hideDrawer: boolean | null;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const leftDrawer = ({
  hideDrawer,
  setHideDrawer,
}: InterfaceLeftDrawerProps): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'leftDrawer' });
  const { t: tCommon } = useTranslation('common');

  const { getItem } = useLocalStorage();
  const superAdmin = getItem('SuperAdmin') !== null;

  useEffect(() => {
    if (hideDrawer === null) {
      setHideDrawer(false);
    }
  }, []);

  const handleLinkClick = (): void => {
    if (window.innerWidth <= 820) {
      setHideDrawer(true);
    }
  };

  return (
    <div
      className={`${styles.leftDrawer} ${
        hideDrawer === null
          ? styles.hideElemByDefault
          : hideDrawer
            ? styles.inactiveDrawer
            : styles.activeDrawer
      }`}
      data-testid="leftDrawerContainer"
    >
      <div className={styles.talawaLogoContainer}>
        <TalawaLogo className={styles.talawaLogo} />
        <p className={styles.talawaText}>{tCommon('talawaAdminPortal')}</p>
      </div>

      <h5 className={`${styles.titleHeader}`}>{tCommon('menu')}</h5>

      <div className={`d-flex flex-column ${styles.sidebarcompheight}`}>
        <div className={styles.optionList}>
          <NavLink to={'/orglist'} onClick={handleLinkClick}>
            {({ isActive }) => (
              <button
                className={`${
                  isActive ? styles.sidebarBtnActive : styles.sidebarBtn
                }`}
                data-testid="organizationsBtn"
              >
                <div className={styles.iconWrapper}>
                  <OrganizationsIcon
                    fill="none"
                    fontSize={25}
                    stroke={
                      isActive
                        ? 'var(--sidebar-icon-stroke-active)'
                        : 'var(--sidebar-icon-stroke-inactive)'
                    }
                  />
                </div>
                {t('my organizations')}
              </button>
            )}
          </NavLink>

          {superAdmin && (
            <NavLink to={'/users'} onClick={handleLinkClick}>
              {({ isActive }) => (
                <button
                  className={`${
                    isActive ? styles.sidebarBtnActive : styles.sidebarBtn
                  }`}
                  data-testid="rolesBtn"
                >
                  <div className={styles.iconWrapper}>
                    <RolesIcon
                      fill="none"
                      stroke={
                        isActive
                          ? 'var(--sidebar-icon-stroke-active)'
                          : 'var(--sidebar-icon-stroke-inactive)'
                      }
                    />
                  </div>
                  {t('users')}
                </button>
              )}
            </NavLink>
          )}

          <NavLink to={'/CommunityProfile'} onClick={handleLinkClick}>
            {({ isActive }) => (
              <button
                className={`${
                  isActive ? styles.sidebarBtnActive : styles.sidebarBtn
                }`}
                data-testid="communityProfileBtn"
              >
                <div className={styles.iconWrapper}>
                  <SettingsIcon
                    fill="none"
                    fontSize={25}
                    stroke={
                      isActive
                        ? 'var(--sidebar-icon-stroke-active)'
                        : 'var(--sidebar-icon-stroke-inactive)'
                    }
                  />
                </div>
                {t('communityProfile')}
              </button>
            )}
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default leftDrawer;
