import React from 'react';
import type { IColumnDef } from '../../types/shared-components/DataTable/interface';
import styles from './LoadingMoreRows.module.css';

export interface ILoadingMoreRowsProps<T> {
  columns: Array<IColumnDef<T>>;
  effectiveSelectable: boolean;
  hasRowActions: boolean;
  skeletonRows: number;
}

export function LoadingMoreRows<T>({
  columns,
  effectiveSelectable,
  hasRowActions,
  skeletonRows,
}: ILoadingMoreRowsProps<T>) {
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
