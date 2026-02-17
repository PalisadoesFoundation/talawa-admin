import type { ReactNode } from 'react';
import type {
  GridColDef,
  GridCellParams,
} from 'shared-components/DataGridWrapper';
import type { SpacingToken } from '../../utils/tokenValues';

export type ReportingRow = Record<string, unknown>;
type ReportingCellParams = GridCellParams<ReportingRow, ReportingRow, string>;

/**
 * ReportingTableColumnDef
 * App-level column shape used across the app. It's a thin composition over
 * MUI's `GridColDef` exposing the props we use commonly in screen files.
 */
export type ReportingTableColumn = Partial<
  Omit<GridColDef, 'width' | 'minWidth' | 'maxWidth'>
> & {
  /** Unique field id for the column (required) */
  field: string;
  /** Header name for the column */
  headerName?: string;
  /** Column width - accepts number (pixels) or spacing token name */
  width?: number | SpacingToken;
  /** Minimum width for the column - accepts number (pixels) or spacing token name */
  minWidth?: number | SpacingToken;
  /** Maximum width for the column - accepts number (pixels) or spacing token name */
  maxWidth?: number | SpacingToken;
  /** Alignment for the column content */
  align?: 'left' | 'center' | 'right';
  /** Alignment for the column header */
  headerAlign?: 'left' | 'center' | 'right';
  /** Additional class applied to the header cell */
  headerClassName?: string;
  /** Whether the column is sortable */
  sortable?: boolean;
  /** Flex grow for the column */
  flex?: number;
  /** Custom renderer for the cell */
  renderCell?: (params: ReportingCellParams) => ReactNode;
  /** Custom value getter for the cell */
  valueGetter?: (
    value: unknown,
    row: ReportingRow,
    column: GridColDef,
    apiRef: unknown,
  ) => unknown;
  [key: string]: unknown;
};

/**
 * Props for the InfiniteScroll component used in ReportingTable
 *
 */
export type InfiniteScrollProps = {
  dataLength: number;
  next: () => void;
  hasMore: boolean;
};

/**
 *  Props for the ReportingTableGrid component
 */
export type ReportingTableGridProps = {
  rows?: readonly ReportingRow[];
  columns?: ReportingTableColumn[];
  /** When true, applies tighter column widths for tables with many columns (7+) */
  compactColumns?: boolean;
  [key: string]: unknown;
};

/**
 *  Props for the ReportingTable component
 */

export type ReportingTableProps = {
  rows: readonly ReportingRow[];
  columns: ReportingTableColumn[];
  gridProps?: ReportingTableGridProps;
  /** Optional InfiniteScroll behavior; when provided, wraps the grid */
  infiniteProps?: InfiniteScrollProps;
  /** Optional props applied to the InfiniteScroll container */
  listProps?: {
    className?: string;
    style?: React.CSSProperties;
    ['data-testid']?: string;
    scrollThreshold?: number;
    loader?: React.ReactNode;
    endMessage?: React.ReactNode;
  };
};
