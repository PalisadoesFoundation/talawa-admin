/**
 * UserSidebar Component
 *
 * This component renders the sidebar for the user portal, providing navigation
 * options such as "My Organizations" and "Settings". It also includes a profile
 * dropdown for user-specific actions. The sidebar's visibility can be toggled
 * based on the viewport width or user interaction.
 *
 *
 * @remarks
 * - The component uses `react-bootstrap` for styling buttons.
 * - Internationalization is handled using the `react-i18next` library.
 * - The sidebar adapts its visibility based on the `hideDrawer` prop and viewport width.
 *
 * @param {InterfaceUserSidebarProps} props - The props for the UserSidebar component.
 * @param {boolean | null} props.hideDrawer - Determines the visibility of the sidebar.
 *   - `null`: Sidebar is hidden by default.
 *   - `true`: Sidebar is inactive (hidden).
 *   - `false`: Sidebar is active (visible).
 * @param {React.Dispatch<React.SetStateAction<boolean | null>>} props.setHideDrawer -
 * Function to update the `hideDrawer` state.
 *
 * @returns {JSX.Element} The rendered UserSidebar component.
 *
 * @example
 * ```tsx
 * <UserSidebar hideDrawer={false} setHideDrawer={setHideDrawer} />
 * ```
 *
 */
import React from 'react';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import OrganizationsIcon from 'assets/svgs/organizations.svg?react';
import SettingsIcon from 'assets/svgs/settings.svg?react';
import TalawaLogo from 'assets/svgs/talawa.svg?react';
import styles from 'style/app.module.css';
import ProfileDropdown from 'components/ProfileDropdown/ProfileDropdown';

export interface InterfaceUserSidebarProps {
  hideDrawer: boolean | null;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const userSidebar = ({
  hideDrawer,
  setHideDrawer,
}: InterfaceUserSidebarProps): JSX.Element => {
  // Translation hook for internationalization
  const { t } = useTranslation('translation', { keyPrefix: 'userSidebarOrg' });
  const { t: tCommon } = useTranslation('common');

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
        <div
          className={`d-flex align-items  flex-column ${styles.leftbarcompheight}`}
        >
          <div className={styles.optionList}>
            {/* Link to "My Organizations" page */}

            <NavLink to={'/user/organizations'} onClick={handleLinkClick}>
              {({ isActive }) => (
                <Button
                  variant={isActive ? 'success' : ''}
                  style={{
                    backgroundColor: isActive ? 'var(--sidebar-option-bg)' : '',
                    fontWeight: isActive ? 'bold' : 'normal',
                    color: isActive
                      ? 'var(--sidebar-option-text-active)'
                      : 'var(--sidebar-option-text-inactive)',
                  }}
                  data-testid="orgsBtn"
                >
                  <div className={styles.iconWrapper}>
                    <OrganizationsIcon
                      stroke={`${
                        isActive === true
                          ? 'var(--sidebar-icon-stroke-active)'
                          : 'var(--sidebar-icon-stroke-inactive)'
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
                  variant={isActive ? 'success' : ''}
                  style={{
                    backgroundColor: isActive ? 'var(--sidebar-option-bg)' : '',
                    fontWeight: isActive ? 'bold' : 'normal',
                    boxShadow: isActive ? 'none' : '',
                    color: isActive
                      ? 'var(--sidebar-option-text-active)'
                      : 'var(--sidebar-option-text-inactive)',
                  }}
                  data-testid="settingsBtn"
                >
                  <div className={styles.iconWrapper}>
                    <SettingsIcon
                      stroke={`${
                        isActive === true
                          ? 'var(--sidebar-icon-stroke-active)'
                          : 'var(--sidebar-icon-stroke-inactive)'
                      }`}
                    />
                  </div>
                  {tCommon('settings')}
                </Button>
              )}
            </NavLink>
          </div>
          <div className="mt-auto">
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </>
  );
};

export default userSidebar;
