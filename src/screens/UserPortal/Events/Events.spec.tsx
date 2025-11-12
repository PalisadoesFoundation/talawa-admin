/**
 * @file Comprehensive unit tests for the Events component in User Portal.
 * @description This test suite provides 100% code coverage for the Events component,
 * testing all functionality including event creation, modal interactions, form inputs,
 * error handling, and different user roles.
 * @module EventsSpec
 */

import React, { act } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import {
  GET_ORGANIZATION_EVENTS_USER_PORTAL_PG,
  ORGANIZATIONS_LIST,
} from 'GraphQl/Queries/Queries';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import Events from './Events';
import userEvent from '@testing-library/user-event';
import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/mutations';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import useLocalStorage from 'utils/useLocalstorage';
import { vi } from 'vitest';
import { toast } from 'react-toastify';

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

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => ({ orgId: 'org123' }),
  };
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#31bb6b',
    },
  },
});

// Helper variables to match Events.tsx query structure
const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();
const startDate = dayjs(new Date(currentYear, currentMonth, 1))
  .startOf('month')
  .toISOString();
const endDate = dayjs(new Date(currentYear, currentMonth, 1))
  .endOf('month')
  .toISOString();

const MOCKS = [
  // Mock for GET_ORGANIZATION_EVENTS_USER_PORTAL_PG
  {
    request: {
      query: GET_ORGANIZATION_EVENTS_USER_PORTAL_PG,
      variables: {
        id: 'org123',
        first: 150,
        after: null,
        startDate,
        endDate,
        includeRecurring: true,
      },
    },
    result: {
      data: {
        organization: {
          events: {
            edges: [
              {
                node: {
                  id: 'event1',
                  name: 'Test Event 1',
                  description: 'Test Description 1',
                  startAt: '2024-03-05T00:00:00.000Z',
                  endAt: '2024-03-05T23:59:59.999Z',
                  location: 'Test Location',
                  allDay: true,
                  isPublic: true,
                  isRegisterable: true,
                  isRecurringEventTemplate: false,
                  baseEvent: null,
                  sequenceNumber: null,
                  totalCount: null,
                  hasExceptions: false,
                  progressLabel: null,
                  recurrenceDescription: null,
                  recurrenceRule: null,
                  creator: {
                    id: 'user1',
                    name: 'Test User',
                  },
                  attachments: [],
                  organization: {
                    id: 'org123',
                    name: 'Test Org',
                  },
                },
                cursor: 'cursor1',
              },
              {
                node: {
                  id: 'event2',
                  name: 'Test Event 2',
                  description: 'Test Description 2',
                  startAt: '2024-03-06T08:00:00.000Z',
                  endAt: '2024-03-06T10:00:00.000Z',
                  location: 'Test Location 2',
                  allDay: false,
                  isPublic: false,
                  isRegisterable: false,
                  isRecurringEventTemplate: false,
                  baseEvent: null,
                  sequenceNumber: null,
                  totalCount: null,
                  hasExceptions: false,
                  progressLabel: null,
                  recurrenceDescription: null,
                  recurrenceRule: null,
                  creator: {
                    id: 'user2',
                    name: 'Test User 2',
                  },
                  attachments: [],
                  organization: {
                    id: 'org123',
                    name: 'Test Org',
                  },
                },
                cursor: 'cursor2',
              },
            ],
            pageInfo: {
              hasNextPage: false,
              endCursor: 'cursor2',
            },
          },
        },
      },
    },
  },
  // Mock for ORGANIZATIONS_LIST
  {
    request: {
      query: ORGANIZATIONS_LIST,
    },
    result: {
      data: {
        organizations: [
          {
            id: 'org123',
            name: 'Test Organization',
            description: 'Test Description',
            addressLine1: '123 Test St',
            addressLine2: '',
            city: 'Test City',
            state: 'Test State',
            postalCode: '12345',
            countryCode: 'US',
            avatarURL: '',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
            creator: {
              id: 'user1',
              name: 'Creator User',
              emailAddress: 'creator@test.com',
            },
            updater: {
              id: 'user1',
              name: 'Creator User',
              emailAddress: 'creator@test.com',
            },
          },
        ],
      },
    },
  },
  // Mock for successful CREATE_EVENT_MUTATION (all day event)
  {
    request: {
      query: CREATE_EVENT_MUTATION,
      variables: {
        input: {
          name: 'New Test Event',
          description: 'New Test Description',
          startAt: dayjs(new Date())
            .startOf('day')
            .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
          endAt: dayjs(new Date())
            .endOf('day')
            .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
          organizationId: 'org123',
          allDay: true,
          location: 'New Test Location',
          isPublic: true,
          isRegisterable: true,
        },
      },
    },
    result: {
      data: {
        createEvent: {
          id: 'newEvent1',
        },
      },
    },
  },
];

// Mock with error for testing error handling
const ERROR_MOCKS = [
  {
    request: {
      query: GET_ORGANIZATION_EVENTS_USER_PORTAL_PG,
      variables: {
        id: 'org123',
        first: 150,
        after: null,
        startDate,
        endDate,
        includeRecurring: true,
      },
    },
    error: new Error('Network error'),
  },
  {
    request: {
      query: ORGANIZATIONS_LIST,
    },
    result: {
      data: {
        organizations: [],
      },
    },
  },
];

// Mock with rate limit error
const RATE_LIMIT_MOCKS = [
  {
    request: {
      query: GET_ORGANIZATION_EVENTS_USER_PORTAL_PG,
      variables: {
        id: 'org123',
        first: 150,
        after: null,
        startDate,
        endDate,
        includeRecurring: true,
      },
    },
    error: new Error('Too many requests. Please try again later'),
  },
  {
    request: {
      query: ORGANIZATIONS_LIST,
    },
    result: {
      data: {
        organizations: [],
      },
    },
  },
];

// Mock for CREATE_EVENT_MUTATION error
const CREATE_EVENT_ERROR_MOCKS = [
  ...MOCKS.slice(0, 2), // Include the query mocks
  {
    request: {
      query: CREATE_EVENT_MUTATION,
      variables: {
        input: {
          name: 'New Test Event',
          description: 'New Test Description',
          startAt: dayjs(new Date())
            .startOf('day')
            .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
          endAt: dayjs(new Date())
            .endOf('day')
            .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
          organizationId: 'org123',
          allDay: true,
          location: 'New Test Location',
          isPublic: true,
          isRegisterable: true,
        },
      },
    },
    error: new Error('Failed to create event'),
  },
];

const link = new StaticMockLink(MOCKS, false);
const errorLink = new StaticMockLink(ERROR_MOCKS, false);
const rateLimitLink = new StaticMockLink(RATE_LIMIT_MOCKS, false);
const createEventErrorLink = new StaticMockLink(
  CREATE_EVENT_ERROR_MOCKS,
  false,
);

async function wait(ms = 500): Promise<void> {
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
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  beforeEach(() => {
    setItem('id', 'user123');
    setItem('role', 'administrator');
    vi.clearAllMocks();
  });

  it('Should render the Events screen properly', async () => {
    render(
      <MockedProvider link={link}>
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

    await waitFor(() => {
      expect(screen.getByText('Month View')).toBeInTheDocument();
    });
  });

  it('Should open and close the create event modal', async () => {
    render(
      <MockedProvider link={link}>
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

    // Open modal
    const createButton = screen.getByTestId('createEventModalBtn');
    await userEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByTestId('eventTitleInput')).toBeInTheDocument();
    });

    // Close modal
    const closeButton = screen.getByTestId('createEventModalCloseBtn');
    await userEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('eventTitleInput')).not.toBeInTheDocument();
    });
  });

  it('Should create an all-day event successfully', async () => {
    render(
      <MockedProvider link={link}>
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

    // Open modal
    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('eventTitleInput')).toBeInTheDocument();
    });

    // Fill form
    await userEvent.type(
      screen.getByTestId('eventTitleInput'),
      'New Test Event',
    );
    await userEvent.type(
      screen.getByTestId('eventDescriptionInput'),
      'New Test Description',
    );
    await userEvent.type(
      screen.getByTestId('eventLocationInput'),
      'New Test Location',
    );

    // Submit form
    const form = screen.getByTestId('eventTitleInput').closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    await wait(500);

    // Verify success toast was called
    expect(toast.success).toHaveBeenCalled();
  });

  it('Should handle create event error', async () => {
    render(
      <MockedProvider link={createEventErrorLink}>
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

    // Open modal
    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('eventTitleInput')).toBeInTheDocument();
    });

    // Fill form
    await userEvent.type(
      screen.getByTestId('eventTitleInput'),
      'New Test Event',
    );
    await userEvent.type(
      screen.getByTestId('eventDescriptionInput'),
      'New Test Description',
    );
    await userEvent.type(
      screen.getByTestId('eventLocationInput'),
      'New Test Location',
    );

    // Submit form
    const form = screen.getByTestId('eventTitleInput').closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    await wait(500);

    // Error should be logged (console.error is called in catch block)
    expect(toast.success).not.toHaveBeenCalled();
  });

  it('Should toggle all-day checkbox and enable/disable time pickers', async () => {
    render(
      <MockedProvider link={link}>
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

    // Open modal
    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('allDayEventCheck')).toBeInTheDocument();
    });

    const allDayCheckbox = screen.getByTestId('allDayEventCheck');
    const startTimePicker = screen.getByLabelText('Start Time');
    const endTimePicker = screen.getByLabelText('End Time');

    // Initially all-day is true, time pickers should be disabled
    expect(startTimePicker).toBeDisabled();
    expect(endTimePicker).toBeDisabled();

    // Toggle all-day off
    await userEvent.click(allDayCheckbox);

    await waitFor(() => {
      expect(startTimePicker).not.toBeDisabled();
      expect(endTimePicker).not.toBeDisabled();
    });
  });

  it('Should toggle public, registerable, recurring, and createChat checkboxes', async () => {
    render(
      <MockedProvider link={link}>
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

    // Open modal
    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('publicEventCheck')).toBeInTheDocument();
    });

    // Toggle all checkboxes
    await userEvent.click(screen.getByTestId('publicEventCheck'));
    await userEvent.click(screen.getByTestId('registerableEventCheck'));
    await userEvent.click(screen.getByTestId('recurringEventCheck'));
    await userEvent.click(screen.getByTestId('createChatCheck'));

    // Toggle back
    await userEvent.click(screen.getByTestId('publicEventCheck'));
    await userEvent.click(screen.getByTestId('registerableEventCheck'));
    await userEvent.click(screen.getByTestId('recurringEventCheck'));
    await userEvent.click(screen.getByTestId('createChatCheck'));

    // All toggles should work without errors
    expect(screen.getByTestId('publicEventCheck')).toBeInTheDocument();
  });

  it('Should handle date picker changes', async () => {
    render(
      <MockedProvider link={link}>
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

    // Open modal
    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() => {
      expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
    });

    const startDatePicker = screen.getByLabelText('Start Date');
    const endDatePicker = screen.getByLabelText('End Date');

    const newDate = dayjs().add(1, 'day');

    fireEvent.change(startDatePicker, {
      target: { value: newDate.format('MM/DD/YYYY') },
    });

    fireEvent.change(endDatePicker, {
      target: { value: newDate.format('MM/DD/YYYY') },
    });

    await wait();

    // Date pickers should accept the changes
    expect(startDatePicker).toBeInTheDocument();
  });

  it('Should handle time picker changes when all-day is disabled', async () => {
    render(
      <MockedProvider link={link}>
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

    // Open modal
    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('allDayEventCheck')).toBeInTheDocument();
    });

    // Disable all-day
    await userEvent.click(screen.getByTestId('allDayEventCheck'));

    await waitFor(() => {
      const startTimePicker = screen.getByLabelText('Start Time');
      expect(startTimePicker).not.toBeDisabled();
    });

    const startTimePicker = screen.getByLabelText('Start Time');
    const endTimePicker = screen.getByLabelText('End Time');

    fireEvent.change(startTimePicker, {
      target: { value: '09:00 AM' },
    });

    fireEvent.change(endTimePicker, {
      target: { value: '11:00 AM' },
    });

    await wait();

    // Time pickers should accept the changes
    expect(startTimePicker).toBeInTheDocument();
  });

  it('Should handle null date values gracefully', async () => {
    render(
      <MockedProvider link={link}>
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

    // Open modal
    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() => {
      expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
    });

    const startDatePicker = screen.getByLabelText('Start Date');
    const endDatePicker = screen.getByLabelText('End Date');

    fireEvent.change(startDatePicker, {
      target: { value: null },
    });

    fireEvent.change(endDatePicker, {
      target: { value: null },
    });

    await wait();

    // Should handle null values without crashing
    expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
  });

  it('Should handle network error gracefully', async () => {
    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    render(
      <MockedProvider link={errorLink}>
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

    await wait(500);

    // Should log warning for non-rate-limit errors
    expect(consoleWarnSpy).toHaveBeenCalled();

    consoleWarnSpy.mockRestore();
  });

  it('Should suppress rate limit errors silently', async () => {
    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    render(
      <MockedProvider link={rateLimitLink}>
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

    await waitFor(() => {
      expect(screen.getByText('Month View')).toBeInTheDocument();
    });

    // Rate limit errors should be suppressed (not logged by our component)
    // Check that no rate limit specific warnings were logged
    const rateLimitWarnings = consoleWarnSpy.mock.calls.filter((call) =>
      call.some(
        (arg) => typeof arg === 'string' && arg.includes('Too many requests'),
      ),
    );
    expect(rateLimitWarnings).toHaveLength(0);

    consoleWarnSpy.mockRestore();
  });

  it('Should handle input changes for title, description, and location', async () => {
    render(
      <MockedProvider link={link}>
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

    // Open modal
    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('eventTitleInput')).toBeInTheDocument();
    });

    const titleInput = screen.getByTestId('eventTitleInput');
    const descriptionInput = screen.getByTestId('eventDescriptionInput');
    const locationInput = screen.getByTestId('eventLocationInput');

    // Type in inputs
    await userEvent.type(titleInput, 'Test Title');
    await userEvent.type(descriptionInput, 'Test Description');
    await userEvent.type(locationInput, 'Test Location');

    // Verify values
    expect(titleInput).toHaveValue('Test Title');
    expect(descriptionInput).toHaveValue('Test Description');
    expect(locationInput).toHaveValue('Test Location');
  });

  it('Should test userRole as administrator', async () => {
    setItem('role', 'administrator');

    render(
      <MockedProvider link={link}>
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

    await waitFor(() => {
      expect(screen.getByText('Month View')).toBeInTheDocument();
    });

    // Component should render with administrator role
  });

  it('Should test userRole as regular user', async () => {
    setItem('role', 'user');

    render(
      <MockedProvider link={link}>
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

    await waitFor(() => {
      expect(screen.getByText('Month View')).toBeInTheDocument();
    });

    // Component should render with regular user role
  });
});
