import React, { act } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';

import { ORGANIZATION_EVENTS_CONNECTION } from 'GraphQl/Queries/Queries';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import Events from './Events';
import userEvent from '@testing-library/user-event';
import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/mutations';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ThemeProvider } from 'react-bootstrap';
import { createTheme } from '@mui/material';
import useLocalStorage from 'utils/useLocalstorage';
import { vi } from 'vitest';

/**
 * Unit tests for the Events component.
 *
 * This file contains tests to verify the functionality and behavior of the Events component
 * under various scenarios, including successful event creation, date/time picker handling,
 * calendar view toggling, and error handling. Mocked dependencies are used to ensure isolated testing.
 */

const { setItem } = useLocalStorage();

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('@mui/x-date-pickers/DatePicker', async () => {
  const desktopDatePickerModule = await vi.importActual(
    '@mui/x-date-pickers/DesktopDatePicker',
  );
  return {
    DatePicker: desktopDatePickerModule.DesktopDatePicker,
  };
});

vi.mock('@mui/x-date-pickers/TimePicker', async () => {
  const timePickerModule = await vi.importActual(
    '@mui/x-date-pickers/DesktopTimePicker',
  );
  return {
    TimePicker: timePickerModule.DesktopTimePicker,
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ orgId: '' }),
  };
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#31bb6b',
    },
  },
});

const MOCKS = [
  {
    request: {
      query: ORGANIZATION_EVENTS_CONNECTION,
      variables: {
        organization_id: '',
        title_contains: '',
      },
    },
    result: {
      data: {
        eventsByOrganizationConnection: [
          {
            _id: '6404a267cc270739118e2349',
            title: 'NewEvent',
            description: 'sdadsasad',
            startDate: '2023-03-05',
            endDate: '2023-03-05',
            location: 'NewLocation',
            startTime: null,
            endTime: null,
            allDay: true,
            recurring: false,
            isPublic: true,
            isRegisterable: false,
            creator: {
              _id: '63d649417ffe6e4d5174ea32',
              firstName: 'Noble',
              lastName: 'Mittal',
              __typename: 'User',
            },
            attendees: [
              {
                _id: '63d649417ffe6e4d5174ea32',
                __typename: 'User',
              },
              {
                _id: '63d6064458fce20ee25c3bf7',
                __typename: 'User',
              },
            ],
            __typename: 'Event',
          },
          {
            _id: '6404e952c651df745358849d',
            title: '1parti',
            description: 'asddas',
            startDate: '2023-03-06',
            endDate: '2023-03-06',
            location: 'das',
            startTime: '00:40:00.000',
            endTime: '02:40:00.000',
            allDay: false,
            recurring: false,
            isPublic: true,
            isRegisterable: true,
            creator: {
              _id: '63d649417ffe6e4d5174ea32',
              firstName: 'Noble',
              lastName: 'Mittal',
              __typename: 'User',
            },
            attendees: [
              {
                _id: '63d649417ffe6e4d5174ea32',
                __typename: 'User',
              },
              {
                _id: '63dd52bbe69f63814b0a5dd4',
                __typename: 'User',
              },
              {
                _id: '63d6064458fce20ee25c3bf7',
                __typename: 'User',
              },
            ],
            __typename: 'Event',
          },
        ],
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_EVENTS_CONNECTION,
      variables: {
        organization_id: '',
        title_contains: 'test',
      },
    },
    result: {
      data: {
        eventsByOrganizationConnection: [
          {
            _id: '6404a267cc270739118e2349',
            title: 'NewEvent',
            description: 'sdadsasad',
            startDate: '2023-03-05',
            endDate: '2023-03-05',
            location: 'NewLocation',
            startTime: null,
            endTime: null,
            allDay: true,
            recurring: false,
            isPublic: true,
            isRegisterable: false,
            creator: {
              _id: '63d649417ffe6e4d5174ea32',
              firstName: 'Noble',
              lastName: 'Mittal',
              __typename: 'User',
            },
            attendees: [
              {
                _id: '63d649417ffe6e4d5174ea32',
                __typename: 'User',
              },
              {
                _id: '63d6064458fce20ee25c3bf7',
                __typename: 'User',
              },
            ],
            __typename: 'Event',
          },
        ],
      },
    },
  },
  {
    request: {
      query: CREATE_EVENT_MUTATION,
      variables: {
        title: 'testEventTitle',
        description: 'testEventDescription',
        location: 'testEventLocation',
        isPublic: true,
        recurring: false,
        isRegisterable: true,
        organizationId: '',
        startDate: dayjs(new Date()).format('YYYY-MM-DD'),
        endDate: dayjs(new Date()).format('YYYY-MM-DD'),
        allDay: false,
        startTime: '08:00:00',
        endTime: '10:00:00',
      },
    },
    result: {
      data: {
        createEvent: {
          _id: '2',
        },
      },
    },
  },
  {
    request: {
      query: CREATE_EVENT_MUTATION,
      variables: {
        title: 'testEventTitle',
        description: 'testEventDescription',
        location: 'testEventLocation',
        isPublic: true,
        recurring: false,
        isRegisterable: true,
        organizationId: '',
        startDate: dayjs(new Date()).format('YYYY-MM-DD'),
        endDate: dayjs(new Date()).format('YYYY-MM-DD'),
        allDay: true,
        startTime: null,
        endTime: null,
      },
    },
    result: {
      data: {
        createEvent: {
          _id: '1',
        },
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing Events Screen [User Portal]', () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // Deprecated
      removeListener: vi.fn(), // Deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  it('Screen should be rendered properly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Events />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    setItem('SuperAdmin', true); // testing userRole as Superadmin
    await wait();
    setItem('SuperAdmin', false);
    setItem('AdminFor', ['123']); // testing userRole as Admin
    await wait();
  });

  it('Create event works as expected when event is not an all day event.', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18nForTest}>
                  <Events />
                </I18nextProvider>
              </ThemeProvider>
            </LocalizationProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('createEventModalBtn'));

    const randomEventTitle = 'testEventTitle';
    const randomEventDescription = 'testEventDescription';
    const randomEventLocation = 'testEventLocation';

    userEvent.type(screen.getByTestId('eventTitleInput'), randomEventTitle);
    userEvent.type(
      screen.getByTestId('eventDescriptionInput'),
      randomEventDescription,
    );
    userEvent.type(
      screen.getByTestId('eventLocationInput'),
      randomEventLocation,
    );

    userEvent.click(screen.getByTestId('publicEventCheck'));
    userEvent.click(screen.getByTestId('publicEventCheck'));

    userEvent.click(screen.getByTestId('registerableEventCheck'));
    userEvent.click(screen.getByTestId('registerableEventCheck'));

    userEvent.click(screen.getByTestId('recurringEventCheck'));
    userEvent.click(screen.getByTestId('recurringEventCheck'));

    userEvent.click(screen.getByTestId('recurringEventCheck'));
    userEvent.click(screen.getByTestId('recurringEventCheck'));

    userEvent.click(screen.getByTestId('allDayEventCheck'));

    userEvent.click(screen.getByTestId('createEventBtn'));

    await wait();

    expect(toast.success).toHaveBeenCalledWith(
      'Event created and posted successfully.',
    );
  });

  it('Create event works as expected when event is an all day event.', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18nForTest}>
                  <Events />
                </I18nextProvider>
              </ThemeProvider>
            </LocalizationProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();

    userEvent.click(screen.getByTestId('createEventModalBtn'));

    const randomEventTitle = 'testEventTitle';
    const randomEventDescription = 'testEventDescription';
    const randomEventLocation = 'testEventLocation';

    userEvent.type(screen.getByTestId('eventTitleInput'), randomEventTitle);
    userEvent.type(
      screen.getByTestId('eventDescriptionInput'),
      randomEventDescription,
    );
    userEvent.type(
      screen.getByTestId('eventLocationInput'),
      randomEventLocation,
    );

    userEvent.click(screen.getByTestId('createEventBtn'));

    await wait();

    expect(toast.success).toHaveBeenCalledWith(
      'Event created and posted successfully.',
    );
  });

  it('Switch to calendar view works as expected.', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18nForTest}>
                  <Events />
                </I18nextProvider>
              </ThemeProvider>
            </LocalizationProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // await wait();

    // userEvent.click(screen.getByTestId('modeChangeBtn'));
    // userEvent.click(screen.getByTestId('modeBtn1'));

    await wait();
    const calenderView = 'Calendar View';

    expect(screen.queryAllByText(calenderView)).not.toBeNull();
    expect(screen.getByText('Sun')).toBeInTheDocument();
  });

  it('Testing DatePicker and TimePicker', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18nForTest}>
                  <Events />
                </I18nextProvider>
              </ThemeProvider>
            </LocalizationProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    userEvent.click(screen.getByTestId('createEventModalBtn'));
    // MM/DD/YYYY
    const startDate = new Date();
    const endDate = new Date();
    const startTime = '08:00 AM';
    const endTime = '10:00 AM';

    await waitFor(() => {
      expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
      expect(screen.getByLabelText('End Date')).toBeInTheDocument();
    });

    expect(endDate).not.toBeNull();
    const endDateDatePicker = screen.getByLabelText('End Date');
    expect(startDate).not.toBeNull();
    const startDateDatePicker = screen.getByLabelText('Start Date');

    const startDateDayjs = dayjs(startDate);
    const endDateDayjs = dayjs(endDate);

    fireEvent.change(startDateDatePicker, {
      target: { value: startDateDayjs.format('MM/DD/YYYY') },
    });
    fireEvent.change(endDateDatePicker, {
      target: { value: endDateDayjs.format('MM/DD/YYYY') },
    });

    await waitFor(() => {
      expect(startDateDatePicker).toHaveValue(
        startDateDayjs.format('MM/DD/YYYY'),
      );
      expect(endDateDatePicker).toHaveValue(endDateDayjs.format('MM/DD/YYYY'));
    });

    userEvent.click(screen.getByTestId('allDayEventCheck'));

    expect(endTime).not.toBeNull();
    const endTimePicker = screen.getByLabelText('End Time');
    expect(startTime).not.toBeNull();
    const startTimePicker = screen.getByLabelText('Start Time');

    fireEvent.change(startTimePicker, {
      target: { value: startTime },
    });
    fireEvent.change(endTimePicker, {
      target: { value: endTime },
    });

    await wait();
    expect(endTimePicker).toHaveValue(endTime);
    expect(startTimePicker).toHaveValue(startTime);
  });

  it('EndDate null', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18nForTest}>
                  <Events />
                </I18nextProvider>
              </ThemeProvider>
            </LocalizationProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('createEventModalBtn'));

    const endDateDatePicker = screen.getByLabelText('End Date');
    const startDateDatePicker = screen.getByLabelText('Start Date');

    fireEvent.change(startDateDatePicker, {
      target: { value: null },
    });
    fireEvent.change(endDateDatePicker, {
      target: { value: null },
    });

    userEvent.click(screen.getByTestId('allDayEventCheck'));

    const endTimePicker = screen.getByLabelText('End Time');
    const startTimePicker = screen.getByLabelText('Start Time');

    fireEvent.change(startTimePicker, {
      target: { value: null },
    });
    fireEvent.change(endTimePicker, {
      target: { value: null },
    });
  });
});
