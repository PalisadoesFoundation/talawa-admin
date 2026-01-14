import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form } from 'react-bootstrap';
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
import { Chip } from '@mui/material';
import ItemViewModal from 'screens/OrganizationActionItems/ActionItemViewModal/ActionItemViewModal';
import Avatar from 'shared-components/Avatar/Avatar';
import ItemUpdateStatusModal from 'screens/OrganizationActionItems/ActionItemUpdateModal/ActionItemUpdateStatusModal';
import useLocalStorage from 'utils/useLocalstorage';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';

enum ModalState {
  VIEW = 'view',
  STATUS = 'status',
}

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
  const [modalState, setModalState] = useState<Record<ModalState, boolean>>({
    [ModalState.VIEW]: false,
    [ModalState.STATUS]: false,
  });

  const openModal = (modal: ModalState): void => {
    setModalState((p) => ({ ...p, [modal]: true }));
  };

  const closeModal = (modal: ModalState): void => {
    setModalState((p) => ({ ...p, [modal]: false }));
  };

  const handleModalClick = useCallback(
    (item: IActionItemInfo, modal: ModalState): void => {
      setActionItem(item);
      openModal(modal);
    },
    [],
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
      headerName: 'Assignee',
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
              avatarStyle={styles.TableImage}
            />
            <span className="ms-2">{name}</span>
          </div>
        );
      },
    },
    {
      field: 'itemCategory',
      headerName: 'Item Category',
      flex: 1,
      renderCell: (p) => (
        <div data-testid="categoryName">{p.row.category?.name}</div>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (p) => (
        <Chip
          icon={<Circle />}
          label={p.row.isCompleted ? 'Completed' : 'Pending'}
        />
      ),
    },
    {
      field: 'assignedAt',
      headerName: 'Assigned Date',
      flex: 1,
      renderCell: (p) => (
        <div data-testid="assignedAt">
          {dayjs(p.row.assignedAt).format('DD/MM/YYYY')}
        </div>
      ),
    },
    {
      field: 'options',
      headerName: 'Options',
      flex: 1,
      renderCell: (p) => (
        <Button
          size="sm"
          data-testid="viewItemBtn"
          onClick={() => handleModalClick(p.row, ModalState.VIEW)}
        >
          <i className="fa fa-info" />
        </Button>
      ),
    },
    {
      field: 'completed',
      headerName: 'Completed',
      flex: 1,
      renderCell: (p) => (
        <Form.Check
          data-testid="statusCheckbox"
          checked={p.row.isCompleted}
          onChange={() => handleModalClick(p.row, ModalState.STATUS)}
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
              isOpen={modalState.view}
              hide={() => closeModal(ModalState.VIEW)}
              item={actionItem}
            />
            <ItemUpdateStatusModal
              actionItem={actionItem}
              isOpen={modalState.status}
              hide={() => closeModal(ModalState.STATUS)}
              actionItemsRefetch={refetch}
            />
          </>
        )}
      </div>
    </LoadingState>
  );
}

export default Actions;
