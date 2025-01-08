import { useQuery } from '@apollo/client';
import { WarningAmberOutlined } from '@mui/icons-material';
import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';
import CollapsibleDropdown from 'components/CollapsibleDropdown/CollapsibleDropdown';
import IconComponent from 'components/IconComponent/IconComponent';
import React, { useEffect, useMemo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';
import type { TargetsType } from 'state/reducers/routesReducer';
import type { InterfaceQueryOrganizationsListObject } from 'utils/interfaces';
import AngleRightIcon from 'assets/svgs/angleRight.svg?react';
import TalawaLogo from 'assets/svgs/talawa.svg?react';
import styles from './../../style/app.module.css'; // Import the global CSS file
import Avatar from 'components/Avatar/Avatar';
import useLocalStorage from 'utils/useLocalstorage';

export interface InterfaceLeftDrawerProps {
  orgId: string;
  targets: TargetsType[];
  hideDrawer: boolean | null;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean | null>>;
}

/**
 * LeftDrawerOrg component for displaying organization details and navigation options.
 *
 * @param orgId - ID of the current organization.
 * @param targets - List of navigation targets.
 * @param hideDrawer - Determines if the drawer should be hidden or shown.
 * @param setHideDrawer - Function to update the visibility state of the drawer.
 * @returns JSX element for the left navigation drawer with organization details.
 */

const leftDrawerOrg = ({
  targets,
  orgId,
  hideDrawer,
  setHideDrawer,
}: InterfaceLeftDrawerProps): JSX.Element => {
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');
  const location = useLocation();
  const { getItem } = useLocalStorage();
  const userId = getItem('id');
  const getIdFromPath = (pathname: string): string => {
    if (!pathname) return '';
    const segments = pathname.split('/');

    // Index 2 (third segment) represents the ID in paths like /member/{userId}

    return segments.length > 2 ? segments[2] : '';
  };
  const [isProfilePage, setIsProfilePage] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [organization, setOrganization] = useState<
    InterfaceQueryOrganizationsListObject | undefined
  >(undefined);
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

  // Get the ID from the current path

  const pathId = useMemo(
    () => getIdFromPath(location.pathname),
    [location.pathname],
  );
  // Check if the current page is admin profile page

  useEffect(() => {
    // if param id is equal to userId, then it is a profile page
    setIsProfilePage(pathId === userId);
  }, [location, userId]);

  // Set organization data when query data is available
  useEffect(() => {
    let isMounted = true;
    if (data && isMounted) {
      setOrganization(data?.organizations[0]);
    } else {
      setOrganization(undefined);
    }
    return () => {
      isMounted = false;
    };
  }, [data]);
  /**
   * Handles link click to hide the drawer on smaller screens.
   */
  const handleLinkClick = (): void => {
    if (window.innerWidth <= 820) {
      setHideDrawer(true);
    }
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
          <span className={styles.talawaText}>
            {tCommon('talawaAdminPortal')}
          </span>
        </div>

        {/* Organization Section */}
        <div className={`${styles.organizationContainer} pe-3`}>
          {loading ? (
            <button
              className={`${styles.profileContainer} shimmer`}
              data-testid="orgBtn"
            />
          ) : organization == undefined ? (
            !isProfilePage && (
              <button
                className={`${styles.profileContainer} ${styles.bgDanger} text-start text-white`}
                disabled
              >
                <div className="px-3">
                  <WarningAmberOutlined />
                </div>
                {tErrors('errorLoading', { entity: 'Organization' })}
              </button>
            )
          ) : (
            <button className={styles.profileContainer} data-testid="OrgBtn">
              <div className={styles.imageContainer}>
                {organization.image ? (
                  <img src={organization.image} alt={`profile picture`} />
                ) : (
                  <Avatar
                    name={organization.name}
                    containerStyle={styles.avatarContainer}
                    alt={'Dummy Organization Picture'}
                  />
                )}
              </div>
              <div className={styles.profileText}>
                <span className={styles.primaryText}>{organization.name}</span>
                <span className={styles.secondaryText}>
                  {organization.address.city}
                </span>
              </div>
              <AngleRightIcon fill={'var(--bs-secondary)'} />
            </button>
          )}
        </div>

        {/* Options List */}
        <h5 className={`${styles.titleHeader} text-secondary`}>
          {tCommon('menu')}
        </h5>
        <div className={styles.optionList}>
          {targets.map(({ name, url }, index) => {
            return url ? (
              <NavLink to={url} key={name} onClick={handleLinkClick}>
                {({ isActive }) => (
                  <Button
                    key={name}
                    variant={isActive ? 'success' : ''}
                    className={
                      isActive ? styles.activeButton : styles.inactiveButton
                    }
                  >
                    <div className={styles.iconWrapper}>
                      <IconComponent
                        name={name == 'Membership Requests' ? 'Requests' : name}
                        fill={
                          isActive ? 'var(--bs-black)' : 'var(--bs-secondary)'
                        }
                      />
                    </div>
                    {tCommon(name)}
                  </Button>
                )}
              </NavLink>
            ) : (
              <CollapsibleDropdown
                key={name}
                target={targets[index]}
                showDropdown={showDropdown}
                setShowDropdown={setShowDropdown}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default leftDrawerOrg;
