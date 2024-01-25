import React from 'react';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';
import { ReactComponent as AngleRightIcon } from 'assets/svgs/angleRight.svg';
import { ReactComponent as LogoutIcon } from 'assets/svgs/logout.svg';
import { ReactComponent as OrganizationsIcon } from 'assets/svgs/organizations.svg';
import { ReactComponent as RolesIcon } from 'assets/svgs/roles.svg';
import { ReactComponent as TalawaLogo } from 'assets/svgs/talawa.svg';
import styles from './LeftDrawer.module.css';
import { useMutation } from '@apollo/client';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';

export interface InterfaceLeftDrawerProps {
  hideDrawer: boolean | null;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const leftDrawer = ({ hideDrawer }: InterfaceLeftDrawerProps): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'leftDrawer' });

  const userType = localStorage.getItem('UserType');
  const firstName = localStorage.getItem('FirstName');
  const lastName = localStorage.getItem('LastName');
  const userImage = localStorage.getItem('UserImage');
  const navigate = useNavigate();

  const [revokeRefreshToken] = useMutation(REVOKE_REFRESH_TOKEN);

  const logout = (): void => {
    revokeRefreshToken();
    localStorage.clear();
    navigate('/');
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
        <p className={styles.talawaText}>{t('talawaAdminPortal')}</p>
        <h5 className={styles.titleHeader}>{t('menu')}</h5>
        <div className={styles.optionList}>
          <NavLink to={'/orglist'}>
            {({ isActive }) => (
              <Button
                variant={isActive === true ? 'success' : 'light'}
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
          {userType === 'SUPERADMIN' && (
            <NavLink to={'/users'}>
              {({ isActive }) => (
                <Button
                  variant={isActive === true ? 'success' : 'light'}
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
          )}
        </div>
        <div style={{ marginTop: 'auto' }}>
          <button
            className={styles.profileContainer}
            data-testid="profileBtn"
            onClick={(): void => {
              navigate(`/member`);
            }}
          >
            <div className={styles.imageContainer}>
              {userImage && userImage !== 'null' ? (
                <img src={userImage} alt={`profile picture`} />
              ) : (
                <img
                  src={`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`}
                  alt={`dummy picture`}
                />
              )}
            </div>
            <div className={styles.profileText}>
              <span className={styles.primaryText}>
                {firstName} {lastName}
              </span>
              <span className={styles.secondaryText}>
                {`${userType}`.toLowerCase()}
              </span>
            </div>
            <AngleRightIcon fill={'var(--bs-secondary)'} />
          </button>

          <Button
            variant="light"
            className={`mt-4 d-flex justify-content-start px-0 w-100 bg-danger text-white  ${styles.logout}`}
            onClick={(): void => logout()}
            data-testid="logoutBtn"
          >
            <div className={styles.imageContainer}>
              <LogoutIcon fill={'white'} />
            </div>
            {t('logout')}
          </Button>
        </div>
      </div>
    </>
  );
};

export default leftDrawer;
