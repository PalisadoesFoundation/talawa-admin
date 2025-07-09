/**
 * UserSidebarOrg Component
 *
 * This component represents the sidebar for the user portal, providing
 * navigation options and user-related functionalities. It includes branding,
 * menu options, and user profile actions.
 *
 * @component
 * @param {InterfaceUserSidebarOrgProps} props - The props for the component.
 * @param {string} props.orgId - The ID of the organization (currently unused).
 * @param {TargetsType[]} props.targets - Array of navigation targets, each containing
 *   a name and URL or nested dropdown options.
 * @param {boolean | null} props.hideDrawer - State to determine the visibility of the sidebar.
 *   `null` hides the sidebar by default, `true` hides it, and `false` shows it.
 * @param {React.Dispatch<React.SetStateAction<boolean | null>>} props.setHideDrawer - Function
 *   to update the `hideDrawer` state.
 *
 * @returns {JSX.Element} The rendered UserSidebarOrg component.
 *
 * @remarks
 * - The sidebar includes branding with the Talawa logo and text.
 * - Navigation links are dynamically generated based on the `targets` prop.
 * - The sidebar auto-hides on smaller screens (viewport width <= 820px) when a link is clicked.
 * - The organization section is currently commented out and not in use.
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
import React, { useCallback, useMemo } from 'react';
// import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
import type { TargetsType } from 'state/reducers/routesReducer';
// import type { InterfaceQueryOrganizationsListObject } from 'utils/interfaces';
// import AngleRightIcon from 'assets/svgs/angleRight.svg?react';
import TalawaLogo from 'assets/svgs/talawa.svg?react';
import PluginLogo from 'assets/svgs/plugins.svg?react';
import styles from 'style/app-fixed.module.css';
// import Avatar from 'components/Avatar/Avatar';
import ProfileCard from 'components/ProfileCard/ProfileCard';
import SignOut from './../../SignOut/SignOut';
import { usePluginDrawerItems } from 'plugin';
import type { IDrawerExtension } from 'plugin';

export interface InterfaceUserSidebarOrgProps {
  orgId: string;
  targets: TargetsType[];
  hideDrawer: boolean | null;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const UserSidebarOrg = ({
  targets,
  orgId,
  hideDrawer,
  setHideDrawer,
}: InterfaceUserSidebarOrgProps): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'userSidebarOrg' });
  const { t: tCommon } = useTranslation('common');

  // State for managing dropdown visibility
  const [showDropdown, setShowDropdown] = React.useState(false);

  // Memoize the user permissions and admin status
  const userPermissions = useMemo(() => [], []);
  const isAdmin = useMemo(() => false, []);

  // Get plugin drawer items for user org (org-specific only)
  const pluginDrawerItems = usePluginDrawerItems(
    userPermissions,
    isAdmin,
    true,
  );

  const handleLinkClick = useCallback((): void => {
    if (window.innerWidth <= 820) {
      setHideDrawer(true);
    }
  }, [setHideDrawer]);

  // Render a plugin drawer item
  const renderPluginDrawerItem = useCallback(
    (item: IDrawerExtension) => (
      <NavLink
        to={item.path.replace(':orgId', orgId)}
        key={item.pluginId}
        onClick={handleLinkClick}
      >
        {({ isActive }) => (
          <Button
            variant=""
            className={isActive === true ? styles.activeItem : ''}
          >
            <div className={styles.iconWrapper}>
              {item.icon ? (
                <img
                  src={item.icon}
                  alt={item.label}
                  style={{ width: 25, height: 25 }}
                />
              ) : (
                <PluginLogo
                  fill="none"
                  fontSize={25}
                  stroke="var(--sidebar-icon-stroke-inactive)"
                />
              )}
            </div>
            {item.label}
          </Button>
        )}
      </NavLink>
    ),
    [orgId, handleLinkClick],
  );

  // Memoize the main content to prevent unnecessary re-renders
  const drawerContent = useMemo(
    () => (
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

        {/* Plugin Routes Section */}
        {pluginDrawerItems?.length > 0 && (
          <>
            <h4
              className={styles.titleHeader}
              style={{
                fontSize: '1.1rem',
                marginTop: '1.5rem',
                marginBottom: '0.75rem',
                color: 'var(--bs-secondary)',
              }}
            >
              {tCommon('plugins')}
            </h4>
            {pluginDrawerItems?.map((item) => renderPluginDrawerItem(item))}
          </>
        )}
      </div>
    ),
    [
      targets,
      handleLinkClick,
      pluginDrawerItems,
      renderPluginDrawerItem,
      showDropdown,
      tCommon,
    ],
  );

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
          <span className={styles.talawaText}>{t('talawaUserPortal')}</span>
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
        <h5 className={styles.titleHeader}>{tCommon('menu')}</h5>
        {drawerContent}
        <div className={styles.userSidebarOrgFooter}>
          <ProfileCard />
          <SignOut />
        </div>
      </div>
    </>
  );
};

export default UserSidebarOrg;