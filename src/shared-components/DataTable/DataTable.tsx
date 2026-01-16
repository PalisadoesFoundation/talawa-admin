import React from 'react';
import Table from 'react-bootstrap/Table';
import type {
  IDataTableProps,
  IColumnDef,
  HeaderRender,
} from '../../types/shared-components/DataTable/interface';
import { PaginationControls } from './Pagination';
import { SearchBar } from './SearchBar';
import { TableLoader } from './TableLoader';
import styles from 'style/app-fixed.module.css';
import { useTranslation } from 'react-i18next';

function getCellValue<T>(row: T, accessor: IColumnDef<T>['accessor']) {
  return typeof accessor === 'function'
    ? accessor(row)
    : row[accessor as keyof T];
}

function renderHeader(header: HeaderRender) {
  return typeof header === 'function' ? header() : header;
}

function renderCellValue(value: unknown) {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return value;
  try {
    return JSON.stringify(value);
  } catch {
    return '';
  }
}

/**
 * DataTable is a reusable, typed table component for displaying tabular data with loading, empty, and error states.
 *
 * @typeParam T - The type of data for each row.
 * @param props - Table configuration and data.
 * @returns A table with support for loading skeletons, empty state, and error display.
 */
const DEFAULT_SKELETON_ROWS: number = 5;

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
  } = props;

  // Pagination state (controlled or uncontrolled)
  const [internalPage, setInternalPage] = React.useState(1);
  const isControlled = currentPage !== undefined && onPageChange !== undefined;
  const page = isControlled ? currentPage : internalPage;

  // --- Filtering & Search Logic ---

  // Controlled / uncontrolled global search
  const controlledSearch =
    typeof globalSearch === 'string' &&
    typeof onGlobalSearchChange === 'function';
  const [uQuery, setUQuery] = React.useState(initialGlobalSearch);
  const query = controlledSearch ? globalSearch! : uQuery;

  // Controlled / uncontrolled column filters
  const controlledFilters =
    !!columnFilters && typeof onColumnFiltersChange === 'function';
  const [uFilters, setUFilters] = React.useState<Record<string, unknown>>({});
  const filters = controlledFilters ? columnFilters! : uFilters;

  function updateGlobalSearch(next: string) {
    if (controlledSearch) onGlobalSearchChange!(next);
    else setUQuery(next);
    // Reset to first page on search change if using client pagination
    if (paginationMode === 'client' && !isControlled) setInternalPage(1);
  }

  function updateColumnFilters(colId: string, val: unknown) {
    const next = { ...filters };
    if (val === undefined || val === null || val === '') {
      delete next[colId];
    } else {
      next[colId] = val;
    }

    if (controlledFilters) onColumnFiltersChange!(next);
    else setUFilters(next);

    // Reset to first page on filter change if using client pagination
    if (paginationMode === 'client' && !isControlled) setInternalPage(1);
  }

  // Helper to get raw cell value
  function getCellValue(row: T, accessor: IColumnDef<T>['accessor']) {
    return typeof accessor === 'function'
      ? accessor(row)
      : row[accessor as keyof T];
  }

  // Helper for text search interactions
  function toSearchableString(v: unknown): string {
    if (v === null || v === undefined) return '';
    if (v instanceof Date) return v.toISOString();
    return String(v);
  }

  // Client-side filtering pipeline (skip when server flags are set)
  const filteredRows: T[] = React.useMemo(() => {
    let rows = data ?? [];
    if (!rows.length) return rows;

    // 1) Per-column filters
    if (!serverFilter && filters && Object.keys(filters).length > 0) {
      rows = rows.filter((row) => {
        for (const [colId, filterValueRaw] of Object.entries(filters)) {
          const col = columns.find((c) => c.id === colId);
          if (!col) continue;
          if (col.meta?.filterable === false) continue; // opt-out

          const filterValue = filterValueRaw;
          if (
            filterValue === '' ||
            filterValue === undefined ||
            filterValue === null
          )
            continue;

          // Use custom filterFn if provided
          if (typeof col.meta?.filterFn === 'function') {
            if (!col.meta!.filterFn!(row, filterValue)) return false;
            continue;
          }

          // Default text "contains" (case-insensitive) for strings, equals for others
          const cell = getCellValue(row, col.accessor);
          if (typeof filterValue === 'string') {
            const hay = toSearchableString(cell).toLowerCase();
            const needle = filterValue.toLowerCase();
            if (!hay.includes(needle)) return false;
          } else {
            // shallow equality fallback
            if (cell !== filterValue) return false;
          }
        }
        return true;
      });
    }

    // 2) Global search across searchable columns
    const q = (query ?? '').trim().toLowerCase();
    if (!serverSearch && q) {
      const searchable = columns.filter((c) => c.meta?.searchable !== false);
      rows = rows.filter((row) => {
        return searchable.some((col) => {
          if (typeof col.meta?.getSearchValue === 'function') {
            return col.meta!.getSearchValue!(row).toLowerCase().includes(q);
          }
          const v = getCellValue(row, col.accessor);
          return toSearchableString(v).toLowerCase().includes(q);
        });
      });
    }

    return rows;
  }, [data, columns, filters, serverFilter, query, serverSearch]);

  // --- End Filtering Logic ---

  // Track warning state for each console.warn to prevent spam independently
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

  // Client-side data slicing and pagination control visibility
  const shouldSliceClientSide = paginationMode === 'client';
  // Show pagination controls for client mode OR server mode with pageInfo (variant A)
  const showPaginationControls =
    paginationMode === 'client' ||
    (paginationMode === 'server' && pageInfo !== undefined);

  // NOTE: We use filteredRows here instead of data!
  const startIndex = shouldSliceClientSide ? (page - 1) * pageSize : 0;
  const endIndex = shouldSliceClientSide
    ? startIndex + pageSize
    : filteredRows.length;
  const paginatedData = shouldSliceClientSide
    ? filteredRows.slice(startIndex, endIndex)
    : filteredRows;

  const total = totalItems ?? filteredRows.length;

  const tableClassNames = tableClassName
    ? `${styles.dataTableBase} ${tableClassName}`
    : styles.dataTableBase;

  const getKey = React.useCallback(
    (row: T, idx: number): string | number => {
      if (typeof rowKey === 'function') {
        return rowKey(row);
      } else if (rowKey) {
        const value = row[rowKey];
        if (typeof value === 'string' || typeof value === 'number') {
          return value;
        }
        if (value != null) {
          return String(value);
        }
        return idx;
      } else {
        return idx;
      }
    },
    [rowKey],
  );

  // 1) Error state (highest priority)
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

  // 2) Table with skeleton rows when loading (initial load, no data)
  // Check if we have no data at all (ignore filters for initial load check)
  if (loading && (!data || data.length === 0)) {
    return (
      <div className={styles.dataTableWrapper} data-testid="datatable-loading">
        <Table
          striped
          hover
          responsive
          className={tableClassNames}
          aria-busy="true"
        >
          {ariaLabel && (
            <caption className={styles.visuallyHidden}>{ariaLabel}</caption>
          )}
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.id} scope="col">
                  {renderHeader(col.header)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: skeletonRows }).map((_, rowIdx) => (
              <tr
                key={`skeleton-row-${rowIdx}`}
                data-testid={`skeleton-row-${rowIdx}`}
              >
                {columns.map((col) => (
                  <td key={col.id}>
                    <div
                      className={styles.dataSkeletonCell}
                      data-testid="data-skeleton-cell"
                      aria-hidden="true"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }

  // 3) Empty state (if no rows after filter or empty dataset)
  if (!loading && (!paginatedData || paginatedData.length === 0)) {
    return (
      <div className={styles.dataTableWrapper}>
        {showSearch && (
          <div className={styles.toolbar}>
            <SearchBar
              value={query}
              onChange={updateGlobalSearch}
              placeholder={searchPlaceholder ?? tCommon('search')}
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

  // 4) Table content with optional loading overlay and partial loading
  return (
    <div className={styles.dataTableWrapper}>
      {showSearch && (
        <div className={styles.toolbar}>
          <SearchBar
            value={query}
            onChange={updateGlobalSearch}
            placeholder={searchPlaceholder ?? tCommon('search')}
          />
        </div>
      )}

      {/* Loading overlay for refetch state */}
      {loading && loadingOverlay && (
        <TableLoader
          columns={columns}
          rows={Math.min(skeletonRows, 3)}
          asOverlay
          ariaLabel={tCommon('loading')}
        />
      )}

      <Table
        striped
        hover
        responsive
        className={tableClassNames}
        data-testid="datatable"
        aria-busy={loading && loadingOverlay}
      >
        {ariaLabel && (
          <caption className={styles.visuallyHidden}>{ariaLabel}</caption>
        )}
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.id} scope="col">
                {renderHeader(col.header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {renderRow
            ? paginatedData.map((row, idx) => (
                <React.Fragment key={getKey(row, idx)}>
                  {renderRow(row, idx)}
                </React.Fragment>
              ))
            : paginatedData.map((row, idx) => (
                <tr
                  key={getKey(row, idx)}
                  data-testid={`datatable-row-${getKey(row, idx)}`}
                >
                  {columns.map((col) => {
                    const val = getCellValue(row, col.accessor);
                    return (
                      <td key={col.id} data-testid={`datatable-cell-${col.id}`}>
                        {col.render
                          ? col.render(val, row)
                          : renderCellValue(val)}
                      </td>
                    );
                  })}
                </tr>
              ))}

          {/* Partial loading: append skeleton rows for fetchMore */}
          {loadingMore &&
            Array.from({ length: skeletonRows }).map((_, rowIdx) => (
              <tr
                key={`skeleton-append-${rowIdx}`}
                data-testid={`skeleton-append-${rowIdx}`}
              >
                {columns.map((col) => (
                  <td key={col.id}>
                    <div
                      className={styles.dataSkeletonCell}
                      data-testid="data-skeleton-cell"
                      aria-hidden="true"
                    />
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </Table>

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
