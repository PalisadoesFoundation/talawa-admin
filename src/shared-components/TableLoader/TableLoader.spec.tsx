import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';

import type { InterfaceTableLoaderProps } from 'types/shared-components/TableLoader/interface';
import TableLoader from './TableLoader';
import { vi } from 'vitest';

beforeAll(() => {
  console.error = vi.fn();
});

interface IMockColumn {
  accessor?: (data: Record<string, unknown>) => unknown;
}

vi.mock('../DataTable/DataTable', () => ({
  default: ({ columns }: { columns: IMockColumn[] }) => {
    columns.forEach((col) => {
      if (typeof col.accessor === 'function') {
        col.accessor({});
      }
    });

    return (
      <div>
        <div data-testid="skeleton-row-0" />
        <div data-testid="data-skeleton-cell" />
      </div>
    );
  },
}));

describe('Testing Loader component', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  test('Component should be rendered properly only headerTitles is provided', () => {
    const props: InterfaceTableLoaderProps = {
      noOfRows: 1,
      headerTitles: ['header1', 'header2', 'header3'],
    };
    render(
      <BrowserRouter>
        <TableLoader {...props} />
      </BrowserRouter>,
    );
    // Check if header titles are rendered properly
    expect(screen.getByTestId('skeleton-row-0')).toBeInTheDocument();
    expect(screen.getByTestId('data-skeleton-cell')).toBeInTheDocument();

    // Check if elements are rendered properly
    for (let rowIndex = 0; rowIndex < props.noOfRows; rowIndex++) {
      expect(
        screen.getByTestId(`skeleton-row-${rowIndex}`),
      ).toBeInTheDocument();
      const cells = screen.getAllByTestId('data-skeleton-cell');
      expect(cells.length).toBeGreaterThan(0);
    }
  });
  test('Component should be rendered properly only noCols is provided', () => {
    const props: InterfaceTableLoaderProps = {
      noOfRows: 1,
      noOfCols: 3,
    };
    render(
      <BrowserRouter>
        <TableLoader {...props} />
      </BrowserRouter>,
    );

    expect(screen.getByTestId('skeleton-row-0')).toBeInTheDocument();
    expect(screen.getByTestId('data-skeleton-cell')).toBeInTheDocument();
  });
  test('Component should be throw error when noOfCols and headerTitles are undefined', () => {
    const props = {
      noOfRows: 10,
    };
    expect(() => {
      render(
        <BrowserRouter>
          <TableLoader {...props} />
        </BrowserRouter>,
      );
    }).toThrow();
  });
});
