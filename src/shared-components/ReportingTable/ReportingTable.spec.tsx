import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReportingTable from './ReportingTable';
import type {
  ReportingTableColumn,
  ReportingRow,
  ReportingTableGridProps,
  InfiniteScrollProps,
} from '../../types/ReportingTable/interface';

const sampleColumns: ReportingTableColumn[] = [
  { field: 'id', headerName: 'ID', minWidth: 80, sortable: false },
  { field: 'name', headerName: 'Name', minWidth: 120, sortable: false },
];

const sampleRows: ReportingRow[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
];

describe('ReportingTable', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders DataGrid with provided rows and columns', () => {
    render(<ReportingTable rows={sampleRows} columns={sampleColumns} />);

    expect(screen.getByRole('grid')).toBeInTheDocument();
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThanOrEqual(3); // header + 2 data rows
  });

  it('passes through gridProps (noRowsOverlay when rows empty)', () => {
    const gridProps: ReportingTableGridProps = {
      slots: {
        noRowsOverlay: () => <div>No Data</div>,
      },
      hideFooter: true,
      autoHeight: true,
    };

    render(
      <ReportingTable
        rows={[]}
        columns={sampleColumns}
        gridProps={gridProps}
      />,
    );

    expect(screen.getByText('No Data')).toBeInTheDocument();
  });

  it('renders inside InfiniteScroll when infiniteProps provided', () => {
    const infiniteProps: InfiniteScrollProps = {
      dataLength: sampleRows.length,
      next: vi.fn(),
      hasMore: true,
    };

    render(
      <ReportingTable
        rows={sampleRows}
        columns={sampleColumns}
        gridProps={{ hideFooter: true }}
        infiniteProps={infiniteProps}
        listProps={{ 'data-testid': 'requests-list' }}
      />,
    );

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });
});
