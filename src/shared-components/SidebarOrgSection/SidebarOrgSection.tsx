/**
 * SidebarOrgSection Component
 *
 * Displays organization information in the sidebar including avatar, name, and location.
 * Handles loading and error states appropriately.
 *
 * @param props - The props for the component containing:
 * @param orgId - Organization ID to fetch and display
 * @param hideDrawer - Whether the drawer is hidden/collapsed
 * @param isProfilePage - Whether current page is the profile page
 *
 * @returns The rendered SidebarOrgSection component or null if drawer is hidden
 *
 * @example
 * ```tsx
 * <SidebarOrgSection
 *   orgId="123456"
 *   hideDrawer={false}
 *   isProfilePage={false}
 * />
 * ```
 */

import React from 'react';
import { useQuery } from '@apollo/client';
import { WarningAmberOutlined } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { GET_ORGANIZATION_BASIC_DATA } from 'GraphQl/Queries/Queries';
import Avatar from 'shared-components/Avatar/Avatar';
import AngleRightIcon from 'assets/svgs/angleRight.svg?react';
import styles from './SidebarOrgSection.module.css';
import type { ISidebarOrgSectionProps } from '../../types/shared-components/SidebarOrgSection/interface';

interface IOrganizationData {
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
  isUserRegistrationRequired?: boolean;
}

const SidebarOrgSection = ({
  orgId,
  hideDrawer,
  isProfilePage = false,
}: ISidebarOrgSectionProps): React.ReactElement | null => {
  const { t: tErrors } = useTranslation('errors');
  const { t: tCommon } = useTranslation('common');

  const { data, loading } = useQuery<{
    organization: IOrganizationData;
  }>(GET_ORGANIZATION_BASIC_DATA, {
    variables: { id: orgId },
  });

  // Don't render if drawer is hidden
  if (hideDrawer) {
    return null;
  }

  return (
    <div className={`${styles.organizationContainer} pe-3`}>
      {loading ? (
        <button
          className={`${styles.profileContainer} shimmer`}
          data-testid="orgBtn"
          type="button"
        />
      ) : !data?.organization ? (
        !isProfilePage && (
          <button
            type="button"
            className={`${styles.profileContainer} ${styles.bgDanger} text-start text-white`}
            disabled
            data-testid="sidebar-org-error"
          >
            <div className="px-3">
              <WarningAmberOutlined />
            </div>
            {tErrors('errorLoading', { entity: 'Organization' })}
          </button>
        )
      ) : (
        <button
          type="button"
          className={styles.profileContainer}
          data-testid="OrgBtn"
        >
          <div className={styles.imageContainer}>
            {data.organization.avatarURL ? (
              <img
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                src={data.organization.avatarURL}
                alt={`${data.organization.name}`}
              />
            ) : (
              <Avatar
                name={data.organization.name}
                containerStyle={styles.avatarContainer}
                alt={tCommon('picture', { name: data.organization.name })}
              />
            )}
          </div>
          <div className={styles.ProfileRightContainer}>
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
  );
};

export default SidebarOrgSection;
