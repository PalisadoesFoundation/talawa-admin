import React from 'react';

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
 * interface User {
 *   id: string;
 *   name: string;
 * }
 *
 * const columns: ColumnDef<User>[] = [
 *   { id: 'name', header: 'Name', accessor: 'name' }
 * ];
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
    sortable?: boolean;
    filterable?: boolean;
    width?: string | number;
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
  emptyMessage?: string;
  error?: Error | null;
  renderError?: (error: Error) => React.ReactNode;
  /**
   * Optional accessible label for the table, used for both the visually hidden table caption and as aria-label on the table element.
   * This improves accessibility for screen readers and navigation.
   */
  ariaLabel?: string;
  /** Number of skeleton rows to show when loading (default: 6) */
  skeletonRows?: number;
}

type ClientPaginationProps = {
  paginationMode: 'client';
  pageSize?: number; // default: 10
  currentPage?: number; // controlled page (1-indexed)
  onPageChange?: (page: number) => void;
  totalItems?: number; // default: data.length (client mode)
  pageInfo?: never;
  onLoadMore?: never;
  loadingMore?: never;
};
// Server pagination requires both pageInfo and onLoadMore together (or neither).
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
      loadingMore?: undefined;
    };

type NoPaginationProps = {
  paginationMode?: undefined;
  pageSize?: never;
  currentPage?: never;
  onPageChange?: never;
  totalItems?: never;
  pageInfo?: never;
  onLoadMore?: never;
  loadingMore?: never;
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
  selectedRows?: Set<string | number>;
}
