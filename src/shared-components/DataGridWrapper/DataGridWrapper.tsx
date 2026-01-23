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
import SearchFilterBar from '../SearchFilterBar/SearchFilterBar';

import SortingButton from '../SortingButton/SortingButton';
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
    paginationConfig,
    onRowClick,
    actionColumn,
    emptyStateProps,
    emptyStateMessage,
    error,
  } = props;
  const { t: tCommon } = useTranslation('common');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedSort, setSelectedSort] = useState<string | number>(() => {
    if (sortConfig?.selectedSort) {
      return sortConfig.selectedSort;
    }
    if (sortConfig?.defaultSortField && sortConfig?.defaultSortOrder) {
      return `${sortConfig.defaultSortField}_${sortConfig.defaultSortOrder}`;
    }
    return '';
  });
  const [page, setPage] = useState(0);

  const [pageSize, setPageSize] = useState(
    paginationConfig?.defaultPageSize ?? 10,
  );

  // Use server-side search values if provided, otherwise use internal state
  const currentSearchTerm = searchConfig?.serverSide
    ? (searchConfig.searchTerm ?? '')
    : searchTerm;
  const currentDebouncedSearchTerm = searchConfig?.serverSide
    ? (searchConfig.searchTerm ?? '')
    : debouncedSearchTerm;

  // Runtime validation for server-side configuration
  useEffect(() => {
    if (
      searchConfig?.serverSide &&
      searchConfig.enabled &&
      !searchConfig.onSearchChange
    ) {
      console.warn(
        '[DataGridWrapper] Server-side search enabled but onSearchChange callback is missing',
      );
    }
  }, [searchConfig]);

  // Debounce search term to improve performance (client-side only)
  useEffect(() => {
    if (searchConfig?.serverSide) return; // Skip debouncing for server-side

    const debounceDelay = searchConfig?.debounceMs ?? 300;
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceDelay);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm, searchConfig?.debounceMs, searchConfig?.serverSide]);

  const filtered = useMemo(() => {
    // Skip client-side filtering for server-side mode
    if (searchConfig?.serverSide) return rows;

    if (
      !searchConfig?.enabled ||
      !currentDebouncedSearchTerm ||
      !searchConfig.fields
    )
      return rows;

    return rows.filter((r: T) => {
      const fields = searchConfig.fields as Array<keyof T & string>;
      return fields.some((f) =>
        String(r[f as keyof T] ?? '')
          .toLowerCase()
          .includes(currentDebouncedSearchTerm.toLowerCase()),
      );
    });
  }, [rows, currentDebouncedSearchTerm, searchConfig]);

  const sortModel = useMemo(() => {
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
        {searchConfig?.enabled && searchConfig.searchByOptions ? (
          // Server-side search with SearchFilterBar
          <SearchFilterBar
            searchPlaceholder={searchConfig.placeholder ?? tCommon('search')}
            searchValue={currentSearchTerm}
            onSearchChange={(value) => {
              if (searchConfig.serverSide && searchConfig.onSearchChange) {
                searchConfig.onSearchChange(
                  value,
                  searchConfig.selectedSearchBy,
                );
              } else {
                setSearchTerm(value);
              }
            }}
            onSearchSubmit={(value) => {
              if (searchConfig.serverSide && searchConfig.onSearchChange) {
                searchConfig.onSearchChange(
                  value,
                  searchConfig.selectedSearchBy,
                );
              } else {
                setSearchTerm(value);
              }
            }}
            searchInputTestId={searchConfig.searchInputTestId ?? 'searchInput'}
            searchButtonTestId="searchButton"
            hasDropdowns={true}
            dropdowns={[
              {
                id: 'search-by',
                label: tCommon('searchBy', { item: '' }),
                type: 'filter' as const,
                options: searchConfig.searchByOptions,
                selectedOption: searchConfig.selectedSearchBy ?? '',
                onOptionChange: (value: string | number) => {
                  if (searchConfig.onSearchByChange) {
                    searchConfig.onSearchByChange(value as string);
                  }
                },
                dataTestIdPrefix: 'searchBy',
              },
              ...(sortConfig?.sortingOptions
                ? [
                    {
                      id: 'sort',
                      label: tCommon('sort'),
                      type: 'sort' as const,
                      options: sortConfig.sortingOptions,
                      selectedOption: selectedSort,
                      onOptionChange: (value: string | number) => {
                        if (sortConfig.onSortChange) {
                          sortConfig.onSortChange(value);
                        } else {
                          setSelectedSort(value);
                        }
                      },
                      dataTestIdPrefix: 'sort',
                    },
                  ]
                : []),
            ]}
          />
        ) : searchConfig?.enabled ? (
          // Client-side search with SearchBar
          <SearchBar
            placeholder={searchConfig.placeholder ?? tCommon('search')}
            value={currentSearchTerm}
            onChange={(val) => setSearchTerm(val)}
            onSearch={(val) => setSearchTerm(val)}
            onClear={() => setSearchTerm('')}
            inputTestId={searchConfig.searchInputTestId ?? 'search-bar'}
            aria-label={tCommon('search')}
          />
        ) : null}
        {sortConfig?.sortingOptions && !searchConfig?.searchByOptions && (
          <SortingButton
            dataTestIdPrefix="sort"
            sortingOptions={sortConfig.sortingOptions}
            selectedOption={selectedSort}
            onSortChange={sortConfig.onSortChange || setSelectedSort}
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
