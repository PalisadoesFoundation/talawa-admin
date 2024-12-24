import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { TableRow } from './TableRow';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { ToastContainer } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MockedProvider } from '@apollo/react-testing';
import { checkInMutationSuccess, checkInMutationUnsuccess } from './mocks';
import { vi } from 'vitest';

/**
 * Test suite for the `TableRow` component, focusing on the CheckIn table functionality.
 */

describe('Testing Table Row for CheckIn Table', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('If the user is not checked in, button to check in should be displayed, and the user should be able to check in successfully', async () => {
    const props = {
      data: {
        id: `123`,
        name: `John Doe`,
        userId: `user123`,
        checkIn: null,
        eventId: `event123`,
      },
      refetch: vi.fn(),
    };

    const { findByText } = render(
      <BrowserRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MockedProvider addTypename={false} mocks={checkInMutationSuccess}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <TableRow {...props} />
              </I18nextProvider>
            </Provider>
          </MockedProvider>
        </LocalizationProvider>
      </BrowserRouter>,
    );

    expect(await findByText('Check In')).toBeInTheDocument();

    fireEvent.click(await findByText('Check In'));

    expect(await findByText('Checked in successfully')).toBeInTheDocument();
  });

  test('If the user is checked in, the option to download tag should be shown', async () => {
    const props = {
      data: {
        id: '123',
        name: 'John Doe',
        userId: 'user123',
        checkIn: {
          _id: '123',
          time: '12:00:00',
        },
        eventId: 'event123',
      },
      refetch: vi.fn(),
    };

    const { findByText } = render(
      <BrowserRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MockedProvider addTypename={false} mocks={checkInMutationSuccess}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <TableRow {...props} />
              </I18nextProvider>
            </Provider>
          </MockedProvider>
        </LocalizationProvider>
      </BrowserRouter>,
    );

    global.URL.createObjectURL = vi.fn(() => 'mockURL');
    global.window.open = vi.fn();

    expect(await findByText('Checked In')).toBeInTheDocument();
    expect(await findByText('Download Tag')).toBeInTheDocument();

    fireEvent.click(await findByText('Download Tag'));

    expect(await findByText('Generating pdf...')).toBeInTheDocument();
    expect(await findByText('PDF generated successfully!')).toBeInTheDocument();

    // Cleanup mocks
    vi.clearAllMocks();
  });

  test('Upon failing of check in mutation, the appropriate error message should be shown', async () => {
    const props = {
      data: {
        id: `123`,
        name: `John Doe`,
        userId: `user123`,
        checkIn: null,
        eventId: `event123`,
      },
      refetch: vi.fn(),
    };

    const { findByText } = render(
      <BrowserRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MockedProvider addTypename={false} mocks={checkInMutationUnsuccess}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <TableRow {...props} />
              </I18nextProvider>
            </Provider>
          </MockedProvider>
        </LocalizationProvider>
      </BrowserRouter>,
    );

    expect(await findByText('Check In')).toBeInTheDocument();

    fireEvent.click(await findByText('Check In'));

    expect(await findByText('Error checking in')).toBeInTheDocument();
    expect(await findByText('Oops')).toBeInTheDocument();
  });

  test('If PDF generation fails, the error message should be shown', async () => {
    const props = {
      data: {
        id: `123`,
        name: '',
        userId: `user123`,
        checkIn: {
          _id: '123',
          time: '12:00:00',
        },
        eventId: `event123`,
      },
      refetch: vi.fn(),
    };

    const { findByText } = render(
      <BrowserRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MockedProvider addTypename={false} mocks={checkInMutationSuccess}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <TableRow {...props} />
              </I18nextProvider>
            </Provider>
          </MockedProvider>
        </LocalizationProvider>
      </BrowserRouter>,
    );

    // Mocking the PDF generation function to throw an error
    global.URL.createObjectURL = vi.fn(() => 'mockURL');
    global.window.open = vi.fn();

    fireEvent.click(await findByText('Download Tag'));

    expect(
      await findByText('Error generating pdf: Invalid or empty name provided'),
    ).toBeInTheDocument();
  });
});
