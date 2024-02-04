import React from 'react';
import styles from './UserLeftDrawer.module.css';
import { ReactComponent as TalawaLogo } from 'assets/svgs/talawa.svg';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import { ReactComponent as OrganizationsIcon } from 'assets/svgs/organizations.svg';
import { ReactComponent as SettingsIcon } from 'assets/svgs/settings.svg';
import { ReactComponent as AngleRightIcon } from 'assets/svgs/angleRight.svg';
import { ReactComponent as LogoutIcon } from 'assets/svgs/logout.svg';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import { useMutation, useQuery } from '@apollo/client';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import { useTranslation } from 'react-i18next';

export interface InterfaceUserLeftDrawerProps {
  screenName: string;
  hideDrawer: boolean | null;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean | null>>;
}

function userLeftDrawer({
  screenName,
  hideDrawer,
  setHideDrawer,
}: InterfaceUserLeftDrawerProps): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userLeftDrawer',
  });

  const history = useHistory();

  const userId = localStorage.getItem('userId');

  const [revokeRefreshToken] = useMutation(REVOKE_REFRESH_TOKEN);
  const { data: userData, loading } = useQuery(USER_DETAILS, {
    variables: { id: userId },
  });

  const logout = (): void => {
    revokeRefreshToken();
    localStorage.clear();
    history.push('/user');
  };

  return (
    <div
      className={`${styles.UserLeftDrawer} ${
        hideDrawer === null
          ? styles.hideElemByDefault
          : hideDrawer
          ? styles.inactiveDrawer
          : styles.activeDrawer
      }`}
      data-testid="userLeftDrawer"
    >
      <TalawaLogo className={styles.talawaLogo} data-testid="talawaLogo" />
      <span className={styles.talawaText}>{t('talawaUserPortal')}</span>
      <h5 className={styles.titleHeader}>{t('menu')}</h5>
      <div className={styles.optionList}>
        <Button
          variant={screenName === 'Organizations' ? 'success' : 'light'}
          className={`${
            screenName === 'Organizations' ? 'text-white' : 'text-secondary'
          }`}
          onClick={(): void => {
            history.push('/user/organizations');
          }}
          data-testid="orgButton"
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
          {t('myOrganizations')}
        </Button>
        <Button
          variant={screenName === 'Settings' ? 'success' : 'light'}
          className={`${
            screenName === 'Settings' ? 'text-white' : 'text-secondary'
          }`}
          onClick={(): void => {
            history.push('/user/settings');
          }}
          data-testid="settingsButton"
        >
          <div className={styles.iconWrapper}>
            <SettingsIcon
              stroke={`${
                screenName === 'Settings'
                  ? 'var(--bs-white)'
                  : 'var(--bs-secondary)'
              }`}
            />
          </div>
          {t('settings')}
        </Button>
      </div>
      <div className="mt-auto">
        {!loading && (
          <button
            className={styles.profileContainer}
            onClick={(): void => {
              history.push(`/user/settings`);
            }}
            data-testid="profileButton"
          >
            <div className={styles.imageContainer}>
              {userData?.user?.image ? (
                <img
                  src={userData.image}
                  alt={`profile picture`}
                  data-testid="profileImage"
                />
              ) : (
                <img
                  src={`https://api.dicebear.com/5.x/initials/svg?seed=${userData?.user?.firstName}%20${userData?.user?.lastName}`}
                  alt={`dummy picture`}
                  data-testid="profileImage"
                />
              )}
            </div>
            <div className={styles.profileText}>
              <span className={styles.primaryText}>
                {userData?.user?.firstName} {userData?.user?.lastName}
              </span>
              <span className={styles.secondaryText}>
                {`${userData?.user?.userType}`.toLowerCase()}
              </span>
            </div>
            <AngleRightIcon fill={'var(--bs-secondary)'} />
          </button>
        )}

        <Button
          variant="light"
          className={`mt-4 d-flex justify-content-start px-0 w-100 bg-danger text-white  ${styles.logout}`}
          onClick={(): void => logout()}
          data-testid="logoutBtn"
        >
          <div className={styles.imageContainer}>
            <LogoutIcon fill={'white'} />
          </div>
          {t('signOut')}
        </Button>
        <Button
          className={styles.collapseSidebarButton}
          onClick={(): void => {
            setHideDrawer(!hideDrawer);
          }}
          data-testid="collapseButton"
        >
          <i className="fa fa-angle-double-left" aria-hidden="true"></i>
        </Button>
      </div>
    </div>
  );
}

export default userLeftDrawer;
