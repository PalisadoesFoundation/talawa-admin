/**
 * UserSidebarOrg Component
 *
 * This component represents the sidebar for the user portal with organization-specific navigation.
 * It provides navigation options and user-related functionalities.
 *
 * @component
 * @param {InterfaceUserSidebarOrgProps} props - The props for the component.
 * @param {string} props.orgId - The ID of the organization.
 * @param {TargetsType[]} props.targets - Array of navigation targets.
 * @param {boolean} props.hideDrawer - State to determine the visibility of the sidebar.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setHideDrawer - Function to update hideDrawer state.
 *
 * @returns {JSX.Element} The rendered UserSidebarOrg component.
 *
 * @remarks
 * - The sidebar includes dynamic navigation based on the `targets` prop.
 * - The sidebar auto-hides on smaller screens (viewport width <= 820px) when a link is clicked.
 * - **REFACTORED**: Now uses shared SidebarBase, SidebarNavItem, and SidebarPluginSection components
 *
 * @example
 * ```tsx
 * <UserSidebarOrg
 *   orgId="123"
 *   targets={[{ name: 'dashboard', url: '/dashboard' }]}
 *   hideDrawer={false}
 *   setHideDrawer={setHideDrawerFunction}
 * />
 * ```
 */

import CollapsibleDropdown from 'components/CollapsibleDropdown/CollapsibleDropdown';
import IconComponent from 'components/IconComponent/IconComponent';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { TargetsType } from 'state/reducers/routesReducer';
import styles from 'style/app-fixed.module.css';
import ProfileCard from 'components/ProfileCard/ProfileCard';
import SignOut from 'components/SignOut/SignOut';
import { usePluginDrawerItems } from 'plugin';
import SidebarBase from 'components/Sidebar/SidebarBase/SidebarBase';
import SidebarNavItem from 'components/Sidebar/SidebarNavItem/SidebarNavItem';
import SidebarPluginSection from 'components/Sidebar/SidebarPluginSection/SidebarPluginSection';

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

  // User Profile Section at top (only when drawer is not hidden)
  const headerContent = !hideDrawer ? (
    <div
      style={{
        backgroundColor: '#e8f4f8',
        padding: '10px',
        borderRadius: '8px',
        margin: '10px',
      }}
    >
      <ProfileCard />
    </div>
  ) : null;

  const drawerContent = useMemo(
    () => (
      <div className={styles.optionList}>
        {Array.isArray(targets) &&
          targets.map((target) => {
            if (!target) return null;
            const { name, url, subTargets } = target;

            // Render navigation item if URL exists
            if (url) {
              return (
                <SidebarNavItem
                  key={name}
                  to={url}
                  icon={<IconComponent name={name} fill="var(--bs-black)" />}
                  label={tCommon(name)}
                  testId={name}
                  hideDrawer={hideDrawer}
                  onClick={handleLinkClick}
                  useSimpleButton={true}
                />
              );
            }

            // Only render CollapsibleDropdown if subTargets exists and has items
            if (subTargets && subTargets.length > 0) {
              return (
                <CollapsibleDropdown
                  key={name}
                  target={target}
                  showDropdown={showDropdown}
                  setShowDropdown={setShowDropdown}
                />
              );
            }

            // Skip rendering if neither url nor subTargets
            return null;
          })}

        {/* Plugin Routes Section */}
        <SidebarPluginSection
          pluginItems={pluginDrawerItems}
          hideDrawer={hideDrawer}
          orgId={orgId}
          onItemClick={handleLinkClick}
          useSimpleButton={true}
        />
      </div>
    ),
    [
      targets,
      pluginDrawerItems,
      showDropdown,
      tCommon,
      hideDrawer,
      handleLinkClick,
      orgId,
    ],
  );

  return (
    <SidebarBase
      hideDrawer={hideDrawer}
      setHideDrawer={setHideDrawer}
      portalType="user"
      backgroundColor="#f0f7fb"
      persistToggleState={false}
      headerContent={headerContent}
      footerContent={<SignOut hideDrawer={hideDrawer} />}
    >
      {drawerContent}
    </SidebarBase>
  );
};

export default UserSidebarOrg;
