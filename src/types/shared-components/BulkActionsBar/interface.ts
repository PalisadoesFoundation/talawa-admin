import type { ReactNode } from 'react';

/**
 * Props for the BulkActionsBar component.
 *
 * Used to display a toolbar when rows are selected in a DataTable.
 */
export interface InterfaceBulkActionsBarProps {
  /** Number of selected rows */
  count: number;
  /** Bulk action buttons to render */
  children: ReactNode;
  /** Callback to clear selection */
  onClear: () => void;
}
