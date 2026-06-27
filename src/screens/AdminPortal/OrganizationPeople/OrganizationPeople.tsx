/**
 * OrganizationPeople Component
 *
 * Renders a paginated and searchable table of organization members,
 * administrators, or users matching the Talawa design prototype.
 *
 * @remarks
 * - Uses useQuery with cursor-based pagination (no CursorPaginationManager component).
 * - Supports filtering by roles (members, administrators, users) via a dropdown.
 * - Includes client-side search filtering by name or email.
 * - Displays a modal for removing members.
 *
 * @returns A JSX element rendering the organization people table.
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useModalState } from 'shared-components/CRUDModalTemplate/hooks/useModalState';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams, Link } from 'react-router';

import styles from './OrganizationPeople.module.css';
import {
  ORGANIZATIONS_MEMBER_CONNECTION_LIST,
  USER_LIST_FOR_TABLE,
} from 'GraphQl/Queries/Queries';
import OrgPeopleListCard from 'components/AdminPortal/OrgPeopleListCard/OrgPeopleListCard';
import AddMember from './addMember/AddMember';
import { languages } from 'utils/languages';
import type { InterfaceMemberNode } from 'types/PeopleTab/interface';
import type { DefaultConnectionPageInfo } from 'types/AdminPortal/pagination';
import SafeBreadcrumbs from 'shared-components/BreadcrumbsComponent/SafeBreadcrumbs';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import useLocalStorage from 'utils/useLocalstorage';

const STATE_TO_OPTION: Record<number, string> = {
  0: 'members',
  1: 'admin',
  2: 'users',
};

const OPTION_TO_STATE: Record<string, number> = {
  members: 0,
  admin: 1,
  users: 2,
};

const ITEMS_PER_PAGE = 10;

/**
 * Extracts connection data from a nested GraphQL response using a dot-separated path.
 */
function extractConnectionData<TNode>(
  data: unknown,
  path: string,
): {
  edges: Array<{ cursor: string; node: TNode }>;
  pageInfo?: DefaultConnectionPageInfo;
} | null {
  if (!data || typeof data !== 'object') return null;
  const segments = path.split('.');
  let current: unknown = data;
  for (const segment of segments) {
    if (!current || typeof current !== 'object') return null;
    current = (current as Record<string, unknown>)[segment];
  }
  if (
    current &&
    typeof current === 'object' &&
    'edges' in current &&
    Array.isArray((current as Record<string, unknown>).edges)
  ) {
    return current as {
      edges: Array<{ cursor: string; node: TNode }>;
      pageInfo?: DefaultConnectionPageInfo;
    };
  }
  return null;
}

/**
 * Returns initials from a name string (up to 2 characters).
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
  }
  return (name[0] ?? '').toUpperCase();
}

/**
 * Deterministic avatar color based on name string.
 */
function getAvatarColor(name: string): {
  background: string;
  color: string;
} {
  const palette = [
    { background: 'var(--green-50)', color: 'var(--green-700)' },
    { background: 'var(--blue-50)', color: 'var(--blue-600)' },
    { background: 'var(--orange-50)', color: 'var(--orange-500)' },
    { background: 'var(--purple-50)', color: 'var(--purple-500)' },
    { background: 'var(--red-50)', color: 'var(--red-600)' },
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length]!;
}

function OrganizationPeople(): JSX.Element {
  const { t, i18n } = useTranslation('translation', {
    keyPrefix: 'organizationPeople',
  });
  const { getItem } = useLocalStorage();
  const { t: tCommon } = useTranslation('common');
  const location = useLocation();
  const role = location?.state||getItem('role'); // Get role from location state or localStorage
  const { orgId: currentUrl } = useParams();

  const [state, setState] = useState(() => {
    const r = role?.role;
    return r === 0 || r === 1 || r === 2 ? r : 0;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const {
    isOpen: showRemoveModal,
    open: openRemoveModal,
    close: closeRemoveModal,
  } = useModalState();
  const [selectedMemId, setSelectedMemId] = useState<string>();

  // Pagination state
  const [items, setItems] = useState<InterfaceMemberNode[]>([]);
  const [pageInfo, setPageInfo] = useState<DefaultConnectionPageInfo | null>(
    null,
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const whereFilter = useMemo(() => {
    return state === 1
      ? { role: { equal: 'administrator' as const } }
      : undefined;
  }, [state]);

  const toggleRemoveMemberModal = (id: string): void => {
    setSelectedMemId(id);
    openRemoveModal();
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = e.target.value;
    setState(OPTION_TO_STATE[value] ?? 0);
  };

  const locale = useMemo(() => {
    const currentLang = languages.find(
      (lang: { code: string; country_code: string }) =>
        lang.code === i18n.language,
    );
    return currentLang
      ? `${currentLang.code}-${currentLang.country_code}`
      : 'en-US';
  }, [i18n.language]);

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        timeZone: 'UTC',
      }),
    [locale],
  );

  // Query for members/admins
  const query =
    state !== 2 ? ORGANIZATIONS_MEMBER_CONNECTION_LIST : USER_LIST_FOR_TABLE;
  const dataPath = state !== 2 ? 'organization.members' : 'allUsers';
  const queryVariables =
    state !== 2
      ? {
          orgId: currentUrl,
          where: whereFilter,
          first: ITEMS_PER_PAGE,
          after: null,
        }
      : { first: ITEMS_PER_PAGE, after: null };

  const { data, loading, error, fetchMore } = useQuery(query, {
    variables: queryVariables,
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all',
  });

  // Sync data from query results
  useEffect(() => {
    if (!data) return;
    const connectionData = extractConnectionData<InterfaceMemberNode>(
      data,
      dataPath,
    );
    if (connectionData) {
      const nodes = connectionData.edges.map((edge) => edge.node);
      setItems(nodes);
      setPageInfo(connectionData.pageInfo || null);
    }
  }, [data, dataPath]);

  // Reset when state (role filter) changes
  useEffect(() => {
    setItems([]);
    setPageInfo(null);
  }, [state]);

  // Load more handler
  const handleLoadMore = useCallback(async () => {
    if (!pageInfo?.hasNextPage || isLoadingMore || loading) return;

    setIsLoadingMore(true);
    try {
      const vars: Record<string, unknown> =
        state !== 2
          ? {
              orgId: currentUrl,
              where: whereFilter,
              first: ITEMS_PER_PAGE,
              after: pageInfo.endCursor,
            }
          : { first: ITEMS_PER_PAGE, after: pageInfo.endCursor };

      const result = await fetchMore({
        variables: vars,
      });
      const connectionData = extractConnectionData<InterfaceMemberNode>(
        result.data,
        dataPath,
      );
      if (connectionData) {
        const newNodes = connectionData.edges.map((edge) => edge.node);
        setItems((prev) => [...prev, ...newNodes]);
        setPageInfo(connectionData.pageInfo || null);
      }
    } catch (err) {
      console.error('Error loading more items:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    pageInfo,
    isLoadingMore,
    loading,
    fetchMore,
    currentUrl,
    whereFilter,
    state,
    dataPath,
  ]);

  // Filter items by search
  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    const lower = searchTerm.toLowerCase();
    return items.filter((node) => {
      const nameMatch = node.name?.toLowerCase().includes(lower);
      const emailMatch = node.emailAddress?.toLowerCase().includes(lower);
      return nameMatch || emailMatch;
    });
  }, [items, searchTerm]);

  /**
   * Determine role badge class based on role string.
   */
  const getRoleBadgeClass = (memberRole: string): string => {
    if (memberRole === 'administrator') return 'badge badge-purple';
    if (memberRole === 'moderator') return 'badge badge-blue';
    return 'badge badge-green';
  };

  const getRoleLabel = (memberRole: string): string => {
    if (memberRole === 'administrator') return tCommon('admin');
    if (memberRole === 'moderator') return 'Moderator';
    return tCommon('members');
  };

  return (
    <>
      <SafeBreadcrumbs
        items={[
          {
            translationKey: 'organization',
            to: `/admin/orgdash/${currentUrl}`,
          },
          {
            translationKey: 'people',
            isCurrent: true,
          },
        ]}
      />

      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">
            {t('title')}{' '}
            <span className="count-badge" data-testid="member-count-badge">
              {filteredItems.length}
            </span>
          </h1>
          <p className="page-subtitle">{t('searchFullName')}</p>
        </div>
        <div className="page-header-actions">
          <AddMember
            rootClassName={styles.membersAddHeader}
            containerClassName={styles.membersAddContainer}
            toggleClassName={styles.membersAddToggle}
          />
        </div>
      </div>

      <div className="toolbar">
        <div className="search-bar">
          <svg
            className="search-icon"
            aria-hidden="true"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder={t('searchFullName')}
            aria-label={t('searchFullName')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="member-search-input"
          />
        </div>
        <select
          className="form-input"
          aria-label={tCommon('sort')}
          value={STATE_TO_OPTION[state] ?? 'members'}
          onChange={handleSortChange}
          data-testid="sort-select"
          style={{ width: 'auto', minWidth: '140px' }}
        >
          <option value="members">{tCommon('members')}</option>
          <option value="admin">{tCommon('admin')}</option>
          <option value="users">{tCommon('users')}</option>
        </select>
      </div>

      <div className="card">
        <div className="table-wrapper">
          {loading && !items.length ? (
            <LoadingState
              isLoading={true}
              variant="inline"
              size="lg"
              data-testid="cursor-pagination-loading"
            >
              <div />
            </LoadingState>
          ) : error && !items.length ? (
            <div
              role="alert"
              aria-live="assertive"
              data-testid="cursor-pagination-error"
              className={styles.errorState}
            >
              <p>{error.message}</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="empty-state">
              <div
                className="empty-state-title"
                data-testid="organization-people-empty-state"
              >
                {t('notFound')}
              </div>
            </div>
          ) : (
            <>
              <table className="data-table" aria-label={t('title')}>
                <thead>
                  <tr>
                    <th scope="col">{tCommon('name')}</th>
                    <th scope="col">Role</th>
                    <th scope="col">{tCommon('joinedOn')}</th>
                    <th scope="col">Status</th>
                    <th scope="col" style={{ width: '60px' }}>
                      {tCommon('action')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((node) => {
                    const formattedDate = node.createdAt
                      ? dateFormatter.format(new Date(node.createdAt))
                      : '-';
                    const avatarColors = getAvatarColor(node.name);

                    return (
                      <tr
                        key={node.id}
                        data-testid={`org-people-row-${node.id}`}
                      >
                        <td>
                          <div className={styles.memberCell}>
                            {node.avatarURL ? (
                              <img
                                src={node.avatarURL}
                                alt={node.name}
                                className={styles.memberAvatar}
                                crossOrigin="anonymous"
                                style={{
                                  background: avatarColors.background,
                                }}
                              />
                            ) : (
                              <div
                                className={styles.memberAvatar}
                                style={{
                                  background: avatarColors.background,
                                  color: avatarColors.color,
                                }}
                              >
                                {getInitials(node.name)}
                              </div>
                            )}
                            <div>
                              <div className={styles.memberName}>
                                <Link
                                  to={`/admin/member/${currentUrl}/${node.id}`}
                                  state={{ id: node.id }}
                                  className={styles.membername}
                                >
                                  {node.name}
                                </Link>
                              </div>
                              <div className={styles.memberEmail}>
                                {node.emailAddress ?? t('emailNotAvailable')}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={getRoleBadgeClass(node.role ?? '')}>
                            {getRoleLabel(node.role ?? '')}
                          </span>
                        </td>
                        <td data-testid={`org-people-joined-${node.id}`}>
                          {formattedDate}
                        </td>
                        <td>
                          <div className={styles.statusCell}>
                            <span
                              className="status-dot green"
                              aria-hidden="true"
                            />
                            Active
                          </div>
                        </td>
                        <td>
                          <button
                            className={styles.actionsBtn}
                            aria-label={tCommon('removeMember')}
                            onClick={() => toggleRemoveMemberModal(node.id)}
                            data-testid="removeMemberModalBtn"
                            disabled={role !== 'administrator'}
                          >
                            &#8943;
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className={styles.paginationWrapper}>
                <span className="pagination-info">
                  Showing {filteredItems.length} of {items.length}{' '}
                  {tCommon('members').toLowerCase()}
                </span>
                <div className="pagination">
                  {pageInfo?.hasNextPage && (
                    <button
                      className="pagination-btn"
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      data-testid="load-more-button"
                    >
                      {isLoadingMore ? tCommon('loading') : tCommon('loadMore')}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {showRemoveModal && selectedMemId && (
        <OrgPeopleListCard
          id={selectedMemId}
          toggleRemoveModal={closeRemoveModal}
        />
      )}
    </>
  );
}

export default OrganizationPeople;
