import React from 'react';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
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

export interface InterfaceLeftDrawerProps {
  hideDrawer: boolean | null;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean | null>>;
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
            variant={screenName === 'My Organizations' ? 'success' : 'light'}
            className={`${
              screenName === 'My Organizations'
                ? 'text-white'
                : 'text-secondary'
            }`}
            data-testid="orgsBtn"
            onClick={(): void => {
              history.push('/orglist');
            }}
          >
            <div className={styles.iconWrapper}>
              <OrganizationsIcon
                stroke={`${
                  screenName === 'My Organizations'
                    ? 'var(--bs-white)'
                    : 'var(--bs-secondary)'
                }`}
              />
            </div>
            {t('my organizations')}
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
