import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import dayjs from 'dayjs';
import { DataTable } from './DataTable';
import { TableLoader } from './TableLoader';

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

  it('updates global search in uncontrolled mode', () => {
    const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];
    const data = [{ name: 'Ada' }, { name: 'Bob' }];

    render(<DataTable data={data} columns={columns} showSearch />);

    // Initially both visible
    expect(screen.getByText('Ada')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();

    // Type in search box
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'Ada' } });

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
        renderRow={(row) => (
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

  it('resets to page 1 when search changes in uncontrolled client pagination', () => {
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
    fireEvent.change(searchInput, { target: { value: 'Bob' } });

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

  it('server modes do not filter locally', () => {
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
    fireEvent.change(input, { target: { value: 'Ada' } });

    expect(onSearch).toHaveBeenCalledWith('Ada');
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
        rowKey={(row) => `row-${row.id}`}
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
        renderError={(e) => <span>Custom: {e.message}</span>}
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
      <DataTable data={data} columns={columns} loadingMore skeletonRows={2} />,
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
});
