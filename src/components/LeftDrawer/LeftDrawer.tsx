/**
 * Represents the left navigation drawer for the Talawa Admin Portal.
 *
 * @remarks
 * - Uses `useTranslation` for i18n.
 * - Automatically hides on screen widths ≤ 820px after clicking a link.
 * - Conditionally renders the "Users" section based on SuperAdmin status.
 * - Includes dynamic plugin drawer items for admin routes.
 * - **REFACTORED**: Now uses shared SidebarBase, SidebarNavItem, and SidebarPluginSection components
 *
 * @param props - Props including drawer visibility state and setter function.
 * @returns The rendered LeftDrawer component.
 */

import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import OrganizationsIcon from 'assets/svgs/organizations.svg?react';
import RolesIcon from 'assets/svgs/roles.svg?react';
import SettingsIcon from 'assets/svgs/settings.svg?react';
import PluginLogo from 'assets/svgs/plugins.svg?react';
import styles from 'style/app-fixed.module.css';
import useLocalStorage from 'utils/useLocalstorage';
import { usePluginDrawerItems } from 'plugin';
import ProfileCard from 'components/ProfileCard/ProfileCard';
import SignOut from 'components/SignOut/SignOut';
import SidebarBase from 'components/Sidebar/SidebarBase/SidebarBase';
import SidebarNavItem from 'components/Sidebar/SidebarNavItem/SidebarNavItem';
import SidebarPluginSection from 'components/Sidebar/SidebarPluginSection/SidebarPluginSection';

export interface ILeftDrawerProps {
  hideDrawer: boolean;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

const leftDrawer = ({
  hideDrawer,
  setHideDrawer,
}: ILeftDrawerProps): React.ReactElement => {
  const { t } = useTranslation('translation', { keyPrefix: 'leftDrawer' });

  const { getItem } = useLocalStorage();
  const superAdmin = getItem('SuperAdmin') === 'true';

  const handleLinkClick = useCallback((): void => {
    if (window.innerWidth <= 820) {
      setHideDrawer(true);
    }
  }, [setHideDrawer]);

  // Memoize the user permissions and admin status
  const userPermissions = useMemo(() => [], []);

  // Get plugin drawer items for admin global (settings only)
  const pluginDrawerItems = usePluginDrawerItems(userPermissions, true, false);

  // Memoize the main content to prevent unnecessary re-renders
  const drawerContent = useMemo(
    () => (
      <div className={styles.optionList}>
        <SidebarNavItem
          to="/orglist"
          icon={<OrganizationsIcon />}
          label={t('my organizations')}
          testId="organizationsBtn"
          hideDrawer={hideDrawer}
          onClick={handleLinkClick}
        />

        <SidebarNavItem
          to="/pluginstore"
          icon={<PluginLogo />}
          label={t('plugin store')}
          testId="pluginStoreBtn"
          hideDrawer={hideDrawer}
          onClick={handleLinkClick}
        />

        {superAdmin && (
          <SidebarNavItem
            to="/users"
            icon={<RolesIcon />}
            label={t('users')}
            testId="rolesBtn"
            hideDrawer={hideDrawer}
            onClick={handleLinkClick}
          />
        )}

        <SidebarNavItem
          to="/communityProfile"
          icon={<SettingsIcon />}
          label={t('communityProfile')}
          testId="communityProfileBtn"
          hideDrawer={hideDrawer}
          onClick={handleLinkClick}
        />

        <SidebarNavItem
          to="/notification"
          icon={<SettingsIcon />}
          label={t('notification')}
          testId="notificationBtn"
          hideDrawer={hideDrawer}
          onClick={handleLinkClick}
        />

        {/* Plugin Settings Section */}
        <SidebarPluginSection
          pluginItems={pluginDrawerItems}
          hideDrawer={hideDrawer}
          onItemClick={handleLinkClick}
        />
      </div>
    ),
    [pluginDrawerItems, superAdmin, t, hideDrawer, handleLinkClick],
  );

  return (
    <SidebarBase
      hideDrawer={hideDrawer}
      setHideDrawer={setHideDrawer}
      portalType="admin"
      footerContent={
        <>
          <div style={{ display: hideDrawer ? 'none' : 'flex' }}>
            <ProfileCard />
          </div>
          <SignOut hideDrawer={hideDrawer} />
        </>
      }
    >
      {drawerContent}
    </SidebarBase>
  );
};

export default leftDrawer;
