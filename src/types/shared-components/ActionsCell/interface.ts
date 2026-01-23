import type { IRowAction } from '../DataTable/interface';

/**
 * Props for the ActionsCell component.
 *
 * Used to render per-row action buttons in a DataTable.
 * @typeParam T - The type of the row data
 */
export interface InterfaceActionsCellProps<T> {
  /** The row data object */
  row: T;
  /** Array of action definitions */
  actions: ReadonlyArray<IRowAction<T>>;
}
