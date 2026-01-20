import React from 'react';
import { IColumnDef } from '../../../types/shared-components/DataTable/interface';
import { getCellValue, toSearchableString } from '../utils';

interface IUseDataTableFilteringOptions<T> {
  data: T[];
  columns: Array<IColumnDef<T>>;
  initialGlobalSearch?: string;
  globalSearch?: string;
  onGlobalSearchChange?: (q: string) => void;
  columnFilters?: Record<string, unknown>;
  onColumnFiltersChange?: (filters: Record<string, unknown>) => void;
  serverSearch?: boolean;
  serverFilter?: boolean;
  paginationMode?: 'client' | 'server';
  onPageReset?: () => void;
}

/**
 * Hook to manage DataTable filtering and search logic.
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
    onColumnFiltersChange,
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
  const controlledFilters =
    !!columnFilters && typeof onColumnFiltersChange === 'function';
  const [uFilters] = React.useState<Record<string, unknown>>({});
  const filters = controlledFilters
    ? (columnFilters as Record<string, unknown>)
    : uFilters;

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
