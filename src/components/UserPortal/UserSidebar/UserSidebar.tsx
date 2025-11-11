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
import { useTranslation } from 'react-i18next';
import PluginLogo from 'assets/svgs/plugins.svg?react';
import styles from '../../../style/app-fixed.module.css';
import { usePluginDrawerItems } from 'plugin';
import type { IDrawerExtension } from 'plugin';
import { FaBell, FaExchangeAlt } from 'react-icons/fa';
import IconComponent from 'components/IconComponent/IconComponent';
import SidebarHeader from 'components/Sidebar/SidebarHeader';
import SidebarMenuItem from 'components/Sidebar/SidebarMenuItem';
import SidebarProfileSection from 'components/Sidebar/SidebarProfileSection';
import useLocalStorage from 'utils/useLocalstorage';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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
  const navigate = useNavigate();

  // Memoize the parameters to prevent infinite re-renders
  const userPermissions = React.useMemo(() => [], []);
  const isAdmin = React.useMemo(() => false, []);
  const isOrg = React.useMemo(() => false, []);
  const { setItem, getItem } = useLocalStorage();

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

  const handleSwitchToAdmin = (
    e: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    e.preventDefault();
    const selectedOrgId = getItem('selectedUserOrgId') as string;

    if (!selectedOrgId) {
      // Set flag to indicate user wants to switch to admin
      setItem('switchToAdminIntent', 'true');
      toast.warning(t('selectOrgBeforeSwitch'), {
        position: 'top-right',
        autoClose: 4000,
      });
    } else {
      navigate('/orglist');
    }
  };

  // Render a plugin drawer item
  const renderPluginDrawerItem = (item: IDrawerExtension) => {
    const Icon = item.icon ? (
      <img src={item.icon} alt={item.label} style={{ width: 25, height: 25 }} />
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
        variant="user"
      />
    );
  };

  return (
    <>
      <div
        className={`${styles.leftDrawer} ${hideDrawer ? styles.collapsedDrawer : styles.expandedDrawer}`}
        style={{ backgroundColor: '#e3f2fd' }}
        data-testid="leftDrawerContainer"
      >
        <SidebarHeader
          hideDrawer={hideDrawer}
          setHideDrawer={setHideDrawer}
          portalTitle={tCommon('userPortal')}
          persistState={true}
        />
        {/* Switch to Admin Portal Button - Top position */}
        {!hideDrawer && (
          <div className={styles.switchToAdminBtnContainer}>
            <button
              type="button"
              className={`btn w-100 d-flex align-items-center justify-content-between ${styles.switchToAdminBtn}`}
              onClick={handleSwitchToAdmin}
            >
              <span>{tCommon('switchToAdminPortal')}</span>
              <FaExchangeAlt size={18} />
            </button>
          </div>
        )}
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
            <SidebarMenuItem
              to="/user/organizations"
              icon={
                <IconComponent
                  data-testid="myOrgsIcon"
                  name="My Organizations"
                  fill="var(--bs-secondary)"
                />
              }
              label={t('my organizations')}
              testId="orgsBtn"
              hideDrawer={hideDrawer}
              onClick={handleLinkClick}
              variant="user"
            />
            {/* Link to Notifications page */}
            <SidebarMenuItem
              to="/user/notification"
              icon={
                <FaBell
                  style={{
                    width: 25,
                    height: 25,
                    color: 'var(--bs-secondary)',
                  }}
                />
              }
              label={tCommon('notifications')}
              testId="userNotificationBtn"
              hideDrawer={hideDrawer}
              onClick={handleLinkClick}
              variant="user"
            />
            {/* Link to "Settings" page */}
            <SidebarMenuItem
              to="/user/settings"
              icon={
                <IconComponent
                  data-testid="settingsIcon"
                  name="Settings"
                  fill="var(--bs-secondary)"
                />
              }
              label={tCommon('Settings')}
              testId="settingsBtn"
              hideDrawer={hideDrawer}
              onClick={handleLinkClick}
              variant="user"
            />

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
        <SidebarProfileSection hideDrawer={hideDrawer} />
      </div>
    </>
  );
};

export default userSidebar;
