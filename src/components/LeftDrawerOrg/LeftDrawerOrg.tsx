import { useMutation, useQuery } from '@apollo/client';
import { WarningAmberOutlined } from '@mui/icons-material';
import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';
import CollapsibleDropdown from 'components/CollapsibleDropdown/CollapsibleDropdown';
import IconComponent from 'components/IconComponent/IconComponent';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { useHistory, Link } from 'react-router-dom';
import type { TargetsType } from 'state/reducers/routesReducer';
import type { InterfaceQueryOrganizationsListObject } from 'utils/interfaces';
import { ReactComponent as AngleRightIcon } from 'assets/svgs/angleRight.svg';
import { ReactComponent as LogoutIcon } from 'assets/svgs/logout.svg';
import { ReactComponent as TalawaLogo } from 'assets/svgs/talawa.svg';
import styles from './LeftDrawerOrg.module.css';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import useLocalStorage from 'utils/useLocalstorage';

export interface InterfaceLeftDrawerProps {
  orgId: string;
  screenName: string;
  targets: TargetsType[];
  hideDrawer: boolean | null;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const leftDrawerOrg = ({
  screenName,
  targets,
  orgId,
  hideDrawer,
}: InterfaceLeftDrawerProps): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'leftDrawerOrg' });
  const [organization, setOrganization] =
    useState<InterfaceQueryOrganizationsListObject>();
  const {
    data,
    loading,
  }: {
    data:
      | { organizations: InterfaceQueryOrganizationsListObject[] }
      | undefined;
    loading: boolean;
  } = useQuery(ORGANIZATIONS_LIST, {
    variables: { id: orgId },
  });

  const [revokeRefreshToken] = useMutation(REVOKE_REFRESH_TOKEN);

  const { getItem } = useLocalStorage();

  const userType = getItem('UserType');
  const firstName = getItem('FirstName');
  const lastName = getItem('LastName');
  const userImage = getItem('UserImage');
  const userId = getItem('id');
  const history = useHistory();

  // Set organization data
  useEffect(() => {
    let isMounted = true;
    if (data && isMounted) {
      setOrganization(data?.organizations[0]);
    }
    return () => {
      isMounted = false;
    };
  }, [data]);

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
        {/* Branding Section */}
        <div className={styles.brandingContainer}>
          <TalawaLogo className={styles.talawaLogo} />
          <span className={styles.talawaText}>{t('talawaAdminPortal')}</span>
        </div>

        {/* Organization Section */}
        <div className={styles.organizationContainer}>
          {loading ? (
            <>
              <button
                className={`${styles.profileContainer} shimmer`}
                data-testid="orgBtn"
              />
            </>
          ) : organization == undefined ? (
            <>
              <button
                className={`${styles.profileContainer} bg-danger text-start text-white`}
                disabled
              >
                <div className="px-3">
                  <WarningAmberOutlined />
                </div>
                Error Occured while loading the Organization
              </button>
            </>
          ) : (
            <button className={styles.profileContainer} data-testid="OrgBtn">
              <div className={styles.imageContainer}>
                {organization.image ? (
                  <img src={organization.image} alt={`profile picture`} />
                ) : (
                  <img
                    src={`https://api.dicebear.com/5.x/initials/svg?seed=${organization.name}`}
                    alt={`Dummy Organization Picture`}
                  />
                )}
              </div>
              <div className={styles.profileText}>
                <span className={styles.primaryText}>{organization.name}</span>
                <span className={styles.secondaryText}>
                  {organization.address.city}, {organization.address.state}
                  <br />
                  {organization.address.postalCode},{' '}
                  {organization.address.countryCode}
                </span>
              </div>
            </button>
          )}
        </div>

        {/* Options List */}
        <div className={styles.optionList}>
          <h5 className={styles.titleHeader}>{t('menu')}</h5>
          {targets.map(({ name, url }, index) => {
            return url ? (
              <Button
                key={name}
                variant={screenName === name ? 'success' : 'light'}
                className={`${
                  screenName === name ? 'text-white' : 'text-secondary'
                }`}
                onClick={(): void => {
                  history.push(url);
                }}
              >
                <div className={styles.iconWrapper}>
                  <IconComponent
                    name={name}
                    fill={
                      screenName === name
                        ? 'var(--bs-white)'
                        : 'var(--bs-secondary)'
                    }
                  />
                </div>
                {name}
              </Button>
            ) : (
              <CollapsibleDropdown
                key={name}
                screenName={screenName}
                target={targets[index]}
              />
            );
          })}
        </div>

        {/* Profile Section & Logout Btn */}
        <div style={{ marginTop: 'auto' }}>
          <Link
            to={{
              pathname: `/member/id=${userId}`,
              state: { from: 'orgdash' },
            }}
          >
            <Button
              key={'profileBtn'}
              variant={screenName === 'Profile' ? 'success' : 'light'}
              className={styles.profileContainer}
              data-testid="profileBtn"
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
                <span
                  className={`${styles.secondaryText} ${
                    screenName === 'Profile' && 'text-white'
                  }`}
                >
                  {`${userType}`.toLowerCase()}
                </span>
              </div>
              <AngleRightIcon fill={'var(--bs-secondary)'} />
            </Button>
          </Link>
          <Button
            variant="light"
            className={`mt-4 d-flex justify-content-start px-0 w-100 ${styles.logout}`}
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

export default leftDrawerOrg;
