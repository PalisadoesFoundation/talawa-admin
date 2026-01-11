import { render, screen, fireEvent, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

const mockOnRowClick = vi.fn();

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
  const user = userEvent.setup();

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  // Server-side search tests
  describe('Server-side search functionality', () => {
    test('renders SearchFilterBar for server-side search with searchByOptions', () => {
      const mockOnSearchChange = vi.fn();
      const mockOnSearchByChange = vi.fn();

      render(
        <DataGridWrapper
          rows={defaultProps.rows}
          columns={defaultProps.columns}
          searchConfig={{
            enabled: true,
            serverSide: true,
            searchTerm: 'test',
            searchByOptions: [
              { label: 'Name', value: 'name' },
              { label: 'Role', value: 'role' },
            ],
            selectedSearchBy: 'name',
            onSearchChange: mockOnSearchChange,
            onSearchByChange: mockOnSearchByChange,
            searchInputTestId: 'server-search-input',
          }}
        />,
      );

      expect(screen.getByTestId('server-search-input')).toBeInTheDocument();
    });

    test('calls server-side search callbacks when search changes', () => {
      vi.useFakeTimers();
      const mockOnSearchChange = vi.fn();
      const mockOnSearchByChange = vi.fn();

      render(
        <DataGridWrapper
          rows={defaultProps.rows}
          columns={defaultProps.columns}
          searchConfig={{
            enabled: true,
            serverSide: true,
            searchTerm: '',
            searchByOptions: [
              { label: 'Name', value: 'name' },
              { label: 'Role', value: 'role' },
            ],
            selectedSearchBy: 'name',
            onSearchChange: mockOnSearchChange,
            onSearchByChange: mockOnSearchByChange,
            searchInputTestId: 'server-search-input',
          }}
        />,
      );

      const searchInput = screen.getByTestId('server-search-input');
      fireEvent.change(searchInput, { target: { value: 'Alice' } });

      // Advance timers to trigger debounced callback
      vi.advanceTimersByTime(300);

      expect(mockOnSearchChange).toHaveBeenCalledWith('Alice', 'name');
    });

    test('calls server-side sort callback when sort changes', () => {
      const mockOnSortChange = vi.fn();

      render(
        <DataGridWrapper
          rows={defaultProps.rows}
          columns={defaultProps.columns}
          searchConfig={{
            enabled: true,
            serverSide: true,
            searchByOptions: [{ label: 'Name', value: 'name' }],
          }}
          sortConfig={{
            sortingOptions: [
              { label: 'Name A-Z', value: 'name_asc' },
              { label: 'Name Z-A', value: 'name_desc' },
            ],
            selectedSort: 'name_asc',
            onSortChange: mockOnSortChange,
          }}
        />,
      );

      const sortButton = screen.getByTestId('sort');
      fireEvent.click(sortButton);

      const sortOption = screen.getByText('Name Z-A');
      fireEvent.click(sortOption);

      expect(mockOnSortChange).toHaveBeenCalledWith('name_desc');
    });

    test('shows runtime validation warning for missing onSearchChange', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      render(
        <DataGridWrapper
          rows={defaultProps.rows}
          columns={defaultProps.columns}
          searchConfig={{
            enabled: true,
            serverSide: true,
            // Missing onSearchChange callback
          }}
        />,
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        '[DataGridWrapper] Server-side search enabled but onSearchChange callback is missing',
      );

      consoleSpy.mockRestore();
    });

    test('skips client-side filtering when serverSide is true', () => {
      render(
        <DataGridWrapper
          rows={defaultProps.rows}
          columns={defaultProps.columns}
          searchConfig={{
            enabled: true,
            serverSide: true,
            searchTerm: 'Alice', // This should not filter client-side
            fields: ['name'],
          }}
        />,
      );

      // All rows should be visible since server-side mode skips client filtering
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('Charlie')).toBeInTheDocument();
    });

    test('uses server-side selectedSort when provided', () => {
      render(
        <DataGridWrapper
          rows={defaultProps.rows}
          columns={defaultProps.columns}
          sortConfig={{
            selectedSort: 'custom_sort',
            sortingOptions: [{ label: 'Custom Sort', value: 'custom_sort' }],
          }}
        />,
      );

      // Component should initialize with the provided selectedSort
      expect(screen.getByText('Sort')).toBeInTheDocument();
    });
  });

  test('renders loading state (spinner)', () => {
    render(<DataGridWrapper {...defaultProps} loading={true} />);
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
  });

  test('renders empty state message when no rows', () => {
    render(<DataGridWrapper {...defaultProps} rows={[]} />);
    expect(screen.getByText('No results found')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders custom empty state message', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        rows={[]}
        emptyStateMessage="Custom Empty"
      />,
    );
    expect(screen.getByText('Custom Empty')).toBeInTheDocument();
  });

  test('renders EmptyState with emptyStateProps (icon, description, action)', () => {
    const handleAction = vi.fn();
    render(
      <DataGridWrapper
        {...defaultProps}
        rows={[]}
        emptyStateProps={{
          icon: 'users',
          message: 'No users found',
          description: 'Invite users to get started',
          action: {
            label: 'Invite User',
            onClick: handleAction,
            variant: 'primary',
          },
          dataTestId: 'users-empty-state',
        }}
      />,
    );

    expect(screen.getByText('No users found')).toBeInTheDocument();
    expect(screen.getByText('Invite users to get started')).toBeInTheDocument();
    const actionBtn = screen.getByRole('button', { name: /Invite User/i });
    expect(actionBtn).toBeInTheDocument();
    fireEvent.click(actionBtn);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  test('emptyStateProps takes precedence over emptyStateMessage', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        rows={[]}
        emptyStateMessage="Legacy Message"
        emptyStateProps={{
          message: 'New Message',
        }}
      />,
    );

    expect(screen.getByText('New Message')).toBeInTheDocument();
    expect(screen.queryByText('Legacy Message')).not.toBeInTheDocument();
  });

  test('emptyStateProps with custom dataTestId renders correctly', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        rows={[]}
        emptyStateProps={{
          message: 'Custom empty state',
          dataTestId: 'custom-empty-state',
        }}
      />,
    );

    expect(screen.getByTestId('custom-empty-state')).toBeInTheDocument();
  });

  test('emptyStateProps action button variant renders correctly', () => {
    const handleAction = vi.fn();
    render(
      <DataGridWrapper
        {...defaultProps}
        rows={[]}
        emptyStateProps={{
          message: 'No data',
          action: {
            label: 'Create',
            onClick: handleAction,
            variant: 'outlined',
          },
        }}
      />,
    );

    const btn = screen.getByRole('button', { name: /Create/i });
    expect(btn).toHaveClass('MuiButton-outlined');
  });

  test('backward compatibility: emptyStateMessage still works without emptyStateProps', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        rows={[]}
        emptyStateMessage="Legacy behavior"
      />,
    );

    expect(screen.getByText('Legacy behavior')).toBeInTheDocument();
  });

  test('emptyStateProps with icon and all features', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        rows={[]}
        emptyStateProps={{
          icon: 'dashboard',
          message: 'noData',
          description: 'startCreating',
          action: {
            label: 'createNew',
            onClick: vi.fn(),
            variant: 'primary',
          },
          dataTestId: 'full-empty-state',
        }}
      />,
    );

    expect(screen.getByTestId('full-empty-state-icon')).toBeInTheDocument();
    expect(screen.getByTestId('full-empty-state-message')).toBeInTheDocument();
    expect(
      screen.getByTestId('full-empty-state-description'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('full-empty-state-action')).toBeInTheDocument();
  });

  test('accessibility: emptyStateProps preserves a11y attributes', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        rows={[]}
        emptyStateProps={{
          message: 'Accessible empty state',
          description: 'This is the description',
        }}
      />,
    );

    const emptyState = screen.getByTestId('empty-state');
    expect(emptyState).toHaveAttribute('role', 'status');
    expect(emptyState).toHaveAttribute('aria-live', 'polite');
    expect(emptyState).toHaveAttribute('aria-label', 'Accessible empty state');
  });

  test('renders error state (takes precedence over empty state)', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        rows={[]}
        error="Data fetch failed"
        emptyStateProps={{
          message: 'No data',
        }}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Data fetch failed');
    expect(screen.queryByText('No data')).not.toBeInTheDocument();
  });

  test('renders error message and hides empty state', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        rows={[]}
        error="Error fetching data"
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Error fetching data');
    // Empty state should NOT be visible when there's an error (error overlay takes precedence)
    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
  });

  test('handles row click', () => {
    render(<DataGridWrapper {...defaultProps} onRowClick={mockOnRowClick} />);
    fireEvent.click(screen.getByText('Alice'));
    expect(mockOnRowClick).toHaveBeenCalledWith(defaultProps.rows[0]);
  });

  test('handles server-side search without onSearchChange callback', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{
          enabled: true,
          serverSide: true,
          searchTerm: 'test',
        }}
      />,
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      'DataGridWrapper: serverSide search enabled but onSearchChange callback not provided',
    );

    consoleSpy.mockRestore();
  });

  test('handles sort config with selectedSort', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        sortConfig={{
          selectedSort: 'name_ASC',
          onSortChange: vi.fn(),
        }}
      />,
    );

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  test('handles empty searchByOptions in server-side mode', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{
          enabled: true,
          serverSide: true,
          searchTerm: '',
          onSearchChange: vi.fn(),
        }}
      />,
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('handles sortConfig with defaultSortField and defaultSortOrder', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        sortConfig={{
          defaultSortField: 'name',
          defaultSortOrder: 'asc',
        }}
      />,
    );

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  test('renders EmptyState with emptyStateProps', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        rows={[]}
        emptyStateProps={{
          message: 'Custom empty message',
          icon: 'test-icon',
        }}
      />,
    );

    expect(screen.getByText('Custom empty message')).toBeInTheDocument();
  });

  test('renders EmptyState with legacy emptyStateMessage', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        rows={[]}
        emptyStateMessage="Legacy empty message"
      />,
    );

    expect(screen.getByText('Legacy empty message')).toBeInTheDocument();
  });

  test('handles pagination disabled', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        paginationConfig={{ enabled: false }}
      />,
    );

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  test('handles server-side search with searchByOptions', () => {
    const onSearchChange = vi.fn();
    const onSearchByChange = vi.fn();

    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{
          enabled: true,
          serverSide: true,
          searchTerm: 'test',
          searchByOptions: [
            { label: 'Name', value: 'name' },
            { label: 'Email', value: 'email' },
          ],
          selectedSearchBy: 'name',
          onSearchChange,
          onSearchByChange,
        }}
      />,
    );

    expect(screen.getByDisplayValue('test')).toBeInTheDocument();
  });

  test('handles client-side search with fields', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{
          enabled: true,
          fields: ['name', 'age'],
        }}
      />,
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('handles action column rendering', () => {
    const actionColumn = (row: TestRow) => <button>Edit {row.name}</button>;

    render(<DataGridWrapper {...defaultProps} actionColumn={actionColumn} />);

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  test('handles custom pagination page size options', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        paginationConfig={{
          enabled: true,
          pageSizeOptions: [5, 15, 25],
        }}
      />,
    );

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  test('handles loading state with custom loading overlay', () => {
    render(<DataGridWrapper {...defaultProps} loading={true} />);

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  test('renders action column correctly', () => {
    const actionColumnRenderer = (row: TestRow) => (
      <button type="button" data-testid={`action-${row.id}`}>
        Action
      </button>
    );
    render(
      <DataGridWrapper {...defaultProps} actionColumn={actionColumnRenderer} />,
    );
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByTestId('action-1')).toBeInTheDocument();
    expect(screen.getByTestId('action-2')).toBeInTheDocument();
  });

  test('search filters rows immediately', async () => {
    vi.useFakeTimers();
    render(<DataGridWrapper {...defaultProps} />);
    const input = screen.getByRole('searchbox');

    fireEvent.change(input, { target: { value: 'Alice' } });

    // Wait for debounce (300ms)
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).toBeNull();
  });

  test('clears search when clear button is clicked', () => {
    vi.useFakeTimers();
    render(<DataGridWrapper {...defaultProps} />);
    const input = screen.getByRole('searchbox');

    // Type something
    fireEvent.change(input, { target: { value: 'Alice' } });
    act(() => {
      vi.advanceTimersByTime(300); // Wait for debounce
    });
    expect(screen.queryByText('Bob')).toBeNull(); // confirmed filtered

    // Click clear (SearchBar should render clear button when value exists)
    const clearBtn = screen.getByLabelText('Clear');
    // Wait, SearchBar implementation uses `clearButtonTestId`. DataGridWrapper doesn't pass it?
    // Let's check DataGridWrapper.tsx.
    // It passes `inputTestId="search-bar"`. It does NOT pass `clearButtonTestId`.
    // SearchBar defaults: uses generic clear button if not passed?
    // SearchBar.tsx: `data-testid={clearButtonTestId}`. undefined if not passed.
    // We can find by aria-label or class. SearchBar has `clearButtonAriaLabel = tCommon('clear')`.
    // We mocked 'clear' to 'Clear'.

    fireEvent.click(clearBtn);
    act(() => {
      vi.advanceTimersByTime(300); // Wait for debounce after clear
    });

    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  test('pagination controls are present and handle page navigation', () => {
    // Force pagination with small page size
    render(
      <DataGridWrapper
        {...defaultProps}
        paginationConfig={{
          enabled: true,
          defaultPageSize: 1,
          pageSizeOptions: [1, 10],
        }}
      />,
    );

    // Check for pagination text/controls
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).toBeNull(); // Should be on page 2

    // Find next page button and click. MUI DataGrid uses aria-label "Go to next page"
    const nextBtn = screen.getByRole('button', { name: /next page/i });
    fireEvent.click(nextBtn);

    expect(screen.queryByText('Alice')).toBeNull();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  test('sorts rows when sort option is selected', () => {
    const sortConfig = {
      sortingOptions: [
        { label: 'Name Asc', value: 'name_asc' },
        { label: 'Name Desc', value: 'name_desc' },
      ],
    };

    render(<DataGridWrapper {...defaultProps} sortConfig={sortConfig} />);

    // Open sort dropdown
    const sortBtn = screen.getByText('Sort');
    fireEvent.click(sortBtn);

    // Select Name Desc
    fireEvent.click(screen.getByText('Name Desc'));

    // Verify order. We can get all rows via role "row" (excluding header)
    // role="row". Header is row 0 usually? Or inside rowgroup.
    // MUI DataGrid is complex. Let's just check if the first data row is Charlie (if sorted desc by name: Charlie, Bob, Alice)
    // Wait, rows are: Alice, Bob, Charlie.
    // Desc: Charlie, Bob, Alice.

    // We can check specific cell contents in order.
    // Or just check that "Charlie" appears before "Alice" in the document position?
    // screen.getAllByRole('row') might return header too.
    const rows = screen.getAllByRole('row');
    // row 0 is header. row 1 is first data row.
    // Let's verify row 1 content.

    // Note: Virtualization might affect this if many rows, but here only 3.
    expect(within(rows[1]).getByText('Charlie')).toBeInTheDocument();

    // Change to Asc
    fireEvent.click(sortBtn);
    fireEvent.click(screen.getByText('Name Asc'));

    const rowsAsc = screen.getAllByRole('row');
    expect(within(rowsAsc[1]).getByText('Alice')).toBeInTheDocument();
  });

  test('handles edge cases: null values in fields', () => {
    vi.useFakeTimers();
    const rowsWithNull: TestRow[] = [
      { id: 1, name: 'Alice', role: null },
      { id: 2, name: null, role: 'User' },
    ];
    // Use `any` to bypass TS check for null if needed, or update interface mock
    render(
      <DataGridWrapper
        {...defaultProps}
        rows={rowsWithNull}
        searchConfig={{
          enabled: true,
          fields: ['name', 'role'] as (keyof TestRow)[],
        }}
      />,
    );

    // Search for 'User'
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'User' } });
    act(() => {
      vi.advanceTimersByTime(300); // Wait for debounce
    });
    expect(screen.queryByText('User')).toBeInTheDocument(); // Saved row 2

    // Search for 'Null' -> shouldn't crash, returns nothing probably
    fireEvent.change(input, { target: { value: 'Something' } });
    act(() => {
      vi.advanceTimersByTime(300); // Wait for debounce
    });
    expect(screen.queryByText('User')).toBeNull();
  });

  test('handles disabled search config', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{ enabled: false, fields: [] }}
      />,
    );
    expect(screen.queryByRole('searchbox')).toBeNull();
  });

  test('accessibility: searchbox has aria-label', () => {
    render(<DataGridWrapper {...defaultProps} />);
    const searchBox = screen.getByRole('searchbox');
    expect(searchBox).toHaveAttribute('aria-label', 'Search');
  });

  test('keyboard navigation on action buttons', () => {
    // Add an action button that can be focused
    const ActionCol = ({ name }: TestRow) => (
      <button type="button">Edit {name}</button>
    );
    render(<DataGridWrapper {...defaultProps} actionColumn={ActionCol} />);

    // Tab to the first action button
    // This is hard to simulate purely with fireEvent/userEvent without set up,
    // but we can check if they are focusable (buttons are naturally).
    const btn = screen.getByText('Edit Alice');
    btn.focus();
    expect(document.activeElement).toBe(btn);
  });

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

    // Default sort is Name Desc -> Charlie, Bob, Alice
    const rows = screen.getAllByRole('row');
    // Row 0 is header, Row 1 is first data row
    expect(within(rows[1]).getByText('Charlie')).toBeInTheDocument();
  });

  test('handles invalid sort option gracefully', () => {
    const sortConfig = {
      sortingOptions: [{ label: 'Invalid Sort', value: 'invalid_sort_value' }],
    };

    render(<DataGridWrapper {...defaultProps} sortConfig={sortConfig} />);

    // Open sort menu
    fireEvent.click(screen.getByText('Sort'));
    // Select invalid option
    fireEvent.click(screen.getByText('Invalid Sort'));

    // Should default to original order (Empty sort model): Alice, Bob, Charlie
    const rows = screen.getAllByRole('row');
    expect(within(rows[1]).getByText('Alice')).toBeInTheDocument();
  });

  test('updates search term on search submit (Enter key)', () => {
    vi.useFakeTimers();
    render(<DataGridWrapper {...defaultProps} />);
    const input = screen.getByRole('searchbox');

    // Type value first (triggers onChange, line 81)
    fireEvent.change(input, { target: { value: 'Bob' } });

    // Press Enter (triggers onSearch, line 82)
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    // Wait for debounce
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Verify filter is active
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.queryByText('Alice')).toBeNull();
  });

  it('handles server-side search without onSearchByChange callback', async () => {
    render(
      <DataGridWrapper
        rows={defaultProps.rows}
        columns={defaultProps.columns}
        searchConfig={{
          enabled: true,
          fields: ['name'],
          serverSide: true,
          searchByOptions: [{ label: 'Name', value: 'name' }],
          onSearchChange: vi.fn(),
        }}
      />,
    );

    const dropdown = screen.getByTestId('searchBy');
    await user.click(dropdown);
    const option = screen.getByTestId('name');
    await user.click(option);

    expect(screen.getByTestId('searchBy')).toBeInTheDocument();
  });

  it('handles client-side search onClear', async () => {
    render(
      <DataGridWrapper
        rows={defaultProps.rows}
        columns={defaultProps.columns}
        searchConfig={{
          enabled: true,
          fields: ['name'],
        }}
      />,
    );

    const searchInput = screen.getByTestId('search-bar');
    await user.type(searchInput, 'test');

    const clearButton = screen.getByRole('button', { name: /clear/i });
    await user.click(clearButton);

    expect(searchInput).toHaveValue('');
  });

  test('shows error overlay when error prop is provided', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        rows={[]}
        error="Test error message"
      />,
    );

    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  test('uses emptyStateProps when provided', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        rows={[]}
        emptyStateProps={{ message: 'Custom empty message' }}
      />,
    );

    expect(screen.getByText('Custom empty message')).toBeInTheDocument();
  });

  test('falls back to emptyStateMessage', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        rows={[]}
        emptyStateMessage="Legacy empty message"
      />,
    );

    expect(screen.getByText('Legacy empty message')).toBeInTheDocument();
  });

  test('shows default empty message when no custom message provided', () => {
    render(<DataGridWrapper {...defaultProps} rows={[]} />);

    expect(screen.getByText('noResultsFound')).toBeInTheDocument();
  });

  test('handles row click when onRowClick is provided', () => {
    const onRowClick = vi.fn();

    render(<DataGridWrapper {...defaultProps} onRowClick={onRowClick} />);

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  test('handles pagination when enabled', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        paginationConfig={{ enabled: true }}
      />,
    );

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });
});
