import React from 'react';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import OrganizationsIcon from 'assets/svgs/organizations.svg?react';
import SettingsIcon from 'assets/svgs/settings.svg?react';
import TalawaLogo from 'assets/svgs/talawa.svg?react';
import styles from './UserSidebar.module.css';

export interface InterfaceUserSidebarProps {
  hideDrawer: boolean | null;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean | null>>;
}

/**
 * Sidebar component for user navigation, including links to organizations and settings.
 *
 * Provides:
 * - A logo and title for the sidebar.
 * - Navigation buttons for "My Organizations" and "Settings".
 * - Dynamic styling based on the active route.
 *
 * @param hideDrawer - Boolean indicating if the sidebar should be hidden or shown.
 * @param setHideDrawer - Function to update the `hideDrawer` state.
 *
 * @returns JSX.Element - The rendered sidebar component.
 */
const userSidebar = ({
  hideDrawer,
  setHideDrawer,
}: InterfaceUserSidebarProps): JSX.Element => {
  // Translation hook for internationalization
  const { t } = useTranslation('translation', { keyPrefix: 'userSidebarOrg' });
  const { t: tCommon } = useTranslation('common');

  /**
   * Handles click events on navigation links.
   * Closes the sidebar if the viewport width is 820px or less.
   */
  const handleLinkClick = (): void => {
    if (window.innerWidth <= 820) {
      setHideDrawer(true);
    }
  };

  return (
    <>
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
        {/* Logo and title */}
        <TalawaLogo className={styles.talawaLogo} />
        <p className={styles.talawaText}>{t('talawaUserPortal')}</p>
        <h5 className={`${styles.titleHeader} text-secondary`}>
          {tCommon('menu')}
        </h5>
        <div className={styles.optionList}>
          {/* Link to "My Organizations" page */}
          <NavLink to={'/user/organizations'} onClick={handleLinkClick}>
            {({ isActive }) => (
              <Button
                variant={isActive === true ? 'success' : ''}
                className={`${
                  isActive === true ? 'text-white' : 'text-secondary'
                }`}
                data-testid="orgsBtn"
              >
                <div className={styles.iconWrapper}>
                  <OrganizationsIcon
                    stroke={`${
                      isActive === true
                        ? 'var(--bs-white)'
                        : 'var(--bs-secondary)'
                    }`}
                  />
                </div>
                {t('my organizations')}
              </Button>
            )}
          </NavLink>
          {/* Link to "Settings" page */}
          <NavLink to={'/user/settings'} onClick={handleLinkClick}>
            {({ isActive }) => (
              <Button
                variant={isActive === true ? 'success' : ''}
                className={`${
                  isActive === true ? 'text-white' : 'text-secondary'
                }`}
                data-testid="settingsBtn"
              >
                <div className={styles.iconWrapper}>
                  <SettingsIcon
                    stroke={`${
                      isActive === true
                        ? 'var(--bs-white)'
                        : 'var(--bs-secondary)'
                    }`}
                  />
                </div>
                {tCommon('settings')}
              </Button>
            )}
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default userSidebar;
