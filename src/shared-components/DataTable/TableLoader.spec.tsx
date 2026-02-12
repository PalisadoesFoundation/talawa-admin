import { render, screen, within } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { TestWrapper } from '../../test-utils/TestWrapper';
import { TableLoader } from './TableLoader';

// Mock the CSS module to avoid issues during testing
vi.mock('./TableLoader.module.css', () => ({
  default: {
    dataSkeletonCell: 'dataSkeletonCell',
    dataLoadingOverlay: 'dataLoadingOverlay',
  },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => (key === 'loading' ? 'Loading' : key),
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
  I18nextProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const mockColumn = {
  id: 'col-1',
  header: 'Header',
  accessor: () => null,
};

describe('TableLoader', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders default skeleton grid with minimum rows and columns', () => {
    render(
      <TestWrapper>
        <TableLoader columns={[]} />
      </TestWrapper>,
    );

    const grid = screen.getByTestId('table-loader-grid');
    expect(grid).toBeInTheDocument();
    // Verify default aria-label from translation (key 'loading' or mock value if configured)
    // Since we use real I18n provider from TestWrapper, it likely returns 'loading' key or value.
    // We check if it has A attribute.
    expect(grid).toHaveAttribute('aria-label');

    // Default rows = 5
    const rows = screen.getAllByTestId(/skeleton-row-/);
    expect(rows.length).toBe(5);

    // Default columns (empty array -> Math.max(1, 0) -> 1)
    rows.forEach((row) => {
      const rowCells = within(row).getAllByTestId('table-loader-cell');
      expect(rowCells.length).toBe(1);
    });
  });

  it('renders correct number of rows and columns based on props', () => {
    const columns = [mockColumn, mockColumn, mockColumn];
    render(
      <TestWrapper>
        <TableLoader columns={columns} rows={4} />
      </TestWrapper>,
    );

    const rows = screen.getAllByTestId(/skeleton-row-/);
    expect(rows.length).toBe(4);

    const cells = screen.getAllByTestId('table-loader-cell');
    // 4 rows * 3 columns = 12 cells
    expect(cells.length).toBe(12);
  });

  it('handles edge case: rows = 0 (defaults to minimum 1)', () => {
    render(
      <TestWrapper>
        <TableLoader columns={[mockColumn]} rows={0} />
      </TestWrapper>,
    );

    const rows = screen.getAllByTestId(/skeleton-row-/);
    expect(rows.length).toBe(1);
  });

  it('uses custom ariaLabel when provided', () => {
    const customLabel = 'Custom loading label';
    render(
      <TestWrapper>
        <TableLoader columns={[mockColumn]} ariaLabel={customLabel} />
      </TestWrapper>,
    );

    const grid = screen.getByTestId('table-loader-grid');
    expect(grid).toHaveAttribute('aria-label', customLabel);
  });

  it('renders inside overlay when asOverlay is true', () => {
    render(
      <TestWrapper>
        <TableLoader columns={[mockColumn]} asOverlay={true} />
      </TestWrapper>,
    );

    const overlay = screen.getByTestId('table-loader-overlay');
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveClass('dataLoadingOverlay');

    const grid = screen.getByTestId('table-loader-grid');
    expect(grid).toBeInTheDocument();
  });

  it('does not render overlay when asOverlay is false', () => {
    render(
      <TestWrapper>
        <TableLoader columns={[mockColumn]} asOverlay={false} />
      </TestWrapper>,
    );

    expect(screen.queryByTestId('table-loader-overlay')).toBeNull();
    const grid = screen.getByTestId('table-loader-grid');
    expect(grid).toBeInTheDocument();
  });

  it('renders correct structural hierarchy explicitly', () => {
    render(
      <TestWrapper>
        <TableLoader columns={[mockColumn, mockColumn]} rows={2} />
      </TestWrapper>,
    );

    const grid = screen.getByTestId('table-loader-grid');
    const rows = within(grid).getAllByTestId(/skeleton-row-/);
    expect(rows).toHaveLength(2);

    rows.forEach((row) => {
      const cells = within(row).getAllByTestId('table-loader-cell');
      expect(cells).toHaveLength(2);
      cells.forEach((cell) => {
        expect(cell).toHaveClass('dataSkeletonCell');
        expect(cell).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });
});
