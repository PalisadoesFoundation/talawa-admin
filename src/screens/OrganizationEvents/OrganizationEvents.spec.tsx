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
import { MockLink } from '@apollo/react-testing';
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
    expect(MOCKS[0]).toBeDefined();

    const dataQuery1 =
      MOCKS[0]?.result?.data?.organization?.events?.edges?.map(
        (edge) => edge.node,
      ) ?? [];

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
    expect(MOCKS[1]).toBeDefined();

    const dataQuery1 =
      MOCKS[1]?.result?.data?.organization?.events?.edges?.map(
        (edge) => edge.node,
      ) ?? [];

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
    await userEvent.click(screen.getByTestId('createChat'));
    await userEvent.click(screen.getByTestId('eventLocation'));

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
    expect(screen.getByTestId('createChat')).toBeInTheDocument();
    expect(screen.getByTestId('eventLocation')).toBeInTheDocument();

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
      chat: true,
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
    await userEvent.click(screen.getByTestId('createChat'));
    await userEvent.click(screen.getByTestId('eventLocation'));
    await userEvent.click(screen.getByTestId('ispublicCheck'));
    await userEvent.click(screen.getByTestId('registrableCheck'));

    await wait();

    expect(screen.getByPlaceholderText(/Enter Title/i)).toHaveValue(' ');
    expect(screen.getByPlaceholderText(/Enter Description/i)).toHaveValue(' ');

    expect(endDatePicker).toHaveValue(formData.endDate);
    expect(startDatePicker).toHaveValue(formData.startDate);
    expect(screen.getByTestId('alldayCheck')).not.toBeChecked();
    expect(screen.getByTestId('recurringCheck')).toBeChecked();
    expect(screen.getByTestId('eventLocation')).toBeInTheDocument();
    expect(screen.getByTestId('ispublicCheck')).not.toBeChecked();
    expect(screen.getByTestId('registrableCheck')).toBeChecked();
    expect(screen.getByTestId('createChat')).toBeInTheDocument();
    expect(screen.getByTestId('alldayCheck')).not.toBeChecked();

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

    const errorLink = new MockLink(MOCKS);

    //  Override the request method to throw an error for CREATE_EVENT_MUTATION
    errorLink.addMockedResponse({
      request: { query: CREATE_EVENT_MUTATION },
      error: new Error('Failed to create event'),
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

    await userEvent.click(screen.getByTestId('createEventBtn'));

    await waitFor(() => {
      expect(errorHandler).toHaveBeenCalled();
    });

    expect(errorHandler).toHaveBeenCalledWith(
      expect.anything(),
      expect.any(Error),
    );
  });

  test('Testing handleChangeView function', async () => {
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

    // Get the view type dropdown button
    const viewTypeDropdown = screen.getByTestId('selectViewType');
    expect(viewTypeDropdown).toBeInTheDocument();

    // Click to open the dropdown
    await userEvent.click(viewTypeDropdown);

    // Select "Day" view option
    const dayOption = await screen.findByTestId('Day');
    expect(dayOption).toBeInTheDocument();
    await userEvent.click(dayOption);

    // Open dropdown again
    await userEvent.click(viewTypeDropdown);

    // Select "Month View" option
    const monthOption = await screen.findByTestId('Month View');
    expect(monthOption).toBeInTheDocument();
    await userEvent.click(monthOption);

    // Open dropdown again
    await userEvent.click(viewTypeDropdown);

    // Select "Year View" option
    const yearOption = await screen.findByTestId('Year View');
    expect(yearOption).toBeInTheDocument();
    await userEvent.click(yearOption);
  });

  test('Testing view type dropdown selection', async () => {
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

    // First, get the view type dropdown button
    const viewTypeDropdown = screen.getByTestId('selectViewType');
    expect(viewTypeDropdown).toBeInTheDocument();
    expect(viewTypeDropdown.textContent).toContain('Month View');

    // Click to open the dropdown
    await userEvent.click(viewTypeDropdown);

    // Find and click on the "Day" option using the data-testid
    const dayOption = await screen.findByTestId('Day');
    expect(dayOption).toBeInTheDocument();
    expect(dayOption.textContent).toBe('Select Day');

    await userEvent.click(dayOption);

    await waitFor(() => {
      expect(viewTypeDropdown.textContent).toContain('Day');
    });
  });

  test('DatePicker onChange handler with both valid and null date values', async () => {
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
    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    const startDatePicker = screen.getByLabelText('Start Date');
    const endDatePicker = screen.getByLabelText('End Date');

    const validDate = '2023-12-25';
    fireEvent.change(startDatePicker, {
      target: { value: validDate },
    });

    expect(startDatePicker).toBeInTheDocument();

    fireEvent.change(startDatePicker, {
      target: { value: '' },
    });

    expect(startDatePicker).toBeInTheDocument();
    expect(endDatePicker).toBeInTheDocument();

    fireEvent.change(startDatePicker, {
      target: { value: 'invalid-date' },
    });

    expect(startDatePicker).toBeInTheDocument();
  });

  test('DatePicker onChange handler conditionals for setting end date and weekDayOccurenceInMonth', async () => {
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
    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    const startDatePicker = screen.getByLabelText('Start Date');
    const endDatePicker = screen.getByLabelText('End Date');

    fireEvent.change(endDatePicker, {
      target: { value: '2023-01-15' },
    });

    fireEvent.change(startDatePicker, {
      target: { value: '2023-01-20' },
    });

    expect(startDatePicker).toBeInTheDocument();
    expect(endDatePicker).toBeInTheDocument();

    fireEvent.change(startDatePicker, {
      target: { value: '2023-02-10' },
    });

    fireEvent.change(endDatePicker, {
      target: { value: '2023-02-20' },
    });

    fireEvent.change(startDatePicker, {
      target: { value: '2023-02-15' },
    });

    expect(startDatePicker).toBeInTheDocument();
    expect(endDatePicker).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('recurringCheck'));

    expect(startDatePicker).toBeInTheDocument();
  });

  test('TimePicker onChange handler conditionals for both time and null values', async () => {
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
    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await userEvent.click(screen.getByTestId('alldayCheck'));

    const startTimePicker = screen.getByLabelText(translations.startTime);
    const endTimePicker = screen.getByLabelText(translations.endTime);

    fireEvent.change(startTimePicker, {
      target: { value: '10:30:00' },
    });

    expect(startTimePicker).toBeInTheDocument();

    const mockNullEvent = {
      target: { value: '' },
    };

    fireEvent.change(startTimePicker, mockNullEvent);

    expect(startTimePicker).toBeInTheDocument();

    fireEvent.change(endTimePicker, {
      target: { value: '14:45:00' },
    });
    expect(endTimePicker).toBeInTheDocument();

    fireEvent.change(endTimePicker, mockNullEvent);
    expect(endTimePicker).toBeInTheDocument();

    fireEvent.change(endTimePicker, {
      target: { value: '09:00:00' },
    });

    fireEvent.change(startTimePicker, {
      target: { value: '10:00:00' },
    });

    expect(startTimePicker).toBeInTheDocument();
    expect(endTimePicker).toBeInTheDocument();
  });

  test('Ensures end date is updated when start date is set later than current end date', async () => {
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
    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    const startDatePicker = screen.getByLabelText('Start Date');
    const endDatePicker = screen.getByLabelText('End Date');

    fireEvent.change(endDatePicker, {
      target: { value: '03/15/2022' },
    });

    fireEvent.change(startDatePicker, {
      target: { value: '03/20/2022' },
    });

    await waitFor(() => {
      expect(endDatePicker).toHaveValue('03/20/2022');
    });
  });

  test('Ensures end time is updated when start time is set later than current end time', async () => {
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
    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await userEvent.click(screen.getByTestId('alldayCheck'));

    const startTimePicker = screen.getByLabelText(translations.startTime);
    const endTimePicker = screen.getByLabelText(translations.endTime);

    fireEvent.change(endTimePicker, {
      target: { value: '08:00 AM' },
    });

    const initialValue = endTimePicker.getAttribute('value');

    fireEvent.change(startTimePicker, {
      target: { value: '10:00 AM' },
    });

    await waitFor(() => {
      const updatedValue = endTimePicker.getAttribute('value');
      expect(updatedValue).not.toBe(initialValue);

      expect(updatedValue?.includes('10:')).toBe(true);
    });
  });
});
