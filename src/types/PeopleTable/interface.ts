import type { DataGridProps } from '@mui/x-data-grid';

/**
 * Interface representing the props for the PeopleTable component.
 */
export interface IPeopleTableProps {
  /**
   * The set of rows to be displayed in the table.
   */
  rows: DataGridProps['rows'];

  /**
   * The column definitions for the table.
   */
  columns: DataGridProps['columns'];

  /**
   * If true, the table shows a loading overlay.
   */
  loading: DataGridProps['loading'];

  /**
   * The total number of rows, used for server-side pagination.
   */
  rowCount: DataGridProps['rowCount'];

  /**
   * The current pagination state (page and pageSize).
   */
  paginationModel: DataGridProps['paginationModel'];

  /**
   * Callback fired when the pagination model changes.
   */
  onPaginationModelChange: DataGridProps['onPaginationModelChange'];

  /**
   * The options for the page size selector.
   * @default [5, 10, 20]
   */
  pageSizeOptions?: DataGridProps['pageSizeOptions'];

  /**
   * Overridable components (slots) for the DataGrid.
   */
  slots?: DataGridProps['slots'];

  /**
   * Function to return the unique identifier for a row.
   */
  getRowId?: DataGridProps['getRowId'];

  /**
   * Additional metadata for pagination, such as hasNextPage flag.
   */
  paginationMeta?: {
    hasNextPage?: boolean;
  };
}
