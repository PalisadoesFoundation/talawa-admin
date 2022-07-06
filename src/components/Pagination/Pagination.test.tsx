import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import Pagination from './Pagination';
import { store } from 'state/store';
import userEvent from '@testing-library/user-event';

describe('Testing Pagination component', () => {
  const props = {
    count: 5,
    page: 10,
    rowsPerPage: 5,
    onPageChange: () => 10,
  };

  test('Component should be rendered properly', () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Pagination {...props} />
        </Provider>
      </BrowserRouter>
    );

    userEvent.click(screen.getByTestId(/nextPage/i));
    userEvent.click(screen.getByTestId(/previousPage/i));
  });
});
