/**
 * @module shared-components/DataGridWrapper
 * @summary DataGridWrapper component for displaying tabular data with integrated search, sorting, and pagination capabilities.
 *
 * This module provides a reusable wrapper around Material-UI's DataGrid component,
 * enhancing it with built-in search functionality, configurable sorting options,
 * pagination controls, custom loading states, and error handling. It serves as the
 * primary component for rendering data tables throughout the Talawa Admin application.
 */

import React, { useMemo, useState } from 'react';
import {
  DataGrid,
  GridLoadingOverlayProps,
  GridRenderCellParams,
  LoadingOverlayPropsOverrides,
} from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import type { InterfaceDataGridWrapperProps } from '../../types/DataGridWrapper/interface';
import styles from './DataGridWrapper.module.css';

import SearchBar from '../SearchBar/SearchBar';

import SortingButton from '../../subComponents/SortingButton';
import LoadingState from '../LoadingState/LoadingState';
/**
 * A generic wrapper around MUI DataGrid with built-in search, sorting, and pagination.
 *
 * @template T - The row data type (must include `id: string | number`)
 * @param props - Component props defined by InterfaceDataGridWrapperProps<T>
 * @returns A data grid with optional toolbar controls (search, sort) and enhanced features
 *
 * @example
 * ```tsx
 * <DataGridWrapper
 *   rows={users}
 *   columns={[{ field: 'name', headerName: 'Name', width: 150 }]}
 *   searchConfig={{ enabled: true, fields: ['name', 'email'] }}
 *   loading={isLoading}
 * />
 * ```
 */
export function DataGridWrapper<T extends { id: string | number }>(
  props: InterfaceDataGridWrapperProps<T>,
) {
  const {
    rows,
    columns,
    loading = false,
    searchConfig,
    sortConfig,
    paginationConfig,
    onRowClick,
    actionColumn,
    emptyStateMessage,
    error,
  } = props;
  const { t: tCommon } = useTranslation('common');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSort, setSelectedSort] = useState<string | number>(() => {
    if (sortConfig?.defaultSortField && sortConfig?.defaultSortOrder) {
      return `${sortConfig.defaultSortField}_${sortConfig.defaultSortOrder}`;
    }
    return '';
  });
  const [page, setPage] = useState(0);

  const [pageSize, setPageSize] = useState(
    paginationConfig?.defaultPageSize ?? 10,
  );

  const filtered = useMemo(() => {
    if (!searchConfig?.enabled || !searchTerm) return rows;
    return rows.filter((r: T) =>
      searchConfig.fields.some((f) =>
        String(r[f as keyof T] ?? '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      ),
    );
  }, [rows, searchTerm, searchConfig]);

  const sortModel = useMemo(() => {
    if (!selectedSort) return [];
    const [field, sort] = String(selectedSort).split('_');
    if (field && (sort === 'asc' || sort === 'desc')) {
      return [{ field, sort: sort as 'asc' | 'desc' }];
    }
    return [];
  }, [selectedSort]);

  const actionCol = actionColumn
    ? [
        {
          field: '__actions__',
          headerName: 'Actions',
          sortable: false,
          width: 150,
          renderCell: (params: GridRenderCellParams<T>) =>
            actionColumn(params.row),
        },
      ]
    : [];

  return (
    <div>
      <div className={styles.toolbar}>
        {searchConfig?.enabled && (
          <SearchBar
            placeholder={searchConfig.placeholder ?? tCommon('search')}
            value={searchTerm}
            onChange={(val) => setSearchTerm(val)}
            onSearch={(val) => setSearchTerm(val)}
            onClear={() => setSearchTerm('')}
            inputTestId="search-bar"
            aria-label={tCommon('search')}
          />
        )}
        {sortConfig?.sortingOptions && (
          <SortingButton
            dataTestIdPrefix="sort"
            sortingOptions={sortConfig.sortingOptions}
            selectedOption={selectedSort}
            onSortChange={setSelectedSort}
            type="sort"
            title={tCommon('sortBy')}
            buttonLabel={tCommon('sort')}
          />
        )}
      </div>
      <DataGrid
        rows={filtered}
        columns={[...columns, ...actionCol]}
        loading={loading}
        slots={{
          loadingOverlay:
            LoadingState as React.JSXElementConstructor<GridLoadingOverlayProps>,
        }}
        slotProps={{
          loadingOverlay: {
            isLoading: true,
            variant: 'spinner',
            size: 'lg',
          } as LoadingOverlayPropsOverrides,
        }}
        sortModel={sortModel}
        pagination={paginationConfig?.enabled ? true : undefined}
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={({ page, pageSize }) => {
          setPage(page);
          setPageSize(pageSize);
        }}
        pageSizeOptions={paginationConfig?.pageSizeOptions ?? [10, 25, 50, 100]}
        onRowClick={onRowClick ? (p) => onRowClick(p.row as T) : undefined}
        autoHeight
        disableRowSelectionOnClick
      />
      {error && (
        <div role="alert" className={styles.errorMessage}>
          {error}
        </div>
      )}
      {!loading && !error && filtered.length === 0 && (
        <output>{emptyStateMessage || tCommon('noResultsFound')}</output>
      )}
    </div>
  );
}
