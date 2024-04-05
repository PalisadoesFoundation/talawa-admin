import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import type { InterfaceTableLoader } from './TableLoader';
import TableLoader from './TableLoader';

beforeAll(() => {
  console.error = jest.fn();
});

describe('Testing Loader component', () => {
  test('Component should be rendered properly only headerTitles is provided', () => {
    const props: InterfaceTableLoader = {
      noOfRows: 10,
      headerTitles: ['header1', 'header2', 'header3'],
    };
    render(
      <BrowserRouter>
        <TableLoader {...props} />
<<<<<<< HEAD
      </BrowserRouter>,
=======
      </BrowserRouter>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );
    // Check if header titles are rendered properly
    const data = props.headerTitles as string[];
    data.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });

    // Check if elements are rendered properly
    for (let rowIndex = 0; rowIndex < props.noOfRows; rowIndex++) {
      expect(
<<<<<<< HEAD
        screen.getByTestId(`row-${rowIndex}-tableLoading`),
      ).toBeInTheDocument();
      for (let colIndex = 0; colIndex < data.length; colIndex++) {
        expect(
          screen.getByTestId(`row-${rowIndex}-col-${colIndex}-tableLoading`),
=======
        screen.getByTestId(`row-${rowIndex}-tableLoading`)
      ).toBeInTheDocument();
      for (let colIndex = 0; colIndex < data.length; colIndex++) {
        expect(
          screen.getByTestId(`row-${rowIndex}-col-${colIndex}-tableLoading`)
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        ).toBeInTheDocument();
      }
    }
  });
  test('Component should be rendered properly only noCols is provided', () => {
    const props: InterfaceTableLoader = {
      noOfRows: 10,
      noOfCols: 3,
    };
    render(
      <BrowserRouter>
        <TableLoader {...props} />
<<<<<<< HEAD
      </BrowserRouter>,
=======
      </BrowserRouter>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );
    // Check if header titles are rendered properly
    const data = [...Array(props.noOfCols)];

    // Check if elements are rendered properly
    for (let rowIndex = 0; rowIndex < props.noOfRows; rowIndex++) {
      expect(
<<<<<<< HEAD
        screen.getByTestId(`row-${rowIndex}-tableLoading`),
      ).toBeInTheDocument();
      for (let colIndex = 0; colIndex < data.length; colIndex++) {
        expect(
          screen.getByTestId(`row-${rowIndex}-col-${colIndex}-tableLoading`),
=======
        screen.getByTestId(`row-${rowIndex}-tableLoading`)
      ).toBeInTheDocument();
      for (let colIndex = 0; colIndex < data.length; colIndex++) {
        expect(
          screen.getByTestId(`row-${rowIndex}-col-${colIndex}-tableLoading`)
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        ).toBeInTheDocument();
      }
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
<<<<<<< HEAD
        </BrowserRouter>,
=======
        </BrowserRouter>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      );
    }).toThrowError();
  });
});
