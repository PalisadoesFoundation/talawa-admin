import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import OrganizationsIcon from 'assets/svgs/organizations.svg?react';
import RolesIcon from 'assets/svgs/roles.svg?react';
import SettingsIcon from 'assets/svgs/settings.svg?react';
import TalawaLogo from 'assets/svgs/talawa.svg?react';
import styles from 'style/app.module.css';
import useLocalStorage from 'utils/useLocalstorage';
import ProfileDropdown from 'components/ProfileDropdown/ProfileDropdown';

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
  const superAdmin = getItem('SuperAdmin') !== null; // Convert to boolean

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
      <TalawaLogo className={styles.talawaLogo} />
      <p className={styles.talawaText}>{tCommon('talawaAdminPortal')}</p>
      <h5 className={`${styles.titleHeader} text-secondary`}>
        {tCommon('menu')}
      </h5>
      <div className={`d-flex flex-column ${styles.sidebarcompheight} `}>
        <div className={styles.optionList}>
          <NavLink to={'/orglist'} onClick={handleLinkClick}>
            {({ isActive }) => (
              <Button
                variant={isActive ? 'success' : undefined}
                style={{
                  backgroundColor: isActive
                    ? 'var(--sidebar-option-bg)'
                    : undefined,
                  fontWeight: isActive ? 'bold' : 'normal',
                  color: isActive
                    ? 'var(--sidebar-option-text-active)'
                    : 'var(--sidebar-option-text-inactive)',
                }}
                data-testid="organizationsBtn"
              >
                <div className={styles.iconWrapper}>
                  <OrganizationsIcon
                    fill="none"
                    stroke={
                      isActive
                        ? 'var(--sidebar-icon-stroke-active)'
                        : 'var(--sidebar-icon-stroke-inactive)'
                    }
                  />
                </div>
                {t('my organizations')}
              </Button>
            )}
          </NavLink>
          {superAdmin && (
            <NavLink to={'/users'} onClick={handleLinkClick}>
              {({ isActive }) => (
                <Button
                  variant={isActive ? 'success' : undefined}
                  style={{
                    backgroundColor: isActive
                      ? 'var(--sidebar-option-bg)'
                      : undefined,
                    fontWeight: isActive ? 'bold' : 'normal',
                    color: isActive
                      ? 'var(--sidebar-option-text-active)'
                      : 'var(--sidebar-option-text-inactive)',
                  }}
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
                </Button>
              )}
            </NavLink>
          )}
          <NavLink to={'/CommunityProfile'} onClick={handleLinkClick}>
            {({ isActive }) => (
              <Button
                variant={isActive ? 'success' : undefined}
                style={{
                  backgroundColor: isActive
                    ? 'var(--sidebar-option-bg)'
                    : undefined,
                  fontWeight: isActive ? 'bold' : 'normal',
                  color: isActive
                    ? 'var(--sidebar-option-text-active)'
                    : 'var(--sidebar-option-text-inactive)',
                }}
                data-testid="communityProfileBtn"
              >
                <div className={styles.iconWrapper}>
                  <SettingsIcon
                    fill="none"
                    stroke={
                      isActive
                        ? 'var(--sidebar-icon-stroke-active)'
                        : 'var(--sidebar-icon-stroke-inactive)'
                    }
                  />
                </div>
                {t('communityProfile')}
              </Button>
            )}
          </NavLink>
        </div>
        <div className="mt-auto">
          <ProfileDropdown />
        </div>
      </div>
    </div>
  );
};

export default leftDrawer;
