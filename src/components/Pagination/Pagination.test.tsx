import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
<<<<<<< HEAD
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Pagination from './Pagination';
import { store } from 'state/store';
import userEvent from '@testing-library/user-event';
=======
import { createTheme } from '@mui/material/styles';
import Pagination from './Pagination';
import { store } from 'state/store';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

describe('Testing Pagination component', () => {
  const props = {
    count: 5,
    page: 10,
    rowsPerPage: 5,
    onPageChange: (): number => {
      return 10;
    },
  };

  test('Component should be rendered properly on rtl', () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <Pagination {...props} />
        </Provider>
<<<<<<< HEAD
      </BrowserRouter>,
=======
      </BrowserRouter>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    userEvent.click(screen.getByTestId(/nextPage/i));
    userEvent.click(screen.getByTestId(/previousPage/i));
  });
});

const props = {
  count: 5,
  page: 10,
  rowsPerPage: 5,
  onPageChange: (): number => {
    return 10;
  },
  theme: { direction: 'rtl' },
};

test('Component should be rendered properly', () => {
  const theme = createTheme({
    direction: 'rtl',
  });

  render(
    <BrowserRouter>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Pagination {...props} />
        </ThemeProvider>
      </Provider>
<<<<<<< HEAD
    </BrowserRouter>,
=======
    </BrowserRouter>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  );

  userEvent.click(screen.getByTestId(/nextPage/i));
  userEvent.click(screen.getByTestId(/previousPage/i));
});
