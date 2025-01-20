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

export interface InterfaceLeftDrawerProps {
  hideDrawer: boolean | null; // Controls the visibility of the drawer
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean | null>>; // Function to set the visibility state
}

/**
 * LeftDrawer component for displaying navigation options.
 *
 * @param hideDrawer - Determines if the drawer should be hidden or shown.
 * @param setHideDrawer - Function to update the visibility state of the drawer.
 * @returns JSX element for the left navigation drawer.
 */
const leftDrawer = ({
  hideDrawer,
  setHideDrawer,
}: InterfaceLeftDrawerProps): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'leftDrawer' });
  const { t: tCommon } = useTranslation('common');

  const { getItem } = useLocalStorage();
  const superAdmin = getItem('SuperAdmin');

  useEffect(() => {
    if (hideDrawer === null) {
      setHideDrawer(false);
    }
  }, []);

  /**
   * Handles link click to hide the drawer on smaller screens.
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
        <TalawaLogo className={styles.talawaLogo} />
        <p className={styles.talawaText}>{tCommon('talawaAdminPortal')}</p>
        <h5 className={`${styles.titleHeader} text-secondary`}>
          {tCommon('menu')}
        </h5>
        <div className={styles.optionList}>
          <NavLink to={'/orglist'} onClick={handleLinkClick}>
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
          {superAdmin && (
            <>
              <NavLink to={'/users'} onClick={handleLinkClick}>
                {({ isActive }) => (
                  <Button
                    variant={isActive === true ? 'success' : ''}
                    className={`${
                      isActive === true ? 'text-white' : 'text-secondary'
                    }`}
                    data-testid="rolesBtn"
                  >
                    <div className={styles.iconWrapper}>
                      <RolesIcon
                        fill={`${
                          isActive === true
                            ? 'var(--bs-white)'
                            : 'var(--bs-secondary)'
                        }`}
                      />
                    </div>
                    {tCommon('users')}
                  </Button>
                )}
              </NavLink>
              <NavLink to={'/communityProfile'} onClick={handleLinkClick}>
                {({ isActive }) => (
                  <Button
                    variant={isActive === true ? 'success' : ''}
                    className={`${
                      isActive === true ? 'text-white' : 'text-secondary'
                    }`}
                    data-testid="communityProfileBtn"
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
                    {t('communityProfile')}
                  </Button>
                )}
              </NavLink>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default leftDrawer;
