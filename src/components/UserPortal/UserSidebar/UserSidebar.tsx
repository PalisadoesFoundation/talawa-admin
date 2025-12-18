/**
 * UserSidebar Component
 *
 * This component renders the sidebar for the user portal, providing navigation
 * options such as "My Organizations" and "Settings". It also includes a profile
 * dropdown for user-specific actions. The sidebar's visibility can be toggled
 * based on the viewport width or user interaction.
 *
 *
 * @remarks
 * - The component uses `react-bootstrap` for styling buttons.
 * - Internationalization is handled using the `react-i18next` library.
 * - The sidebar adapts its visibility based on the `hideDrawer` prop and viewport width.
 *
 * @param {InterfaceUserSidebarProps} props - The props for the UserSidebar component.
 * @param {boolean | null} props.hideDrawer - Determines the visibility of the sidebar.
 *   - `null`: Sidebar is hidden by default.
 *   - `true`: Sidebar is inactive (hidden).
 *   - `false`: Sidebar is active (visible).
 * @param {React.Dispatch<React.SetStateAction<boolean | null>>} props.setHideDrawer -
 * Function to update the `hideDrawer` state.
 *
 * @returns {JSX.Element} The rendered UserSidebar component.
 *
 * @example
 * ```tsx
 * <UserSidebar hideDrawer={false} setHideDrawer={setHideDrawer} />
 * ```
 *
 */
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
import TalawaLogo from 'assets/svgs/talawa.svg?react';
import PluginLogo from 'assets/svgs/plugins.svg?react';
import styles from '../../../style/app-fixed.module.css';
import { usePluginDrawerItems } from 'plugin';
import type { IDrawerExtension } from 'plugin';
import useLocalStorage from 'utils/useLocalstorage';
import { FaBars, FaBell } from 'react-icons/fa';
import ProfileCard from 'components/ProfileCard/ProfileCard';
import SignOut from 'components/SignOut/SignOut';
import IconComponent from 'components/IconComponent/IconComponent';

export interface InterfaceUserSidebarProps {
  hideDrawer: boolean;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

const userSidebar = ({
  hideDrawer,
  setHideDrawer,
}: InterfaceUserSidebarProps): JSX.Element => {
  // Translation hook for internationalization
  const { t } = useTranslation('translation');
  const { t: tCommon } = useTranslation('common');

  // Memoize the parameters to prevent infinite re-renders
  const userPermissions = React.useMemo(() => [], []);
  const isAdmin = React.useMemo(() => false, []);
  const isOrg = React.useMemo(() => false, []);
  const { setItem, getItem } = useLocalStorage();
  const role = getItem<string>('role');
  const userRole = role != 'regular' ? 'Admin' : 'User';
  const portal = userRole == 'Admin' ? 'admin' : 'user';

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

  // Render a drawer item with icon
  const renderDrawerItem = useCallback(
    (to: string, icon: React.ReactNode, label: string, testId: string) => (
      <NavLink key={to} to={to} onClick={handleLinkClick}>
        {({ isActive }) => {
          let styledIcon = icon;

          if (React.isValidElement(icon) && typeof icon.type !== 'string') {
            // Check if it's FaBell (react-icon) by checking the icon itself
            if (icon.type === FaBell) {
              styledIcon = React.cloneElement(
                icon as React.ReactElement<{ style?: React.CSSProperties }>,
                {
                  style: {
                    fontSize: 25,
                    color: isActive ? '#000000' : 'var(--bs-secondary)',
                  },
                },
              );
            } else {
              // Handle SVG icons
              styledIcon = React.cloneElement<React.SVGProps<SVGSVGElement>>(
                icon as React.ReactElement<React.SVGProps<SVGSVGElement>>,
                {
                  fill: 'none',
                  fontSize: 25,
                  stroke: isActive
                    ? 'var(--sidebar-icon-stroke-active)'
                    : 'var(--sidebar-icon-stroke-inactive)',
                },
              );
            }
          }

          return (
            <button
              type="button"
              className={`${
                isActive ? styles.sidebarBtnActive : styles.sidebarBtn
              }`}
              data-testid={testId}
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

  return (
    <>
      <div
        className={`${styles.leftDrawer} 
        ${hideDrawer ? styles.collapsedDrawer : styles.expandedDrawer}`}
        style={{ backgroundColor: '#f0f7fb' }}
        data-testid="leftDrawerContainer"
      >
        <div
          className={`d-flex align-items-center ${hideDrawer ? 'justify-content-center' : 'justify-content-between'}`}
        >
          <button
            className={`d-flex align-items-center btn p-0 border-0 bg-transparent`}
            data-testid="toggleBtn"
            onClick={() => {
              const newState = !hideDrawer;
              setItem('sidebar', newState.toString());
              setHideDrawer(newState);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const newState = !hideDrawer;
                setItem('sidebar', newState.toString());
                setHideDrawer(newState);
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
              {tCommon('userPortal')}
            </div>
          </div>
        </div>

        {/* User Profile Section - Top position like Admin Portal */}
        {!hideDrawer && (
          <div
            style={{
              backgroundColor: '#e8f4f8',
              padding: '10px',
              borderRadius: '8px',
              margin: '10px',
            }}
          >
            <ProfileCard portal={portal} />
          </div>
        )}

        <div
          className={`d-flex flex-column ${styles.sidebarcompheight}`}
          data-testid="sidebar-main-content"
        >
          <div className={styles.optionList}>
            {renderDrawerItem(
              '/user/organizations',
              <IconComponent name="My Organizations" />,
              t('userSidebarOrg.my organizations'),
              'orgsBtn',
            )}

            {renderDrawerItem(
              '/user/notification',
              <FaBell />,
              tCommon('notifications'),
              'userNotificationBtn',
            )}

            {renderDrawerItem(
              '/user/settings',
              <IconComponent name="Settings" />,
              tCommon('Settings'),
              'settingsBtn',
            )}

            {/* Plugin Global Features Section */}
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
        </div>
        <div className={styles.userSidebarOrgFooter}>
          <div style={{ display: hideDrawer ? 'none' : 'flex' }}>
            <ProfileCard portal={portal} />
          </div>
          <SignOut hideDrawer={hideDrawer} />
        </div>
      </div>
    </>
  );
};

export default userSidebar;
