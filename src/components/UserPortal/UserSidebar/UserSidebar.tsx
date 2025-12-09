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
      </div>
    ),
    [pluginDrawerItems, t, tCommon, hideDrawer, handleLinkClick],
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
              t('my organizations'),
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

export default UserSidebar;
