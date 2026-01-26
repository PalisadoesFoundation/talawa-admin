/**
 * DataTableSkeleton component for displaying a loading skeleton table.
 *
 * Renders a table structure with skeleton cells that match the table layout,
 * providing a visual placeholder while data is loading.
 *
 * @typeParam T - The type of data for each row (used for column definitions)
 */

import React from 'react';
import Table from 'react-bootstrap/Table';
import type { InterfaceDataTableSkeletonProps } from 'types/shared-components/DataTable/interface';
import { renderHeader } from './utils';
import styles from './DataTableSkeleton.module.css';

/**
 * DataTableSkeleton component that displays a loading skeleton matching the table layout.
 *
 * Renders a responsive table structure with skeleton cells for each column and row,
 * including optional selection checkbox and actions columns. The skeleton respects
 * the column definitions to ensure consistent layout during data loading.
 *
 * @param props - The component props (`InterfaceDataTableSkeletonProps<T>`):
 *   - ariaLabel: Optional accessible label
 *   - columns: Column definitions determining structure
 *   - effectiveSelectable: Whether to show selection checkbox
 *   - hasRowActions: Whether to show actions column
 *   - skeletonRows: Number of skeleton rows to display
 *   - tableClassNames: CSS class names for the table
 * @returns The rendered skeleton table component
 */
export function DataTableSkeleton<T>({
  ariaLabel,
  columns,
  effectiveSelectable,
  hasRowActions,
  skeletonRows,
  tableClassNames,
}: InterfaceDataTableSkeletonProps<T>) {
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
            {effectiveSelectable && (
              <th scope="col" className={styles.selectCol}>
                <div className={styles.dataSkeletonCell} aria-hidden="true" />
              </th>
            )}
            {columns.map((col) => (
              <th key={col.id} scope="col">
                {renderHeader(col.header)}
              </th>
            ))}
            {hasRowActions && (
              <th scope="col" className={styles.actionsCol}>
                <div className={styles.dataSkeletonCell} aria-hidden="true" />
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: skeletonRows }).map((_, rowIdx) => (
            <tr
              key={`skeleton-row-${rowIdx}`}
              data-testid={`skeleton-row-${rowIdx}`}
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
    </div>
  );
}

export default DataTableSkeleton;
