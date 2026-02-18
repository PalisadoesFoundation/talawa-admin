/**
 * Component representing the left drawer for organization-related navigation and actions.
 *
 * @param props - The props for the component.
 * @param targets - List of navigation targets with names and URLs.
 * @param orgId - The ID of the organization to fetch data for.
 * @param hideDrawer - State indicating whether the drawer is hidden.
 * @param setHideDrawer - Function to toggle the drawer visibility.
 * @returns  The rendered LeftDrawerOrg component.
 *
 * @remarks
 * - Uses `useTranslation` for internationalization of text.
 * - Fetches organization data using the `GET_ORGANIZATION_DATA_PG` GraphQL query.
 * - Determines if the current page is the admin profile page based on the URL path.
 * - Adjusts drawer visibility for smaller screens when navigation links are clicked.
 * - **REFACTORED**: Now uses shared SidebarBase, SidebarNavItem, SidebarOrgSection, and SidebarPluginSection components
 *
 * @example
 * ```tsx
 * <LeftDrawerOrg
 *   targets={[{ name: 'Dashboard', url: '/dashboard' }]}
 *   orgId="12345"
 *   hideDrawer={false}
 *   setHideDrawer={setHideDrawerFunction}
 * />
 * ```
 *
 * @internal
 * This component is part of the Talawa Admin Portal and is styled using `styles` imported from a CSS module.
 */

import CollapsibleDropdown from 'components/CollapsibleDropdown/CollapsibleDropdown';
import IconComponent from 'components/IconComponent/IconComponent';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaExchangeAlt } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import type { TargetsType } from 'state/reducers/routesReducer';
import styles from './LeftDrawerOrg.module.css';
import useLocalStorage from 'utils/useLocalstorage';
import { usePluginDrawerItems } from 'plugin';
import ProfileCard from 'components/ProfileCard/ProfileCard';
import SignOut from 'components/SignOut/SignOut';
import SidebarBase from 'shared-components/SidebarBase/SidebarBase';
import SidebarNavItem from 'shared-components/SidebarNavItem/SidebarNavItem';
import SidebarOrgSection from 'shared-components/SidebarOrgSection/SidebarOrgSection';
import SidebarPluginSection from 'shared-components/SidebarPluginSection/SidebarPluginSection';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';

export interface ILeftDrawerProps {
  orgId: string;
  targets: TargetsType[];
  hideDrawer: boolean;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * LeftDrawerOrg component for displaying organization details and options.
 *
 * @param orgId - ID of the current organization.
 * @param targets - List of navigation targets.
 * @param hideDrawer - Determines if the drawer should be hidden or shown.
 * @param setHideDrawer - Function to update the visibility state of the drawer.
 * @returns JSX element for the left navigation drawer with organization details.
 */
const LeftDrawerOrg = ({
  targets,
  orgId,
  hideDrawer,
  setHideDrawer,
}: ILeftDrawerProps): React.ReactElement => {
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');
  const location = useLocation();
  const { getItem } = useLocalStorage();
  const userId = getItem('id') as string | null;

  const [isProfilePage, setIsProfilePage] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Memoize the user permissions and admin status
  const userPermissions = useMemo(() => [], []);
  const isAdmin = useMemo(() => true, []); // Organization admins are always admin

  // Get plugin drawer items for org admin (org-specific only)
  const pluginDrawerItems = usePluginDrawerItems(
    userPermissions,
    isAdmin,
    true,
  );

  const getIdFromPath = (pathname: string): string => {
    const segments = pathname.split('/');
    return segments.length > 2 ? segments[2] : '';
  };

  const pathId = useMemo(
    () => getIdFromPath(location.pathname),
    [location.pathname],
  );

  // Check if the current page is admin profile page
  useEffect(() => {
    // if param id is equal to userId, then it is a profile page
    setIsProfilePage(pathId === userId);
  }, [pathId, userId]);

  const handleLinkClick = useCallback((): void => {
    if (window.innerWidth <= 820) {
      setHideDrawer(true);
    }
  }, [setHideDrawer]);

  // Memoize the main content to prevent unnecessary re-renders
  const drawerContent = useMemo(
    () => (
      <>
        {targets.map(({ name, url }, index) =>
          url ? (
            <SidebarNavItem
              key={name}
              to={url}
              icon={
                <IconComponent
                  name={name === 'Membership Requests' ? 'Requests' : name}
                  fill="var(--bs-black)"
                />
              }
              label={tCommon(name)}
              testId={name}
              dataCy={'leftDrawerButton-' + name}
              hideDrawer={hideDrawer}
              onClick={handleLinkClick}
              useSimpleButton={true}
            />
          ) : (
            <CollapsibleDropdown
              key={name}
              target={targets[index]}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
            />
          ),
        )}

        {/* Plugin Routes Section */}
        <SidebarPluginSection
          pluginItems={pluginDrawerItems}
          hideDrawer={hideDrawer}
          orgId={orgId}
          onItemClick={handleLinkClick}
          useSimpleButton={true}
        />
      </>
    ),
    [
      targets,
      pluginDrawerItems,
      showDropdown,
      tCommon,
      hideDrawer,
      handleLinkClick,
      orgId,
    ],
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
        persistToggleState={true}
        headerContent={
          <SidebarOrgSection
            orgId={orgId}
            hideDrawer={hideDrawer}
            isProfilePage={isProfilePage}
          />
        }
        footerContent={
          <>
            <div className={styles.switchPortalWrapper}>
              <SidebarNavItem
                to="/user/organizations"
                icon={<FaExchangeAlt />}
                label={tCommon('switchToUserPortal')}
                testId="switchToUserPortalBtn"
                hideDrawer={hideDrawer}
                onClick={handleLinkClick}
                iconType="react-icon"
              />
            </div>
            <div
              className={
                hideDrawer
                  ? styles.profileContainerHidden
                  : styles.profileContainer
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

export default LeftDrawerOrg;
