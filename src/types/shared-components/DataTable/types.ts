import type { ReactNode } from 'react';
import type { IColumnDef } from './column';

export type SortDirection = 'asc' | 'desc';

export type HeaderRender = string | ReactNode | (() => ReactNode);

export type Accessor<T, TValue = unknown> = keyof T | ((row: T) => TValue);

export type Key = string | number;

/**
 * Represents the current sort state of a table column.
 *
 * Tracks which column is sorted and in which direction (ascending or descending).
 */
export interface ISortState {
  /** ID of the column being sorted */
  columnId: string;
  /** Sort direction: 'asc' for ascending or 'desc' for descending */
  direction: SortDirection;
}

/**
 * Represents a single column filter.
 *
 * Pairs a column ID with a filter value to be applied when filtering table rows.
 */
export interface IFilterState {
  /** ID of the column being filtered */
  columnId: string;
  /** The filter value to match against rows (type depends on column) */
  value: unknown;
}

/**
 * Complete state of a table including sorting, filtering, and selection.
 *
 * Represents the combined state of all table operations for persistence or state management.
 */
export interface ITableState {
  /** Array of active sort states (primary sort first) */
  sorting?: ISortState[];
  /** Array of active column filters */
  filters?: IFilterState[];
  /** Global search query string applied across all searchable columns */
  globalSearch?: string;
  /** Immutable set of currently selected row keys */
  selectedRows?: ReadonlySet<Key>;
}

/**
 * Event object passed to onSortChange callback when sort state changes.
 *
 * Provides complete information about the sort change including the new sort state array,
 * the primary sort direction, and the column definition that triggered the change.
 *
 * @typeParam T - The type of data for each row in the table
 */
export interface ISortChangeEvent<T> {
  /** Array of sort states (primary sort first, can include multiple columns) */
  sortBy: ISortState[];
  /** Direction of the primary sort */
  sortDirection: SortDirection;
  /** Column definition that triggered the sort change */
  column: IColumnDef<T, unknown>;
}
