/**
 * UserSidebar Component
 *
 * This component renders the sidebar for the user portal, providing navigation
 * options such as "My Organizations" and "Settings". It also includes a profile
 * dropdown for user-specific actions. The sidebar's visibility can be toggled
 * based on the viewport width or user interaction.
 *
 * @remarks
 * - The component uses reusable shared sidebar components.
 * - Internationalization is handled using the `react-i18next` library.
 * - The sidebar adapts its visibility based on the `hideDrawer` prop and viewport width.
 * - **REFACTORED**: Now uses shared SidebarBase, SidebarNavItem, and SidebarPluginSection components
 *
 * @param {InterfaceUserSidebarProps} props - The props for the UserSidebar component.
 * @param {boolean} props.hideDrawer - Determines the visibility of the sidebar.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setHideDrawer -
 * Function to update the `hideDrawer` state.
 *
 * @returns {JSX.Element} The rendered UserSidebar component.
 *
 * @example
 * ```tsx
 * <UserSidebar hideDrawer={false} setHideDrawer={setHideDrawer} />
 * ```
 */

import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FaBell } from 'react-icons/fa';
import styles from '../../../style/app-fixed.module.css';
import { usePluginDrawerItems } from 'plugin';
import ProfileCard from 'components/ProfileCard/ProfileCard';
import SignOut from 'components/SignOut/SignOut';
import IconComponent from 'components/IconComponent/IconComponent';
import SidebarBase from 'components/Sidebar/SidebarBase/SidebarBase';
import SidebarNavItem from 'components/Sidebar/SidebarNavItem/SidebarNavItem';
import SidebarPluginSection from 'components/Sidebar/SidebarPluginSection/SidebarPluginSection';

export interface InterfaceUserSidebarProps {
  hideDrawer: boolean;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

const userSidebar = ({
  hideDrawer,
  setHideDrawer,
}: InterfaceUserSidebarProps): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'userSidebarOrg' });
  const { t: tCommon } = useTranslation('common');

  // Memoize the parameters to prevent infinite re-renders
  const userPermissions = useMemo(() => [], []);
  const isAdmin = useMemo(() => false, []);
  const isOrg = useMemo(() => false, []);

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
        <SidebarNavItem
          to="/user/organizations"
          icon={<IconComponent name="My Organizations" />}
          label={t('my organizations')}
          testId="orgsBtn"
          hideDrawer={hideDrawer}
          onClick={handleLinkClick}
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
        />

        {/* Plugin Global Features Section */}
        <SidebarPluginSection
          pluginItems={pluginDrawerItems}
          hideDrawer={hideDrawer}
          onItemClick={handleLinkClick}
        />
      </div>
    ),
    [pluginDrawerItems, t, tCommon, hideDrawer, handleLinkClick],
  );

  return (
    <SidebarBase
      hideDrawer={hideDrawer}
      setHideDrawer={setHideDrawer}
      portalType="user"
      backgroundColor="#f0f7fb"
      persistToggleState={true}
      headerContent={headerContent}
      footerContent={<SignOut hideDrawer={hideDrawer} />}
    >
      {drawerContent}
    </SidebarBase>
  );
};

export default userSidebar;
