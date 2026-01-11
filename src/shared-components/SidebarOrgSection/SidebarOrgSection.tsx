/**
 * SidebarOrgSection Component
 *
 * Displays organization information in the sidebar including avatar, name, and location.
 * Handles loading and error states appropriately.
 *
 * @param props - The props for the component
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
import { GET_ORGANIZATION_DATA_PG } from 'GraphQl/Queries/Queries';
import AngleRightIcon from 'assets/svgs/angleRight.svg?react';
import styles from '../../style/app-fixed.module.css';
import type { ISidebarOrgSectionProps } from '../../types/SidebarOrgSection/interface';
import { ProfileAvatarDisplay } from 'shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay';

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

const SidebarOrgSection = ({
  orgId,
  hideDrawer,
  isProfilePage = false,
}: ISidebarOrgSectionProps): React.ReactElement | null => {
  const { t: tErrors } = useTranslation('errors');

  const { data, loading } = useQuery<{
    organization: IOrganizationData;
  }>(GET_ORGANIZATION_DATA_PG, {
    variables: { id: orgId, first: 1, after: null },
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
            <ProfileAvatarDisplay
              imageUrl={data.organization.avatarURL}
              fallbackName={data.organization.name}
              size="medium"
              crossOrigin="anonymous"
            />
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
  );
};

export default SidebarOrgSection;
