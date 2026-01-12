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

  // Core tests for coverage
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

    // Open sort dropdown
    const sortBtn = screen.getByText('Sort');
    fireEvent.click(sortBtn);

    // Select Name Desc
    fireEvent.click(screen.getByText('Name Desc'));

    // Verify order changed (Charlie should be first for desc sort)
    const rows = screen.getAllByRole('row');
    expect(within(rows[1]).getByText('Charlie')).toBeInTheDocument();
  });

  test('handles client-side search onClear', () => {
    render(
      <DataGridWrapper
        {...defaultProps}
        searchConfig={{
          enabled: true,
          fields: ['name'],
        }}
      />,
    );

    const searchInput = screen.getByRole('searchbox');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);

    expect(searchInput).toHaveValue('');
  });

  test('handles server-side search onSearchSubmit', () => {
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

    const searchInput = screen.getByRole('searchbox');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.keyDown(searchInput, { key: 'Enter' });

    expect(onSearchChange).toHaveBeenCalledWith('test', 'name');
  });

  test('handles sort option change with onSortChange callback', () => {
    const onSortChange = vi.fn();

    render(
      <DataGridWrapper
        {...defaultProps}
        sortConfig={{
          sortingOptions: [{ label: 'Name', value: 'name_asc' }],
          onSortChange,
        }}
      />,
    );

    const sortBtn = screen.getByText('Sort');
    fireEvent.click(sortBtn);
    fireEvent.click(screen.getByTestId('name_asc'));

    expect(onSortChange).toHaveBeenCalledWith('name_asc');
  });
});
