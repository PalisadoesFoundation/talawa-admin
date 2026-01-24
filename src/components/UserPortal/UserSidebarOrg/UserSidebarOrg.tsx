/**
 * UserSidebarOrg Component
 *
 * This component represents the sidebar for the user portal with organization-specific navigation.
 *
 * @param props - The props for the component.
 * @returns The rendered UserSidebarOrg component.
 */

import CollapsibleDropdown from 'components/CollapsibleDropdown/CollapsibleDropdown';
import IconComponent from 'components/IconComponent/IconComponent';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { TargetsType } from 'state/reducers/routesReducer';
import { FaExchangeAlt } from 'react-icons/fa';
import { useQuery } from '@apollo/client';

import ProfileCard from 'components/ProfileCard/ProfileCard';
import SignOut from 'components/SignOut/SignOut';
import { usePluginDrawerItems } from 'plugin';
import useLocalStorage from 'utils/useLocalstorage';
import SidebarBase from 'shared-components/SidebarBase/SidebarBase';
import SidebarNavItem from 'shared-components/SidebarNavItem/SidebarNavItem';
import SidebarPluginSection from 'shared-components/SidebarPluginSection/SidebarPluginSection';
import SidebarOrgSection from 'shared-components/SidebarOrgSection/SidebarOrgSection';
import { CURRENT_USER } from 'GraphQl/Queries/Queries';
import styles from './UserSidebarOrg.module.css';

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
  const { getItem } = useLocalStorage();
  const { data: currentUserData } = useQuery(CURRENT_USER, {
    fetchPolicy: 'cache-first',
  });
  const roleFromAuth = currentUserData?.user?.role ?? null;
  const storedRole = getItem<string>('role');
  const resolvedRole = (roleFromAuth ?? storedRole ?? '').toLowerCase();
  const allowedRoles = ['administrator', 'admin', 'superadmin'];
  const canSwitchToAdmin =
    resolvedRole.length > 0 && allowedRoles.includes(resolvedRole);

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

  // Organization Section at top (only when drawer is not hidden)
  const headerContent = !hideDrawer ? (
    <SidebarOrgSection orgId={orgId} hideDrawer={hideDrawer} />
  ) : null;

  const drawerContent = useMemo(
    () => (
      <>
        {targets.map((target) => {
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
      </>
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
      backgroundColor="var(--sidebar-bg-user)"
      persistToggleState={false}
      headerContent={headerContent}
      footerContent={
        <>
          {canSwitchToAdmin && (
            <div className={styles.switchPortalWrapper}>
              <SidebarNavItem
                to="/admin/orglist"
                icon={<FaExchangeAlt />}
                label={tCommon('switchToAdminPortal')}
                testId="switchToAdminPortalBtn"
                hideDrawer={hideDrawer}
                onClick={handleLinkClick}
                useSimpleButton={true}
                iconType="react-icon"
              />
            </div>
          )}
          {!hideDrawer && (
            <div>
              <ProfileCard portal="user" />
            </div>
          )}
          <SignOut hideDrawer={hideDrawer} />
        </>
      }
    >
      {drawerContent}
    </SidebarBase>
  );
};

export default UserSidebarOrg;
