import type { FC } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import styles from '../../../style/app.module.css';
import { useTranslation } from 'react-i18next';

import { useQuery } from '@apollo/client';
import { ACTION_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/Queries';
import type { InterfaceActionItemCategoryInfo } from 'utils/interfaces';
import Loader from 'components/Loader/Loader';
import { Circle, Search, WarningAmberRounded } from '@mui/icons-material';
import {
  DataGrid,
  type GridCellParams,
  type GridColDef,
} from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { Chip, Stack } from '@mui/material';
import CategoryModal from './CategoryModal';
import SortingButton from 'subComponents/SortingButton';

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

const dataGridStyle = {
  '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
    outline: 'none !important',
  },
  '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within': {
    outline: 'none',
  },
  '& .MuiDataGrid-row:hover': {
    backgroundColor: 'transparent',
  },
  '& .MuiDataGrid-row.Mui-hovered': {
    backgroundColor: 'transparent',
  },
  '& .MuiDataGrid-root': {
    borderRadius: '0.5rem',
  },
  '& .MuiDataGrid-main': {
    borderRadius: '0.5rem',
  },
};

/**
 * Represents the component for managing organization action item categories.
 * This component allows creating, updating, enabling, and disabling action item categories.
 */
const OrgActionItemCategories: FC<InterfaceActionItemCategoryProps> = ({
  orgId,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgActionItemCategories',
  });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  const [category, setCategory] =
    useState<InterfaceActionItemCategoryInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [sortBy, setSortBy] = useState<'createdAt_ASC' | 'createdAt_DESC'>(
    'createdAt_DESC',
  );
  const [status, setStatus] = useState<CategoryStatus | null>(null);
  const [categories, setCategories] = useState<
    InterfaceActionItemCategoryInfo[]
  >([]);
  const [modalMode, setModalMode] = useState<'edit' | 'create'>('create');
  const [modalState, setModalState] = useState<{
    [key in ModalState]: boolean;
  }>({
    [ModalState.SAME]: false,
    [ModalState.DELETE]: false,
  });

  // Query to fetch action item categories
  const {
    data: catData,
    loading: catLoading,
    error: catError,
    refetch: refetchCategories,
  }: {
    data?: {
      actionItemCategoriesByOrganization: InterfaceActionItemCategoryInfo[];
    };
    loading: boolean;
    error?: Error | undefined;
    refetch: () => void;
  } = useQuery(ACTION_ITEM_CATEGORY_LIST, {
    variables: {
      organizationId: orgId,
      where: {
        name_contains: searchTerm,
        is_disabled: !status ? undefined : status === CategoryStatus.Disabled,
      },
      orderBy: sortBy,
    },
  });

  const openModal = (modal: ModalState): void =>
    setModalState((prevState) => ({ ...prevState, [modal]: true }));

  const closeModal = (modal: ModalState): void =>
    setModalState((prevState) => ({ ...prevState, [modal]: false }));

  const handleOpenModal = useCallback(
    (
      category: InterfaceActionItemCategoryInfo | null,
      mode: 'edit' | 'create',
    ): void => {
      setCategory(category);
      setModalMode(mode);
      openModal(ModalState.SAME);
    },
    [openModal],
  );

  useEffect(() => {
    if (catData && catData.actionItemCategoriesByOrganization) {
      setCategories(catData.actionItemCategoriesByOrganization);
    }
  }, [catData]);

  // Show loader while data is being fetched
  if (catLoading) {
    return <Loader styles={styles.message} size="lg" />;
  }

  // Show error message if there's an error
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
        return <div>{params.row.id}</div>;
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
      field: 'status',
      headerName: 'Status',
      flex: 1,
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <Chip
            icon={<Circle className={styles.chipIcon} />}
            label={params.row.isDisabled ? 'Disabled' : 'Active'}
            variant="outlined"
            color="primary"
            className={`${styles.chip} ${params.row.isDisabled ? styles.pending : styles.active}`}
          />
        );
      },
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
      renderCell: (params: GridCellParams) => {
        return params.row.creator.firstName + ' ' + params.row.creator.lastName;
      },
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
      flex: 2,
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <Button
            variant="success"
            size="sm"
            className="me-2 rounded"
            data-testid={'editCategoryBtn' + params.row.id}
            onClick={() =>
              handleOpenModal(
                params.row as InterfaceActionItemCategoryInfo,
                'edit',
              )
            }
          >
            <i className="fa fa-edit" />
          </Button>
        );
      },
    },
  ];

  return (
    <div className="mx-4">
      {/* Header with search, filter  and Create Button */}
      <div
        className={`${styles.btnsContainerOrgActionItemCategories} gap-4 flex-wrap`}
      >
        <div className={`${styles.input} mb-1`}>
          <Form.Control
            type="name"
            placeholder={tCommon('searchByName')}
            autoComplete="off"
            required
            className={styles.inputField}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                setSearchTerm(searchValue);
              } else if (e.key === 'Backspace' && searchValue === '') {
                setSearchTerm('');
              }
            }}
            data-testid="searchByName"
          />
          <Button
            tabIndex={-1}
            className={styles.searchButton}
            onClick={() => setSearchTerm(searchValue)}
            data-testid="searchBtn"
          >
            <Search />
          </Button>
        </div>
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
              <i className={'fa fa-plus me-2'} />
              {tCommon('create')}
            </Button>
          </div>
        </div>
      </div>

      {/* Table with Action Item Categories */}
      <DataGrid
        disableColumnMenu
        columnBufferPx={6}
        hideFooter={true}
        getRowId={(row) => row._id}
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
        rows={categories.map((category, index) => ({
          id: index + 1,
          ...category,
        }))}
        columns={columns}
        isRowSelectable={() => false}
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
