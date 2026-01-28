import { render, screen, renderHook, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, afterEach, vi } from 'vitest';
import dayjs from 'dayjs';
import { DataTable } from './DataTable';
import { TableLoader } from './TableLoader';
import { useDataTableFiltering } from './hooks/useDataTableFiltering';
import { useDataTableSelection } from './hooks/useDataTableSelection';

describe('DataTable', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  /* ------------------------------------------------------------------
   * Basic rendering
   * ------------------------------------------------------------------ */

  it('filters rows via global search across searchable columns', () => {
    const columns = [
      {
        id: 'name',
        header: 'Name',
        accessor: 'name' as const,
        meta: { filterable: true, searchable: true },
      },
      {
        id: 'email',
        header: 'Email',
        accessor: 'email' as const,
        meta: { filterable: true, searchable: true },
      },
    ];
    const data = [
      { name: 'Ada Lovelace', email: 'ada@example.com' },
      { name: 'Bob', email: 'bob@example.com' },
    ];

    render(
      <DataTable
        data={data}
        columns={columns}
        showSearch
        initialGlobalSearch="ada"
      />,
    );

    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).toBeNull();
  });

  it('filters rows using meta.getSearchValue', () => {
    const columns = [
      {
        id: 'user',
        header: 'User',
        accessor: 'user' as const,
        meta: {
          searchable: true,
          getSearchValue: (row: { user: { name: string } }) => row.user.name,
        },
      },
    ];
    const data = [{ user: { name: 'Alice' } }, { user: { name: 'Bob' } }];

    render(
      <DataTable
        data={data}
        columns={columns}
        showSearch
        initialGlobalSearch="Alice"
      />,
    );

    expect(screen.getByText('{"name":"Alice"}')).toBeInTheDocument();
    expect(screen.queryByText('{"name":"Bob"}')).toBeNull();
  });

  it('excludes columns from search when meta.searchable is false', () => {
    const columns = [
      {
        id: 'name',
        header: 'Name',
        accessor: 'name' as const,
        meta: { searchable: true },
      },
      {
        id: 'email',
        header: 'Email',
        accessor: 'email' as const,
        meta: { searchable: false },
      },
    ];
    const data = [{ name: 'Ada', email: 'secret@example.com' }];

    // Search for email content, which should be ignored
    render(
      <DataTable
        data={data}
        columns={columns}
        showSearch
        initialGlobalSearch="secret"
      />,
    );

    expect(screen.queryByText('Ada')).toBeNull();
  });

  it('updates global search in uncontrolled mode', async () => {
    const user = userEvent.setup();
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];
    const data = [{ name: 'Ada' }, { name: 'Bob' }];

    render(<DataTable data={data} columns={columns} showSearch />);

    // Initially both visible
    expect(screen.getByText('Ada')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();

    // Type in search box
    const input = screen.getByRole('searchbox');
    await user.type(input, 'Ada');

    // Should filter
    expect(screen.getByText('Ada')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).toBeNull();
  });

  it('filters rows based on columnFilters prop', () => {
    const columns = [
      {
        id: 'name',
        header: 'Name',
        accessor: 'name' as const,
        meta: {
          filterable: true,
          filterFn: (row: { name: string }, val: unknown) =>
            row.name === String(val),
        },
      },
    ];
    const data = [{ name: 'Ada' }, { name: 'Bob' }];

    render(
      <DataTable
        data={data}
        columns={columns}
        columnFilters={{ name: 'Bob' }}
        onColumnFiltersChange={() => {}}
      />,
    );

    expect(screen.queryByText('Ada')).toBeNull();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('uses custom filterFn if provided', () => {
    const columns = [
      {
        id: 'age',
        header: 'Age',
        accessor: 'age' as const,
        meta: {
          filterable: true,
          // Custom filter: exact number match from string input
          filterFn: (row: { age: number }, val: unknown) =>
            row.age === Number(val),
        },
      },
    ];
    const data = [{ age: 10 }, { age: 20 }];

    render(
      <DataTable
        data={data}
        columns={columns}
        columnFilters={{ age: '20' }}
        onColumnFiltersChange={() => {}}
      />,
    );

    expect(screen.queryByText('10')).toBeNull();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('uses default text filter when no custom filterFn is provided', () => {
    const columns = [
      {
        id: 'name',
        header: 'Name',
        accessor: 'name' as const,
        meta: { filterable: true }, // no custom filterFn
      },
    ];
    const data = [{ name: 'Alice' }, { name: 'Bob' }];

    render(
      <DataTable
        data={data}
        columns={columns}
        columnFilters={{ name: 'Bob' }}
        onColumnFiltersChange={() => {}}
      />,
    );

    expect(screen.queryByText('Alice')).toBeNull();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('uses shallow equality for non-string filter values', () => {
    const columns = [
      {
        id: 'id',
        header: 'ID',
        accessor: 'id' as const,
        meta: { filterable: true },
      },
    ];
    const data = [{ id: 1 }, { id: 2 }];

    render(
      <DataTable
        data={data}
        columns={columns}
        columnFilters={{ id: 2 }}
        onColumnFiltersChange={() => {}}
      />,
    );

    expect(screen.queryByText('1')).toBeNull();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('skips empty filter values gracefully', () => {
    const columns = [
      {
        id: 'name',
        header: 'Name',
        accessor: 'name' as const,
        meta: { filterable: true },
      },
    ];
    const data = [{ name: 'Alice' }, { name: 'Bob' }];

    render(
      <DataTable
        data={data}
        columns={columns}
        columnFilters={{ name: '' }} // empty filter should be skipped
        onColumnFiltersChange={() => {}}
      />,
    );

    // Both should be visible since empty filter is skipped
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('renders custom rows using renderRow prop', () => {
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];
    const data = [{ name: 'Ada' }];

    render(
      <DataTable
        data={data}
        columns={columns}
        renderRow={(row: (typeof data)[number]) => (
          <tr key={row.name}>
            <td data-testid="custom-row">Custom: {row.name}</td>
          </tr>
        )}
      />,
    );

    expect(screen.getByTestId('custom-row')).toHaveTextContent('Custom: Ada');
  });

  it('skips filter for unknown column ids', () => {
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];
    const data = [{ name: 'Alice' }, { name: 'Bob' }];

    render(
      <DataTable
        data={data}
        columns={columns}
        columnFilters={{ unknownColumn: 'test' }} // filter for non-existent column
        onColumnFiltersChange={() => {}}
      />,
    );

    // Both should be visible since the filter column doesn't exist
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('skips filter for columns with filterable: false', () => {
    const columns = [
      {
        id: 'name',
        header: 'Name',
        accessor: 'name' as const,
        meta: { filterable: false },
      },
    ];
    const data = [{ name: 'Alice' }, { name: 'Bob' }];

    render(
      <DataTable
        data={data}
        columns={columns}
        columnFilters={{ name: 'Alice' }}
        onColumnFiltersChange={() => {}}
      />,
    );

    // Both should be visible since filtering is disabled for this column
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('applies custom tableClassName', () => {
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];
    const data = [{ name: 'Ada' }];

    const { container } = render(
      <DataTable data={data} columns={columns} tableClassName="custom-table" />,
    );

    expect(container.querySelector('table.custom-table')).toBeInTheDocument();
  });

  it('resets to page 1 when search changes in uncontrolled client pagination', async () => {
    const user = userEvent.setup();
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];
    const data = [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }];

    render(
      <DataTable
        data={data}
        columns={columns}
        paginationMode="client"
        pageSize={10}
        showSearch
        initialGlobalSearch=""
      />,
    );

    // Type in search - this exercises updateGlobalSearch with client pagination
    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, 'Bob');

    // Should filter to just Bob
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.queryByText('Alice')).toBeNull();
  });

  it('searches Date values correctly', () => {
    const testDate = dayjs().subtract(30, 'days').toDate();
    const olderDate = dayjs().subtract(60, 'days').toDate();
    const columns = [
      {
        id: 'date',
        header: 'Date',
        accessor: 'date' as const,
      },
    ];
    const data = [{ date: testDate }, { date: olderDate }];

    // Get part of ISO string for search
    const searchStr = testDate.toISOString().substring(0, 7);

    render(
      <DataTable
        data={data}
        columns={columns}
        showSearch
        initialGlobalSearch={searchStr}
      />,
    );

    // Should find the row with the matching date (rendered as JSON string)
    expect(screen.getByText(`"${testDate.toISOString()}"`)).toBeInTheDocument();
  });

  it('handles null and undefined cell values in search', () => {
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];
    const data = [
      { name: null as unknown as string },
      { name: undefined as unknown as string },
      { name: 'Valid' },
    ];

    render(
      <DataTable
        data={data}
        columns={columns}
        showSearch
        initialGlobalSearch="Valid"
      />,
    );

    // Should find the valid row and not crash on null/undefined
    expect(screen.getByText('Valid')).toBeInTheDocument();
  });

  it('server modes do not filter locally', async () => {
    const user = userEvent.setup();
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];
    const data = [{ name: 'Ada' }, { name: 'Bob' }];
    const onSearch = vi.fn();

    render(
      <DataTable
        data={data}
        columns={columns}
        showSearch
        globalSearch=""
        onGlobalSearchChange={onSearch}
        columnFilters={{}}
        onColumnFiltersChange={() => {}}
        serverSearch
        serverFilter // Should prevent local filtering even if we had filters
      />,
    );

    // Simulate search
    const input = screen.getByRole('searchbox');
    await user.type(input, 'Ada');

    expect(onSearch).toHaveBeenCalled();
    // Both should still be present because serverSearch=true disables local filtering
    expect(screen.getByText('Ada')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('renders headers and rows', () => {
    const columns = [
      {
        id: 'name',
        header: 'Name',
        accessor: (row: { name: string }) => row.name,
      },
    ];

    render(<DataTable data={[{ name: 'Ada' }]} columns={columns} />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Ada')).toBeInTheDocument();
  });

  it('renders header when header is a function', () => {
    const columns = [
      {
        id: 'name',
        header: () => 'Dynamic Header',
        accessor: (row: { name: string }) => row.name,
      },
    ];

    render(<DataTable data={[{ name: 'Test' }]} columns={columns} />);

    expect(screen.getByText('Dynamic Header')).toBeInTheDocument();
  });

  /* ------------------------------------------------------------------
   * Cell rendering
   * ------------------------------------------------------------------ */

  it('renders cell using string accessor', () => {
    const columns = [{ id: 'foo', header: 'Foo', accessor: 'foo' as const }];

    render(<DataTable data={[{ foo: 'bar' }]} columns={columns} />);

    expect(screen.getByText('bar')).toBeInTheDocument();
  });

  it('renders cell using function accessor', () => {
    const columns = [
      {
        id: 'double',
        header: 'Double',
        accessor: (row: { value: number }) => row.value * 2,
      },
    ];

    render(<DataTable data={[{ value: 5 }]} columns={columns} />);

    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('renders empty string for null or undefined cell values', () => {
    const columns = [
      {
        id: 'foo',
        header: 'Foo',
        accessor: (row: { foo?: string }) => row.foo,
      },
    ];

    render(<DataTable data={[{}]} columns={columns} />);

    const cell = screen.getByRole('cell');
    expect(cell).toHaveTextContent('');
  });

  it('uses custom render function for cell', () => {
    interface IRow {
      name: string;
    }

    interface IColumnDef {
      id: string;
      header: string;
      accessor: (row: IRow) => string;
      render: (value: unknown, row: IRow) => JSX.Element;
    }

    const columns: IColumnDef[] = [
      {
        id: 'name',
        header: 'Name',
        accessor: (row: IRow) => row.name,
        render: (value: unknown) => (
          <span data-testid="custom">{String(value).toUpperCase()}</span>
        ),
      },
    ];

    render(<DataTable data={[{ name: 'ada' }]} columns={columns} />);

    expect(screen.getByTestId('custom')).toHaveTextContent('ADA');
  });

  it('renders object and array cell values as JSON', () => {
    const columns = [
      { id: 'obj', header: 'Obj', accessor: (row: { obj: object }) => row.obj },
      {
        id: 'arr',
        header: 'Arr',
        accessor: (row: { arr: unknown[] }) => row.arr,
      },
    ];
    const data = [{ obj: { foo: 'bar', num: 42 }, arr: [1, 2, 3] }];
    render(<DataTable data={data} columns={columns} />);
    // Should render JSON stringified values
    expect(screen.getByText('{"foo":"bar","num":42}')).toBeInTheDocument();
    expect(screen.getByText('[1,2,3]')).toBeInTheDocument();
  });

  it('renders empty string for unstringifiable cell values', () => {
    const columns = [
      {
        id: 'cyc',
        header: 'Cyc',
        accessor: (row: { cyc: unknown }) => row.cyc,
      },
    ];
    // Create a cyclic object
    const cyclic: Record<string, unknown> = {};
    (cyclic as Record<string, unknown>).self = cyclic;
    render(<DataTable data={[{ cyc: cyclic }]} columns={columns} />);
    // Should render empty string for cyclic object
    const cell = screen.getByRole('cell');
    expect(cell).toHaveTextContent('');
  });

  /* ------------------------------------------------------------------
   * Row key handling
   * ------------------------------------------------------------------ */

  it('uses rowKey function when provided', () => {
    const columns = [
      { id: 'id', header: 'ID', accessor: (row: { id: number }) => row.id },
    ];

    render(
      <DataTable
        data={[{ id: 1 }]}
        columns={columns}
        rowKey={(row: { id: number }) => `row-${row.id}`}
      />,
    );

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('uses rowKey string when property exists', () => {
    const columns = [
      { id: 'id', header: 'ID', accessor: (row: { id: number }) => row.id },
    ];

    render(<DataTable data={[{ id: 42 }]} columns={columns} rowKey="id" />);

    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('falls back to index when rowKey property is missing or invalid', () => {
    type Row = { value: number };
    const columns = [
      { id: 'value', header: 'Value', accessor: (row: Row) => row.value },
    ];

    render(<DataTable<Row> data={[{ value: 5 }]} columns={columns} />);

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('coerces non-string/number rowKey values to string', () => {
    type Row = { flag: boolean; name: string };
    const columns = [
      { id: 'name', header: 'Name', accessor: (row: Row) => row.name },
    ];

    render(
      <DataTable<Row>
        data={[
          { flag: true, name: 'TrueRow' },
          { flag: false, name: 'FalseRow' },
        ]}
        columns={columns}
        rowKey="flag"
      />,
    );

    expect(screen.getByText('TrueRow')).toBeInTheDocument();
    expect(screen.getByText('FalseRow')).toBeInTheDocument();
  });

  it('falls back to index when rowKey property is null or undefined', () => {
    type Row = { id?: number | null; value: string };
    const columns = [
      { id: 'value', header: 'Value', accessor: (row: Row) => row.value },
    ];

    // One row with id: null, one row with id omitted
    const data: Row[] = [{ id: null, value: 'NullId' }, { value: 'NoId' }];

    render(<DataTable<Row> data={data} columns={columns} rowKey="id" />);

    // Both rows should render their cell text
    expect(screen.getByText('NullId')).toBeInTheDocument();
    expect(screen.getByText('NoId')).toBeInTheDocument();
  });

  /* ------------------------------------------------------------------
   * States: error, loading, empty
   * ------------------------------------------------------------------ */

  it('renders error state with default error message and accessibility attributes', () => {
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' }];
    const error = new Error('Failure');

    render(<DataTable data={[]} columns={columns} error={error} />);

    const errorDiv = screen.getByTestId('datatable-error');
    expect(errorDiv).toHaveAttribute('role', 'alert');
    expect(errorDiv).toHaveAttribute('aria-live', 'assertive');
    expect(errorDiv).toHaveTextContent('Failure');
  });

  it('renders custom error when renderError is provided', () => {
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' }];
    const error = new Error('Boom');

    render(
      <DataTable
        data={[]}
        columns={columns}
        error={error}
        renderError={(e: Error) => <span>Custom: {e.message}</span>}
      />,
    );

    expect(screen.getByText('Custom: Boom')).toBeInTheDocument();
  });

  it('renders empty state with custom emptyMessage and accessibility attributes', () => {
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' }];

    render(
      <DataTable data={[]} columns={columns} emptyMessage="Nothing here!" />,
    );

    const emptyDiv = screen.getByTestId('datatable-empty');
    expect(emptyDiv.tagName).toBe('OUTPUT');
    expect(emptyDiv).toHaveAttribute('aria-live', 'polite');
    expect(emptyDiv).toHaveTextContent('Nothing here!');
  });
  it('renders error state with precedence over loading and empty', () => {
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' }];
    const error = new Error('Boom');

    render(
      <DataTable data={[]} columns={columns} error={error} loading={true} />,
    );

    // Error state should be present
    expect(screen.getByTestId('datatable-error')).toBeInTheDocument();
    // Table and empty state should not be present
    expect(screen.queryByRole('table')).toBeNull();
    expect(screen.queryByTestId('datatable-empty')).toBeNull();
  });

  it('renders skeleton table when loading is true', () => {
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' }];

    render(<DataTable data={[]} columns={columns} loading skeletonRows={3} />);

    const table = screen.getByRole('table');
    expect(table).toHaveAttribute('aria-busy', 'true');
    expect(screen.getAllByRole('row')).toHaveLength(4); // 1 header + 3 skeleton rows
  });

  it('renders skeleton table with selection and actions columns when loading', () => {
    type Row = { id: string; name: string };
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];

    render(
      <DataTable<Row>
        data={[]}
        columns={columns}
        loading
        skeletonRows={2}
        selectable
        rowKey="id"
        rowActions={[{ id: 'edit', label: 'Edit', onClick: () => {} }]}
      />,
    );

    const table = screen.getByRole('table');
    expect(table).toHaveAttribute('aria-busy', 'true');

    // Header row should have 3 columns: select + name + actions
    const headerCells = screen.getAllByRole('columnheader');
    expect(headerCells).toHaveLength(3);

    // Each skeleton row should have 3 cells: select + name + actions
    const skeletonRows = screen.getAllByTestId(/^skeleton-row-/);
    expect(skeletonRows).toHaveLength(2);
    skeletonRows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      expect(cells).toHaveLength(3);
    });

    // Total skeleton cells: 2 rows * 3 columns = 6 cells with data-testid
    const skeletonCells = screen.getAllByTestId('data-skeleton-cell');
    expect(skeletonCells).toHaveLength(6);
  });

  it('renders <caption> with ariaLabel in both loading and table content states', () => {
    const columns = [
      {
        id: 'name',
        header: 'Name',
        accessor: (row: { name: string }) => row.name,
      },
    ];
    const ariaLabel = 'Test Table Caption';

    // Loading state
    const { rerender } = render(
      <DataTable
        data={[]}
        columns={columns}
        loading={true}
        ariaLabel={ariaLabel}
      />,
    );
    let caption = document.querySelector('caption');
    expect(caption).toBeInTheDocument();
    expect(caption).toHaveTextContent(ariaLabel);

    // Table content state
    rerender(
      <DataTable
        data={[{ name: 'Ada' }]}
        columns={columns}
        ariaLabel={ariaLabel}
      />,
    );
    caption = document.querySelector('caption');
    expect(caption).toBeInTheDocument();
    expect(caption).toHaveTextContent(ariaLabel);
  });

  /* ------------------------------------------------------------------
   * Loading optimizations: overlay and loadingMore
   * ------------------------------------------------------------------ */

  it('renders loading overlay with existing rows when loadingOverlay is true', () => {
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];
    const data = [{ name: 'Ada' }];

    render(
      <DataTable
        data={data}
        columns={columns}
        loading
        loadingOverlay
        skeletonRows={4}
      />,
    );

    expect(screen.getByTestId('datatable')).toBeInTheDocument();
    const overlay = screen.getByTestId('table-loader-overlay');
    expect(overlay).toBeInTheDocument();

    // Overlay should render a skeleton grid with min(skeletonRows, 3) rows and column-aligned cells
    const rows = overlay.querySelectorAll('[data-testid^="skeleton-row-"]');
    expect(rows.length).toBe(3);
    rows.forEach((row) => {
      const cells = row.querySelectorAll('[data-testid="table-loader-cell"]');
      expect(cells.length).toBe(columns.length);
    });
  });

  it('appends skeleton rows when loadingMore is true', () => {
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];
    const data = [{ name: 'Ada' }];

    render(
      <DataTable
        data={data}
        columns={columns}
        paginationMode="client"
        loadingMore
        skeletonRows={2}
      />,
    );

    const appended = document.querySelectorAll(
      '[data-testid^="skeleton-append-"]',
    );
    expect(appended.length).toBe(2);
    appended.forEach((row) => {
      const cells = row.querySelectorAll('[data-testid="data-skeleton-cell"]');
      expect(cells.length).toBe(columns.length);
    });
  });

  /* ------------------------------------------------------------------
   * Loading overlay behavior (loadingOverlay prop)
   * ------------------------------------------------------------------ */

  it('renders loading overlay when loading=true and loadingOverlay=true with existing data', () => {
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];
    const data = [{ name: 'Ada' }, { name: 'Bob' }];

    render(<DataTable data={data} columns={columns} loading loadingOverlay />);

    // Table with data should still render
    expect(screen.getByTestId('datatable')).toBeInTheDocument();
    expect(screen.getByText('Ada')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();

    // Overlay with skeleton grid should render
    const overlay = screen.getByTestId('table-loader-overlay');
    expect(overlay).toBeInTheDocument();

    // Overlay should have aria-busy=true on the table
    expect(screen.getByTestId('datatable')).toHaveAttribute(
      'aria-busy',
      'true',
    );
  });

  it('does not render overlay when loading=true but loadingOverlay=false (default)', () => {
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];
    const data = [{ name: 'Ada' }];

    render(<DataTable data={data} columns={columns} loading />);

    // Table should render
    expect(screen.getByTestId('datatable')).toBeInTheDocument();
    // No overlay
    expect(
      screen.queryByTestId('table-loader-overlay'),
    ).not.toBeInTheDocument();
  });

  it('does not render overlay when loadingOverlay=true but loading=false', () => {
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];
    const data = [{ name: 'Ada' }];

    render(<DataTable data={data} columns={columns} loadingOverlay />);

    // Table should render
    expect(screen.getByTestId('datatable')).toBeInTheDocument();
    // No overlay (loading must be true)
    expect(
      screen.queryByTestId('table-loader-overlay'),
    ).not.toBeInTheDocument();
  });

  it('does not render overlay when loading=true but no data exists (initial load)', () => {
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];

    render(<DataTable data={[]} columns={columns} loading loadingOverlay />);

    // Initial load: render skeleton grid instead of table
    expect(screen.queryByTestId('datatable')).not.toBeInTheDocument();
    // No overlay (only used for refetch with existing data)
    expect(
      screen.queryByTestId('table-loader-overlay'),
    ).not.toBeInTheDocument();
  });

  it('simulates refetch scenario: overlay appears and disappears when loading state toggles', () => {
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];
    const data = [{ name: 'Ada' }];
    const { rerender } = render(
      <DataTable
        data={data}
        columns={columns}
        loading={false}
        loadingOverlay
      />,
    );

    // Initially: no loading, no overlay
    expect(screen.getByTestId('datatable')).toBeInTheDocument();
    expect(
      screen.queryByTestId('table-loader-overlay'),
    ).not.toBeInTheDocument();

    // Start refetch: loading=true, loadingOverlay=true
    rerender(
      <DataTable data={data} columns={columns} loading loadingOverlay />,
    );

    // During refetch: overlay appears, data still visible
    expect(screen.getByTestId('datatable')).toBeInTheDocument();
    expect(screen.getByTestId('table-loader-overlay')).toBeInTheDocument();
    expect(screen.getByText('Ada')).toBeInTheDocument();

    // Refetch complete: loading=false
    rerender(
      <DataTable
        data={data}
        columns={columns}
        loading={false}
        loadingOverlay
      />,
    );

    // Overlay disappears
    expect(screen.getByTestId('datatable')).toBeInTheDocument();
    expect(
      screen.queryByTestId('table-loader-overlay'),
    ).not.toBeInTheDocument();
  });

  /* ------------------------------------------------------------------
   * TableLoader component
   * ------------------------------------------------------------------ */

  it('TableLoader renders grid with provided rows and columns', () => {
    type TestRow = { a: string; b: string };
    const columns: Array<{
      id: string;
      header: string;
      accessor: keyof TestRow;
    }> = [
      { id: 'a', header: 'A', accessor: 'a' },
      { id: 'b', header: 'B', accessor: 'b' },
    ];

    render(<TableLoader columns={columns} rows={2} />);

    const grid = screen.getByTestId('table-loader-grid');
    const rows = grid.querySelectorAll('[data-testid^="skeleton-row-"]');
    expect(rows.length).toBe(2);
    rows.forEach((row) => {
      expect(
        row.querySelectorAll('[data-testid="table-loader-cell"]').length,
      ).toBe(columns.length);
    });
  });

  it('TableLoader overlay uses column-aligned skeleton grid', () => {
    type TestRow = { a: string };
    const columns: Array<{
      id: string;
      header: string;
      accessor: keyof TestRow;
    }> = [{ id: 'a', header: 'A', accessor: 'a' }];

    render(<TableLoader columns={columns} rows={5} asOverlay />);

    const overlay = screen.getByTestId('table-loader-overlay');
    expect(overlay).toBeInTheDocument();
    const rows = overlay.querySelectorAll('[data-testid^="skeleton-row-"]');
    // overlay should clamp rows to max(1, rows) but uses provided rows; columns length should match
    expect(rows.length).toBe(5);
    rows.forEach((row) => {
      expect(
        row.querySelectorAll('[data-testid="table-loader-cell"]').length,
      ).toBe(columns.length);
    });
  });

  /* ------------------------------------------------------------------
   * Row selection and actions
   * ------------------------------------------------------------------ */

  it('toggles row selection when checkbox is clicked', async () => {
    const user = userEvent.setup();
    type Row = { id: string; name: string };
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];
    const data: Row[] = [
      { id: '1', name: 'Ada' },
      { id: '2', name: 'Bob' },
    ];

    render(
      <DataTable<Row> data={data} columns={columns} selectable rowKey="id" />,
    );

    const rowCb1 = screen.getByTestId('select-row-1') as HTMLInputElement;
    expect(rowCb1.checked).toBe(false);

    await user.click(rowCb1);
    expect(rowCb1.checked).toBe(true);

    await user.click(rowCb1);
    expect(rowCb1.checked).toBe(false);
  });

  it('select-all checkbox selects all rows on page', async () => {
    const user = userEvent.setup();
    type Row = { id: string; name: string };
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];
    const data: Row[] = [
      { id: '1', name: 'Ada' },
      { id: '2', name: 'Bob' },
    ];

    render(
      <DataTable<Row> data={data} columns={columns} selectable rowKey="id" />,
    );

    const headerCb = screen.getByTestId(
      'select-all-checkbox',
    ) as HTMLInputElement;
    expect(headerCb.checked).toBe(false);

    await user.click(headerCb);
    expect(headerCb.checked).toBe(true);

    const row1 = screen.getByTestId('select-row-1') as HTMLInputElement;
    const row2 = screen.getByTestId('select-row-2') as HTMLInputElement;
    expect(row1.checked).toBe(true);
    expect(row2.checked).toBe(true);

    // Unselect all
    await user.click(headerCb);
    expect(headerCb.checked).toBe(false);
    expect(row1.checked).toBe(false);
    expect(row2.checked).toBe(false);
  });

  it('header checkbox shows indeterminate state when some rows selected', async () => {
    const user = userEvent.setup();
    type Row = { id: string; name: string };
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];
    const data: Row[] = [
      { id: '1', name: 'Ada' },
      { id: '2', name: 'Bob' },
    ];

    render(
      <DataTable<Row> data={data} columns={columns} selectable rowKey="id" />,
    );

    const headerCb = screen.getByTestId(
      'select-all-checkbox',
    ) as HTMLInputElement;
    const rowCb1 = screen.getByTestId('select-row-1');

    // Select only first row
    await user.click(rowCb1);

    // Header should be indeterminate (not checked, but indeterminate property set)
    expect(headerCb.checked).toBe(false);
    expect(headerCb.indeterminate).toBe(true);
  });

  it('renders row action buttons and calls onClick', async () => {
    const user = userEvent.setup();
    type Row = { id: string; name: string };
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];
    const data: Row[] = [{ id: '1', name: 'Ada' }];
    const onClick = vi.fn();

    render(
      <DataTable<Row>
        data={data}
        columns={columns}
        rowKey="id"
        rowActions={[{ id: 'open', label: 'Open', onClick }]}
      />,
    );

    const openBtn = screen.getByRole('button', { name: 'Open' });
    expect(openBtn).toBeInTheDocument();

    await user.click(openBtn);
    expect(onClick).toHaveBeenCalledWith(data[0]);
  });

  it('renders bulk actions bar when rows are selected', async () => {
    const user = userEvent.setup();
    type Row = { id: string; name: string };
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];
    const data: Row[] = [
      { id: '1', name: 'Ada' },
      { id: '2', name: 'Bob' },
    ];
    const onBulk = vi.fn();

    render(
      <DataTable<Row>
        data={data}
        columns={columns}
        selectable
        rowKey="id"
        bulkActions={[{ id: 'export', label: 'Export', onClick: onBulk }]}
      />,
    );

    // Initially no bulk bar
    expect(screen.queryByTestId('bulk-actions-bar')).toBeNull();

    // Select first row
    await user.click(screen.getByTestId('select-row-1'));

    // Bulk bar should appear
    expect(screen.getByTestId('bulk-actions-bar')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // count

    // Click bulk action
    await user.click(screen.getByTestId('bulk-action-export'));
    expect(onBulk).toHaveBeenCalled();
  });

  it('clear button clears selection', async () => {
    const user = userEvent.setup();
    type Row = { id: string; name: string };
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];
    const data: Row[] = [{ id: '1', name: 'Ada' }];

    render(
      <DataTable<Row>
        data={data}
        columns={columns}
        selectable
        rowKey="id"
        bulkActions={[{ id: 'test', label: 'Test', onClick: vi.fn() }]}
      />,
    );

    // Select row
    await user.click(screen.getByTestId('select-row-1'));
    expect(screen.getByTestId('bulk-actions-bar')).toBeInTheDocument();

    // Click clear
    await user.click(screen.getByTestId('bulk-clear-btn'));

    // Bar should disappear
    expect(screen.queryByTestId('bulk-actions-bar')).toBeNull();
    expect(
      (screen.getByTestId('select-row-1') as HTMLInputElement).checked,
    ).toBe(false);
  });

  it('controlled selection calls onSelectionChange', async () => {
    const user = userEvent.setup();
    type Row = { id: string; name: string };
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];
    const data: Row[] = [{ id: '1', name: 'Ada' }];
    const onSelectionChange = vi.fn();

    render(
      <DataTable<Row>
        data={data}
        columns={columns}
        selectable
        rowKey="id"
        selectedKeys={new Set()}
        onSelectionChange={onSelectionChange}
      />,
    );

    await user.click(screen.getByTestId('select-row-1'));
    expect(onSelectionChange).toHaveBeenCalled();
  });

  it('row actions disabled state works correctly', () => {
    type Row = { id: string; name: string };
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];
    const data: Row[] = [{ id: '1', name: 'Ada' }];

    render(
      <DataTable<Row>
        data={data}
        columns={columns}
        rowKey="id"
        rowActions={[
          { id: 'open', label: 'Open', onClick: vi.fn(), disabled: true },
        ]}
      />,
    );

    const openBtn = screen.getByRole('button', { name: 'Open' });
    expect(openBtn).toBeDisabled();
  });

  it('bulk action with confirm shows dialog and calls onClick when confirmed', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const onBulk = vi.fn();
    type Row = { id: string; name: string };
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];
    const data: Row[] = [{ id: '1', name: 'Ada' }];
    try {
      render(
        <DataTable<Row>
          data={data}
          columns={columns}
          selectable
          rowKey="id"
          bulkActions={[
            {
              id: 'delete',
              label: 'Delete',
              onClick: onBulk,
              confirm: 'Are you sure?',
            },
          ]}
        />,
      );

      // Select row
      await user.click(screen.getByTestId('select-row-1'));

      // Click bulk action
      await user.click(screen.getByTestId('bulk-action-delete'));

      expect(confirmSpy).toHaveBeenCalledWith('Are you sure?');
      expect(onBulk).toHaveBeenCalled();
    } finally {
      confirmSpy.mockRestore();
    }
  });

  it('bulk action with confirm does not call onClick when cancelled', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const onBulk = vi.fn();
    type Row = { id: string; name: string };
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];
    const data: Row[] = [{ id: '1', name: 'Ada' }];

    try {
      render(
        <DataTable<Row>
          data={data}
          columns={columns}
          selectable
          rowKey="id"
          bulkActions={[
            {
              id: 'delete',
              label: 'Delete',
              onClick: onBulk,
              confirm: 'Are you sure?',
            },
          ]}
        />,
      );

      // Select row
      await user.click(screen.getByTestId('select-row-1'));

      // Click bulk action
      await user.click(screen.getByTestId('bulk-action-delete'));

      expect(confirmSpy).toHaveBeenCalledWith('Are you sure?');
      expect(onBulk).not.toHaveBeenCalled();
    } finally {
      confirmSpy.mockRestore();
    }
  });

  it('bulk action disabled function is called with selected rows and keys', async () => {
    const user = userEvent.setup();
    const disabledFn = vi.fn().mockReturnValue(true);
    const onBulk = vi.fn();
    type Row = { id: string; name: string };
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];
    const data: Row[] = [{ id: '1', name: 'Ada' }];

    render(
      <DataTable<Row>
        data={data}
        columns={columns}
        selectable
        rowKey="id"
        bulkActions={[
          {
            id: 'delete',
            label: 'Delete',
            onClick: onBulk,
            disabled: disabledFn,
          },
        ]}
      />,
    );

    // Select row
    await user.click(screen.getByTestId('select-row-1'));

    // Disabled function should be called with selected rows and keys
    expect(disabledFn).toHaveBeenCalledWith([data[0]], ['1']);

    // Button should be disabled
    const deleteBtn = screen.getByTestId('bulk-action-delete');
    expect(deleteBtn).toBeDisabled();

    // Click should not trigger onClick
    await user.click(deleteBtn);
    expect(onBulk).not.toHaveBeenCalled();
  });

  /* ------------------------------------------------------------------
   * Selection normalization on page change
   * ------------------------------------------------------------------ */

  it('normalizes selection to only include keys on current page when page changes', async () => {
    const user = userEvent.setup();
    type Row = { id: string; name: string };
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];
    // 3 items with pageSize=1 means 3 pages
    const data: Row[] = [
      { id: '1', name: 'Ada' },
      { id: '2', name: 'Bob' },
      { id: '3', name: 'Charlie' },
    ];
    const onSelectionChange = vi.fn();

    render(
      <DataTable<Row>
        data={data}
        columns={columns}
        selectable
        rowKey="id"
        paginationMode="client"
        pageSize={1}
        selectedKeys={new Set(['1'])}
        onSelectionChange={onSelectionChange}
      />,
    );

    // Initially on page 1, selection '1' is on current page
    expect(screen.getByText('Ada')).toBeInTheDocument();

    // Navigate to page 2 - this should trigger normalization
    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);

    // After page change, selection should be normalized (cleared since '1' is not on page 2)
    expect(onSelectionChange).toHaveBeenCalled();
    const lastCall =
      onSelectionChange.mock.calls[onSelectionChange.mock.calls.length - 1];
    // The normalized selection should be empty (no keys from page 2 were in the original selection)
    expect(lastCall[0].size).toBe(0);
  });

  it('keeps selections that exist on the new page after page change', async () => {
    type Row = { id: string; name: string };
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];
    const data: Row[] = [
      { id: '1', name: 'Ada' },
      { id: '2', name: 'Bob' },
    ];

    // Start with selection that includes key '2' (which will be on page 2)
    const { rerender } = render(
      <DataTable<Row>
        data={data}
        columns={columns}
        selectable
        rowKey="id"
        paginationMode="client"
        pageSize={2}
        initialSelectedKeys={new Set(['1', '2'])}
      />,
    );

    // Both items on page 1, both selected
    expect(screen.getByTestId('select-row-1')).toBeChecked();
    expect(screen.getByTestId('select-row-2')).toBeChecked();

    // Now re-render with pageSize=1 to force page change behavior
    rerender(
      <DataTable<Row>
        data={data}
        columns={columns}
        selectable
        rowKey="id"
        paginationMode="client"
        pageSize={1}
        initialSelectedKeys={new Set(['1', '2'])}
      />,
    );

    // On page 1 with pageSize=1, only '1' is visible and should be checked
    expect(screen.getByTestId('select-row-1')).toBeChecked();
  });

  /* ------------------------------------------------------------------
   * renderRow warnings for selectable and rowActions
   * ------------------------------------------------------------------ */

  it('warns when renderRow is used with selectable prop', () => {
    const originalEnv = process.env.NODE_ENV;
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    (process.env as unknown as Record<string, string | undefined>).NODE_ENV =
      'development';

    try {
      const columns = [
        { id: 'name', header: 'Name', accessor: 'name' as const },
      ];
      const data = [{ name: 'Ada' }];

      render(
        <DataTable
          data={data}
          columns={columns}
          selectable
          renderRow={(row: (typeof data)[number]) => (
            <tr key={row.name}>
              <td>{row.name}</td>
            </tr>
          )}
        />,
      );

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          '`selectable` is ignored when `renderRow` is provided',
        ),
      );
    } finally {
      warnSpy.mockRestore();
      (process.env as unknown as Record<string, string | undefined>).NODE_ENV =
        originalEnv;
    }
  });

  it('warns when renderRow is used with rowActions prop', () => {
    const originalEnv = process.env.NODE_ENV;
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    (process.env as unknown as Record<string, string | undefined>).NODE_ENV =
      'development';

    try {
      const columns = [
        { id: 'name', header: 'Name', accessor: 'name' as const },
      ];
      const data = [{ name: 'Ada' }];

      render(
        <DataTable
          data={data}
          columns={columns}
          rowActions={[{ id: 'edit', label: 'Edit', onClick: () => {} }]}
          renderRow={(row: (typeof data)[number]) => (
            <tr key={row.name}>
              <td>{row.name}</td>
            </tr>
          )}
        />,
      );

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          '`rowActions` is ignored when `renderRow` is provided',
        ),
      );
    } finally {
      warnSpy.mockRestore();
      (process.env as unknown as Record<string, string | undefined>).NODE_ENV =
        originalEnv;
    }
  });

  /* ------------------------------------------------------------------
   * Development warnings for pagination props
   * ------------------------------------------------------------------ */

  it('warns when currentPage is provided without onPageChange', () => {
    const originalEnv = process.env.NODE_ENV;
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    (process.env as unknown as Record<string, string | undefined>).NODE_ENV =
      'development';

    try {
      const columns = [
        { id: 'name', header: 'Name', accessor: 'name' as const },
      ];
      const data = [{ name: 'Ada' }];

      render(
        <DataTable
          data={data}
          columns={columns}
          paginationMode="client"
          currentPage={1}
          // Note: onPageChange is intentionally NOT provided
        />,
      );

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          '`currentPage` was provided without `onPageChange`',
        ),
      );
    } finally {
      warnSpy.mockRestore();
      (process.env as unknown as Record<string, string | undefined>).NODE_ENV =
        originalEnv;
    }
  });

  it('warns when paginationMode is server but totalItems is not provided', () => {
    const originalEnv = process.env.NODE_ENV;
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    (process.env as unknown as Record<string, string | undefined>).NODE_ENV =
      'development';

    try {
      const columns = [
        { id: 'name', header: 'Name', accessor: 'name' as const },
      ];
      const data = [{ name: 'Ada' }];

      render(
        <DataTable
          data={data}
          columns={columns}
          paginationMode="server"
          pageInfo={{ hasNextPage: true, hasPreviousPage: false }}
          onLoadMore={() => {}}
          // Note: totalItems is intentionally NOT provided
        />,
      );

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          '`paginationMode="server"` requires `totalItems`',
        ),
      );
    } finally {
      warnSpy.mockRestore();
      (process.env as unknown as Record<string, string | undefined>).NODE_ENV =
        originalEnv;
    }
  });

  it('calls onPageChange callback when page is changed in controlled mode', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];
    const data = [{ name: 'Ada' }, { name: 'Bob' }, { name: 'Charlie' }];

    render(
      <DataTable
        data={data}
        columns={columns}
        paginationMode="client"
        pageSize={1}
        currentPage={1}
        onPageChange={onPageChange}
      />,
    );

    // Click next page button
    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange(1) in controlled mode when search changes (handlePageReset)', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];
    const data = [{ name: 'Ada' }, { name: 'Bob' }, { name: 'Charlie' }];

    render(
      <DataTable
        data={data}
        columns={columns}
        showSearch
        paginationMode="client"
        pageSize={1}
        currentPage={2}
        onPageChange={onPageChange}
      />,
    );

    // Type in search to trigger handlePageReset
    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, 'a');

    // In controlled mode, handlePageReset should call onPageChange(1)
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  /* ------------------------------------------------------------------
   * loadingMore skeleton rows with selection and row actions columns
   * ------------------------------------------------------------------ */

  it('renders skeleton cells for selection and actions columns when loadingMore with selectable and rowActions', () => {
    type Row = { id: string; name: string };
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];
    const data: Row[] = [{ id: '1', name: 'Ada' }];

    render(
      <DataTable<Row>
        data={data}
        columns={columns}
        selectable
        rowKey="id"
        rowActions={[{ id: 'edit', label: 'Edit', onClick: () => {} }]}
        paginationMode="client"
        loadingMore
        skeletonRows={2}
      />,
    );

    // Should have skeleton append rows
    const appendedRows = document.querySelectorAll(
      '[data-testid^="skeleton-append-"]',
    );
    expect(appendedRows.length).toBe(2);

    // Each skeleton row should have cells for: selection column + data columns + actions column
    // That's 1 (select) + 1 (name) + 1 (actions) = 3 cells
    appendedRows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      expect(cells.length).toBe(3);
    });
  });

  it('bulk action does not run when disabled function returns true', async () => {
    const user = userEvent.setup();
    const onBulk = vi.fn();
    type Row = { id: string; name: string };
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];
    const data: Row[] = [{ id: '1', name: 'Ada' }];

    render(
      <DataTable<Row>
        data={data}
        columns={columns}
        selectable
        rowKey="id"
        bulkActions={[
          {
            id: 'delete',
            label: 'Delete',
            onClick: onBulk,
            disabled: () => true, // Always disabled
          },
        ]}
      />,
    );

    // Select row
    await user.click(screen.getByTestId('select-row-1'));

    // The button is rendered via BulkActionsBar
    const deleteBtn = screen.getByTestId('bulk-action-delete');
    expect(deleteBtn).toBeDisabled();

    // Directly calling runBulkAction through the button click (even if disabled, we should test the internal logic)
    // Actually, BulkActionsBar renders the button with the disabled prop.
    // To hit line 389 'if (isDisabled) return;', we can rely on the onClick handler calling runBulkAction.
    await user.click(deleteBtn);

    expect(onBulk).not.toHaveBeenCalled();
  });

  /* ------------------------------------------------------------------
   * Hook unit tests for coverage (default branches)
   * ------------------------------------------------------------------ */

  describe('useDataTableFiltering hook defaults', () => {
    it('uses default values for initialGlobalSearch, serverSearch, and serverFilter', () => {
      const columns = [
        { id: 'name', header: 'Name', accessor: 'name' as const },
      ];
      const data = [{ name: 'Ada' }];

      const { result } = renderHook(() =>
        useDataTableFiltering({
          data,
          columns,
          // Omitting initialGlobalSearch, serverSearch, serverFilter
        }),
      );

      expect(result.current.query).toBe('');
      expect(result.current.filteredRows).toEqual(data);
    });

    it('covers query and columnFilters fallback branches', () => {
      const columns = [
        { id: 'name', header: 'Name', accessor: 'name' as const },
      ];

      // Force controlledFilters=true but columnFilters=null for line 51
      const { result: r1 } = renderHook(() =>
        useDataTableFiltering({
          data: [],
          columns,
          columnFilters: null as unknown as Record<string, unknown>,
          onColumnFiltersChange: () => {},
        }),
      );
      expect(r1.current.filters).toEqual({});

      // Force query=null for line 110 by passing initialGlobalSearch as null
      const { result: r2 } = renderHook(() =>
        useDataTableFiltering({
          data: [{ name: 'Ada' }],
          columns,
          initialGlobalSearch: null as unknown as string,
        }),
      );
      expect(r2.current.query).toBe(null);
      // Accessing filteredRows to trigger the useMemo
      expect(r2.current.filteredRows).toEqual([{ name: 'Ada' }]);
    });
  });

  describe('useDataTableSelection hook defaults', () => {
    it('uses default values for selectable', () => {
      const data = [{ id: '1', name: 'Ada' }];
      const keysOnPage = ['1'];

      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: data,
          keysOnPage,
          // Omitting selectable
        }),
      );

      expect(result.current.allSelectedOnPage).toBe(false);
      expect(result.current.someSelectedOnPage).toBe(false);
    });

    it('handles boolean disabled state and confirm cancel for bulk actions', () => {
      const data = [{ id: '1', name: 'Ada' }];
      const keysOnPage = ['1'];
      const onBulk = vi.fn();
      const confirmSpy = vi.spyOn(window, 'confirm');

      try {
        const { result } = renderHook(() =>
          useDataTableSelection({
            paginatedData: data,
            keysOnPage,
            selectable: true,
          }),
        );

        // Select row (wrap in act to flush state updates)
        act(() => {
          result.current.toggleRowSelection('1');
        });

        // 1) Test boolean disabled: true
        act(() => {
          result.current.runBulkAction({
            id: 'b1',
            label: 'B1',
            onClick: onBulk,
            disabled: true,
          });
        });
        expect(onBulk).not.toHaveBeenCalled();

        // 2) Test boolean disabled: false
        act(() => {
          result.current.runBulkAction({
            id: 'b2',
            label: 'B2',
            onClick: onBulk,
            disabled: false,
          });
        });
        expect(onBulk).toHaveBeenCalled();

        // 3) Test confirm cancel
        onBulk.mockClear();
        confirmSpy.mockReturnValue(false);
        act(() => {
          result.current.runBulkAction({
            id: 'b3',
            label: 'B3',
            onClick: onBulk,
            confirm: 'Really?',
          });
        });
        expect(confirmSpy).toHaveBeenCalledWith('Really?');
        expect(onBulk).not.toHaveBeenCalled();
      } finally {
        confirmSpy.mockRestore();
      }
    });
  });

  it('resets page to 1 in uncontrolled mode when search changes', async () => {
    const user = userEvent.setup();
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];
    const data = [
      { name: 'Ada' },
      { name: 'Bob' },
      { name: 'Charlie' },
      { name: 'Dave' },
    ];

    render(
      <DataTable
        data={data}
        columns={columns}
        showSearch
        paginationMode="client"
        pageSize={1}
      />,
    );

    // Go to second page
    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText('Bob')).toBeInTheDocument();

    // Type in search to reset page
    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, 'a');

    // Should be back on page 1 (Ada) because of search change
    expect(screen.getByText('Ada')).toBeInTheDocument();
  });

  it('covers sub-component edge cases (search clear, pagination prev, row action boolean disable)', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];
    const data = [
      { id: '1', name: 'Ada' },
      { id: '2', name: 'Bob' },
    ];
    const onAction = vi.fn();

    const { rerender } = render(
      <DataTable
        data={data}
        columns={columns}
        showSearch
        initialGlobalSearch="Ada"
        paginationMode="client"
        pageSize={1}
        currentPage={2}
        onPageChange={onPageChange}
        rowActions={[
          {
            id: 'edit',
            label: 'Edit',
            onClick: onAction,
            disabled: true, // Boolean disabled
          },
        ]}
      />,
    );

    // 1) Test search clear
    const clearBtn = screen.getByLabelText(/clearSearch/i);
    await user.click(clearBtn);
    // SearchBar.tsx line 39 covered

    // 2) Test pagination previous
    const prevBtn = screen.getByRole('button', {
      name: /paginationPrevLabel/i,
    });
    await user.click(prevBtn);
    expect(onPageChange).toHaveBeenCalledWith(1);
    // Pagination.tsx line 52 covered

    // 3) Test row action boolean disable
    const actionBtns = screen.getAllByTestId('action-btn-edit');
    actionBtns.forEach((btn) => expect(btn).toBeDisabled());
    // ActionsCell.tsx line 20-22 covered (boolean branch)

    // 4) Test TableLoader default rows
    rerender(
      <DataTable
        data={[]}
        columns={columns}
        loading
        paginationMode="client"
        // Missing skeletonRows to test default = 5
      />,
    );
    const skeletonRows = screen.getAllByTestId(/^skeleton-row-/);
    expect(skeletonRows.length).toBe(5);
    // TableLoader.tsx line 18 covered
  });

  it('covers SearchBar branch fallbacks', () => {
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];

    // SearchBar fallback labels (lines 22-23 in SearchBar.tsx)
    render(
      <DataTable
        data={[]}
        columns={columns}
        showSearch
        searchPlaceholder={undefined}
        ariaLabel={undefined}
      />,
    );
    // aria-label defaults to 'Search'
    expect(screen.getByLabelText(/Search/i)).toBeInTheDocument();
  });

  it('covers disabled branches in ActionsCell and useDataTableSelection', async () => {
    const user = userEvent.setup();
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];
    const data = [{ id: '1', name: 'Ada' }];
    const onAction = vi.fn();

    render(
      <DataTable
        data={data}
        columns={columns}
        rowActions={[
          {
            id: 'edit',
            label: 'Edit',
            onClick: onAction,
            // disabled is undefined, hits !!action.disabled branch
          },
        ]}
        selectable
        bulkActions={[
          {
            id: 'bulk',
            label: 'Bulk',
            onClick: onAction,
            // disabled is undefined
          },
        ]}
      />,
    );

    // Row action button should NOT be disabled
    expect(screen.getByTestId('action-btn-edit')).not.toBeDisabled();

    // Bulk action button should NOT be disabled (once row is selected)
    await user.click(screen.getByTestId('select-row-1'));
    expect(screen.getByTestId('bulk-action-bulk')).not.toBeDisabled();
  });
});

describe('defaultCompare boolean/date branches', () => {
  type Row = {
    id: string;
    name: string;
    active?: boolean | null;
    date?: Date | null;
  };
  // Use dynamic dates to avoid hardcoded date strings
  const date1 = dayjs().subtract(1, 'year').toDate();
  const date2 = null;
  const date3 = dayjs().add(1, 'year').toDate();
  const date4 = undefined;
  const rows: Row[] = [
    { id: '1', name: 'Alice', active: false, date: date1 },
    { id: '2', name: 'Bob', active: null, date: date2 },
    { id: '3', name: 'Charlie', active: true, date: date3 },
    { id: '4', name: 'Nulls', active: undefined, date: date4 },
  ];
  const columns = [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name' as const,
      meta: { sortable: true },
    },
    {
      id: 'active',
      header: 'Active',
      accessor: 'active' as const,
      meta: { sortable: true },
    },
    {
      id: 'date',
      header: 'Date',
      accessor: 'date' as const,
      meta: { sortable: true },
    },
  ];

  it('sorts boolean column (false < true, nulls last)', async () => {
    render(<DataTable<Row> data={rows} columns={columns} />);
    const th = screen.getByRole('button', { name: /active/i });
    // Ascending: false, true, null/undefined
    await userEvent.click(th);
    const headerCells = screen.getAllByRole('button');
    const nameColIdx = headerCells.findIndex((cell) =>
      /name/i.test(cell.textContent || ''),
    );
    const bodyRowsAsc = screen.getAllByRole('row').slice(1); // skip header
    const namesAsc = bodyRowsAsc.map(
      (row) => row.querySelectorAll('td')[nameColIdx]?.textContent,
    );
    expect(namesAsc).toEqual(['Alice', 'Charlie', 'Bob', 'Nulls']);
    expect(th).toHaveAttribute('aria-sort', 'ascending');
    // Descending: true, false, null/undefined (nulls last)
    await userEvent.click(th);
    const bodyRowsDesc = screen.getAllByRole('row').slice(1);
    const namesDesc = bodyRowsDesc.map(
      (row) => row.querySelectorAll('td')[nameColIdx]?.textContent,
    );
    expect(namesDesc).toEqual(['Charlie', 'Alice', 'Bob', 'Nulls']);
    expect(th).toHaveAttribute('aria-sort', 'descending');
  });

  it('sorts date column (earliest < latest, nulls last)', async () => {
    render(<DataTable<Row> data={rows} columns={columns} />);
    const th = screen.getByRole('button', { name: /date/i });
    // Ascending: earliest, latest, null/undefined
    await userEvent.click(th);
    const headerCells = screen.getAllByRole('button');
    const nameColIdx = headerCells.findIndex((cell) =>
      /name/i.test(cell.textContent || ''),
    );
    const bodyRowsAsc = screen.getAllByRole('row').slice(1); // skip header
    const namesAsc = bodyRowsAsc.map(
      (row) => row.querySelectorAll('td')[nameColIdx]?.textContent,
    );
    expect(namesAsc).toEqual(['Alice', 'Charlie', 'Bob', 'Nulls']);
    expect(th).toHaveAttribute('aria-sort', 'ascending');
    // Descending: latest, earliest, null/undefined (nulls last)
    await userEvent.click(th);
    const bodyRowsDesc = screen.getAllByRole('row').slice(1);
    const namesDesc = bodyRowsDesc.map(
      (row) => row.querySelectorAll('td')[nameColIdx]?.textContent,
    );
    expect(namesDesc).toEqual(['Charlie', 'Alice', 'Bob', 'Nulls']);
    expect(th).toHaveAttribute('aria-sort', 'descending');
  });

  it('keyboard sorts boolean and date columns', async () => {
    render(<DataTable<Row> data={rows} columns={columns} />);
    const thBool = screen.getByRole('button', { name: /active/i });
    const thDate = screen.getByRole('button', { name: /date/i });
    // Keyboard sort boolean with Enter
    thBool.focus();
    await userEvent.keyboard('{Enter}');
    expect(thBool).toHaveAttribute('aria-sort', 'ascending');
    await userEvent.keyboard('{Enter}');
    expect(thBool).toHaveAttribute('aria-sort', 'descending');
    // Keyboard sort boolean with Space
    thBool.focus();
    await userEvent.keyboard(' ');
    expect(thBool).toHaveAttribute('aria-sort', 'ascending');
    await userEvent.keyboard(' ');
    expect(thBool).toHaveAttribute('aria-sort', 'descending');
    // Keyboard sort date with Enter
    thDate.focus();
    await userEvent.keyboard('{Enter}');
    expect(thDate).toHaveAttribute('aria-sort', 'ascending');
    await userEvent.keyboard('{Enter}');
    expect(thDate).toHaveAttribute('aria-sort', 'descending');
    // Keyboard sort date with Space
    thDate.focus();
    await userEvent.keyboard(' ');
    expect(thDate).toHaveAttribute('aria-sort', 'ascending');
    await userEvent.keyboard(' ');
    expect(thDate).toHaveAttribute('aria-sort', 'descending');
  });

  it('keyboard sorts with Space key', async () => {
    render(<DataTable<Row> data={rows} columns={columns} />);
    const thBool = screen.getByRole('button', { name: /active/i });
    thBool.focus();
    await userEvent.keyboard(' ');
    expect(thBool).toHaveAttribute('aria-sort', 'ascending');
    await userEvent.keyboard(' ');
    expect(thBool).toHaveAttribute('aria-sort', 'descending');
  });

  it('applies initialSortDirection to default sort state', async () => {
    const columns = [
      {
        id: 'name',
        header: 'Name',
        accessor: 'name' as const,
        meta: { sortable: true },
      },
      {
        id: 'active',
        header: 'Active',
        accessor: 'active' as const,
        meta: { sortable: true },
      },
    ];
    const rows = [
      { id: '1', name: 'Alice', active: false },
      { id: '2', name: 'Bob', active: true },
      { id: '3', name: 'Charlie', active: true },
    ];

    // Test with initialSortDirection='desc' and initialSortBy='name'
    render(
      <DataTable<(typeof rows)[0]>
        data={rows}
        columns={columns}
        initialSortBy="name"
        initialSortDirection="desc"
      />,
    );

    const nameHeader = screen.getByRole('button', { name: /name/i });
    // Should start with descending sort
    expect(nameHeader).toHaveAttribute('aria-sort', 'descending');

    // Verify rows are sorted in descending order (Charlie, Bob, Alice)
    const bodyRows = screen.getAllByRole('row').slice(1); // skip header
    const names = bodyRows.map((row) => row.querySelector('td')?.textContent);
    expect(names).toEqual(['Charlie', 'Bob', 'Alice']);
  });

  it('defaults to ascending sort when initialSortDirection is not provided', async () => {
    const columns = [
      {
        id: 'name',
        header: 'Name',
        accessor: 'name' as const,
        meta: { sortable: true },
      },
    ];
    const rows = [
      { id: '1', name: 'Charlie' },
      { id: '2', name: 'Alice' },
      { id: '3', name: 'Bob' },
    ];

    render(
      <DataTable<(typeof rows)[0]>
        data={rows}
        columns={columns}
        initialSortBy="name"
      />,
    );

    const nameHeader = screen.getByRole('button', { name: /name/i });
    // Should default to ascending sort when initialSortDirection is not provided
    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');

    // Verify rows are sorted in ascending order (Alice, Bob, Charlie)
    const bodyRows = screen.getAllByRole('row').slice(1); // skip header
    const names = bodyRows.map((row) => row.querySelector('td')?.textContent);
    expect(names).toEqual(['Alice', 'Bob', 'Charlie']);
  });

  it('does not apply aria-sort to non-active or non-sortable headers', async () => {
    const columns = [
      {
        id: 'name',
        header: 'Name',
        accessor: 'name' as const,
        meta: { sortable: true },
      },
      {
        id: 'status',
        header: 'Status',
        accessor: 'status' as const,
        meta: { sortable: false },
      },
    ];

    const rows = [
      { id: '1', name: 'Alice', status: 'A' },
      { id: '2', name: 'Bob', status: 'B' },
    ];

    render(<DataTable<(typeof rows)[0]> data={rows} columns={columns} />);

    const nameHeader = screen.getByRole('button', { name: /name/i });
    const statusHeader = screen.getByRole('columnheader', { name: /status/i });

    // Sortable but inactive column has no aria-sort
    expect(nameHeader).not.toHaveAttribute('aria-sort');
    await userEvent.click(nameHeader);

    // Active sortable column gets aria-sort
    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    expect(statusHeader).not.toHaveAttribute('aria-sort');
  });
});
