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
import React from 'react';
import Button from 'react-bootstrap/Button';
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
  const { t } = useTranslation('translation', { keyPrefix: 'userSidebarOrg' });
  const { t: tCommon } = useTranslation('common');

  // Memoize the parameters to prevent infinite re-renders
  const userPermissions = React.useMemo(() => [], []);
  const isAdmin = React.useMemo(() => false, []);
  const isOrg = React.useMemo(() => false, []);
  const { setItem } = useLocalStorage();

  // Get plugin drawer items for user global (no orgId required)
  const pluginDrawerItems = usePluginDrawerItems(
    userPermissions,
    isAdmin,
    isOrg,
  );

  const handleLinkClick = (): void => {
    if (window.innerWidth <= 820) {
      setHideDrawer(true);
    }
  };

  // Render a plugin drawer item
  const renderPluginDrawerItem = (item: IDrawerExtension) => (
    <NavLink to={item.path} key={item.pluginId} onClick={handleLinkClick}>
      {({ isActive }) => (
        <Button
          variant={isActive ? 'success' : ''}
          style={{
            backgroundColor: isActive ? 'var(--sidebar-option-bg)' : '',
            fontWeight: isActive ? 'bold' : 'normal',
            color: isActive
              ? 'var(--sidebar-option-text-active)'
              : 'var(--sidebar-option-text-inactive)',
          }}
        >
          <div className={styles.iconWrapper}>
            {item.icon ? (
              <img
                src={item.icon}
                alt={item.label}
                style={{ width: 25, height: 25 }}
              />
            ) : (
              <PluginLogo
                stroke={`${
                  isActive === true
                    ? 'var(--sidebar-icon-stroke-active)'
                    : 'var(--sidebar-icon-stroke-inactive)'
                }`}
              />
            )}
          </div>
          {item.label}
        </Button>
      )}
    </NavLink>
  );

  return (
    <>
      <div
        className={`${styles.leftDrawer} ${hideDrawer ? styles.collapsedDrawer : styles.expandedDrawer}`}
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
              paddingRight: '40px',
            }}
          >
            <TalawaLogo className={styles.talawaLogo} />
            <div className={`${styles.talawaText} ${styles.sidebarText}`}>
              {t('talawaUserPortal')}
            </div>
          </div>
        </div>
        <h5 className={`${styles.titleHeader} text-secondary`}>
          {!hideDrawer && tCommon('menu')}
        </h5>
        <div
          className={`d-flex flex-column ${styles.leftbarcompheight}`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div className={styles.optionList}>
            {/* Link to "My Organizations" page */}
            <NavLink to={'/user/organizations'} onClick={handleLinkClick}>
              {({ isActive }) => (
                <Button
                  variant={isActive ? 'success' : ''}
                  style={{
                    backgroundColor: isActive ? 'var(--sidebar-option-bg)' : '',
                    fontWeight: isActive ? 'bold' : 'normal',
                    color: isActive
                      ? 'var(--sidebar-option-text-active)'
                      : 'var(--sidebar-option-text-inactive)',
                  }}
                  data-testid="orgsBtn"
                >
                  <div className={styles.iconWrapper}>
                    <IconComponent
                      data-testid="myOrgsIcon"
                      name="My Organizations"
                      fill={
                        isActive === true ? '#000000' : 'var(--bs-secondary)'
                      }
                    />
                  </div>
                  <div className={styles.sidebarText} data-testid="myOrgsText">
                    <div
                      style={{ display: hideDrawer ? 'none' : 'block' }}
                      data-testid="myOrgText"
                    >
                      {t('my organizations')}
                    </div>
                  </div>
                </Button>
              )}
            </NavLink>
            {/* Link to Notifications page */}
            <NavLink to={'/user/notification'} onClick={handleLinkClick}>
              {({ isActive }) => (
                <Button
                  variant={isActive ? 'success' : ''}
                  style={{
                    backgroundColor: isActive ? 'var(--sidebar-option-bg)' : '',
                    fontWeight: isActive ? 'bold' : 'normal',
                    color: isActive
                      ? 'var(--sidebar-option-text-active)'
                      : 'var(--sidebar-option-text-inactive)',
                  }}
                  data-testid="userNotificationBtn"
                >
                  <div className={styles.iconWrapper}>
                    <FaBell
                      style={{
                        width: 25,
                        height: 25,
                        color: isActive
                          ? 'var(--sidebar-icon-stroke-active)'
                          : 'var(--bs-secondary)',
                      }}
                    />
                  </div>
                  <div style={{ display: hideDrawer ? 'none' : 'block' }}>
                    {tCommon('notifications')}
                  </div>
                </Button>
              )}
            </NavLink>
            {/* Link to "Settings" page */}
            <NavLink to={'/user/settings'} onClick={handleLinkClick}>
              {({ isActive }) => (
                <Button
                  variant={isActive ? 'success' : ''}
                  style={{
                    backgroundColor: isActive ? 'var(--sidebar-option-bg)' : '',
                    fontWeight: isActive ? 'bold' : 'normal',
                    boxShadow: isActive ? 'none' : '',
                    color: isActive
                      ? 'var(--sidebar-option-text-active)'
                      : 'var(--sidebar-option-text-inactive)',
                  }}
                  data-testid="settingsBtn"
                >
                  <div className={styles.iconWrapper}>
                    <IconComponent
                      data-testid="settingsIcon"
                      name="Settings"
                      fill={
                        isActive === true ? '#000000' : 'var(--bs-secondary)'
                      }
                    />
                  </div>
                  <div
                    style={{ display: hideDrawer ? 'none' : 'block' }}
                    data-testid="settingsText"
                  >
                    {tCommon('Settings')}
                  </div>
                </Button>
              )}
            </NavLink>

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
          <div className={styles.userSidebarOrgFooter}>
            <div style={{ display: hideDrawer ? 'none' : 'flex' }}>
              <ProfileCard />
            </div>
            <SignOut hideDrawer={hideDrawer} />
          </div>
        </div>
      </div>
    </>
  );
};

export default userSidebar;
