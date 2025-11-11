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
import { useQuery } from '@apollo/client';
import { WarningAmberOutlined } from '@mui/icons-material';
import { GET_ORGANIZATION_DATA_PG } from 'GraphQl/Queries/Queries';
import CollapsibleDropdown from 'components/CollapsibleDropdown/CollapsibleDropdown';
import IconComponent from 'components/IconComponent/IconComponent';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import type { TargetsType } from 'state/reducers/routesReducer';
import AngleRightIcon from 'assets/svgs/angleRight.svg?react';
import PluginLogo from 'assets/svgs/plugins.svg?react';
import styles from 'style/app-fixed.module.css';
import Avatar from 'components/Avatar/Avatar';
import { usePluginDrawerItems } from 'plugin';
import type { IDrawerExtension } from 'plugin';
import SidebarHeader from 'components/SidebarHeader/SidebarHeader';
import SidebarProfileSection from 'components/SidebarProfileSection/SidebarProfileSection';
import useLocalStorage from 'utils/useLocalstorage';

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
  const { t: tErrors } = useTranslation('errors');
  const { getItem, setItem } = useLocalStorage();

  // State for managing dropdown visibility
  const [showDropdown, setShowDropdown] = React.useState(false);

  // Use orgId from props, or fall back to localStorage if not available
  const selectedOrgId = orgId || (getItem('selectedUserOrgId') as string);

  // Fetch organization data
  const { data, loading } = useQuery<{
    organization: {
      id: string;
      name: string;
      avatarURL?: string | null;
      city?: string | null;
    };
  }>(GET_ORGANIZATION_DATA_PG, {
    variables: { id: selectedOrgId, first: 10, after: null },
    fetchPolicy: 'cache-and-network',
    skip: !selectedOrgId, // Skip query if no orgId available
  });

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
    (item: IDrawerExtension) => {
      const Icon = item.icon ? (
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
      );

      return (
        <NavLink
          to={item.path.replace(':orgId', orgId)}
          key={item.pluginId}
          onClick={handleLinkClick}
        >
          {({ isActive }) => (
            <button
              type="button"
              className={`${
                isActive ? styles.sidebarBtnActive : styles.sidebarBtn
              }`}
              data-testid={`plugin-${item.pluginId}-btn`}
            >
              <div className={styles.iconWrapper}>{Icon}</div>
              {!hideDrawer && item.label}
            </button>
          )}
        </NavLink>
      );
    },
    [orgId, handleLinkClick, hideDrawer],
  );

  // Memoize the main content to prevent unnecessary re-renders
  const drawerContent = useMemo(
    () => (
      <div className={styles.optionList}>
        {targets.map(({ name, url }, index) => {
          return url ? (
            <NavLink to={url} key={name} onClick={handleLinkClick}>
              {({ isActive }) => {
                const styledIcon = (
                  <IconComponent
                    name={name}
                    fill={isActive ? '#000000' : 'var(--bs-secondary)'}
                  />
                );

                return (
                  <button
                    type="button"
                    className={`${
                      isActive ? styles.sidebarBtnActive : styles.sidebarBtn
                    }`}
                    data-testid={name}
                  >
                    <div className={styles.iconWrapper}>{styledIcon}</div>
                    {!hideDrawer && tCommon(name)}
                  </button>
                );
              }}
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
      hideDrawer,
    ],
  );

  return (
    <>
      <div
        className={`${styles.leftDrawer} 
        ${hideDrawer ? styles.collapsedDrawer : styles.expandedDrawer}`}
        style={{ backgroundColor: '#e3f2fd' }}
        data-testid="leftDrawerContainer"
      >
        <div>
          {/* Branding Section */}
          <SidebarHeader
            hideDrawer={hideDrawer}
            setHideDrawer={setHideDrawer}
            portalTitle={tCommon('userPortal')}
            persistState={false}
          />

          {/* Organization Section - Top position */}
          {!hideDrawer && (
            <div className={`${styles.organizationContainer} pe-3`}>
              {loading ? (
                <button
                  className={`${styles.profileContainer} shimmer`}
                  data-testid="orgBtn"
                  type="button"
                />
              ) : !data?.organization ? (
                <button
                  type="button"
                  className={`${styles.profileContainer} ${styles.bgDanger} text-start text-white`}
                  disabled
                >
                  <div className="px-3">
                    <WarningAmberOutlined />
                  </div>
                  {tErrors('errorLoading', { entity: 'Organization' })}
                </button>
              ) : (
                <NavLink
                  to="/user/organizations"
                  onClick={() => {
                    if (selectedOrgId) {
                      setItem('selectedUserOrgId', selectedOrgId);
                    }
                  }}
                >
                  <button
                    type="button"
                    className={styles.profileContainer}
                    data-testid="OrgBtn"
                    style={{
                      backgroundColor: '#c1b4b4ff',
                      borderRadius: '8px',
                    }}
                  >
                    <div className={styles.imageContainer}>
                      {data.organization.avatarURL ? (
                        <img
                          crossOrigin="anonymous"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          decoding="async"
                          src={data.organization.avatarURL}
                          alt={`${data.organization.name}`}
                        />
                      ) : (
                        <Avatar
                          name={data.organization.name}
                          containerStyle={styles.avatarContainer}
                          alt={`${data.organization.name} Picture`}
                        />
                      )}
                    </div>
                    <div className={styles.ProfileRightConatiner}>
                      <div className={styles.profileText}>
                        <span className={styles.primaryText}>
                          {data.organization.name}
                        </span>
                        <span className={styles.secondaryText}>
                          {data.organization.city || 'N/A'}
                        </span>
                      </div>
                      <div className={styles.ArrowIcon}>
                        <AngleRightIcon fill={'var(--bs-secondary)'} />
                      </div>
                    </div>
                  </button>
                </NavLink>
              )}
            </div>
          )}
          {/* Options List */}
          <div
            style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
          >
            {drawerContent}
          </div>
        </div>

        <SidebarProfileSection hideDrawer={hideDrawer} />
      </div>
    </>
  );
};

export default UserSidebarOrg;
