/** DataGridWrapper: standardized grid with search/sort/pagination */
import React, { useMemo, useState } from 'react';
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import type { InterfaceDataGridWrapperProps } from './interface';
import styles from './DataGridWrapper.module.css';

import SearchBar from '../SearchBar/SearchBar';

import SortingButton from '../../subComponents/SortingButton';

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
  const [selectedSort, setSelectedSort] = useState<string | number>('');
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
        <div role="status">
          {emptyStateMessage || tCommon('noResultsFound')}
        </div>
      )}
    </div>
  );
}
