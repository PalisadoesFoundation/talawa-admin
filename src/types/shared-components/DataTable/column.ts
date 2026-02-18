import type { ReactNode } from 'react';
import type { Accessor, HeaderRender } from './types';

/**
 * Column definition for DataTable.
 *
 * Specifies how a column should render, behave, and interact with sorting, filtering,
 * and searching. Each column maps to a specific property or accessor within row data.
 *
 * @typeParam T - The type of data for each row in the table
 * @typeParam TValue - The type of the value extracted by the accessor (defaults to unknown)
 */
export interface IColumnDef<T, TValue = unknown> {
  /** Unique identifier for this column */
  id: string;
  /** Column header text or React component to render */
  header: HeaderRender;
  /** Accessor function or key to extract the value from row data */
  accessor: Accessor<T, TValue>;
  /**
   * Optional custom render function for cell values.
   * Receives the extracted value and the full row data.
   *
   * @param value - The value extracted by the accessor
   * @param row - The complete row data object
   * @returns React node to render in the cell
   */
  render?: (value: TValue, row: T) => ReactNode;
  /**
   * Metadata and configuration for column behavior.
   */
  meta?: {
    /** Whether this column supports sorting (default: true) */
    sortable?: boolean;
    /**
     * Custom comparator function for sorting this column.
     *
     * @param a - First row for comparison
     * @param b - Second row for comparison
     * @returns Negative if a \< b, 0 if equal, positive if a \> b
     */
    sortFn?: (a: T, b: T) => number;
    /** Whether this column supports filtering (default: false) */
    filterable?: boolean;
    /**
     * Custom filter predicate to match rows against a filter value.
     *
     * @param row - Row to evaluate
     * @param value - Filter value to match against
     * @returns true if row matches the filter
     */
    filterFn?: (row: T, value: unknown) => boolean;
    /** Whether this column is included in global search (default: false) */
    searchable?: boolean;
    /**
     * Custom function to extract searchable text from a row.
     * Used when performing global search on this column.
     *
     * @param row - Row data to extract search value from
     * @returns String representation for search matching
     */
    getSearchValue?: (row: T) => string;
    /** CSS width for this column (e.g., '100px', '20%') */
    width?: string | number;
    /** Text alignment for cell content ('left', 'center', or 'right') */
    align?: 'left' | 'center' | 'right';
    /** ARIA label for accessibility when header content is not descriptive */
    ariaLabel?: string;
  };
}
