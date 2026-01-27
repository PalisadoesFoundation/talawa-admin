import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LoadingMoreRows } from './LoadingMoreRows';
import type { IColumnDef } from '../../types/shared-components/DataTable/interface';

describe('LoadingMoreRows', () => {
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

  describe('Basic Rendering', () => {
    it('renders skeleton rows with default count (5)', () => {
      render(
        <table>
          <tbody>
            <LoadingMoreRows columns={baseColumns} />
          </tbody>
        </table>,
      );

      const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(5);
    });

    it('renders skeleton rows with custom skeletonRows count', () => {
      render(
        <table>
          <tbody>
            <LoadingMoreRows columns={baseColumns} skeletonRows={3} />
          </tbody>
        </table>,
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
        <table>
          <tbody>
            <LoadingMoreRows columns={singleColumn} skeletonRows={2} />
          </tbody>
        </table>,
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
        <table>
          <tbody>
            <LoadingMoreRows columns={multiColumns} skeletonRows={2} />
          </tbody>
        </table>,
      );

      const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(2);

      // Each row should have 3 cells (one per column)
      skeletonRows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        expect(cells).toHaveLength(3);
      });
    });
  });

  describe('effectiveSelectable prop variations', () => {
    it('renders selection column when effectiveSelectable is true', () => {
      render(
        <table>
          <tbody>
            <LoadingMoreRows
              columns={baseColumns}
              skeletonRows={2}
              effectiveSelectable={true}
            />
          </tbody>
        </table>,
      );

      const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(2);

      // Each row should have: 1 selection cell + 2 data cells = 3 cells
      skeletonRows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        expect(cells).toHaveLength(3);
      });

      // Verify selection cells have correct attributes
      const selectionCells = screen.getAllByTestId('data-skeleton-cell');
      expect(selectionCells.length).toBeGreaterThan(0);
    });

    it('does not render selection column when effectiveSelectable is false', () => {
      render(
        <table>
          <tbody>
            <LoadingMoreRows
              columns={baseColumns}
              skeletonRows={2}
              effectiveSelectable={false}
            />
          </tbody>
        </table>,
      );

      const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(2);

      // Each row should have: 2 data cells (no selection column)
      skeletonRows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        expect(cells).toHaveLength(2);
      });
    });

    it('does not render selection column when effectiveSelectable is undefined (default)', () => {
      render(
        <table>
          <tbody>
            <LoadingMoreRows columns={baseColumns} skeletonRows={2} />
          </tbody>
        </table>,
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
    it('renders actions column when hasRowActions is true', () => {
      render(
        <table>
          <tbody>
            <LoadingMoreRows
              columns={baseColumns}
              skeletonRows={2}
              hasRowActions={true}
            />
          </tbody>
        </table>,
      );

      const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(2);

      // Each row should have: 2 data cells + 1 actions cell = 3 cells
      skeletonRows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        expect(cells).toHaveLength(3);
      });
    });

    it('does not render actions column when hasRowActions is false', () => {
      render(
        <table>
          <tbody>
            <LoadingMoreRows
              columns={baseColumns}
              skeletonRows={2}
              hasRowActions={false}
            />
          </tbody>
        </table>,
      );

      const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(2);

      // Each row should have: 2 data cells (no actions column)
      skeletonRows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        expect(cells).toHaveLength(2);
      });
    });

    it('does not render actions column when hasRowActions is undefined (default)', () => {
      render(
        <table>
          <tbody>
            <LoadingMoreRows columns={baseColumns} skeletonRows={2} />
          </tbody>
        </table>,
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
    it('renders all columns when both effectiveSelectable and hasRowActions are true', () => {
      render(
        <table>
          <tbody>
            <LoadingMoreRows
              columns={baseColumns}
              skeletonRows={2}
              effectiveSelectable={true}
              hasRowActions={true}
            />
          </tbody>
        </table>,
      );

      const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(2);

      // Each row should have: 1 selection + 2 data + 1 actions = 4 cells
      skeletonRows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        expect(cells).toHaveLength(4);
      });
    });

    it('renders only data columns when both effectiveSelectable and hasRowActions are false', () => {
      render(
        <table>
          <tbody>
            <LoadingMoreRows
              columns={baseColumns}
              skeletonRows={2}
              effectiveSelectable={false}
              hasRowActions={false}
            />
          </tbody>
        </table>,
      );

      const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(2);

      // Each row should have: 2 data cells only
      skeletonRows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        expect(cells).toHaveLength(2);
      });
    });

    it('renders selection column only when effectiveSelectable is true and hasRowActions is false', () => {
      render(
        <table>
          <tbody>
            <LoadingMoreRows
              columns={baseColumns}
              skeletonRows={2}
              effectiveSelectable={true}
              hasRowActions={false}
            />
          </tbody>
        </table>,
      );

      const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(2);

      // Each row should have: 1 selection + 2 data = 3 cells
      skeletonRows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        expect(cells).toHaveLength(3);
      });
    });

    it('renders actions column only when effectiveSelectable is false and hasRowActions is true', () => {
      render(
        <table>
          <tbody>
            <LoadingMoreRows
              columns={baseColumns}
              skeletonRows={2}
              effectiveSelectable={false}
              hasRowActions={true}
            />
          </tbody>
        </table>,
      );

      const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(2);

      // Each row should have: 2 data + 1 actions = 3 cells
      skeletonRows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        expect(cells).toHaveLength(3);
      });
    });
  });

  describe('Skeleton cell attributes', () => {
    it('renders skeleton cells with correct data-testid attribute', () => {
      render(
        <table>
          <tbody>
            <LoadingMoreRows
              columns={baseColumns}
              skeletonRows={2}
              effectiveSelectable={true}
              hasRowActions={true}
            />
          </tbody>
        </table>,
      );

      // Should have 2 rows * 4 cells each = 8 skeleton cells
      const skeletonCells = screen.getAllByTestId('data-skeleton-cell');
      expect(skeletonCells).toHaveLength(8);
    });

    it('renders skeleton cells with aria-hidden="true" attribute', () => {
      render(
        <table>
          <tbody>
            <LoadingMoreRows columns={baseColumns} skeletonRows={1} />
          </tbody>
        </table>,
      );

      const skeletonCells = screen.getAllByTestId('data-skeleton-cell');
      skeletonCells.forEach((cell) => {
        expect(cell).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('renders skeleton cells with correct CSS class', () => {
      const { container } = render(
        <table>
          <tbody>
            <LoadingMoreRows columns={baseColumns} skeletonRows={1} />
          </tbody>
        </table>,
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
        <table>
          <tbody>
            <LoadingMoreRows columns={baseColumns} skeletonRows={3} />
          </tbody>
        </table>,
      );

      expect(screen.getByTestId('skeleton-append-0')).toBeInTheDocument();
      expect(screen.getByTestId('skeleton-append-1')).toBeInTheDocument();
      expect(screen.getByTestId('skeleton-append-2')).toBeInTheDocument();
    });

    it('renders rows with unique keys', () => {
      const { container } = render(
        <table>
          <tbody>
            <LoadingMoreRows columns={baseColumns} skeletonRows={3} />
          </tbody>
        </table>,
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
        <table>
          <tbody>
            <LoadingMoreRows columns={baseColumns} skeletonRows={0} />
          </tbody>
        </table>,
      );

      const skeletonRows = screen.queryAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(0);
    });

    it('handles empty columns array', () => {
      render(
        <table>
          <tbody>
            <LoadingMoreRows
              columns={[]}
              skeletonRows={2}
              effectiveSelectable={true}
              hasRowActions={true}
            />
          </tbody>
        </table>,
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
        <table>
          <tbody>
            <LoadingMoreRows columns={baseColumns} skeletonRows={100} />
          </tbody>
        </table>,
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
        <table>
          <tbody>
            <LoadingMoreRows
              columns={columnsWithFunctionAccessor}
              skeletonRows={2}
            />
          </tbody>
        </table>,
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
        <table>
          <tbody>
            <LoadingMoreRows
              columns={columnsWithStringAccessor}
              skeletonRows={2}
            />
          </tbody>
        </table>,
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
        <table>
          <tbody>
            <LoadingMoreRows columns={baseColumns} skeletonRows={1} />
          </tbody>
        </table>,
      );

      const row = container.querySelector(
        'tr[data-testid^="skeleton-append-"]',
      );
      const cells = row?.querySelectorAll('td');
      expect(cells).toHaveLength(2);

      // Verify cells are rendered (keys are used internally by React)
      expect(cells?.[0]).toBeInTheDocument();
      expect(cells?.[1]).toBeInTheDocument();
    });

    it('handles columns with numeric ids', () => {
      const columnsWithNumericIds: IColumnDef<{ a: string; b: string }>[] = [
        { id: '1', header: 'First', accessor: 'a' as const },
        { id: '2', header: 'Second', accessor: 'b' as const },
      ];

      render(
        <table>
          <tbody>
            <LoadingMoreRows columns={columnsWithNumericIds} skeletonRows={1} />
          </tbody>
        </table>,
      );

      const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(1);

      const cells = skeletonRows[0].querySelectorAll('td');
      expect(cells).toHaveLength(2);
    });
  });
});
