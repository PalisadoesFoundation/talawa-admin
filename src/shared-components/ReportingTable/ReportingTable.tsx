import React, { useMemo } from 'react';
import { DataGrid } from 'shared-components/DataGridWrapper';
import InfiniteScroll from 'react-infinite-scroll-component';
import type {
  ReportingTableProps,
  ReportingTableColumn,
} from '../../types/ReportingTable/interface';

/**
 * Adjusts column widths for compact display mode.
 * In compact mode:
 * - First column gets flex: 0.5 and minWidth: 50 (typically for row numbers)
 * - Second column gets flex capped at 1.5 (typically for names)
 * - Remaining columns are unchanged
 *
 * @param columns - Original column definitions
 * @param compactMode - Whether to apply compact adjustments
 * @returns Adjusted column definitions
 */
export const adjustColumnsForCompactMode = (
  columns: ReportingTableColumn[],
  compactMode: boolean,
): ReportingTableColumn[] => {
  if (!compactMode) {
    return columns;
  }

  // Adjust column widths for compact mode
  return columns.map((col, index): ReportingTableColumn => {
    if (index === 0) {
      // First column (usually #) - reduce width
      return {
        ...col,
        flex: 0.5,
        minWidth: 50,
      };
    }
    if (index === 1) {
      // Second column (usually name) - reduce width slightly
      return {
        ...col,
        flex: col.flex ? Math.min(col.flex, 1.5) : 1.5,
      };
    }
    return col;
  });
};

/**
 * A flexible reporting table component that wraps MUI DataGrid with optional infinite scroll.
 *
 * @remarks
 * This component provides a consistent table interface across the application with support for:
 * - Standard DataGrid rendering for static data
 * - Infinite scroll wrapper for paginated/lazy-loaded data
 * - Customizable grid and scroll container properties
 * - Compact column mode for tables with many columns (7+)
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
  // Apply compact column widths when compactColumns is enabled (for tables with 7 or more columns)
  const adjustedColumns = useMemo(
    () =>
      adjustColumnsForCompactMode(columns, gridProps?.compactColumns ?? false),
    [columns, gridProps?.compactColumns],
  );

  const grid = (
    <div className="datatable">
      <DataGrid {...(gridProps ?? {})} rows={rows} columns={adjustedColumns} />
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
