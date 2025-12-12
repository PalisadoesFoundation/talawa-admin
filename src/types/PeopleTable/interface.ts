import type {
  GridCallbackDetails,
  GridColDef,
  GridPaginationModel,
  GridRowsProp,
  GridSlots,
} from '@mui/x-data-grid';

/**
 * Interface representing the props for the PeopleTable component.
 */
export interface IPeopleTableProps {
  rows: GridRowsProp;
  columns: GridColDef[];
  loading: boolean;
  rowCount: number;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (
    model: GridPaginationModel,
    details: GridCallbackDetails,
  ) => void;
  pageSizeOptions?: number[];
  slots?: Partial<GridSlots>;
  paginationMeta?: {
    hasNextPage?: boolean;
  };
}
