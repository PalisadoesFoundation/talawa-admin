import React from 'react';

type DataTableRow = { id: string };

type DataTableAccessorsRow = Record<string, unknown>;

type DataTableAccessorsProps = {
  data: Array<DataTableAccessorsRow>;
  columns: Array<{
    accessor: ((row: DataTableAccessorsRow) => unknown) | string;
  }>;
  renderRow: (row: DataTableAccessorsRow, index: number) => void;
};

type SearchFilterBarProps = {
  dropdowns: Array<{ onOptionChange: (value: unknown) => void }>;
};

const dataTableWithData = (
  onData: ((data: Array<DataTableRow>) => void) | undefined,
  props: { data: Array<DataTableRow> },
) => {
  onData?.(props.data);
  return React.createElement('div', { 'data-testid': 'datatable-mock' });
};

const dataTableWithAccessors = (
  _unused: null,
  props: DataTableAccessorsProps,
) => {
  props.data.forEach((row, index) => {
    props.columns.forEach((col) => {
      if (typeof col.accessor === 'function') {
        col.accessor(row);
      }
    });
    props.renderRow(row, index);
  });
  return React.createElement('div', { 'data-testid': 'datatable-mock' });
};

const usersTableItem = (_unused: null) =>
  React.createElement('div', { 'data-testid': 'users-table-item' });

const searchFilterBarWithEffect = (
  onMount: (dropdowns: SearchFilterBarProps['dropdowns']) => void,
  props: SearchFilterBarProps,
) => {
  React.useEffect(() => {
    onMount(props.dropdowns);
  }, [onMount, props.dropdowns]);

  return React.createElement('div', { 'data-testid': 'mock-search-filter' });
};

export const getMockDataTable = (
  onData?: (data: Array<DataTableRow>) => void,
) =>
  dataTableWithData.bind(null, onData) as React.FC<{
    data: Array<DataTableRow>;
  }>;

export const getMockDataTableWithAccessors = () =>
  dataTableWithAccessors.bind(null, null) as React.FC<DataTableAccessorsProps>;

export const getMockUsersTableItem = () =>
  usersTableItem.bind(null, null) as React.FC;

export const getMockSearchFilterBar = (
  onMount: (dropdowns: SearchFilterBarProps['dropdowns']) => void,
) =>
  searchFilterBarWithEffect.bind(
    null,
    onMount,
  ) as React.FC<SearchFilterBarProps>;
