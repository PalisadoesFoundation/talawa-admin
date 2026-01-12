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
});
