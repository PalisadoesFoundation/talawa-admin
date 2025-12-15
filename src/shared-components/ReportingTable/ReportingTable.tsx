import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import InfiniteScroll from 'react-infinite-scroll-component';
import type { ReportingTableProps } from '../../types/ReportingTable/interface';

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
