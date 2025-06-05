/**
 * Represents the left navigation drawer for the Talawa Admin Portal.
 *
 * @remarks
 * - Uses `useTranslation` for i18n.
 * - Automatically hides on screen widths ≤ 820px after clicking a link.
 * - Conditionally renders the "Users" section based on SuperAdmin status.
 *
 * @param props - Props including drawer visibility state and setter function.
 * @returns The rendered LeftDrawer component.
 */

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
import OrganizationsIcon from 'assets/svgs/organizations.svg?react';
import RolesIcon from 'assets/svgs/roles.svg?react';
import SettingsIcon from 'assets/svgs/settings.svg?react';
import TalawaLogo from 'assets/svgs/talawa.svg?react';
import PluginLogo from 'assets/svgs/plugins.svg?react';
import styles from 'style/app-fixed.module.css';
import useLocalStorage from 'utils/useLocalstorage';

export interface ILeftDrawerProps {
  hideDrawer: boolean | null;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const leftDrawer = ({
  hideDrawer,
  setHideDrawer,
}: ILeftDrawerProps): React.ReactElement => {
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

          <NavLink to={'/pluginstore'} onClick={handleLinkClick}>
            {({ isActive }) => (
              <button
                className={`${
                  isActive ? styles.sidebarBtnActive : styles.sidebarBtn
                }`}
                data-testid="pluginStoreBtn"
              >
                <div className={styles.iconWrapper}>
                  <PluginLogo
                    fill="none"
                    fontSize={25}
                    stroke={
                      isActive
                        ? 'var(--sidebar-icon-stroke-active)'
                        : 'var(--sidebar-icon-stroke-inactive)'
                    }
                  />
                </div>
                {t('plugin store')}
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
