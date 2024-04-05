<<<<<<< HEAD
import { useQuery } from '@apollo/client';
=======
import { useMutation, useQuery } from '@apollo/client';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
import { WarningAmberOutlined } from '@mui/icons-material';
import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';
import CollapsibleDropdown from 'components/CollapsibleDropdown/CollapsibleDropdown';
import IconComponent from 'components/IconComponent/IconComponent';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
<<<<<<< HEAD
import { NavLink } from 'react-router-dom';
import type { TargetsType } from 'state/reducers/routesReducer';
import type { InterfaceQueryOrganizationsListObject } from 'utils/interfaces';
import { ReactComponent as AngleRightIcon } from 'assets/svgs/angleRight.svg';
import { ReactComponent as TalawaLogo } from 'assets/svgs/talawa.svg';
import styles from './LeftDrawerOrg.module.css';
import Avatar from 'components/Avatar/Avatar';

export interface InterfaceLeftDrawerProps {
  orgId: string;
=======
import { useHistory } from 'react-router-dom';
import type { TargetsType } from 'state/reducers/routesReducer';
import type { InterfaceQueryOrganizationsListObject } from 'utils/interfaces';
import { ReactComponent as AngleRightIcon } from 'assets/svgs/angleRight.svg';
import { ReactComponent as LogoutIcon } from 'assets/svgs/logout.svg';
import { ReactComponent as TalawaLogo } from 'assets/svgs/talawa.svg';
import styles from './LeftDrawerOrg.module.css';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';

export interface InterfaceLeftDrawerProps {
  orgId: string;
  screenName: string;
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  targets: TargetsType[];
  hideDrawer: boolean | null;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const leftDrawerOrg = ({
<<<<<<< HEAD
  targets,
  orgId,
  hideDrawer,
}: InterfaceLeftDrawerProps): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'leftDrawerOrg' });
  const [showDropdown, setShowDropdown] = React.useState(false);

=======
  screenName,
  targets,
  orgId,
  hideDrawer,
  setHideDrawer,
}: InterfaceLeftDrawerProps): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'leftDrawerOrg' });
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
=======

  const [revokeRefreshToken] = useMutation(REVOKE_REFRESH_TOKEN);

  const userType = localStorage.getItem('UserType');
  const firstName = localStorage.getItem('FirstName');
  const lastName = localStorage.getItem('LastName');
  const userImage = localStorage.getItem('UserImage');
  const userId = localStorage.getItem('id');
  const history = useHistory();

>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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

<<<<<<< HEAD
=======
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
=======
            ? styles.inactiveDrawer
            : styles.activeDrawer
        }`}
        data-testid="leftDrawerContainer"
      >
        {/* Close Drawer Btn for small devices */}
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

>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
                  <Avatar
                    name={organization.name}
                    alt={'Dummy Organization Picture'}
=======
                  <img
                    src={`https://api.dicebear.com/5.x/initials/svg?seed=${organization.name}`}
                    alt={`Dummy Organization Picture`}
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
                  />
                )}
              </div>
              <div className={styles.profileText}>
                <span className={styles.primaryText}>{organization.name}</span>
                <span className={styles.secondaryText}>
<<<<<<< HEAD
                  {organization.address.city}
                </span>
              </div>
              <AngleRightIcon fill={'var(--bs-secondary)'} />
=======
                  {organization.location}
                </span>
              </div>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
            </button>
          )}
        </div>

        {/* Options List */}
        <div className={styles.optionList}>
<<<<<<< HEAD
          <h5 className={`${styles.titleHeader} text-secondary`}>
            {t('menu')}
          </h5>
          {targets.map(({ name, url }, index) => {
            return url ? (
              <NavLink to={url} key={name}>
                {({ isActive }) => (
                  <Button
                    key={name}
                    variant={isActive === true ? 'success' : ''}
                    className={`${
                      isActive === true ? 'text-white' : 'text-secondary'
                    }`}
                  >
                    <div className={styles.iconWrapper}>
                      <IconComponent
                        name={name}
                        fill={
                          isActive === true
                            ? 'var(--bs-white)'
                            : 'var(--bs-secondary)'
                        }
                      />
                    </div>
                    {name}
                  </Button>
                )}
              </NavLink>
            ) : (
              <CollapsibleDropdown
                key={name}
                target={targets[index]}
                showDropdown={showDropdown}
                setShowDropdown={setShowDropdown}
=======
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
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
              />
            );
          })}
        </div>
<<<<<<< HEAD
=======

        {/* Profile Section & Logout Btn */}
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
        </div>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      </div>
    </>
  );
};

export default leftDrawerOrg;
