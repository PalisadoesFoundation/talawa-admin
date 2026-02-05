/**
 * Action item category management component with CRUD operations,
 *              search, filtering, and sorting capabilities.
 *
 * @param  orgId - Organization UUID for fetching categories
 *
 * Features:
 * - Create/Read/Update/Delete action item categories
 * - Real-time search by category name
 * - Sort by creation date (ASC/DESC)
 * - Filter by status (Active/Disabled/All)
 * - Responsive DataGrid with Material-UI
 * - Modal-based category management
 * - Toast notifications for operations
 * - Comprehensive error handling
 *
 * @example
 * <OrgActionItemCategories orgId="550e8400-e29b-41d4-a716-446655440000" />
 *
 * Dependencies:
 * - React 18+, Apollo Client, Material-UI, React Bootstrap
 * - react-i18next, dayjs, react-toastify
 *
 * GraphQL Operations:
 * - Query: ACTION_ITEM_CATEGORY_LIST
 * - Mutations: CREATE/UPDATE/DELETE_ACTION_ITEM_CATEGORY_MUTATION
 */

import type { FC } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import Button from 'shared-components/Button';
import styles from './OrgActionItemCategories.module.css';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client/react';
import { ACTION_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/Queries';
import type { IActionItemCategoryInfo } from 'types/shared-components/ActionItems/interface';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { WarningAmberRounded } from '@mui/icons-material';
import {
  DataGrid,
  type GridCellParams,
  type GridColDef,
} from 'shared-components/DataGridWrapper';
import dayjs from 'dayjs';
import { Stack } from '@mui/material';
import CategoryModal from './Modal/ActionItemCategoryModal';
import CategoryViewModal from './Modal/ActionItemCategoryViewModal';
import SearchBar from 'shared-components/SearchBar/SearchBar';
import SortingButton from 'shared-components/SortingButton/SortingButton';
import StatusBadge from 'shared-components/StatusBadge/StatusBadge';
import { useModalState } from 'shared-components/CRUDModalTemplate/hooks/useModalState';

/** Category status for filtering */
enum CategoryStatus {
  Active = 'active',
  Disabled = 'disabled',
}

/** Component props interface */
interface IActionItemCategoryProps {
  orgId: string;
}

/**
 * Represents the component for managing organization action item categories.
 * This component allows creating, updating, enabling, and disabling action item categories.
 */
const OrgActionItemCategories: FC<IActionItemCategoryProps> = ({ orgId }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgActionItemCategories',
  });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  // State management
  const [category, setCategory] = useState<IActionItemCategoryInfo | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'createdAt_ASC' | 'createdAt_DESC'>(
    'createdAt_DESC',
  );
  const [status, setStatus] = useState<CategoryStatus | null>(null);
  const [categories, setCategories] = useState<IActionItemCategoryInfo[]>([]);
  const [modalMode, setModalMode] = useState<'edit' | 'create'>('create');

  const categoryModal = useModalState(false);
  const viewModal = useModalState(false);

  // Query to fetch action item categories
  const {
    data: catData,
    loading: catLoading,
    error: catError,
    refetch: refetchCategories,
  } = useQuery<{
    actionCategoriesByOrganization: IActionItemCategoryInfo[];
  }>(ACTION_ITEM_CATEGORY_LIST, {
    variables: {
      input: {
        organizationId: orgId,
      },
    },
  });

  /** Open category modal in create/edit mode */
  const handleOpenModal = useCallback(
    (
      category: IActionItemCategoryInfo | null,
      mode: 'edit' | 'create',
    ): void => {
      setCategory(category);
      setModalMode(mode);
      categoryModal.open();
    },
    [categoryModal],
  );

  /** Apply client-side filtering and sorting */
  useEffect(() => {
    if (catData && catData.actionCategoriesByOrganization) {
      let filteredCategories = catData.actionCategoriesByOrganization;

      // Search filter (case-insensitive)
      if (searchTerm) {
        filteredCategories = filteredCategories.filter(
          (cat) =>
            cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (cat.description &&
              cat.description.toLowerCase().includes(searchTerm.toLowerCase())),
        );
      }

      // Status filter
      if (status !== null) {
        filteredCategories = filteredCategories.filter((cat) => {
          if (status === CategoryStatus.Active) {
            return !cat.isDisabled;
          }
          return cat.isDisabled;
        });
      }

      // Date sorting
      filteredCategories = [...filteredCategories].sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);

        if (sortBy === 'createdAt_DESC') {
          return dateB.getTime() - dateA.getTime();
        } else {
          return dateA.getTime() - dateB.getTime();
        }
      });

      setCategories(filteredCategories);
    }
  }, [catData, searchTerm, status, sortBy]);

  // Error state
  if (catError) {
    return (
      <div className={styles.message} data-testid="errorMsg">
        <WarningAmberRounded
          className={styles.iconOrgActionItemCategories}
          fontSize="large"
        />
        <h6 className="fw-bold text-danger text-center">
          {tErrors('errorLoading', { entity: 'Action Item Categories' })}
          <br />
          {`${catError.message}`}
        </h6>
      </div>
    );
  }

  /** DataGrid column configuration */
  const columns: GridColDef[] = [
    {
      field: 'serialNumber',
      headerName: 'Sr. No.',
      flex: 1,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return <div>{params.row.serialNumber}</div>;
      },
    },
    {
      field: 'name',
      headerName: 'Category',
      flex: 2,
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
            {params.row.name}
          </div>
        );
      },
    },
    {
      field: 'isDisabled',
      headerName: 'Status',
      flex: 1,
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <StatusBadge
            variant={params.row.isDisabled ? 'disabled' : 'active'}
            size="sm"
            dataTestId="statusChip"
          />
        );
      },
    },
    {
      field: 'createdAt',
      headerName: 'Created On',
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      flex: 1,
      renderCell: (params: GridCellParams) => {
        return (
          <div data-testid="createdOn">
            {dayjs(params.row.createdAt).format('DD/MM/YYYY')}
          </div>
        );
      },
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1.5,
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <div className="d-flex gap-2 justify-content-center align-items-center h-100">
            <Button
              variant="success"
              size="sm"
              className={styles.editButton}
              data-testid={'viewCategoryBtn' + params.row.serialNumber}
              onClick={() => {
                setCategory(params.row as IActionItemCategoryInfo);
                viewModal.open();
              }}
            >
              <i className="fa fa-eye" />
            </Button>
            <Button
              variant="success"
              size="sm"
              className={styles.editButton}
              data-testid={'editCategoryBtn' + params.row.serialNumber}
              onClick={() =>
                handleOpenModal(params.row as IActionItemCategoryInfo, 'edit')
              }
            >
              <i className="fa fa-edit" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <LoadingState isLoading={catLoading} variant="spinner">
      <div className="mx-4">
        {/* Header: Search, Sort, Filter, Create */}
        <div
          className={`${styles.btnsContainerOrgActionItemCategories} gap-4 flex-wrap`}
        >
          <SearchBar
            placeholder={tCommon('searchByName')}
            onSearch={setSearchTerm}
            inputTestId="searchByName"
            buttonTestId="searchBtn"
          />
          <div className="d-flex gap-4 mb-1">
            <div className="d-flex justify-space-between align-items-center gap-4">
              {/* Sort by creation date */}
              <SortingButton
                title={tCommon('sort')}
                sortingOptions={[
                  { label: tCommon('createdLatest'), value: 'createdAt_DESC' },
                  { label: tCommon('createdEarliest'), value: 'createdAt_ASC' },
                ]}
                selectedOption={
                  sortBy === 'createdAt_DESC'
                    ? tCommon('createdLatest')
                    : tCommon('createdEarliest')
                }
                onSortChange={(value) =>
                  setSortBy(value as 'createdAt_DESC' | 'createdAt_ASC')
                }
                dataTestIdPrefix="sort"
                buttonLabel={tCommon('sort')}
                className={styles.dropdown}
              />

              {/* Filter by status */}
              <SortingButton
                title={t('status')}
                sortingOptions={[
                  { label: tCommon('all'), value: 'all' },
                  { label: tCommon('active'), value: CategoryStatus.Active },
                  {
                    label: tCommon('disabled'),
                    value: CategoryStatus.Disabled,
                  },
                ]}
                selectedOption={
                  status === null
                    ? tCommon('all')
                    : status === CategoryStatus.Active
                      ? tCommon('active')
                      : tCommon('disabled')
                }
                onSortChange={(value) =>
                  setStatus(value === 'all' ? null : (value as CategoryStatus))
                }
                dataTestIdPrefix="filter"
                buttonLabel={t('status')}
                className={styles.dropdown}
              />
            </div>

            {/* Create button */}
            <div>
              <Button
                variant="success"
                onClick={() => handleOpenModal(null, 'create')}
                className={`${styles.createButton} ${styles.marginTopSm}`}
                data-testid="createActionItemCategoryBtn"
              >
                <i className={'fa fa-plus me-2'} />
                {tCommon('create')}
              </Button>
            </div>
          </div>
        </div>

        {/* Categories DataGrid */}
        <DataGrid
          disableColumnMenu
          columnBufferPx={6}
          hideFooter={true}
          getRowId={(row) => row.id}
          slots={{
            noRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                {t('noActionItemCategories')}
              </Stack>
            ),
          }}
          className={styles.actionItemCategoriesDataGrid}
          getRowClassName={() => `${styles.rowBackground}`}
          autoHeight
          rowHeight={65}
          rows={categories.map((category, index) => ({
            ...category,
            serialNumber: index + 1,
          }))}
          columns={columns}
          isRowSelectable={() => false}
        />

        {/* Category Modal */}
        <CategoryModal
          isOpen={categoryModal.isOpen}
          hide={categoryModal.close}
          refetchCategories={refetchCategories}
          category={category}
          orgId={orgId}
          mode={modalMode}
        />

        {/* Category View Modal */}
        <CategoryViewModal
          isOpen={viewModal.isOpen}
          hide={viewModal.close}
          category={category}
        />
      </div>
    </LoadingState>
  );
};

export default OrgActionItemCategories;
