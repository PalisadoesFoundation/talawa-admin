import { cleanup, render, screen } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { DataTable } from './DataTable';
import { LoadingMoreRows } from './LoadingMoreRows';
import type { IColumnDef } from '../../types/shared-components/DataTable/interface';

/**
 * Shared column definitions used across test suites
 */
const baseColumns: IColumnDef<{ name: string; email: string }>[] = [
  {
    id: 'name',
    header: 'Name',
    accessor: 'name' as const,
  },
  {
    id: 'email',
    header: 'Email',
    accessor: 'email' as const,
  },
];

/**
 * Tests for LoadingMoreRows functionality (loadingMore prop in DataTable)
 *
 * This test file covers the inline loadingMore skeleton rows rendering
 * that appears when loadingMore=true in DataTable component.
 *
 * Coverage includes:
 * - Rendering with different numbers of columns
 * - effectiveSelectable prop variations (true/false)
 * - hasRowActions prop variations (true/false)
 * - Custom skeletonRows count
 * - Verify skeleton cells are rendered with correct attributes
 * - Check aria-hidden and data-testid attributes
 */
describe('LoadingMoreRows (loadingMore functionality)', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders skeleton rows with default count (5) when loadingMore is true', () => {
      render(
        <DataTable
          data={[{ name: 'Ada', email: 'ada@example.com' }]}
          columns={baseColumns}
          loadingMore
        />,
      );

      const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(5);
    });

    it('renders skeleton rows with custom skeletonRows count', () => {
      render(
        <DataTable
          data={[{ name: 'Ada', email: 'ada@example.com' }]}
          columns={baseColumns}
          loadingMore
          skeletonRows={3}
        />,
      );

      const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(3);
    });

    it('renders skeleton rows with single column', () => {
      const singleColumn: IColumnDef<{ name: string }>[] = [
        {
          id: 'name',
          header: 'Name',
          accessor: 'name' as const,
        },
      ];

      render(
        <DataTable
          data={[{ name: 'Ada' }]}
          columns={singleColumn}
          loadingMore
          skeletonRows={2}
        />,
      );

      const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(2);

      // Each row should have 1 cell for the column
      skeletonRows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        expect(cells).toHaveLength(1);
      });
    });

    it('renders skeleton rows with multiple columns', () => {
      const multiColumns: IColumnDef<{ a: string; b: string; c: string }>[] = [
        { id: 'a', header: 'A', accessor: 'a' as const },
        { id: 'b', header: 'B', accessor: 'b' as const },
        { id: 'c', header: 'C', accessor: 'c' as const },
      ];

      render(
        <DataTable
          data={[{ a: '1', b: '2', c: '3' }]}
          columns={multiColumns}
          loadingMore
          skeletonRows={2}
        />,
      );

      const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(2);

      // Each row should have 3 cells (one per column)
      skeletonRows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        expect(cells).toHaveLength(3);
      });
    });

    it('does not render skeleton rows when loadingMore is false', () => {
      render(
        <DataTable
          data={[{ name: 'Ada', email: 'ada@example.com' }]}
          columns={baseColumns}
          loadingMore={false}
          skeletonRows={3}
        />,
      );

      const skeletonRows = screen.queryAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(0);
    });
  });

  describe('effectiveSelectable prop variations', () => {
    it('renders selection column when selectable is true', () => {
      type Row = { id: string; name: string };
      render(
        <DataTable<Row>
          data={[{ id: '1', name: 'Ada' }]}
          columns={[{ id: 'name', header: 'Name', accessor: 'name' as const }]}
          loadingMore
          skeletonRows={2}
          selectable
          rowKey="id"
        />,
      );

      const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(2);

      // Each row should have: 1 selection cell + 1 data cell = 2 cells
      skeletonRows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        expect(cells).toHaveLength(2);
      });

      // Verify selection cells have correct attributes
      const selectionCells = screen.getAllByTestId('data-skeleton-cell');
      expect(selectionCells.length).toBeGreaterThan(0);
    });

    it('does not render selection column when selectable is false', () => {
      render(
        <DataTable
          data={[{ name: 'Ada', email: 'ada@example.com' }]}
          columns={baseColumns}
          loadingMore
          skeletonRows={2}
          selectable={false}
        />,
      );

      const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(2);

      // Each row should have: 2 data cells (no selection column)
      skeletonRows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        expect(cells).toHaveLength(2);
      });
    });

    it('does not render selection column when selectable is undefined (default)', () => {
      render(
        <DataTable
          data={[{ name: 'Ada', email: 'ada@example.com' }]}
          columns={baseColumns}
          loadingMore
          skeletonRows={2}
        />,
      );

      const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(2);

      // Each row should have: 2 data cells (no selection column by default)
      skeletonRows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        expect(cells).toHaveLength(2);
      });
    });
  });

  describe('hasRowActions prop variations', () => {
    it('renders actions column when rowActions are provided', () => {
      type Row = { id: string; name: string };
      render(
        <DataTable<Row>
          data={[{ id: '1', name: 'Ada' }]}
          columns={[{ id: 'name', header: 'Name', accessor: 'name' as const }]}
          loadingMore
          skeletonRows={2}
          rowKey="id"
          rowActions={[{ id: 'edit', label: 'Edit', onClick: () => {} }]}
        />,
      );

      const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(2);

      // Each row should have: 1 data cell + 1 actions cell = 2 cells
      skeletonRows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        expect(cells).toHaveLength(2);
      });
    });

    it('does not render actions column when rowActions are empty array', () => {
      type Row = { id: string; name: string };
      render(
        <DataTable<Row>
          data={[{ id: '1', name: 'Ada' }]}
          columns={[{ id: 'name', header: 'Name', accessor: 'name' as const }]}
          loadingMore
          skeletonRows={2}
          rowKey="id"
          rowActions={[]}
        />,
      );

      const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(2);

      // Each row should have: 1 data cell (no actions column)
      skeletonRows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        expect(cells).toHaveLength(1);
      });
    });

    it('does not render actions column when rowActions are undefined (default)', () => {
      render(
        <DataTable
          data={[{ name: 'Ada', email: 'ada@example.com' }]}
          columns={baseColumns}
          loadingMore
          skeletonRows={2}
        />,
      );

      const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(2);

      // Each row should have: 2 data cells (no actions column by default)
      skeletonRows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        expect(cells).toHaveLength(2);
      });
    });
  });

  describe('Combined prop variations', () => {
    it('renders all columns when both selectable and rowActions are provided', () => {
      type Row = { id: string; name: string };
      render(
        <DataTable<Row>
          data={[{ id: '1', name: 'Ada' }]}
          columns={[{ id: 'name', header: 'Name', accessor: 'name' as const }]}
          loadingMore
          skeletonRows={2}
          selectable
          rowKey="id"
          rowActions={[{ id: 'edit', label: 'Edit', onClick: () => {} }]}
        />,
      );

      const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(2);

      // Each row should have: 1 selection + 1 data + 1 actions = 3 cells
      skeletonRows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        expect(cells).toHaveLength(3);
      });
    });

    it('renders only data columns when both selectable and rowActions are false/empty', () => {
      render(
        <DataTable
          data={[{ name: 'Ada', email: 'ada@example.com' }]}
          columns={baseColumns}
          loadingMore
          skeletonRows={2}
          selectable={false}
          rowActions={[]}
        />,
      );

      const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(2);

      // Each row should have: 2 data cells only
      skeletonRows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        expect(cells).toHaveLength(2);
      });
    });

    it('renders selection column only when selectable is true and rowActions are empty', () => {
      type Row = { id: string; name: string };
      render(
        <DataTable<Row>
          data={[{ id: '1', name: 'Ada' }]}
          columns={[{ id: 'name', header: 'Name', accessor: 'name' as const }]}
          loadingMore
          skeletonRows={2}
          selectable
          rowKey="id"
          rowActions={[]}
        />,
      );

      const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(2);

      // Each row should have: 1 selection + 1 data = 2 cells
      skeletonRows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        expect(cells).toHaveLength(2);
      });
    });

    it('renders actions column only when selectable is false and rowActions are provided', () => {
      type Row = { id: string; name: string };
      render(
        <DataTable<Row>
          data={[{ id: '1', name: 'Ada' }]}
          columns={[{ id: 'name', header: 'Name', accessor: 'name' as const }]}
          loadingMore
          skeletonRows={2}
          selectable={false}
          rowKey="id"
          rowActions={[{ id: 'edit', label: 'Edit', onClick: () => {} }]}
        />,
      );

      const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(2);

      // Each row should have: 1 data + 1 actions = 2 cells
      skeletonRows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        expect(cells).toHaveLength(2);
      });
    });
  });

  describe('Skeleton cell attributes', () => {
    it('renders skeleton cells with correct data-testid attribute', () => {
      render(
        <DataTable
          data={[{ name: 'Ada', email: 'ada@example.com' }]}
          columns={baseColumns}
          loadingMore
          skeletonRows={2}
          selectable
          rowKey="name"
          rowActions={[{ id: 'edit', label: 'Edit', onClick: () => {} }]}
        />,
      );

      // Should have 2 rows * 4 cells each = 8 skeleton cells
      const skeletonCells = screen.getAllByTestId('data-skeleton-cell');
      expect(skeletonCells).toHaveLength(8);
    });

    it('renders skeleton cells with aria-hidden="true" attribute', () => {
      render(
        <DataTable
          data={[{ name: 'Ada', email: 'ada@example.com' }]}
          columns={baseColumns}
          loadingMore
          skeletonRows={1}
        />,
      );

      const skeletonCells = screen.getAllByTestId('data-skeleton-cell');
      skeletonCells.forEach((cell) => {
        expect(cell).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('renders skeleton cells with correct CSS class', () => {
      render(
        <DataTable
          data={[{ name: 'Ada', email: 'ada@example.com' }]}
          columns={baseColumns}
          loadingMore
          skeletonRows={1}
        />,
      );

      const skeletonCells = screen.getAllByTestId('data-skeleton-cell');
      skeletonCells.forEach((cell) => {
        // CSS modules hash class names, so check that className contains dataSkeletonCell
        expect(cell.className).toContain('dataSkeletonCell');
      });
    });
  });

  describe('Row attributes', () => {
    it('renders rows with correct data-testid pattern', () => {
      render(
        <DataTable
          data={[{ name: 'Ada', email: 'ada@example.com' }]}
          columns={baseColumns}
          loadingMore
          skeletonRows={3}
        />,
      );

      expect(screen.getByTestId('skeleton-append-0')).toBeInTheDocument();
      expect(screen.getByTestId('skeleton-append-1')).toBeInTheDocument();
      expect(screen.getByTestId('skeleton-append-2')).toBeInTheDocument();
    });

    it('renders rows with unique keys', () => {
      const { container } = render(
        <DataTable
          data={[{ name: 'Ada', email: 'ada@example.com' }]}
          columns={baseColumns}
          loadingMore
          skeletonRows={3}
        />,
      );

      const rows = container.querySelectorAll(
        'tr[data-testid^="skeleton-append-"]',
      );
      expect(rows).toHaveLength(3);

      // Verify each row has a unique key by checking data-testid
      const testIds = Array.from(rows).map((row) =>
        row.getAttribute('data-testid'),
      );
      const uniqueTestIds = new Set(testIds);
      expect(uniqueTestIds.size).toBe(3);
    });
  });

  describe('Edge cases', () => {
    it('handles zero skeletonRows gracefully', () => {
      render(
        <DataTable
          data={[{ name: 'Ada', email: 'ada@example.com' }]}
          columns={baseColumns}
          loadingMore
          skeletonRows={0}
        />,
      );

      const skeletonRows = screen.queryAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(0);
    });

    it('handles empty columns array', () => {
      type RowWithId = { id?: string };
      render(
        <DataTable<RowWithId>
          data={[{}]}
          columns={[]}
          loadingMore
          skeletonRows={2}
          selectable
          rowKey="id"
          rowActions={[{ id: 'edit', label: 'Edit', onClick: () => {} }]}
        />,
      );

      const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(2);

      // Each row should have: 1 selection + 0 data + 1 actions = 2 cells
      skeletonRows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        expect(cells).toHaveLength(2);
      });
    });

    it('handles large skeletonRows count', () => {
      render(
        <DataTable
          data={[{ name: 'Ada', email: 'ada@example.com' }]}
          columns={baseColumns}
          loadingMore
          skeletonRows={100}
        />,
      );

      const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(100);
    });

    it('handles columns with function accessors', () => {
      const columnsWithFunctionAccessor: IColumnDef<{
        name: string;
        value: number;
      }>[] = [
        {
          id: 'name',
          header: 'Name',
          accessor: (row) => row.name,
        },
        {
          id: 'double',
          header: 'Double',
          accessor: (row) => row.value * 2,
        },
      ];

      render(
        <DataTable
          data={[{ name: 'Test', value: 5 }]}
          columns={columnsWithFunctionAccessor}
          loadingMore
          skeletonRows={2}
        />,
      );

      const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(2);

      // Each row should have 2 cells (one per column)
      skeletonRows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        expect(cells).toHaveLength(2);
      });
    });

    it('handles columns with string accessors', () => {
      const columnsWithStringAccessor: IColumnDef<{
        name: string;
        email: string;
      }>[] = [
        {
          id: 'name',
          header: 'Name',
          accessor: 'name' as const,
        },
        {
          id: 'email',
          header: 'Email',
          accessor: 'email' as const,
        },
      ];

      render(
        <DataTable
          data={[{ name: 'Ada', email: 'ada@example.com' }]}
          columns={columnsWithStringAccessor}
          loadingMore
          skeletonRows={2}
        />,
      );

      const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(2);

      // Each row should have 2 cells (one per column)
      skeletonRows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        expect(cells).toHaveLength(2);
      });
    });
  });

  describe('Column key handling', () => {
    it('uses column id as key for skeleton cells', () => {
      const { container } = render(
        <DataTable
          data={[{ name: 'Ada', email: 'ada@example.com' }]}
          columns={baseColumns}
          loadingMore
          skeletonRows={1}
        />,
      );

      const row = container.querySelector(
        'tr[data-testid^="skeleton-append-"]',
      );
      expect(row).not.toBeNull();
      expect(row).toBeInTheDocument();
      if (row === null) return;

      const cells = row.querySelectorAll('td');
      expect(cells).toHaveLength(2);
      expect(cells[0]).toBeInTheDocument();
      expect(cells[1]).toBeInTheDocument();
    });

    it('handles columns with numeric ids', () => {
      const columnsWithNumericIds: IColumnDef<{ a: string; b: string }>[] = [
        { id: '1', header: 'First', accessor: 'a' as const },
        { id: '2', header: 'Second', accessor: 'b' as const },
      ];

      render(
        <DataTable
          data={[{ a: '1', b: '2' }]}
          columns={columnsWithNumericIds}
          loadingMore
          skeletonRows={1}
        />,
      );

      const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(1);

      const cells = skeletonRows[0].querySelectorAll('td');
      expect(cells).toHaveLength(2);
    });
  });

  describe('Integration with DataTable', () => {
    it('renders skeleton rows after existing data rows', () => {
      type Row = { id: string; name: string };
      render(
        <DataTable<Row>
          data={[
            { id: '1', name: 'Ada' },
            { id: '2', name: 'Bob' },
          ]}
          columns={[{ id: 'name', header: 'Name', accessor: 'name' as const }]}
          loadingMore
          skeletonRows={2}
          rowKey="id"
        />,
      );

      // Should have 2 data rows
      expect(screen.getByTestId('datatable-row-1')).toBeInTheDocument();
      expect(screen.getByTestId('datatable-row-2')).toBeInTheDocument();

      // Should have 2 skeleton rows
      expect(screen.getByTestId('skeleton-append-0')).toBeInTheDocument();
      expect(screen.getByTestId('skeleton-append-1')).toBeInTheDocument();
    });

    it('does not render skeleton rows when loadingMore is false even with data', () => {
      type Row = { id: string; name: string };
      render(
        <DataTable<Row>
          data={[{ id: '1', name: 'Ada' }]}
          columns={[{ id: 'name', header: 'Name', accessor: 'name' as const }]}
          loadingMore={false}
          skeletonRows={3}
          rowKey="id"
        />,
      );

      // Should have data row
      expect(screen.getByTestId('datatable-row-1')).toBeInTheDocument();

      // Should NOT have skeleton rows
      const skeletonRows = screen.queryAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(0);
    });

    it('does not render skeleton rows when data array is empty (empty state shown instead)', () => {
      render(
        <DataTable
          data={[]}
          columns={baseColumns}
          loadingMore
          skeletonRows={2}
        />,
      );

      // When data is empty, DataTable shows empty state instead of table
      // So skeleton rows won't be rendered
      expect(screen.getByTestId('datatable-empty')).toBeInTheDocument();
      const skeletonRows = screen.queryAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(0);
    });
  });
});

/**
 * Direct tests for LoadingMoreRows component
 *
 * These tests render LoadingMoreRows directly (not through DataTable)
 * to achieve 100% branch coverage, particularly testing default parameter values.
 */
describe('LoadingMoreRows (direct component tests)', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  /**
   * Helper function to render LoadingMoreRows within a table structure
   */
  const renderLoadingMoreRows = <T,>(
    props: Parameters<typeof LoadingMoreRows<T>>[0],
  ) => {
    return render(
      <table>
        <tbody>
          <LoadingMoreRows {...props} />
        </tbody>
      </table>,
    );
  };

  it('uses default skeletonRows value (5) when not provided', () => {
    renderLoadingMoreRows({
      columns: baseColumns,
      effectiveSelectable: false,
      hasRowActions: false,
      // skeletonRows not provided, should default to 5
    });

    const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
    expect(skeletonRows).toHaveLength(5);
  });

  it('renders selection column when effectiveSelectable is true', () => {
    renderLoadingMoreRows({
      columns: baseColumns,
      effectiveSelectable: true,
      hasRowActions: false,
      skeletonRows: 1,
    });

    const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
    expect(skeletonRows).toHaveLength(1);

    // Verify cell count: 1 selection + 2 data columns = 3 TDs
    const cells = skeletonRows[0].querySelectorAll('td');
    expect(cells).toHaveLength(3);
  });

  it('does not render selection column when effectiveSelectable is false', () => {
    renderLoadingMoreRows({
      columns: baseColumns,
      effectiveSelectable: false,
      hasRowActions: false,
      skeletonRows: 1,
    });

    const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
    expect(skeletonRows).toHaveLength(1);

    // Verify cell count: 2 data columns only = 2 TDs
    const cells = skeletonRows[0].querySelectorAll('td');
    expect(cells).toHaveLength(2);
  });

  it('renders actions column when hasRowActions is true', () => {
    renderLoadingMoreRows({
      columns: baseColumns,
      effectiveSelectable: false,
      hasRowActions: true,
      skeletonRows: 1,
    });

    const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
    expect(skeletonRows).toHaveLength(1);

    // Verify cell count: 2 data columns + 1 actions = 3 TDs
    const cells = skeletonRows[0].querySelectorAll('td');
    expect(cells).toHaveLength(3);
  });

  it('does not render actions column when hasRowActions is false', () => {
    renderLoadingMoreRows({
      columns: baseColumns,
      effectiveSelectable: true,
      hasRowActions: false,
      skeletonRows: 1,
    });

    const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
    expect(skeletonRows).toHaveLength(1);

    // Verify cell count: 1 selection + 2 data columns = 3 TDs (no actions column)
    const cells = skeletonRows[0].querySelectorAll('td');
    expect(cells).toHaveLength(3);
  });
});
