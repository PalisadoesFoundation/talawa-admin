import React from 'react';
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
      className={`leftDrawerOrg ${
        hideDrawer === null
          ? 'hideElemByDefault'
          : hideDrawer
            ? 'inactiveDrawer'
            : 'activeDrawer'
      }`}
    >
      <div className="brandingContainer">
        <TalawaLogo className="talawaLogo" data-testid="talawaLogo" />
        <span className="talawaText">{t('talawaUserPortal')}</span>
      </div>
      {!orgLoading && (
        <button
          className="orgContainer"
          onClick={(): void => {
            history.push(`/user/organizations`);
          }}
        >
          <div className="imageContainer">
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
          <div className="orgDetails">
            <div className="orgName">{orgData?.organizations[0]?.name}</div>
            <div className="orgCity">
              {orgData?.organizations[0]?.address.city}
            </div>
          </div>
          <AngleRightIcon fill={'var(--bs-secondary)'} />
        </button>
      )}
      <h5 className="titleHeader">{t('menu')}</h5>
      <div className="optionList">
        <Button
          variant={screenName === 'Posts' ? 'success' : 'light'}
          className={`${
            screenName === 'Posts' ? 'text-white' : 'text-secondary'
          }`}
          onClick={(): void => {
            history.push(`/user/organization/id=${orgId}`);
          }}
        >
          <div className="iconWrapper">
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
          <div className="iconWrapper">
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
          <div className="iconWrapper">
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
            className="profileContainer"
            onClick={(): void => {
              history.push(`/user/settings`);
            }}
          >
            <div className="imageContainer">
              {userData?.user?.image ? (
                <img src={userData?.user?.image} alt={`profile picture`} />
              ) : (
                <img
                  src={`https://api.dicebear.com/5.x/initials/svg?seed=${userData?.user?.firstName}%20${userData?.user?.lastName}`}
                  alt={`dummy picture`}
                />
              )}
            </div>
            <div className="profileText">
              <span className="primaryText">
                {userData?.user?.firstName} {userData?.user?.lastName}
              </span>
              <span className="secondaryText">
                {`${userData?.user?.userType}`.toLowerCase()}
              </span>
            </div>
            <AngleRightIcon fill={'var(--bs-secondary)'} />
          </button>
        )}

        <Button
          variant="light"
          className={`mt-4 d-flex justify-content-start px-0 w-100 bg-danger text-white logout`}
          onClick={(): void => logout()}
          data-testid="logoutBtn"
        >
          <div className="imageContainer">
            <LogoutIcon fill={'white'} />
          </div>
          {t('signOut')}
        </Button>
        <Button
          className="collapseSidebarButton"
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
