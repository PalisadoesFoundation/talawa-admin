/**
 * Represents the left navigation drawer for the Talawa Admin Portal.
 *
 * @remarks
 * - Uses `useTranslation` for i18n.
 * - Automatically hides on screen widths ≤ 820px after clicking a link.
 * - Conditionally renders the "Users" section based on SuperAdmin status.
 * - Includes dynamic plugin drawer items for admin routes.
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
import type { IDrawerExtension } from 'plugin';
import SidebarHeader from 'components/Sidebar/SidebarHeader';
import SidebarMenuItem from 'components/Sidebar/SidebarMenuItem';
import SidebarProfileSection from 'components/Sidebar/SidebarProfileSection';

export interface ILeftDrawerProps {
  hideDrawer: boolean;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

const leftDrawer = ({
  hideDrawer,
  setHideDrawer,
}: ILeftDrawerProps): React.ReactElement => {
  const { t } = useTranslation('translation', { keyPrefix: 'leftDrawer' });
  const { t: tCommon } = useTranslation('common');

  const { getItem } = useLocalStorage();
  const superAdmin = getItem('SuperAdmin') === 'true';

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
        <SidebarMenuItem
          key={item.pluginId}
          to={item.path}
          icon={Icon}
          label={item.label}
          testId={`plugin-${item.pluginId}-btn`}
          hideDrawer={hideDrawer}
          onClick={handleLinkClick}
          variant="admin"
        />
      );
    },
    [hideDrawer, handleLinkClick],
  );

  // Memoize the user permissions and admin status
  const userPermissions = useMemo(() => [], []);

  // Get plugin drawer items for admin global (settings only)
  const pluginDrawerItems = usePluginDrawerItems(userPermissions, true, false);

  // Memoize the main content to prevent unnecessary re-renders
  const drawerContent = useMemo(
    () => (
      <div className={styles.optionList}>
        <SidebarMenuItem
          to="/orglist"
          icon={<OrganizationsIcon />}
          label={t('my organizations')}
          testId="organizationsBtn"
          hideDrawer={hideDrawer}
          onClick={handleLinkClick}
          variant="admin"
        />

        <SidebarMenuItem
          to="/pluginstore"
          icon={<PluginLogo />}
          label={t('plugin store')}
          testId="pluginStoreBtn"
          hideDrawer={hideDrawer}
          onClick={handleLinkClick}
          variant="admin"
        />

        {superAdmin && (
          <SidebarMenuItem
            to="/users"
            icon={<RolesIcon />}
            label={t('users')}
            testId="rolesBtn"
            hideDrawer={hideDrawer}
            onClick={handleLinkClick}
            variant="admin"
          />
        )}

        <SidebarMenuItem
          to="/communityProfile"
          icon={<SettingsIcon />}
          label={t('communityProfile')}
          testId="communityProfileBtn"
          hideDrawer={hideDrawer}
          onClick={handleLinkClick}
          variant="admin"
        />

        <SidebarMenuItem
          to="/notification"
          icon={<SettingsIcon />}
          label={t('notification')}
          testId="notificationBtn"
          hideDrawer={hideDrawer}
          onClick={handleLinkClick}
          variant="admin"
        />

        {/* Plugin Settings Section */}
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
              Plugin Settings
            </h4>
            {pluginDrawerItems?.map((item) => renderPluginDrawerItem(item))}
          </>
        )}
      </div>
    ),
    [
      renderPluginDrawerItem,
      pluginDrawerItems,
      superAdmin,
      t,
      hideDrawer,
      handleLinkClick,
    ],
  );

  return (
    <div
      className={`${styles.leftDrawer} 
        ${hideDrawer ? styles.collapsedDrawer : styles.expandedDrawer}`}
      data-testid="leftDrawerContainer"
    >
      <SidebarHeader
        hideDrawer={hideDrawer}
        setHideDrawer={setHideDrawer}
        portalTitle={tCommon('talawaAdminPortal')}
        persistState={false}
      />

      <div className={`d-flex flex-column ${styles.sidebarcompheight}`}>
        {drawerContent}
      </div>

      <SidebarProfileSection hideDrawer={hideDrawer} />
    </div>
  );
};

export default leftDrawer;
