import type {
  GridColDef,
  GridRowsProp,
  GridValidRowModel,
} from '@mui/x-data-grid';
import type { InterfaceEmptyStateProps } from '../shared-components/EmptyState/interface';
/**
 * Props for the DataGridWrapper component.
 *
 * This interface defines the configuration for the `DataGridWrapper`, a standardized wrapper around
 * MUI's DataGrid that provides consistent search, sorting, pagination, and styling across the application.
 */
export interface InterfaceDataGridWrapperProps<
  T extends GridValidRowModel = GridValidRowModel,
> {
  /**
   * The array of data rows to display in the grid.
   * Each row must include a unique `id` property (string or number).
   */
  rows?: GridRowsProp<T>;

  /**
   * Configuration for the grid columns.
   * Defines headers, widths, and cell rendering logic.
   */
  columns?: GridColDef[];

  /**
   * If `true`, displays a loading indicator (e.g., Progress Bar) overlaying the grid.
   */
  loading?: boolean;

  /**
   * Configuration for client-side search functionality.
   *
   * @example
   * ```ts
   * searchConfig: {
   *   enabled: true,
   *   fields: ['name', 'email'],
   *   placeholder: 'Search users...',
   * }
   * ```
   */
  searchConfig?: {
    /** Enables the search bar in the toolbar. */
    enabled: boolean;
    /** The fields (keys of T) to include in the search filter. */
    fields: Array<keyof T & string>;
    /** Custom placeholder text for the search input. */
    placeholder?: string;
    /** Delay in milliseconds for search debounce (if implemented). */
    debounceMs?: number;
    /** Custom test ID for the search input element. */
    searchInputTestId?: string;
  };

  /**
   * Configuration for sorting options displayed in a dropdown.
   * Note: This is separate from MUI DataGrid's native column header sorting.
   */
  sortConfig?: {
    defaultSortField?: string;
    defaultSortOrder?: 'asc' | 'desc';
    /** Array of sorting options for the SortingButton component. */
    sortingOptions?: { label: string; value: string | number }[];
    /**
     * Custom sorting function to apply when a sort option is selected.
     * If provided, this function will be used instead of MUI DataGrid's default sorting.
     * The sort value is passed as a string in the format "field_direction" (e.g., "volunteers_asc").
     */
    sortFunction?: (
      rows: readonly T[],
      sortValue: string | number,
    ) => readonly T[];
  };

  /**
   * Configuration for filtering options displayed in a dropdown.
   * Enables client-side filtering with custom filter functions.
   *
   * @example
   * ```ts
   * filterConfig: {
   *   filterOptions: [
   *     { label: 'All', value: 'all' },
   *     { label: 'Active', value: 'active' },
   *     { label: 'Inactive', value: 'inactive' }
   *   ],
   *   filterFunction: (rows, filterValue) => {
   *     if (filterValue === 'all') return rows;
   *     return rows.filter(row => row.status === filterValue);
   *   }
   * }
   * ```
   */
  filterConfig?: {
    /** Array of filter options for the filter dropdown. */
    filterOptions?: { label: string; value: string | number }[];
    /** Custom filter function to apply to rows based on selected filter value. */
    filterFunction?: (
      rows: readonly T[],
      filterValue: string | number,
    ) => readonly T[];
    /** Default filter value to apply on component mount. */
    defaultFilter?: string | number;
  };

  /**
   * Configuration for pagination.
   */
  paginationConfig?: {
    /** Enables pagination controls. */
    enabled: boolean;
    /** The default number of rows per page. */
    defaultPageSize?: number;
    /** Available options for rows per page. default: [10, 25, 50, 100] */
    pageSizeOptions?: number[];
  };

  /**
   * Callback fired when a row is clicked.
   * @param row - The data object of the clicked row.
   */
  onRowClick?: (row: T) => void;

  /**
   * A function to render custom content in the "Actions" column (appended to the right).
   * @param row - The data object for the row being rendered.
   * @returns A ReactNode (e.g., buttons, menu) to display in the actions cell.
   */
  actionColumn?: (row: T) => React.ReactNode;

  /**
   * Full EmptyState component props for flexible empty state rendering.
   * Takes precedence over `emptyStateMessage`.
   * Allows customization of icon, description, action buttons, and more.
   *
   * @example
   * ```tsx
   * emptyStateProps={{
   *   icon: "users",
   *   message: "noUsers",
   *   description: "inviteFirstUser",
   *   action: {
   *     label: "inviteUser",
   *     onClick: handleInvite,
   *     variant: "primary"
   *   },
   *   dataTestId: "users-empty-state"
   * }}
   * ```
   */
  emptyStateProps?: InterfaceEmptyStateProps;

  /**
   * Custom message to display when there are no rows and `loading` is false.
   * @deprecated Use `emptyStateProps` instead for full customization.
   * @remarks
   * If `emptyStateProps` is provided, this prop is ignored.
   * This property is maintained for backward compatibility.
   */
  emptyStateMessage?: string;

  /**
   * Error message or component to display instead of the grid when data fetch fails.
   */
  error?: string | React.ReactNode;

  /**
   * Optional custom button or element to display in the toolbar (typically for actions like "Create New").
   * @example
   * ```tsx
   * headerButton={
   *   <Button onClick={handleCreate}>
   *     Create New
   *   </Button>
   * }
   * ```
   */
  headerButton?: React.ReactNode;
}
