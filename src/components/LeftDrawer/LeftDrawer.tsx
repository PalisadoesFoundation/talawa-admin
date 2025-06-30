/**
 * LeftDrawer Component
 *
 * This component represents the left navigation drawer for the Talawa Admin Portal.
 * It provides navigation options for different sections of the application, such as
 * organizations, users, and community profile. The drawer's visibility can be toggled
 * based on the screen size or user interaction.
 *
 *
 * @param props - The props for the LeftDrawer component.
 * - `hideDrawer`: State to control the visibility of the sidebar.
 * - `setHideDrawer`: Function to update the `hideDrawer` state.
 *
 * @returns The rendered LeftDrawer component.
 *
 * @remarks
 * - The component uses `useTranslation` for internationalization.
 * - The drawer automatically hides on smaller screens (width less than or equal to 820px) when a link is clicked.
 * - The `SuperAdmin` status is retrieved from local storage to conditionally render the "Users" section.
 * - Contains navigation links for "My Organizations", "Users" (if SuperAdmin), and "Community Profile".
 * - Uses SVG icons for visual representation of navigation options.
 * - Applies dynamic styles based on the drawer's visibility state and active navigation link.
 *
 * @example
 * ```tsx
 * <LeftDrawer
 *   hideDrawer={false}
 *   setHideDrawer={setHideDrawerFunction}
 * />
 * ```
 *
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
import { FaBars } from 'react-icons/fa';

export interface ILeftDrawerProps {
  hideDrawer: boolean;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

const leftDrawer = ({
  hideDrawer,
  setHideDrawer,
}: ILeftDrawerProps): React.JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'leftDrawer' });
  const { t: tCommon } = useTranslation('common');

  const { getItem } = useLocalStorage();
  const superAdmin = getItem('SuperAdmin') !== null;

  const handleLinkClick = (): void => {
    if (window.innerWidth <= 820) {
      setHideDrawer(true);
    } else {
      setHideDrawer(false);
    }
  };
  const handleResize = (): void => {
    if (window.innerWidth <= 820) {
      setHideDrawer(true);
    } else {
      setHideDrawer(false);
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
            {tCommon('talawaAdminPortal')}
          </div>
        </div>
      </div>

      <h5 className={`${styles.titleHeader} ${styles.sidebarText}`}>
        {!hideDrawer && tCommon('menu')}
      </h5>

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
                  <OrganizationsIcon fontSize={25} stroke={'#000000'} />
                </div>
                {!hideDrawer && t('my organizations')}
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
                    <RolesIcon fill="none" />
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
                } ${styles.sidebarText}`}
                data-testid="communityProfileBtn"
              >
                <div className={styles.iconWrapper}>
                  <SettingsIcon fill="none" fontSize={25} />
                </div>
                {!hideDrawer && t('communityProfile')}
              </button>
            )}
          </NavLink>

          {/* <NavLink to={'/notification'} onClick={handleLinkClick}>
            {({ isActive }) => (
              <button
                className={`${
                  isActive ? styles.sidebarBtnActive : styles.sidebarBtn
                }`}
                data-testid="notificationBtn"
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
                {t('notifications')}
              </button>
            )}
          </NavLink> */}
        </div>
      </div>
    </div>
  );
};

export default leftDrawer;
