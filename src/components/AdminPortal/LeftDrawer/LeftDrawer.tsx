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
import { FaBell, FaExchangeAlt, FaUsers } from 'react-icons/fa';
import OrganizationsIcon from 'assets/svgs/organizations.svg?react';
import SettingsIcon from 'assets/svgs/settings.svg?react';
import PluginLogo from 'assets/svgs/plugins.svg?react';
import styles from './LeftDrawer.module.css';

import { usePluginDrawerItems } from 'plugin';
import ProfileCard from 'components/ProfileCard/ProfileCard';
import SignOut from 'components/SignOut/SignOut';
import SidebarBase from 'shared-components/SidebarBase/SidebarBase';
import SidebarNavItem from 'shared-components/SidebarNavItem/SidebarNavItem';
import SidebarPluginSection from 'shared-components/SidebarPluginSection/SidebarPluginSection';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';

export interface ILeftDrawerProps {
  hideDrawer: boolean;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

const LeftDrawer = ({
  hideDrawer,
  setHideDrawer,
}: ILeftDrawerProps): React.ReactElement => {
  const { t } = useTranslation('translation', { keyPrefix: 'leftDrawer' });
  const { t: tErrors } = useTranslation('errors');

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
      <>
        <SidebarNavItem
          to="/admin/orglist"
          icon={<OrganizationsIcon />}
          label={t('my organizations')}
          testId="organizationsBtn"
          hideDrawer={hideDrawer}
          onClick={handleLinkClick}
        />

        <SidebarNavItem
          to="/admin/users"
          icon={<FaUsers />}
          label={t('users')}
          testId="usersBtn"
          hideDrawer={hideDrawer}
          onClick={handleLinkClick}
          iconType="react-icon"
        />

        <SidebarNavItem
          to="/admin/pluginstore"
          icon={<PluginLogo />}
          label={t('plugin store')}
          testId="pluginStoreBtn"
          hideDrawer={hideDrawer}
          onClick={handleLinkClick}
        />

        <SidebarNavItem
          to="/admin/communityProfile"
          icon={<SettingsIcon />}
          label={t('communityProfile')}
          testId="communityProfileBtn"
          hideDrawer={hideDrawer}
          onClick={handleLinkClick}
        />

        <SidebarNavItem
          to="/admin/notification"
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
      </>
    ),
    [pluginDrawerItems, t, hideDrawer, handleLinkClick],
  );

  return (
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
    >
      <SidebarBase
        hideDrawer={hideDrawer}
        setHideDrawer={setHideDrawer}
        portalType="admin"
        footerContent={
          <>
            <div className={styles.switchPortalWrapper}>
              <SidebarNavItem
                to="/user/organizations"
                icon={<FaExchangeAlt />}
                label={t('switchToUserPortal')}
                testId="switchToUserPortalBtn"
                hideDrawer={hideDrawer}
                onClick={handleLinkClick}
                iconType="react-icon"
              />
            </div>
            <div
              className={
                hideDrawer
                  ? styles.profileCardHidden
                  : styles.profileCardWrapper
              }
            >
              <ProfileCard />
            </div>
            <SignOut hideDrawer={hideDrawer} />
          </>
        }
      >
        {drawerContent}
      </SidebarBase>
    </ErrorBoundaryWrapper>
  );
};

export default LeftDrawer;
