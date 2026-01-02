import React from 'react';
import Table from 'react-bootstrap/Table';
import type {
  IDataTableProps,
  IColumnDef,
  HeaderRender,
} from '../../types/shared-components/DataTable/interface';
import { PaginationControls } from './Pagination';
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
const DEFAULT_SKELETON_ROWS: number = 6;
export function DataTable<T>(props: IDataTableProps<T>) {
  const { t: tCommon } = useTranslation('common');
  const {
    data,
    columns,
    loading,
    rowKey,
    emptyMessage = tCommon('noResultsFound'),
    error,
    renderError,
    ariaLabel,
    skeletonRows = DEFAULT_SKELETON_ROWS,
    // Pagination props
    paginationMode,
    pageSize = 10,
    currentPage,
    onPageChange,
    totalItems,
    pageInfo,
  } = props;

  // Pagination state (controlled or uncontrolled)
  const [internalPage, setInternalPage] = React.useState(1);
  const isControlled = currentPage !== undefined && onPageChange !== undefined;
  const page = isControlled ? currentPage : internalPage;

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
  const startIndex = shouldSliceClientSide ? (page - 1) * pageSize : 0;
  const endIndex = shouldSliceClientSide ? startIndex + pageSize : data.length;
  const paginatedData = shouldSliceClientSide
    ? data.slice(startIndex, endIndex)
    : data;
  const total = totalItems ?? data.length;

  const getKey = (row: T, idx: number): string | number => {
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
  };

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

  // 2) Table with skeleton rows when loading
  if (loading) {
    return (
      <div className={styles.dataTableWrapper} data-testid="datatable-loading">
        <Table
          striped
          hover
          responsive
          className={styles.dataTableBase}
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
              <tr key={`skeleton-row-${rowIdx}`}>
                {columns.map((col) => (
                  <td key={col.id}>
                    <div
                      className={styles.dataSkeletonCell}
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

  // 3) Empty state
  // Query-specific empty states will be handled in a future phase.
  if (!paginatedData || paginatedData.length === 0) {
    return (
      <div
        className={styles.dataEmptyState}
        role="status"
        aria-live="polite"
        data-testid="datatable-empty"
      >
        {emptyMessage}
      </div>
    );
  }

  // 4) Table content
  return (
    <div className={styles.dataTableWrapper}>
      <Table striped hover responsive className={styles.dataTableBase}>
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
          {paginatedData.map((row, idx) => (
            <tr key={getKey(row, idx)}>
              {columns.map((col) => {
                const val = getCellValue(row, col.accessor);
                return (
                  <td key={col.id}>
                    {col.render ? col.render(val, row) : renderCellValue(val)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </Table>

      {showPaginationControls && (
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
