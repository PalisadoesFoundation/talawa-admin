/**
 * DataGridWrapper component for displaying tabular data with integrated search, sorting, and pagination capabilities.
 *
 * This module provides a reusable wrapper around Material-UI's DataGrid component,
 * enhancing it with built-in search functionality, configurable sorting options,
 * pagination controls, custom loading states, and error handling. It serves as the
 * primary component for rendering data tables throughout the Talawa Admin application.
 */

import React, { useMemo, useState, useEffect } from 'react';
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import type { InterfaceDataGridWrapperProps } from '../../types/DataGridWrapper/interface';
import styles from './DataGridWrapper.module.css';

import SearchBar from '../SearchBar/SearchBar';

import SortingButton from '../../subComponents/SortingButton';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import { DataGridLoadingOverlay } from './DataGridLoadingOverlay';
import { DataGridErrorOverlay } from './DataGridErrorOverlay';
/**
 * A generic wrapper around MUI DataGrid with built-in search, sorting, and pagination.
 *
 * @param props - Component props defined by InterfaceDataGridWrapperProps
 * @returns A data grid with optional toolbar controls (search, sort) and enhanced features
 *
 * @example
 * ```tsx
 * // Basic usage with search and pagination
 * <DataGridWrapper
 *   rows={users}
 *   columns={[{ field: 'name', headerName: 'Name', width: 150 }]}
 *   searchConfig={{ enabled: true, fields: ['name', 'email'] }}
 *   paginationConfig={{ enabled: true, defaultPageSize: 10 }}
 *   loading={isLoading}
 * />
 *
 * // With custom empty state
 * <DataGridWrapper
 *   rows={users}
 *   columns={columns}
 *   emptyStateProps={{
 *     icon: "users",
 *     message: "noUsers",
 *     description: "inviteFirstUser",
 *     action: {
 *       label: "inviteUser",
 *       onClick: handleInvite,
 *       variant: "primary"
 *     },
 *     dataTestId: "users-empty-state"
 *   }}
 * />
 *
 * // Backward compatible with legacy emptyStateMessage
 * <DataGridWrapper
 *   rows={users}
 *   columns={columns}
 *   emptyStateMessage="No users found"
 * />
 * ```
 *
 * @remarks
 * - The `emptyStateProps` prop provides full customization of the empty state (icon, description, action button).
 * - If both `emptyStateProps` and `emptyStateMessage` are provided, `emptyStateProps` takes precedence.
 * - Error states always take precedence over empty states.
 * - Accessibility: The component preserves a11y attributes (role="status", aria-live, aria-label) when using either `emptyStateProps` or `emptyStateMessage`.
 */
export function DataGridWrapper<T extends { id: string | number }>(
  props: InterfaceDataGridWrapperProps<T>,
) {
  const {
    rows = [],
    columns = [],
    loading = false,
    searchConfig,
    sortConfig,
    filterConfig,
    paginationConfig,
    onRowClick,
    actionColumn,
    emptyStateProps,
    emptyStateMessage,
    error,
    headerButton,
  } = props;
  const { t: tCommon } = useTranslation('common');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedSort, setSelectedSort] = useState<string | number>(() => {
    if (sortConfig?.defaultSortField && sortConfig?.defaultSortOrder) {
      return `${sortConfig.defaultSortField}_${sortConfig.defaultSortOrder}`;
    }
    return '';
  });
  const [selectedFilter, setSelectedFilter] = useState<string | number>(
    () => filterConfig?.defaultFilter ?? '',
  );
  const [page, setPage] = useState(0);

  const [pageSize, setPageSize] = useState(
    paginationConfig?.defaultPageSize ?? 10,
  );

  // Debounce search term to improve performance
  useEffect(() => {
    const debounceDelay = searchConfig?.debounceMs ?? 300;
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceDelay);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  // Apply filters first, then search, then custom sort
  const filteredAndSearched = useMemo(() => {
    let processedRows = rows;

    // Apply filter if configured
    if (filterConfig?.filterFunction && selectedFilter) {
      processedRows = filterConfig.filterFunction(
        processedRows,
        selectedFilter,
      );
    }

    // Then apply search
    if (searchConfig?.enabled && debouncedSearchTerm) {
      const trimmedSearch = debouncedSearchTerm.trim();
      if (trimmedSearch) {
        processedRows = processedRows.filter((r: T) =>
          searchConfig.fields.some((f) =>
            String(r[f as keyof T] ?? '')
              .toLowerCase()
              .includes(trimmedSearch.toLowerCase()),
          ),
        );
      }
    }

    // Apply custom sort if provided
    if (sortConfig?.sortFunction && selectedSort) {
      processedRows = sortConfig.sortFunction(processedRows, selectedSort);
    }

    return processedRows;
  }, [
    rows,
    debouncedSearchTerm,
    searchConfig,
    filterConfig,
    selectedFilter,
    sortConfig,
    selectedSort,
  ]);

  const sortModel = useMemo(() => {
    // Don't use MUI's sort model if custom sort function is provided
    if (sortConfig?.sortFunction) return [];

    if (!selectedSort) return [];
    const [field, sort] = String(selectedSort).split('_');
    if (field && (sort === 'asc' || sort === 'desc')) {
      return [{ field, sort: sort as 'asc' | 'desc' }];
    }
    // Warn developers about invalid sort format
    console.warn(
      `[DataGridWrapper] Invalid sort format: "${selectedSort}". Expected format: "field_asc" or "field_desc"`,
    );
    return [];
  }, [selectedSort, sortConfig]);

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
            inputTestId={searchConfig.searchInputTestId ?? 'search-bar'}
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
        {filterConfig?.filterOptions && (
          <SortingButton
            dataTestIdPrefix="filter"
            sortingOptions={filterConfig.filterOptions}
            selectedOption={selectedFilter}
            onSortChange={setSelectedFilter}
            type="filter"
            title={tCommon('filter')}
            buttonLabel={tCommon('filter')}
          />
        )}
        {headerButton}
      </div>
      <DataGrid
        rows={filteredAndSearched}
        columns={[...columns, ...actionCol]}
        loading={loading}
        slots={{
          loadingOverlay: DataGridLoadingOverlay,
          noRowsOverlay: () => {
            // Show error overlay if error exists
            if (error) {
              return <DataGridErrorOverlay message={error} />;
            }
            // Use new emptyStateProps API if provided (takes precedence)
            if (emptyStateProps) {
              return <EmptyState {...emptyStateProps} />;
            }
            // Fall back to legacy emptyStateMessage for backward compatibility
            return (
              <EmptyState
                message={emptyStateMessage || tCommon('noResultsFound')}
              />
            );
          },
        }}
        sortModel={sortModel}
        pagination={paginationConfig?.enabled == true ? true : undefined}
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
    </div>
  );
}
