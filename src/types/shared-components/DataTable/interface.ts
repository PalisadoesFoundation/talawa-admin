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
 * Props for a generic DataTable component
 */
export interface IDataTableProps<T, TValue = unknown> {
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
