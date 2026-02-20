import { useLazyQuery } from '@apollo/client';
import { Delete } from '@mui/icons-material';
import OrgPeopleListCard from 'components/AdminPortal/OrgPeopleListCard/OrgPeopleListCard';
import {
  ORGANIZATIONS_MEMBER_CONNECTION_LIST,
  USER_LIST_FOR_TABLE,
} from 'GraphQl/Queries/Queries';
import { PAGE_SIZE } from 'types/ReportingTable/utils';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'react-router';
import Button from 'shared-components/Button';
import { useModalState } from 'shared-components/CRUDModalTemplate/hooks/useModalState';
import DataTable from 'shared-components/DataTable/DataTable';
import { ProfileAvatarDisplay } from 'shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import type { IColumnDef } from 'types/shared-components/DataTable/interface';
import { errorHandler } from 'utils/errorHandler';
import { languages } from 'utils/languages';
import styles from './OrganizationPeople.module.css';
import AddMember from './addMember/AddMember';

/**
 * Maps numeric filter state to string option identifiers.
 */
const STATE_TO_OPTION: Record<number, string> = {
  0: 'members',
  1: 'admin',
  2: 'users',
};

/**
 * Maps string option identifiers to numeric filter state.
 */
const OPTION_TO_STATE: Record<string, number> = {
  members: 0,
  admin: 1,
  users: 2,
};

interface IProcessedRow {
  id: string;
  name: string;
  email: string;
  image: string;
  createdAt: string;
  rowNumber: number;
}

interface IEdges {
  cursor: string;
  node: {
    id: string;
    name: string;
    role: string;
    avatarURL: string;
    emailAddress: string;
    createdAt: string;
  };
}

function OrganizationPeople(): JSX.Element {
  const { t, i18n } = useTranslation('translation', {
    keyPrefix: 'organizationPeople',
  });
  const { t: tCommon } = useTranslation('common');
  const location = useLocation();
  const role = location?.state;
  const { orgId: currentUrl } = useParams();

  // Detect if we're in the User Portal (vs Admin Portal)
  const isUserPortal = location.pathname.startsWith('/user/');

  // Constants
  // Constants
  // Imported PAGE_SIZE is already available

  // State
  const [state, setState] = useState(() => {
    const r = role?.role;
    // Standard role validation
    const validRole = r === 0 || r === 1 || r === 2 ? r : 0;
    // Guard: If in User Portal, we shouldn't allow 'users' (2) tab
    return isUserPortal && validRole === 2 ? 0 : validRole;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setPage(1);
    cursors.current = { 1: null };
  }, []);

  // Pagination State
  const [page, setPage] = useState(1);
  const cursors = useRef<Record<number, string | null>>({ 1: null });

  const {
    isOpen: showRemoveModal,
    open: openRemoveModal,
    close: closeRemoveModal,
  } = useModalState();
  const [selectedMemId, setSelectedMemId] = useState<string>();

  const [currentRows, setCurrentRows] = useState<IProcessedRow[]>([]);
  const [data, setData] = useState<
    | {
        edges: IEdges[];
        pageInfo: {
          startCursor?: string;
          endCursor?: string;
          hasNextPage: boolean;
          hasPreviousPage: boolean;
        };
      }
    | undefined
  >();

  // Query hooks
  const [fetchMembers, { loading: memberLoading, error: memberError }] =
    useLazyQuery(ORGANIZATIONS_MEMBER_CONNECTION_LIST, {
      onCompleted: (data) => {
        const membersData = data?.organization?.members;
        setData(membersData);
        // Update next page cursor
        if (membersData?.pageInfo?.hasNextPage) {
          cursors.current[page + 1] = membersData.pageInfo.endCursor;
        }
      },
    });

  const [fetchUsers, { loading: userLoading, error: userError }] = useLazyQuery(
    USER_LIST_FOR_TABLE,
    {
      onCompleted: (data) => {
        const usersData = data?.allUsers;
        setData(usersData);
        // Update next page cursor
        if (usersData?.pageInfo?.hasNextPage) {
          cursors.current[page + 1] = usersData.pageInfo.endCursor;
        }
      },
    },
  );

  // Handle data changes
  useEffect(() => {
    if (data) {
      const { edges } = data;
      const processedRows = edges.map(
        (edge: IEdges, index: number): IProcessedRow => ({
          id: edge.node.id,
          name: edge.node.name,
          email: edge.node.emailAddress,
          image: edge.node.avatarURL,
          // Use a fixed date fallback to prevent hydration mismatches and flickering
          createdAt: edge.node.createdAt || '1970-01-01T00:00:00.000Z',
          rowNumber: (page - 1) * PAGE_SIZE + index + 1,
        }),
      );

      setCurrentRows(processedRows);
    }
  }, [data, page]);

  // Fetch Data Effect
  useEffect(() => {
    // Reset pagination when tab or search changes, then fetch new data
    // This combined effect prevents double-fetching (once for reset, once for fetch)

    // Helper to perform fetch based on current state variables
    const performFetch = (
      currentPage: number,
      currentCursor: string | null,
    ) => {
      const baseVariables = {
        first: PAGE_SIZE,
        after: currentCursor,
        last: null,
        before: null,
      };

      if (state === 0) {
        // All members
        const variables = {
          ...baseVariables,
          orgId: currentUrl,
          where: searchTerm ? { name: searchTerm } : undefined,
        };
        fetchMembers({ variables });
      } else if (state === 1) {
        // Administrators only
        const variables = {
          ...baseVariables,
          orgId: currentUrl,
          where: {
            role: { equal: 'administrator' },
            name: searchTerm || undefined,
          },
        };
        fetchMembers({ variables });
      } else if (state === 2) {
        // Users
        const variables = {
          ...baseVariables,
          where: searchTerm ? { name: { contains: searchTerm } } : undefined,
        };
        fetchUsers({ variables });
      }
    };

    performFetch(page, cursors.current[page]);
  }, [state, currentUrl, fetchMembers, fetchUsers, page, searchTerm]);

  // Calculate totalItems for infinite pagination pattern
  // If we have a next page, let's pretend total is current page * size + size (forcing at least 1 more page).
  // If not, total is current page * size (end of list).
  // Actually, to show correct "1-10 of X", passing undefined totalItems might break standard DataTable pagination.
  // But standard DataTable implementation logic (seen in Pagination.tsx) disables 'Next' if page >= totalPages.
  // totalPages = ceil(totalItems / pageSize).
  // If we want Next enabled, we need totalItems > page * pageSize.
  // So:
  const hasNext = data?.pageInfo?.hasNextPage;
  const totalItems = hasNext
    ? (page + 1) * PAGE_SIZE
    : (page - 1) * PAGE_SIZE + (currentRows.length || 0);

  // Error handling
  useEffect(() => {
    if (memberError) {
      errorHandler(t, memberError);
    }
    if (userError) {
      errorHandler(t, userError);
    }
  }, [memberError, userError, t]);

  // Modal handlers
  const toggleRemoveMemberModal = (id: string) => {
    setSelectedMemId(id);
    openRemoveModal();
  };

  const handleSortChange = (value: string): void => {
    setState(OPTION_TO_STATE[value] ?? 0);
    setPage(1);
    cursors.current = { 1: null };
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Column definitions for DataTable
  const allColumns: IColumnDef<IProcessedRow>[] = [
    {
      id: 'sl_no',
      header: tCommon('sl_no'),
      accessor: 'rowNumber',
      meta: {
        sortable: false,
        align: 'left',
      },
      render: (request: unknown, row: IProcessedRow) => (
        <div className={`${styles.flexLeft} ${styles.fullWidthHeight}`}>
          {row.rowNumber}
        </div>
      ),
    },
    {
      id: 'profile',
      header: tCommon('profile'),
      accessor: 'image',
      meta: {
        sortable: false,
        align: 'center',
      },
      render: (request: unknown, row: IProcessedRow) => (
        <div
          className={`${styles.flexCenter} ${styles.flexColumn} ${styles.fullWidthHeight}`}
        >
          <ProfileAvatarDisplay
            imageUrl={row.image}
            fallbackName={row.name}
            size="small"
            dataTestId={`org-people-avatar-${row.id}`} // i18n-ignore-line
          />
        </div>
      ),
    },
    {
      id: 'name',
      header: tCommon('name'),
      accessor: 'name',
      meta: {
        sortable: true,
        searchable: true,
        align: 'center',
      },
      render: (request: unknown, row: IProcessedRow) => (
        <Link
          to={`${isUserPortal ? '/user' : '/admin'}/member/${currentUrl}/${row.id}`}
          state={{ id: row.id }}
          className={`${styles.membername} ${styles.subtleBlueGrey} ${styles.memberNameFontSize}`}
        >
          {row.name}
        </Link>
      ),
    },
    {
      id: 'email',
      header: tCommon('email'),
      accessor: 'email',
      meta: {
        sortable: true,
        searchable: true,
        align: 'center',
      },
    },
    {
      id: 'joined',
      header: tCommon('joinedOn'),
      accessor: 'createdAt',
      meta: {
        sortable: true,
        align: 'left',
      },
      render: (value: unknown, row: IProcessedRow) => {
        const currentLang = languages.find(
          (lang: { code: string; country_code: string }) =>
            lang.code === i18n.language,
        );
        const locale = currentLang
          ? `${currentLang.code}-${currentLang.country_code}`
          : 'en-US';
        return (
          <div data-testid={`org-people-joined-${row.id}`}>
            {t('joined')} :{' '}
            {new Intl.DateTimeFormat(locale, {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              timeZone: 'UTC',
            }).format(new Date(row.createdAt))}
          </div>
        );
      },
    },
    {
      id: 'action',
      header: tCommon('action'),
      accessor: 'id',
      meta: {
        sortable: false,
        align: 'left',
      },
      render: (value: unknown, row: IProcessedRow) => (
        <Button
          className={`${styles.removeButton}`}
          variant="danger"
          disabled={state === 2}
          onClick={() => toggleRemoveMemberModal(row.id)}
          aria-label={tCommon('removeMember')}
          data-testid="removeMemberModalBtn"
        >
          <Delete />
        </Button>
      ),
    },
  ];

  // Remove 'action' column for User Portal
  const columns = isUserPortal
    ? allColumns.filter((col) => col.id !== 'action')
    : allColumns;

  // Filter options — hide 'users' tab for User Portal
  const sortOptions = isUserPortal
    ? [
        { label: tCommon('members'), value: 'members' },
        { label: tCommon('admin'), value: 'admin' },
      ]
    : [
        { label: tCommon('members'), value: 'members' },
        { label: tCommon('admin'), value: 'admin' },
        { label: tCommon('users'), value: 'users' },
      ];

  return (
    <>
      <div className={styles.orgPeopleGrid}>
        <SearchFilterBar
          hasDropdowns={true}
          searchPlaceholder={t('searchFullName')}
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
          searchInputTestId="member-search-input"
          searchButtonTestId="searchBtn"
          containerClassName={styles.calendar__header}
          dropdowns={[
            {
              id: 'organization-people-sort',
              label: tCommon('sort'),
              type: 'sort',
              options: sortOptions,
              selectedOption: STATE_TO_OPTION[state] ?? 'members',
              onOptionChange: (value) => handleSortChange(value.toString()),
              dataTestIdPrefix: 'sort',
              containerClassName: styles.membersSortContainer,
              toggleClassName: styles.membersSortToggle,
            },
          ]}
          additionalButtons={
            !isUserPortal ? (
              <AddMember
                rootClassName={styles.membersAddHeader}
                containerClassName={styles.membersAddContainer}
                toggleClassName={styles.membersAddToggle}
              />
            ) : undefined
          }
        />

        <DataTable
          data={currentRows}
          columns={columns}
          loading={memberLoading || userLoading}
          error={state === 2 ? userError : memberError}
          emptyMessage={tCommon('notFound')}
          rowKey="id"
          paginationMode="server"
          showSearch={false} // Handled by SearchFilterBar
          serverSearch={true} // We are handling search on server side via fetch variables
          globalSearch={searchTerm} // Just for display if needed
          pageSize={PAGE_SIZE}
          totalItems={totalItems}
          currentPage={page}
          onPageChange={handlePageChange}
          pageInfo={data?.pageInfo}
        />
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
