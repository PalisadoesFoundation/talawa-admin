import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ITableLoaderProps } from '../../types/shared-components/DataTable/interface';
import styles from 'style/app-fixed.module.css';

/**
 * TableLoader renders skeleton loading rows that match the table structure.
 * Used for displaying loading states with proper accessibility.
 *
 * @typeParam T - The type of data for each row (used for type-safe column definitions)
 * @param columns - Column definitions to match skeleton structure
 * @param rows - Number of skeleton rows to render (default: 5)
 * @param asOverlay - Whether to render as an overlay (default: false)
 * @param ariaLabel - Custom aria-label for accessibility (defaults to i18n 'common.loading')
 */
function TableLoaderComponent<T>({
  columns,
  rows = 5,
  asOverlay = false,
  ariaLabel,
}: ITableLoaderProps<T>) {
  const { t } = useTranslation('common');
  const finalAriaLabel = ariaLabel ?? t('loading');
  const safeRowCount = Math.max(1, rows);
  const columnCount = Math.max(1, columns.length);
  const skeletonRows = Array.from({ length: safeRowCount });
  const skeletonCols = Array.from({ length: columnCount });

  const content = (
    <div
      role="status"
      aria-live="polite"
      aria-label={finalAriaLabel}
      data-testid="table-loader-grid"
    >
      {skeletonRows.map((_, rowIdx) => (
        <div
          key={`skeleton-row-${rowIdx}`}
          data-testid={`skeleton-row-${rowIdx}`}
        >
          {skeletonCols.map((_, colIdx) => (
            <div
              key={`skeleton-cell-${rowIdx}-${colIdx}`}
              className={styles.dataSkeletonCell}
              data-testid="table-loader-cell"
              aria-hidden="true"
            />
          ))}
        </div>
      ))}
    </div>
  );

  if (!asOverlay) return content;

  return (
    <div
      className={styles.dataLoadingOverlay}
      data-testid="table-loader-overlay"
    >
      {content}
    </div>
  );
}

const TableLoaderMemo = React.memo(TableLoaderComponent);
TableLoaderMemo.displayName = 'TableLoader';

export const TableLoader = TableLoaderMemo as <T>(
  props: ITableLoaderProps<T>,
) => React.ReactElement;

export default TableLoader;
