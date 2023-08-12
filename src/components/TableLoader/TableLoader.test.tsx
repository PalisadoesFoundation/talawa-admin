import React from 'react';
import { render, screen } from '@testing-library/react';
import 'jest-localstorage-mock';
import { BrowserRouter } from 'react-router-dom';

import TableLoader from './TableLoader';

const props = {
  noOfRows: 10,
  headerTitles: ['header1', 'header2', 'header3'],
};

describe('Testing Loader component', () => {
  test('Component should be rendered properly', () => {
    render(
      <BrowserRouter>
        <TableLoader {...props} />
      </BrowserRouter>
    );
    // Check if header titles are rendered properly
    props.headerTitles.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });

    // Check if elements are rendered properly
    for (let rowIndex = 0; rowIndex < props.noOfRows; rowIndex++) {
      expect(
        screen.getByTestId(`row-${rowIndex}-tableLoading`)
      ).toBeInTheDocument();
      for (let colIndex = 0; colIndex < props.headerTitles.length; colIndex++) {
        expect(
          screen.getByTestId(`row-${rowIndex}-col-${colIndex}-tableLoading`)
        ).toBeInTheDocument();
      }
    }
  });
});
