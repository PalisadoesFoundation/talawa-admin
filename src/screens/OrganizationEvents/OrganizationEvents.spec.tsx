import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';

import OrganizationEvents from './OrganizationEvents';
import { store } from 'state/store';
import i18n from 'utils/i18nForTest';
import userEvent from '@testing-library/user-event';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import { createTheme } from '@mui/material';
import { ThemeProvider } from 'react-bootstrap';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MOCKS } from './OrganizationEventsMocks';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { errorHandler } from 'utils/errorHandler';
import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/mutations';

const theme = createTheme({
  palette: {
    primary: {
      main: '#31bb6b',
    },
  },
});
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost/',
    assign: vi.fn((url) => {
      const urlObj = new URL(url, 'http://localhost');
      window.location.href = urlObj.href;
      window.location.pathname = urlObj.pathname;
      window.location.search = urlObj.search;
      window.location.hash = urlObj.hash;
    }),
    reload: vi.fn(),
    pathname: '/',
    search: '',
    hash: '',
    origin: 'http://localhost',
  },
});

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink([], true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}
const translations = {
  ...JSON.parse(
    JSON.stringify(
      i18n.getDataByLanguage('en')?.translation.organizationEvents ?? {},
    ),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

vi.mock('@mui/x-date-pickers/DateTimePicker', async () => {
  const actual = await vi.importActual(
    '@mui/x-date-pickers/DesktopDateTimePicker',
  );
  return {
    DateTimePicker: actual.DesktopDateTimePicker,
  };
});

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));

describe('Organisation Events Page', () => {
  const formData = {
    title: 'Dummy Org',
    description: 'This is a dummy organization',
    startDate: '03/28/2022',
    endDate: '03/30/2022',
    location: 'New Delhi',
    startTime: '09:00 AM',
    endTime: '05:00 PM',
  };

  global.alert = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('It is necessary to query the correct mock data.', async () => {
    const dataQuery1 = MOCKS[0]?.result?.data?.organization?.events?.edges?.map(
      (edge) => edge.node,
    );

    expect(dataQuery1).toEqual([
      {
        id: '1',
        name: 'Event',
        description: 'Event Test',
        startAt: '2023-01-01T02:00:00Z',
        endAt: '2023-01-01T06:00:00Z',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        creator: {
          id: '1',
          name: 'User Name',
        },
        updater: null,
        venues: {
          edges: [
            {
              node: {
                id: '1',
                name: 'New Delhi',
              },
            },
          ],
        },
        attachments: [],
        organization: {
          id: '1',
          name: 'Test Organization',
        },
      },
    ]);
  });

  test('It is necessary to query the correct mock data for organization.', async () => {
    const dataQuery1 = MOCKS[1]?.result?.data?.organization?.events?.edges?.map(
      (edge) => edge.node,
    );

    expect(dataQuery1).toEqual([
      {
        id: '1',
        name: 'Dummy Org',
        description: 'This is a dummy organization',
        startAt: '2023-01-01T02:00:00Z',
        endAt: '2023-01-01T06:00:00Z',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        creator: {
          id: '1',
          name: 'User Name',
        },
        updater: null,
        venues: {
          edges: [
            {
              node: {
                id: '1',
                name: 'New Delhi',
              },
            },
          ],
        },
        attachments: [],
        organization: {
          id: '1',
          name: 'Test Organization',
        },
      },
    ]);
  });

  test('It is necessary to check correct render', async () => {
    window.location.assign('/orglist');

    const { container } = render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18n}>
                  <OrganizationEvents />
                </I18nextProvider>
              </ThemeProvider>
            </LocalizationProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(container.textContent).not.toBe('Loading data...');
    await wait();
    expect(container.textContent).toMatch('Month');
    expect(window.location.pathname).toBe('/orglist');
  });

  test('No mock data', async () => {
    render(
      <MockedProvider link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18n}>
                  <OrganizationEvents />
                </I18nextProvider>
              </ThemeProvider>
            </LocalizationProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument();
    });
  });

  test('Testing toggling of Create event modal', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18n}>
                  <OrganizationEvents />
                </I18nextProvider>
              </ThemeProvider>
            </LocalizationProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() => {
      expect(
        screen.getByTestId('createEventModalCloseBtn'),
      ).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('createEventModalCloseBtn'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('createEventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  test('Testing Create event modal', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18n}>
                  <OrganizationEvents />
                </I18nextProvider>
              </ThemeProvider>
            </LocalizationProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter Title/i)).toBeInTheDocument();
    });

    await userEvent.type(
      screen.getByPlaceholderText(/Enter Title/i),
      formData.title,
    );

    await userEvent.type(
      screen.getByPlaceholderText(/Enter Description/i),
      formData.description,
    );
    await userEvent.type(
      screen.getByPlaceholderText(/Location/i),
      formData.location,
    );

    const endDatePicker = screen.getByLabelText('End Date');
    const startDatePicker = screen.getByLabelText('Start Date');

    fireEvent.change(endDatePicker, {
      target: { value: formData.endDate },
    });
    fireEvent.change(startDatePicker, {
      target: { value: formData.startDate },
    });

    await userEvent.click(screen.getByTestId('ispublicCheck'));
    await userEvent.click(screen.getByTestId('registrableCheck'));

    await wait();

    expect(screen.getByPlaceholderText(/Enter Title/i)).toHaveValue(
      formData.title,
    );
    expect(screen.getByPlaceholderText(/Enter Description/i)).toHaveValue(
      formData.description,
    );

    expect(endDatePicker).toHaveValue(formData.endDate);
    expect(startDatePicker).toHaveValue(formData.startDate);
    expect(screen.getByTestId('ispublicCheck')).not.toBeChecked();
    expect(screen.getByTestId('registrableCheck')).toBeChecked();

    await userEvent.click(screen.getByTestId('createEventBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(translations.eventCreated);
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('createEventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  test('Testing Create event with invalid inputs', async () => {
    const formData = {
      title: ' ',
      description: ' ',
      location: ' ',
      startDate: '03/28/2022',
      endDate: '03/30/2022',
      startTime: '02:00',
      endTime: '06:00',
      allDay: false,
      recurring: false,
      isPublic: true,
      isRegisterable: true,
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18n}>
                  <OrganizationEvents />
                </I18nextProvider>
              </ThemeProvider>
            </LocalizationProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter Title/i)).toBeInTheDocument();
    });

    await userEvent.type(
      screen.getByPlaceholderText(/Enter Title/i),
      formData.title,
    );
    await userEvent.type(
      screen.getByPlaceholderText(/Enter Description/i),
      formData.description,
    );
    await userEvent.type(
      screen.getByPlaceholderText(/Location/i),
      formData.location,
    );
    await userEvent.type(
      screen.getByPlaceholderText(/Location/i),
      formData.location,
    );

    const endDatePicker = screen.getByLabelText('End Date');
    const startDatePicker = screen.getByLabelText('Start Date');

    fireEvent.change(endDatePicker, {
      target: { value: formData.endDate },
    });
    fireEvent.change(startDatePicker, {
      target: { value: formData.startDate },
    });

    await userEvent.click(screen.getByTestId('alldayCheck'));
    await userEvent.click(screen.getByTestId('recurringCheck'));
    await userEvent.click(screen.getByTestId('ispublicCheck'));
    await userEvent.click(screen.getByTestId('registrableCheck'));

    await wait();

    expect(screen.getByPlaceholderText(/Enter Title/i)).toHaveValue(' ');
    expect(screen.getByPlaceholderText(/Enter Description/i)).toHaveValue(' ');

    expect(endDatePicker).toHaveValue(formData.endDate);
    expect(startDatePicker).toHaveValue(formData.startDate);
    expect(screen.getByTestId('alldayCheck')).not.toBeChecked();
    expect(screen.getByTestId('recurringCheck')).toBeChecked();
    expect(screen.getByTestId('ispublicCheck')).not.toBeChecked();
    expect(screen.getByTestId('registrableCheck')).toBeChecked();

    await userEvent.click(screen.getByTestId('createEventBtn'));
    expect(toast.warning).toHaveBeenCalledWith('Title can not be blank!');
    expect(toast.warning).toHaveBeenCalledWith('Description can not be blank!');
    expect(toast.warning).toHaveBeenCalledWith('Location can not be blank!');

    await userEvent.click(screen.getByTestId('createEventModalCloseBtn'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('createEventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  test('Testing create event if the event is not for all day', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18n}>
                  <OrganizationEvents />
                </I18nextProvider>
              </ThemeProvider>
            </LocalizationProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter Title/i)).toBeInTheDocument();
    });

    await userEvent.type(
      screen.getByPlaceholderText(/Enter Title/i),
      formData.title,
    );

    await userEvent.type(
      screen.getByPlaceholderText(/Enter Description/i),
      formData.description,
    );

    await userEvent.type(
      screen.getByPlaceholderText(/Location/i),
      formData.location,
    );

    const endDatePicker = screen.getByLabelText('End Date');
    const startDatePicker = screen.getByLabelText('Start Date');

    fireEvent.change(endDatePicker, {
      target: { value: formData.endDate },
    });
    fireEvent.change(startDatePicker, {
      target: { value: formData.startDate },
    });

    await userEvent.click(screen.getByTestId('alldayCheck'));

    await waitFor(() => {
      expect(screen.getByLabelText(translations.startTime)).toBeInTheDocument();
    });

    const startTimePicker = screen.getByLabelText(translations.startTime);
    const endTimePicker = screen.getByLabelText(translations.endTime);

    fireEvent.change(startTimePicker, {
      target: { value: formData.startTime },
    });

    fireEvent.change(endTimePicker, {
      target: { value: formData.endTime },
    });

    await userEvent.click(screen.getByTestId('createEventBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(translations.eventCreated);
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('createEventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  test('Testing Create event with error handling', async () => {
    // Create a custom link that will throw a network error for the CREATE_EVENT_MUTATION
    const errorLink = new StaticMockLink(MOCKS, true);

    // Override the query method to throw an error for CREATE_EVENT_MUTATION
    errorLink.request = vi.fn().mockImplementation((operation) => {
      if (operation.query === CREATE_EVENT_MUTATION) {
        return Promise.reject(new Error('Failed to create event'));
      }
      return StaticMockLink.prototype.request.call(errorLink, operation);
    });

    render(
      <MockedProvider addTypename={false} link={errorLink}>
        <BrowserRouter>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18n}>
                  <OrganizationEvents />
                </I18nextProvider>
              </ThemeProvider>
            </LocalizationProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter Title/i)).toBeInTheDocument();
    });

    await userEvent.type(
      screen.getByPlaceholderText(/Enter Title/i),
      formData.title,
    );

    await userEvent.type(
      screen.getByPlaceholderText(/Enter Description/i),
      formData.description,
    );
    await userEvent.type(
      screen.getByPlaceholderText(/Location/i),
      formData.location,
    );

    // Click the create event button to trigger the mutation
    await userEvent.click(screen.getByTestId('createEventBtn'));

    // Wait for the error handler to be called
    await waitFor(() => {
      expect(errorHandler).toHaveBeenCalled();
    });

    // Verify the error handler was called with any error object
    expect(errorHandler).toHaveBeenCalledWith(
      expect.anything(), // The t function
      expect.any(Error), // Any error object, regardless of type
    );
  });
});
