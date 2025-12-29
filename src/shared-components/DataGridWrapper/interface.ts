import type {
  GridColDef,
  GridRowsProp,
  GridValidRowModel,
} from '@mui/x-data-grid';
export interface InterfaceDataGridWrapperProps<
  T extends GridValidRowModel = GridValidRowModel,
> {
  rows: GridRowsProp<T>;
  columns: GridColDef[];
  loading?: boolean;
  searchConfig?: {
    enabled: boolean;
    fields: string[];
    placeholder?: string;
    debounceMs?: number;
  };
  sortConfig?: {
    defaultSortField?: string;
    defaultSortOrder?: 'asc' | 'desc';
    sortingOptions?: { label: string; value: string | number }[];
  };
  paginationConfig?: {
    enabled: boolean;
    defaultPageSize?: number;
    pageSizeOptions?: number[];
  };
  onRowClick?: (row: T) => void;
  actionColumn?: (row: T) => React.ReactNode;
  emptyStateMessage?: string;
  error?: string | React.ReactNode;
}
