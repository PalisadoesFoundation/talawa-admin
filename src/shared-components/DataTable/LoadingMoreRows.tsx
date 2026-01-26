/**
 * LoadingMoreRows component for rendering skeleton rows appended to a table.
 *
 * Renders table rows containing skeleton cells that match the table layout,
 * used in infinite scroll or "load more" pagination scenarios to display
 * a loading state while fetching additional rows from the server or client.
 *
 * @typeParam T - The type of data for each row (used for column definitions)
 */

import React from 'react';
import type { InterfaceLoadingMoreRowsProps } from 'types/shared-components/DataTable/interface';
import styles from './LoadingMoreRows.module.css';

/**
 * LoadingMoreRows component that displays skeleton rows appended to a table.
 *
 * Renders placeholder rows with skeleton cells to indicate data is being loaded,
 * matching the table structure with optional selection checkboxes and actions columns.
 * Useful for infinite scroll or "load more" pagination patterns.
 *
 * @param props - The component props (`InterfaceLoadingMoreRowsProps<T>`):
 *   - columns: Column definitions determining structure
 *   - effectiveSelectable: Whether to show selection checkbox column
 *   - hasRowActions: Whether to show actions column
 *   - skeletonRows: Number of skeleton rows to display
 * @returns A fragment containing skeleton table rows
 */
export function LoadingMoreRows<T>({
  columns,
  effectiveSelectable,
  hasRowActions,
  skeletonRows = 5,
}: InterfaceLoadingMoreRowsProps<T>) {
  return (
    <>
      {Array.from({ length: skeletonRows }).map((_, rowIdx) => (
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
    </>
  );
}

export default LoadingMoreRows;
