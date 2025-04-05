/**
 * @file OrgActionItemCategories.tsx
 * @description This file contains the `OrgActionItemCategories` component, which is responsible for managing
 *              action item categories within an organization. It provides functionality to create, update,
 *              enable, disable, and search for action item categories.
 *
 * @module OrgActionItemCategories
 *
 * @typedef {InterfaceActionItemCategoryProps} InterfaceActionItemCategoryProps - Props for the component.
 * @typedef {InterfaceActionItemCategoryInfo} InterfaceActionItemCategoryInfo - Interface for category data.
 *
 * @component
 * @param {InterfaceActionItemCategoryProps} props - Component props containing the organization ID.
 *
 * @description
 * - Displays a table of action item categories with options to sort, filter, and search.
 * - Allows creating and editing categories via a modal.
 * - Fetches data using GraphQL queries and handles loading and error states.
 * - Provides a user-friendly interface with Material-UI components and Bootstrap styling.
 *
 * @example
 * <OrgActionItemCategories orgId="12345" />
 */
import type { FC } from 'react';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import { useTranslation } from 'react-i18next';
import { useQuery, gql } from '@apollo/client';
import { ACTION_ITEM_CATEGORY } from 'GraphQl/Queries/ActionItemCategoryQueries';
import type { InterfaceActionItemCategory } from 'utils/interfaces';
import Loader from 'components/Loader/Loader';
import { Circle, WarningAmberRounded } from '@mui/icons-material';
import {
  DataGrid,
  type GridCellParams,
  type GridColDef,
} from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { Chip, Stack } from '@mui/material';
import CategoryModal from './Modal/CategoryModal';
import SortingButton from 'subComponents/SortingButton';
import SearchBar from 'subComponents/SearchBar';

enum ModalState {
  SAME = 'same',
  DELETE = 'delete',
}

enum CategoryStatus {
  Active = 'active',
  Disabled = 'disabled',
}

interface InterfaceActionItemCategoryProps {
  orgId: string;
}

/* -- Helper Component: CreatorNameCell -- */
const GET_USER_NAME = gql`
  query GetUser($input: QueryUserInput!) {
    user(input: $input) {
      name
    }
  }
`;

interface CreatorNameCellProps {
  creatorId: string;
}

const CreatorNameCell: FC<CreatorNameCellProps> = ({ creatorId }) => {
  const { data, loading, error } = useQuery(GET_USER_NAME, {
    variables: { input: { id: creatorId } },
  });

  if (loading) return <span>Loading...</span>;
  if (error || !data || !data.user) return <span>{creatorId}</span>;
  return <span>{data.user.name}</span>;
};

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

const OrgActionItemCategories: FC<InterfaceActionItemCategoryProps> = ({
  orgId,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgActionItemCategories',
  });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  const [category, setCategory] = useState<InterfaceActionItemCategory | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'createdAt_ASC' | 'createdAt_DESC'>(
    'createdAt_DESC',
  );
  const [status, setStatus] = useState<CategoryStatus | null>(null);
  const [categories, setCategories] = useState<InterfaceActionItemCategory[]>(
    [],
  );
  const [modalMode, setModalMode] = useState<'edit' | 'create'>('create');
  const [modalState, setModalState] = useState<{
    [key in ModalState]: boolean;
  }>({
    [ModalState.SAME]: false,
    [ModalState.DELETE]: false,
  });

  // Use the provided query which expects an input object (only organizationId is supported)
  const {
    data: catData,
    loading: catLoading,
    error: catError,
    refetch: refetchCategories,
  } = useQuery(ACTION_ITEM_CATEGORY, {
    variables: {
      input: {
        organizationId: orgId,
      },
    },
  });

  // Log the data coming from the query for debugging
  useEffect(() => {
    if (catData) {
      console.log('Fetched Action Item Categories Data:', catData);
      if (catData.actionCategoriesByOrganization) {
        setCategories(catData.actionCategoriesByOrganization);
      }
    }
  }, [catData]);

  // Client-side filtering based on search term and status
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch = cat.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        status === null
          ? true
          : status === CategoryStatus.Disabled
            ? cat.isDisabled
            : !cat.isDisabled;
      return matchesSearch && matchesStatus;
    });
  }, [categories, searchTerm, status]);

  // Client-side sorting based on createdAt field
  const sortedCategories = useMemo(() => {
    return [...filteredCategories].sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return sortBy === 'createdAt_ASC' ? aTime - bTime : bTime - aTime;
    });
  }, [filteredCategories, sortBy]);

  const openModal = (modal: ModalState): void =>
    setModalState((prevState) => ({ ...prevState, [modal]: true }));
  const closeModal = (modal: ModalState): void =>
    setModalState((prevState) => ({ ...prevState, [modal]: false }));

  const handleOpenModal = useCallback(
    (
      category: InterfaceActionItemCategory | null,
      mode: 'edit' | 'create',
    ): void => {
      setCategory(category);
      setModalMode(mode);
      openModal(ModalState.SAME);
    },
    [openModal],
  );

  if (catLoading) {
    return <Loader styles={styles.message} size="lg" />;
  }

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

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Sr. No.',
      flex: 1,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        // Find index from the sorted categories array and add 1
        const index = sortedCategories.findIndex((row) => row.id === params.id);
        return <div data-testid="rowId">{index + 1}</div>;
      },
    },
    {
      field: 'categoryName',
      headerName: 'Category',
      flex: 2,
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => (
        <div
          className="d-flex justify-content-center fw-bold"
          data-testid="categoryName"
        >
          {params.row.name}
        </div>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => (
        <Chip
          data-testid="statusChip"
          icon={<Circle className={styles.chipIcon} />}
          label={params.row.isDisabled ? 'Disabled' : 'Active'}
          variant="outlined"
          color="primary"
          className={`${styles.chip} ${params.row.isDisabled ? styles.pending : styles.active}`}
        />
      ),
    },
    {
      field: 'createdBy',
      headerName: 'Created By',
      flex: 1,
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => (
        <span data-testid="creatorName">
          <CreatorNameCell creatorId={params.row.creatorId} />
        </span>
      ),
    },
    {
      field: 'createdOn',
      headerName: 'Created On',
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      flex: 1,
      renderCell: (params: GridCellParams) => (
        <div data-testid="createdOn">
          {dayjs(params.row.createdAt).format('DD/MM/YYYY')}
        </div>
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 2,
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => (
        <Button
          variant="success"
          size="sm"
          className="me-2 rounded"
          data-testid={`editCategoryBtn${params.row.id}`}
          onClick={() =>
            handleOpenModal(params.row as InterfaceActionItemCategory, 'edit')
          }
        >
          <i className="fa fa-edit" />
        </Button>
      ),
    },
  ];

  return (
    <div className="mx-4">
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
            <SortingButton
              title={t('status')}
              sortingOptions={[
                { label: tCommon('all'), value: 'all' },
                { label: tCommon('active'), value: CategoryStatus.Active },
                { label: tCommon('disabled'), value: CategoryStatus.Disabled },
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
          <div>
            <Button
              variant="success"
              onClick={() => handleOpenModal(null, 'create')}
              style={{ marginTop: '11px' }}
              data-testid="createActionItemCategoryBtn"
            >
              <i className="fa fa-plus me-2" />
              {tCommon('create')}
            </Button>
          </div>
        </div>
      </div>

      <DataGrid
        disableColumnMenu
        columnBufferPx={6}
        hideFooter
        getRowId={(row) => row.id}
        slots={{
          noRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              {t('noActionItemCategories')}
            </Stack>
          ),
        }}
        sx={dataGridStyle}
        getRowClassName={() => `${styles.rowBackground}`}
        autoHeight
        rowHeight={65}
        columns={columns}
        isRowSelectable={() => false}
        rows={sortedCategories}
      />

      <CategoryModal
        isOpen={modalState[ModalState.SAME]}
        hide={() => closeModal(ModalState.SAME)}
        refetchCategories={refetchCategories}
        category={category}
        orgId={orgId}
        mode={modalMode}
      />
    </div>
  );
};

export default OrgActionItemCategories;
