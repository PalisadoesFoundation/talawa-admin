import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import InfiniteScroll from 'react-infinite-scroll-component';
import type { ReportingTableProps } from '../../types/ReportingTable/interface';

/**
 * A flexible reporting table component that wraps MUI DataGrid with optional infinite scroll.
 *
 * @remarks
 * This component provides a consistent table interface across the application with support for:
 * - Standard DataGrid rendering for static data
 * - Infinite scroll wrapper for paginated/lazy-loaded data
 * - Customizable grid and scroll container properties
 *
 * @param rows - Array of data rows to display in the table
 * @param columns - Column definitions following ReportingTableColumn structure
 * @param gridProps - Optional additional props passed directly to MUI DataGrid
 * @param infiniteProps - When provided, enables infinite scroll with dataLength, next, and hasMore
 * @param listProps - Optional styling and behavior props for the InfiniteScroll container
 *
 * @returns A DataGrid wrapped in InfiniteScroll if infiniteProps is provided, otherwise a standalone DataGrid
 *
 * @example
 * ```tsx
 * // Basic usage without infinite scroll
 * <ReportingTable rows={data} columns={columnDefs} />
 *
 * // With infinite scroll
 * <ReportingTable
 *   rows={displayedRows}
 *   columns={columnDefs}
 *   infiniteProps={{
 *     dataLength: displayedRows.length,
 *     next: loadMoreData,
 *     hasMore: hasMoreData
 *   }}
 * />
 * ```
 */
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
