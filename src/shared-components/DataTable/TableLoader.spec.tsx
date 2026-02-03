import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { TableLoader } from './TableLoader';
import { vi, describe, it, expect, afterEach } from 'vitest';

const mockColumn = {
  id: 'col-1',
  header: 'Header',
  accessor: () => null,
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      if (key === 'loading') {
        return 'Loading';
      }
      return key;
    },
  }),
}));

vi.mock('style/app-fixed.module.css', () => ({
  default: {
    dataSkeletonCell: 'dataSkeletonCell',
    dataLoadingOverlay: 'dataLoadingOverlay',
  },
}));

describe('TableLoader', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders default skeleton grid with minimum rows and columns', () => {
    render(<TableLoader columns={[]} />);

    const grid = screen.getByTestId('table-loader-grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveAttribute('aria-label', 'Loading');

    const rows = screen.getAllByTestId(/skeleton-row-/);
    expect(rows.length).toBe(5);

    rows.forEach((row) => {
      const rowCells = within(row).getAllByTestId('table-loader-cell');
      expect(rowCells.length).toBe(1);
    });

    const cells = screen.getAllByTestId('table-loader-cell');
    expect(cells.length).toBe(5);
  });

  it('renders correct number of rows and columns', () => {
    render(
      <TableLoader columns={[mockColumn, mockColumn, mockColumn]} rows={4} />,
    );

    const rows = screen.getAllByTestId(/skeleton-row-/);
    expect(rows.length).toBe(4);

    const cells = screen.getAllByTestId('table-loader-cell');
    expect(cells.length).toBe(12);
  });

  it('uses custom ariaLabel when provided', () => {
    render(
      <TableLoader columns={[mockColumn]} ariaLabel="Custom loading label" />,
    );

    const grid = screen.getByTestId('table-loader-grid');
    expect(grid).toHaveAttribute('aria-label', 'Custom loading label');
  });

  it('renders inside overlay when asOverlay is true', () => {
    render(<TableLoader columns={[mockColumn]} asOverlay={true} />);

    const overlay = screen.getByTestId('table-loader-overlay');
    expect(overlay).toBeInTheDocument();

    const grid = screen.getByTestId('table-loader-grid');
    expect(grid).toBeInTheDocument();
  });

  it('does not render overlay when asOverlay is false', () => {
    render(<TableLoader columns={[mockColumn]} asOverlay={false} />);

    expect(screen.queryByTestId('table-loader-overlay')).toBeNull();
  });
});
