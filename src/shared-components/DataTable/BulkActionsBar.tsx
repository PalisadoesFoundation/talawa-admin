import React from 'react';
import styles from './DataTable.module.css';
import type { InterfaceBulkActionsBarProps } from '../../types/shared-components/DataTable/interface';

/**
 * BulkActionsBar displays a toolbar when rows are selected.
 * Shows the selected count, action buttons, and a clear button.
 */
export function BulkActionsBar({
  count,
  children,
  onClear,
}: InterfaceBulkActionsBarProps): React.JSX.Element | null {
  if (count <= 0) return null;

  return (
    <div
      className={styles.bulkBar}
      role="region"
      aria-label="Bulk actions"
      data-testid="bulk-actions-bar"
    >
      <div className={styles.bulkLeft}>
        <strong>{count}</strong> selected
      </div>
      <div className={styles.bulkRight}>
        {children}
        <button
          type="button"
          onClick={onClear}
          className={styles.bulkClear}
          aria-label="Clear selection"
          data-testid="bulk-clear-btn"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default BulkActionsBar;
