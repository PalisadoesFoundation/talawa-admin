import React from 'react';
import { IUseDataTableFilteringOptions } from '../../../types/shared-components/DataTable/interface';
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
 * @param options - Configuration options for filtering behavior including:
 *   - `data` - Array of row data to filter
 *   - `columns` - Column definitions with filter/search metadata
 *   - `initialGlobalSearch` - Initial search value for uncontrolled mode
 *   - `globalSearch` - Controlled global search value
 *   - `onGlobalSearchChange` - Callback for controlled search updates
 *   - `columnFilters` - Column filter values by column ID
 *   - `onColumnFiltersChange` - Callback when column filters change
 *   - `serverSearch` - If true, skip client-side global search filtering
 *   - `serverFilter` - If true, skip client-side column filtering
 *   - `paginationMode` - Pagination mode affecting page reset behavior
 *   - `onPageReset` - Callback to reset page when filters change
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
    // Note: onColumnFiltersChange is provided by consumers for per-column filter UI
    // This hook only reads columnFilters; updating them is consumer's responsibility
    serverSearch = false,
    serverFilter = false,
    paginationMode,
    onPageReset,
  } = options;

  // Controlled / uncontrolled global search
  // Controlled mode: globalSearch is provided (even if no handler)
  const controlledSearch = globalSearch !== undefined;
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
      if (controlledSearch) {
        // In controlled mode, call handler if it exists (no-op otherwise)
        if (onGlobalSearchChange) {
          onGlobalSearchChange(next);
        }
      } else {
        // In uncontrolled mode, update internal state
        setUQuery(next);
      }
      // Reset to first page on search change if using client pagination
      if (paginationMode === 'client' && onPageReset) {
        onPageReset();
      }
    },
    [controlledSearch, onGlobalSearchChange, paginationMode, onPageReset],
  );

  // Precompute column lookup map for O(1) access in filtering
  const columnById = React.useMemo(() => {
    const m = new Map<string, (typeof columns)[number]>();
    columns.forEach((c) => m.set(c.id, c));
    return m;
  }, [columns]);

  // Precompute searchable columns for global search
  const searchableColumns = React.useMemo(
    () => columns.filter((c) => c.meta?.searchable !== false),
    [columns],
  );

  // Client-side filtering pipeline (skip when server flags are set)
  const filteredRows: T[] = React.useMemo(() => {
    let rows = data ?? [];
    if (!rows.length) return rows;

    // 1) Per-column filters
    if (!serverFilter && filters && Object.keys(filters).length > 0) {
      rows = rows.filter((row) => {
        for (const [colId, filterValueRaw] of Object.entries(filters)) {
          const col = columnById.get(colId);
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
      rows = rows.filter((row) => {
        return searchableColumns.some((col) => {
          if (typeof col.meta?.getSearchValue === 'function') {
            return col.meta.getSearchValue(row).toLowerCase().includes(q);
          }
          const v = getCellValue(row, col.accessor);
          return toSearchableString(v).toLowerCase().includes(q);
        });
      });
    }

    return rows;
  }, [
    data,
    columnById,
    searchableColumns,
    filters,
    serverFilter,
    query,
    serverSearch,
  ]);

  return {
    query,
    updateGlobalSearch,
    filteredRows,
    filters,
  };
}
