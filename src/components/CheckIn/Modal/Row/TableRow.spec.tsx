import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { TableRow } from './TableRow';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { ToastContainer } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MockedProvider } from '@apollo/react-testing';
import {
  checkInMutationSuccess,
  checkInMutationUnsuccess,
  checkInMutationSuccessRecurring,
} from '../../CheckInMocks';
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
        checkInTime: null,
        checkOutTime: null,
        isCheckedIn: false,
        isCheckedOut: false,
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
        checkInTime: '2023-01-01T12:00:00Z',
        checkOutTime: null,
        isCheckedIn: true,
        isCheckedOut: false,
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
        checkInTime: null,
        checkOutTime: null,
        isCheckedIn: false,
        isCheckedOut: false,
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
        checkInTime: '2023-01-01T12:00:00Z',
        checkOutTime: null,
        isCheckedIn: true,
        isCheckedOut: false,
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

  test('Should check in user for recurring event successfully', async () => {
    const props = {
      data: {
        id: `123`,
        name: `John Doe`,
        userId: `user123`,
        checkInTime: null,
        checkOutTime: null,
        isCheckedIn: false,
        isCheckedOut: false,
        eventId: `recurring123`,
        isRecurring: true,
      },
      refetch: vi.fn(),
    };

    const { findByText } = render(
      <BrowserRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MockedProvider
            addTypename={false}
            mocks={checkInMutationSuccessRecurring}
          >
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

  test('Should call onCheckInUpdate callback after successful check-in', async () => {
    const mockOnCheckInUpdate = vi.fn();
    const props = {
      data: {
        id: `123`,
        name: `John Doe`,
        userId: `user123`,
        checkInTime: null,
        checkOutTime: null,
        isCheckedIn: false,
        isCheckedOut: false,
        eventId: `event123`,
      },
      refetch: vi.fn(),
      onCheckInUpdate: mockOnCheckInUpdate,
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

    fireEvent.click(await findByText('Check In'));

    expect(await findByText('Checked in successfully')).toBeInTheDocument();
    expect(mockOnCheckInUpdate).toHaveBeenCalledTimes(1);
  });

  test('Should generate and download PDF successfully with valid name', async () => {
    const props = {
      data: {
        id: `123`,
        name: `John Doe`,
        userId: `user123`,
        checkInTime: '2023-01-01T12:00:00Z',
        checkOutTime: null,
        isCheckedIn: true,
        isCheckedOut: false,
        eventId: `event123`,
      },
      refetch: vi.fn(),
    };

    const mockOpen = vi.fn();
    const mockCreateObjectURL = vi.fn(() => 'mockURL');

    global.URL.createObjectURL = mockCreateObjectURL;
    global.window.open = mockOpen;

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

    fireEvent.click(await findByText('Download Tag'));

    // Wait for the toast promise to resolve
    expect(await findByText('Generating pdf...')).toBeInTheDocument();
    expect(await findByText('PDF generated successfully!')).toBeInTheDocument();

    // Cleanup mocks
    vi.clearAllMocks();
  });

  test('Should handle non-Error exception during PDF generation', async () => {
    const props = {
      data: {
        id: `123`,
        name: `John Doe`,
        userId: `user123`,
        checkInTime: '2023-01-01T12:00:00Z',
        checkOutTime: null,
        isCheckedIn: true,
        isCheckedOut: false,
        eventId: `event123`,
      },
      refetch: vi.fn(),
    };

    // Mock generate to throw a non-Error exception
    vi.mock('@pdfme/generator', () => ({
      generate: vi.fn(() => {
        throw 'String error'; // Non-Error exception
      }),
    }));

    global.URL.createObjectURL = vi.fn(() => 'mockURL');
    global.window.open = vi.fn();

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

    fireEvent.click(await findByText('Download Tag'));

    expect(
      await findByText('Error generating pdf: Unknown error'),
    ).toBeInTheDocument();

    vi.clearAllMocks();
  });
});
