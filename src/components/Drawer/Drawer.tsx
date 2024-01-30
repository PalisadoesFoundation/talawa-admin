import React, { useEffect, useState } from 'react';
import styles from './Drawer.module.css';
import { ReactComponent as TalawaLogo } from 'assets/svgs/talawa.svg';
import type { InterfaceQueryOrganizationsListObject } from 'utils/interfaces';
import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';
import { useMutation, useQuery } from '@apollo/client';
import type { TargetsType } from 'state/reducers/routesReducer';
import { WarningAmberOutlined } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import { Link, useHistory } from 'react-router-dom';
import { ReactComponent as AngleRightIcon } from 'assets/svgs/angleRight.svg';
import { ReactComponent as LogoutIcon } from 'assets/svgs/logout.svg';
import { Button } from 'react-bootstrap';
import CollapsibleDropdown from 'components/CollapsibleDropdown/CollapsibleDropdown';

export interface InterfaceLeftDrawerProps {
  orgId: string;
  screenName: string;
  targets: TargetsType[];
  hideDrawer: boolean | null;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const drawer = ({
  screenName,
  targets,
  orgId,
  hideDrawer,
  setHideDrawer,
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

  const userType = localStorage.getItem('UserType');
  const firstName = localStorage.getItem('FirstName');
  const lastName = localStorage.getItem('LastName');
  const userImage = localStorage.getItem('UserImage');
  const userId = localStorage.getItem('id');
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
    <div
      className={`${styles.drawer} ${
        hideDrawer === null
          ? styles.hideElemByDefault
          : hideDrawer
          ? styles.inactiveDrawer
          : styles.activeDrawer
      }`}
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
      <div className={styles.drawerBg} />
      <div className={styles.frameDashboard}>
        <div className={styles.frameOrganization}>
          <div className={styles.frameProfile}>
            <TalawaLogo className={styles.palisadoesLogoIcon} />
            <div className={styles.talawaAdminPortal}>Talawa Admin Portal</div>
          </div>
        </div>
        {/* Organization Section */}

        <div className={styles.frameMenu}>
          Organization Section
          <button className={styles.organizationSection} data-testid="OrgBtn">
            <div className={styles.organizationSectionChild} />
            <div className={styles.rectangleParent}>
              <div className={styles.frameChild} />
              <h2 className={styles.po}>PO</h2>
            </div>
            <div className={styles.organizationNameText}>
              <div className={styles.palisadoesOrganization}>
                {organization?.name}
              </div>
              <div className={styles.jamaica}>{organization?.location}</div>
            </div>
            {organization?.image ? (
              <img
                src={organization?.image}
                loading="eager"
                alt={`profile picture`}
                className={styles.icons8angleRight}
              />
            ) : (
              <img
                src={`https://api.dicebear.com/5.x/initials/svg?seed=${organization?.name}`}
                alt={`Dummy Organization Picture`}
                loading="eager"
                className={styles.icons8angleRight}
              />
            )}
          </button>
          <div className={styles.menuText}>
            <h2 className={styles.menu}>Menu</h2>

            <div className={styles.peopleButton}>
              {targets.map(({ name, url }, index) => {
                return url ? (
                  <div
                    className={styles.dashboardButton}
                    onClick={(): void => {
                      history.push(url);
                    }}
                  >
                    <div className={styles.btnBg6} />
                    <img
                      className={styles.settingsButtonChild}
                      alt=""
                      src={`/assets/${name.toLocaleLowerCase()}.svg`}
                    />
                    <div className={styles.roles4}>{name}</div>
                  </div>
                ) : (
                  <CollapsibleDropdown
                    key={name}
                    screenName={screenName}
                    target={targets[index]}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.menuDropdown}>
        <Link to={`/member/id=${userId}`} className={styles.profileLink}>
          <div className={styles.frameRoles}>
            <div className={styles.rJText}>
              <button
                className={styles.groupButton}
                data-testid="profileBtn"
                onClick={(): void => {
                  history.push(`/member/id=${userId}`);
                }}
              >
                <div className={styles.rectangleDiv} />
                {userImage && userImage ? (
                  <img
                    src={userImage}
                    alt={`Profile Picture`}
                    className={styles.icons8angleRight1}
                  />
                ) : (
                  <div className={styles.rj}>
                    {firstName?.charAt(0).toLocaleUpperCase()}
                    {lastName?.charAt(0).toLocaleUpperCase()}
                  </div>
                )}
              </button>
              <div className={styles.userCredentialContainer}>
                <h3 className={styles.userName}>
                  {firstName} {lastName}
                </h3>
                <div className={styles.userType}>
                  {`${userType}`.charAt(0).toLocaleUpperCase()}
                  {`${userType}`.slice(1).toLowerCase()}
                </div>
              </div>
            </div>

            <AngleRightIcon fill={'var(--bs-secondary)'} />
          </div>
        </Link>
        <Button
          variant="light"
          className="mt-4 d-flex justify-content-start px-0 mb-2 w-100"
          onClick={(): void => logout()}
          data-testid="logoutBtn"
        >
          <div className={styles.btnBg7} />
          <div className={styles.signOutIcon}>
            <div className={styles.requestsRoleFrame} />
            <LogoutIcon fill={'var(--bs-secondary)'} />
          </div>
          <div className={styles.signOut}>Logout</div>
        </Button>
      </div>
    </div>
  );
};

export default drawer;
