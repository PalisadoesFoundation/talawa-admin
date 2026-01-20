import React from 'react';
import Table from 'react-bootstrap/Table';
import type { IDataTableProps } from '../../types/shared-components/DataTable/interface';
import { PaginationControls } from './Pagination';
import { SearchBar } from './SearchBar';
import { TableLoader } from './TableLoader';
import { ActionsCell } from './cells/ActionsCell';
import { BulkActionsBar } from './BulkActionsBar';
import styles from './DataTable.module.css';
import { useTranslation } from 'react-i18next';
import { renderHeader, renderCellValue, getCellValue } from './utils';
import { useDataTableFiltering } from './hooks/useDataTableFiltering';
import { useDataTableSelection } from './hooks/useDataTableSelection';

// translation-check-keyPrefix: common

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
    // Selection & Actions
    selectable = false,
    selectedKeys,
    onSelectionChange,
    initialSelectedKeys,
    rowActions = [],
    bulkActions = [],
  } = props;

  // Pagination state (controlled or uncontrolled)
  const [internalPage, setInternalPage] = React.useState(1);
  const isControlled = currentPage !== undefined && onPageChange !== undefined;
  const page = isControlled ? currentPage : internalPage;

  const handlePageReset = React.useCallback(() => {
    if (!isControlled) setInternalPage(1);
  }, [isControlled]);

  // Filtering & Search Logic (Extracted to hook)
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
  const showPaginationControls =
    paginationMode === 'client' ||
    (paginationMode === 'server' && pageInfo !== undefined);

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
        const rowAsAny = row as any;
        const idValue = rowAsAny.id ?? rowAsAny._id;
        if (typeof idValue === 'string' || typeof idValue === 'number') {
          return idValue;
        }
        return idx;
      }
    },
    [rowKey],
  );

  const keysOnPage = React.useMemo(
    () => paginatedData.map((r, i) => getKey(r, startIndex + i)),
    [paginatedData, getKey, startIndex],
  );

  // Selection & Selection-based Actions Logic (Extracted to hook)
  const {
    currentSelection,
    selectedCountOnPage,
    allSelectedOnPage,
    someSelectedOnPage,
    toggleRowSelection,
    selectAllOnPage,
    clearSelection,
    runBulkAction,
  } = useDataTableSelection({
    paginatedData,
    keysOnPage,
    selectable,
    selectedKeys,
    onSelectionChange,
    initialSelectedKeys,
    bulkActions,
  });

  // Header checkbox ref for indeterminate state
  const headerCheckboxRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = someSelectedOnPage;
    }
  }, [someSelectedOnPage]);

  // When renderRow is provided, disable selection/actions to prevent column count mismatch
  const effectiveSelectable = renderRow ? false : selectable;
  const effectiveRowActions = renderRow ? [] : rowActions;

  // Warn in development if renderRow is used with selection/actions
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && renderRow) {
      if (selectable) {
        console.warn(
          'DataTable: `selectable` is ignored when `renderRow` is provided. ' +
            'Custom row renderers must handle selection UI manually.',
        );
      }
      if (rowActions && rowActions.length > 0) {
        console.warn(
          'DataTable: `rowActions` is ignored when `renderRow` is provided. ' +
            'Custom row renderers must handle action buttons manually.',
        );
      }
    }
  }, [renderRow, selectable, rowActions]);

  const hasRowActions = effectiveRowActions && effectiveRowActions.length > 0;
  const hasBulkActions = bulkActions && bulkActions.length > 0;

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

  // 2) Table with skeleton rows when loading (initial load, no data)
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
            const selectedKeysOnPage = keysOnPage.filter((k) =>
              currentSelection.has(k),
            );
            const selectedRows = paginatedData.filter((_, i) =>
              currentSelection.has(keysOnPage[i]),
            );
            const isDisabled =
              typeof action.disabled === 'function'
                ? action.disabled(selectedRows, selectedKeysOnPage)
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
            {effectiveSelectable && (
              <th scope="col" className={styles.selectCol}>
                <input
                  ref={headerCheckboxRef}
                  type="checkbox"
                  aria-label={tCommon('selectAllOnPage')}
                  aria-checked={
                    someSelectedOnPage ? 'mixed' : allSelectedOnPage
                  }
                  checked={allSelectedOnPage}
                  onChange={(e) => selectAllOnPage(e.currentTarget.checked)}
                  data-testid="select-all-checkbox"
                />
              </th>
            )}
            {columns.map((col) => (
              <th key={col.id} scope="col">
                {renderHeader(col.header)}
              </th>
            ))}
            {hasRowActions && (
              <th scope="col" className={styles.actionsCol}>
                {tCommon('actions')}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {renderRow
            ? paginatedData.map((row, idx) => (
                <React.Fragment key={getKey(row, idx)}>
                  {renderRow(row, idx)}
                </React.Fragment>
              ))
            : paginatedData.map((row, idx) => {
                const rowKeyValue = getKey(row, startIndex + idx);
                const isRowSelected = currentSelection.has(rowKeyValue);
                return (
                  <tr
                    key={rowKeyValue}
                    data-testid={`datatable-row-${rowKeyValue}`}
                    data-selected={isRowSelected}
                  >
                    {effectiveSelectable && (
                      <td className={styles.selectCol}>
                        <input
                          type="checkbox"
                          aria-label={tCommon('selectRow', {
                            rowKey: String(rowKeyValue),
                          })}
                          checked={isRowSelected}
                          onChange={() => toggleRowSelection(rowKeyValue)}
                          data-testid={`select-row-${rowKeyValue}`}
                        />
                      </td>
                    )}
                    {columns.map((col) => {
                      const val = getCellValue(row, col.accessor);
                      return (
                        <td
                          key={col.id}
                          data-testid={`datatable-cell-${col.id}`}
                        >
                          {col.render
                            ? col.render(val, row)
                            : renderCellValue(val)}
                        </td>
                      );
                    })}
                    {hasRowActions && (
                      <td className={styles.actionsCol}>
                        <ActionsCell row={row} actions={effectiveRowActions} />
                      </td>
                    )}
                  </tr>
                );
              })}

          {loadingMore &&
            Array.from({ length: skeletonRows }).map((_, rowIdx) => (
              <tr
                key={`skeleton-append-${rowIdx}`}
                data-testid={`skeleton-append-${rowIdx}`}
              >
                {effectiveSelectable && (
                  <td>
                    <div
                      className={styles.dataSkeletonCell}
                      data-testid="data-skeleton-cell"
                      aria-hidden="true"
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.id}>
                    <div
                      className={styles.dataSkeletonCell}
                      data-testid="data-skeleton-cell"
                      aria-hidden="true"
                    />
                  </td>
                ))}
                {hasRowActions && (
                  <td>
                    <div
                      className={styles.dataSkeletonCell}
                      data-testid="data-skeleton-cell"
                      aria-hidden="true"
                    />
                  </td>
                )}
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
