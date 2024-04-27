import React from 'react';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { ReactComponent as OrganizationsIcon } from 'assets/svgs/organizations.svg';
import { ReactComponent as SettingsIcon } from 'assets/svgs/settings.svg';
import { ReactComponent as TalawaLogo } from 'assets/svgs/talawa.svg';
import styles from './UserSidebar.module.css';

export interface InterfaceUserSidebarProps {
  hideDrawer: boolean | null;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const userSidebar = ({
  hideDrawer,
  setHideDrawer,
}: InterfaceUserSidebarProps): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'userSidebarOrg' });

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
        <TalawaLogo className={styles.talawaLogo} />
        <p className={styles.talawaText}>{t('talawaUserPortal')}</p>
        <h5 className={`${styles.titleHeader} text-secondary`}>{t('menu')}</h5>
        <div className={styles.optionList}>
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
                {t('settings')}
              </Button>
            )}
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default userSidebar;
