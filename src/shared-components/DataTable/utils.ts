import {
  HeaderRender,
  IColumnDef,
} from '../../types/shared-components/DataTable/interface';

/**
 * Renders the header of a column.
 *
 * @param header - Header value or render function.
 * @returns The rendered header content.
 */
export function renderHeader(header: HeaderRender) {
  return typeof header === 'function' ? header() : header;
}

/**
 * Renders a cell value for display.
 *
 * @param value - Raw cell value.
 * @returns Display-safe string or primitive.
 */
export function renderCellValue(value: unknown) {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return value;
  try {
    return JSON.stringify(value);
  } catch {
    return '';
  }
}

/**
 * Helper to get raw cell value from a row using the accessor.
 *
 * @typeParam T - The row data type
 * @typeParam TValue - The expected return value type
 * @param row - The row data object
 * @param accessor - Column accessor (property key or function)
 * @returns The cell value
 */
export function getCellValue<T, TValue = unknown>(
  row: T,
  accessor: IColumnDef<T, TValue>['accessor'],
): TValue {
  return typeof accessor === 'function'
    ? accessor(row)
    : (row[accessor as keyof T] as TValue);
}

/**
 * Helper for text search interactions.
 *
 * @param v - Value to stringify for search.
 * @returns Searchable string.
 */
export function toSearchableString(v: unknown): string {
  if (v === null || v === undefined) return '';
  if (v instanceof Date) {
    return Number.isNaN(v.getTime()) ? '' : v.toISOString();
  }
  return String(v);
}
