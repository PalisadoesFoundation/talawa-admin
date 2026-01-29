import type { ReactNode } from 'react';
import type React from 'react';
import type { QueryResult } from '@apollo/client';
import type { IColumnDef } from './column';
import type { SortDirection, ISortState, Key, ISortChangeEvent } from './types';
import type { InterfacePageInfo } from './pagination';
import type { IRowAction, IBulkAction } from './hooks';

/**
 * Base props for DataTable component configuration.
 *
 * Provides core table configuration including column definitions, row data,
 * sizing, and sorting behavior. Extended by InterfaceDataTableProps for full functionality.
 *
 * @typeParam T - The type of data for each row in the table
 */
export interface InterfaceBaseDataTableProps<T> {
  /** Array of column definitions specifying how to render each column */
  columns: Array<IColumnDef<T, unknown>>;
  /** Array of row data to display in the table */
  rows?: T[];
  /** Set of row keys to display; if provided, only these rows are shown */
  keysToShowRows?: ReadonlySet<Key>;
  /** Key or property name or function to extract unique identifier for each row */
  rowKey?: keyof T | ((row: T) => Key);
  /** Whether columns are sortable (default: true) */
  sortable?: boolean;
  /** Current sort state specifying column and direction */
  sortState?: ISortState;
  /** Callback fired when sort state changes */
  onSortChange?: (event: ISortChangeEvent<T>) => void;
}

/**
 * Props for table loading states and error/empty conditions.
 *
 * Provides UI customization and state management for loading indicators,
 * error messages, and empty state displays.
 *
 * @typeParam T - The type of data for each row in the table
 */
export interface InterfaceTableLoaderProps<T> {
  /** Array of column definitions to match table structure */
  columns: Array<IColumnDef<T, unknown>>;
  /** Number of skeleton rows to display */
  rows?: number;
  /** Whether to render as an overlay */
  asOverlay?: boolean;
  /** ARIA label for the loading state */
  ariaLabel?: string;
  /** Whether the table is loading initial data */
  loading?: boolean;
  /** Whether additional data is currently loading */
  loadingMore?: boolean;
  /** Error from the last data fetch operation */
  error?: Error | null;
  /** Custom React component to display when an error occurs */
  errorComponent?: ReactNode;
  /** Custom React component to display when no rows are present */
  emptyComponent?: ReactNode;
}

/**
 * Props for a searchable input/search bar component.
 *
 * Configures search input behavior including value synchronization,
 * change callbacks, debouncing, and accessibility attributes.
 */
export interface InterfaceSearchBarProps {
  /** Current search input value */
  value?: string;
  /** Callback fired when search value changes */
  onChange: (q: string) => void;
  /** Callback fired when search is cleared */
  onClear?: () => void;
  /** Placeholder text to display in the search input */
  placeholder?: string;
  /** ARIA label for the search input */
  'aria-label'?: string;
  /** ARIA label for the clear button */
  'clear-aria-label'?: string;
  /** ARIA accessibility attributes for the search input */
  aria?: {
    /** ARIA label for the search input */
    label?: string;
    /** ARIA labelledBy for linking to external labels */
    labelledBy?: string;
  };
  /** Milliseconds to debounce search input changes */
  debounceDelay?: number;
}

/**
 * Complete props for the DataTable component.
 *
 * Extends base configuration with pagination, filtering, searching, selection,
 * and bulk actions. Supports both client-side and server-side data handling.
 *
 * @typeParam T - The type of data for each row in the table
 */
export type InterfaceDataTableProps<T> = {
  /** Array of column definitions specifying how to render each column */
  columns: Array<IColumnDef<T, unknown>>;
  /** Array of row data to display in the table */
  rows?: T[];
  /** Set of row keys to display; if provided, only these rows are shown */
  keysToShowRows?: ReadonlySet<Key>;
  /** Bootstrap size variant: 'sm' for small or 'lg' for large */
  size?: 'sm' | 'lg';
  /** Whether to hide the header row */
  noHeader?: boolean;
  /** Key or property name or function to extract unique identifier for each row */
  rowKey?: keyof T | ((row: T) => Key);
  /** CSS class to apply to the table element */
  className?: string;
  /** Whether to apply striped styling to rows */
  striped?: boolean;
  /** Whether columns are sortable (default: true) */
  sortable?: boolean;
  /** Current sort state specifying column and direction */
  sortState?: ISortState;
  /** Callback fired when sort state changes */
  onSortChange?: (event: ISortChangeEvent<T>) => void;
  /** For backward compatibility: use rows instead */
  data: T[];
  /** Whether the table is loading initial data */
  loading?: boolean;
  /** Whether additional data is currently loading */
  loadingMore?: boolean;
  /** Error from the last data fetch operation */
  error?: Error | null;
  /** Custom function to render each row */
  renderRow?: (row: T, index: number) => ReactNode;
  /** Message to display when table is empty */
  emptyMessage?: string;
  /** Custom function to render error state */
  renderError?: (error: Error) => ReactNode;
  /** ARIA label for the table element */
  ariaLabel?: string;
  /** Whether sorting is handled server-side */
  serverSort?: boolean;
  /** Number of skeleton rows to show during loading */
  skeletonRows?: number;
  /** Whether to show a loading overlay during pagination */
  loadingOverlay?: boolean;
  /** Current sort state as array (controlled sorting) */
  sortBy?: ISortState[];
  /** Initial sort property */
  initialSortBy?: string;
  initialSortDirection?: SortDirection;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Whether to show search bar */
  showSearch?: boolean;
  /** Initial global search value */
  initialGlobalSearch?: string;
  globalSearch?: string;
  onGlobalSearchChange?: (q: string) => void;
  columnFilter?: Record<string, unknown>;
  columnFilters?: Record<string, unknown>;
  onColumnFilterChange?: (filters: Record<string, unknown>) => void;
  onColumnFiltersChange?: (filters: Record<string, unknown>) => void;
  searchBarProps?: Omit<InterfaceSearchBarProps, 'value' | 'onChange'>;
  paginationMode?: 'client' | 'server' | 'none';
  pageSize?: number;
  page?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  totalItems?: number;
  pageInfo?: InterfacePageInfo | null;
  onLoadMore?: () => void;
  serverSearch?: boolean;
  serverFilter?: boolean;
  selectable?: boolean;
  selectedKeys?: ReadonlySet<Key>;
  selectedRows?: ReadonlySet<Key>;
  onSelectionChange?: (next: ReadonlySet<Key>) => void;
  onSelectedRowsChange?: (next: ReadonlySet<Key>) => void;
  initialSelectedKeys?: ReadonlySet<Key>;
  rowActions?: ReadonlyArray<IRowAction<T>>;
  bulkActions?: ReadonlyArray<IBulkAction<T>>;
  actionableRows?: ReadonlySet<Key>;
  showViewMoreButton?: boolean;
  refetch?: QueryResult<unknown>['refetch'];
  disableSort?: boolean;
  tableBodyClassName?: string;
  tableClassName?: string;
};

/**
 * Props for the DataTableTable component that renders table rows.
 *
 * Provides data and configuration for rendering paginated table content,
 * including row selection, actions, and custom empty states.
 *
 * @typeParam T - The type of data for each row in the table
 */
export interface InterfaceDataTableTableProps<T> {
  /** Array of column definitions specifying how to render each column */
  columns: Array<IColumnDef<T, unknown>>;
  /** Set of row keys to display; if provided, only these rows are shown */
  keysToShowRows?: ReadonlySet<Key>;
  /** Whether columns are sortable (default: true) */
  sortable?: boolean;
  /** Current sort state specifying column and direction */
  sortState?: ISortState;
  /** ARIA label for the table element */
  ariaLabel?: string;
  /** ARIA busy state for the table */
  ariaBusy?: boolean;
  /** CSS classes to apply to the table */
  tableClassNames?: string;
  /** Whether selection is enabled */
  effectiveSelectable?: boolean;
  /** Whether row actions are present */
  hasRowActions?: boolean;
  /** Ref to the header checkbox for select all */
  headerCheckboxRef?: React.RefObject<HTMLInputElement | null>;
  /** Whether some rows on page are selected */
  someSelectedOnPage?: boolean;
  /** Whether all rows on page are selected */
  allSelectedOnPage?: boolean;
  /** Callback to select/deselect all rows on page */
  selectAllOnPage: (checked: boolean) => void;
  /** ID of the currently sorted column */
  activeSortBy?: string;
  /** Current sort direction */
  activeSortDir?: SortDirection;
  /** Callback when header is clicked for sorting */
  handleHeaderClick: (col: IColumnDef<T, unknown>) => void;
  /** Array of sorted rows to display */
  sortedRows: readonly T[];
  /** Starting index for row numbering */
  startIndex: number;
  /** Function to get unique key for a row */
  getKey: (row: T, idx: number) => string | number;
  /** Current selection state */
  currentSelection: ReadonlySet<Key>;
  /** Callback to toggle row selection */
  toggleRowSelection: (key: Key) => void;
  /** Translation function for common strings */
  tCommon: (key: string, options?: Record<string, unknown>) => string;
  /** Custom function to render each row */
  renderRow?: (row: T, index: number) => ReactNode;
  /** Array of effective row actions */
  effectiveRowActions: ReadonlyArray<IRowAction<T>>;
  /** Whether more rows are loading */
  loadingMore?: boolean;
  /** Number of skeleton rows to show */
  skeletonRows?: number;
}

/**
 * Props for the DataTableSkeleton loading placeholder component.
 *
 * Configures a skeleton table that animates while data is loading,
 * providing visual feedback of expected table structure.
 *
 * @typeParam T - The type of data for each row in the table
 */
export interface InterfaceDataTableSkeletonProps<T> {
  /** ARIA label for the skeleton table */
  ariaLabel?: string;
  /** Array of column definitions to match skeleton structure */
  columns: Array<IColumnDef<T, unknown>>;
  /** Whether to show selection checkbox column */
  effectiveSelectable?: boolean;
  /** Whether to show actions column */
  hasRowActions?: boolean;
  /** Number of skeleton rows to display */
  skeletonRows: number;
  /** CSS class names for the table */
  tableClassNames?: string;
}

/**
 * Props for the LoadingMoreRows component.
 *
 * Manages UI state when loading additional pages in infinite-scroll scenarios,
 * including error recovery with retry capability.
 *
 * @typeParam T - The type of data for each row in the table
 */
export interface InterfaceLoadingMoreRowsProps<T> {
  /** Array of column definitions to match row structure */
  columns: Array<IColumnDef<T, unknown>>;
  /** Whether to show selection checkbox column */
  effectiveSelectable?: boolean;
  /** Whether to show actions column */
  hasRowActions?: boolean;
  /** Number of skeleton rows to display */
  skeletonRows?: number;
  /** Number of columns in the table (for colspan) */
  columnsCount?: number;
  /** Whether more rows are currently loading */
  loading?: boolean;
  /** Error from the most recent load attempt */
  error?: Error | null;
  /** Callback to retry loading after an error */
  retry?: () => void;
}
