import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import DataGridWrapper from './DataGridWrapper';

vi.mock('@mui/x-data-grid', () => ({
  DataGrid: ({
    rows,
    columns,
    'data-testid': dataTestId,
  }: {
    rows: { id: string; name: string }[];
    columns: { field: string; headerName: string }[];
    'data-testid'?: string;
  }) => (
    <div data-testid={dataTestId ?? 'data-grid'}>
      <span data-testid="grid-rows-count">{rows?.length ?? 0}</span>
      <span data-testid="grid-columns-count">{columns?.length ?? 0}</span>
    </div>
  ),
}));

interface InterfaceTestRow {
  id: string;
  name: string;
}

const defaultRows: InterfaceTestRow[] = [
  { id: '1', name: 'Tag 1' },
  { id: '2', name: 'Tag 2' },
];
const defaultColumns = [
  { field: 'id', headerName: 'ID' },
  { field: 'name', headerName: 'Name' },
];

describe('DataGridWrapper', () => {
  it('renders a container with class datatable', () => {
    render(
      <DataGridWrapper
        rows={defaultRows}
        columns={defaultColumns}
        getRowId={(row: InterfaceTestRow) => row.id}
      />,
    );
    const wrapper = document.querySelector('.datatable');
    expect(wrapper).toBeInTheDocument();
  });

  it('renders DataGrid with given rows and columns', () => {
    render(
      <DataGridWrapper
        rows={defaultRows}
        columns={defaultColumns}
        getRowId={(row: InterfaceTestRow) => row.id}
      />,
    );
    expect(screen.getByTestId('grid-rows-count')).toHaveTextContent('2');
    expect(screen.getByTestId('grid-columns-count')).toHaveTextContent('2');
  });

  it('passes through data-testid to DataGrid', () => {
    render(
      <DataGridWrapper
        rows={defaultRows}
        columns={defaultColumns}
        getRowId={(row: InterfaceTestRow) => row.id}
        data-testid="custom-grid"
      />,
    );
    expect(screen.getByTestId('custom-grid')).toBeInTheDocument();
  });

  it('renders with empty rows', () => {
    render(
      <DataGridWrapper
        rows={[]}
        columns={defaultColumns}
        getRowId={(row: InterfaceTestRow) => row.id}
      />,
    );
    expect(screen.getByTestId('grid-rows-count')).toHaveTextContent('0');
  });
});
