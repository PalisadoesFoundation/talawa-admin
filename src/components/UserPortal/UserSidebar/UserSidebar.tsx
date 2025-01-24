import React from 'react';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import OrganizationsIcon from 'assets/svgs/organizations.svg?react';
import SettingsIcon from 'assets/svgs/settings.svg?react';
import TalawaLogo from 'assets/svgs/talawa.svg?react';
import styles from '../../../style/app.module.css';
import ProfileDropdown from 'components/ProfileDropdown/ProfileDropdown';
export interface InterfaceUserSidebarProps {
  hideDrawer: boolean | null;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const UserSidebar = ({
  hideDrawer,
  setHideDrawer,
}: InterfaceUserSidebarProps): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'userSidebarOrg' });
  const { t: tCommon } = useTranslation('common');

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
      <p className={styles.talawaText}>{t('talawaUserPortal')}</p>
      <h5 className={`${styles.titleHeader} text-secondary`}>
        {tCommon('menu')}
      </h5>

      {/* Navigation options */}
      <div className={`${styles.optionList}`}>
        <NavLink to={'/user/organizations'} onClick={handleLinkClick}>
          {({ isActive }) => (
            <Button
              variant={isActive === true ? 'success' : ''}
              className={`${
                isActive === true ? 'text-black' : 'text-secondary'
              }`}
              style={{
                backgroundColor: isActive === true ? '#EAEBEF' : '',
              }}
              data-testid="orgsBtn"
            >
              <div className={styles.iconWrapper}>
                <OrganizationsIcon
                  fill={
                    isActive === true
                      ? 'var(--bs-black)'
                      : 'var(--bs-secondary)'
                  }
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
                isActive === true ? 'text-black' : 'text-secondary'
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
      {/* Profile Dropdown at the bottom */}
      <div className={styles.profileDropdownWrapper}>
        <ProfileDropdown />
      </div>
    </div>
  );
};

export default UserSidebar;
