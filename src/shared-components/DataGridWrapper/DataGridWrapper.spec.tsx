import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataGridWrapper, convertTokenColumns } from './index';
import { vi } from 'vitest';
import React from 'react';
import type {
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
  GridValidRowModel,
} from '@mui/x-data-grid';
import type { TokenAwareGridColDef } from '../../types/DataGridWrapper/interface';
import type { SpacingToken } from '../../utils/tokenValues';

interface IRenderCellCall {
  row: TestRow;
  col: GridColDef;
}

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

// Mock components with callbacks tracking - reset in beforeEach
let renderCellCalls: IRenderCellCall[] = [];

// Mock DataGrid
vi.mock('@mui/x-data-grid', () => ({
  DataGrid: ({
    onPaginationModelChange,
    onRowClick,
    slots,
    loading,
    rows,
    columns,
    sortModel,
  }: {
    onPaginationModelChange?: (model: {
      page: number;
      pageSize: number;
    }) => void;
    onRowClick?: (params: { row: TestRow }) => void;
    slots?: {
      loadingOverlay?: () => React.ReactNode;
      noRowsOverlay?: () => React.ReactNode;
    };
    loading?: boolean;
    rows: GridRowsProp;
    columns: GridColDef[];
    sortModel?: Array<{ field: string; sort: 'asc' | 'desc' }>;
  }) => {
    // Sort rows if sortModel is provided
    const sortedRows =
      sortModel && sortModel.length > 0
        ? [...rows].sort((a, b) => {
            const { field, sort } = sortModel[0];
            const aValue = a[field as keyof typeof a];
            const bValue = b[field as keyof typeof b];

            if (sort === 'asc') {
              return String(aValue).localeCompare(String(bValue));
            } else {
              return String(bValue).localeCompare(String(aValue));
            }
          })
        : rows;

    return (
      <div data-testid="data-grid">
        <button
          type="button"
          data-testid="trigger-pagination-change"
          onClick={() => {
            if (onPaginationModelChange) {
              onPaginationModelChange({ page: 1, pageSize: 25 });
            }
          }}
        >
          Trigger Pagination
        </button>

        <div role="grid">
          <div role="row">
            {columns.map((col: GridColDef) => (
              <div key={col.field} role="columnheader">
                {col.headerName}
              </div>
            ))}
          </div>
          {!loading &&
            sortedRows.map((row: GridValidRowModel) => (
              <div
                key={row.id}
                role="row"
                data-testid={`row-${row.id}`}
                tabIndex={0}
                onClick={() =>
                  onRowClick && onRowClick({ row: row as TestRow })
                }
              >
                {columns.map((col: GridColDef) => {
                  if (col.field === '__actions__' && col.renderCell) {
                    renderCellCalls.push({ row: row as TestRow, col });
                    // Create minimal params object for renderCell
                    const params = {
                      row: row as TestRow,
                      value: row[col.field as keyof GridValidRowModel],
                      field: col.field,
                      id: row.id,
                      api: {},
                      rowNode: { id: row.id },
                      cellMode: 'view' as const,
                      hasFocus: false,
                      tabIndex: -1,
                      formattedValue: String(
                        row[col.field as keyof GridValidRowModel],
                      ),
                    };
                    const renderedCell = col.renderCell(
                      params as GridRenderCellParams,
                    );
                    return (
                      <div
                        key={col.field}
                        role="gridcell"
                        data-testid={`action-cell-${row.id}`}
                        tabIndex={0}
                      >
                        {renderedCell}
                      </div>
                    );
                  }
                  return (
                    <div key={col.field} role="gridcell" tabIndex={0}>
                      {row[col.field as keyof GridValidRowModel] as string}
                    </div>
                  );
                })}
              </div>
            ))}
        </div>
        {loading && slots?.loadingOverlay && (
          <div data-testid="loading-overlay">{slots.loadingOverlay()}</div>
        )}
        {rows.length === 0 && !loading && slots?.noRowsOverlay && (
          <div data-testid="no-rows-overlay">{slots.noRowsOverlay()}</div>
        )}
      </div>
    );
  },
}));

// Mock SearchBar
vi.mock('../SearchBar/SearchBar', () => ({
  default: ({
    value,
    onChange,
    onSearch,
    onClear,
    placeholder,
    inputTestId,
  }: {
    value: string;
    onChange: (value: string) => void;
    onSearch?: (value: string) => void;
    onClear?: () => void;
    placeholder?: string;
    inputTestId?: string;
  }) => (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onSearch) {
            onSearch(value);
          }
        }}
        placeholder={placeholder}
        role="searchbox"
        data-testid={inputTestId || 'search-bar'}
      />
      <button
        type="button"
        onClick={() => onSearch && onSearch(value)}
        data-testid="search-button"
      >
        Search
      </button>
      <button
        type="button"
        onClick={() => {
          onClear?.();
          onChange('');
        }}
        aria-label="Clear"
      >
        Clear
      </button>
    </div>
  ),
}));

// Mock SearchFilterBar
vi.mock('../SearchFilterBar/SearchFilterBar', () => ({
  default: ({
    searchValue,
    onSearchChange,
    onSearchSubmit,
    searchInputTestId = 'searchInput',
    dropdowns,
  }: {
    searchValue: string;
    onSearchChange: (value: string) => void;
    onSearchSubmit?: (value: string) => void;
    searchInputTestId?: string;
    dropdowns?: Array<{
      id: string;
      type: string;
      options?: Array<{ value: string | number; label: string }>;
      selectedOption?: string | number;
      onOptionChange?: (value: string | number) => void;
      dataTestIdPrefix?: string;
    }>;
  }) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    return (
      <div data-testid="search-filter-bar">
        <input
          ref={inputRef}
          type="search"
          defaultValue={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search"
          data-testid={searchInputTestId}
        />
        <button
          type="button"
          data-testid="search-submit-btn"
          onClick={() =>
            onSearchSubmit &&
            inputRef.current &&
            onSearchSubmit(inputRef.current.value)
          }
        >
          Submit
        </button>
        {dropdowns?.map((dropdown) => (
          <button
            type="button"
            key={dropdown.id}
            data-testid={`${dropdown.dataTestIdPrefix || dropdown.id}-trigger`}
            onClick={() => {
              if (dropdown.onOptionChange && dropdown.selectedOption) {
                dropdown.onOptionChange(dropdown.selectedOption);
              }
            }}
          >
            Trigger {dropdown.id}
          </button>
        ))}
      </div>
    );
  },
}));

vi.mock('shared-components/EmptyState/EmptyState', () => ({
  default: ({
    message,
    dataTestId,
  }: {
    message: string;
    dataTestId?: string;
  }) => (
    <div data-testid={dataTestId || 'empty-state'}>
      <div data-testid="empty-state-message">{message}</div>
    </div>
  ),
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
  paginationConfig: { enabled: true },
};

describe('DataGridWrapper', () => {
  beforeEach(() => {
    renderCellCalls = [];
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Basic rendering tests
  test('renders with minimal props using defaults', () => {
    render(<DataGridWrapper />);
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  test('renders with default props', () => {
    render(<DataGridWrapper {...defaultProps} />);
    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  // Search functionality tests
  test('handles client-side search', async () => {
    const user = userEvent.setup();
    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{ enabled: true, fields: ['name'], debounceMs: 0 }}
      />,
    );

    const input = screen.getByRole('searchbox');
    await user.clear(input);
    await user.type(input, 'Alice');
    expect(input).toHaveValue('Alice');
  });

  test('handles server-side search with SearchFilterBar', async () => {
    const user = userEvent.setup();
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

    const searchInput = screen.getByTestId('searchInput') as HTMLInputElement;
    await user.clear(searchInput);
    await user.type(searchInput, 'test');
    await user.click(screen.getByTestId('search-submit-btn'));

    // Verify the callback was called with user input
    expect(onSearchChange).toHaveBeenCalledWith('test', 'name');
  });

  test('shows warning for server-side search without callback', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{ enabled: true, serverSide: true }}
      />,
    );
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  // Sort functionality tests
  test('configures and renders sorting options', () => {
    const sortConfig = {
      sortingOptions: [
        { label: 'Name Asc', value: 'name_asc' },
        { label: 'Name Desc', value: 'name_desc' },
      ],
    };

    render(<DataGridWrapper {...defaultProps} sortConfig={sortConfig} />);

    // Verify sorting UI is rendered when sortConfig provided
    expect(screen.getByText('Sort')).toBeInTheDocument();
    // Verify the grid renders with sort configuration
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  test('warns on invalid sort format', () => {
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
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  // Pagination tests
  test('configures and renders pagination controls', async () => {
    const user = userEvent.setup();
    render(
      <DataGridWrapper
        {...defaultProps}
        paginationConfig={{ enabled: true, defaultPageSize: 10 }}
      />,
    );
    await user.click(screen.getByTestId('trigger-pagination-change'));
    // Verify pagination is configured (mock calls onPaginationModelChange)
    expect(screen.getByTestId('data-grid')).toBeInTheDocument();
  });

  // State tests
  test('renders loading state', () => {
    render(<DataGridWrapper {...defaultProps} loading={true} />);
    expect(screen.getByTestId('loading-overlay')).toBeInTheDocument();
  });

  test('renders error overlay', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        rows={[]}
        error="Test error message"
      />,
    );

    expect(screen.getByTestId('data-grid-error-overlay')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });
  test('renders empty state with props', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        rows={[]}
        emptyStateProps={{ message: 'Custom empty' }}
      />,
    );
    expect(screen.getByText('Custom empty')).toBeInTheDocument();
  });

  test('shows default no results found', () => {
    render(<DataGridWrapper {...defaultProps} rows={[]} />);
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  // Interaction tests
  test('handles row click', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    render(<DataGridWrapper {...defaultProps} onRowClick={onRowClick} />);
    await user.click(screen.getByTestId('row-1'));
    expect(onRowClick).toHaveBeenCalled();
  });

  test('renders action column', () => {
    const actionColumn = (row: TestRow) => (
      <button type="button" data-testid={`action-${row.id}`}>
        Edit
      </button>
    );
    render(<DataGridWrapper {...defaultProps} actionColumn={actionColumn} />);
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(renderCellCalls.length).toBeGreaterThan(0);
  });

  // Edge case tests
  test('handles null values in search fields', async () => {
    const user = userEvent.setup();
    const rowsWithNulls = [
      { id: 1, name: null, role: 'Admin' },
      { id: 2, name: 'Bob', role: null },
    ];

    render(
      <DataGridWrapper
        {...defaultProps}
        rows={rowsWithNulls}
        searchConfig={{
          enabled: true,
          fields: ['name', 'role'],
          debounceMs: 0,
        }}
      />,
    );

    const input = screen.getByRole('searchbox');
    await user.clear(input);
    await user.type(input, 'Admin');
  });

  test('SearchFilterBar with both dropdowns', async () => {
    const user = userEvent.setup();
    const onSearchByChange = vi.fn();
    const onSortChange = vi.fn();

    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{
          enabled: true,
          serverSide: true,
          searchByOptions: [
            { label: 'Name', value: 'name' },
            { label: 'Role', value: 'role' },
          ],
          selectedSearchBy: 'name',
          onSearchChange: vi.fn(),
          onSearchByChange,
        }}
        sortConfig={{
          sortingOptions: [
            { label: 'Name A-Z', value: 'name_asc' },
            { label: 'Name Z-A', value: 'name_desc' },
          ],
          selectedSort: 'name_asc',
          onSortChange,
        }}
      />,
    );

    // Click the triggers
    await user.click(screen.getByTestId('searchBy-trigger'));
    await user.click(screen.getByTestId('sort-trigger'));

    expect(onSearchByChange).toHaveBeenCalledWith('name');
    expect(onSortChange).toHaveBeenCalledWith('name_asc');
  });

  // Debounce cleanup test
  test('cleans up debounce timer', async () => {
    const user = userEvent.setup();
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    const { unmount } = render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{ enabled: true, fields: ['name'], debounceMs: 100 }}
      />,
    );

    const input = screen.getByRole('searchbox');
    await user.clear(input);
    await user.type(input, 'test');
    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });

  test('warns for server-side search without onSearchChange callback', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{
          enabled: true,
          serverSide: true,
          searchByOptions: [{ label: 'Name', value: 'name' }],
          // No onSearchChange - should warn
        }}
      />,
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      '[DataGridWrapper] Server-side search enabled but onSearchChange callback is missing',
    );
    consoleSpy.mockRestore();
  });

  test('filter function handles nullish values with coalescing operator', async () => {
    const user = userEvent.setup();
    const rowsWithNullish = [
      { id: 1, name: null, role: undefined },
      { id: 2, name: 'Bob', role: 'User' },
      { id: 3, name: 'Charlie', role: null },
    ];

    render(
      <DataGridWrapper
        {...defaultProps}
        rows={rowsWithNullish}
        searchConfig={{
          enabled: true,
          fields: ['name', 'role'],
          debounceMs: 0,
        }}
      />,
    );

    const input = screen.getByRole('searchbox');

    // Test 1: Searching for 'Bob' (non-null value)
    await user.clear(input);
    await user.type(input, 'Bob');
    expect(input).toHaveValue('Bob');

    // Test 2: Searching for 'User' (non-undefined value)
    await user.clear(input);
    await user.type(input, 'User');
    expect(input).toHaveValue('User');

    // Test 3: Searching for empty string (should show all rows)
    await user.clear(input);
    expect(input).toHaveValue('');

    // Test 4: Searching for non-existent value
    await user.type(input, 'Nonexistent');
    expect(input).toHaveValue('Nonexistent');
  });

  test('sort dropdown else branch (no onSortChange)', async () => {
    const user = userEvent.setup();
    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{
          enabled: true,
          serverSide: true,
          searchByOptions: [{ label: 'Name', value: 'name' }],
          onSearchChange: vi.fn(),
        }}
        sortConfig={{
          sortingOptions: [
            { label: 'Name A-Z', value: 'name_asc' },
            { label: 'Name Z-A', value: 'name_desc' },
          ],
          selectedSort: 'name_asc',
          // No onSortChange - tests line 244 else branch
        }}
      />,
    );

    // Click the sort trigger button
    await user.click(screen.getByTestId('sort-trigger'));

    expect(screen.getByTestId('search-filter-bar')).toBeInTheDocument();
  });

  test('noRowsOverlay slot handles all conditions', () => {
    // Test error state
    const { rerender } = render(
      <DataGridWrapper {...defaultProps} rows={[]} error="Test error" />,
    );

    expect(screen.getByTestId('data-grid-error-overlay')).toBeInTheDocument();

    // Test emptyStateProps
    rerender(
      <DataGridWrapper
        {...defaultProps}
        rows={[]}
        emptyStateProps={{ message: 'From props' }}
      />,
    );

    expect(screen.getByText('From props')).toBeInTheDocument();

    // Test emptyStateMessage
    rerender(
      <DataGridWrapper
        {...defaultProps}
        rows={[]}
        emptyStateMessage="From message"
      />,
    );

    expect(screen.getByText('From message')).toBeInTheDocument();

    // Test default fallback
    rerender(<DataGridWrapper {...defaultProps} rows={[]} />);

    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  test('search term updates on Enter key press', async () => {
    const user = userEvent.setup();
    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{ enabled: true, fields: ['name'] }}
      />,
    );

    const input = screen.getByRole('searchbox');
    await user.clear(input);
    await user.type(input, 'test{Enter}');

    expect(input).toHaveValue('test');
  });

  test('handles server-side search without selectedSearchBy', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();

    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{
          enabled: true,
          serverSide: true,
          searchByOptions: [{ label: 'Name', value: 'name' }],
          // No selectedSearchBy
          onSearchChange,
        }}
      />,
    );

    const searchInput = screen.getByTestId('searchInput') as HTMLInputElement;
    await user.clear(searchInput);
    await user.type(searchInput, 'test');
    await user.click(screen.getByTestId('search-submit-btn'));

    expect(onSearchChange).toHaveBeenCalledWith('test', undefined);
  });

  test('SearchFilterBar callbacks execute correctly', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    const onSearchByChange = vi.fn();

    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{
          enabled: true,
          serverSide: true,
          searchByOptions: [
            { label: 'Name', value: 'name' },
            { label: 'Role', value: 'role' },
          ],
          selectedSearchBy: 'name',
          onSearchChange,
          onSearchByChange,
        }}
      />,
    );

    const searchInput = screen.getByTestId('searchInput') as HTMLInputElement;
    await user.clear(searchInput);
    await user.type(searchInput, 'test');
    await user.click(screen.getByTestId('search-submit-btn'));

    // Click the searchBy trigger button
    await user.click(screen.getByTestId('searchBy-trigger'));

    expect(onSearchChange).toHaveBeenCalledWith('test', 'name');
    expect(onSearchByChange).toHaveBeenCalledWith('name');
  });

  // Test with empty searchConfig.fields
  test('handles empty search fields array', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{ enabled: true, fields: [] }}
      />,
    );

    // Should render without errors
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  // Test server-side filtering path
  test('skips client-side filtering for server-side search', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{
          enabled: true,
          serverSide: true,
          searchTerm: 'prefilled',
          searchByOptions: [{ label: 'Name', value: 'name' }],
          onSearchChange: vi.fn(),
        }}
      />,
    );

    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  // More specific test for onSearchSubmit with submit button
  test('Submit button triggers onSearchSubmit in SearchFilterBar', async () => {
    const user = userEvent.setup();
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

    const searchInput = screen.getByTestId('searchInput') as HTMLInputElement;
    await user.clear(searchInput);
    await user.type(searchInput, 'test');
    await user.click(screen.getByTestId('search-submit-btn'));

    expect(onSearchChange).toHaveBeenCalledWith('test', 'name');
  });

  // More comprehensive test for line 260
  test('noRowsOverlay uses tCommon when no custom messages provided', () => {
    const { rerender } = render(
      <DataGridWrapper
        rows={[]}
        columns={[{ field: 'name', headerName: 'Name' }]}
        error={undefined}
        emptyStateProps={undefined}
        emptyStateMessage={undefined}
      />,
    );

    // Should show default message
    expect(screen.getByText('No results found')).toBeInTheDocument();

    // Test that emptyStateMessage overrides
    rerender(
      <DataGridWrapper
        rows={[]}
        columns={[{ field: 'name', headerName: 'Name' }]}
        emptyStateMessage="Custom message"
      />,
    );

    expect(screen.getByText('Custom message')).toBeInTheDocument();
  });

  test('simulate onSearchSubmit for client-side search', async () => {
    const user = userEvent.setup();

    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{
          enabled: true,
          searchByOptions: [{ label: 'Name', value: 'name' }],
          debounceMs: 0,
        }}
      />,
    );

    // Find the search input and simulate Enter key
    const searchInput = screen.getByTestId('searchInput');

    // Type something
    await user.clear(searchInput);
    await user.type(searchInput, 'test search{Enter}');

    // Verify search term was applied
    expect(searchInput).toHaveValue('test search');
  });

  // Default sort initialization
  test('initializes selectedSort from defaultSortField and defaultSortOrder', () => {
    // Create rows with names in mixed order
    const testRows = [
      { id: 1, name: 'Charlie', role: 'Guest', age: 35 },
      { id: 2, name: 'Alice', role: 'Admin', age: 30 },
      { id: 3, name: 'Bob', role: 'User', age: 25 },
    ];

    render(
      <DataGridWrapper
        {...defaultProps}
        rows={testRows}
        sortConfig={{
          defaultSortField: 'name',
          defaultSortOrder: 'desc', // Should sort Z to A
          sortingOptions: [
            { label: 'Name Asc', value: 'name_asc' },
            { label: 'Name Desc', value: 'name_desc' },
          ],
        }}
      />,
    );

    // Get all data rows (skip header row which is index 0)
    const rows = screen.getAllByRole('row');
    const dataRows = rows.slice(1); // Skip header

    // Check that rows are sorted descending by name: Charlie, Bob, Alice
    // Get the name cells from each row
    const nameCells = dataRows.map(
      (row) =>
        Array.from(row.querySelectorAll('[role="gridcell"]'))[0]?.textContent,
    );

    expect(nameCells).toEqual(['Charlie', 'Bob', 'Alice']);
  });

  // Also test with only defaultSortField
  test('handles defaultSortField without defaultSortOrder', () => {
    // Create rows with roles in mixed order
    const testRows = [
      { id: 1, name: 'Charlie', role: 'Guest', age: 35 },
      { id: 2, name: 'Alice', role: 'Admin', age: 30 },
      { id: 3, name: 'Bob', role: 'User', age: 25 },
      { id: 4, name: 'David', role: 'Admin', age: 28 },
    ];

    render(
      <DataGridWrapper
        {...defaultProps}
        rows={testRows}
        sortConfig={{
          defaultSortField: 'role',
          // No defaultSortOrder - should result in no sorting
          sortingOptions: [
            { label: 'Role Asc', value: 'role_asc' },
            { label: 'Role Desc', value: 'role_desc' },
          ],
        }}
      />,
    );

    // Get all data rows (skip header row)
    const rows = screen.getAllByRole('row');
    const dataRows = rows.slice(1); // Skip header

    // Check that rows are NOT sorted - they should be in original order
    // Get the role cells from each row (second column)
    const roleCells = dataRows.map(
      (row) =>
        Array.from(row.querySelectorAll('[role="gridcell"]'))[1]?.textContent,
    );

    // Should be in original order: Guest, Admin, User, Admin
    expect(roleCells).toEqual(['Guest', 'Admin', 'User', 'Admin']);
  });

  // Test clear functionality triggers setSearchTerm
  test('clear button resets search term', async () => {
    const user = userEvent.setup();
    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{ enabled: true, fields: ['name'], debounceMs: 0 }}
      />,
    );

    const searchInput = screen.getByRole('searchbox');
    expect(searchInput).toHaveValue('');
    await user.clear(searchInput);
    await user.type(searchInput, 'Alice');
    expect(searchInput).toHaveValue('Alice');

    const clearButton = screen.getByLabelText('Clear');
    await user.click(clearButton);

    expect(searchInput).toHaveValue('');
  });

  test('does not call onSearchByChange when not provided', async () => {
    const user = userEvent.setup();
    // No onSearchByChange in searchConfig
    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{
          enabled: true,
          serverSide: true,
          searchByOptions: [
            { label: 'Name', value: 'name' },
            { label: 'Role', value: 'role' },
          ],
          selectedSearchBy: 'name',
          onSearchChange: vi.fn(),
          // No onSearchByChange - tests the false branch of line 226
        }}
      />,
    );

    // Click the searchBy trigger button
    await user.click(screen.getByTestId('searchBy-trigger'));

    // Should not crash or throw errors
    expect(screen.getByTestId('search-filter-bar')).toBeInTheDocument();
  });
});

describe('convertTokenColumns', () => {
  test('converts spacing tokens to pixel values for width property', () => {
    const columns: TokenAwareGridColDef[] = [
      { field: 'name', headerName: 'Name', width: 'space-15' },
    ];

    const result = convertTokenColumns(columns);

    expect(result[0].width).toBe(150);
  });

  test('converts spacing tokens to pixel values for minWidth property', () => {
    const columns: TokenAwareGridColDef[] = [
      { field: 'name', headerName: 'Name', minWidth: 'space-13' },
    ];

    const result = convertTokenColumns(columns);

    expect(result[0].minWidth).toBe(96);
  });

  test('converts spacing tokens to pixel values for maxWidth property', () => {
    const columns: TokenAwareGridColDef[] = [
      { field: 'name', headerName: 'Name', maxWidth: 'space-20' },
    ];

    const result = convertTokenColumns(columns);

    expect(result[0].maxWidth).toBe(300);
  });

  test('passes through numeric values without conversion', () => {
    const columns: TokenAwareGridColDef[] = [
      {
        field: 'name',
        headerName: 'Name',
        width: 200,
        minWidth: 100,
        maxWidth: 400,
      },
    ];

    const result = convertTokenColumns(columns);

    expect(result[0].width).toBe(200);
    expect(result[0].minWidth).toBe(100);
    expect(result[0].maxWidth).toBe(400);
  });

  test('handles mixed token and numeric values in single column', () => {
    const columns: TokenAwareGridColDef[] = [
      {
        field: 'name',
        headerName: 'Name',
        width: 'space-15',
        minWidth: 100,
        maxWidth: 'space-20',
      },
    ];

    const result = convertTokenColumns(columns);

    expect(result[0].width).toBe(150);
    expect(result[0].minWidth).toBe(100);
    expect(result[0].maxWidth).toBe(300);
  });

  test('handles multiple columns with different configurations', () => {
    const columns: TokenAwareGridColDef[] = [
      { field: 'id', headerName: '#', width: 'space-10' },
      {
        field: 'name',
        headerName: 'Name',
        minWidth: 'space-15',
        maxWidth: 300,
      },
      { field: 'email', headerName: 'Email', width: 250 },
    ];

    const result = convertTokenColumns(columns);

    expect(result[0].width).toBe(48);
    expect(result[1].minWidth).toBe(150);
    expect(result[1].maxWidth).toBe(300);
    expect(result[2].width).toBe(250);
  });

  test('handles columns with undefined width properties', () => {
    const columns: TokenAwareGridColDef[] = [
      { field: 'name', headerName: 'Name' },
      { field: 'email', headerName: 'Email', flex: 1 },
    ];

    const result = convertTokenColumns(columns);

    expect(result[0].width).toBeUndefined();
    expect(result[0].minWidth).toBeUndefined();
    expect(result[0].maxWidth).toBeUndefined();
    expect(result[1].width).toBeUndefined();
  });

  test('handles empty columns array', () => {
    const columns: TokenAwareGridColDef[] = [];

    const result = convertTokenColumns(columns);

    expect(result).toEqual([]);
    expect(result.length).toBe(0);
  });

  test('converts fractional spacing tokens (space-11-5, space-16-5, space-16-7)', () => {
    const columns: TokenAwareGridColDef[] = [
      { field: 'id', headerName: '#', width: 'space-11-5' },
      { field: 'name', headerName: 'Name', width: 'space-16-5' },
      { field: 'email', headerName: 'Email', width: 'space-16-7' },
    ];

    const result = convertTokenColumns(columns);

    expect(result[0].width).toBe(70);
    expect(result[1].width).toBe(180);
    expect(result[2].width).toBe(200);
  });

  test('preserves other column properties during conversion', () => {
    const columns: TokenAwareGridColDef[] = [
      {
        field: 'name',
        headerName: 'Name',
        width: 'space-15',
        sortable: false,
        align: 'center',
        headerAlign: 'center',
      },
    ];

    const result = convertTokenColumns(columns);

    expect(result[0].width).toBe(150);
    expect(result[0].field).toBe('name');
    expect(result[0].headerName).toBe('Name');
    expect(result[0].sortable).toBe(false);
    expect(result[0].align).toBe('center');
    expect(result[0].headerAlign).toBe('center');
  });

  test('passes through invalid token strings unchanged (type system prevents this at compile time)', () => {
    const columns: TokenAwareGridColDef[] = [
      {
        field: 'name',
        headerName: 'Name',
        width: 'space-invalid' as SpacingToken,
      },
    ];

    const result = convertTokenColumns(columns);

    expect(result[0].width).toBe('space-invalid');
  });
});
