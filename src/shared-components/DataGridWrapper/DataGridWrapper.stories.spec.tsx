import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import {
  BasicUsage,
  WithSearch,
  WithSorting,
  WithPagination,
  WithActionColumn,
  LoadingState,
  EmptyState,
  ErrorState,
  CompleteExample,
  SearchWithNoResults,
  WithRowClick,
} from './DataGridWrapper.stories';
import { DataGridWrapper } from './DataGridWrapper';

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

describe('DataGridWrapper Stories', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('BasicUsage Story', () => {
    test('renders with minimal configuration', () => {
      render(<DataGridWrapper {...BasicUsage.args} />);

      // Verify rows are rendered
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('Bob Smith')).toBeInTheDocument();

      // Verify column headers are present
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Role')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    test('has correct args configuration', () => {
      expect(BasicUsage.args?.rows).toHaveLength(5);
      expect(BasicUsage.args?.columns).toHaveLength(4);
    });
  });

  describe('WithSearch Story', () => {
    test('renders with search functionality enabled', () => {
      render(<DataGridWrapper {...WithSearch.args} />);

      // Verify search box is present
      const searchBox = screen.getByRole('searchbox');
      expect(searchBox).toBeInTheDocument();
      expect(searchBox).toHaveAttribute(
        'placeholder',
        'Search users by name, email, or role...',
      );
    });

    test('has correct search configuration', () => {
      expect(WithSearch.args?.searchConfig?.enabled).toBe(true);
      expect(WithSearch.args?.searchConfig?.fields).toEqual([
        'name',
        'email',
        'role',
      ]);
    });
  });

  describe('WithSorting Story', () => {
    test('renders with sorting dropdown', () => {
      render(<DataGridWrapper {...WithSorting.args} />);

      // Verify sort button is present
      expect(screen.getByText('Sort')).toBeInTheDocument();
    });

    test('has correct sorting configuration', () => {
      expect(WithSorting.args?.sortConfig?.defaultSortField).toBe('name');
      expect(WithSorting.args?.sortConfig?.defaultSortOrder).toBe('asc');
      expect(WithSorting.args?.sortConfig?.sortingOptions).toHaveLength(6);
    });

    test('has proper sorting options defined', () => {
      const options = WithSorting.args?.sortConfig?.sortingOptions || [];
      expect(options[0]).toEqual({ label: 'Name (A-Z)', value: 'name_asc' });
      expect(options[1]).toEqual({ label: 'Name (Z-A)', value: 'name_desc' });
    });
  });

  describe('WithPagination Story', () => {
    test('renders with pagination controls', () => {
      render(<DataGridWrapper {...WithPagination.args} />);

      // Verify pagination controls are present
      // MUI DataGrid renders pagination text like "1–5 of 12"
      expect(screen.getByText(/of/i)).toBeInTheDocument();
    });

    test('has correct pagination configuration', () => {
      expect(WithPagination.args?.paginationConfig?.enabled).toBe(true);
      expect(WithPagination.args?.paginationConfig?.defaultPageSize).toBe(5);
      expect(WithPagination.args?.paginationConfig?.pageSizeOptions).toEqual([
        5, 10, 25, 50,
      ]);
    });
  });

  describe('WithActionColumn Story', () => {
    test('renders with action column', () => {
      render(<DataGridWrapper {...WithActionColumn.args} />);

      // Verify Actions column header
      expect(screen.getByText('Actions')).toBeInTheDocument();

      // Verify action buttons are present for each row
      expect(screen.getByLabelText('Edit Alice Johnson')).toBeInTheDocument();
      expect(screen.getByLabelText('Delete Alice Johnson')).toBeInTheDocument();
    });

    test('has action column renderer defined', () => {
      expect(WithActionColumn.args?.actionColumn).toBeDefined();
      expect(typeof WithActionColumn.args?.actionColumn).toBe('function');
    });
  });

  describe('LoadingState Story', () => {
    test('renders loading overlay', () => {
      render(<DataGridWrapper {...LoadingState.args} />);

      // Verify loading state is displayed
      expect(screen.getByTestId('loading-state')).toBeInTheDocument();
    });

    test('has correct loading configuration', () => {
      expect(LoadingState.args?.loading).toBe(true);
      expect(LoadingState.args?.rows).toHaveLength(0);
    });
  });

  describe('EmptyState Story', () => {
    test('renders empty state message', () => {
      render(<DataGridWrapper {...EmptyState.args} />);

      // Verify custom empty state message
      expect(
        screen.getByText('No users found. Try adjusting your filters.'),
      ).toBeInTheDocument();
    });

    test('has correct empty state configuration', () => {
      expect(EmptyState.args?.rows).toHaveLength(0);
      expect(EmptyState.args?.emptyStateMessage).toBe(
        'No users found. Try adjusting your filters.',
      );
    });
  });

  describe('ErrorState Story', () => {
    test('renders error message', () => {
      render(<DataGridWrapper {...ErrorState.args} />);

      // Verify error message is displayed
      expect(
        screen.getByText('Failed to load users. Please try again later.'),
      ).toBeInTheDocument();

      // Verify it has alert role for accessibility
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    test('has correct error configuration', () => {
      expect(ErrorState.args?.error).toBe(
        'Failed to load users. Please try again later.',
      );
      expect(ErrorState.args?.rows).toHaveLength(0);
    });
  });

  describe('CompleteExample Story', () => {
    test('renders with all features enabled', () => {
      render(<DataGridWrapper {...CompleteExample.args} />);

      // Verify search is present
      expect(screen.getByRole('searchbox')).toBeInTheDocument();

      // Verify sort button is present
      expect(screen.getByText('Sort')).toBeInTheDocument();

      // Verify pagination
      expect(screen.getByText(/of/i)).toBeInTheDocument();

      // Verify action column
      expect(screen.getByText('Actions')).toBeInTheDocument();

      // Verify data is rendered
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    });

    test('has all features configured', () => {
      expect(CompleteExample.args?.searchConfig?.enabled).toBe(true);
      expect(CompleteExample.args?.sortConfig?.sortingOptions).toBeDefined();
      expect(CompleteExample.args?.paginationConfig?.enabled).toBe(true);
      expect(CompleteExample.args?.actionColumn).toBeDefined();
      expect(CompleteExample.args?.onRowClick).toBeDefined();
    });

    test('has comprehensive search fields', () => {
      expect(CompleteExample.args?.searchConfig?.fields).toEqual([
        'name',
        'email',
        'role',
        'status',
      ]);
    });
  });

  describe('SearchWithNoResults Story', () => {
    test('renders with search and custom empty message', () => {
      render(<DataGridWrapper {...SearchWithNoResults.args} />);

      // Verify search is present
      const searchBox = screen.getByRole('searchbox');
      expect(searchBox).toBeInTheDocument();
      expect(searchBox).toHaveAttribute(
        'placeholder',
        'Try searching for "nonexistent"...',
      );
    });

    test('has correct configuration for no results scenario', () => {
      expect(SearchWithNoResults.args?.searchConfig?.enabled).toBe(true);
      expect(SearchWithNoResults.args?.emptyStateMessage).toBe(
        'No matching users found. Try a different search term.',
      );
    });
  });

  describe('WithRowClick Story', () => {
    test('renders with row click capability', () => {
      render(<DataGridWrapper {...WithRowClick.args} />);

      // Verify data is rendered and clickable
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('Bob Smith')).toBeInTheDocument();
    });

    test('has row click handler defined', () => {
      expect(WithRowClick.args?.onRowClick).toBeDefined();
      expect(typeof WithRowClick.args?.onRowClick).toBe('function');
    });

    test('has correct number of rows', () => {
      expect(WithRowClick.args?.rows).toHaveLength(5);
    });
  });
});
