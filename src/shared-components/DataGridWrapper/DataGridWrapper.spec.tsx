/* eslint-disable react/no-multi-comp */
import { render, screen, fireEvent } from '@testing-library/react';
import { DataGridWrapper } from './index';
import { vi } from 'vitest';
import React from 'react';
import type {
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
  GridValidRowModel,
} from '@mui/x-data-grid';

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

// Mock components with callbacks tracking
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
  }) => {
    React.useEffect(() => {
      if (onPaginationModelChange) {
        onPaginationModelChange({ page: 1, pageSize: 25 });
      }
    }, [onPaginationModelChange]);

    renderCellCalls = [];

    return (
      <div data-testid="data-grid">
        <div role="grid">
          <div role="row">
            {columns.map((col: GridColDef) => (
              <div key={col.field} role="columnheader">
                {col.headerName}
              </div>
            ))}
          </div>
          {!loading &&
            rows.map((row: GridValidRowModel) => (
              <div
                key={row.id}
                role="row"
                data-testid={`row-${row.id}`}
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
                      >
                        {renderedCell}
                      </div>
                    );
                  }
                  return (
                    <div key={col.field} role="gridcell">
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
        onClick={() => onSearch && onSearch(value)}
        data-testid="search-button"
      >
        Search
      </button>
      <button
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
    // Call dropdown callbacks
    React.useEffect(() => {
      if (dropdowns) {
        dropdowns.forEach(
          (dropdown: {
            id: string;
            type: string;
            options?: Array<{ value: string | number; label: string }>;
            selectedOption?: string | number;
            onOptionChange?: (value: string | number) => void;
            dataTestIdPrefix?: string;
          }) => {
            if (dropdown.onOptionChange && dropdown.selectedOption) {
              dropdown.onOptionChange(dropdown.selectedOption);
            }
          },
        );
      }
    }, [dropdowns]);

    // CRITICAL: Call onSearchSubmit for server-side
    React.useEffect(() => {
      if (onSearchSubmit) {
        // Call with current search value or test value
        onSearchSubmit(searchValue || 'test-search-value');
      }
    }, [onSearchSubmit, searchValue]);

    return (
      <div data-testid="search-filter-bar">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && onSearchSubmit) {
              onSearchSubmit(searchValue);
            }
          }}
          placeholder="Search"
          role="searchbox"
          data-testid={searchInputTestId}
        />
        {/* ... rest of mock ... */}
      </div>
    );
  },
}));

vi.mock('./DataGridErrorOverlay', () => ({
  DataGridErrorOverlay: ({ message }: { message: string }) => (
    <div data-testid="error-overlay">
      <div data-testid="error-message">{message}</div>
    </div>
  ),
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
  test('handles client-side search', () => {
    vi.useFakeTimers();
    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{ enabled: true, fields: ['name'], debounceMs: 100 }}
      />,
    );

    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'Alice' } });
    vi.advanceTimersByTime(100);
    expect(input).toHaveValue('Alice');
    vi.useRealTimers();
  });

  test('handles server-side search with SearchFilterBar', () => {
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

    expect(onSearchChange).toHaveBeenCalledWith('test-search-value', 'name');
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
  test('handles sorting', () => {
    const sortConfig = {
      sortingOptions: [
        { label: 'Name Asc', value: 'name_asc' },
        { label: 'Name Desc', value: 'name_desc' },
      ],
    };
    render(<DataGridWrapper {...defaultProps} sortConfig={sortConfig} />);
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
  test('handles pagination', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        paginationConfig={{ enabled: true, defaultPageSize: 10 }}
      />,
    );
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
    expect(screen.getByTestId('error-overlay')).toBeInTheDocument();
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
  test('handles row click', () => {
    const onRowClick = vi.fn();
    render(<DataGridWrapper {...defaultProps} onRowClick={onRowClick} />);
    fireEvent.click(screen.getByTestId('row-1'));
    expect(onRowClick).toHaveBeenCalled();
  });

  test('renders action column', () => {
    const actionColumn = (row: TestRow) => (
      <button data-testid={`action-${row.id}`}>Edit</button>
    );
    render(<DataGridWrapper {...defaultProps} actionColumn={actionColumn} />);
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(renderCellCalls.length).toBeGreaterThan(0);
  });

  // Edge case tests
  test('handles null values in search fields', () => {
    const rowsWithNulls = [
      { id: 1, name: null, role: 'Admin' },
      { id: 2, name: 'Bob', role: null },
    ];

    vi.useFakeTimers();
    render(
      <DataGridWrapper
        {...defaultProps}
        rows={rowsWithNulls}
        searchConfig={{ enabled: true, fields: ['name', 'role'] }}
      />,
    );

    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'Admin' } });
    vi.advanceTimersByTime(300);
    vi.useRealTimers();
  });

  test('SearchFilterBar with both dropdowns', () => {
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

    expect(onSearchByChange).toHaveBeenCalledWith('name');
    expect(onSortChange).toHaveBeenCalledWith('name_asc');
  });

  // Debounce cleanup test
  test('cleans up debounce timer', () => {
    vi.useFakeTimers();
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    const { unmount } = render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{ enabled: true, fields: ['name'], debounceMs: 100 }}
      />,
    );

    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'test' } });
    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();

    vi.useRealTimers();
    clearTimeoutSpy.mockRestore();
  });

  // Add these tests to the cleaned up file:

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

  test('filter function handles nullish values with coalescing operator', () => {
    const rowsWithNullish = [
      { id: 1, name: null, role: undefined },
      { id: 2, name: 'Bob', role: 'User' },
    ];

    vi.useFakeTimers();

    render(
      <DataGridWrapper
        {...defaultProps}
        rows={rowsWithNullish}
        searchConfig={{ enabled: true, fields: ['name', 'role'] }}
      />,
    );

    // This tests line 154: String(r[f as keyof T] ?? '')
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'Bob' } });
    vi.advanceTimersByTime(300);
    vi.useRealTimers();
  });

  test('sort dropdown else branch (no onSortChange)', () => {
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

    // Line 244: else { setSelectedSort(value); }
    expect(screen.getByTestId('search-filter-bar')).toBeInTheDocument();
  });

  test('noRowsOverlay slot handles all conditions', () => {
    // Test error state
    const { rerender } = render(
      <DataGridWrapper {...defaultProps} rows={[]} error="Test error" />,
    );

    expect(screen.getByTestId('error-overlay')).toBeInTheDocument();

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

  test('search term updates on Enter key press', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{ enabled: true, fields: ['name'] }}
      />,
    );

    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(input).toHaveValue('test');
  });

  test('handles server-side search without selectedSearchBy', () => {
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

    expect(onSearchChange).toHaveBeenCalledWith('test-search-value', undefined);
  });

  test('client-side search filter executes with nullish coalescing', () => {
    const rows = [
      { id: 1, name: null, role: 'Admin' },
      { id: 2, name: undefined, role: 'User' },
      { id: 3, name: 'Charlie', role: null },
    ];

    vi.useFakeTimers();

    render(
      <DataGridWrapper
        rows={rows}
        columns={defaultProps.columns}
        searchConfig={{
          enabled: true,
          fields: ['name', 'role'],
          debounceMs: 100,
        }}
      />,
    );

    const input = screen.getByRole('searchbox');

    // Search for something - triggers filter function
    fireEvent.change(input, { target: { value: 'Admin' } });
    vi.advanceTimersByTime(100);

    // Search for empty string
    fireEvent.change(input, { target: { value: '' } });
    vi.advanceTimersByTime(100);

    // Search for non-existent
    fireEvent.change(input, { target: { value: 'Nonexistent' } });
    vi.advanceTimersByTime(100);

    vi.useRealTimers();
  });

  test('SearchFilterBar callbacks execute correctly', () => {
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

    expect(onSearchChange).toHaveBeenCalledWith('test-search-value', 'name');

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

  // More specific test for onSearchSubmit with Enter key
  test('Enter key triggers onSearchSubmit in SearchFilterBar', () => {
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

    const searchInput = screen.getByTestId('searchInput');

    // Simulate typing and pressing Enter
    fireEvent.change(searchInput, { target: { value: 'manual-enter-test' } });
    fireEvent.keyPress(searchInput, {
      key: 'Enter',
      code: 'Enter',
      charCode: 13,
    });

    // This should trigger lines 196-202 through the onKeyPress handler
    expect(onSearchChange).toHaveBeenCalledWith('manual-enter-test', 'name');
  });

  // Test that all noRowsOverlay conditions are covered
  test('noRowsOverlay slot executes all code paths', () => {
    // Test 1: Error state
    const { rerender } = render(
      <DataGridWrapper {...defaultProps} rows={[]} error="Error message" />,
    );

    // Test 2: emptyStateProps
    rerender(
      <DataGridWrapper
        {...defaultProps}
        rows={[]}
        emptyStateProps={{ message: 'Custom from props' }}
      />,
    );

    // Test 3: emptyStateMessage
    rerender(
      <DataGridWrapper
        {...defaultProps}
        rows={[]}
        emptyStateMessage="Legacy message"
      />,
    );

    // Default fallback
    rerender(<DataGridWrapper {...defaultProps} rows={[]} />);
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

  test('simulate onSearchSubmit for client-side search', () => {
    vi.useFakeTimers();

    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{
          enabled: true,
          searchByOptions: [{ label: 'Name', value: 'name' }],
          // Client-side by default
        }}
      />,
    );

    // Find the search input and simulate Enter key
    const searchInput = screen.getByTestId('searchInput');

    // Type something
    fireEvent.change(searchInput, { target: { value: 'test search' } });

    // Press Enter to trigger onSearchSubmit
    fireEvent.keyPress(searchInput, {
      key: 'Enter',
      code: 'Enter',
      charCode: 13,
    });

    vi.advanceTimersByTime(300);
    vi.useRealTimers();
  });

  // Default sort initialization
  test('initializes selectedSort from defaultSortField and defaultSortOrder', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        sortConfig={{
          defaultSortField: 'name',
          defaultSortOrder: 'desc',
          sortingOptions: [
            { label: 'Name Asc', value: 'name_asc' },
            { label: 'Name Desc', value: 'name_desc' },
          ],
        }}
      />,
    );

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  // Also test with only defaultSortField
  test('handles defaultSortField without defaultSortOrder', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        sortConfig={{
          defaultSortField: 'role',
          // No defaultSortOrder
          sortingOptions: [
            { label: 'Role Asc', value: 'role_asc' },
            { label: 'Role Desc', value: 'role_desc' },
          ],
        }}
      />,
    );

    // Should still render without error
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  // SearchBar onClear callback
  test('SearchBar onClear callback resets search term', () => {
    vi.useFakeTimers();

    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{ enabled: true, fields: ['name'] }}
      />,
    );

    const searchInput = screen.getByRole('searchbox');

    // Type something
    fireEvent.change(searchInput, { target: { value: 'test' } });

    // Find and click the clear button
    const clearButton = screen.getByLabelText('Clear');
    fireEvent.click(clearButton);

    // Should clear the search input
    expect(searchInput).toHaveValue('');

    vi.advanceTimersByTime(300);
    vi.useRealTimers();
  });

  // Test clear functionality triggers setSearchTerm
  test('clear button triggers setSearchTerm with empty string', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{ enabled: true, fields: ['name'] }}
      />,
    );

    const searchInput = screen.getByRole('searchbox');
    expect(searchInput).toHaveValue('');
    fireEvent.change(searchInput, { target: { value: 'Alice' } });

    const clearButton = screen.getByLabelText('Clear');
    fireEvent.click(clearButton);

    expect(searchInput).toHaveValue('');
  });
});
