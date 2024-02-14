import React from 'react';
import styles from './OrgLeftDrawer.module.css';
import { ReactComponent as TalawaLogo } from 'assets/svgs/talawa.svg';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import { ReactComponent as PostsIcon } from 'assets/svgs/posts.svg';
import { ReactComponent as EventsIcon } from 'assets/svgs/events.svg';
import { ReactComponent as DonateIcon } from 'assets/svgs/plugins.svg';
import { ReactComponent as AngleRightIcon } from 'assets/svgs/angleRight.svg';
import { ReactComponent as LogoutIcon } from 'assets/svgs/logout.svg';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import { useMutation, useQuery } from '@apollo/client';
import { ORGANIZATIONS_LIST, USER_DETAILS } from 'GraphQl/Queries/Queries';
import { useTranslation } from 'react-i18next';
import useLocalStorage from 'utils/useLocalstorage';

export interface InterfaceOrgLeftDrawerProps {
  screenName: string;
  hideDrawer: boolean | null;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean | null>>;
}

function orgLeftDrawer({
  screenName,
  hideDrawer,
  setHideDrawer,
}: InterfaceOrgLeftDrawerProps): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgLeftDrawer',
  });
  const { getItem } = useLocalStorage();
  const history = useHistory();

  const userId = getItem('userId');
  const orgId = window.location.href.split('=')[1];

  const { data: orgData, loading: orgLoading } = useQuery(ORGANIZATIONS_LIST, {
    variables: { id: orgId },
  });

  const { data: userData, loading } = useQuery(USER_DETAILS, {
    variables: { id: userId },
  });

  const [revokeRefreshToken] = useMutation(REVOKE_REFRESH_TOKEN);

  const logout = (): void => {
    revokeRefreshToken();
    localStorage.clear();
    history.push('/user');
  };

  return (
    <div
      className={`${styles.OrgLeftDrawer} ${
        hideDrawer === null
          ? styles.hideElemByDefault
          : hideDrawer
          ? styles.inactiveDrawer
          : styles.activeDrawer
      }`}
    >
      <div className={styles.brandingContainer}>
        <TalawaLogo className={styles.talawaLogo} data-testid="talawaLogo" />
        <span className={styles.talawaText}>{t('talawaUserPortal')}</span>
      </div>
      {!orgLoading && (
        <button
          className={styles.orgContainer}
          onClick={(): void => {
            history.push(`/user/organizations`);
          }}
        >
          <div className={styles.imageContainer}>
            {orgData?.organizations[0]?.image ? (
              <img
                src={orgData?.organizations[0]?.image}
                alt={`organization picture`}
              />
            ) : (
              <img
                src={`https://api.dicebear.com/5.x/initials/svg?seed=${orgData?.organizations[0]?.name}`}
                alt={`dummy picture`}
              />
            )}
          </div>
          <div className={styles.orgDetails}>
            <div className={styles.orgName}>
              {orgData?.organizations[0]?.name}
            </div>
            <div className={styles.orgCity}>
              {orgData?.organizations[0]?.address.city}
            </div>
          </div>
          <AngleRightIcon fill={'var(--bs-secondary)'} />
        </button>
      )}
      <h5 className={styles.titleHeader}>{t('menu')}</h5>
      <div className={styles.optionList}>
        <Button
          variant={screenName === 'Posts' ? 'success' : 'light'}
          className={`${
            screenName === 'Posts' ? 'text-white' : 'text-secondary'
          }`}
          onClick={(): void => {
            history.push(`/user/organization/id=${orgId}`);
          }}
        >
          <div className={styles.iconWrapper}>
            <PostsIcon
              fill={`${
                screenName === 'Posts'
                  ? 'var(--bs-white)'
                  : 'var(--bs-secondary)'
              }`}
            />
          </div>
          {t('posts')}
        </Button>
        <Button
          variant={screenName === 'Events' ? 'success' : 'light'}
          className={`${
            screenName === 'Events' ? 'text-white' : 'text-secondary'
          }`}
          onClick={(): void => {
            history.push(`/user/events/id=${orgId}`);
          }}
        >
          <div className={styles.iconWrapper}>
            <EventsIcon
              fill={`${
                screenName === 'Events'
                  ? 'var(--bs-white)'
                  : 'var(--bs-secondary)'
              }`}
            />
          </div>
          {t('events')}
        </Button>
        <Button
          variant={screenName === 'Donate' ? 'success' : 'light'}
          className={`${
            screenName === 'Donate' ? 'text-white' : 'text-secondary'
          }`}
          onClick={(): void => {
            history.push(`/user/donate/id=${orgId}`);
          }}
        >
          <div className={styles.iconWrapper}>
            <DonateIcon
              stroke={`${
                screenName === 'Donate'
                  ? 'var(--bs-white)'
                  : 'var(--bs-secondary)'
              }`}
            />
          </div>
          {t('donations')}
        </Button>
      </div>
      <div className="mt-auto">
        {!loading && (
          <button
            className={styles.profileContainer}
            onClick={(): void => {
              history.push(`/user/settings`);
            }}
          >
            <div className={styles.imageContainer}>
              {userData?.user?.image ? (
                <img src={userData?.user?.image} alt={`profile picture`} />
              ) : (
                <img
                  src={`https://api.dicebear.com/5.x/initials/svg?seed=${userData?.user?.firstName}%20${userData?.user?.lastName}`}
                  alt={`dummy picture`}
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

export default orgLeftDrawer;
