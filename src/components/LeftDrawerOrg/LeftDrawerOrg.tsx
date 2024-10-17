import { useQuery } from '@apollo/client';
import { WarningAmberOutlined } from '@mui/icons-material';
import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';
import CollapsibleDropdown from 'components/CollapsibleDropdown/CollapsibleDropdown';
import IconComponent from 'components/IconComponent/IconComponent';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import type { TargetsType } from 'state/reducers/routesReducer';
import type { InterfaceQueryOrganizationsListObject } from 'utils/interfaces';
import AngleRightIcon from 'assets/svgs/angleRight.svg?react';
import TalawaLogo from 'assets/svgs/talawa.svg?react';
import styles from './LeftDrawerOrg.module.css';
import Avatar from 'components/Avatar/Avatar';

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
  const [showDropdown, setShowDropdown] = React.useState(false);

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

  // Set organization data when query data is available
  useEffect(() => {
    let isMounted = true;
    if (data && isMounted) {
      setOrganization(data?.organizations[0]);
      console.log(targets, 'targets');
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
                  <Avatar
                    name={organization.name}
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
        <div className={styles.optionList}>
          <h5 className={`${styles.titleHeader} text-secondary`}>
            {tCommon('menu')}
          </h5>
          {targets.map(({ name, url }, index) => {
            return url ? (
              <NavLink to={url} key={name} onClick={handleLinkClick}>
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
                        name={name == 'Membership Requests' ? 'Requests' : name}
                        fill={
                          isActive === true
                            ? 'var(--bs-white)'
                            : 'var(--bs-secondary)'
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
