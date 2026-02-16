import React from 'react';
import { render } from '@testing-library/react';
import { TableRow } from './TableRow';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { NotificationToastContainer } from 'components/NotificationToast/NotificationToast';
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DatePicker';
import { MockedProvider } from '@apollo/react-testing';
import {
  checkInMutationSuccess,
  checkInMutationUnsuccess,
  checkInMutationSuccessRecurring,
} from '../../CheckInMocks';
import { vi } from 'vitest';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import userEvent from '@testing-library/user-event';

dayjs.extend(utc);

// Mock @pdfme/generator
vi.mock('@pdfme/generator', () => ({
  generate: vi.fn(() =>
    Promise.resolve({
      buffer: new ArrayBuffer(8),
    }),
  ),
}));

/**
 * Test suite for the `TableRow` component, focusing on the CheckIn table functionality.
 */

describe('Testing Table Row for CheckIn Table', () => {
  let user: ReturnType<typeof userEvent.setup>;
  beforeEach(() => {
    global.URL.createObjectURL = vi.fn(() => 'mockURL');
    global.window.open = vi.fn();
    user = userEvent.setup();
  });
  afterEach(() => {
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
          <MockedProvider mocks={checkInMutationSuccess}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <NotificationToastContainer />
                <TableRow {...props} />
              </I18nextProvider>
            </Provider>
          </MockedProvider>
        </LocalizationProvider>
      </BrowserRouter>,
    );

    expect(await findByText('Check In')).toBeInTheDocument();

    await user.click(await findByText('Check In'));

    expect(await findByText('Checked in successfully')).toBeInTheDocument();
  });

  test('If the user is checked in, the option to download tag should be shown', async () => {
    const props = {
      data: {
        id: '123',
        name: 'John Doe',
        userId: 'user123',
        checkInTime: dayjs.utc().toISOString(),
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
          <MockedProvider mocks={checkInMutationSuccess}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <NotificationToastContainer />
                <TableRow {...props} />
              </I18nextProvider>
            </Provider>
          </MockedProvider>
        </LocalizationProvider>
      </BrowserRouter>,
    );

    expect(await findByText('Checked In')).toBeInTheDocument();
    expect(await findByText('Download Tag')).toBeInTheDocument();

    await user.click(await findByText('Download Tag'));

    expect(await findByText('Generating pdf...')).toBeInTheDocument();
    expect(await findByText('PDF generated successfully!')).toBeInTheDocument();
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
          <MockedProvider mocks={checkInMutationUnsuccess}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <NotificationToastContainer />
                <TableRow {...props} />
              </I18nextProvider>
            </Provider>
          </MockedProvider>
        </LocalizationProvider>
      </BrowserRouter>,
    );

    expect(await findByText('Check In')).toBeInTheDocument();

    await user.click(await findByText('Check In'));

    expect(await findByText('Error checking in')).toBeInTheDocument();
    expect(await findByText('Oops')).toBeInTheDocument();
  });

  test('If PDF generation fails, the error message should be shown', async () => {
    const props = {
      data: {
        id: `123`,
        name: '',
        userId: `user123`,
        checkInTime: dayjs.utc().toISOString(),
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
          <MockedProvider mocks={checkInMutationSuccess}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <NotificationToastContainer />
                <TableRow {...props} />
              </I18nextProvider>
            </Provider>
          </MockedProvider>
        </LocalizationProvider>
      </BrowserRouter>,
    );

    await user.click(await findByText('Download Tag'));

    expect(await findByText('Error generating pdf')).toBeInTheDocument();
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
          <MockedProvider mocks={checkInMutationSuccessRecurring}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <NotificationToastContainer />
                <TableRow {...props} />
              </I18nextProvider>
            </Provider>
          </MockedProvider>
        </LocalizationProvider>
      </BrowserRouter>,
    );

    expect(await findByText('Check In')).toBeInTheDocument();

    await user.click(await findByText('Check In'));

    expect(await findByText('Checked in successfully')).toBeInTheDocument();
  });

  test('Should handle non-Error rejection in PDF generation', async () => {
    // Mock generate to throw a non-Error value
    const { generate } = await import('@pdfme/generator');
    vi.mocked(generate).mockRejectedValueOnce('string error');

    const props = {
      data: {
        id: `123`,
        name: `John Doe`,
        userId: `user123`,
        checkInTime: dayjs.utc().toISOString(),
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
          <MockedProvider mocks={checkInMutationSuccess}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <NotificationToastContainer />
                <TableRow {...props} />
              </I18nextProvider>
            </Provider>
          </MockedProvider>
        </LocalizationProvider>
      </BrowserRouter>,
    );

    await user.click(await findByText('Download Tag'));

    expect(await findByText('Error generating pdf')).toBeInTheDocument();
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
          <MockedProvider mocks={checkInMutationSuccess}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <NotificationToastContainer />
                <TableRow {...props} />
              </I18nextProvider>
            </Provider>
          </MockedProvider>
        </LocalizationProvider>
      </BrowserRouter>,
    );

    await user.click(await findByText('Check In'));

    expect(await findByText('Checked in successfully')).toBeInTheDocument();
    expect(mockOnCheckInUpdate).toHaveBeenCalledTimes(1);
  });
});
