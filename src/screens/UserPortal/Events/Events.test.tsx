import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
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

const { setItem, getItem } = useLocalStorage();

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    info: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock('@mui/x-date-pickers/DatePicker', () => {
  return {
    DatePicker: jest.requireActual('@mui/x-date-pickers/DesktopDatePicker')
      .DesktopDatePicker,
  };
});

jest.mock('@mui/x-date-pickers/TimePicker', () => {
  return {
    TimePicker: jest.requireActual('@mui/x-date-pickers/DesktopTimePicker')
      .DesktopTimePicker,
  };
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ orgId: '' }),
}));

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
            startTime: '00:40:00.000Z',
            endTime: '02:40:00.000Z',
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
        startTime: '08:00:00Z',
        endTime: '10:00:00Z',
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
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  test('Screen should be rendered properly', async () => {
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

  test('Create event works as expected when event is not an all day event.', async () => {
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

    expect(toast.success).toBeCalledWith(
      'Event created and posted successfully.',
    );
  });

  test('Create event works as expected when event is an all day event.', async () => {
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

    expect(toast.success).toBeCalledWith(
      'Event created and posted successfully.',
    );
  });

  test('Switch to calendar view works as expected.', async () => {
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

  test('Testing DatePicker and TimePicker', async () => {
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

    const startDate = '03/23/2024';
    const endDate = '04/23/2024';
    const startTime = '02:00 PM';
    const endTime = '06:00 PM';

    userEvent.click(screen.getByTestId('createEventModalBtn'));

    expect(endDate).not.toBeNull();
    const endDateDatePicker = screen.getByLabelText('End Date');
    expect(startDate).not.toBeNull();
    const startDateDatePicker = screen.getByLabelText('Start Date');

    fireEvent.change(startDateDatePicker, {
      target: { value: startDate },
    });
    fireEvent.change(endDateDatePicker, {
      target: { value: endDate },
    });

    await wait();

    expect(endDateDatePicker).toHaveValue(endDate);
    expect(startDateDatePicker).toHaveValue(startDate);

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

  test('EndDate null', async () => {
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
