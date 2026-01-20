import {
  HeaderRender,
  IColumnDef,
} from '../../types/shared-components/DataTable/interface';

/**
 * Renders the header of a column.
 */
export function renderHeader(header: HeaderRender) {
  return typeof header === 'function' ? header() : header;
}

/**
 * Renders a cell value for display.
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
 */
export function getCellValue<T>(row: T, accessor: IColumnDef<T>['accessor']) {
  return typeof accessor === 'function'
    ? accessor(row)
    : row[accessor as keyof T];
}

/**
 * Helper for text search interactions.
 */
export function toSearchableString(v: unknown): string {
  if (v === null || v === undefined) return '';
  if (v instanceof Date) return v.toISOString();
  return String(v);
}
