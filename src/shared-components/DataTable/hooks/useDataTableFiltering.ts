import React from 'react';
import {
  IColumnDef,
  IUseDataTableFilteringOptions,
} from '../../../types/shared-components/DataTable/interface';
import { getCellValue, toSearchableString } from '../utils';

/**
 * Hook to manage DataTable filtering and search logic.
 *
 * Provides controlled and uncontrolled modes for both global search and
 * per-column filtering. Handles client-side filtering when server flags
 * are not set.
 *
 * @typeParam T - The row data type used in the DataTable
 *
 * @param options - Configuration options for filtering behavior
 * @param options.data - Array of row data to filter
 * @param options.columns - Column definitions with filter/search metadata
 * @param options.initialGlobalSearch - Initial search value for uncontrolled mode
 * @param options.globalSearch - Controlled global search value
 * @param options.onGlobalSearchChange - Callback for controlled search updates
 * @param options.columnFilters - Column filter values by column ID
 * @param options.onColumnFiltersChange - Callback when column filters change
 * @param options.serverSearch - If true, skip client-side global search filtering
 * @param options.serverFilter - If true, skip client-side column filtering
 * @param options.paginationMode - Pagination mode affecting page reset behavior
 * @param options.onPageReset - Callback to reset page when filters change
 *
 * @returns Object containing:
 *   - `query` - Current global search string
 *   - `updateGlobalSearch` - Function to update the search query
 *   - `filteredRows` - Array of rows after applying filters
 *   - `filters` - Current column filter values
 *
 * @example
 * ```tsx
 * const { query, updateGlobalSearch, filteredRows } = useDataTableFiltering({
 *   data: users,
 *   columns: userColumns,
 *   initialGlobalSearch: '',
 * });
 * ```
 */
export function useDataTableFiltering<T>(
  options: IUseDataTableFilteringOptions<T>,
) {
  const {
    data,
    columns,
    initialGlobalSearch = '',
    globalSearch,
    onGlobalSearchChange,
    columnFilters,
    onColumnFiltersChange: _onColumnFiltersChange,
    serverSearch = false,
    serverFilter = false,
    paginationMode,
    onPageReset,
  } = options;

  // Controlled / uncontrolled global search
  const controlledSearch =
    typeof globalSearch === 'string' &&
    typeof onGlobalSearchChange === 'function';
  const [uQuery, setUQuery] = React.useState(initialGlobalSearch);
  const query = controlledSearch ? (globalSearch as string) : uQuery;

  // Controlled / uncontrolled column filters
  const controlledFilters = columnFilters !== undefined;
  const [uFilters] = React.useState<Record<string, unknown>>(
    columnFilters ?? {},
  );
  const filters = controlledFilters ? (columnFilters ?? {}) : uFilters;

  const updateGlobalSearch = React.useCallback(
    (next: string) => {
      if (controlledSearch && onGlobalSearchChange) {
        onGlobalSearchChange(next);
      } else {
        setUQuery(next);
      }
      // Reset to first page on search change if using client pagination
      if (paginationMode === 'client' && onPageReset) {
        onPageReset();
      }
    },
    [controlledSearch, onGlobalSearchChange, paginationMode, onPageReset],
  );

  // Client-side filtering pipeline (skip when server flags are set)
  const filteredRows: T[] = React.useMemo(() => {
    let rows = data ?? [];
    if (!rows.length) return rows;

    // 1) Per-column filters
    if (!serverFilter && filters && Object.keys(filters).length > 0) {
      rows = rows.filter((row) => {
        for (const [colId, filterValueRaw] of Object.entries(filters)) {
          const col = columns.find((c) => c.id === colId);
          if (!col) continue;
          if (col.meta?.filterable === false) continue; // opt-out

          const filterValue = filterValueRaw;
          if (
            filterValue === '' ||
            filterValue === undefined ||
            filterValue === null
          )
            continue;

          if (typeof col.meta?.filterFn === 'function') {
            if (!col.meta.filterFn(row, filterValue)) return false;
            continue;
          }

          // Default text "contains" (case-insensitive) for strings, equals for others
          const cell = getCellValue(row, col.accessor);
          if (typeof filterValue === 'string') {
            const hay = toSearchableString(cell).toLowerCase();
            const needle = filterValue.toLowerCase();
            if (!hay.includes(needle)) return false;
          } else {
            // shallow equality fallback
            if (cell !== filterValue) return false;
          }
        }
        return true;
      });
    }

    // 2) Global search across searchable columns
    const q = (query ?? '').trim().toLowerCase();
    if (!serverSearch && q) {
      const searchable = columns.filter((c) => c.meta?.searchable !== false);
      rows = rows.filter((row) => {
        return searchable.some((col) => {
          if (typeof col.meta?.getSearchValue === 'function') {
            return col.meta.getSearchValue(row).toLowerCase().includes(q);
          }
          const v = getCellValue(row, col.accessor);
          return toSearchableString(v).toLowerCase().includes(q);
        });
      });
    }

    return rows;
  }, [data, columns, filters, serverFilter, query, serverSearch]);

  return {
    query,
    updateGlobalSearch,
    filteredRows,
    filters,
  };
}
