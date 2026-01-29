import React from 'react';
import styles from './BulkActionsBar.module.css';
import type { InterfaceBulkActionsBarProps } from '../../types/shared-components/BulkActionsBar/interface';
import { useTranslation } from 'react-i18next';

// translation-check-keyPrefix: common

/**
 * BulkActionsBar displays a toolbar when rows are selected.
 * Shows the selected count, action buttons, and a clear button.
 *
 * @param count - The number of selected rows.
 * @param children - The action buttons to display.
 * @param onClear - Callback to clear the selection.
 * @returns The rendered toolbar or null if no rows are selected.
 */
export function BulkActionsBar({
  count,
  children,
  onClear,
}: InterfaceBulkActionsBarProps): React.JSX.Element | null {
  const { t } = useTranslation('common');

  if (count <= 0) return null;

  return (
    <section
      className={styles.bulkBar}
      aria-label={t('bulkActions')}
      data-testid="bulk-actions-bar"
    >
      <div className={styles.bulkLeft}>
        <strong>{count}</strong> {t('selected')}
      </div>
      <div className={styles.bulkRight}>
        {children}
        <button
          type="button"
          onClick={onClear}
          className={styles.bulkClear}
          aria-label={t('clearSelection')}
          data-testid="bulk-clear-btn"
        >
          {t('clear')}
        </button>
      </div>
    </section>
  );
}

export default BulkActionsBar;
