import { render, screen, fireEvent, within, act } from '@testing-library/react';
import { DataGridWrapper } from './index';
import { vi } from 'vitest';

// Mock useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        search: 'Search',
        sortBy: 'Sort by',
        sort: 'Sort',
        noResultsFound: 'No results found',
        clear: 'Clear',
      };
      return translations[key] || key;
    },
  }),
}));

type TestRow = {
  id: number;
  name: string | null;
  role: string | null;
  age?: number;
};

const defaultProps = {
  rows: [
    { id: 1, name: 'Alice', role: 'Admin', age: 30 },
    { id: 2, name: 'Bob', role: 'User', age: 25 },
    { id: 3, name: 'Charlie', role: 'Guest', age: 35 },
  ] as TestRow[],
  columns: [
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'role', headerName: 'Role', width: 150 },
    { field: 'age', headerName: 'Age', width: 100 },
  ],
  searchConfig: { enabled: true, fields: ['name'] as (keyof TestRow)[] },
};

describe('DataGridWrapper', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  // Core 4 tests for coverage
  test('initializes with default sort configuration', () => {
    const sortConfig = {
      defaultSortField: 'name',
      defaultSortOrder: 'desc' as const,
      sortingOptions: [
        { label: 'Name Asc', value: 'name_asc' },
        { label: 'Name Desc', value: 'name_desc' },
      ],
    };

    render(<DataGridWrapper {...defaultProps} sortConfig={sortConfig} />);

    const rows = screen.getAllByRole('row');
    expect(within(rows[1]).getByText('Charlie')).toBeInTheDocument();
  });

  test('renders error overlay when error prop is provided', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        rows={[]}
        error="Test error message"
      />,
    );

    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  test('handles pagination model change', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        paginationConfig={{ enabled: true, pageSizeOptions: [5, 10] }}
      />,
    );

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  test('converts sort value to field and order', () => {
    const sortConfig = {
      sortingOptions: [
        { label: 'Name Asc', value: 'name_asc' },
        { label: 'Name Desc', value: 'name_desc' },
      ],
    };

    render(<DataGridWrapper {...defaultProps} sortConfig={sortConfig} />);

    const sortBtn = screen.getByText('Sort');
    fireEvent.click(sortBtn);
    fireEvent.click(screen.getByText('Name Desc'));

    const rows = screen.getAllByRole('row');
    expect(within(rows[1]).getByText('Charlie')).toBeInTheDocument();
  });

  test('handles server-side search change', () => {
    vi.useFakeTimers();
    const onSearchChange = vi.fn();
    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{
          enabled: true,
          serverSide: true,
          searchByOptions: [{ label: 'Name', value: 'name' }],
          selectedSearchBy: 'name',
          onSearchChange,
        }}
      />,
    );

    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'test' } });
    vi.advanceTimersByTime(300);
    expect(onSearchChange).toHaveBeenCalledWith('test', 'name');
    vi.useRealTimers();
  });

  test('handles client-side search', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{ enabled: true, fields: ['name'] }}
      />,
    );

    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'Alice' } });
    expect(input).toHaveValue('Alice');
  });

  test('handles empty state with emptyStateProps', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        rows={[]}
        emptyStateProps={{ message: 'Custom empty' }}
      />,
    );

    expect(screen.getByText('Custom empty')).toBeInTheDocument();
  });

  test('handles pagination rerender with different config', () => {
    const { rerender } = render(
      <DataGridWrapper
        {...defaultProps}
        paginationConfig={{ enabled: true }}
      />,
    );

    rerender(
      <DataGridWrapper
        {...defaultProps}
        paginationConfig={{ enabled: true, pageSizeOptions: [5, 10] }}
      />,
    );

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  test('handles server-side search with SearchFilterBar', () => {
    vi.useFakeTimers();
    const onSearchChange = vi.fn();
    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{
          enabled: true,
          serverSide: true,
          searchByOptions: [{ value: 'name', label: 'Name' }],
          onSearchChange,
        }}
      />,
    );

    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'test' } });
    vi.advanceTimersByTime(300);
    expect(onSearchChange).toHaveBeenCalledWith('test', undefined);
    vi.useRealTimers();
  });

  test('handles sort change with server-side sorting', () => {
    const onSortChange = vi.fn();
    render(
      <DataGridWrapper
        {...defaultProps}
        sortConfig={{
          sortingOptions: [{ value: 'name', label: 'Name' }],
          onSortChange,
        }}
      />,
    );

    const sortButton = screen.getByTestId('sort');
    fireEvent.click(sortButton);
    const option = screen.getByTestId('name');
    fireEvent.click(option);
    expect(onSortChange).toHaveBeenCalledWith('name');
  });

  test('handles search clear functionality', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{ enabled: true, fields: ['name'] }}
      />,
    );

    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'test' } });

    const clearButton = screen.getByLabelText('Clear');
    fireEvent.click(clearButton);
    expect(input).toHaveValue('');
  });

  test('shows console warning for server-side search without onSearchChange', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{
          enabled: true,
          serverSide: true,
        }}
      />,
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      '[DataGridWrapper] Server-side search enabled but onSearchChange callback is missing',
    );

    consoleSpy.mockRestore();
  });

  test('renders loading state', () => {
    render(<DataGridWrapper {...defaultProps} loading={true} />);
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
  });

  test('handles onRowClick callback', () => {
    const onRowClick = vi.fn();
    render(<DataGridWrapper {...defaultProps} onRowClick={onRowClick} />);

    fireEvent.click(screen.getByText('Alice'));
    expect(onRowClick).toHaveBeenCalledWith(defaultProps.rows[0]);
  });

  test('renders action column', () => {
    const actionColumn = (row: TestRow) => (
      <button data-testid={`action-${row.id}`}>Edit</button>
    );
    render(<DataGridWrapper {...defaultProps} actionColumn={actionColumn} />);

    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByTestId('action-1')).toBeInTheDocument();
  });

  test('shows console warning for invalid sort format', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <DataGridWrapper
        {...defaultProps}
        sortConfig={{
          selectedSort: 'invalid_format',
          sortingOptions: [{ label: 'Invalid', value: 'invalid_format' }],
        }}
      />,
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      '[DataGridWrapper] Invalid sort format: "invalid_format". Expected format: "field_asc" or "field_desc"',
    );

    consoleSpy.mockRestore();
  });

  test('uses custom debounce delay from searchConfig', () => {
    vi.useFakeTimers();
    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{
          enabled: true,
          fields: ['name'] as (keyof TestRow)[],
          debounceMs: 500, // Custom debounce delay
        }}
      />,
    );
    const input = screen.getByRole('searchbox');

    fireEvent.change(input, { target: { value: 'Alice' } });

    // Wait 300ms (default) - should NOT have filtered yet
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByText('Bob')).toBeInTheDocument(); // Still visible

    // Wait additional 200ms (total 500ms) - NOW it should filter
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).toBeNull();
  });

  test('searches across multiple fields simultaneously', () => {
    vi.useFakeTimers();
    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{
          enabled: true,
          fields: ['name', 'role'] as (keyof TestRow)[], // Multiple fields
        }}
      />,
    );
    const input = screen.getByRole('searchbox');

    // Search by role field (not name)
    fireEvent.change(input, { target: { value: 'Admin' } });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Should find Alice (role: Admin)
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).toBeNull(); // role: User
    expect(screen.queryByText('Charlie')).toBeNull(); // role: Guest
  });

  test('applies custom filter function correctly', () => {
    const filterConfig = {
      filterOptions: [
        { label: 'All', value: 'all' },
        { label: 'Adults Only', value: 'adults' },
      ],
      defaultFilter: 'all',
      filterFunction: (
        rows: readonly TestRow[],
        filterValue: string | number,
      ) => {
        if (filterValue === 'adults') {
          return rows.filter((row) => (row.age ?? 0) >= 30);
        }
        return rows;
      },
    };

    render(<DataGridWrapper {...defaultProps} filterConfig={filterConfig} />);

    // Initially all rows should be visible (default filter 'all')
    expect(screen.getByText('Alice')).toBeInTheDocument(); // age 30
    expect(screen.getByText('Bob')).toBeInTheDocument(); // age 25
    expect(screen.getByText('Charlie')).toBeInTheDocument(); // age 35

    // Apply adults filter
    const filterBtn = screen.getByText('filter'); // lowercase as per actual rendering
    fireEvent.click(filterBtn);
    fireEvent.click(screen.getByText('Adults Only'));

    // Now only adults (age >= 30) should be visible
    expect(screen.getByText('Alice')).toBeInTheDocument(); // age 30
    expect(screen.queryByText('Bob')).toBeNull(); // age 25
    expect(screen.getByText('Charlie')).toBeInTheDocument(); // age 35
  });

  test('renders headerButton in toolbar', () => {
    const handleHeaderClick = vi.fn();
    const headerButton = (
      <button
        type="button"
        onClick={handleHeaderClick}
        data-testid="custom-header-btn"
      >
        Add New
      </button>
    );

    render(<DataGridWrapper {...defaultProps} headerButton={headerButton} />);

    const btn = screen.getByTestId('custom-header-btn');
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent('Add New');

    fireEvent.click(btn);
    expect(handleHeaderClick).toHaveBeenCalledTimes(1);
  });

  test('uses custom pageSizeOptions when provided', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        paginationConfig={{
          enabled: true,
          defaultPageSize: 2,
          pageSizeOptions: [2, 5, 20], // Custom options
        }}
      />,
    );

    // The DataGrid should render with pagination
    // We can verify by checking it renders (MUI DataGrid has complex internals)
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    // Charlie should be on page 2 with pageSize=2
    expect(screen.queryByText('Charlie')).toBeNull();
  });

  test('renders with default empty state message when neither emptyStateProps nor emptyStateMessage provided', () => {
    render(
      <DataGridWrapper
        {...{
          ...defaultProps,
          rows: [],
          // No emptyStateMessage, no emptyStateProps
        }}
      />,
    );

    // Should fall back to default 'No results found' from translation
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  test('applies custom sort function when provided', () => {
    const sortConfig = {
      sortingOptions: [
        { label: 'Age Ascending', value: 'age_ASC' },
        { label: 'Age Descending', value: 'age_DESC' },
      ],
      sortFunction: (rows: readonly TestRow[], sortValue: string | number) => {
        const [field, order] = String(sortValue).split('_');
        if (field === 'age') {
          return [...rows].sort((a, b) => {
            const aAge = a.age ?? 0;
            const bAge = b.age ?? 0;
            return order === 'ASC' ? aAge - bAge : bAge - aAge;
          });
        }
        return rows;
      },
    };

    render(<DataGridWrapper {...defaultProps} sortConfig={sortConfig} />);

    // Apply sort
    const sortBtn = screen.getByText('Sort');
    fireEvent.click(sortBtn);
    fireEvent.click(screen.getByText('Age Descending'));

    // Should be sorted by age descending: Charlie (35), Alice (30), Bob (25)
    const rows = screen.getAllByRole('row');
    expect(within(rows[1]).getByText('Charlie')).toBeInTheDocument();

    // Apply ascending sort
    fireEvent.click(sortBtn);
    fireEvent.click(screen.getByText('Age Ascending'));

    const rowsAsc = screen.getAllByRole('row');
    expect(within(rowsAsc[1]).getByText('Bob')).toBeInTheDocument(); // age 25
  });

  test('handles onSearchByChange callback in SearchFilterBar', () => {
    const onSearchByChange = vi.fn();
    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{
          enabled: true,
          searchByOptions: [
            { label: 'Name', value: 'name' },
            { label: 'Role', value: 'role' },
          ],
          selectedSearchBy: 'name',
          onSearchByChange,
        }}
      />,
    );

    const searchByButton = screen.getByTestId('searchBy');
    fireEvent.click(searchByButton);
    const roleOption = screen.getByTestId('role');
    fireEvent.click(roleOption);

    expect(onSearchByChange).toHaveBeenCalledWith('role');
  });

  test('handles onSearchSubmit in SearchFilterBar', () => {
    const onSearchChange = vi.fn();
    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{
          enabled: true,
          serverSide: true,
          searchByOptions: [{ label: 'Name', value: 'name' }],
          selectedSearchBy: 'name',
          onSearchChange,
        }}
      />,
    );

    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'test query' } });

    const searchButton = screen.getByTestId('searchButton');
    fireEvent.click(searchButton);

    expect(onSearchChange).toHaveBeenCalledWith('test query', 'name');
  });

  test('handles client-side search with SearchFilterBar (searchByOptions without serverSide)', () => {
    vi.useFakeTimers();
    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{
          enabled: true,
          searchByOptions: [{ label: 'Name', value: 'name' }],
          fields: ['name'],
        }}
      />,
    );

    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'Alice' } });

    // Click the search button to submit (SearchFilterBar requires submission)
    const searchButton = screen.getByTestId('searchButton');
    fireEvent.click(searchButton);

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).toBeNull();

    vi.useRealTimers();
  });

  test('handles SearchFilterBar with combined search and sort dropdowns', () => {
    const onSearchChange = vi.fn();
    const onSortChange = vi.fn();

    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{
          enabled: true,
          serverSide: true,
          searchByOptions: [{ label: 'Name', value: 'name' }],
          selectedSearchBy: 'name',
          onSearchChange,
        }}
        sortConfig={{
          sortingOptions: [
            { label: 'Name Asc', value: 'name_asc' },
            { label: 'Name Desc', value: 'name_desc' },
          ],
          onSortChange,
        }}
      />,
    );

    // Verify SearchFilterBar renders with both dropdowns
    expect(screen.getByTestId('searchBy')).toBeInTheDocument();
    expect(screen.getByTestId('sort')).toBeInTheDocument();

    // Test sort dropdown within SearchFilterBar
    const sortButton = screen.getByTestId('sort');
    fireEvent.click(sortButton);
    const sortOption = screen.getByTestId('name_asc');
    fireEvent.click(sortOption);

    expect(onSortChange).toHaveBeenCalledWith('name_asc');
  });

  test('handles sort change without onSortChange in SearchFilterBar', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{
          enabled: true,
          searchByOptions: [{ label: 'Name', value: 'name' }],
          fields: ['name'],
        }}
        sortConfig={{
          sortingOptions: [
            { label: 'Name Asc', value: 'name_asc' },
            { label: 'Name Desc', value: 'name_desc' },
          ],
          // No onSortChange - should use internal state
        }}
      />,
    );

    const sortButton = screen.getByTestId('sort');
    fireEvent.click(sortButton);
    const sortOption = screen.getByTestId('name_desc');
    fireEvent.click(sortOption);

    // Verify sort was applied using internal state
    const rows = screen.getAllByRole('row');
    expect(within(rows[1]).getByText('Charlie')).toBeInTheDocument();
  });

  test('handles search with null/undefined field values', () => {
    vi.useFakeTimers();
    const rowsWithNulls: TestRow[] = [
      { id: 1, name: 'Alice', role: null },
      { id: 2, name: null, role: 'User' },
      { id: 3, name: 'Charlie', role: 'Guest' },
    ];

    render(
      <DataGridWrapper
        {...defaultProps}
        rows={rowsWithNulls}
        searchConfig={{
          enabled: true,
          fields: ['name', 'role'],
        }}
      />,
    );

    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'User' } });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Should find row with role 'User' even though name is null
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.queryByText('Alice')).toBeNull();
    expect(screen.queryByText('Charlie')).toBeNull();

    vi.useRealTimers();
  });

  test('ignores whitespace-only search terms', () => {
    vi.useFakeTimers();
    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{
          enabled: true,
          fields: ['name'],
        }}
      />,
    );

    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: '   ' } });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    // All rows should still be visible (whitespace is trimmed and ignored)
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();

    vi.useRealTimers();
  });

  test('uses legacy emptyStateMessage prop', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        rows={[]}
        emptyStateMessage="No users available"
      />,
    );

    expect(screen.getByText('No users available')).toBeInTheDocument();
  });

  test('uses custom searchInputTestId for SearchBar', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{
          enabled: true,
          fields: ['name'],
          searchInputTestId: 'custom-search-input',
        }}
      />,
    );

    expect(screen.getByTestId('custom-search-input')).toBeInTheDocument();
  });

  test('uses custom placeholder for SearchBar', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{
          enabled: true,
          fields: ['name'],
          placeholder: 'Search users...',
        }}
      />,
    );

    const input = screen.getByRole('searchbox');
    expect(input).toHaveAttribute('placeholder', 'Search users...');
  });

  test('uses custom placeholder for SearchFilterBar', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{
          enabled: true,
          serverSide: true,
          searchByOptions: [{ label: 'Name', value: 'name' }],
          placeholder: 'Search by name...',
        }}
      />,
    );

    const input = screen.getByRole('searchbox');
    expect(input).toHaveAttribute('placeholder', 'Search by name...');
  });

  test('skips filter application when no filter is selected', () => {
    const filterFunction = vi.fn((rows: readonly TestRow[]) => rows);
    const filterConfig = {
      filterOptions: [
        { label: 'All', value: '' }, // Empty value
        { label: 'Adults', value: 'adults' },
      ],
      filterFunction,
    };

    render(<DataGridWrapper {...defaultProps} filterConfig={filterConfig} />);

    // All rows should be visible
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();

    // filterFunction should NOT have been called since selectedFilter is empty
    expect(filterFunction).not.toHaveBeenCalled();
  });
});
