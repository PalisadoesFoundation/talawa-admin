/**
 * UserSidebarOrg Component
 *
 * This component represents the sidebar for the user portal, providing
 * navigation options and user-related functionalities. It includes branding,
 * menu options, and user profile actions.
 *
 * @remarks
 * - The sidebar includes branding with the Talawa logo and text.
 * - Navigation links are dynamically generated based on the `targets` prop.
 * - The sidebar auto-hides on smaller screens (viewport width less than or equal to 820px) when a link is clicked.
 * - The organization section is currently commented out and not in use.
 *
 * @param props - The props for the UserSidebar component:
 * - `orgId`: The ID of the organization (currently unused).
 * - `targets`: Array of navigation targets, each containing a name and URL or nested dropdown options.
 * - `hideDrawer`: State to determine the visibility of the sidebar. `null` hides the sidebar by default, `true` hides it, and `false` shows it.
 * - `setHideDrawer`: Function to update the `hideDrawer` state.
 *
 * @returns The rendered UserSidebarOrg component.
 *
 * @example
 * ```tsx
 * <UserSidebarOrg
 *   orgId="123"
 *   targets={[
 *     { name: 'dashboard', url: '/dashboard' },
 *     { name: 'settings', url: '/settings' },
 *   ]}
 *   hideDrawer={false}
 *   setHideDrawer={setHideDrawerFunction}
 * />
 * ```
 *
 */
// import { useQuery } from '@apollo/client';
// import { WarningAmberOutlined } from '@mui/icons-material';
// import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';
import CollapsibleDropdown from 'components/CollapsibleDropdown/CollapsibleDropdown';
import IconComponent from 'components/IconComponent/IconComponent';
import React from 'react';
// import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
import type { TargetsType } from 'state/reducers/routesReducer';
// import type { InterfaceQueryOrganizationsListObject } from 'utils/interfaces';
// import AngleRightIcon from 'assets/svgs/angleRight.svg?react';
import TalawaLogo from 'assets/svgs/talawa.svg?react';
import styles from 'style/app-fixed.module.css';
// import Avatar from 'components/Avatar/Avatar';
import ProfileCard from 'components/ProfileCard/ProfileCard';
import SignOut from './../../SignOut/SignOut';
import { FaBars } from 'react-icons/fa';

export interface IUserSidebarOrgProps {
  orgId: string;
  targets: TargetsType[];
  hideDrawer: boolean;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserSidebarOrg = ({
  targets,
  // orgId,
  hideDrawer,
  setHideDrawer,
}: IUserSidebarOrgProps): React.JSX.Element => {
  // Translation hook for internationalization
  const { t } = useTranslation('translation', { keyPrefix: 'userSidebarOrg' });
  const { t: tCommon } = useTranslation('common');

  // State for managing dropdown visibility
  const [showDropdown, setShowDropdown] = React.useState(false);

  // State for organization data
  // const [organization, setOrganization] =
  // useState<InterfaceQueryOrganizationsListObject>();

  // Query to fetch organization data
  // const {
  //   data,
  //   loading,
  // }: {
  //   data:
  //     | { organizations: InterfaceQueryOrganizationsListObject[] }
  //     | undefined;
  //   loading: boolean;
  // } = useQuery(ORGANIZATIONS_LIST, {
  //   variables: { id: orgId },
  // });

  // Set organization data once the query is complete
  // useEffect(() => {
  //   let isMounted = true;
  //   if (data && isMounted) {
  //     setOrganization(data?.organizations[0]);
  //   }
  //   return () => {
  //     isMounted = false;
  //   };
  // }, [data]);

  /**
   * Handles click events on navigation links.
   * Closes the sidebar if the viewport width is 820px or less.
   */
  const handleLinkClick = (): void => {
    if (window.innerWidth <= 820) {
      setHideDrawer(true);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginRight: hideDrawer ? '20px' : '200px',
      }}
      className={`${styles.leftDrawer} ${hideDrawer ? styles.collapsedDrawer : ''}`}
      data-testid="leftDrawerContainer"
    >
      <div>
        {/* Branding Section */}
        <div
          className={`d-flex align-items-center ${hideDrawer ? 'justify-content-center' : 'justify-content-between'}`}
        >
          <div
            className={`d-flex align-items-center`}
            data-testid="toggleBtn"
            onClick={() => {
              setHideDrawer(!hideDrawer);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setHideDrawer(!hideDrawer);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <FaBars
              className={styles.hamburgerIcon}
              aria-label="Toggle sidebar"
              size={22}
              style={{
                cursor: 'pointer',
                height: '38px',
                marginLeft: hideDrawer ? '0px' : '10px',
              }}
            />
          </div>
          <div
            style={{
              display: hideDrawer ? 'none' : 'flex',
              alignItems: 'center',
              paddingRight: '40px',
            }}
          >
            <TalawaLogo className={styles.talawaLogo} />
            <div className={`${styles.talawaText} ${styles.sidebarText}`}>
              {t('talawaUserPortal')}
            </div>
          </div>
        </div>
        {/* Organization Section */}
        {/* <div className={styles.organizationContainer}>
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
        </div> */}
        {/* Options List */}
        {!hideDrawer ? (
          <h5 className={styles.titleHeader}>{tCommon('menu')}</h5>
        ) : (
          <div style={{ paddingBottom: '40px' }}></div>
        )}{' '}
        <div className={styles.optionList}>
          {targets.map(({ name, url }, index) => {
            return url ? (
              <NavLink to={url} key={name} onClick={handleLinkClick}>
                {({ isActive }) => (
                  <Button
                    key={name}
                    variant=""
                    className={isActive === true ? styles.activeItem : ''}
                  >
                    <div className={styles.iconWrapper}>
                      <IconComponent
                        name={name}
                        fill={
                          isActive === true ? '#000000' : 'var(--bs-secondary)'
                        }
                      />
                    </div>
                    {!hideDrawer && (
                      <div style={{ whiteSpace: 'nowrap' }}>
                        {tCommon(name)}
                      </div>
                    )}
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
      <div className={styles.userSidebarOrgFooter}>
        {!hideDrawer && <ProfileCard />}
        <SignOut hideDrawer={hideDrawer} />
      </div>
    </div>
  );
};

export default UserSidebarOrg;
