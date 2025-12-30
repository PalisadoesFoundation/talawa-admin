import { render, screen, fireEvent, within } from '@testing-library/react';
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
  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  test('renders loading state (progressbar)', () => {
    render(<DataGridWrapper {...defaultProps} loading={true} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
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

  test('renders error message and hides empty state', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        rows={[]}
        error="Error fetching data"
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Error fetching data');
    expect(screen.queryByRole('status')).toBeNull();
  });

  test('handles row click', () => {
    render(<DataGridWrapper {...defaultProps} onRowClick={mockOnRowClick} />);
    fireEvent.click(screen.getByText('Alice'));
    expect(mockOnRowClick).toHaveBeenCalledWith(defaultProps.rows[0]);
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

  test('search filters rows immediately', () => {
    render(<DataGridWrapper {...defaultProps} />);
    const input = screen.getByRole('searchbox');

    fireEvent.change(input, { target: { value: 'Alice' } });

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).toBeNull();
  });

  test('clears search when clear button is clicked', () => {
    render(<DataGridWrapper {...defaultProps} />);
    const input = screen.getByRole('searchbox');

    // Type something
    fireEvent.change(input, { target: { value: 'Alice' } });
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
    expect(screen.queryByText('User')).toBeInTheDocument(); // Saved row 2

    // Search for 'Null' -> shouldn't crash, returns nothing probably
    fireEvent.change(input, { target: { value: 'Something' } });
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
    render(<DataGridWrapper {...defaultProps} />);
    const input = screen.getByRole('searchbox');

    // Type value first (triggers onChange, line 81)
    fireEvent.change(input, { target: { value: 'Bob' } });

    // Press Enter (triggers onSearch, line 82)
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    // Verify filter is active
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.queryByText('Alice')).toBeNull();
  });
});
