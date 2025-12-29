import React from 'react';
import Table from 'react-bootstrap/Table';
import type { IDataTableProps, IColumnDef, HeaderRender } from './types';
import styles from 'style/app-fixed.module.css';
import TableLoader from '../../components/TableLoader/TableLoader';
import { useTranslation } from 'react-i18next';

function getCellValue<T>(row: T, accessor: IColumnDef<T>['accessor']) {
  return typeof accessor === 'function'
    ? accessor(row)
    : row[accessor as keyof T];
}
function renderHeader(header: HeaderRender) {
  return typeof header === 'function' ? header() : header;
}

// Default number of skeleton rows for loading state
const DEFAULT_TABLE_SKELETON_ROWS = 6;

/**
 * DataTable is a generic, type-safe table component for rendering tabular data with flexible columns, loading, and error states.
 *
 * @template T - The type of each row in the data array.
 * @param {IDataTableProps<T>} props - The props for the DataTable component.
 *   - columns: Array of column definitions (id, header, accessor, optional render).
 *   - data: Array of data rows of type T.
 *   - loading: If true, shows a loading skeleton.
 *   - rowKey: Property name or function to uniquely identify each row.
 *   - emptyMessage: Message to display when data is empty.
 *   - error: Error object to display error state.
 *   - renderError: Optional function to customize error rendering.
 * @returns {JSX.Element} The rendered table, loading, empty, or error state.
 */
export function DataTable<T>(props: IDataTableProps<T>) {
  // Query-specific empty states will be handled in a future phase.
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
    skeletonRows,
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

  if (error)
    return (
      <div className={styles.dataErrorState}>
        {renderError ? renderError(error) : error.message}
      </div>
    );
  if (loading) {
    // Use column headers as headerTitles, and data length or default for rows
    const headerTitles = columns.map((col: IColumnDef<T>) =>
      typeof col.header === 'function'
        ? String(col.header())
        : String(col.header),
    );
    const noOfRows = skeletonRows ?? DEFAULT_TABLE_SKELETON_ROWS;
    return <TableLoader headerTitles={headerTitles} noOfRows={noOfRows} />;
  }
  if (!data?.length)
    return <div className={styles.dataEmptyState}>{emptyMessage}</div>;

  return (
    <Table striped hover responsive className={styles.dataTableBase}>
      {/*
        The caption provides an accessible table label for screen readers, improving navigation for users with assistive technology.
        It is visually hidden using the .visuallyHidden class from app-fixed.module.css for consistency with other UI elements.
      */}
      {ariaLabel && (
        <caption className={styles.visuallyHidden}>{ariaLabel}</caption>
      )}
      <thead>
        <tr>
          {/* Render table headers */}
          {columns.map((col: IColumnDef<T>) => (
            <th key={col.id} scope="col">
              {renderHeader(col.header)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {/* Render table data */}
        {data.map((row: T, idx: number) => (
          <tr key={getKey(row, idx)}>
            {columns.map((col: IColumnDef<T>) => {
              const val = getCellValue(row, col.accessor);
              return (
                <td key={col.id}>
                  {col.render ? col.render(val, row) : String(val ?? '')}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default DataTable;
