import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import InfiniteScroll from 'react-infinite-scroll-component';
import type {
  ReportingTableColumn,
  ReportingRow,
  ReportingTableGridProps,
  InfiniteScrollProps,
} from '../../types/ReportingTable/interface';

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

const ReportingTable: React.FC<ReportingTableProps> = ({
  rows,
  columns,
  gridProps,
  infiniteProps,
  listProps,
}) => {
  const grid = (
    <div className="datatable">
      <DataGrid {...(gridProps ?? {})} rows={rows} columns={columns} />
    </div>
  );

  if (!infiniteProps) {
    return grid;
  }

  const {
    className,
    style,
    endMessage,
    loader,
    scrollThreshold,
    ['data-testid']: dataTestId,
  } = listProps ?? {};

  return (
    <InfiniteScroll
      dataLength={infiniteProps.dataLength}
      next={infiniteProps.next}
      hasMore={infiniteProps.hasMore}
      loader={loader}
      className={className}
      data-testid={dataTestId}
      scrollThreshold={scrollThreshold}
      style={style}
      endMessage={endMessage}
    >
      {grid}
    </InfiniteScroll>
  );
};

export default ReportingTable;
