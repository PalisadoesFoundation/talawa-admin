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
import CollapsibleDropdown from 'components/CollapsibleDropdown/CollapsibleDropdown';
import IconComponent from 'components/IconComponent/IconComponent';
import React, { useCallback, useMemo } from 'react';
// import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
import type { TargetsType } from 'state/reducers/routesReducer';
import TalawaLogo from 'assets/svgs/talawa.svg?react';
import PluginLogo from 'assets/svgs/plugins.svg?react';
import styles from 'style/app-fixed.module.css';
import ProfileCard from 'components/ProfileCard/ProfileCard';
import SignOut from './../../SignOut/SignOut';
import { usePluginDrawerItems } from 'plugin';
import type { IDrawerExtension } from 'plugin';
import { FaBars } from 'react-icons/fa';

export interface InterfaceUserSidebarOrgProps {
  orgId: string;
  targets: TargetsType[];
  hideDrawer: boolean;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserSidebarOrg = ({
  targets,
  orgId,
  hideDrawer,
  setHideDrawer,
}: InterfaceUserSidebarOrgProps): JSX.Element => {
  const { t: tCommon } = useTranslation('common');

  // State for managing dropdown visibility
  const [showDropdown, setShowDropdown] = React.useState(false);

  const isAdmin = useMemo(() => false, []);

  // Get plugin drawer items for user org (org-specific only)
  const pluginDrawerItems = usePluginDrawerItems(isAdmin, true);

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
          <button
            type="button"
            className={
              isActive
                ? styles.leftDrawerActiveButton
                : styles.leftDrawerInactiveButton
            }
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
          </button>
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
                <button
                  type="button"
                  style={{ height: '40px' }}
                  data-testid={name}
                  className={`
                    ${
                      isActive
                        ? styles.leftDrawerActiveButton
                        : styles.leftDrawerInactiveButton
                    }
                      ${styles.talawaText} ${styles.sidebarText}
                  `}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className={styles.iconWrapper}>
                      <IconComponent
                        name={name}
                        fill={
                          isActive ? 'var(--bs-black)' : 'var(--bs-secondary)'
                        }
                      />
                    </div>
                    {!hideDrawer && tCommon(name)}
                  </div>
                </button>
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
              <h5 className={`${styles.titleHeader} text-secondary`}>
                {!hideDrawer && tCommon('plugins')}
              </h5>
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
      hideDrawer,
    ],
  );

  return (
    <div
      className={`${styles.leftDrawer} 
        ${hideDrawer ? styles.collapsedDrawer : styles.expandedDrawer}`}
      style={{ backgroundColor: '#f0f7fb' }}
      data-testid="leftDrawerContainer"
    >
      {/* Branding Section */}
      <div
        className={`d-flex align-items-center ${hideDrawer ? 'justify-content-center' : 'justify-content-between'}`}
      >
        <button
          type="button"
          className={`d-flex align-items-center btn p-0 border-0 bg-transparent`}
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
        </button>
        <div
          style={{
            display: hideDrawer ? 'none' : 'flex',
            alignItems: 'center',
            marginRight: 'auto',
            paddingLeft: '5px',
          }}
        >
          <TalawaLogo className={styles.talawaLogo} />
          <div className={`${styles.talawaText} ${styles.sidebarText}`}>
            {tCommon('userPortal')}
          </div>
        </div>
      </div>

      {/* User Profile Section - Top position like UserSidebar */}
      {!hideDrawer && (
        <div
          style={{
            backgroundColor: '#e8f4f8',
            padding: '10px',
            borderRadius: '8px',
            margin: '10px',
          }}
        >
          <ProfileCard portal="user" />
        </div>
      )}

      {/* Options List */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {drawerContent}
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

      <div className={styles.userSidebarOrgFooter}>
        <div style={{ display: hideDrawer ? 'none' : 'flex' }}>
          <ProfileCard portal="user" />
        </div>
        <SignOut hideDrawer={hideDrawer} />
      </div>
    </div>
  );
};

export default UserSidebarOrg;
