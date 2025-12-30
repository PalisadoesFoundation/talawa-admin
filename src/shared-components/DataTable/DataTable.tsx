import React from 'react';
import Table from 'react-bootstrap/Table';
import type {
  IDataTableProps,
  IColumnDef,
  HeaderRender,
} from '../../types/shared-components/DataTable/interface';
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
  } = props;

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
      <div className={styles.dataTableWrapper}>
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
  if (!data || data.length === 0) {
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
          {data.map((row, idx) => (
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
    </div>
  );
}

export default DataTable;
