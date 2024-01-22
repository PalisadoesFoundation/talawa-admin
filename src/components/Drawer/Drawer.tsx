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
import { useHistory } from 'react-router-dom';

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

  const onOrganizationSectionContainerClick = React.useCallback(() => {
    // Please sync "Organization| Dashboard" to the project
  }, []);

  const onDashboardButtonContainerClick = React.useCallback(() => {
    // Please sync "Organization| Dashboard" to the project
  }, []);

  const onTagsButtonContainerClick = React.useCallback(() => {
    // Please sync "Organization| Tags" to the project
  }, []);

  const onEventsButtonContainerClick = React.useCallback(() => {
    // Please sync "NOT PROTOTYPED" to the project
  }, []);

  const onPostsButtonContainerClick = React.useCallback(() => {
    // Please sync "Organization| Posts" to the project
  }, []);

  const onPluginsButtonContainerClick = React.useCallback(() => {
    // Please sync "NOT PROTOTYPED" to the project
  }, []);

  const onSettingsButtonContainerClick = React.useCallback(() => {
    // Please sync "Organization| Settings" to the project
  }, []);

  const onSignOutButtonClick = React.useCallback(() => {
    // Please sync "AUTH | LOGIN" to the project
  }, []);

  return (
    <div className={styles.drawer}>
      <div className={styles.drawerBg} />
      <div className={styles.frameDashboard}>
        <div className={styles.frameOrganization}>
          <div className={styles.frameProfile}>
            <TalawaLogo className={styles.palisadoesLogoIcon} />
            <div className={styles.talawaAdminPortal}>Talawa Admin Portal</div>
          </div>
        </div>
        <div className={styles.frameMenu}>
          Organization Section
          <div className={styles.organizationSection}>
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
            <img
              src={organization?.image || ''}
              alt={`profile picture`}
              className={styles.icons8angleRight}
              loading="eager"
            />
          </div>
          <div className={styles.menuText}>
            <h2 className={styles.menu}>Menu</h2>
            <div className={styles.peopleButton}>
              <div
                className={styles.dashboardButton}
                onClick={onDashboardButtonContainerClick}
              >
                <div className={styles.btnBg} />
                <div className={styles.postsButtonParent}>
                  <div className={styles.postsButton} />
                  <img
                    className={styles.akarIconsdashboard}
                    alt=""
                    src="/akariconsdashboard.svg"
                  />
                </div>
                <input
                  className={styles.dashboard}
                  placeholder="Dashboard"
                  type="text"
                />
              </div>
              <div className={styles.peopleButton1}>
                <div className={styles.btnBg1} />
                <img
                  className={styles.peopleButtonChild}
                  alt=""
                  src="/group-5.svg"
                />
                <input
                  className={styles.requests}
                  placeholder="People"
                  type="text"
                />
              </div>
              <div
                className={styles.tagsButton}
                onClick={onTagsButtonContainerClick}
              >
                <div className={styles.btnBg2} />
                <img
                  className={styles.tagsButtonChild}
                  alt=""
                  src="/group-5-1.svg"
                />
                <input
                  className={styles.roles}
                  placeholder="Tags"
                  type="text"
                />
              </div>
              <div
                className={styles.eventsButton}
                onClick={onEventsButtonContainerClick}
              >
                <div className={styles.btnBg3} />
                <div className={styles.rectangleGroup}>
                  <div className={styles.frameItem} />
                  <img
                    className={styles.mdieventsIcon}
                    alt=""
                    src="/mdievents.svg"
                  />
                </div>
                <input
                  className={styles.roles1}
                  placeholder="Events"
                  type="text"
                />
              </div>
              <div
                className={styles.postsButton1}
                onClick={onPostsButtonContainerClick}
              >
                <div className={styles.btnBg4} />
                <div className={styles.rectangleContainer}>
                  <div className={styles.frameInner} />
                  <img
                    className={styles.mdipostOutlineIcon}
                    alt=""
                    src="/mdipostoutline.svg"
                  />
                </div>
                <input
                  className={styles.roles2}
                  placeholder="Posts"
                  type="text"
                />
              </div>
              <div
                className={styles.pluginsButton}
                onClick={onPluginsButtonContainerClick}
              >
                <div className={styles.btnBg5} />
                <img
                  className={styles.pluginsButtonChild}
                  alt=""
                  src="/group-5-2.svg"
                />
                <input
                  className={styles.roles3}
                  placeholder="Plugins"
                  type="text"
                />
              </div>
              <div
                className={styles.settingsButton}
                onClick={onSettingsButtonContainerClick}
              >
                <div className={styles.btnBg6} />
                <img
                  className={styles.settingsButtonChild}
                  alt=""
                  src="/group-5-3.svg"
                />
                <input
                  className={styles.roles4}
                  placeholder="Settings"
                  type="text"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.menuDropdown}>
        <div className={styles.frameRoles}>
          <div className={styles.rJText}>
            <button className={styles.groupButton}>
              <div className={styles.rectangleDiv} />
              <div className={styles.rj}>RJ</div>
            </button>
            <div className={styles.removeMembersButton}>
              <h3 className={styles.rishavJha}>Rishav Jha</h3>
              <div className={styles.superAdmin}>Super Admin</div>
            </div>
          </div>
          <img
            className={styles.icons8angleRight1}
            alt=""
            src="/icons8angleright-1.svg"
          />
        </div>
        <div className={styles.signOutButton} onClick={onSignOutButtonClick}>
          <div className={styles.btnBg7} />
          <div className={styles.requestsRoleFrameParent}>
            <div className={styles.requestsRoleFrame} />
            <img
              className={styles.materialSymbolslogoutIcon}
              alt=""
              src="/materialsymbolslogout.svg"
            />
          </div>
          <input
            className={styles.signOut}
            placeholder="Sign Out"
            type="text"
          />
        </div>
      </div>
    </div>
  );
};

export default drawer;
