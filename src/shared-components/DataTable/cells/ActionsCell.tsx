import React from 'react';
import type { InterfaceActionsCellProps } from '../../../types/shared-components/ActionsCell/interface';
import styles from './ActionsCell.module.css';
import Button from 'shared-components/Button';

/**
 * ActionsCell renders a row of action buttons for a single table row.
 *
 * @typeParam T - The type of the row data
 * @param props - Props containing row data and action definitions
 * @returns The rendered actions cell element
 */
export function ActionsCell<T>(
  props: InterfaceActionsCellProps<T>,
): React.JSX.Element {
  const { row, actions } = props;
  return (
    <div className={styles.actionsCellContainer} data-testid="actions-cell">
      {actions.map((action) => {
        const isDisabled =
          typeof action.disabled === 'function'
            ? action.disabled(row)
            : !!action.disabled;

        return (
          <Button
            key={action.id}
            type="button"
            onClick={() => action.onClick(row)}
            disabled={isDisabled}
            aria-label={action.ariaLabel ?? action.label}
            className={styles.actionBtn}
            data-testid={`action-btn-${action.id}`}
          >
            {action.label}
          </Button>
        );
      })}
    </div>
  );
}
