/**
 * The `people` component is responsible for rendering a list of members and admins
 * of an organization. It provides functionality for searching, filtering, and paginating
 * through the list of users using cursor-based pagination via CursorPaginationManager.
 *
 * @returns The rendered People component.
 *
 * @remarks
 * This component:
 * - Uses CursorPaginationManager for cursor-based pagination with "Load More".
 * - Supports filtering between "All Members" and "Admins" via a dropdown menu.
 * - Provides a search bar to filter members by name/email (client-side).
 *
 * @param mode - The current filter mode (0 for "All Members", 1 for "Admins").
 * @param organizationId - The ID of the organization extracted from URL parameters.
 */
import React, { useMemo, useState } from 'react';
import { ORGANIZATIONS_MEMBER_CONNECTION_LIST } from 'GraphQl/Queries/Queries';
import styles from './People.module.css';
import { useTranslation } from 'react-i18next';

import { useParams } from 'react-router';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import Avatar from 'shared-components/Avatar/Avatar';
import { CursorPaginationManager } from 'components/CursorPaginationManager/CursorPaginationManager';
import type { InterfaceMemberNode } from 'types/PeopleTab/interface';

export default function People(): React.JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'people' });
  const { t: tCommon } = useTranslation('common');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [mode, setMode] = useState<number>(0); // 0: All Members, 1: Admins
  const { orgId: organizationId } = useParams();

  const modes = ['All Members', 'Admins'];

  const whereFilter = useMemo(() => {
    return mode === 1
      ? { role: { equal: 'administrator' as const } }
      : undefined;
  }, [mode]);

  const handleSearch = (newFilter: string): void => {
    setSearchTerm(newFilter);
  };

  return (
    <>
      <div>
        <div className="page-header">
          <div className="page-header-left">
            <h1 className="page-title">{t('title')}</h1>
            <p className="page-subtitle">{t('searchUsers')}</p>
          </div>
        </div>

        {/* Search toolbar */}
        <div className="toolbar">
          <div className="search-bar">
            <svg
              className="search-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder={t('searchUsers')}
              aria-label={t('searchUsers')}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              data-testid="searchInput"
            />
          </div>
        </div>

        {/* Member Grid */}
        <div className="grid-3">
          <CursorPaginationManager<
            unknown,
            InterfaceMemberNode,
            Record<string, unknown>
          >
            query={ORGANIZATIONS_MEMBER_CONNECTION_LIST}
            queryVariables={{
              orgId: organizationId,
              where: whereFilter,
            }}
            dataPath="organization.members"
            itemsPerPage={10}
            keyExtractor={(node: InterfaceMemberNode) => node.id}
            renderItem={(node: InterfaceMemberNode) => {
              if (searchTerm) {
                const lower = searchTerm.toLowerCase();
                const nameMatch = node.name?.toLowerCase().includes(lower);
                const emailMatch = node.emailAddress
                  ?.toLowerCase()
                  .includes(lower);
                if (!nameMatch && !emailMatch) return null;
              }

              const userType =
                node.role === 'administrator' ? 'Admin' : 'Member';

              return (
                <div
                  className={styles.memberCard}
                  data-testid={`people-row-${node.id}`}
                >
                  <div
                    className={styles.memberAvatar}
                    style={{ background: '#6366f1' }}
                  >
                    {node.avatarURL ? (
                      <img
                        src={node.avatarURL}
                        alt={node.name}
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <Avatar name={node.name} alt={node.name} size={56} />
                    )}
                  </div>
                  <div className={styles.memberName}>{node.name}</div>
                  <span
                    className={`badge ${userType === 'Admin' ? 'badge-green' : 'badge-gray'}`}
                  >
                    {userType}
                  </span>
                  <div className={styles.memberJoined}>
                    {node.emailAddress ?? t('emailNotAvailable')}
                  </div>
                  <a href="#" className={styles.memberLink}>
                    View Profile
                  </a>
                </div>
              );
            }}
            emptyStateComponent={
              <div className="empty-state">
                <div className="empty-state-title">{t('nothingToShow')}</div>
              </div>
            }
          />
        </div>
      </div>
    </>
  );
}
