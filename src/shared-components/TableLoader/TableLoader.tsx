/**
 * TableLoader renders a loading-only table using the shared DataTable component.
 *
 * It is intended for legacy or compatibility use where a table-shaped loading
 * skeleton is required without rendering actual data.
 *
 * The component delegates all skeleton rendering logic to DataTable by passing
 * an empty data set and enabling the loading state.
 *
 * @param noOfRows - Number of skeleton rows to display while loading.
 * @param headerTitles - Optional list of column header labels.
 *   When provided, the number of columns is derived from this array.
 * @param noOfCols - Optional number of columns to render when headerTitles
 *   is not provided.
 * @param data-testid - Optional test identifier for the root container.
 *
 * @throws Error if neither headerTitles nor noOfCols is provided.
 *
 * @returns A JSX element containing a DataTable in loading state.
 */
import React from 'react';
import DataTable from '../DataTable/DataTable';
import type { IColumnDef } from 'types/shared-components/DataTable/interface';
import type { InterfaceTableLoaderProps } from 'types/shared-components/TableLoader/interface';

const TableLoader = ({
  noOfRows,
  headerTitles,
  noOfCols,
  'data-testid': dataTestId,
}: InterfaceTableLoaderProps): JSX.Element => {
  // Move validation to render time (before any JSX)
  if (!headerTitles && !noOfCols) {
    throw new Error(
      'TableLoader error: Either headerTitles or noOfCols is required!',
    );
  }

  const columnCount = headerTitles?.length ?? noOfCols ?? 0;

  const columns: IColumnDef<Record<string, unknown>>[] =
    headerTitles?.map((title, index) => ({
      id: `col-${index}`,
      header: title,
      accessor: () => '',
    })) ??
    Array.from({ length: columnCount }).map((_, index) => ({
      id: `col-${index}`,
      header: '',
      accessor: () => '',
    }));

  return (
    <div data-testid={dataTestId ?? 'TableLoader'}>
      <DataTable
        data={[]}
        columns={columns}
        loading
        skeletonRows={noOfRows}
        paginationMode="client"
      />
    </div>
  );
};

export default TableLoader;
