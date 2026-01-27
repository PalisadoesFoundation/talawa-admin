import React from 'react';
import type { IColumnDef } from '../../types/shared-components/DataTable/interface';
import styles from './DataTable.module.css';

/**
 * LoadingMoreRows renders skeleton rows appended to the table when loadingMore is true.
 * These rows match the table structure including selection and action columns.
 *
 * @typeParam T - The type of data for each row (used for type-safe column definitions)
 * @param columns - Column definitions to match skeleton structure
 * @param skeletonRows - Number of skeleton rows to render (default: 5)
 * @param effectiveSelectable - Whether selection column should be rendered
 * @param hasRowActions - Whether actions column should be rendered
 */
export function LoadingMoreRows<T>({
  columns,
  skeletonRows = 5,
  effectiveSelectable = false,
  hasRowActions = false,
}: {
  columns: IColumnDef<T>[];
  skeletonRows?: number;
  effectiveSelectable?: boolean;
  hasRowActions?: boolean;
}) {
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
