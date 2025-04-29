/**
 * Component representing the left drawer for organization-related navigation and actions.
 *
 * @component
 * @param {InterfaceLeftDrawerProps} props - The props for the component.
 * @param {Array} props.targets - List of navigation targets with names and URLs.
 * @param {string} props.orgId - The ID of the organization to fetch data for.
 * @param {boolean | null} props.hideDrawer - State indicating whether the drawer is hidden.
 * @param {React.Dispatch<React.SetStateAction<boolean | null>>} props.setHideDrawer - Function to toggle the drawer visibility.
 * @returns {JSX.Element} The rendered LeftDrawerOrg component.
 *
 * @remarks
 * - Uses `useTranslation` for internationalization of text.
 * - Fetches organization data using the `GET_ORGANIZATION_DATA_PG` GraphQL query.
 * - Determines if the current page is the admin profile page based on the URL path.
 * - Adjusts drawer visibility for smaller screens when navigation links are clicked.
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
 * @dependencies
 * - `useTranslation` from `react-i18next` for translations.
 * - `useQuery` from `@apollo/client` for fetching GraphQL data.
 * - `useLocalStorage` for accessing user data from local storage.
 * - `useLocation` from `react-router-dom` for accessing the current URL path.
 *
 * @internal
 * This component is part of the Talawa Admin Portal and is styled using `styles` imported from a CSS module.
 */
import { useQuery } from '@apollo/client';
import { WarningAmberOutlined } from '@mui/icons-material';
import { GET_ORGANIZATION_DATA_PG } from 'GraphQl/Queries/Queries';
import CollapsibleDropdown from 'components/CollapsibleDropdown/CollapsibleDropdown';
import IconComponent from 'components/IconComponent/IconComponent';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';
import type { TargetsType } from 'state/reducers/routesReducer';
import AngleRightIcon from 'assets/svgs/angleRight.svg?react';
import TalawaLogo from 'assets/svgs/talawa.svg?react';
import styles from './../../style/app-fixed.module.css';
import Avatar from 'components/Avatar/Avatar';
import useLocalStorage from 'utils/useLocalstorage';

export interface InterfaceLeftDrawerProps {
  orgId: string;
  targets: TargetsType[];
  hideDrawer: boolean | null;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean | null>>;
}

/**
 * Interface for organization data from the GraphQL query
 */
interface InterfaceOrganizationData {
  id: string;
  name: string;
  description?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  countryCode?: string | null;
  avatarURL?: string | null;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    name: string;
    emailAddress: string;
  };
  updater: {
    id: string;
    name: string;
    emailAddress: string;
  };
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
const leftDrawerOrg = ({
  targets,
  orgId,
  hideDrawer,
  setHideDrawer,
}: InterfaceLeftDrawerProps): JSX.Element => {
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');
  const location = useLocation();
  const { getItem } = useLocalStorage();
  const userId = getItem('id') as string | null;

  const [isProfilePage, setIsProfilePage] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const { data, loading } = useQuery<{
    organization: InterfaceOrganizationData;
  }>(GET_ORGANIZATION_DATA_PG, {
    variables: { id: orgId, first: 10, after: null }, // Added pagination defaults
  });

  const getIdFromPath = (pathname: string): string => {
    if (!pathname) return '';
    const segments = pathname.split('/');
    return segments.length > 2 ? segments[2] : '';
  };

  const pathId = useMemo(
    () => getIdFromPath(location.pathname),
    [location.pathname],
  );

  useEffect(() => {
    if (hideDrawer === null) {
      setHideDrawer(false);
    }
  }, [hideDrawer, setHideDrawer]);
  // Check if the current page is admin profile page

  useEffect(() => {
    // if param id is equal to userId, then it is a profile page
    setIsProfilePage(pathId === userId);
  }, [pathId, userId]);

  const handleLinkClick = (): void => {
    if (window.innerWidth <= 820) {
      setHideDrawer(true);
    }
  };

  return (
    <div
      className={`${styles.leftDrawer} ${
        hideDrawer === null
          ? styles.hideElemByDefault
          : hideDrawer
            ? styles.inactiveDrawer
            : styles.activeDrawer
      }`}
      data-testid="leftDrawerContainer"
    >
      {/* Branding Section */}
      <div className={styles.brandingContainer}>
        <TalawaLogo className={styles.talawaLogo} />
        <span className={styles.talawaText}>
          {tCommon('talawaAdminPortal')}
        </span>
      </div>

      {/* Organization Section */}
      <div className={`${styles.organizationContainer} pe-3`}>
        {loading ? (
          <button
            className={`${styles.profileContainer} shimmer`}
            data-testid="orgBtn"
          />
        ) : !data?.organization ? (
          !isProfilePage && (
            <button
              className={`${styles.profileContainer} ${styles.bgDanger} text-start text-white`}
              disabled
            >
              <div className="px-3">
                <WarningAmberOutlined />
              </div>
              {tErrors('errorLoading', { entity: 'Organization' })}
            </button>
          )
        ) : (
          <button className={styles.profileContainer} data-testid="OrgBtn">
            <div className={styles.imageContainer}>
              {data.organization.avatarURL ? (
                <img
                  src={data.organization.avatarURL}
                  alt={`${data.organization.name} profile picture`}
                />
              ) : (
                <Avatar
                  name={data.organization.name}
                  containerStyle={styles.avatarContainer}
                  alt={`${data.organization.name} Picture`}
                />
              )}
            </div>
            <div className={styles.ProfileRightConatiner}>
              <div className={styles.profileText}>
                <span className={styles.primaryText}>
                  {data.organization.name}
                </span>
                <span className={styles.secondaryText}>
                  {data.organization.city || 'N/A'}
                </span>
              </div>
              <div className={styles.ArrowIcon}>
                <AngleRightIcon fill={'var(--bs-secondary)'} />
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Options List */}
      <h5 className={`${styles.titleHeader} text-secondary`}>
        {tCommon('menu')}
      </h5>
      <div className={styles.optionList}>
        {targets.map(({ name, url }, index) =>
          url ? (
            <NavLink to={url} key={name} onClick={handleLinkClick}>
              {({ isActive }) => (
                <button
                  className={
                    isActive
                      ? styles.leftDrawerActiveButton
                      : styles.leftDrawerInactiveButton
                  }
                >
                  <div className={styles.iconWrapper}>
                    <IconComponent
                      name={name === 'Membership Requests' ? 'Requests' : name}
                      fill={
                        isActive ? 'var(--bs-black)' : 'var(--bs-secondary)'
                      }
                    />
                  </div>
                  {tCommon(name)}
                </button>
              )}
            </NavLink>
          ) : (
            <CollapsibleDropdown
              key={name}
              target={targets[index]}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
            />
          ),
        )}
      </div>
    </div>
  );
};

export default leftDrawerOrg;
