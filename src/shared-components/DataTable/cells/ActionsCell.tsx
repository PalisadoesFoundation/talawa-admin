import React from 'react';
import type { IRowAction } from '../../../types/shared-components/DataTable/interface';
import styles from '../DataTable.module.css';

/**
 * ActionsCell renders a row of action buttons for a single table row.
 *
 * @typeParam T - The type of the row data
 * @param row - The row data object
 * @param actions - Array of action definitions
 */
export function ActionsCell<T>({
  row,
  actions,
}: {
  row: T;
  actions: ReadonlyArray<IRowAction<T>>;
}): React.JSX.Element {
  return (
    <div className={styles.actionsCellContainer} data-testid="actions-cell">
      {actions.map((action) => {
        const isDisabled =
          typeof action.disabled === 'function'
            ? action.disabled(row)
            : !!action.disabled;

        return (
          <button
            key={action.id}
            type="button"
            onClick={() => action.onClick(row)}
            disabled={isDisabled}
            aria-label={action.ariaLabel ?? action.label}
            className={styles.actionBtn}
            data-testid={`action-btn-${action.id}`}
          >
            {action.label}
          </button>
        );
      })}
    </div>
  );
}

export default ActionsCell;
