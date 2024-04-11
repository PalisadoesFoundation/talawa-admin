import React from 'react';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { ReactComponent as OrganizationsIcon } from 'assets/svgs/organizations.svg';
import { ReactComponent as RolesIcon } from 'assets/svgs/roles.svg';
import { ReactComponent as SettingsIcon } from 'assets/svgs/settings.svg';
import { ReactComponent as TalawaLogo } from 'assets/svgs/talawa.svg';
import styles from './LeftDrawer.module.css';
import useLocalStorage from 'utils/useLocalstorage';

export interface InterfaceLeftDrawerProps {
  hideDrawer: boolean | null;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const leftDrawer = ({ hideDrawer }: InterfaceLeftDrawerProps): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'leftDrawer' });

  const { getItem } = useLocalStorage();
  const superAdmin = getItem('SuperAdmin');

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
        <p className={styles.talawaText}>{t('talawaAdminPortal')}</p>
        <h5 className={`${styles.titleHeader} text-secondary`}>{t('menu')}</h5>
        <div className={styles.optionList}>
          <NavLink to={'/orglist'}>
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
          {superAdmin && (
            <>
              <NavLink to={'/users'}>
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
                    {t('users')}
                  </Button>
                )}
              </NavLink>
              <NavLink to={'/communityProfile'}>
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
