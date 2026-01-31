import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';

import type { InterfaceTableLoaderProps } from 'types/shared-components/TableLoader/interface';
import TableLoader from './TableLoader';
import { vi } from 'vitest';

beforeAll(() => {
  console.error = vi.fn();
});

describe('Testing Loader component', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  test('Component should be rendered properly only headerTitles is provided', () => {
    const props: InterfaceTableLoaderProps = {
      noOfRows: 10,
      headerTitles: ['header1', 'header2', 'header3'],
    };
    render(
      <BrowserRouter>
        <TableLoader {...props} />
      </BrowserRouter>,
    );
    // Check if header titles are rendered properly
    const data = props.headerTitles as string[];
    data.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });

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
      noOfRows: 10,
      noOfCols: 3,
    };
    render(
      <BrowserRouter>
        <TableLoader {...props} />
      </BrowserRouter>,
    );

    // Check if elements are rendered properly
    for (let rowIndex = 0; rowIndex < props.noOfRows; rowIndex++) {
      expect(
        screen.getByTestId(`skeleton-row-${rowIndex}`),
      ).toBeInTheDocument();
      const cells = screen.getAllByTestId('data-skeleton-cell');
      expect(cells.length).toBeGreaterThan(0);
    }
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
