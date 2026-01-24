import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import Pagination from './Pagination';
import { store } from 'state/store';
import userEvent from '@testing-library/user-event';
import i18n from 'utils/i18nForTest';
import { describe, it, vi, expect } from 'vitest';

describe('Pagination component tests', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  const mockOnPageChange = vi.fn();

  const defaultProps = {
    count: 20, // Total items
    page: 2, // Current page
    rowsPerPage: 5, // Items per page
    onPageChange: mockOnPageChange, // Mocked callback for page change
  };

  it('should render all pagination buttons and invoke onPageChange for navigation', async () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <Pagination {...defaultProps} />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>,
    );

    // Ensure all buttons are rendered
    expect(screen.getByTestId('firstPage')).toBeInTheDocument();
    expect(screen.getByTestId('previousPage')).toBeInTheDocument();
    expect(screen.getByTestId('nextPage')).toBeInTheDocument();
    expect(screen.getByTestId('lastPage')).toBeInTheDocument();

    // Simulate button clicks and verify callback invocation
    await act(async () => {
      await userEvent.click(screen.getByTestId('nextPage'));
    });
    expect(mockOnPageChange).toHaveBeenCalledWith(expect.anything(), 3); // Next page

    await act(async () => {
      await userEvent.click(screen.getByTestId('previousPage'));
    });
    expect(mockOnPageChange).toHaveBeenCalledWith(expect.anything(), 1); // Previous page

    await act(async () => {
      await userEvent.click(screen.getByTestId('firstPage'));
    });
    expect(mockOnPageChange).toHaveBeenCalledWith(expect.anything(), 0); // First page

    await act(async () => {
      await userEvent.click(screen.getByTestId('lastPage'));
    });
    expect(mockOnPageChange).toHaveBeenCalledWith(expect.anything(), 3); // Last page
  });

  it('should disable navigation buttons at the boundaries', () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <Pagination {...defaultProps} page={0} />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>,
    );

    // First and Previous buttons should be disabled on the first page
    expect(screen.getByTestId('firstPage')).toBeDisabled();
    expect(screen.getByTestId('previousPage')).toBeDisabled();

    // Next and Last buttons should not be disabled
    expect(screen.getByTestId('nextPage')).not.toBeDisabled();
    expect(screen.getByTestId('lastPage')).not.toBeDisabled();
  });

  it('should render correctly with RTL direction', async () => {
    const rtlTheme = createTheme({ direction: 'rtl' });

    render(
      <BrowserRouter>
        <Provider store={store}>
          <ThemeProvider theme={rtlTheme}>
            <I18nextProvider i18n={i18n}>
              <Pagination {...defaultProps} />
            </I18nextProvider>
          </ThemeProvider>
        </Provider>
      </BrowserRouter>,
    );

    // Verify buttons render properly in RTL mode
    expect(screen.getByTestId('firstPage')).toBeInTheDocument();
    expect(screen.getByTestId('lastPage')).toBeInTheDocument();

    // Simulate a button click in RTL mode
    await act(async () => {
      await userEvent.click(screen.getByTestId('nextPage'));
    });
    expect(mockOnPageChange).toHaveBeenCalledWith(expect.anything(), 3); // Next page
  });

  it('should disable Next and Last buttons on the last page', () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <Pagination
              {...defaultProps}
              page={
                Math.ceil(defaultProps.count / defaultProps.rowsPerPage) - 1
              }
            />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>,
    );

    // Next and Last buttons should be disabled on the last page
    expect(screen.getByTestId('nextPage')).toBeDisabled();
    expect(screen.getByTestId('lastPage')).toBeDisabled();

    // First and Previous buttons should not be disabled
    expect(screen.getByTestId('firstPage')).not.toBeDisabled();
    expect(screen.getByTestId('previousPage')).not.toBeDisabled();
  });
});
