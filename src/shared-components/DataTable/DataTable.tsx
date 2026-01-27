/**
 * DataTable component for displaying typed tabular data with advanced features.
 *
 * Provides comprehensive table functionality including sorting, filtering, pagination,
 * selection, bulk actions, and search capabilities. Supports both client-side and
 * server-side pagination modes.
 *
 * @typeParam T - The type of data for each row
 *
 * @example
 * ```tsx
 * const columns = [
 *   { id: 'name', header: 'Name', accessor: 'name' },
 *   { id: 'email', header: 'Email', accessor: 'email' }
 * ];
 * <DataTable
 *   data={users}
 *   columns={columns}
 *   loading={false}
 *   rowKey="id"
 * />
 * ```
 */

import React from 'react';
import type {
  IDataTableProps,
  IColumnDef,
  SortDirection,
} from 'types/shared-components/DataTable/interface';
import { PaginationControls } from './Pagination';
import { SearchBar } from './SearchBar';
import { TableLoader } from './TableLoader';
import { BulkActionsBar } from './BulkActionsBar';
import styles from './DataTable.module.css';
import { useTranslation } from 'react-i18next';
import { getCellValue } from './utils';
import { useDataTableFiltering } from './hooks/useDataTableFiltering';
import { useDataTableSelection } from './hooks/useDataTableSelection';
import { DataTableSkeleton } from './DataTableSkeleton';
import { DataTableTable } from './DataTableTable';

// translation-check-keyPrefix: common

// DataTable renders typed tabular data with loading, empty, and error states.
const DEFAULT_SKELETON_ROWS: number = 5;

// Compare values with nulls last, numbers/dates/booleans handled explicitly.
function defaultCompare(a: unknown, b: unknown): number {
  // place null/undefined at the end
  const aNull = a === null || a === undefined;
  const bNull = b === null || b === undefined;
  if (aNull && bNull) return 0;
  if (aNull) return 1;
  if (bNull) return -1;
  // numbers
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  // dates
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  // booleans (false < true)
  if (typeof a === 'boolean' && typeof b === 'boolean')
    return a === b ? 0 : a ? 1 : -1;
  // string-ish fallback
  const as = String(a);
  const bs = String(b);
  return as.localeCompare(bs, undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

export function DataTable<T>(props: IDataTableProps<T>) {
  const { t: tCommon } = useTranslation('common');
  const {
    data,
    columns,
    loading,
    rowKey,
    tableClassName,
    renderRow,
    emptyMessage = tCommon('noResultsFound'),
    error,
    renderError,
    ariaLabel,
    serverSort,
    skeletonRows = DEFAULT_SKELETON_ROWS,
    // Loading optimizations
    loadingOverlay = false,
    loadingMore = false,
    // Pagination props
    paginationMode,
    pageSize = 10,
    currentPage,
    onPageChange,
    totalItems,
    pageInfo,
    // Search & Filter props
    showSearch = false,
    searchPlaceholder,
    globalSearch,
    onGlobalSearchChange,
    initialGlobalSearch = '',
    columnFilters,
    onColumnFiltersChange,
    serverSearch = false,
    serverFilter = false,
    // Selection & Actions
    selectable = false,
    selectedKeys,
    onSelectionChange,
    initialSelectedKeys,
    rowActions = [],
    bulkActions = [],
    // Sorting props
    sortBy,
    initialSortBy,
    initialSortDirection,
    onSortChange,
  } = props;

  // Pagination state (controlled or uncontrolled)
  const [internalPage, setInternalPage] = React.useState(1);
  const isControlled = currentPage !== undefined && onPageChange !== undefined;
  const page = isControlled ? currentPage : internalPage;

  const handlePageReset = React.useCallback(() => {
    if (isControlled) {
      onPageChange?.(1);
    } else {
      setInternalPage(1);
    }
  }, [isControlled, onPageChange]);

  const { query, updateGlobalSearch, filteredRows } = useDataTableFiltering({
    data,
    columns,
    initialGlobalSearch,
    globalSearch,
    onGlobalSearchChange,
    columnFilters,
    onColumnFiltersChange,
    serverSearch,
    serverFilter,
    paginationMode,
    onPageReset: handlePageReset,
  });

  const hasWarnedCurrentPageRef = React.useRef(false);
  const hasWarnedServerPaginationRef = React.useRef(false);

  React.useEffect(() => {
    if (
      process.env.NODE_ENV !== 'production' &&
      currentPage !== undefined &&
      !onPageChange &&
      !hasWarnedCurrentPageRef.current
    ) {
      hasWarnedCurrentPageRef.current = true;
      console.warn(
        'DataTable: `currentPage` was provided without `onPageChange`. The table will fall back to uncontrolled pagination.',
      );
    }
  }, [currentPage, onPageChange]);

  React.useEffect(() => {
    if (
      process.env.NODE_ENV !== 'production' &&
      paginationMode === 'server' &&
      totalItems === undefined &&
      !hasWarnedServerPaginationRef.current
    ) {
      hasWarnedServerPaginationRef.current = true;
      console.warn(
        'DataTable: `paginationMode="server"` requires `totalItems` to be provided for accurate pagination.',
      );
    }
  }, [paginationMode, totalItems]);

  const handlePageChange = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
    } else {
      setInternalPage(newPage);
    }
  };

  // --- Sorting state and logic (must happen before pagination) ---
  // Sorting state (controlled or uncontrolled)
  const sortByArray = sortBy ?? [];
  const controlledSort = Array.isArray(sortBy);
  const [uSortBy, setUSortBy] = React.useState<string | undefined>(
    initialSortBy,
  );
  const [uSortDir, setUSortDir] = React.useState<SortDirection>(
    initialSortDirection ?? 'asc',
  );
  const activeSortBy = controlledSort ? sortByArray[0]?.columnId : uSortBy;
  const activeSortDir: SortDirection = controlledSort
    ? (sortByArray[0]?.direction ?? 'asc')
    : uSortDir;

  function nextDirection(current?: SortDirection): SortDirection {
    return current === 'asc' ? 'desc' : 'asc';
  }

  function handleHeaderClick(col: IColumnDef<T>) {
    if (col.meta?.sortable === false) return;
    const willSortBy = col.id;
    const sameColumn = activeSortBy === willSortBy;
    const nextDir = sameColumn ? nextDirection(activeSortDir) : 'asc';
    if (!controlledSort) {
      setUSortBy(willSortBy);
      setUSortDir(nextDir);
    }
    onSortChange?.({
      sortBy: [{ columnId: willSortBy, direction: nextDir }],
      sortDirection: nextDir,
      column: col,
    });
  }

  // Compute visible rows: client sort when not serverSort
  const sortedRows: readonly T[] = React.useMemo(() => {
    if (serverSort) return filteredRows;
    if (!Array.isArray(filteredRows) || filteredRows.length === 0)
      return filteredRows;
    if (!activeSortBy) return filteredRows;
    const col = columns.find((c) => c.id === activeSortBy);
    if (!col || col.meta?.sortable === false) return filteredRows;
    const getVal = (row: T) => getCellValue(row, col.accessor);
    const dirFactor = activeSortDir === 'asc' ? 1 : -1;
    const decorated = filteredRows.map((row, idx) => ({
      idx,
      row,
      val: getVal(row),
    }));
    const sortFn = col.meta?.sortFn;
    const cmp = sortFn
      ? (a: (typeof decorated)[number], b: (typeof decorated)[number]) =>
          sortFn(a.row, b.row)
      : (a: (typeof decorated)[number], b: (typeof decorated)[number]) =>
          defaultCompare(a.val, b.val);
    decorated.sort((a, b) => {
      // Nulls always last, regardless of sort direction
      const aNull = a.val === null || a.val === undefined;
      const bNull = b.val === null || b.val === undefined;
      if (aNull && bNull) return a.idx - b.idx;
      if (aNull) return 1;
      if (bNull) return -1;
      // Apply dirFactor only to non-null comparisons
      const base = cmp(a, b);
      return base !== 0 ? base * dirFactor : a.idx - b.idx;
    });
    return decorated.map((d) => d.row);
  }, [filteredRows, columns, activeSortBy, activeSortDir, serverSort]);

  const shouldSliceClientSide = paginationMode === 'client';
  const showPaginationControls =
    paginationMode === 'client' ||
    (paginationMode === 'server' && pageInfo !== undefined);

  const startIndex = shouldSliceClientSide ? (page - 1) * pageSize : 0;
  const endIndex = shouldSliceClientSide
    ? startIndex + pageSize
    : sortedRows.length;
  const paginatedData = shouldSliceClientSide
    ? sortedRows.slice(startIndex, endIndex)
    : sortedRows;

  const total = totalItems ?? sortedRows.length;

  const tableClassNames = tableClassName
    ? `${styles.dataTableBase} ${tableClassName}`
    : styles.dataTableBase;

  const getKey = React.useCallback(
    (row: T, idx: number): string | number => {
      if (typeof rowKey === 'function') {
        return rowKey(row);
      }
      if (rowKey) {
        const value = row[rowKey];
        if (typeof value === 'string' || typeof value === 'number') {
          return value;
        }
        if (value != null) {
          return String(value);
        }
        return idx;
      }
      const rowAsRecord = row as Record<string, unknown>;
      const idValue = rowAsRecord.id ?? rowAsRecord._id;
      if (typeof idValue === 'string' || typeof idValue === 'number') {
        return idValue;
      }
      return idx;
    },
    [rowKey],
  );

  const keysOnPage = React.useMemo(
    () => paginatedData.map((r, i) => getKey(r, startIndex + i)),
    [paginatedData, getKey, startIndex],
  );

  // Selection logic (must be after paginatedData and keysOnPage)
  const {
    currentSelection,
    selectedCountOnPage,
    allSelectedOnPage,
    someSelectedOnPage,
    toggleRowSelection,
    selectAllOnPage,
    clearSelection,
    runBulkAction,
  } = useDataTableSelection<T>({
    paginatedData,
    keysOnPage,
    selectable,
    selectedKeys,
    onSelectionChange,
    initialSelectedKeys,
  });

  // When renderRow is provided, disable selection/actions to prevent column count mismatch
  const effectiveSelectable = renderRow ? false : selectable;
  const effectiveRowActions = renderRow ? [] : rowActions;

  // Header checkbox ref for indeterminate state
  const headerCheckboxRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = someSelectedOnPage;
    }
  }, [someSelectedOnPage]);

  // Refs to debounce development warnings (prevent console spam on re-renders)
  const hasWarnedRenderRowSelectableRef = React.useRef(false);
  const hasWarnedRenderRowActionsRef = React.useRef(false);

  // Warn in development if renderRow is used with selection/actions
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && renderRow) {
      if (selectable && !hasWarnedRenderRowSelectableRef.current) {
        hasWarnedRenderRowSelectableRef.current = true;
        console.warn(
          'DataTable: `selectable` is ignored when `renderRow` is provided. ' +
            'Custom row renderers must handle selection UI manually.',
        );
      }
      if (
        rowActions &&
        rowActions.length > 0 &&
        !hasWarnedRenderRowActionsRef.current
      ) {
        hasWarnedRenderRowActionsRef.current = true;
        console.warn(
          'DataTable: `rowActions` is ignored when `renderRow` is provided. ' +
            'Custom row renderers must handle action buttons manually.',
        );
      }
    }
  }, [renderRow, selectable, rowActions]);

  const hasRowActions = effectiveRowActions && effectiveRowActions.length > 0;
  const hasBulkActions = bulkActions && bulkActions.length > 0;

  // Memoize selected keys/rows for bulk actions to avoid recomputing in map
  const selectedKeysOnPage = React.useMemo(
    () => keysOnPage.filter((k) => currentSelection.has(k)),
    [keysOnPage, currentSelection],
  );

  const selectedRowsOnPage = React.useMemo(
    () => paginatedData.filter((_, i) => currentSelection.has(keysOnPage[i])),
    [paginatedData, keysOnPage, currentSelection],
  );

  // 1) Error state
  if (error) {
    return (
      <div
        className={styles.dataErrorState}
        role="alert"
        aria-live="assertive"
        data-testid="datatable-error"
      >
        {renderError ? (
          renderError(error)
        ) : (
          <>
            <strong>{tCommon('unableToLoadData')}</strong>
            <div className={styles.dataErrorDetails}>{error.message}</div>
          </>
        )}
      </div>
    );
  }

  if (loading && (!data || data.length === 0)) {
    return (
      <DataTableSkeleton
        ariaLabel={ariaLabel}
        columns={columns}
        effectiveSelectable={effectiveSelectable}
        hasRowActions={hasRowActions}
        skeletonRows={skeletonRows}
        tableClassNames={tableClassNames}
      />
    );
  }

  // 3) Empty state
  if (!loading && (!paginatedData || paginatedData.length === 0)) {
    return (
      <div className={styles.dataTableWrapper}>
        {showSearch && (
          <div className={styles.toolbar}>
            <SearchBar
              value={query}
              onChange={updateGlobalSearch}
              placeholder={searchPlaceholder ?? tCommon('search')}
              aria-label={tCommon('search')}
              clear-aria-label={tCommon('clearSearch')}
            />
          </div>
        )}
        <output
          className={styles.dataEmptyState}
          aria-live="polite"
          data-testid="datatable-empty"
        >
          {emptyMessage}
        </output>
      </div>
    );
  }

  // 4) Data view
  return (
    <div className={styles.dataTableWrapper}>
      {showSearch && (
        <div className={styles.toolbar}>
          <SearchBar
            value={query}
            onChange={updateGlobalSearch}
            placeholder={searchPlaceholder ?? tCommon('search')}
            aria-label={tCommon('search')}
            clear-aria-label={tCommon('clearSearch')}
          />
        </div>
      )}

      {loading && loadingOverlay && (
        <TableLoader
          columns={columns}
          rows={Math.min(skeletonRows, 3)}
          asOverlay
          ariaLabel={tCommon('loading')}
        />
      )}

      {effectiveSelectable && hasBulkActions && (
        <BulkActionsBar count={selectedCountOnPage} onClear={clearSelection}>
          {bulkActions.map((action) => {
            const isDisabled =
              typeof action.disabled === 'function'
                ? action.disabled(selectedRowsOnPage, selectedKeysOnPage)
                : !!action.disabled;
            return (
              <button
                key={action.id}
                type="button"
                disabled={isDisabled}
                onClick={() => runBulkAction(action)}
                className={styles.bulkBtn}
                data-testid={`bulk-action-${action.id}`}
              >
                {action.label}
              </button>
            );
          })}
        </BulkActionsBar>
      )}

      <DataTableTable
        ariaLabel={ariaLabel}
        ariaBusy={loading && loadingOverlay}
        tableClassNames={tableClassNames}
        columns={columns}
        effectiveSelectable={effectiveSelectable}
        hasRowActions={hasRowActions}
        headerCheckboxRef={headerCheckboxRef}
        someSelectedOnPage={someSelectedOnPage}
        allSelectedOnPage={allSelectedOnPage}
        selectAllOnPage={selectAllOnPage}
        activeSortBy={activeSortBy}
        activeSortDir={activeSortDir}
        handleHeaderClick={handleHeaderClick}
        sortedRows={paginatedData}
        startIndex={startIndex}
        getKey={getKey}
        currentSelection={currentSelection}
        toggleRowSelection={toggleRowSelection}
        tCommon={tCommon}
        renderRow={renderRow}
        effectiveRowActions={effectiveRowActions}
        loadingMore={loadingMore}
        skeletonRows={skeletonRows}
      />

      {showPaginationControls && !loading && (
        <PaginationControls
          page={page}
          pageSize={pageSize}
          totalItems={total}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default DataTable;
