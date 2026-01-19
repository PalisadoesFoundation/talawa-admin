import React from 'react';
import styles from './DataTable.module.css';
import type { InterfaceBulkActionsBarProps } from '../../types/shared-components/DataTable/interface';
import { useTranslation } from 'react-i18next';

/**
 * BulkActionsBar displays a toolbar when rows are selected.
 * Shows the selected count, action buttons, and a clear button.
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
