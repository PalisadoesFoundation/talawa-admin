import React from 'react';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
<<<<<<< HEAD
import { NavLink } from 'react-router-dom';
import { ReactComponent as OrganizationsIcon } from 'assets/svgs/organizations.svg';
import { ReactComponent as RolesIcon } from 'assets/svgs/roles.svg';
import { ReactComponent as SettingsIcon } from 'assets/svgs/settings.svg';
import { ReactComponent as TalawaLogo } from 'assets/svgs/talawa.svg';
import { ReactComponent as RequestsIcon } from 'assets/svgs/requests.svg';
import styles from './LeftDrawer.module.css';
import useLocalStorage from 'utils/useLocalstorage';
=======
import { useHistory } from 'react-router-dom';
import { ReactComponent as AngleRightIcon } from 'assets/svgs/angleRight.svg';
import { ReactComponent as LogoutIcon } from 'assets/svgs/logout.svg';
import { ReactComponent as OrganizationsIcon } from 'assets/svgs/organizations.svg';
import { ReactComponent as RequestsIcon } from 'assets/svgs/requests.svg';
import { ReactComponent as RolesIcon } from 'assets/svgs/roles.svg';
import { ReactComponent as TalawaLogo } from 'assets/svgs/talawa.svg';
import styles from './LeftDrawer.module.css';
import { useMutation } from '@apollo/client';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

export interface InterfaceLeftDrawerProps {
  hideDrawer: boolean | null;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean | null>>;
<<<<<<< HEAD
}

const leftDrawer = ({ hideDrawer }: InterfaceLeftDrawerProps): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'leftDrawer' });

  const { getItem } = useLocalStorage();
  const superAdmin = getItem('SuperAdmin');
  const role = superAdmin ? 'SuperAdmin' : 'Admin';
=======
  screenName: string;
}

const leftDrawer = ({
  screenName,
  hideDrawer,
  setHideDrawer,
}: InterfaceLeftDrawerProps): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'leftDrawer' });

  const userType = localStorage.getItem('UserType');
  const firstName = localStorage.getItem('FirstName');
  const lastName = localStorage.getItem('LastName');
  const userImage = localStorage.getItem('UserImage');
  const userId = localStorage.getItem('id');
  const history = useHistory();

  const [revokeRefreshToken] = useMutation(REVOKE_REFRESH_TOKEN);

  const logout = (): void => {
    revokeRefreshToken();
    localStorage.clear();
    history.push('/');
  };
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

  return (
    <>
      <div
        className={`${styles.leftDrawer} ${
          hideDrawer === null
            ? styles.hideElemByDefault
            : hideDrawer
<<<<<<< HEAD
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
          {role === 'Admin' && (
            <NavLink to={'/requests'}>
              {({ isActive }) => (
                <Button
                  variant={isActive === true ? 'success' : ''}
                  className={`${
                    isActive === true ? 'text-white' : 'text-secondary'
                  }`}
                  data-testid="requestsBtn"
                >
                  <div className={styles.iconWrapper}>
                    <RequestsIcon
                      fill={`${
                        isActive === true
                          ? 'var(--bs-white)'
                          : 'var(--bs-secondary)'
                      }`}
                    />
                  </div>
                  {t('requests')}
                </Button>
              )}
            </NavLink>
          )}
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
=======
            ? styles.inactiveDrawer
            : styles.activeDrawer
        }`}
        data-testid="leftDrawerContainer"
      >
        <Button
          variant="danger"
          className={styles.closeModalBtn}
          onClick={(): void => {
            setHideDrawer(false);
          }}
          data-testid="closeModalBtn"
        >
          <i className="fa fa-times"></i>
        </Button>
        <TalawaLogo className={styles.talawaLogo} />
        <p className={styles.talawaText}>{t('talawaAdminPortal')}</p>
        <h5 className={styles.titleHeader}>{t('menu')}</h5>
        <div className={styles.optionList}>
          <Button
            variant={screenName === 'Organizations' ? 'success' : 'light'}
            className={`${
              screenName === 'Organizations' ? 'text-white' : 'text-secondary'
            }`}
            data-testid="orgsBtn"
            onClick={(): void => {
              history.push('/orglist');
            }}
          >
            <div className={styles.iconWrapper}>
              <OrganizationsIcon
                stroke={`${
                  screenName === 'Organizations'
                    ? 'var(--bs-white)'
                    : 'var(--bs-secondary)'
                }`}
              />
            </div>
            {t('organizations')}
          </Button>
          {userType === 'SUPERADMIN' && (
            <Button
              variant={screenName === 'Requests' ? 'success' : 'light'}
              className={`${
                screenName === 'Requests' ? 'text-white' : 'text-secondary'
              }`}
              onClick={(): void => {
                history.push('/requests');
              }}
              data-testid="requestsBtn"
            >
              <div className={styles.iconWrapper}>
                <RequestsIcon
                  fill={`${
                    screenName === 'Requests'
                      ? 'var(--bs-white)'
                      : 'var(--bs-secondary)'
                  }`}
                />
              </div>
              {t('requests')}
            </Button>
          )}
          {userType === 'SUPERADMIN' && (
            <Button
              variant={screenName === 'Users' ? 'success' : 'light'}
              className={`${
                screenName === 'Users' ? 'text-white' : 'text-secondary'
              }`}
              onClick={(): void => {
                history.push('/users');
              }}
              data-testid="rolesBtn"
            >
              <div className={styles.iconWrapper}>
                <RolesIcon
                  fill={`${
                    screenName === 'Users'
                      ? 'var(--bs-white)'
                      : 'var(--bs-secondary)'
                  }`}
                />
              </div>
              {t('users')}
            </Button>
          )}
        </div>
        <div style={{ marginTop: 'auto' }}>
          <button
            className={styles.profileContainer}
            data-testid="profileBtn"
            onClick={(): void => {
              history.push(`/member/id=${userId}`);
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
            className="mt-4 d-flex justify-content-start px-0 mb-2 w-100"
            onClick={(): void => logout()}
            data-testid="logoutBtn"
          >
            <div className={styles.imageContainer}>
              <LogoutIcon fill={'var(--bs-secondary)'} />
            </div>
            {t('logout')}
          </Button>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        </div>
      </div>
    </>
  );
};

export default leftDrawer;
