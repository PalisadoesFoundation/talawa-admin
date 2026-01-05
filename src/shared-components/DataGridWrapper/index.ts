export * from './DataGridWrapper';

/**
 * Re-exports of MUI DataGrid components and types.
 *
 * Direct imports from @mui/x-data-grid are restricted by ESLint configuration.
 * Components should import these re-exported items from this module instead.
 *
 */
export { DataGrid } from '@mui/x-data-grid';
export type {
  GridCellParams,
  GridColDef,
  GridPaginationModel,
  GridRenderCellParams,
  GridRowHeightReturnValue,
} from '@mui/x-data-grid';
