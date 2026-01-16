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
   * Configuration for search functionality (client-side or server-side).
   *
   * @example
   * ```ts
   * // Client-side search
   * searchConfig: {
   *   enabled: true,
   *   fields: ['name', 'email'],
   *   placeholder: 'Search users...',
   * }
   *
   * // Server-side search with search-by dropdown
   * searchConfig: {
   *   enabled: true,
   *   serverSide: true,
   *   searchTerm: 'john',
   *   searchByOptions: [
   *     { label: 'Group', value: 'group' },
   *     { label: 'Leader', value: 'leader' }
   *   ],
   *   selectedSearchBy: 'group',
   *   onSearchChange: (term, searchBy) => refetchData(term, searchBy),
   *   onSearchByChange: (searchBy) => setSearchBy(searchBy),
   *   searchInputTestId: 'searchByInput'
   * }
   * ```
   */
  searchConfig?: {
    /** Enables the search bar in the toolbar. */
    enabled: boolean;
    /** The fields (keys of T) to include in the search filter. Client-side only. */
    fields?: Array<keyof T & string>;
    /** Custom placeholder text for the search input. */
    placeholder?: string;
    /** Delay in milliseconds for search debounce. */
    debounceMs?: number;
    /** Enable server-side search mode. */
    serverSide?: boolean;
    /** Current search term value for server-side mode. */
    searchTerm?: string;
    /** Search type options dropdown for server-side mode. */
    searchByOptions?: { label: string; value: string }[];
    /** Current selected search type for server-side mode. */
    selectedSearchBy?: string;
    /** Callback when search changes in server-side mode. */
    onSearchChange?: (term: string, searchBy?: string) => void;
    /** Callback when search type changes in server-side mode. */
    onSearchByChange?: (searchBy: string) => void;
    /** Test ID for search input. */
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
    /** Current selected sort option for server-side mode. */
    selectedSort?: string | number;
    /** Callback when sort changes in server-side mode. */
    onSortChange?: (value: string | number) => void;
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
   * Use `emptyStateProps` instead for full customization.
   * If `emptyStateProps` is provided, this prop is ignored.
   * This property is maintained for backward compatibility.
   */
  emptyStateMessage?: string;

  /**
   * Error message or component to display instead of the grid when data fetch fails.
   */
  error?: string | React.ReactNode;
}
