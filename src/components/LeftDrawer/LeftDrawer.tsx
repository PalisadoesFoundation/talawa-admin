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
import { FaBell } from 'react-icons/fa';
import OrganizationsIcon from 'assets/svgs/organizations.svg?react';
import RolesIcon from 'assets/svgs/roles.svg?react';
import SettingsIcon from 'assets/svgs/settings.svg?react';
import PluginLogo from 'assets/svgs/plugins.svg?react';
import styles from 'style/app-fixed.module.css';
import useLocalStorage from 'utils/useLocalstorage';
import { usePluginDrawerItems } from 'plugin';
import ProfileCard from 'components/ProfileCard/ProfileCard';
import SignOut from 'components/SignOut/SignOut';
import SidebarBase from 'shared-components/SidebarBase/SidebarBase';
import SidebarNavItem from 'shared-components/SidebarNavItem/SidebarNavItem';
import SidebarPluginSection from 'shared-components/SidebarPluginSection/SidebarPluginSection';

export interface ILeftDrawerProps {
  hideDrawer: boolean;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

const LeftDrawer = ({
  hideDrawer,
  setHideDrawer,
}: ILeftDrawerProps): React.ReactElement => {
  const { t } = useTranslation('translation', { keyPrefix: 'leftDrawer' });

  const { getItem } = useLocalStorage();
  const rawRole = getItem<string>('role');
  const storedRole =
    typeof rawRole === 'string' ? rawRole.trim().toLowerCase() : 'regular';
  const isAdmin = storedRole === 'administrator';

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
        {renderDrawerItem(
          '/orglist',
          <OrganizationsIcon />,
          t('my organizations'),
          'organizationsBtn',
        )}

        {isAdmin && (
          <NavLink to="/users" onClick={handleLinkClick}>
            {({ isActive }) => {
              const fillColor = isActive
                ? 'var(--sidebar-icon-fill-active)'
                : 'var(--sidebar-icon-fill-inactive)';

              const styledRolesIcon = (
                <RolesIcon
                  width={25}
                  height={25}
                  fill={fillColor}
                  stroke="none"
                  color={fillColor}
                />
              );

              return (
                <button
                  className={`${
                    isActive ? styles.sidebarBtnActive : styles.sidebarBtn
                  }`}
                  data-testid="rolesBtn"
                  type="button"
                >
                  <div className={styles.iconWrapper}>{styledRolesIcon}</div>
                  {!hideDrawer && t('users')}
                </button>
              );
            }}
          </NavLink>
        )}

        {renderDrawerItem(
          '/pluginstore',
          <PluginLogo />,
          t('plugin store'),
          'pluginStoreBtn',
        )}

        {renderDrawerItem(
          '/communityProfile',
          <SettingsIcon />,
          t('communityProfile'),
          'communityProfileBtn',
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
          icon={<FaBell />}
          label={t('notification')}
          testId="notificationBtn"
          hideDrawer={hideDrawer}
          onClick={handleLinkClick}
          iconType="react-icon"
        />

        {/* Plugin Settings Section */}
        <SidebarPluginSection
          pluginItems={pluginDrawerItems}
          hideDrawer={hideDrawer}
          onItemClick={handleLinkClick}
        />
      </div>
    ),
    [
      renderDrawerItem,
      renderPluginDrawerItem,
      pluginDrawerItems,
      isAdmin,
      t,
      tCommon,
      hideDrawer,
    ],
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

export default LeftDrawer;
