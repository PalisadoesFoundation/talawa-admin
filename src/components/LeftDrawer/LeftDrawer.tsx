import React from 'react';
import Button from 'react-bootstrap/Button';
import type { InterfaceUserType } from 'utils/interfaces';
import { ReactComponent as AngleRightIcon } from '../../assets/svgs/icons/angleRight.svg';
import { ReactComponent as LogoutIcon } from '../../assets/svgs/icons/logout.svg';
import { ReactComponent as OrganizationsIcon } from '../../assets/svgs/icons/organizations.svg';
import { ReactComponent as RequestsIcon } from '../../assets/svgs/icons/requests.svg';
import { ReactComponent as RolesIcon } from '../../assets/svgs/icons/roles.svg';
import { ReactComponent as TalawaLogo } from '../../assets/svgs/talawa.svg';
import styles from './LeftDrawer.module.css';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export interface InterfaceLeftDrawerProps {
  data: InterfaceUserType | undefined;
  showDrawer: boolean;
  setShowDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  screenName: string;
}

const leftDrawer = ({
  data,
  screenName,
  showDrawer,
  setShowDrawer,
}: InterfaceLeftDrawerProps): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'leftDrawer' });

  const history = useHistory();

  const logout = (): void => {
    localStorage.clear();
    history.push('/');
  };

  return (
    <>
      <div
        className={`${styles.leftDrawer} ${
          showDrawer ? styles.activeDrawer : styles.inactiveDrawer
        }`}
        data-testid="leftDrawerContainer"
      >
        <Button
          variant="danger"
          className={styles.closeModalBtn}
          onClick={(): void => {
            setShowDrawer(!showDrawer);
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
          <Button
            variant={screenName === 'Roles' ? 'success' : 'light'}
            className={`${
              screenName === 'Roles' ? 'text-white' : 'text-secondary'
            }`}
            onClick={(): void => {
              history.push('/roles');
            }}
            data-testid="rolesBtn"
          >
            <div className={styles.iconWrapper}>
              <RolesIcon
                fill={`${
                  screenName === 'Roles'
                    ? 'var(--bs-white)'
                    : 'var(--bs-secondary)'
                }`}
              />
            </div>
            {t('roles')}
          </Button>
        </div>
        <div style={{ marginTop: 'auto' }}>
          {data === undefined ? (
            <div
              className={`${styles.profileContainer} shimmer`}
              data-testid="loadingProfile"
            />
          ) : (
            <button
              className={styles.profileContainer}
              data-testid="profileBtn"
              onClick={(): void => {
                toast.success('Profile page coming soon!');
              }}
            >
              <div className={styles.imageContainer}>
                <img
                  src={`https://api.dicebear.com/5.x/initials/svg?seed=${data?.user?.firstName} ${data?.user?.lastName}`}
                  alt={`profile pic of ${data?.user?.firstName} ${data?.user?.lastName}`}
                />
              </div>
              <div className={styles.profileText}>
                <span className={styles.primaryText}>
                  {data?.user?.firstName} {data?.user?.lastName}
                </span>
                <span className={styles.secondaryText}>
                  {`${data?.user?.userType}`.toLowerCase()}
                </span>
              </div>
              <AngleRightIcon fill={'var(--bs-secondary)'} />
            </button>
          )}

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
        </div>
      </div>
    </>
  );
};

export default leftDrawer;
