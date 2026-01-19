import React from 'react';
import type { QueryResult, NetworkStatus } from '@apollo/client';

/**
 * Header can be:
 * - plain text
 * - ReactNode (JSX, fragments, icons, tooltips, etc.)
 * - function returning ReactNode
 */
export type HeaderRender = string | React.ReactNode | (() => React.ReactNode);

/**
 * Accessor can be a key of T or a function returning a derived value
 */
export type Accessor<T, TValue = unknown> = keyof T | ((row: T) => TValue);

/**
 * Generic column definition for DataTable
 *
 * @example
 * ```ts
 * interface User {
 *   id: string;
 *   name: string;
 * }
 *
 * const columns: ColumnDef<User>[] = [
 *   { id: 'name', header: 'Name', accessor: 'name' },
 * ];
 * ```
 */
export interface IColumnDef<T, TValue = unknown> {
  /** Unique column identifier */
  id: string;

  /** Header label or render function */
  header: HeaderRender;

  /** Accessor to extract cell value */
  accessor: Accessor<T, TValue>;

  /** Optional custom cell renderer */
  render?: (value: TValue, row: T) => React.ReactNode;

  /** Optional metadata for future features */
  meta?: {
    // Sorting
    sortable?: boolean;
    sortFn?: (a: T, b: T) => number;

    // Filtering / search
    /**
     * If true, this column participates in local filtering and/or global search.
     * Defaults: filterable=true, searchable=true unless set false.
     */
    filterable?: boolean;
    searchable?: boolean;

    /**
     * Custom filter for this column. Return true to keep the row.
     * value is columnFilters[col.id].
     */
    filterFn?: (row: T, value: unknown) => boolean;

    /**
     * Optional extractor for global search (if the default cell string is not ideal).
     */
    getSearchValue?: (row: T) => string;

    width?: string | number;
    align?: 'left' | 'center' | 'right';
    ariaLabel?: string;
  };
}

/**
 * PageInfo for DataTable component with server-side pagination
 */

export interface IPageInfo {
  /**
   * Indicates if there is a next page available
   */
  hasNextPage: boolean;
  /**
   *  Indicates if there is a previous page available
   */
  hasPreviousPage: boolean;
  /**
   * Cursor for the start of the current page
   */
  startCursor?: string;
  /**
   * Cursor for the end of the current page
   */
  endCursor?: string;
}

/**
 * Type alias for PageInfo (for compatibility with GraphQL conventions)
 */
export type PageInfo = IPageInfo;

/**
 * GraphQL connection helpers used by DataTable hooks
 */
export type Edge<TNode> = { node: TNode | null } | null;
export type Connection<TNode> =
  | {
      edges?: Array<Edge<TNode>> | null;
      pageInfo?: PageInfo | null;
    }
  | null
  | undefined;

/**
 * Selector function type that resolves to a GraphQL-like connection structure.
 */
type ConnectionResolver<TNode, TData> = (data: TData) =>
  | {
      edges?:
        | Array<{ node: TNode | null | undefined } | null | undefined>
        | null
        | undefined;
      pageInfo?: IPageInfo | null | undefined;
    }
  | null
  | undefined;

/**
 * Path type helper for useTableData options.
 * Can be either a selector function or a path array.
 */
type DataPath<TNode, TData> =
  | ConnectionResolver<TNode, TData>
  | (string | number)[];

/**
 * Options for the useTableData hook
 *
 * @typeParam TNode - The GraphQL node type extracted from the connection
 * @typeParam TRow - The transformed row type after optional transformation
 * @typeParam TData - The complete query result data type
 */
export interface IUseTableDataOptions<TNode, TRow, TData = unknown> {
  /**
   * Path to the GraphQL connection within the query result.
   *
   * Can be specified as either:
   * 1. **String/number array path**: For deep property traversal with support for both object keys and array indices.
   *    - String segments: Navigate object properties (e.g., 'users', 'organization')
   *    - Numeric segments: Navigate array elements by index (e.g., 0, 5, 100)
   *
   * 2. **Selector function**: For custom traversal logic with optional chaining and computed paths.
   *
   * @example String/number array path with mixed navigation:
   * ```tsx
   * // Traverse into nested structure with array indexing
   * path: ['data', 'organizations', 0, 'members', 'edges']
   *
   * // Equivalent to: data.organizations[0].members.edges
   * // Where organizations[0] accesses the first organization in an array
   * ```
   *
   * @example Array-based path with pure array indexing:
   * ```tsx
   * // Navigate through arrays of items
   * path: ['results', 2, 'connection']
   *
   * // Equivalent to: results[2].connection
   * // Where results[2] gets the 3rd item in the results array
   * ```
   *
   * @example Selector function for dynamic/conditional traversal:
   * ```tsx
   * // Use a function for optional chaining or conditional logic
   * path: (data) => data.activeOrganization?.teams?.[selectedTeamIndex]?.members
   *
   * // Safe navigation that returns undefined if any property is missing
   * // Useful when you need to select based on component state
   * ```
   *
   * @example GraphQL Connection with array of items:
   * ```tsx
   * // For GraphQL queries that return arrays with embedded connections
   * interface QueryData {
   *   items: Array<{
   *     id: string;
   *     connection: {
   *       edges: Array<{ node: UserNode }>;
   *       pageInfo: PageInfo;
   *     };
   *   }>;
   * }
   *
   * // Access the 5th item's connection
   * path: ['items', 5, 'connection']
   * ```
   *
   * @remarks
   * **Numeric Segment Semantics:**
   * - Numeric segments are coerced to property access, working with both:
   *   - Array indices: `array[0]`, `array[1]`, etc.
   *   - String-keyed object properties: `obj['0']`, `obj['1']`, etc. (rarely used)
   * - Out-of-bounds array access returns undefined (safe pattern)
   * - Mixed string/number traversal is fully supported: `['org', 0, 'members', 2, 'name']`
   *
   * **When to Use Numeric Segments:**
   * - Traversing arrays of items where each item contains a GraphQL connection
   * - Accessing specific paginated result sets in a multi-result query
   * - Array-based navigation in complex nested structures
   * - GraphQL connections embedded within array elements
   *
   * **Expected Final Result:**
   * The path (whether string[] or function) must resolve to a GraphQL connection type or undefined:
   * - Must have an edges property that is an array
   * - May have optional pageInfo property with pagination information
   * - Will be safely validated at runtime
   */
  path: DataPath<TNode, TData>;

  /**
   * Optional transformation function to convert GraphQL nodes to display rows.
   *
   * **Type Signature:** `(node: TNode) => TRow | null | undefined`
   *
   * Called for each non-null node. Return null/undefined to drop a row, or a TRow to keep it.
   * Defaults to identity when omitted (TNode to TRow), matching the hook implementation.
   *
   * @example Basic field transformation
   * ```tsx
   * // Add computed field
   * transformNode: (node) => ({
   *   ...node,
   *   displayName: node.name.toUpperCase(),
   *   isActive: Boolean(node.activeAt)
   * })
   * ```
   *
   * @example Selective filtering
   * ```tsx
   * // Filter out inactive nodes
   * transformNode: (node) => {
   *   if (!node.isActive) return null;
   *   return { ...node };
   * }
   * ```
   *
   * @example Data shape transformation
   * ```tsx
   * // Reshape from node structure to row structure
   * transformNode: (node) => ({
   *   id: node.id,
   *   text: node.content,
   *   author: `${node.user.firstName} ${node.user.lastName}`,
   *   timestamp: new Date(node.createdAt).toLocaleDateString()
   * })
   * ```
   *
   * @example Complex computation
   * ```tsx
   * // Calculate derived properties
   * transformNode: (node) => {
   *   const createdDate = new Date(node.createdAt);
   *   const ageInDays = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
   *   return {
   *     ...node,
   *     isRecent: ageInDays < 30,
   *     ageInDays,
   *     status: ageInDays < 7 ? 'new' : 'old'
   *   };
   * }
   * ```
   *
   */
  transformNode?: (node: TNode) => TRow | null | undefined;

  /**
   * React dependency array for memoization. Passed to useMemo() in useTableData.
   * Only include values that should trigger path re-evaluation.
   *
   * @remarks
   * The `data` parameter is already tracked automatically.
   * Use this for additional dependencies like query variables or state.
   */
  deps?: React.DependencyList;
}

/**
 * Result of the useTableData hook
 */
export interface IUseTableDataResult<TRow, TData = unknown> {
  rows: TRow[];
  loading: boolean;
  loadingMore: boolean;
  error: Error | null;
  pageInfo: PageInfo | null;
  refetch: QueryResult<TData>['refetch'];
  fetchMore: QueryResult<TData>['fetchMore'];
  networkStatus: NetworkStatus;
}
/**
 * Props for pagination controls (minimal API used by current component)
 *
 * TYPE SAFETY AUDIT:
 * - page, pageSize, totalItems are strictly typed as number (not string | number | any)
 * - TypeScript prevents string/unknown types at compile-time
 * - All callers (DataTable.tsx verified as only caller) provide numeric values
 * - No string-to-number coercion needed; Number.isFinite() checks are defensive only
 *
 * CALL SITE VERIFICATION:
 * - DataTable.tsx: pageSize = 10 (default numeric), totalItems = (totalItems ?? data.length)
 * - All props destructured from typed IDataTableProps&lt;T&gt; interface
 * - No URL parameters or form inputs directly coerced to number here
 *
 * Future consideration: If external callers provide string pageSize/totalItems,
 * restore explicit coercion: Number.isFinite(Number(totalItems)) && Number.isFinite(Number(pageSize))
 */
export interface IPaginationControlsProps {
  /** Current page number (1-indexed) */
  page: number;
  /** Number of items per page */
  pageSize: number;
  /** Total number of items across all pages */
  totalItems: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
}
/**
 * Props for a generic DataTable component
 */

export interface IBaseDataTableProps<T, TValue = unknown> {
  data: T[];
  columns: Array<IColumnDef<T, TValue>>;
  loading?: boolean;
  /**
   * rowKey: A property name (keyof T) or a function to uniquely identify each row.
   * If a property name is provided, its value will be coerced to string or number.
   */
  rowKey?: keyof T | ((row: T) => string | number);
  /**
   * Optional className applied to the underlying table element.
   */
  tableClassName?: string;
  /**
   * Optional custom row renderer. When provided, rows are rendered using this function.
   */
  renderRow?: (row: T, index: number) => React.ReactNode;
  emptyMessage?: string;
  error?: Error | null;
  renderError?: (error: Error) => React.ReactNode;
  /**
   * Optional accessible label for the table, used for both the visually hidden table caption and as aria-label on the table element.
   * This improves accessibility for screen readers and navigation.
   */
  ariaLabel?: string;
  /** Number of skeleton rows to show when loading (default: 5) */
  skeletonRows?: number;
  /**
   * When true and data is already present, show a translucent overlay on top of the table
   * while a refetch is in flight. This avoids content jump during refresh.
   */
  loadingOverlay?: boolean;

  // Filtering and Global Search
  showSearch?: boolean; // render a SearchBar above the table
  searchPlaceholder?: string;

  // Global search (controlled)
  globalSearch?: string;
  onGlobalSearchChange?: (q: string) => void;

  // Global search (uncontrolled initial)
  initialGlobalSearch?: string;

  // Per-column filters (controlled)
  columnFilters?: Record<string, unknown>;
  onColumnFiltersChange?: (filters: Record<string, unknown>) => void;

  // Server-side modes (do not filter locally; only emit changes)
  serverSearch?: boolean;
  serverFilter?: boolean;

  // Selection & Actions
  /**
   * When true, render a checkbox column for row selection.
   */
  selectable?: boolean;
  /**
   * Controlled selection state. When provided with onSelectionChange, selection is controlled.
   */
  selectedKeys?: ReadonlySet<Key>;
  /**
   * Callback when selection changes. Required for controlled selection.
   */
  onSelectionChange?: (next: ReadonlySet<Key>) => void;
  /**
   * Initial selected keys for uncontrolled selection.
   */
  initialSelectedKeys?: ReadonlySet<Key>;
  /**
   * Per-row action buttons rendered in an actions column.
   */
  rowActions?: ReadonlyArray<IRowAction<T>>;
  /**
   * Bulk actions shown in a toolbar when rows are selected.
   */
  bulkActions?: ReadonlyArray<IBulkAction<T>>;
}

/**
 * Client-side pagination props.
 * In client mode, the component manages pagination internally by slicing the data array.
 *
 * Details:
 * - `paginationMode`: Strictly 'client' for client-side pagination.
 * - `pageSize`: Items per page (default: 10).
 * - `currentPage`: Controlled page number (1-indexed); if provided, requires `onPageChange`.
 * - `onPageChange`: Callback when user navigates to a different page.
 * - `totalItems`: Total item count (default: data.length); used for pagination control display.
 * - `loadingMore`: When true, append skeleton rows at the end of the table to indicate incremental data loading. Typically used when fetching additional items within the current page. Has no effect when `loading=true` and no data exists.
 */
type ClientPaginationProps = {
  paginationMode: 'client';
  pageSize?: number; // default: 10
  currentPage?: number; // controlled page (1-indexed)
  onPageChange?: (page: number) => void;
  totalItems?: number; // default: data.length (client mode)
  pageInfo?: never;
  onLoadMore?: never;
  loadingMore?: boolean;
};
/**
 * Server-side pagination props.
 * In server mode, the component passes pagination state to the parent; parent manages data fetching and state.
 * Two variants: with pageInfo+onLoadMore (Variant A: cursor/graphql-style) or without (Variant B: static data).
 *
 * Variant A (with pageInfo and onLoadMore):
 * - `paginationMode`: Strictly 'server'.
 * - `pageInfo`: Cursor info (hasNextPage, hasPreviousPage, startCursor, endCursor) from server.
 * - `onLoadMore`: Callback to fetch the next page of data.
 * - `loadingMore`: When true, append skeleton rows to indicate data is being fetched for the next page. Parent sets this while onLoadMore is executing and resolves when data arrives.
 * - `onPageChange`: Optional callback for programmatic page navigation or initial page selection.
 * - `totalItems`: Optional total item count for display purposes.
 *
 * Variant B (without pageInfo and onLoadMore):
 * - `paginationMode`: Strictly 'server'.
 * - `pageInfo`: Omitted (undefined).
 * - `onLoadMore`: Omitted (undefined); parent manages all fetching outside the component.
 * - `loadingMore`: When true, append skeleton rows (e.g., for infinite scroll or manual refetch scenarios). Parent controls when to show appended skeletons.
 * - `onPageChange`: Optional callback if parent needs page notifications.
 * - `totalItems`: Optional total item count.
 */
type ServerPaginationProps =
  | {
      paginationMode: 'server';
      pageSize?: never;
      currentPage?: never;
      onPageChange?: (page: number) => void;
      totalItems?: number;
      pageInfo: IPageInfo; // GraphQL-style page info
      onLoadMore: () => void; // called to fetch next page
      loadingMore?: boolean; // true while fetching more
    }
  | {
      paginationMode: 'server';
      pageSize?: never;
      currentPage?: never;
      onPageChange?: (page: number) => void;
      totalItems?: number;
      pageInfo?: undefined;
      onLoadMore?: undefined;
      loadingMore?: boolean;
    };

/**
 * No-pagination props.
 * When paginationMode is undefined/omitted, pagination controls are hidden and all data is displayed.
 *
 * Details:
 * - `paginationMode`: Omitted (undefined); no pagination.
 * - `loadingMore`: When true, append skeleton rows to indicate additional data is being loaded (e.g., infinite scroll). The component displays all loaded data plus skeleton rows for pending data. Parent manages the loadingMore state and appends new items to the data array as they arrive.
 */
type NoPaginationProps = {
  paginationMode?: undefined;
  pageSize?: never;
  currentPage?: never;
  onPageChange?: never;
  totalItems?: never;
  pageInfo?: never;
  onLoadMore?: never;
  loadingMore?: boolean;
};

type PaginationProps =
  | ClientPaginationProps
  | ServerPaginationProps
  | NoPaginationProps;

// i18n-ignore-next-line
export type IDataTableProps<T, TValue = unknown> = IBaseDataTableProps<
  T,
  TValue
> &
  PaginationProps;

/** Sorting state */
export interface ISortState {
  columnId: string;
  direction: 'asc' | 'desc';
}

/** Filter state */
export interface IFilterState {
  columnId: string;
  value: unknown;
}

/**
 * Shared table UI state
 */
export interface ITableState {
  sorting?: ISortState[];
  filters?: IFilterState[];
  globalSearch?: string;
  selectedRows?: Set<Key>;
}

/**
 * Key type for uniquely identifying rows.
 */
export type Key = string | number;

/**
 * Row-level action definition for per-row action buttons.
 *
 * @example
 * ```ts
 * const rowActions: IRowAction<User>[] = [
 *   { id: 'edit', label: 'Edit', onClick: (row) => console.log('edit', row.id) },
 *   { id: 'delete', label: 'Delete', onClick: (row) => console.log('delete', row.id), disabled: (row) => row.isAdmin },
 * ];
 * ```
 */
export interface IRowAction<T> {
  /** Unique identifier for the action */
  id: string;
  /** Button label text */
  label: string;
  /** Callback when action is triggered */
  onClick: (row: T) => void;
  /** Disable this action (boolean or function returning boolean) */
  disabled?: boolean | ((row: T) => boolean);
  /** Accessible label for screen readers */
  ariaLabel?: string;
}

/**
 * Bulk action for operations on multiple selected rows.
 *
 * @example
 * ```ts
 * const bulkActions: IBulkAction<User>[] = [
 *   { id: 'export', label: 'Export', onClick: (rows, keys) => console.log('export', keys) },
 *   { id: 'delete', label: 'Delete', onClick: (rows, keys) => console.log('delete', keys), confirm: 'Delete selected items?' },
 * ];
 * ```
 */
export interface IBulkAction<T> {
  /** Unique identifier for the action */
  id: string;
  /** Button label text */
  label: string;
  /** Callback when action is triggered with selected rows and their keys */
  onClick: (rows: T[], keys: Key[]) => void | Promise<void>;
  /** Disable this action (boolean or function returning boolean based on selection) */
  disabled?: boolean | ((rows: T[], keys: Key[]) => boolean);
  /** Optional confirmation message shown before executing the action */
  confirm?: string;
}

/**
 * Props for the table loading skeleton component
 *
 * Used to display placeholder loading states while data is being fetched,
 * either as a full table skeleton or as an overlay on top of existing data.
 */
export interface ITableLoaderProps<T> {
  /** Column definitions to match the structure of the actual table */
  columns: IColumnDef<T>[];

  /** Number of skeleton rows to display (default: 5) */
  rows?: number;

  /** When true, render as a translucent overlay over existing table content instead of standalone */
  asOverlay?: boolean;

  /** Accessible label for the loading table, used for screen readers */
  ariaLabel?: string;
}

/**
 * Props for the SearchBar component.
 *
 * Used to render a controlled search input field with an optional clear button.
 */
export interface InterfaceSearchBarProps {
  /**
   * The current search query value.
   * This is a controlled value that should be managed by the parent component.
   */
  value: string;

  /**
   * Callback fired when the input value changes or when the clear button is clicked.
   * @param query - The new search query string (empty string when cleared)
   */
  onChange: (query: string) => void;

  /**
   * Placeholder text displayed when the input is empty.
   * @defaultValue 'Search…'
   */
  placeholder?: string;

  /**
   * Accessible label for screen readers.
   * Applied to the search input's aria-label attribute.
   * @defaultValue 'Search'
   */
  'aria-label'?: string;

  /**
   * Accessible label for the clear button, announced by screen readers.
   * @defaultValue 'Clear search'
   */
  'clear-aria-label'?: string;
}
