/**
 * OrganizationPeople Component
 *
 * This component renders a paginated and searchable table of organization members,
 * administrators, or users. It provides functionality for sorting, searching, and
 * managing members within an organization.
 *
 * @remarks
 * - Uses CursorPaginationManager for all modes (members, admins, users) with "Load More" pagination.
 * - Uses DataGridWrapper for client-side pagination and display.
 * - Supports filtering by roles (members, administrators, users).
 * - Includes local search functionality for filtering rows by name or email.
 * - Displays a modal for removing members.
 *
 * @example
 * ```tsx
 * <OrganizationPeople />
 * ```
 *
 * @returns A JSX element rendering the organization people table.
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useModalState } from 'shared-components/CRUDModalTemplate/hooks/useModalState';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams, Link } from 'react-router';
import {
  DataGridWrapper,
  GridCellParams,
  GridColDef,
} from 'shared-components/DataGridWrapper';
import { Delete } from '@mui/icons-material';
import { PAGE_SIZE } from 'types/ReportingTable/utils';

import styles from './OrganizationPeople.module.css';
import {
  ORGANIZATIONS_MEMBER_CONNECTION_LIST,
  USER_LIST_FOR_TABLE,
} from 'GraphQl/Queries/Queries';
import OrgPeopleListCard from 'components/AdminPortal/OrgPeopleListCard/OrgPeopleListCard';
import Avatar from 'shared-components/Avatar/Avatar';
import AddMember from './addMember/AddMember';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import { languages } from 'utils/languages';
import Button from 'shared-components/Button';
import { CursorPaginationManager } from 'components/CursorPaginationManager/CursorPaginationManager';
/**
 * Maps numeric filter state to string option identifiers.
 *
 * @remarks
 * Converts internal numeric state values to their corresponding string filter options:
 * - 0 = 'members': Regular organization members
 * - 1 = 'admin': Organization administrators
 * - 2 = 'users': All users
 *
 * This mapping must stay in sync with OPTION_TO_STATE. Any changes to one require updating the other.
 *
 * @example
 * ```ts
 * const option = STATE_TO_OPTION[0]; // 'members'
 * ```
 */
const STATE_TO_OPTION: Record<number, string> = {
  0: 'members',
  1: 'admin',
  2: 'users',
};

/**
 * Maps string option identifiers to numeric filter state.
 *
 * @remarks
 * Converts string filter options to their corresponding internal numeric state values:
 * - 'members' = 0: Regular organization members
 * - 'admin' = 1: Organization administrators
 * - 'users' = 2: All users
 *
 * This mapping must stay in sync with STATE_TO_OPTION. Any changes to one require updating the other.
 *
 * @example
 * ```ts
 * const state = OPTION_TO_STATE['admin']; // 1
 * ```
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

interface IMemberNode {
  id: string;
  name: string;
  role: string;
  avatarURL: string;
  emailAddress: string;
  createdAt: string;
}

function OrganizationPeople(): JSX.Element {
  const { t, i18n } = useTranslation('translation', {
    keyPrefix: 'organizationPeople',
  });
  const { t: tCommon } = useTranslation('common');
  const location = useLocation();
  const role = location?.state;
  const { orgId: currentUrl } = useParams();

  // State
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

  // Rows for all modes (will be populated by CursorPaginationManager)
  const [memberRows, setMemberRows] = useState<IProcessedRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const processMemberNodes = useCallback((nodes: IMemberNode[]) => {
    const rows = nodes.map((node, index) => ({
      id: node.id,
      name: node.name,
      email: node.emailAddress,
      image: node.avatarURL,
      createdAt: node.createdAt || '',
      rowNumber: index + 1,
    }));
    setMemberRows(rows);
    setIsLoading(false);
  }, []);

  // reset rows on filter or org change; CursorPaginationManager refetches via variables
  useEffect(() => {
    setMemberRows([]);
    setIsLoading(true);
  }, [state, currentUrl]);

  const currentRows = memberRows;

  // Local search implementation
  const filteredRows = useMemo(() => {
    if (!searchTerm) return currentRows;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return currentRows.filter(
      (row) =>
        row.name.toLowerCase().includes(lowerSearchTerm) ||
        row.email.toLowerCase().includes(lowerSearchTerm),
    );
  }, [currentRows, searchTerm]);

  // Build query variables for members/admins mode
  const memberQueryVariables = useMemo(() => {
    const vars: Record<string, unknown> = {
      orgId: currentUrl,
    };
    if (state === 1) {
      vars.where = { role: { equal: 'administrator' } };
    }
    return vars;
  }, [currentUrl, state]);

  const toggleRemoveMemberModal = (id: string) => {
    setSelectedMemId(id);
    openRemoveModal();
  };

  const handleSortChange = (value: string): void => {
    setState(OPTION_TO_STATE[value] ?? 0);
  };

  // Column definitions
  const columns: GridColDef[] = [
    {
      field: 'sl_no',
      headerName: tCommon('sl_no'),
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader} ${styles.colMinWidthXs}`,
      cellClassName: styles.colMinWidthXs,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return (
          <div className={`${styles.flexCenter} ${styles.fullWidthHeight}`}>
            {params.row.rowNumber}
          </div>
        );
      },
    },
    {
      field: 'profile',
      headerName: tCommon('profile'),
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader} ${styles.colMinWidthXs}`,
      cellClassName: styles.colMinWidthXs,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        const columnWidth = params.colDef.computedWidth || 150;
        const imageSize = Math.min(columnWidth * 0.4, 40);
        // Construct CSS value to avoid i18n linting errors
        const avatarSizeValue = String(imageSize) + 'px';
        return (
          <div
            className={`${styles.flexCenter} ${styles.flexColumn} ${styles.fullWidthHeight}`}
          >
            {params.row?.image ? (
              <img
                src={params.row.image}
                alt={tCommon('avatar')}
                className={styles.avatarImage}
                style={
                  { '--avatar-size': avatarSizeValue } as React.CSSProperties
                }
                crossOrigin="anonymous"
              />
            ) : (
              <div
                className={`${styles.flexCenter} ${styles.avatarPlaceholder} ${styles.avatarPlaceholderSize}`}
                style={
                  { '--avatar-size': avatarSizeValue } as React.CSSProperties
                }
                data-testid="avatar"
              >
                <Avatar name={params.row.name} />
              </div>
            )}
          </div>
        );
      },
    },
    {
      field: 'name',
      headerName: tCommon('name'),
      flex: 2,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader} ${styles.colMinWidthMd}`,
      cellClassName: styles.colMinWidthMd,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return (
          <Link
            to={`/admin/member/${currentUrl}/${params.row.id}`}
            state={{ id: params.row.id }}
            className={`${styles.membername} ${styles.subtleBlueGrey} ${styles.memberNameFontSize}`}
          >
            {params.row.name}
          </Link>
        );
      },
    },
    {
      field: 'email',
      headerName: tCommon('email'),
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader} ${styles.colMinWidthMd}`,
      cellClassName: styles.colMinWidthMd,
      flex: 2,
      sortable: false,
    },
    {
      field: 'joined',
      headerName: tCommon('joinedOn'),
      flex: 2,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader} ${styles.colMinWidthSm}`,
      cellClassName: styles.colMinWidthSm,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        const currentLang = languages.find(
          (lang: { code: string; country_code: string }) =>
            lang.code === i18n.language,
        );
        const locale = currentLang
          ? `${currentLang.code}-${currentLang.country_code}`
          : 'en-US';
        const joinedDate = params.row.createdAt
          ? new Intl.DateTimeFormat(locale, {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              timeZone: 'UTC',
            }).format(new Date(params.row.createdAt))
          : 'Unknown';
        return (
          <div data-testid={`org-people-joined-${params.row.id}`}>
            {t('joined')} : {joinedDate}
          </div>
        );
      },
    },
    {
      field: 'action',
      headerName: tCommon('action'),
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader} ${styles.colMinWidthSm}`,
      cellClassName: styles.colMinWidthSm,
      sortable: false,
      renderCell: (params: GridCellParams) => (
        <Button
          className={`${styles.removeButton}`}
          variant="danger"
          disabled={state === 2}
          onClick={() => toggleRemoveMemberModal(params.row.id)}
          aria-label={tCommon('removeMember')}
          data-testid="removeMemberModalBtn"
        >
          <Delete />
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className={styles.orgPeopleGrid}>
        <SearchFilterBar
          hasDropdowns={true}
          searchPlaceholder={t('searchFullName')}
          searchValue={searchTerm}
          onSearchChange={(value) => setSearchTerm(value)}
          searchInputTestId="searchbtn"
          searchButtonTestId="searchBtn"
          containerClassName={styles.calendar__header}
          dropdowns={[
            {
              id: 'organization-people-sort',
              label: tCommon('sort'),
              type: 'sort',
              options: [
                { label: tCommon('members'), value: 'members' },
                { label: tCommon('admin'), value: 'admin' },
                { label: tCommon('users'), value: 'users' },
              ],
              selectedOption: STATE_TO_OPTION[state] ?? 'members',
              onOptionChange: (value) => handleSortChange(value.toString()),
              dataTestIdPrefix: 'sort',
            },
          ]}
          additionalButtons={<AddMember />}
        />

        {/* CursorPaginationManager for all modes */}
        {state !== 2 ? (
          <CursorPaginationManager<
            unknown,
            IMemberNode,
            Record<string, unknown>
          >
            query={ORGANIZATIONS_MEMBER_CONNECTION_LIST}
            queryVariables={memberQueryVariables}
            dataPath="organization.members"
            itemsPerPage={PAGE_SIZE}
            onDataChange={processMemberNodes}
            onError={() => setIsLoading(false)}
            renderItem={() => null}
            loadingComponent={<></>}
            emptyStateComponent={<></>}
            className={styles.hidden}
          />
        ) : (
          <CursorPaginationManager<
            unknown,
            IMemberNode,
            Record<string, unknown>
          >
            query={USER_LIST_FOR_TABLE}
            queryVariables={{}}
            dataPath="allUsers"
            itemsPerPage={PAGE_SIZE}
            onDataChange={processMemberNodes}
            onError={() => setIsLoading(false)}
            renderItem={() => null}
            loadingComponent={<></>}
            emptyStateComponent={<></>}
            className={styles.hidden}
          />
        )}

        <DataGridWrapper<IProcessedRow>
          rows={filteredRows}
          columns={columns}
          loading={isLoading}
          emptyStateProps={{
            message: tCommon('notFound'),
            description: tCommon('noDataDescription'),
            dataTestId: 'organization-people-empty-state',
          }}
          paginationConfig={{
            enabled: true,
            defaultPageSize: PAGE_SIZE,
            pageSizeOptions: [10, 25, 50, 100],
          }}
        />

        {showRemoveModal && selectedMemId && (
          <OrgPeopleListCard
            id={selectedMemId}
            closeRemoveModal={closeRemoveModal}
          />
        )}
      </div>
    </>
  );
}

export default OrganizationPeople;
