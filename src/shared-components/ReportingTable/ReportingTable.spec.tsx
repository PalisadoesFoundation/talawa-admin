import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReportingTable, { adjustColumnsForCompactMode } from './ReportingTable';
import type {
  ReportingTableColumn,
  ReportingRow,
  ReportingTableGridProps,
  InfiniteScrollProps,
} from '../../types/ReportingTable/interface';

// DataGrid column config property (not CSS) - using constant to avoid lint false positive
const COL_MIN_WIDTH = 'minWidth' as const;

const sampleColumns: ReportingTableColumn[] = [
  { field: 'id', headerName: 'ID', [COL_MIN_WIDTH]: 80, sortable: false },
  { field: 'name', headerName: 'Name', [COL_MIN_WIDTH]: 120, sortable: false },
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

  describe('adjustColumnsForCompactMode function', () => {
    const sampleColumns: ReportingTableColumn[] = [
      {
        field: 'id',
        headerName: '#',
        flex: 1,
        [COL_MIN_WIDTH]: 80,
        sortable: false,
      },
      {
        field: 'name',
        headerName: 'Name',
        flex: 2,
        [COL_MIN_WIDTH]: 120,
        sortable: false,
      },
      {
        field: 'col3',
        headerName: 'Column 3',
        flex: 1,
        [COL_MIN_WIDTH]: 100,
        sortable: false,
      },
      {
        field: 'col4',
        headerName: 'Column 4',
        flex: 1.5,
        [COL_MIN_WIDTH]: 100,
        sortable: false,
      },
    ];

    it('returns original columns when compactMode is false', () => {
      const result = adjustColumnsForCompactMode(sampleColumns, false);

      expect(result).toEqual(sampleColumns);
      expect(result).toBe(sampleColumns); // Should return the same reference
    });

    it('adjusts first column to flex: 0.5 and minWidth: 50 when compactMode is true', () => {
      const result = adjustColumnsForCompactMode(sampleColumns, true);

      expect(result[0]).toEqual({
        field: 'id',
        headerName: '#',
        flex: 0.5,
        [COL_MIN_WIDTH]: 50,
        sortable: false,
      });
    });

    it('caps second column flex at 1.5 when compactMode is true', () => {
      const result = adjustColumnsForCompactMode(sampleColumns, true);

      // Original flex is 2, should be capped at 1.5
      expect(result[1].flex).toBe(1.5);
      expect(result[1].field).toBe('name');
      expect(result[1].headerName).toBe('Name');
      expect(result[1].minWidth).toBe(120); // Unchanged
    });

    it('uses 1.5 as default flex for second column when original flex is undefined', () => {
      const columnsWithoutFlex: ReportingTableColumn[] = [
        { field: 'id', headerName: '#', [COL_MIN_WIDTH]: 80, sortable: false },
        {
          field: 'name',
          headerName: 'Name',
          [COL_MIN_WIDTH]: 120,
          sortable: false,
        },
      ];

      const result = adjustColumnsForCompactMode(columnsWithoutFlex, true);

      expect(result[1].flex).toBe(1.5);
    });

    it('preserves second column flex if already less than or equal to 1.5', () => {
      const columnsWithSmallFlex: ReportingTableColumn[] = [
        {
          field: 'id',
          headerName: '#',
          flex: 1,
          [COL_MIN_WIDTH]: 80,
          sortable: false,
        },
        {
          field: 'name',
          headerName: 'Name',
          flex: 1.2,
          [COL_MIN_WIDTH]: 120,
          sortable: false,
        },
      ];

      const result = adjustColumnsForCompactMode(columnsWithSmallFlex, true);

      expect(result[1].flex).toBe(1.2); // Should preserve original flex
    });

    it('leaves remaining columns unchanged when compactMode is true', () => {
      const result = adjustColumnsForCompactMode(sampleColumns, true);

      // Third column should be unchanged
      expect(result[2]).toEqual(sampleColumns[2]);
      // Fourth column should be unchanged
      expect(result[3]).toEqual(sampleColumns[3]);
    });

    it('handles empty array', () => {
      const result = adjustColumnsForCompactMode([], true);

      expect(result).toEqual([]);
    });

    it('handles single column array', () => {
      const singleColumn: ReportingTableColumn[] = [
        {
          field: 'id',
          headerName: '#',
          flex: 1,
          [COL_MIN_WIDTH]: 80,
          sortable: false,
        },
      ];

      const result = adjustColumnsForCompactMode(singleColumn, true);

      expect(result[0].flex).toBe(0.5);
      expect(result[0][COL_MIN_WIDTH]).toBe(50);
    });

    it('handles two column array', () => {
      const twoColumns: ReportingTableColumn[] = [
        {
          field: 'id',
          headerName: '#',
          flex: 1,
          [COL_MIN_WIDTH]: 80,
          sortable: false,
        },
        {
          field: 'name',
          headerName: 'Name',
          flex: 3,
          [COL_MIN_WIDTH]: 120,
          sortable: false,
        },
      ];

      const result = adjustColumnsForCompactMode(twoColumns, true);

      expect(result[0].flex).toBe(0.5);
      expect(result[0][COL_MIN_WIDTH]).toBe(50);
      expect(result[1].flex).toBe(1.5); // Capped from 3
    });
  });
});
