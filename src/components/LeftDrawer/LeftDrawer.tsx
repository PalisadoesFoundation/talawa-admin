import { useMutation } from '@apollo/client';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import { ReactComponent as AngleRightIcon } from 'assets/svgs/angleRight.svg';
import { ReactComponent as LogoutIcon } from 'assets/svgs/logout.svg';
import { ReactComponent as OrganizationsIcon } from 'assets/svgs/organizations.svg';
import { ReactComponent as RolesIcon } from 'assets/svgs/roles.svg';
import { ReactComponent as TalawaLogo } from 'assets/svgs/talawa.svg';
import Avatar from 'components/Avatar/Avatar';
import React from 'react';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';
import useLocalStorage from 'utils/useLocalstorage';
import styles from './LeftDrawer.module.css';

export interface InterfaceLeftDrawerProps {
  hideDrawer: boolean | null;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const leftDrawer = ({ hideDrawer }: InterfaceLeftDrawerProps): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'leftDrawer' });

  const { getItem } = useLocalStorage();
  const superAdmin = getItem('SuperAdmin');
  const firstName = getItem('FirstName');
  const lastName = getItem('LastName');
  const userImage = getItem('UserImage');
  const navigate = useNavigate();
  const role = superAdmin ? 'SuperAdmin' : 'Admin';
  const [revokeRefreshToken] = useMutation(REVOKE_REFRESH_TOKEN);

  const logout = (): void => {
    revokeRefreshToken();
    localStorage.clear();
    navigate('/');
  };

  return (
    <>
      <div
        className={`${styles.leftDrawer} customScroll ${
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
          {superAdmin && (
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
                <Avatar
                  name={`${firstName} ${lastName}`}
                  alt={`dummy picture`}
                />
              )}
            </div>
            <div className={styles.profileText}>
              <span className={styles.primaryText}>
                {firstName} {lastName}
              </span>
              <span className={styles.secondaryText}>
                {`${role}`.toLowerCase()}
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
