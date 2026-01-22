/**
 * UserSidebar Component
 *
 * This component renders the sidebar for the user portal.
 *
 * @param props - The props for the UserSidebar component.
 * @returns The rendered UserSidebar component.
 */

import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FaBell } from 'react-icons/fa';
import { usePluginDrawerItems } from 'plugin';
import ProfileCard from 'components/ProfileCard/ProfileCard';
import SignOut from 'components/SignOut/SignOut';
import IconComponent from 'components/IconComponent/IconComponent';
import SidebarBase from 'shared-components/SidebarBase/SidebarBase';
import SidebarNavItem from 'shared-components/SidebarNavItem/SidebarNavItem';
import SidebarPluginSection from 'shared-components/SidebarPluginSection/SidebarPluginSection';

export interface InterfaceUserSidebarProps {
  hideDrawer: boolean;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserSidebar = ({
  hideDrawer,
  setHideDrawer,
}: InterfaceUserSidebarProps): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'userSidebarOrg' });
  const { t: tCommon } = useTranslation('common');

  // Memoize the parameters to prevent infinite re-renders
  const userPermissions = useMemo(() => [], []);
  const isAdmin = false;
  const isOrg = false;

  // Get plugin drawer items for user global (no orgId required)
  const pluginDrawerItems = usePluginDrawerItems(
    userPermissions,
    isAdmin,
    isOrg,
  );

  const handleLinkClick = useCallback((): void => {
    if (window.innerWidth <= 820) {
      setHideDrawer(true);
    }
  }, [setHideDrawer]);

  // Header content - no profile card at top anymore
  const headerContent = null;

  const drawerContent = useMemo(
    () => (
      <>
        <SidebarNavItem
          to="/user/organizations"
          icon={<IconComponent name="My Organizations" />}
          label={t('my organizations')}
          testId="orgsBtn"
          hideDrawer={hideDrawer}
          onClick={handleLinkClick}
          iconType="svg"
        />

        <SidebarNavItem
          to="/user/notification"
          icon={<FaBell />}
          label={tCommon('notifications')}
          testId="userNotificationBtn"
          hideDrawer={hideDrawer}
          onClick={handleLinkClick}
          iconType="react-icon"
        />

        <SidebarNavItem
          to="/user/settings"
          icon={<IconComponent name="Settings" />}
          label={tCommon('Settings')}
          testId="settingsBtn"
          hideDrawer={hideDrawer}
          onClick={handleLinkClick}
          iconType="svg"
        />

        {/* Plugin Global Features Section */}
        <SidebarPluginSection
          pluginItems={pluginDrawerItems}
          hideDrawer={hideDrawer}
          onItemClick={handleLinkClick}
        />
      </>
    ),
    [pluginDrawerItems, t, tCommon, hideDrawer, handleLinkClick],
  );

  return (
    <SidebarBase
      hideDrawer={hideDrawer}
      setHideDrawer={setHideDrawer}
      portalType="user"
      backgroundColor="var(--sidebar-bg-user)"
      persistToggleState={true}
      headerContent={headerContent}
      footerContent={
        <>
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

export default UserSidebar;
