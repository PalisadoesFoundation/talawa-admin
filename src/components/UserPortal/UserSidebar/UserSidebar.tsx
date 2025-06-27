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
 * @param props - The props for the UserSidebar component:
 * - `hideDrawer`: Determines the visibility of the sidebar.
 * - `null`: Sidebar is hidden by default.
 * - `true`: Sidebar is inactive (hidden).
 * - `false`: Sidebar is active (visible).
 * - `setHideDrawer`: Function to update the `hideDrawer` state.
 *
 * @returns A JSX element representing the rendered UserSidebar component.
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
import { NavLink } from 'react-router';
import IconComponent from 'components/IconComponent/IconComponent';
import TalawaLogo from 'assets/svgs/talawa.svg?react';
import styles from '../../../style/app-fixed.module.css';
import ProfileCard from 'components/ProfileCard/ProfileCard';
import SignOut from 'components/SignOut/SignOut';
import { FaBars } from 'react-icons/fa';

export interface IUserSidebarProps {
  hideDrawer: boolean;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

const userSidebar = ({
  hideDrawer,
  setHideDrawer,
}: IUserSidebarProps): React.JSX.Element => {
  // Translation hook for internationalization
  const { t } = useTranslation('translation', { keyPrefix: 'userSidebarOrg' });
  const { t: tCommon } = useTranslation('common');

  const handleLinkClick = (): void => {
    if (window.innerWidth <= 820) {
      setHideDrawer(true);
    }
  };

  return (
    <div
      className={`${styles.leftDrawer} 
       ${hideDrawer ? styles.collapsedDrawer : styles.expandedDrawer}`}
      data-testid="leftDrawerContainer"
    >
      <div
        className={`d-flex align-items-center ${hideDrawer ? 'justify-content-center' : 'justify-content-between'}`}
      >
        <div
          className={`d-flex align-items-center`}
          data-testid="toggleBtn"
          onClick={() => {
            setHideDrawer(!hideDrawer);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setHideDrawer(!hideDrawer);
            }
          }}
          role="button"
          tabIndex={0}
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
        </div>
        <div
          style={{
            display: hideDrawer ? 'none' : 'flex',
            alignItems: 'center',
            paddingRight: '40px',
          }}
        >
          <TalawaLogo className={styles.talawaLogo} />
          <div className={`${styles.talawaText} ${styles.sidebarText}`}>
            {t('talawaUserPortal')}
          </div>
        </div>
      </div>

      <h5 className={`${styles.titleHeader} text-secondary`}>
        {!hideDrawer && tCommon('menu')}
      </h5>
      <div
        className={`d-flex flex-column ${styles.leftbarcompheight}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
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
                  <IconComponent
                    data-testid="myOrgsIcon"
                    name="My Organizations"
                    fill={isActive === true ? '#000000' : 'var(--bs-secondary)'}
                  />
                </div>
                <div className={styles.sidebarText} data-testid="myOrgsText">
                  <div
                    style={{ display: hideDrawer ? 'none' : 'block' }}
                    data-testid="myOrgText"
                  >
                    {t('my organizations')}
                  </div>
                </div>
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
                  <IconComponent
                    data-testid="settingsIcon"
                    name="Settings"
                    fill={isActive === true ? '#000000' : 'var(--bs-secondary)'}
                  />
                </div>
                <div
                  style={{ display: hideDrawer ? 'none' : 'block' }}
                  data-testid="settingsText"
                >
                  {tCommon('Settings')}
                </div>
              </Button>
            )}
          </NavLink>
        </div>
        <div className={styles.userSidebarOrgFooter}>
          <div style={{ display: hideDrawer ? 'none' : 'flex' }}>
            <ProfileCard />
          </div>
          <SignOut hideDrawer={hideDrawer} />
        </div>
      </div>
    </div>
  );
};

export default userSidebar;
