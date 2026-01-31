import React, { useCallback, useMemo, useState } from 'react';
import { useModalState } from 'shared-components/CRUDModalTemplate/hooks/useModalState';
import { useTranslation } from 'react-i18next';
import Button from 'shared-components/Button/Button';
import { Navigate, useParams } from 'react-router';
import { Circle, WarningAmberRounded } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useQuery } from '@apollo/client';
import { ACTION_ITEM_LIST } from 'GraphQl/Queries/ActionItemQueries';
import type { IActionItemInfo } from 'types/shared-components/ActionItems/interface';
import styles from './Actions.module.css';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import {
  DataGridWrapper,
  type GridCellParams,
  type GridColDef,
} from 'shared-components/DataGridWrapper';
import ItemViewModal from 'shared-components/ActionItems/ActionItemViewModal/ActionItemViewModal';
import Avatar from 'shared-components/Avatar/Avatar';
import ItemUpdateStatusModal from 'shared-components/ActionItems/ActionItemUpdateModal/ActionItemUpdateStatusModal';
import useLocalStorage from 'utils/useLocalstorage';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import StatusBadge from 'shared-components/StatusBadge/StatusBadge';

/**
 * Component for displaying and managing action items assigned to the current volunteer.
 * Provides functionality to view action details and update completion status.
 *
 * @returns The Actions component.
 */
function Actions(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  const { orgId } = useParams();
  const { getItem } = useLocalStorage();
  const userId = getItem('userId');

  if (!orgId || !userId) {
    return <Navigate to="/" replace />;
  }

  const [actionItem, setActionItem] = useState<IActionItemInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'dueDate_ASC' | 'dueDate_DESC'>(
    'dueDate_DESC',
  );
  const [searchBy, setSearchBy] = useState<'assignee' | 'category'>('assignee');
  const {
    isOpen: isViewModalOpen,
    open: openViewModal,
    close: closeViewModal,
  } = useModalState();
  const {
    isOpen: isStatusModalOpen,
    open: openStatusModal,
    close: closeStatusModal,
  } = useModalState();

  const handleViewClick = useCallback(
    (item: IActionItemInfo): void => {
      setActionItem(item);
      openViewModal();
    },
    [openViewModal],
  );

  const handleStatusClick = useCallback(
    (item: IActionItemInfo): void => {
      setActionItem(item);
      openStatusModal();
    },
    [openStatusModal],
  );

  const { data, loading, error, refetch } = useQuery(ACTION_ITEM_LIST, {
    variables: { input: { organizationId: orgId } },
  });

  const actionItems = useMemo(() => {
    let items = (data?.actionItemsByOrganization ?? []).filter(
      (item: IActionItemInfo) => {
        const direct = item.volunteer?.user?.id === userId;
        const inGroup = item.volunteerGroup?.volunteers?.some(
          (v: Record<string, unknown>) =>
            (v as { user?: { id: string } }).user?.id === userId,
        );
        return direct || inGroup;
      },
    );

    if (searchTerm) {
      items = items.filter((item: IActionItemInfo) => {
        if (searchBy === 'assignee') {
          return (
            item.volunteer?.user?.name
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            item.volunteerGroup?.name
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase())
          );
        }
        return item.category?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
    }

    return [...items].sort((a, b) => {
      const aDate = new Date(a.assignedAt ?? a.createdAt).getTime();
      const bDate = new Date(b.assignedAt ?? b.createdAt).getTime();
      return sortBy === 'dueDate_ASC' ? aDate - bDate : bDate - aDate;
    });
  }, [data, userId, searchTerm, searchBy, sortBy]);

  if (error) {
    return (
      <div className={styles.message} data-testid="errorMsg">
        <WarningAmberRounded className={styles.icon} />
        <h6 className="fw-bold text-danger text-center">
          {tErrors('errorLoading', { entity: 'Action Items' })}
        </h6>
      </div>
    );
  }

  const columns: GridColDef[] = [
    {
      field: 'assignee',
      headerName: t('assignee'),
      flex: 1,
      renderCell: (params: GridCellParams) => {
        const user = params.row.volunteer?.user;
        const group = params.row.volunteerGroup;
        const name = user?.name ?? group?.name;

        return (
          <div
            className="d-flex fw-bold align-items-center"
            data-testid="assigneeName"
          >
            <Avatar
              name={name}
              alt={name}
              containerStyle={styles.imageContainer}
              avatarStyle={styles.tableImage}
            />
            <span className="ms-2">{name}</span>
          </div>
        );
      },
    },
    {
      field: 'itemCategory',
      headerName: t('itemCategory'),
      flex: 1,
      renderCell: (p) => (
        <div data-testid="categoryName">{p.row.category?.name}</div>
      ),
    },
    {
      field: 'status',
      headerName: t('status'),
      flex: 1,
      renderCell: (p) => (
        <StatusBadge
          icon={<Circle />}
          variant={p.row.isCompleted ? 'completed' : 'pending'}
          size="sm"
          dataTestId="statusChip"
        />
      ),
    },
    {
      field: 'assignedAt',
      headerName: t('assignedDate'),
      flex: 1,
      renderCell: (p) => (
        <div data-testid="assignedAt">
          {dayjs(p.row.assignedAt).format('DD/MM/YYYY')}
        </div>
      ),
    },
    {
      field: 'options',
      headerName: t('options'),
      flex: 1,
      renderCell: (p) => (
        <Button
          size="sm"
          data-testid="viewItemBtn"
          onClick={() => handleViewClick(p.row)}
          aria-label={tCommon('viewDetails')}
        >
          <i className="fa fa-info" />
        </Button>
      ),
    },
    {
      field: 'completed',
      headerName: t('completed'),
      flex: 1,
      renderCell: (p) => (
        <input
          type="checkbox"
          data-testid="statusCheckbox"
          checked={p.row.isCompleted}
          onChange={() => handleStatusClick(p.row)}
          aria-label={tCommon('markComplete')}
        />
      ),
    },
  ];

  return (
    <LoadingState isLoading={loading} variant="spinner">
      <div>
        <SearchFilterBar
          searchPlaceholder={tCommon('searchBy', {
            item: t('assigneeOrCategory'),
          })}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchInputTestId="searchByInput"
          searchButtonTestId="searchBtn"
          hasDropdowns
          dropdowns={[
            {
              id: 'searchBy',
              label: tCommon('searchBy', { item: '' }),
              type: 'filter',
              options: [
                { label: t('assignee'), value: 'assignee' },
                { label: t('category'), value: 'category' },
              ],
              selectedOption: searchBy,
              onOptionChange: (v) => setSearchBy(v as 'assignee' | 'category'),
              dataTestIdPrefix: 'searchBy',
            },
            {
              id: 'sort',
              label: tCommon('sort'),
              type: 'sort',
              options: [
                { label: t('latestAssigned'), value: 'dueDate_DESC' },
                { label: t('earliestAssigned'), value: 'dueDate_ASC' },
              ],
              selectedOption: sortBy,
              onOptionChange: (v) =>
                setSortBy(v as 'dueDate_ASC' | 'dueDate_DESC'),
              dataTestIdPrefix: 'sort',
            },
          ]}
        />

        <DataGridWrapper
          rows={actionItems}
          columns={columns}
          emptyStateProps={{
            message: t('noActionItems'),
          }}
          paginationConfig={{
            enabled: true,
            defaultPageSize: 25,
            pageSizeOptions: [10, 25, 50, 100],
          }}
        />

        {actionItem && (
          <>
            <ItemViewModal
              isOpen={isViewModalOpen}
              hide={closeViewModal}
              item={actionItem}
            />
            <ItemUpdateStatusModal
              actionItem={actionItem}
              isOpen={isStatusModalOpen}
              hide={closeStatusModal}
              actionItemsRefetch={refetch}
            />
          </>
        )}
      </div>
    </LoadingState>
  );
}

export default Actions;
