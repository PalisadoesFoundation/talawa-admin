import React from 'react';
import type { QueryResult, NetworkStatus } from '@apollo/client';
import type { InterfacePageInfo } from './pagination';
import type { IColumnDef } from './column';
import type { Key } from './types';

type ConnectionResolver<TNode, TData> = (data: TData) =>
  | {
      edges?:
        | Array<{ node: TNode | null | undefined } | null | undefined>
        | null
        | undefined;
      pageInfo?: InterfacePageInfo | null | undefined;
    }
  | null
  | undefined;

type DataPath<TNode, TData> =
  | ConnectionResolver<TNode, TData>
  | (string | number)[];

/**
 * Configuration options for fetching table data from a GraphQL connection.
 *
 * Supports extracting rows from GraphQL Relay connection patterns and transforming
 * nodes into the desired row format. Integrates with Apollo Client for query management.
 *
 * @typeParam TNode - The raw node type from the GraphQL connection
 * @typeParam TRow - The transformed row type after processing (may differ from TNode)
 * @typeParam TData - The complete GraphQL query result data shape
 */
export interface IUseTableDataOptions<TNode, TRow, TData = unknown> {
  /**
   * Path to the connection data within the query result.
   * Can be a function that extracts the connection from data, or an array of keys/indices.
   */
  path: DataPath<TNode, TData>;
  /**
   * Optional transform function to convert raw node data into row format.
   * Called for each node in the connection.
   *
   * @param node - The raw node from the connection
   * @returns Transformed row data, or null/undefined to exclude the node
   */
  transformNode?: (node: TNode) => TRow | null | undefined;
  /** React dependency array to control when the data fetching updates */
  deps?: React.DependencyList;
}

/**
 * Result object from a table data fetching hook.
 *
 * Contains the processed rows, loading states, error information, and methods to
 * refetch data or fetch additional pages in a paginated result set.
 *
 * @typeParam TRow - The type of data for each row
 * @typeParam TData - The shape of the complete GraphQL query result
 */
export interface IUseTableDataResult<TRow, TData = unknown> {
  /** Array of processed rows ready for display in the table */
  rows: TRow[];
  /** Whether the initial data fetch is in progress */
  loading: boolean;
  /** Whether additional pages are currently being fetched */
  loadingMore: boolean;
  /** Error from the most recent query or fetch operation */
  error: Error | null;
  /** Pagination state including cursors and next/previous page availability */
  pageInfo: InterfacePageInfo | null;
  /**
   * Function to refetch the query with fresh data.
   * Typically used to refresh after mutations.
   */
  refetch: QueryResult<TData>['refetch'];
  /**
   * Function to fetch additional pages or update pagination cursors.
   * Follows Apollo Client's fetchMore signature.
   */
  fetchMore: QueryResult<TData>['fetchMore'];
  /**
   * Apollo Client network status code.
   * 1 = loading, 4 = setVariables, 6 = refetch, 7 = poll, 8 = ready, etc.
   */
  networkStatus: NetworkStatus;
}

/**
 * Configuration options for table data filtering and search functionality.
 *
 * Provides comprehensive filtering capabilities including global search across all rows,
 * per-column filtering, and control over client-side vs server-side filtering behavior.
 * Supports pagination mode detection to manage page reset behavior during filtering.
 *
 * @typeParam T - The type of data for each row in the table
 */
export interface IUseDataTableFilteringOptions<T> {
  /** Array of row data to filter and search */
  data?: T[];
  /** Column definitions that determine which columns are searchable or filterable */
  columns: Array<IColumnDef<T, unknown>>;
  /** Initial value for global search query, used on mount */
  initialGlobalSearch?: string;
  /** Current global search query string to match against row data */
  globalSearch?: string;
  /** Callback fired when global search query changes, receives new query string */
  onGlobalSearchChange?: (q: string) => void;
  /** Record of column-specific filter values, keyed by column ID */
  columnFilters?: Record<string, unknown>;
  /** Callback fired when column filters change, receives updated filter record */
  onColumnFiltersChange?: (filters: Record<string, unknown>) => void;
  /** Whether search functionality is handled server-side instead of client-side */
  serverSearch?: boolean;
  /** Whether column filtering is handled server-side instead of client-side */
  serverFilter?: boolean;
  /** Current pagination mode: 'client' for local paging, 'server' for remote paging, 'none' for no pagination */
  paginationMode?: 'client' | 'server' | 'none';
  /** Callback to reset pagination to first page when filters change */
  onPageReset?: () => void;
}

/**
 * Configuration for an action available on individual table rows.
 *
 * Row actions appear as contextual buttons or menu items for each row,
 * allowing users to perform operations on specific row data.
 *
 * @typeParam T - The type of row data this action operates on
 */
export interface IRowAction<T> {
  /** Unique identifier for this action */
  id: string;
  /** Display label for the action button or menu item */
  label: string;
  /**
   * Callback fired when the action is triggered on a row.
   *
   * @param row - The row data the action was triggered for
   */
  onClick: (row: T) => void;
  /**
   * Whether this action is disabled.
   * Can be a boolean or a function that evaluates the row to determine disabled state.
   */
  disabled?: boolean | ((row: T) => boolean);
  /** ARIA label for accessibility when label alone is not descriptive */
  ariaLabel?: string;
}

/**
 * Configuration for an action available on bulk-selected rows.
 *
 * Bulk actions operate on multiple selected rows at once and typically
 * involve server mutations or data processing.
 *
 * @typeParam T - The type of row data this action operates on
 */
export interface IBulkAction<T> {
  /** Unique identifier for this action */
  id: string;
  /** Display label for the bulk action button */
  label: string;
  /**
   * Callback fired when the bulk action is triggered.
   * Can be async to support server operations.
   *
   * @param rows - Array of selected rows
   * @param keys - Array of keys for the selected rows
   * @returns `void` or `Promise<void>` if async
   */
  onClick: (rows: T[], keys: Key[]) => void | Promise<void>;
  /**
   * Whether this action is disabled for the current selection.
   * Can be a boolean or a function that evaluates the selection.
   * @param rows - Array of selected rows
   * @param keys - Array of keys for the selected rows
   */
  disabled?: boolean | ((rows: T[], keys: Key[]) => boolean);
  /** Optional confirmation message to display before executing the action */
  confirm?: string;
}

/**
 * Configuration options for row selection in a DataTable.
 *
 * Controls how rows can be selected, which rows are selectable,
 * and provides callbacks for selection changes and bulk actions.
 *
 * @typeParam T - The type of row data in the table
 */
export interface IUseDataTableSelectionOptions<T> {
  /** Array of rows currently shown on the page */
  paginatedData: readonly T[];
  /** Array of keys for rows on the current page */
  keysOnPage: Key[];
  /** Whether row selection is enabled for this table */
  selectable?: boolean;
  /** Set of currently selected row keys */
  selectedKeys?: ReadonlySet<Key>;
  /**
   * Callback fired when the selection changes.
   * Receives a new immutable set of selected keys.
   */
  onSelectionChange?: (next: ReadonlySet<Key>) => void;
  /** Initial set of selected rows on component mount */
  initialSelectedKeys?: ReadonlySet<Key>;
  /** Array of bulk actions available for selected rows */
  bulkActions?: ReadonlyArray<IBulkAction<T>>;
}
