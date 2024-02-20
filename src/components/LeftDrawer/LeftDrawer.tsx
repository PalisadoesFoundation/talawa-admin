import React from 'react';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ReactComponent as AngleRightIcon } from 'assets/svgs/angleRight.svg';
import { ReactComponent as LogoutIcon } from 'assets/svgs/logout.svg';
import { ReactComponent as OrganizationsIcon } from 'assets/svgs/organizations.svg';
import { ReactComponent as RolesIcon } from 'assets/svgs/roles.svg';
import { ReactComponent as TalawaLogo } from 'assets/svgs/talawa.svg';
import { useMutation } from '@apollo/client';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import useLocalStorage from 'utils/useLocalstorage';

export interface InterfaceLeftDrawerProps {
  hideDrawer: boolean | null;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean | null>>;
  screenName: string;
}

const leftDrawer = ({
  screenName,
  hideDrawer,
}: InterfaceLeftDrawerProps): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'leftDrawer' });

  const { getItem } = useLocalStorage();
  const userType = getItem('UserType');
  const firstName = getItem('FirstName');
  const lastName = getItem('LastName');
  const userImage = getItem('UserImage');
  const userId = getItem('id');
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
        className={`leftDrawer ${
          hideDrawer === null
            ? 'hideElemByDefault'
            : hideDrawer
              ? 'inactiveDrawer'
              : 'activeDrawer'
        }`}
        data-testid="leftDrawerContainer"
      >
        <TalawaLogo className="talawaLogo" />
        <p className="talawaText">{t('talawaAdminPortal')}</p>
        <h5 className="titleHeader">{t('menu')}</h5>
        <div className="optionList">
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
            <div className="iconWrapper">
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
              variant={screenName === 'Users' ? 'success' : 'light'}
              className={`${
                screenName === 'Users' ? 'text-white' : 'text-secondary'
              }`}
              onClick={(): void => {
                history.push('/users');
              }}
              data-testid="rolesBtn"
            >
              <div className="iconWrapper">
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
            className="profileContainer"
            data-testid="profileBtn"
            onClick={(): void => {
              history.push(`/member/id=${userId}`);
            }}
          >
            <div className="imageContainer">
              {userImage && userImage !== 'null' ? (
                <img src={userImage} alt={`profile picture`} />
              ) : (
                <img
                  src={`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`}
                  alt={`dummy picture`}
                />
              )}
            </div>
            <div className="profileText">
              <span className="primaryText">
                {firstName} {lastName}
              </span>
              <span className="secondaryText">
                {`${userType}`.toLowerCase()}
              </span>
            </div>
            <AngleRightIcon fill={'var(--bs-secondary)'} />
          </button>

          <Button
            variant="light"
            className={`mt-4 d-flex justify-content-start px-0 w-100 bg-danger text-white logout`}
            onClick={(): void => logout()}
            data-testid="logoutBtn"
          >
            <div className="imageContainer">
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
