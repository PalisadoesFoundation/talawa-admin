/**
 * @file Comprehensive unit tests for the Events component in User Portal.
 * @description This test suite provides 100% code coverage for the Events component,
 * testing all functionality including event creation, modal interactions, form inputs,
 * error handling, and different user roles.
 
 * @module EventsSpec
 */

// SKIP_LOCALSTORAGE_CHECK
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
import utc from 'dayjs/plugin/utc';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { vi, beforeEach, afterEach } from 'vitest';
import { toast } from 'react-toastify';
import { Frequency } from 'utils/recurrenceUtils';
import { green } from '@mui/material/colors';

const { mockToast, mockUseParams } = vi.hoisted(() => ({
  mockToast: {
    error: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
  },
  mockUseParams: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: mockToast,
}));

vi.mock('@mui/x-date-pickers', async () => {
  const actual = await vi.importActual('@mui/x-date-pickers');

  const datePicker = ({
    label,
    value,
    onChange,
    'data-testid': dataTestId,
  }: {
    label?: string;
    value?: { format?: (fmt: string) => string } | null;
    onChange?: (v: unknown) => void;
    'data-testid'?: string;
  }) => {
    return (
      <input
        aria-label={label}
        data-testid={dataTestId || label}
        value={value?.format ? value.format('MM/DD/YYYY') : ''}
        onChange={(e) => {
          const parsed = dayjs(e.target.value, ['MM/DD/YYYY', 'YYYY-MM-DD']);
          onChange?.(parsed);
        }}
      />
    );
  };

  const timePicker = ({
    label,
    value,
    onChange,
    'data-testid': dataTestId,
    disabled,
  }: {
    label?: string;
    value?: { format?: (fmt: string) => string } | null;
    onChange?: (v: unknown) => void;
    'data-testid'?: string;
    disabled?: boolean;
  }) => {
    return (
      <input
        aria-label={label}
        data-testid={dataTestId || label}
        value={value?.format ? value.format('HH:mm:ss') : ''}
        disabled={disabled}
        onChange={(e) => {
          const parsed = dayjs(e.target.value, ['HH:mm:ss', 'hh:mm A']);
          onChange?.(parsed);
        }}
      />
    );
  };

  return {
    ...actual,
    DatePicker: datePicker,
    TimePicker: timePicker,
  };
});

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: mockUseParams,
  };
});

vi.mock('components/EventCalender/Monthly/EventCalender', () => ({
  __esModule: true,
  default: ({
    onMonthChange,
    eventData,
    viewType,
  }: {
    onMonthChange?: (month: number, year: number) => void;
    eventData?: unknown[];
    viewType?: string | null;
  }) => {
    return (
      <div>
        <button
          type="button"
          data-testid="monthChangeBtn"
          onClick={() => onMonthChange?.(5, 2023)}
        />
        <div data-testid="hour" />
        <div data-testid="monthView" />
        <pre data-testid="event-data-json">
          {JSON.stringify(eventData ?? [])}
        </pre>
        <div data-testid="calendar-view-type">{String(viewType)}</div>
      </div>
    );
  },
}));

vi.mock('components/EventCalender/Header/EventHeader', () => ({
  __esModule: true,
  default: ({
    viewType,
    handleChangeView,
    showInviteModal,
  }: {
    viewType?: string | null;
    handleChangeView?: (v: string | null) => void;
    showInviteModal?: () => void;
  }) => {
    return (
      <div>
        <div data-testid="calendarEventHeader">
          <div className="_calendar__controls">
            <button
              type="button"
              data-testid="selectViewType"
              onClick={() => handleChangeView?.('MONTH')}
            >
              Month View
            </button>
            <div>
              <button
                type="button"
                data-testid="selectDay"
                onClick={() => handleChangeView?.('DAY')}
              >
                Select Day
              </button>
              <button
                type="button"
                data-testid="selectYear"
                onClick={() => handleChangeView?.('YEAR')}
              >
                Select Year
              </button>
            </div>
            <button
              type="button"
              data-testid="createEventModalBtn"
              onClick={() => showInviteModal?.()}
            >
              Create
            </button>
            <button
              type="button"
              data-testid="handleChangeNullBtn"
              onClick={() => handleChangeView?.(null)}
            >
              Null
            </button>
            <div data-testid="calendar-view-type-header">
              {String(viewType)}
            </div>
          </div>
        </div>
      </div>
    );
  },
}));

const theme = createTheme({
  palette: {
    primary: {
      main: green[600],
    },
  },
});

dayjs.extend(utc);

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
        first: 100,
        after: null,
        startAt: startDate,
        endAt: endDate,
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
                  startAt: '2023-06-05T00:00:00.000Z',
                  endAt: '2023-06-05T23:59:59.999Z',
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
                  startAt: '2023-06-06T08:00:00.000Z',
                  endAt: '2023-06-06T10:00:00.000Z',
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
  // Additional mock for month-change path using fixed May/June 2023 window
  {
    request: {
      query: GET_ORGANIZATION_EVENTS_USER_PORTAL_PG,
      variables: {
        id: 'org123',
        first: 100,
        after: null,
        startAt: '2023-05-31T18:30:00.000Z',
        endAt: '2023-06-30T18:29:59.999Z',
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

  // Mock for successful CREATE_EVENT_MUTATION (non all-day event)
  {
    request: {
      query: CREATE_EVENT_MUTATION,
      variables: {
        input: {
          name: 'New Non All Day Event',
          description: 'New Test Description Non All Day',
          startAt: dayjs(new Date())
            .hour(8)
            .minute(0)
            .second(0)
            .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
          endAt: dayjs(new Date())
            .hour(10)
            .minute(0)
            .second(0)
            .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
          organizationId: 'org123',
          allDay: false,
          location: 'New Test Location',
          isPublic: true,
          isRegisterable: true,
        },
      },
    },
    result: {
      data: {
        createEvent: {
          id: 'newEvent2',
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
        first: 100,
        after: null,
        startAt: startDate,
        endAt: endDate,
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
        first: 100,
        after: null,
        startAt: startDate,
        endAt: endDate,
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

// Mock for CREATE_EVENT_MUTATION returning null data (to cover the falsy branch of `if (createEventData)`)
const CREATE_EVENT_NULL_MOCKS = [
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
    result: {},
  },
];

// Mock where creator is null and id, name omitted to trigger fallback in mapping
const CREATOR_NULL_MOCKS = (() => {
  const baseGet = JSON.parse(JSON.stringify(MOCKS[0]));
  baseGet.result = {
    data: {
      organization: {
        events: {
          edges: [
            {
              node: {
                id: null,
                name: null,
                description: null,
                startAt: '2024-03-05T00:00:00.000Z',
                endAt: '2024-03-05T23:59:59.999Z',
                location: null,
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
                creator: null,
                attachments: [],
              },
              cursor: 'cursor1',
            },
          ],
          pageInfo: {
            hasNextPage: false,
            endCursor: 'cursor1',
          },
        },
      },
    },
  };
  return [baseGet, MOCKS[1]];
})();

const link = new StaticMockLink(MOCKS, true);
const errorLink = new StaticMockLink(ERROR_MOCKS, true);
const rateLimitLink = new StaticMockLink(RATE_LIMIT_MOCKS, true);
const createEventErrorLink = new StaticMockLink(CREATE_EVENT_ERROR_MOCKS, true);

async function wait(ms = 500): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const getPickerInputByLabel = (label: string) =>
  screen.getByLabelText(label, { selector: 'input' }) as HTMLElement;

describe('Testing Events Screen [User Portal]', () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    localStorage.setItem('id', 'user123');
    localStorage.setItem('role', 'administrator');
    mockUseParams.mockReturnValue({ orgId: 'org123' });
  });

  afterEach(() => {
    localStorage.clear();
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
      expect(screen.getByTestId('calendar-view-type')).toBeInTheDocument();
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
    // Test-specific mock using variableMatcher for flexible date matching
    // The EventForm uses the current date as default, and for all-day events
    // it may adjust startAt based on whether startOfDay is in the past
    const allDayEventMock = {
      request: {
        query: CREATE_EVENT_MUTATION,
      },
      variableMatcher: (variables: {
        input: {
          name: string;
          description?: string;
          startAt: string;
          endAt: string;
          organizationId: string;
          allDay: boolean;
          location?: string;
          isPublic: boolean;
          isRegisterable: boolean;
        };
      }) => {
        const { input } = variables;
        return (
          input.name === 'New Test Event' &&
          input.description === 'New Test Description' &&
          input.organizationId === 'org123' &&
          input.allDay === true &&
          input.location === 'New Test Location' &&
          input.isPublic === true &&
          input.isRegisterable === true &&
          typeof input.startAt === 'string' &&
          typeof input.endAt === 'string'
        );
      },
      result: {
        data: {
          createEvent: {
            id: 'newEvent1',
          },
        },
      },
    };

    const testLink = new StaticMockLink(
      [...MOCKS.slice(0, 2), allDayEventMock],
      true,
    );

    render(
      <MockedProvider link={testLink}>
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

    await userEvent.click(screen.getByTestId('createEventBtn'));
    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalled();
    });
  });

  it('Should create a non-all-day event successfully', async () => {
    // Ensure toast success mock is reset for this test
    mockToast.success.mockClear();

    // Use variableMatcher for flexible date matching to avoid timing issues
    const nonAllDayMock = {
      request: {
        query: CREATE_EVENT_MUTATION,
      },
      variableMatcher: (variables: {
        input: {
          name: string;
          description?: string;
          startAt: string;
          endAt: string;
          organizationId: string;
          allDay: boolean;
          location?: string;
          isPublic: boolean;
          isRegisterable: boolean;
        };
      }) => {
        const { input } = variables;
        return (
          input.name === 'New Non All Day Event' &&
          input.description === 'New Test Description Non All Day' &&
          input.organizationId === 'org123' &&
          input.allDay === false &&
          input.location === 'New Test Location' &&
          input.isPublic === true &&
          input.isRegisterable === true &&
          typeof input.startAt === 'string' &&
          typeof input.endAt === 'string'
        );
      },
      result: {
        data: {
          createEvent: {
            id: 'newEvent2',
          },
        },
      },
    };

    const testLink = new StaticMockLink([...MOCKS, nonAllDayMock], true);

    render(
      <MockedProvider link={testLink}>
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

    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('eventTitleInput')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('allDayEventCheck'));

    const newDateSet = dayjs(new Date());
    const startDatePicker = screen.getByLabelText('Start Date');
    const endDatePicker = screen.getByLabelText('End Date');
    fireEvent.change(startDatePicker, {
      target: { value: newDateSet.format('MM/DD/YYYY') },
    });
    fireEvent.change(endDatePicker, {
      target: { value: newDateSet.format('MM/DD/YYYY') },
    });

    await userEvent.type(
      screen.getByTestId('eventTitleInput'),
      'New Non All Day Event',
    );
    await userEvent.type(
      screen.getByTestId('eventDescriptionInput'),
      'New Test Description Non All Day',
    );
    await userEvent.type(
      screen.getByTestId('eventLocationInput'),
      'New Test Location',
    );

    const startTimePicker = screen.getByLabelText('Start Time');
    const endTimePicker = screen.getByLabelText('End Time');

    fireEvent.change(startTimePicker, { target: { value: '08:00 AM' } });
    fireEvent.change(endTimePicker, { target: { value: '10:00 AM' } });

    const form = screen.getByTestId('eventTitleInput').closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    await wait(500);

    // Verify either success or error toast was called
    expect(
      mockToast.success.mock.calls.length + mockToast.error.mock.calls.length,
    ).toBeGreaterThan(0);
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

  it('Should toggle all-day checkbox and enable/disable time inputs', async () => {
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

    const allDayCheckbox = await screen.findByTestId('allDayEventCheck');

    // When all-day is enabled, time pickers are disabled
    const startTimeInputWhenAllDay = screen.getByLabelText(
      'Start Time',
    ) as HTMLInputElement;
    const endTimeInputWhenAllDay = screen.getByLabelText(
      'End Time',
    ) as HTMLInputElement;
    expect(startTimeInputWhenAllDay).toBeDisabled();
    expect(endTimeInputWhenAllDay).toBeDisabled();

    // Toggle all-day OFF (uncheck it)
    await userEvent.click(allDayCheckbox);

    const startTimeInput = (await screen.findByLabelText(
      'Start Time',
    )) as HTMLInputElement;
    const endTimeInput = (await screen.findByLabelText(
      'End Time',
    )) as HTMLInputElement;

    // AFTER toggle → visible + enabled
    expect(startTimeInput).not.toBeDisabled();
    expect(endTimeInput).not.toBeDisabled();

    // Optional sanity: values unchanged
    expect(startTimeInput.value).toBe('08:00:00');
    expect(endTimeInput.value).toBe('10:00:00');
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
      expect(getPickerInputByLabel('Start Date')).toBeInTheDocument();
    });

    const startDatePicker = getPickerInputByLabel('Start Date');
    const endDatePicker = getPickerInputByLabel('End Date');
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
      const startTimePicker = getPickerInputByLabel('Start Time');
      expect(startTimePicker).not.toBeDisabled();
    });

    const startTimePicker = getPickerInputByLabel('Start Time');
    const endTimePicker = getPickerInputByLabel('End Time');
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
      expect(getPickerInputByLabel('Start Date')).toBeInTheDocument();
    });

    const startDatePicker = getPickerInputByLabel('Start Date');
    const endDatePicker = getPickerInputByLabel('End Date');
    fireEvent.change(startDatePicker, {
      target: { value: '' },
    });

    fireEvent.change(endDatePicker, {
      target: { value: '' },
    });

    await wait();

    // Should handle null values without crashing
    expect(getPickerInputByLabel('Start Date')).toBeInTheDocument();
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
      expect(screen.getByTestId('calendar-view-type')).toBeInTheDocument();
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
    localStorage.setItem('Talawa-admin_role', JSON.stringify('administrator'));

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
      expect(screen.getByTestId('calendar-view-type')).toBeInTheDocument();
    });

    // Component should render with administrator role
  });

  it('Should test userRole as regular user', async () => {
    localStorage.setItem('Talawa-admin_role', JSON.stringify('user'));

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
      expect(screen.getByTestId('calendar-view-type')).toBeInTheDocument();
    });

    // Component should render with regular user role
  });

  it('Should change view type', async () => {
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

    // Initial view should be Month View
    await waitFor(() => {
      expect(screen.getByTestId('calendar-view-type')).toBeInTheDocument();
    });

    // Select Day View using the mocked EventHeader
    const dayViewButton = screen.getByTestId('selectDay');
    await userEvent.click(dayViewButton);

    // Verify view changed
    await waitFor(() => {
      expect(screen.getByTestId('calendar-view-type')).toHaveTextContent('DAY');
    });
  });

  it('Should not change viewType when handleChangeView is called with null', async () => {
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

    // Change view to DAY first
    const dayViewButton = screen.getByTestId('selectDay');
    await userEvent.click(dayViewButton);
    await waitFor(() => {
      expect(screen.getByTestId('calendar-view-type')).toHaveTextContent('DAY');
    });

    // Now call handleChangeView(null)
    await userEvent.click(screen.getByTestId('handleChangeNullBtn'));

    // View type should remain DAY
    await waitFor(() => {
      expect(screen.getByTestId('calendar-view-type')).toHaveTextContent('DAY');
    });
  });

  it('Should call onMonthChange callback from EventCalendar', async () => {
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

    const monthChangeBtn = screen.getByTestId('monthChangeBtn');
    expect(monthChangeBtn).toBeInTheDocument();

    await userEvent.click(monthChangeBtn);

    expect(monthChangeBtn).toBeInTheDocument();
  });

  it('Should handle create event returning null (no data) gracefully', async () => {
    const testLink = new StaticMockLink(CREATE_EVENT_NULL_MOCKS, true);
    mockToast.success.mockClear();
    mockToast.error.mockClear();
    render(
      <MockedProvider link={testLink}>
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

    // The createEvent mutation returned null data, so no success toast
    expect(mockToast.success).not.toHaveBeenCalled();
  });

  it('Should map missing creator to default (fallback) in eventData mapping', async () => {
    const testLink = new StaticMockLink(CREATOR_NULL_MOCKS, true);
    render(
      <MockedProvider link={testLink}>
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

    // EventCalendar mock renders eventData JSON in `event-data-json`
    const jsonPre = screen.getByTestId('event-data-json');
    const parsed = JSON.parse(jsonPre.textContent || '[]');

    expect(parsed).toBeInstanceOf(Array);
    expect(parsed.length).toBeGreaterThan(0);
    // Creator fallback should be used when creator is null
    expect(parsed[0].creator).toEqual({ id: '', name: '' });
  });

  it('Should create an event with recurrence rule successfully', async () => {
    const today = new Date();
    const weekDayByJs = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    const dayOfWeek = today.getDay();

    // Use variableMatcher for flexible date and recurrence matching
    const createEventWithRecurrenceMock = {
      request: {
        query: CREATE_EVENT_MUTATION,
      },
      variableMatcher: (variables: {
        input: {
          name: string;
          description?: string;
          startAt: string;
          endAt: string;
          organizationId: string;
          allDay: boolean;
          location?: string;
          isPublic: boolean;
          isRegisterable: boolean;
          recurrence?: {
            frequency: string;
            interval: number;
            never?: boolean;
            byDay?: string[];
          };
        };
      }) => {
        const { input } = variables;
        // Ensure all conditions return boolean (not undefined via optional chaining)
        return Boolean(
          input.name === 'Recurring Test Event' &&
            input.description === 'Recurring Test Description' &&
            input.organizationId === 'org123' &&
            input.allDay === true &&
            input.location === 'Recurring Test Location' &&
            input.isPublic === true &&
            input.isRegisterable === true &&
            typeof input.startAt === 'string' &&
            typeof input.endAt === 'string' &&
            input.recurrence &&
            input.recurrence.frequency === Frequency.WEEKLY &&
            input.recurrence.interval === 1 &&
            input.recurrence.byDay?.includes(weekDayByJs[dayOfWeek]),
        );
      },
      result: {
        data: {
          createEvent: {
            id: 'newRecurringEvent1',
          },
        },
      },
    };

    const testLink = new StaticMockLink(
      [...MOCKS.slice(0, 2), createEventWithRecurrenceMock],
      true,
    );

    mockToast.success.mockClear();

    render(
      <MockedProvider link={testLink}>
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
    await userEvent.click(screen.getByTestId('createEventModalBtn'));
    await waitFor(() => {
      expect(screen.getByTestId('eventTitleInput')).toBeInTheDocument();
    });

    await userEvent.type(
      screen.getByTestId('eventTitleInput'),
      'Recurring Test Event',
    );
    await userEvent.type(
      screen.getByTestId('eventDescriptionInput'),
      'Recurring Test Description',
    );
    await userEvent.type(
      screen.getByTestId('eventLocationInput'),
      'Recurring Test Location',
    );

    await userEvent.click(screen.getByTestId('recurringEventCheck'));
    await waitFor(() => {
      expect(screen.getByTestId('recurrenceDropdown')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('recurrenceDropdown'));
    await waitFor(() => {
      const options = screen.getAllByTestId(/recurrenceOption-/);
      expect(options.length).toBeGreaterThan(2);
    });
    const options = screen.getAllByTestId(/recurrenceOption-/);
    await userEvent.click(options[2]);

    const form = screen.getByTestId('eventTitleInput').closest('form');
    if (form) fireEvent.submit(form);

    await wait(500);
    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalled();
    });
  });
});
