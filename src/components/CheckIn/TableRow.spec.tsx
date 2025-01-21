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

interface TableRowProps {
  data: {
    id: string;
    name: string;
    userId: string;
    checkIn: null | {
      _id: string;
      time: string;
    };
    eventId: string;
  };
  refetch: () => void;
}

describe('Testing TableRow component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithProviders = (
    props: TableRowProps,
  ): ReturnType<typeof render> =>
    render(
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

  test('If user is not checked in, "Check In" button should be displayed and work correctly', async () => {
    const props: TableRowProps = {
      data: {
        id: '123',
        name: 'John Doe',
        userId: 'user123',
        checkIn: null,
        eventId: 'event123',
      },
      refetch: vi.fn(),
    };

    const { findByText } = renderWithProviders(props);

    expect(await findByText('Check In')).toBeInTheDocument();
    fireEvent.click(await findByText('Check In'));
    expect(await findByText('Checked in successfully')).toBeInTheDocument();
  });

  test('If user is already checked in, "Download Tag" button should be available', async () => {
    const props: TableRowProps = {
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

    global.URL.createObjectURL = vi.fn(() => 'mockURL');
    global.window.open = vi.fn();

    const { findByText } = renderWithProviders(props);

    expect(await findByText('Checked In')).toBeInTheDocument();
    expect(await findByText('Download Tag')).toBeInTheDocument();

    fireEvent.click(await findByText('Download Tag'));

    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(global.window.open).toHaveBeenCalledWith('mockURL');
    expect(await findByText('PDF generated successfully!')).toBeInTheDocument();
  });

  test('Upon check-in mutation failure, an error message should be displayed', async () => {
    const props: TableRowProps = {
      data: {
        id: '123',
        name: 'John Doe',
        userId: 'user123',
        checkIn: null,
        eventId: 'event123',
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

    fireEvent.click(await findByText('Check In'));

    expect(await findByText('Error checking in')).toBeInTheDocument();
    expect(await findByText('Oops')).toBeInTheDocument();
  });

  test('If PDF generation fails, an error message should be displayed', async () => {
    const props: TableRowProps = {
      data: {
        id: '123',
        name: '',
        userId: 'user123',
        checkIn: {
          _id: '123',
          time: '12:00:00',
        },
        eventId: 'event123',
      },
      refetch: vi.fn(),
    };

    global.URL.createObjectURL = vi.fn(() => {
      throw new Error('Blob creation failed');
    });
    global.window.open = vi.fn();

    const { findByText } = renderWithProviders(props);

    fireEvent.click(await findByText('Download Tag'));

    expect(
      await findByText('Error generating pdf: Blob creation failed'),
    ).toBeInTheDocument();
  });

  test('Generated PDF should be downloadable with correct content', async () => {
    const props: TableRowProps = {
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

    const mockBlob = new Blob(['mock content'], { type: 'application/pdf' });
    global.URL.createObjectURL = vi.fn(() => 'mockURL');
    global.window.open = vi.fn();

    const { findByText } = renderWithProviders(props);

    fireEvent.click(await findByText('Download Tag'));

    expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
    expect(global.window.open).toHaveBeenCalledWith('mockURL');
  });
});
