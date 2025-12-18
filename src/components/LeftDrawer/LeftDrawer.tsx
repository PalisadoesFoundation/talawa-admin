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
import { NavLink } from 'react-router';
import OrganizationsIcon from 'assets/svgs/organizations.svg?react';
import RolesIcon from 'assets/svgs/roles.svg?react';
import SettingsIcon from 'assets/svgs/settings.svg?react';
import TalawaLogo from 'assets/svgs/talawa.svg?react';
import PluginLogo from 'assets/svgs/plugins.svg?react';
import styles from 'style/app-fixed.module.css';
import useLocalStorage from 'utils/useLocalstorage';
import { usePluginDrawerItems } from 'plugin';
import type { IDrawerExtension } from 'plugin';
import { FaBars } from 'react-icons/fa';
import ProfileCard from 'components/ProfileCard/ProfileCard';
import SignOut from 'components/SignOut/SignOut';

export interface ILeftDrawerProps {
  hideDrawer: boolean;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

const leftDrawer = ({
  hideDrawer,
  setHideDrawer,
}: ILeftDrawerProps): React.ReactElement => {
  const { t } = useTranslation('translation');
  const { t: tCommon } = useTranslation('common');

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

  // Render a drawer item with icon
  const renderDrawerItem = useCallback(
    (to: string, icon: React.ReactNode, label: string, testId: string) => (
      <NavLink key={to} to={to} onClick={handleLinkClick}>
        {({ isActive }) => {
          const styledIcon =
            React.isValidElement(icon) && typeof icon.type !== 'string'
              ? React.cloneElement<React.SVGProps<SVGSVGElement>>(
                  icon as React.ReactElement<React.SVGProps<SVGSVGElement>>,
                  {
                    fill: 'none',
                    fontSize: 25,
                    stroke: isActive
                      ? 'var(--sidebar-icon-stroke-active)'
                      : 'var(--sidebar-icon-stroke-inactive)',
                  },
                )
              : icon;

          return (
            <button
              className={`${
                isActive ? styles.sidebarBtnActive : styles.sidebarBtn
              }`}
              data-testid={testId}
              type="button"
            >
              <div className={styles.iconWrapper}>{styledIcon}</div>
              {!hideDrawer && label}
            </button>
          );
        }}
      </NavLink>
    ),
    [handleLinkClick, hideDrawer],
  );

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

      return renderDrawerItem(
        item.path,
        Icon,
        item.label,
        `plugin-${item.pluginId}-btn`,
      );
    },
    [renderDrawerItem],
  );

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
          t('userSidebarOrg.my organizations'),
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
                  {!hideDrawer && t('userSidebarOrg.users')}
                </button>
              );
            }}
          </NavLink>
        )}

        {renderDrawerItem(
          '/pluginstore',
          <PluginLogo />,
          t('leftDrawer.plugin store'),
          'pluginStoreBtn',
        )}

        {renderDrawerItem(
          '/communityProfile',
          <SettingsIcon />,
          t('userSidebarOrg.communityProfile'),
          'communityProfileBtn',
        )}

        {renderDrawerItem(
          '/notification',
          <SettingsIcon />,
          t('leftDrawerOrg.notification'),
          'notificationBtn',
        )}

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
    <div
      className={`${styles.leftDrawer} 
        ${hideDrawer ? styles.collapsedDrawer : styles.expandedDrawer}`}
      data-testid="leftDrawerContainer"
    >
      <div
        className={`d-flex align-items-center ${hideDrawer ? 'justify-content-center' : 'justify-content-between'}`}
      >
        <button
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
          role="button"
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
            {tCommon('adminPortal')}
          </div>
        </div>
      </div>

      <div className={`d-flex flex-column ${styles.sidebarcompheight}`}>
        {drawerContent}
      </div>
      <div className={styles.userSidebarOrgFooter}>
        <div style={{ display: hideDrawer ? 'none' : 'flex' }}>
          <ProfileCard />
        </div>
        <SignOut hideDrawer={hideDrawer} />
      </div>
    </div>
  );
};

export default leftDrawer;
