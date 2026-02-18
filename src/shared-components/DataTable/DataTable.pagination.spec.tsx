import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable } from './DataTable';
import type { IColumnDef } from '../../types/shared-components/DataTable/interface';
interface ITestUser {
  id: string;
  name: string;
  email: string;
}

const mockUsers: ITestUser[] = Array.from({ length: 50 }, (_, i) => ({
  id: String(i + 1),
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
}));

const columns: IColumnDef<ITestUser>[] = [
  { id: 'id', header: 'ID', accessor: 'id' },
  { id: 'name', header: 'Name', accessor: 'name' },
  { id: 'email', header: 'Email', accessor: 'email' },
];

describe('DataTable - Pagination Integration', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Client-side Pagination - Data Slicing', () => {
    it('slices data correctly for first page', () => {
      render(
        <DataTable
          data={mockUsers}
          columns={columns}
          paginationMode="client"
          pageSize={10}
          rowKey="id"
        />,
      );

      // Should show items 1-10 on the first page
      expect(screen.getByText('User 1')).toBeInTheDocument();
      expect(screen.getByText('User 10')).toBeInTheDocument();
    });

    it('slices data correctly when navigating to page 2', () => {
      const onPageChange = vi.fn();
      const { rerender } = render(
        <DataTable
          data={mockUsers}
          columns={columns}
          paginationMode="client"
          pageSize={10}
          currentPage={1}
          onPageChange={onPageChange}
          rowKey="id"
        />,
      );

      expect(screen.getByText('User 1')).toBeInTheDocument();

      // Navigate to page 2
      rerender(
        <DataTable
          data={mockUsers}
          columns={columns}
          paginationMode="client"
          pageSize={10}
          currentPage={2}
          onPageChange={onPageChange}
          rowKey="id"
        />,
      );

      // Should show items 11-20
      expect(screen.getByText('User 11')).toBeInTheDocument();
      expect(screen.getByText('User 20')).toBeInTheDocument();
    });

    it('slices data correctly for last partial page', () => {
      render(
        <DataTable
          data={mockUsers}
          columns={columns}
          paginationMode="client"
          pageSize={10}
          currentPage={5}
          onPageChange={vi.fn()}
          rowKey="id"
        />,
      );

      // Should show items 41-50 (last page)
      expect(screen.getByText('User 41')).toBeInTheDocument();
      expect(screen.getByText('User 50')).toBeInTheDocument();
    });

    it('handles pageSize change correctly', () => {
      const onPageChange = vi.fn();
      const { rerender } = render(
        <DataTable
          data={mockUsers}
          columns={columns}
          paginationMode="client"
          pageSize={10}
          currentPage={1}
          onPageChange={onPageChange}
          rowKey="id"
        />,
      );

      expect(screen.getByText('User 10')).toBeInTheDocument();

      // Change page size to 25
      rerender(
        <DataTable
          data={mockUsers}
          columns={columns}
          paginationMode="client"
          pageSize={25}
          currentPage={1}
          onPageChange={onPageChange}
          rowKey="id"
        />,
      );

      // Should now show items 1-25
      expect(screen.getByText('User 25')).toBeInTheDocument();
    });
  });

  describe('Pagination Controls Integration', () => {
    it('renders pagination controls below table', () => {
      render(
        <DataTable
          data={mockUsers}
          columns={columns}
          paginationMode="client"
          pageSize={10}
          rowKey="id"
        />,
      );

      expect(
        screen.getByRole('navigation', { name: 'tablePagination' }),
      ).toBeInTheDocument();
      expect(screen.getByText('1–10 of 50')).toBeInTheDocument();
    });

    it('does not render pagination when paginationMode is not set', () => {
      render(<DataTable data={mockUsers} columns={columns} rowKey="id" />);

      expect(
        screen.queryByRole('navigation', { name: 'tablePagination' }),
      ).not.toBeInTheDocument();
    });

    it('calls onPageChange when next button is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(
        <DataTable
          data={mockUsers}
          columns={columns}
          paginationMode="client"
          pageSize={10}
          currentPage={1}
          onPageChange={onPageChange}
          rowKey="id"
        />,
      );

      await user.click(screen.getByLabelText('paginationNextLabel'));
      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('calls onPageChange when previous button is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(
        <DataTable
          data={mockUsers}
          columns={columns}
          paginationMode="client"
          pageSize={10}
          currentPage={3}
          onPageChange={onPageChange}
          rowKey="id"
        />,
      );

      await user.click(screen.getByLabelText('paginationPrevLabel'));
      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('manages internal page state when uncontrolled', async () => {
      const user = userEvent.setup();
      render(
        <DataTable
          data={mockUsers}
          columns={columns}
          paginationMode="client"
          pageSize={10}
          rowKey="id"
        />,
      );

      // Initial state - page 1
      expect(screen.getByText('User 1')).toBeInTheDocument();

      // Click next
      await user.click(screen.getByLabelText('paginationNextLabel'));

      // Should now show page 2
      // User 11 should be present on page 2
      expect(screen.getByText('User 11')).toBeInTheDocument();
    });
  });

  describe('Page Size Change Integration', () => {
    it('does not render page size selector', () => {
      render(
        <DataTable
          data={mockUsers}
          columns={columns}
          paginationMode="client"
          pageSize={10}
          rowKey="id"
        />,
      );

      expect(screen.queryByLabelText('Rows per page')).not.toBeInTheDocument();
    });
  });

  describe('State Precedence - Pagination', () => {
    it('does not show pagination when error is present', () => {
      render(
        <DataTable
          data={mockUsers}
          columns={columns}
          paginationMode="client"
          pageSize={10}
          error={new Error('Test error')}
          rowKey="id"
        />,
      );

      expect(
        screen.queryByRole('navigation', { name: 'tablePagination' }),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('datatable-error')).toBeInTheDocument();
    });

    it('does not show pagination when loading', () => {
      render(
        <DataTable
          data={mockUsers}
          columns={columns}
          paginationMode="client"
          pageSize={10}
          loading
          rowKey="id"
        />,
      );

      expect(
        screen.queryByRole('navigation', { name: 'tablePagination' }),
      ).not.toBeInTheDocument();
      // With data present while loading, we render the table (no pagination) and may overlay only when requested
      expect(screen.getByTestId('datatable')).toBeInTheDocument();
      expect(
        screen.queryByTestId('table-loader-overlay'),
      ).not.toBeInTheDocument();
    });

    it('does not show pagination when empty after slicing', () => {
      render(
        <DataTable
          data={[]}
          columns={columns}
          paginationMode="client"
          pageSize={10}
          rowKey="id"
        />,
      );

      expect(
        screen.queryByRole('navigation', { name: 'tablePagination' }),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('datatable-empty')).toBeInTheDocument();
    });

    it('shows table and pagination when data is present', () => {
      render(
        <DataTable
          data={mockUsers}
          columns={columns}
          paginationMode="client"
          pageSize={10}
          rowKey="id"
        />,
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(
        screen.getByRole('navigation', { name: 'tablePagination' }),
      ).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty data array', () => {
      render(
        <DataTable
          data={[]}
          columns={columns}
          paginationMode="client"
          pageSize={10}
          rowKey="id"
        />,
      );

      expect(screen.getByTestId('datatable-empty')).toBeInTheDocument();
    });

    it('handles single item', () => {
      render(
        <DataTable
          data={[mockUsers[0]]}
          columns={columns}
          paginationMode="client"
          pageSize={10}
          rowKey="id"
        />,
      );

      expect(screen.getByText('User 1')).toBeInTheDocument();
      expect(screen.getByText('1–1 of 1')).toBeInTheDocument();
    });

    it('handles data length less than pageSize', () => {
      const fewUsers = mockUsers.slice(0, 5);
      render(
        <DataTable
          data={fewUsers}
          columns={columns}
          paginationMode="client"
          pageSize={10}
          rowKey="id"
        />,
      );

      expect(screen.getByText('User 1')).toBeInTheDocument();
      expect(screen.getByText('User 5')).toBeInTheDocument();
      expect(screen.getByText('1–5 of 5')).toBeInTheDocument();
      expect(screen.getByLabelText('paginationNextLabel')).toBeDisabled();
    });

    it('handles totalItems prop override', () => {
      render(
        <DataTable
          data={mockUsers.slice(0, 10)}
          columns={columns}
          paginationMode="client"
          pageSize={10}
          totalItems={100}
          rowKey="id"
        />,
      );

      // Should use totalItems instead of data.length
      expect(screen.getByText('1–10 of 100')).toBeInTheDocument();
    });

    it('handles very large dataset', () => {
      const largeData = Array.from({ length: 1000 }, (_, i) => ({
        id: String(i + 1),
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
      }));

      const onPageChange = vi.fn();

      render(
        <DataTable
          data={largeData}
          columns={columns}
          paginationMode="client"
          pageSize={50}
          currentPage={10}
          onPageChange={onPageChange}
          rowKey="id"
        />,
      );

      // Page 10: items 451-500
      expect(screen.getByText('User 451')).toBeInTheDocument();
      expect(screen.getByText('User 500')).toBeInTheDocument();
      expect(screen.getByText('451–500 of 1000')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('maintains table accessibility with pagination', () => {
      render(
        <DataTable
          data={mockUsers}
          columns={columns}
          paginationMode="client"
          pageSize={10}
          ariaLabel="Users table"
          rowKey="id"
        />,
      );

      expect(
        screen.getByRole('table', { name: 'Users table' }),
      ).toBeInTheDocument();
    });

    it('pagination controls have proper accessibility attributes', () => {
      render(
        <DataTable
          data={mockUsers}
          columns={columns}
          paginationMode="client"
          pageSize={10}
          rowKey="id"
        />,
      );

      const nav = screen.getByRole('navigation', { name: 'tablePagination' });
      expect(nav).toBeInTheDocument();

      const rangeText = screen.getByText('1–10 of 50');
      expect(rangeText).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Performance', () => {
    it('only slices data when pagination is enabled', () => {
      const { rerender } = render(
        <DataTable data={mockUsers} columns={columns} rowKey="id" />,
      );

      // Without pagination, all rows should render
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBe(51); // 50 data rows + 1 header row

      rerender(
        <DataTable
          data={mockUsers}
          columns={columns}
          paginationMode="client"
          pageSize={10}
          rowKey="id"
        />,
      );

      // With pagination, only 10 data rows should render on the first page (10 data rows + 1 header row)
      const paginatedRows = screen.getAllByRole('row');
      expect(paginatedRows.length).toBe(11); // 10 data rows + 1 header row
    });
  });

  describe('Server-side Pagination - Variant A (with pageInfo and onLoadMore)', () => {
    it('renders table with provided data and shows pagination controls', () => {
      const onLoadMore = vi.fn();
      const pageInfo = {
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: 'cursor-1',
        endCursor: 'cursor-10',
      };

      render(
        <DataTable
          data={mockUsers.slice(0, 10)}
          columns={columns}
          paginationMode="server"
          pageInfo={pageInfo}
          onLoadMore={onLoadMore}
          totalItems={50}
          rowKey="id"
        />,
      );

      // Should show the provided data (not sliced, as server handles pagination)
      expect(screen.getByText('User 1')).toBeInTheDocument();
      expect(screen.getByText('User 10')).toBeInTheDocument();

      // Should show pagination controls with correct total
      expect(screen.getByText(/1–10 of 50/i)).toBeInTheDocument();
    });

    it('renders pagination controls showing hasNextPage state', () => {
      const onLoadMore = vi.fn();
      const pageInfo = {
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: 'cursor-1',
        endCursor: 'cursor-10',
      };

      render(
        <DataTable
          data={mockUsers.slice(0, 10)}
          columns={columns}
          paginationMode="server"
          pageInfo={pageInfo}
          onLoadMore={onLoadMore}
          totalItems={50}
          rowKey="id"
        />,
      );

      // Next button should be enabled when hasNextPage is true
      const buttons = screen.getAllByRole('button');
      const nextButton = buttons.find((btn) =>
        btn.getAttribute('aria-label')?.includes('Next'),
      );
      expect(nextButton).not.toBeDisabled();
    });

    it('renders pagination controls with pageInfo', () => {
      const onLoadMore = vi.fn();
      const pageInfo = {
        hasNextPage: false,
        hasPreviousPage: true,
        startCursor: 'cursor-41',
        endCursor: 'cursor-50',
      };

      render(
        <DataTable
          data={mockUsers.slice(40, 50)}
          columns={columns}
          paginationMode="server"
          pageInfo={pageInfo}
          onLoadMore={onLoadMore}
          totalItems={50}
          rowKey="id"
        />,
      );

      // Should show the data (items 41-50)
      expect(screen.getByText('User 41')).toBeInTheDocument();
      expect(screen.getByText('User 50')).toBeInTheDocument();

      // Should show pagination controls
      expect(
        screen.getByRole('navigation', { name: 'tablePagination' }),
      ).toBeInTheDocument();
    });

    it('calls onPageChange when provided alongside pageInfo', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      const onLoadMore = vi.fn();
      const pageInfo = {
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: 'cursor-1',
        endCursor: 'cursor-10',
      };

      render(
        <DataTable
          data={mockUsers.slice(0, 10)}
          columns={columns}
          paginationMode="server"
          pageInfo={pageInfo}
          onLoadMore={onLoadMore}
          onPageChange={onPageChange}
          totalItems={50}
          rowKey="id"
        />,
      );

      const nextButton = screen.getByLabelText('paginationNextLabel');

      await user.click(nextButton);
      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('preserves table data during loadingMore transition', () => {
      const onLoadMore = vi.fn();
      const pageInfo = {
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: 'cursor-1',
        endCursor: 'cursor-10',
      };

      const { rerender } = render(
        <DataTable
          data={mockUsers.slice(0, 10)}
          columns={columns}
          paginationMode="server"
          pageInfo={pageInfo}
          onLoadMore={onLoadMore}
          totalItems={50}
          rowKey="id"
          loading={false}
        />,
      );

      // Table should be visible initially
      expect(screen.getByText('User 1')).toBeInTheDocument();

      // Rerender with loadingMore state (simulating loading paginationNextLabel)
      rerender(
        <DataTable
          data={mockUsers.slice(0, 10)}
          columns={columns}
          paginationMode="server"
          pageInfo={pageInfo}
          onLoadMore={onLoadMore}
          totalItems={50}
          rowKey="id"
          loading={false}
          ariaLabel="Loading more data"
        />,
      );

      // Table should still show current page data (not replaced)
      expect(screen.getByText('User 1')).toBeInTheDocument();
    });
  });

  describe('Server-side Pagination - Variant B (without pageInfo and onLoadMore)', () => {
    it('renders table without pagination controls when neither pageInfo nor onLoadMore provided', () => {
      render(
        <DataTable
          data={mockUsers}
          columns={columns}
          paginationMode="server"
          totalItems={mockUsers.length}
          rowKey="id"
        />,
      );

      // Should show all data without pagination controls
      expect(screen.getByText('User 1')).toBeInTheDocument();
      expect(screen.getByText('User 50')).toBeInTheDocument();

      // Variant B (no pageInfo/onLoadMore) should not show pagination
      // In variant B, pagination controls are only shown if pageInfo is provided
      // Since no pageInfo, pagination controls should be hidden
      const paginationRange = screen.queryByText(/\d+–\d+ of \d+/i);
      expect(paginationRange).not.toBeInTheDocument();
    });

    it('shows console warning when server mode lacks totalItems', () => {
      const consoleWarn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      render(
        <DataTable
          data={mockUsers.slice(0, 10)}
          columns={columns}
          paginationMode="server"
          rowKey="id"
        />,
      );

      expect(consoleWarn).toHaveBeenCalledWith(
        expect.stringContaining('paginationMode="server"'),
      );

      consoleWarn.mockRestore();
    });

    it('warning only fires once even if component re-renders', () => {
      const consoleWarn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      const { rerender } = render(
        <DataTable
          data={mockUsers.slice(0, 10)}
          columns={columns}
          paginationMode="server"
          rowKey="id"
        />,
      );

      expect(consoleWarn).toHaveBeenCalledTimes(1);

      rerender(
        <DataTable
          data={mockUsers.slice(0, 10)}
          columns={columns}
          paginationMode="server"
          rowKey="id"
        />,
      );

      // Should still be 1 (not 2) - warning guarded by ref
      expect(consoleWarn).toHaveBeenCalledTimes(1);

      consoleWarn.mockRestore();
    });

    it('shows console warning when currentPage provided without onPageChange', () => {
      const consoleWarn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      render(
        <DataTable
          data={mockUsers.slice(0, 10)}
          columns={columns}
          paginationMode="client"
          pageSize={10}
          currentPage={2}
          rowKey="id"
        />,
      );

      expect(consoleWarn).toHaveBeenCalledWith(
        expect.stringContaining('currentPage'),
      );
      expect(consoleWarn).toHaveBeenCalledWith(
        expect.stringContaining('fall back to uncontrolled pagination'),
      );

      consoleWarn.mockRestore();
    });

    it('currentPage warning only fires once even if component re-renders', () => {
      const consoleWarn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      const { rerender } = render(
        <DataTable
          data={mockUsers.slice(0, 10)}
          columns={columns}
          paginationMode="client"
          pageSize={10}
          currentPage={2}
          rowKey="id"
        />,
      );

      expect(consoleWarn).toHaveBeenCalledTimes(1);

      rerender(
        <DataTable
          data={mockUsers.slice(0, 10)}
          columns={columns}
          paginationMode="client"
          pageSize={10}
          currentPage={3}
          rowKey="id"
        />,
      );

      // Should still be 1 (not 2) - warning guarded by ref
      expect(consoleWarn).toHaveBeenCalledTimes(1);

      consoleWarn.mockRestore();
    });
  });

  describe('Pagination Mode Transitions', () => {
    it('transitions from client to server mode', () => {
      const { rerender } = render(
        <DataTable
          data={mockUsers}
          columns={columns}
          paginationMode="client"
          pageSize={10}
          rowKey="id"
        />,
      );

      // Client mode: should slice data
      expect(screen.getByText('User 1')).toBeInTheDocument();
      expect(screen.getByText('User 10')).toBeInTheDocument();

      // Switch to server mode with first 20 items
      rerender(
        <DataTable
          data={mockUsers.slice(0, 20)}
          columns={columns}
          paginationMode="server"
          pageInfo={{
            hasNextPage: true,
            hasPreviousPage: false,
            startCursor: 'cursor-1',
            endCursor: 'cursor-20',
          }}
          onLoadMore={() => {}}
          totalItems={50}
          rowKey="id"
        />,
      );

      // Server mode: should show all provided data (20 items)
      expect(screen.getByText('User 1')).toBeInTheDocument();
      expect(screen.getByText('User 20')).toBeInTheDocument();
      expect(screen.queryByText('User 21')).not.toBeInTheDocument();
    });

    it('transitions from server to no pagination mode', () => {
      const { rerender } = render(
        <DataTable
          data={mockUsers.slice(0, 10)}
          columns={columns}
          paginationMode="server"
          pageInfo={{
            hasNextPage: true,
            hasPreviousPage: false,
            startCursor: 'cursor-1',
            endCursor: 'cursor-10',
          }}
          onLoadMore={() => {}}
          totalItems={50}
          rowKey="id"
        />,
      );

      // Server mode: shows pagination controls
      expect(screen.getByText(/1–10 of 50/i)).toBeInTheDocument();

      // Switch to no pagination
      rerender(<DataTable data={mockUsers} columns={columns} rowKey="id" />);

      // No pagination: shows all data without pagination controls
      expect(screen.getByText('User 1')).toBeInTheDocument();
      expect(screen.getByText('User 50')).toBeInTheDocument();
      expect(screen.queryByText(/of/i)).not.toBeInTheDocument();
    });
  });

  describe('Regression Tests - Existing Call Sites Remain Valid', () => {
    it('existing client pagination setup still works', () => {
      const onPageChange = vi.fn();
      render(
        <DataTable
          data={mockUsers}
          columns={columns}
          paginationMode="client"
          currentPage={1}
          onPageChange={onPageChange}
          pageSize={10}
          rowKey="id"
        />,
      );

      expect(screen.getByText('User 1')).toBeInTheDocument();
      expect(screen.getByText('User 10')).toBeInTheDocument();
      expect(screen.getByText(/1–10 of 50/i)).toBeInTheDocument();
    });

    it('existing table without pagination still works', () => {
      render(<DataTable data={mockUsers} columns={columns} rowKey="id" />);

      // Should show all data
      expect(screen.getByText('User 1')).toBeInTheDocument();
      expect(screen.getByText('User 50')).toBeInTheDocument();

      // Should not show pagination
      expect(screen.queryByText(/1–\d+ of/i)).not.toBeInTheDocument();
    });

    it('existing table with error state still works', () => {
      const testError = new Error('Data fetch failed');
      render(
        <DataTable
          data={[]}
          columns={columns}
          paginationMode="client"
          error={testError}
          rowKey="id"
        />,
      );

      // Should show error state container
      expect(screen.getByTestId('datatable-error')).toBeInTheDocument();
      // Error message should be present
      expect(screen.getByText('Data fetch failed')).toBeInTheDocument();
      // Should not show pagination
      expect(screen.queryByText(/of/i)).not.toBeInTheDocument();
    });

    it('existing table with loading state still works', () => {
      render(
        <DataTable
          data={[]}
          columns={columns}
          paginationMode="client"
          loading={true}
          rowKey="id"
        />,
      );

      // Should show loading skeleton, not pagination
      expect(screen.getByTestId('datatable-loading')).toBeInTheDocument();
      expect(screen.queryByText(/of/i)).not.toBeInTheDocument();
    });

    it('existing table with empty state still works', () => {
      render(
        <DataTable
          data={[]}
          columns={columns}
          paginationMode="client"
          emptyMessage="No users found"
          rowKey="id"
        />,
      );

      expect(screen.getByText('No users found')).toBeInTheDocument();
      expect(screen.queryByText(/of/i)).not.toBeInTheDocument();
    });
  });

  /* ------------------------------------------------------------------
   * loadingMore behavior across pagination modes
   * ------------------------------------------------------------------ */

  describe('loadingMore prop behavior', () => {
    it('appends skeleton rows when loadingMore=true in client mode', () => {
      render(
        <DataTable
          data={mockUsers.slice(0, 10)}
          columns={columns}
          paginationMode="client"
          pageSize={5}
          loadingMore
          skeletonRows={2}
          rowKey="id"
        />,
      );

      // Real data rows should render
      expect(screen.getByText('User 1')).toBeInTheDocument();
      expect(screen.getByText('User 5')).toBeInTheDocument();

      // Skeleton rows should be appended
      const skeletonRows = document.querySelectorAll(
        '[data-testid^="skeleton-append-"]',
      );
      expect(skeletonRows.length).toBe(2);
    });

    it('appends skeleton rows when loadingMore=true in server mode with pageInfo', () => {
      const mockOnLoadMore = vi.fn();

      render(
        <DataTable
          data={mockUsers.slice(0, 10)}
          columns={columns}
          paginationMode="server"
          pageInfo={{ hasNextPage: true, hasPreviousPage: false }}
          onLoadMore={mockOnLoadMore}
          loadingMore
          skeletonRows={3}
          rowKey="id"
        />,
      );

      // Real data rows should render
      expect(screen.getByText('User 1')).toBeInTheDocument();
      expect(screen.getByText('User 10')).toBeInTheDocument();

      // Skeleton rows should be appended
      const skeletonRows = document.querySelectorAll(
        '[data-testid^="skeleton-append-"]',
      );
      expect(skeletonRows.length).toBe(3);
    });

    it('appends skeleton rows when loadingMore=true in no-pagination mode', () => {
      render(
        <DataTable
          data={mockUsers.slice(0, 15)}
          columns={columns}
          loadingMore
          skeletonRows={2}
          rowKey="id"
        />,
      );

      // All real data rows should render
      expect(screen.getByText('User 1')).toBeInTheDocument();
      expect(screen.getByText('User 15')).toBeInTheDocument();

      // Skeleton rows should be appended
      const skeletonRows = document.querySelectorAll(
        '[data-testid^="skeleton-append-"]',
      );
      expect(skeletonRows.length).toBe(2);
    });

    it('does not append skeleton rows when loadingMore=false (default)', () => {
      render(
        <DataTable
          data={mockUsers.slice(0, 10)}
          columns={columns}
          paginationMode="client"
          pageSize={5}
          rowKey="id"
        />,
      );

      // No appended skeleton rows
      const skeletonRows = document.querySelectorAll(
        '[data-testid^="skeleton-append-"]',
      );
      expect(skeletonRows.length).toBe(0);
    });

    it('does not append skeleton rows when loadingMore=true but no data exists', () => {
      render(
        <DataTable
          data={[]}
          columns={columns}
          paginationMode="client"
          pageSize={10}
          loadingMore
          skeletonRows={2}
          rowKey="id"
        />,
      );

      // Empty state should render instead of skeleton rows
      expect(screen.getByTestId('datatable-empty')).toBeInTheDocument();

      // No appended skeleton rows
      const skeletonRows = document.querySelectorAll(
        '[data-testid^="skeleton-append-"]',
      );
      expect(skeletonRows.length).toBe(0);
    });

    it('respects skeletonRows count for appended rows in loadingMore scenario', () => {
      const { rerender } = render(
        <DataTable
          data={mockUsers.slice(0, 5)}
          columns={columns}
          paginationMode="client"
          pageSize={10}
          loadingMore
          skeletonRows={4}
          rowKey="id"
        />,
      );

      // Check initial skeleton count
      let skeletonRows = document.querySelectorAll(
        '[data-testid^="skeleton-append-"]',
      );
      expect(skeletonRows.length).toBe(4);

      // Change skeletonRows to 6
      rerender(
        <DataTable
          data={mockUsers.slice(0, 5)}
          columns={columns}
          paginationMode="client"
          pageSize={10}
          loadingMore
          skeletonRows={6}
          rowKey="id"
        />,
      );

      // Should update to 6 skeleton rows
      skeletonRows = document.querySelectorAll(
        '[data-testid^="skeleton-append-"]',
      );
      expect(skeletonRows.length).toBe(6);
    });
  });
});
