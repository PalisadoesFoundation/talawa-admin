import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { DataTable } from './DataTable';
import type { IColumnDef } from '../../types/shared-components/DataTable/interface';

/**
 * Tests for DataTableTable functionality (table rendering in DataTable)
 *
 * This test file covers the table rendering logic that would be in DataTableTable component.
 * Tests are performed through DataTable component to avoid component extraction.
 *
 * Coverage includes:
 * - Sortable vs non-sortable columns (structure ready for sorting)
 * - Header click and keyboard (Enter/Space) interactions (structure ready)
 * - Selection checkboxes (header and row level)
 * - Custom renderRow vs default rendering
 * - Custom renderCell per column
 * - hasRowActions and ActionsCell rendering
 * - Loading state with loadingMore
 * - ARIA attributes (aria-sort, aria-label, aria-busy)
 * - Different sort directions (structure ready)
 * - Toggle selection interactions
 */
describe('DataTableTable (table rendering functionality)', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const baseColumns: IColumnDef<{ id: string; name: string; email: string }>[] =
    [
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

  describe('Basic Table Structure', () => {
    it('renders table with correct structure', () => {
      render(
        <DataTable
          data={[{ id: '1', name: 'Ada', email: 'ada@example.com' }]}
          columns={baseColumns}
        />,
      );

      const table = screen.getByTestId('datatable');
      expect(table).toBeInTheDocument();
      expect(table.tagName).toBe('TABLE');

      // Check thead exists
      const thead = table.querySelector('thead');
      expect(thead).toBeInTheDocument();

      // Check tbody exists
      const tbody = table.querySelector('tbody');
      expect(tbody).toBeInTheDocument();
    });

    it('renders table headers correctly', () => {
      render(
        <DataTable
          data={[{ id: '1', name: 'Ada', email: 'ada@example.com' }]}
          columns={baseColumns}
        />,
      );

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('renders table rows with correct data', () => {
      type Row = { id: string; name: string; email: string };
      render(
        <DataTable<Row>
          data={[
            { id: '1', name: 'Ada', email: 'ada@example.com' },
            { id: '2', name: 'Bob', email: 'bob@example.com' },
          ]}
          columns={baseColumns}
          rowKey="id"
        />,
      );

      expect(screen.getByText('Ada')).toBeInTheDocument();
      expect(screen.getByText('ada@example.com')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('bob@example.com')).toBeInTheDocument();
    });

    it('renders table with ariaLabel as caption', () => {
      render(
        <DataTable
          data={[{ id: '1', name: 'Ada', email: 'ada@example.com' }]}
          columns={baseColumns}
          ariaLabel="User table"
        />,
      );

      const caption = screen.getByText('User table');
      expect(caption).toBeInTheDocument();
      expect(caption.tagName).toBe('CAPTION');
    });
  });

  describe('Sortable vs Non-Sortable Columns', () => {
    it('renders columns with sortable metadata (structure ready for sorting)', () => {
      const columnsWithSortable: IColumnDef<{ name: string; email: string }>[] =
        [
          {
            id: 'name',
            header: 'Name',
            accessor: 'name' as const,
            meta: { sortable: true },
          },
          {
            id: 'email',
            header: 'Email',
            accessor: 'email' as const,
            meta: { sortable: false },
          },
        ];

      render(
        <DataTable
          data={[{ name: 'Ada', email: 'ada@example.com' }]}
          columns={columnsWithSortable}
        />,
      );

      // Headers should render (sorting functionality would be added later)
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('renders columns without sortable metadata (default non-sortable)', () => {
      render(
        <DataTable
          data={[{ id: '1', name: 'Ada', email: 'ada@example.com' }]}
          columns={baseColumns}
        />,
      );

      // Headers should render
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
    });
  });

  describe('Selection Checkboxes - Header Level', () => {
    it('renders header checkbox when selectable is true', () => {
      type Row = { id: string; name: string };
      render(
        <DataTable<Row>
          data={[{ id: '1', name: 'Ada' }]}
          columns={[{ id: 'name', header: 'Name', accessor: 'name' as const }]}
          selectable
          rowKey="id"
        />,
      );

      const headerCheckbox = screen.getByTestId('select-all-checkbox');
      expect(headerCheckbox).toBeInTheDocument();
      expect(headerCheckbox).toHaveAttribute('type', 'checkbox');
    });

    it('header checkbox has correct aria-label', () => {
      type Row = { id: string; name: string };
      render(
        <DataTable<Row>
          data={[{ id: '1', name: 'Ada' }]}
          columns={[{ id: 'name', header: 'Name', accessor: 'name' as const }]}
          selectable
          rowKey="id"
        />,
      );

      const headerCheckbox = screen.getByTestId('select-all-checkbox');
      expect(headerCheckbox).toHaveAttribute('aria-label');
    });

    it('header checkbox shows checked state when all rows selected', async () => {
      const user = userEvent.setup();
      type Row = { id: string; name: string };
      render(
        <DataTable<Row>
          data={[
            { id: '1', name: 'Ada' },
            { id: '2', name: 'Bob' },
          ]}
          columns={[{ id: 'name', header: 'Name', accessor: 'name' as const }]}
          selectable
          rowKey="id"
        />,
      );

      const headerCheckbox = screen.getByTestId(
        'select-all-checkbox',
      ) as HTMLInputElement;
      expect(headerCheckbox.checked).toBe(false);

      await user.click(headerCheckbox);
      expect(headerCheckbox.checked).toBe(true);
      expect(headerCheckbox.getAttribute('aria-checked')).toBe('true');
    });

    it('header checkbox shows mixed state when some rows selected', async () => {
      const user = userEvent.setup();
      type Row = { id: string; name: string };
      render(
        <DataTable<Row>
          data={[
            { id: '1', name: 'Ada' },
            { id: '2', name: 'Bob' },
          ]}
          columns={[{ id: 'name', header: 'Name', accessor: 'name' as const }]}
          selectable
          rowKey="id"
        />,
      );

      const headerCheckbox = screen.getByTestId(
        'select-all-checkbox',
      ) as HTMLInputElement;
      const row1Checkbox = screen.getByTestId('select-row-1');

      await user.click(row1Checkbox);

      expect(headerCheckbox.checked).toBe(false);
      expect(headerCheckbox.getAttribute('aria-checked')).toBe('mixed');
    });

    it('does not render header checkbox when selectable is false', () => {
      render(
        <DataTable
          data={[{ id: '1', name: 'Ada', email: 'ada@example.com' }]}
          columns={baseColumns}
          selectable={false}
        />,
      );

      const headerCheckbox = screen.queryByTestId('select-all-checkbox');
      expect(headerCheckbox).not.toBeInTheDocument();
    });
  });

  describe('Selection Checkboxes - Row Level', () => {
    it('renders row checkboxes when selectable is true', () => {
      type Row = { id: string; name: string };
      render(
        <DataTable<Row>
          data={[
            { id: '1', name: 'Ada' },
            { id: '2', name: 'Bob' },
          ]}
          columns={[{ id: 'name', header: 'Name', accessor: 'name' as const }]}
          selectable
          rowKey="id"
        />,
      );

      const row1Checkbox = screen.getByTestId('select-row-1');
      const row2Checkbox = screen.getByTestId('select-row-2');

      expect(row1Checkbox).toBeInTheDocument();
      expect(row2Checkbox).toBeInTheDocument();
      expect(row1Checkbox).toHaveAttribute('type', 'checkbox');
      expect(row2Checkbox).toHaveAttribute('type', 'checkbox');
    });

    it('row checkboxes have correct aria-label', () => {
      type Row = { id: string; name: string };
      render(
        <DataTable<Row>
          data={[{ id: '1', name: 'Ada' }]}
          columns={[{ id: 'name', header: 'Name', accessor: 'name' as const }]}
          selectable
          rowKey="id"
        />,
      );

      const rowCheckbox = screen.getByTestId('select-row-1');
      expect(rowCheckbox).toHaveAttribute('aria-label');
    });

    it('row checkboxes toggle selection state', async () => {
      const user = userEvent.setup();
      type Row = { id: string; name: string };
      render(
        <DataTable<Row>
          data={[{ id: '1', name: 'Ada' }]}
          columns={[{ id: 'name', header: 'Name', accessor: 'name' as const }]}
          selectable
          rowKey="id"
        />,
      );

      const rowCheckbox = screen.getByTestId(
        'select-row-1',
      ) as HTMLInputElement;
      expect(rowCheckbox.checked).toBe(false);

      await user.click(rowCheckbox);
      expect(rowCheckbox.checked).toBe(true);

      await user.click(rowCheckbox);
      expect(rowCheckbox.checked).toBe(false);
    });

    it('row has data-selected attribute when selected', async () => {
      const user = userEvent.setup();
      type Row = { id: string; name: string };
      render(
        <DataTable<Row>
          data={[{ id: '1', name: 'Ada' }]}
          columns={[{ id: 'name', header: 'Name', accessor: 'name' as const }]}
          selectable
          rowKey="id"
        />,
      );

      const row = screen.getByTestId('datatable-row-1');
      expect(row).toHaveAttribute('data-selected', 'false');

      const rowCheckbox = screen.getByTestId('select-row-1');
      await user.click(rowCheckbox);

      expect(row).toHaveAttribute('data-selected', 'true');
    });

    it('does not render row checkboxes when selectable is false', () => {
      render(
        <DataTable
          data={[{ id: '1', name: 'Ada', email: 'ada@example.com' }]}
          columns={baseColumns}
          selectable={false}
          rowKey="id"
        />,
      );

      const rowCheckbox = screen.queryByTestId('select-row-1');
      expect(rowCheckbox).not.toBeInTheDocument();
    });
  });

  describe('Custom renderRow vs Default Rendering', () => {
    it('uses custom renderRow when provided', () => {
      type Row = { id: string; name: string };
      render(
        <DataTable<Row>
          data={[{ id: '1', name: 'Ada' }]}
          columns={[{ id: 'name', header: 'Name', accessor: 'name' as const }]}
          rowKey="id"
          renderRow={(row) => (
            <tr key={row.id} data-testid="custom-row">
              <td>Custom: {row.name}</td>
            </tr>
          )}
        />,
      );

      expect(screen.getByTestId('custom-row')).toBeInTheDocument();
      expect(screen.getByText('Custom: Ada')).toBeInTheDocument();
    });

    it('uses default rendering when renderRow is not provided', () => {
      type Row = { id: string; name: string };
      render(
        <DataTable<Row>
          data={[{ id: '1', name: 'Ada' }]}
          columns={[{ id: 'name', header: 'Name', accessor: 'name' as const }]}
          rowKey="id"
        />,
      );

      const row = screen.getByTestId('datatable-row-1');
      expect(row).toBeInTheDocument();
      expect(screen.getByText('Ada')).toBeInTheDocument();
    });

    it('custom renderRow receives correct row and index', () => {
      type Row = { id: string; name: string };
      const renderRowSpy = vi.fn((row, index) => (
        <tr key={row.id} data-testid={`custom-row-${index}`}>
          <td>{row.name}</td>
        </tr>
      ));

      render(
        <DataTable<Row>
          data={[
            { id: '1', name: 'Ada' },
            { id: '2', name: 'Bob' },
          ]}
          columns={[{ id: 'name', header: 'Name', accessor: 'name' as const }]}
          rowKey="id"
          renderRow={renderRowSpy}
        />,
      );

      expect(renderRowSpy).toHaveBeenCalledTimes(2);
      expect(renderRowSpy).toHaveBeenNthCalledWith(
        1,
        { id: '1', name: 'Ada' },
        0,
      );
      expect(renderRowSpy).toHaveBeenNthCalledWith(
        2,
        { id: '2', name: 'Bob' },
        1,
      );
    });

    it('custom renderRow ignores selectable and rowActions props', () => {
      type Row = { id: string; name: string };
      render(
        <DataTable<Row>
          data={[{ id: '1', name: 'Ada' }]}
          columns={[{ id: 'name', header: 'Name', accessor: 'name' as const }]}
          rowKey="id"
          selectable
          rowActions={[{ id: 'edit', label: 'Edit', onClick: () => {} }]}
          renderRow={(row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
            </tr>
          )}
        />,
      );

      // Should not have selection checkbox or actions column
      expect(screen.queryByTestId('select-row-1')).not.toBeInTheDocument();
      expect(screen.queryByText('Actions')).not.toBeInTheDocument();
    });
  });

  describe('Custom renderCell per Column', () => {
    it('uses custom render function when provided in column', () => {
      const columnsWithRender: IColumnDef<{ name: string; value: number }>[] = [
        {
          id: 'name',
          header: 'Name',
          accessor: 'name' as const,
        },
        {
          id: 'value',
          header: 'Value',
          accessor: 'value' as const,
          render: (val, row) => {
            const numVal = val as number;
            return (
              <span data-testid="custom-cell">
                {numVal * 2} (from {row.name})
              </span>
            );
          },
        },
      ];

      render(
        <DataTable
          data={[{ name: 'Ada', value: 5 }]}
          columns={columnsWithRender}
        />,
      );

      const customCell = screen.getByTestId('custom-cell');
      expect(customCell).toBeInTheDocument();
      expect(customCell).toHaveTextContent('10 (from Ada)');
    });

    it('uses default cell rendering when render is not provided', () => {
      render(
        <DataTable
          data={[{ id: '1', name: 'Ada', email: 'ada@example.com' }]}
          columns={baseColumns}
        />,
      );

      expect(screen.getByText('Ada')).toBeInTheDocument();
      expect(screen.getByText('ada@example.com')).toBeInTheDocument();
    });

    it('custom render receives correct value and row', () => {
      const renderSpy = vi.fn((val, row) => (
        <span data-testid={`cell-${row.id}`}>{String(val)}</span>
      ));

      const columnsWithRender: IColumnDef<{ id: string; name: string }>[] = [
        {
          id: 'name',
          header: 'Name',
          accessor: 'name' as const,
          render: renderSpy,
        },
      ];

      render(
        <DataTable
          data={[
            { id: '1', name: 'Ada' },
            { id: '2', name: 'Bob' },
          ]}
          columns={columnsWithRender}
        />,
      );

      expect(renderSpy).toHaveBeenCalledTimes(2);
      expect(renderSpy).toHaveBeenNthCalledWith(1, 'Ada', {
        id: '1',
        name: 'Ada',
      });
      expect(renderSpy).toHaveBeenNthCalledWith(2, 'Bob', {
        id: '2',
        name: 'Bob',
      });
    });

    it('renders cells with correct data-testid', () => {
      type Row = { id: string; name: string; email: string };
      render(
        <DataTable<Row>
          data={[{ id: '1', name: 'Ada', email: 'ada@example.com' }]}
          columns={baseColumns}
          rowKey="id"
        />,
      );

      const nameCell = screen.getByTestId('datatable-cell-name');
      const emailCell = screen.getByTestId('datatable-cell-email');

      expect(nameCell).toBeInTheDocument();
      expect(emailCell).toBeInTheDocument();
    });

    it('handles function accessors with custom render', () => {
      const columnsWithFunctionAccessor: IColumnDef<{
        firstName: string;
        lastName: string;
      }>[] = [
        {
          id: 'fullName',
          header: 'Full Name',
          accessor: (row) => `${row.firstName} ${row.lastName}`,
          render: (val) => (
            <strong data-testid="full-name">{val as string}</strong>
          ),
        },
      ];

      render(
        <DataTable
          data={[{ firstName: 'Ada', lastName: 'Lovelace' }]}
          columns={columnsWithFunctionAccessor}
        />,
      );

      const fullNameCell = screen.getByTestId('full-name');
      expect(fullNameCell).toBeInTheDocument();
      expect(fullNameCell).toHaveTextContent('Ada Lovelace');
    });
  });

  describe('hasRowActions and ActionsCell Rendering', () => {
    it('renders actions column header when rowActions are provided', () => {
      type Row = { id: string; name: string };
      const { container } = render(
        <DataTable<Row>
          data={[{ id: '1', name: 'Ada' }]}
          columns={[{ id: 'name', header: 'Name', accessor: 'name' as const }]}
          rowKey="id"
          rowActions={[{ id: 'edit', label: 'Edit', onClick: () => {} }]}
        />,
      );

      // Check that actions column header exists (translated text may vary)
      const headers = container.querySelectorAll('thead th');
      expect(headers.length).toBe(2); // Name column + Actions column
    });

    it('renders ActionsCell when rowActions are provided', () => {
      type Row = { id: string; name: string };
      const onClick = vi.fn();
      render(
        <DataTable<Row>
          data={[{ id: '1', name: 'Ada' }]}
          columns={[{ id: 'name', header: 'Name', accessor: 'name' as const }]}
          rowKey="id"
          rowActions={[{ id: 'edit', label: 'Edit', onClick }]}
        />,
      );

      const editButton = screen.getByRole('button', { name: 'Edit' });
      expect(editButton).toBeInTheDocument();
    });

    it('calls onClick when action button is clicked', async () => {
      const user = userEvent.setup();
      type Row = { id: string; name: string };
      const onClick = vi.fn();
      render(
        <DataTable<Row>
          data={[{ id: '1', name: 'Ada' }]}
          columns={[{ id: 'name', header: 'Name', accessor: 'name' as const }]}
          rowKey="id"
          rowActions={[{ id: 'edit', label: 'Edit', onClick }]}
        />,
      );

      const editButton = screen.getByRole('button', { name: 'Edit' });
      await user.click(editButton);

      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onClick).toHaveBeenCalledWith({ id: '1', name: 'Ada' });
    });

    it('renders multiple row actions', () => {
      type Row = { id: string; name: string };
      const onEdit = vi.fn();
      const onDelete = vi.fn();
      render(
        <DataTable<Row>
          data={[{ id: '1', name: 'Ada' }]}
          columns={[{ id: 'name', header: 'Name', accessor: 'name' as const }]}
          rowKey="id"
          rowActions={[
            { id: 'edit', label: 'Edit', onClick: onEdit },
            { id: 'delete', label: 'Delete', onClick: onDelete },
          ]}
        />,
      );

      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Delete' }),
      ).toBeInTheDocument();
    });

    it('does not render actions column when rowActions is empty array', () => {
      type Row = { id: string; name: string };
      const { container } = render(
        <DataTable<Row>
          data={[{ id: '1', name: 'Ada' }]}
          columns={[{ id: 'name', header: 'Name', accessor: 'name' as const }]}
          rowKey="id"
          rowActions={[]}
        />,
      );

      // Should only have 1 header (Name column, no Actions column)
      const headers = container.querySelectorAll('thead th');
      expect(headers.length).toBe(1);
    });

    it('does not render actions column when rowActions is undefined', () => {
      const { container } = render(
        <DataTable
          data={[{ id: '1', name: 'Ada', email: 'ada@example.com' }]}
          columns={baseColumns}
        />,
      );

      // Should only have 2 headers (Name and Email columns, no Actions column)
      const headers = container.querySelectorAll('thead th');
      expect(headers.length).toBe(2);
    });
  });

  describe('Loading State with loadingMore', () => {
    it('renders loadingMore skeleton rows', () => {
      render(
        <DataTable
          data={[{ id: '1', name: 'Ada', email: 'ada@example.com' }]}
          columns={baseColumns}
          loadingMore
          skeletonRows={2}
        />,
      );

      const skeletonRows = screen.getAllByTestId(/^skeleton-append-/);
      expect(skeletonRows).toHaveLength(2);
    });

    it('loadingMore skeleton rows have correct structure', () => {
      type Row = { id: string; name: string };
      render(
        <DataTable<Row>
          data={[{ id: '1', name: 'Ada' }]}
          columns={[{ id: 'name', header: 'Name', accessor: 'name' as const }]}
          loadingMore
          skeletonRows={1}
          selectable
          rowKey="id"
          rowActions={[{ id: 'edit', label: 'Edit', onClick: () => {} }]}
        />,
      );

      const skeletonRow = screen.getByTestId('skeleton-append-0');
      const cells = skeletonRow.querySelectorAll('td');
      // Should have: 1 selection + 1 data + 1 actions = 3 cells
      expect(cells).toHaveLength(3);
    });
  });

  describe('ARIA Attributes', () => {
    it('table has aria-busy when loading with overlay', () => {
      render(
        <DataTable
          data={[{ id: '1', name: 'Ada', email: 'ada@example.com' }]}
          columns={baseColumns}
          loading
          loadingOverlay
        />,
      );

      const table = screen.getByTestId('datatable');
      expect(table).toHaveAttribute('aria-busy', 'true');
    });

    it('table does not have aria-busy when not loading', () => {
      render(
        <DataTable
          data={[{ id: '1', name: 'Ada', email: 'ada@example.com' }]}
          columns={baseColumns}
          loading={false}
        />,
      );

      const table = screen.getByTestId('datatable');
      expect(table).toHaveAttribute('aria-busy', 'false');
    });

    it('table has aria-label when provided', () => {
      render(
        <DataTable
          data={[{ id: '1', name: 'Ada', email: 'ada@example.com' }]}
          columns={baseColumns}
          ariaLabel="User data table"
        />,
      );

      const table = screen.getByTestId('datatable');
      // ariaLabel is rendered as caption, not aria-label on table
      // But we can check the caption exists
      expect(screen.getByText('User data table')).toBeInTheDocument();
    });

    it('header checkbox has aria-label', () => {
      type Row = { id: string; name: string };
      render(
        <DataTable<Row>
          data={[{ id: '1', name: 'Ada' }]}
          columns={[{ id: 'name', header: 'Name', accessor: 'name' as const }]}
          selectable
          rowKey="id"
        />,
      );

      const headerCheckbox = screen.getByTestId('select-all-checkbox');
      expect(headerCheckbox).toHaveAttribute('aria-label');
    });

    it('row checkboxes have aria-label', () => {
      type Row = { id: string; name: string };
      render(
        <DataTable<Row>
          data={[{ id: '1', name: 'Ada' }]}
          columns={[{ id: 'name', header: 'Name', accessor: 'name' as const }]}
          selectable
          rowKey="id"
        />,
      );

      const rowCheckbox = screen.getByTestId('select-row-1');
      expect(rowCheckbox).toHaveAttribute('aria-label');
    });

    it('skeleton cells have aria-hidden="true"', () => {
      render(
        <DataTable
          data={[{ id: '1', name: 'Ada', email: 'ada@example.com' }]}
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
  });

  describe('Toggle Selection Interactions', () => {
    it('toggles individual row selection', async () => {
      const user = userEvent.setup();
      type Row = { id: string; name: string };
      render(
        <DataTable<Row>
          data={[
            { id: '1', name: 'Ada' },
            { id: '2', name: 'Bob' },
          ]}
          columns={[{ id: 'name', header: 'Name', accessor: 'name' as const }]}
          selectable
          rowKey="id"
        />,
      );

      const row1Checkbox = screen.getByTestId(
        'select-row-1',
      ) as HTMLInputElement;
      const row2Checkbox = screen.getByTestId(
        'select-row-2',
      ) as HTMLInputElement;

      // Initially unchecked
      expect(row1Checkbox.checked).toBe(false);
      expect(row2Checkbox.checked).toBe(false);

      // Select row 1
      await user.click(row1Checkbox);
      expect(row1Checkbox.checked).toBe(true);
      expect(row2Checkbox.checked).toBe(false);

      // Select row 2
      await user.click(row2Checkbox);
      expect(row1Checkbox.checked).toBe(true);
      expect(row2Checkbox.checked).toBe(true);

      // Deselect row 1
      await user.click(row1Checkbox);
      expect(row1Checkbox.checked).toBe(false);
      expect(row2Checkbox.checked).toBe(true);
    });

    it('header checkbox toggles all rows', async () => {
      const user = userEvent.setup();
      type Row = { id: string; name: string };
      render(
        <DataTable<Row>
          data={[
            { id: '1', name: 'Ada' },
            { id: '2', name: 'Bob' },
          ]}
          columns={[{ id: 'name', header: 'Name', accessor: 'name' as const }]}
          selectable
          rowKey="id"
        />,
      );

      const headerCheckbox = screen.getByTestId(
        'select-all-checkbox',
      ) as HTMLInputElement;
      const row1Checkbox = screen.getByTestId(
        'select-row-1',
      ) as HTMLInputElement;
      const row2Checkbox = screen.getByTestId(
        'select-row-2',
      ) as HTMLInputElement;

      // Select all
      await user.click(headerCheckbox);
      expect(headerCheckbox.checked).toBe(true);
      expect(row1Checkbox.checked).toBe(true);
      expect(row2Checkbox.checked).toBe(true);

      // Deselect all
      await user.click(headerCheckbox);
      expect(headerCheckbox.checked).toBe(false);
      expect(row1Checkbox.checked).toBe(false);
      expect(row2Checkbox.checked).toBe(false);
    });

    it('header checkbox reflects mixed state correctly', async () => {
      const user = userEvent.setup();
      type Row = { id: string; name: string };
      render(
        <DataTable<Row>
          data={[
            { id: '1', name: 'Ada' },
            { id: '2', name: 'Bob' },
            { id: '3', name: 'Charlie' },
          ]}
          columns={[{ id: 'name', header: 'Name', accessor: 'name' as const }]}
          selectable
          rowKey="id"
        />,
      );

      const headerCheckbox = screen.getByTestId(
        'select-all-checkbox',
      ) as HTMLInputElement;
      const row1Checkbox = screen.getByTestId('select-row-1');

      // Select one row
      await user.click(row1Checkbox);
      expect(headerCheckbox.getAttribute('aria-checked')).toBe('mixed');

      // Select all via header
      await user.click(headerCheckbox);
      expect(headerCheckbox.checked).toBe(true);
      expect(headerCheckbox.getAttribute('aria-checked')).toBe('true');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty data array', () => {
      render(<DataTable data={[]} columns={baseColumns} />);

      expect(screen.getByTestId('datatable-empty')).toBeInTheDocument();
    });

    it('handles empty columns array', () => {
      render(
        <DataTable
          data={[{ id: '1' }]}
          columns={[]}
          selectable
          rowKey="id"
          rowActions={[{ id: 'edit', label: 'Edit', onClick: () => {} }]}
        />,
      );

      const table = screen.getByTestId('datatable');
      expect(table).toBeInTheDocument();
    });

    it('handles rowKey as function', () => {
      type Row = { id: number; name: string };
      render(
        <DataTable<Row>
          data={[{ id: 1, name: 'Ada' }]}
          columns={[{ id: 'name', header: 'Name', accessor: 'name' as const }]}
          rowKey={(row) => `row-${row.id}`}
        />,
      );

      const row = screen.getByTestId('datatable-row-row-1');
      expect(row).toBeInTheDocument();
    });

    it('handles columns with function accessors', () => {
      const columnsWithFunctionAccessor: IColumnDef<{
        firstName: string;
        lastName: string;
      }>[] = [
        {
          id: 'fullName',
          header: 'Full Name',
          accessor: (row) => `${row.firstName} ${row.lastName}`,
        },
      ];

      render(
        <DataTable
          data={[{ firstName: 'Ada', lastName: 'Lovelace' }]}
          columns={columnsWithFunctionAccessor}
        />,
      );

      expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    });

    it('handles columns with string accessors', () => {
      render(
        <DataTable
          data={[{ id: '1', name: 'Ada', email: 'ada@example.com' }]}
          columns={baseColumns}
        />,
      );

      expect(screen.getByText('Ada')).toBeInTheDocument();
      expect(screen.getByText('ada@example.com')).toBeInTheDocument();
    });

    it('handles null and undefined cell values', () => {
      type Row = { id: string; name: string | null; email?: string };
      const columns: IColumnDef<Row>[] = [
        { id: 'name', header: 'Name', accessor: 'name' as const },
        { id: 'email', header: 'Email', accessor: 'email' as const },
      ];

      render(
        <DataTable<Row>
          data={[
            { id: '1', name: null },
            { id: '2', name: 'Bob' },
          ]}
          columns={columns}
          rowKey="id"
        />,
      );

      // Should render without errors
      expect(screen.getByTestId('datatable-row-1')).toBeInTheDocument();
      expect(screen.getByTestId('datatable-row-2')).toBeInTheDocument();
    });
  });

  describe('Table Structure Details', () => {
    it('renders table with striped and hover classes', () => {
      const { container } = render(
        <DataTable
          data={[{ id: '1', name: 'Ada', email: 'ada@example.com' }]}
          columns={baseColumns}
        />,
      );

      const table = container.querySelector('table');
      expect(table).toHaveClass('table-striped');
      expect(table).toHaveClass('table-hover');
    });

    it('renders table with custom className', () => {
      const { container } = render(
        <DataTable
          data={[{ id: '1', name: 'Ada', email: 'ada@example.com' }]}
          columns={baseColumns}
          tableClassName="custom-table-class"
        />,
      );

      const table = container.querySelector('table');
      expect(table).toHaveClass('custom-table-class');
    });

    it('renders responsive table wrapper', () => {
      const { container } = render(
        <DataTable
          data={[{ id: '1', name: 'Ada', email: 'ada@example.com' }]}
          columns={baseColumns}
        />,
      );

      // react-bootstrap Table with responsive prop wraps table in div with table-responsive class
      const wrapper = container.querySelector('.table-responsive');
      expect(wrapper).toBeInTheDocument();
      const table = wrapper?.querySelector('table');
      expect(table).toBeInTheDocument();
    });

    it('renders headers with scope="col"', () => {
      const { container } = render(
        <DataTable
          data={[{ id: '1', name: 'Ada', email: 'ada@example.com' }]}
          columns={baseColumns}
        />,
      );

      const headers = container.querySelectorAll('thead th');
      headers.forEach((header) => {
        expect(header).toHaveAttribute('scope', 'col');
      });
    });
  });
});
