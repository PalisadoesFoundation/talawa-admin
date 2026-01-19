/**
 * @file Actions.tsx
 * @description This component renders a table of action items assigned to a user within an organization.
 * It provides functionalities for searching, sorting, and updating the status of action items.
 * The component also includes modals for viewing and updating action item details.
 *
 * @module Actions
 *
 *
 * @component
 * @returns {JSX.Element} A React component that displays a searchable and sortable table of action items.
 *
 * @example
 * // Usage
 * import Actions from './Actions';
 *
 * function App() {
 *   return <Actions />;
 * }
 *
 * @remarks
 * - The component fetches action items using GraphQL queries.
 * - It uses Material-UI's DataGrid for displaying the table.
 * - Modals are used for viewing and updating action item details.
 * - Includes search and sorting functionalities for better user experience.
 *
 * @todo
 * - Add pagination support for the DataGrid.
 * - Improve error handling and user feedback mechanisms.
 */
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form } from 'react-bootstrap';
import { Navigate, useParams } from 'react-router';

import { Circle, WarningAmberRounded } from '@mui/icons-material';
import dayjs from 'dayjs';

import { useQuery } from '@apollo/client';
import { ACTION_ITEM_LIST } from 'GraphQl/Queries/ActionItemQueries';

import type { IActionItemInfo } from 'types/ActionItems/interface';
import styles from 'style/app-fixed.module.css';
import Loader from 'components/Loader/Loader';
import {
  DataGrid,
  type GridCellParams,
  type GridColDef,
} from '@mui/x-data-grid';
import { Chip, Stack } from '@mui/material';
import { debounce } from 'utils/performance';
import ItemViewModal from 'screens/OrganizationActionItems/ActionItemViewModal/ActionItemViewModal';
import Avatar from 'components/Avatar/Avatar';
import ItemUpdateStatusModal from 'screens/OrganizationActionItems/ActionItemUpdateModal/ActionItemUpdateStatusModal';
import useLocalStorage from 'utils/useLocalstorage';
import SortingButton from 'subComponents/SortingButton';
import SearchBar from 'shared-components/SearchBar/SearchBar';

enum ModalState {
  VIEW = 'view',
  STATUS = 'status',
}

const dataGridStyle = {
  '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
    outline: 'none !important',
  },
  '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within': {
    outline: 'none',
  },
  '& .MuiDataGrid-row:hover': { backgroundColor: 'transparent' },
  '& .MuiDataGrid-row.Mui-hovered': { backgroundColor: 'transparent' },
  '& .MuiDataGrid-root': { borderRadius: '0.5rem' },
  '& .MuiDataGrid-main': { borderRadius: '0.5rem' },
};

function actions(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  // Get the organization ID from URL parameters
  const { orgId } = useParams();
  const { getItem } = useLocalStorage();
  const userId = getItem('userId');

  if (!orgId || !userId) {
    return <Navigate to={'/'} replace />;
  }

  const [actionItem, setActionItem] = useState<IActionItemInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'dueDate_ASC' | 'dueDate_DESC' | null>(
    null,
  );
  const [searchBy, setSearchBy] = useState<'assignee' | 'category'>('assignee');
  const [modalState, setModalState] = useState<{
    [key in ModalState]: boolean;
  }>({ [ModalState.VIEW]: false, [ModalState.STATUS]: false });

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setSearchTerm(value), 300),
    [],
  );

  const openModal = (modal: ModalState): void =>
    setModalState((prevState) => ({ ...prevState, [modal]: true }));

  const closeModal = (modal: ModalState): void =>
    setModalState((prevState) => ({ ...prevState, [modal]: false }));

  const handleModalClick = useCallback(
    (actionItem: IActionItemInfo | null, modal: ModalState): void => {
      setActionItem(actionItem);
      openModal(modal);
    },
    [openModal],
  );

  /**
   * Query to fetch all action items for the organization, then filter for user involvement.
   */
  const {
    data: actionItemsData,
    loading: actionItemsLoading,
    error: actionItemsError,
    refetch: actionItemsRefetch,
  }: {
    data?: { actionItemsByOrganization: IActionItemInfo[] };
    loading: boolean;
    error?: Error | undefined;
    refetch: () => void;
  } = useQuery(ACTION_ITEM_LIST, {
    variables: {
      input: {
        organizationId: orgId,
      },
    },
  });

  const actionItems = useMemo(() => {
    const allActionItems = actionItemsData?.actionItemsByOrganization || [];

    // Filter action items where the current user is involved as a volunteer or part of a volunteer group
    let userActionItems = allActionItems.filter((item) => {
      // Check if user is the assigned volunteer
      const isAssignedVolunteer = item.volunteer?.user?.id === userId;

      // Check if user is part of the assigned volunteer group
      const isInVolunteerGroup = item.volunteerGroup?.volunteers?.some(
        (volunteer: { id: string; user: { id: string; name: string } }) =>
          volunteer.user?.id === userId,
      );

      return isAssignedVolunteer || isInVolunteerGroup;
    });

    // Apply search filtering if search term exists
    if (searchTerm) {
      userActionItems = userActionItems.filter((item) => {
        if (searchBy === 'assignee') {
          // Search in volunteer name or volunteer group name
          const volunteerName = item.volunteer?.user?.name?.toLowerCase() || '';
          const volunteerGroupName =
            item.volunteerGroup?.name?.toLowerCase() || '';
          return (
            volunteerName.includes(searchTerm.toLowerCase()) ||
            volunteerGroupName.includes(searchTerm.toLowerCase())
          );
        } else if (searchBy === 'category') {
          // Search in category name
          const categoryName = item.category?.name?.toLowerCase() || '';
          return categoryName.includes(searchTerm.toLowerCase());
        }
        return true;
      });
    }

    // Apply sorting if specified
    if (sortBy) {
      return userActionItems.sort((a, b) => {
        const dateA = new Date(a.assignedAt || a.createdAt);
        const dateB = new Date(b.assignedAt || b.createdAt);

        if (sortBy === 'dueDate_ASC') {
          return dateA.getTime() - dateB.getTime();
        } else {
          return dateB.getTime() - dateA.getTime();
        }
      });
    }

    return userActionItems;
  }, [actionItemsData, userId, sortBy, searchTerm, searchBy]);
  if (actionItemsLoading) {
    return <Loader size="xl" />;
  }

  if (actionItemsError) {
    return (
      <div className={styles.message} data-testid="errorMsg">
        <WarningAmberRounded className={styles.icon} fontSize="large" />
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
      align: 'left',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        const { id, name, avatarURL } = params.row.volunteer?.user || {};

        return (
          <>
            {params.row.volunteer ? (
              <>
                <div
                  className="d-flex fw-bold align-items-center justify-content-start ms-2"
                  data-testid="assigneeName"
                  style={{ height: '100%' }}
                >
                  {avatarURL ? (
                    <img
                      src={avatarURL}
                      alt="Assignee"
                      data-testid={`image${id + 1}`}
                      className={`${styles.TableImage} me-2`}
                      style={{ verticalAlign: 'middle' }}
                    />
                  ) : (
                    <div
                      className={`${styles.avatarContainer} me-2 d-flex align-items-center justify-content-center`}
                    >
                      <Avatar
                        key={id + '1'}
                        containerStyle={styles.imageContainer}
                        avatarStyle={styles.TableImage}
                        name={name}
                        alt={name}
                      />
                    </div>
                  )}
                  <span className="d-flex align-items-center">{name}</span>
                </div>
              </>
            ) : (
              <>
                <div
                  className="d-flex fw-bold align-items-center justify-content-start ms-2"
                  data-testid="assigneeName"
                  style={{ height: '100%' }}
                >
                  <div
                    className={`${styles.avatarContainer} me-2 d-flex align-items-center justify-content-center`}
                  >
                    <Avatar
                      key={id + '1'}
                      containerStyle={styles.imageContainer}
                      avatarStyle={styles.TableImage}
                      name={params.row.volunteerGroup?.name as string}
                      alt={params.row.volunteerGroup?.name as string}
                    />
                  </div>
                  <span className="d-flex align-items-center">
                    {params.row.volunteerGroup?.name as string}
                  </span>
                </div>
              </>
            )}
          </>
        );
      },
    },
    {
      field: 'itemCategory',
      headerName: 'Item Category',
      flex: 1,
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <div
            className="d-flex justify-content-center fw-bold"
            data-testid="categoryName"
          >
            {params.row.category?.name}
          </div>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <Chip
            icon={<Circle className={styles.chipIcon} />}
            label={params.row.isCompleted ? 'Completed' : 'Pending'}
            variant="outlined"
            color="primary"
            className={`${styles.chip} ${params.row.isCompleted ? styles.active : styles.pending}`}
          />
        );
      },
    },
    {
      field: 'assignedAt',
      headerName: 'Assigned Date',
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      flex: 1,
      renderCell: (params: GridCellParams) => {
        return (
          <div data-testid="assignedAt">
            {dayjs(params.row.assignedAt).format('DD/MM/YYYY')}
          </div>
        );
      },
    },
    {
      field: 'options',
      headerName: 'Options',
      align: 'center',
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <>
            <Button
              variant="success"
              size="sm"
              style={{ minWidth: '32px' }}
              className={`me-2 rounded ${styles.editButton}`}
              data-testid={`viewItemBtn`}
              onClick={() => handleModalClick(params.row, ModalState.VIEW)}
            >
              <i className="fa fa-info" />
            </Button>
          </>
        );
      },
    },
    {
      field: 'completed',
      headerName: 'Completed',
      align: 'center',
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <div className="d-flex align-items-center justify-content-center mt-3">
            <Form.Check
              type="checkbox"
              data-testid={`statusCheckbox`}
              checked={params.row.isCompleted}
              onChange={() => handleModalClick(params.row, ModalState.STATUS)}
              className={styles.switch}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div>
      {/* Header with search, filter and Create Button */}
      <div className={`${styles.btnsContainer} gap-4 flex-wrap`}>
        <SearchBar
          placeholder={tCommon('searchBy', {
            item: searchBy.charAt(0).toUpperCase() + searchBy.slice(1),
          })}
          onSearch={debouncedSearch}
          inputTestId="searchBy"
          buttonTestId="searchBtn"
        />
        <div className="d-flex gap-3 mb-1">
          <div className="d-flex justify-space-between align-items-center gap-3">
            <SortingButton
              sortingOptions={[
                { label: t('assignee'), value: 'assignee' },
                { label: t('category'), value: 'category' },
              ]}
              selectedOption={searchBy}
              onSortChange={(value) =>
                setSearchBy(value as 'assignee' | 'category')
              }
              dataTestIdPrefix="searchByToggle"
              buttonLabel={tCommon('searchBy', { item: '' })}
            />
            <SortingButton
              sortingOptions={[
                { label: t('latestAssigned'), value: 'dueDate_DESC' },
                { label: t('earliestAssigned'), value: 'dueDate_ASC' },
              ]}
              onSortChange={(value) =>
                setSortBy(value as 'dueDate_DESC' | 'dueDate_ASC')
              }
              dataTestIdPrefix="sort"
              buttonLabel={tCommon('sort')}
            />
          </div>
        </div>
      </div>

      {/* Table with Action Items */}
      <DataGrid
        disableColumnMenu
        columnBufferPx={7}
        hideFooter={true}
        getRowId={(row) => row.id}
        slots={{
          noRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              {t('noActionItems')}
            </Stack>
          ),
        }}
        sx={dataGridStyle}
        getRowClassName={() => `${styles.rowBackground}`}
        autoHeight
        rowHeight={65}
        rows={actionItems}
        columns={columns}
        isRowSelectable={() => false}
      />

      {/* View Modal */}
      {actionItem && (
        <>
          <ItemViewModal
            isOpen={modalState[ModalState.VIEW]}
            hide={() => closeModal(ModalState.VIEW)}
            item={actionItem}
          />

          <ItemUpdateStatusModal
            actionItem={actionItem}
            isOpen={modalState[ModalState.STATUS]}
            hide={() => closeModal(ModalState.STATUS)}
            actionItemsRefetch={actionItemsRefetch}
          />
        </>
      )}
    </div>
  );
}

export default actions;
