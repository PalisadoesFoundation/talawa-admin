/**
 * Comprehensive unit tests for the Events component in the User Portal.
 *
 * This test suite provides 100% code coverage for the Events component by
 * validating event creation, modal interactions, form inputs, error handling,
 * and behavior across different user roles.
 */

// SKIP_LOCALSTORAGE_CHECK
import React, { act } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { InMemoryCache } from '@apollo/client';
import { I18nextProvider } from 'react-i18next';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { computeCalendarFromStartDate } from './Events';
dayjs.extend(utc);
dayjs.extend(customParseFormat);

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
import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/EventMutations';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { vi, beforeEach, afterEach } from 'vitest';
import { Frequency } from 'utils/recurrenceUtils';
import { green } from '@mui/material/colors';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

const { mockToast, mockUseParams } = vi.hoisted(() => ({
  mockToast: {
    error: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
  },
  mockUseParams: vi.fn(),
}));

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: mockToast,
}));

vi.mock('shared-components/DatePicker', () => ({
  __esModule: true,
  default: (props: {
    label: string;
    value: dayjs.Dayjs | null;
    onChange: (value: dayjs.Dayjs | null) => void;
    disabled?: boolean;
    slotProps?: { textField?: { 'aria-label'?: string } };
    'data-testid'?: string;
  }) => {
    const { label, value, onChange, slotProps } = props;
    const testId = props['data-testid'];
    const ariaLabel = slotProps?.textField?.['aria-label'] || label;

    return (
      <input
        aria-label={ariaLabel}
        data-testid={testId || 'date-picker'}
        type="text"
        disabled={props.disabled}
        value={value ? dayjs(value).format('MM/DD/YYYY') : ''}
        onChange={(e) => {
          const val = e.target.value;
          onChange(val ? dayjs(val, ['MM/DD/YYYY', 'YYYY-MM-DD']) : null);
        }}
      />
    );
  },
}));

vi.mock('shared-components/TimePicker', () => ({
  __esModule: true,
  default: (props: {
    label: string;
    value: dayjs.Dayjs | null;
    onChange: (value: dayjs.Dayjs | null) => void;
    disabled?: boolean;
    slotProps?: { textField?: { 'aria-label'?: string } };
    'data-testid'?: string;
  }) => {
    const { label, value, onChange, slotProps } = props;
    const testId = props['data-testid'];
    const ariaLabel = slotProps?.textField?.['aria-label'] || label;

    return (
      <input
        aria-label={ariaLabel}
        data-testid={testId || 'time-picker'}
        type="text"
        disabled={props.disabled}
        value={value ? dayjs(value).format('HH:mm:ss') : ''}
        onChange={(e) => {
          const val = e.target.value;
          onChange(val ? dayjs(val, ['hh:mm A', 'HH:mm:ss']) : null);
        }}
      />
    );
  },
}));

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
        startDate: startDate,
        endDate: endDate,
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
                  startAt: dayjs()
                    .subtract(7, 'months')
                    .date(5)
                    .startOf('day')
                    .toISOString(),
                  endAt: dayjs()
                    .subtract(7, 'months')
                    .date(5)
                    .endOf('day')
                    .toISOString(),
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
                  startAt: dayjs()
                    .subtract(7, 'months')
                    .date(6)
                    .hour(8)
                    .minute(0)
                    .second(0)
                    .toISOString(),
                  endAt: dayjs()
                    .subtract(7, 'months')
                    .date(6)
                    .hour(10)
                    .minute(0)
                    .second(0)
                    .toISOString(),
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
        startDate: dayjs()
          .subtract(1, 'year')
          .month(4)
          .endOf('month')
          .subtract(1, 'day')
          .toISOString(),
        endDate: dayjs()
          .subtract(1, 'year')
          .month(5)
          .endOf('month')
          .toISOString(),
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
                  startAt: dayjs()
                    .month(2)
                    .date(5)
                    .startOf('day')
                    .toISOString(),
                  endAt: dayjs().month(2).date(5).endOf('day').toISOString(),
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
                  startAt: dayjs()
                    .month(2)
                    .date(6)
                    .hour(8)
                    .minute(0)
                    .second(0)
                    .toISOString(),
                  endAt: dayjs()
                    .month(2)
                    .date(6)
                    .hour(10)
                    .minute(0)
                    .second(0)
                    .toISOString(),
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
            createdAt: dayjs().toISOString(),
            updatedAt: dayjs().toISOString(),
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
          isInviteOnly: false,
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
        startDate: startDate,
        endDate: endDate,
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
        startDate: startDate,
        endDate: endDate,
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
          isInviteOnly: false,
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
          isInviteOnly: false,
        },
      },
    },
    result: {},
  },
];

// Mock where creator is null and id, name omitted to trigger fallback in mapping
const CREATOR_NULL_MOCKS = (() => {
  const mockStartDate = dayjs().startOf('month').startOf('day').toISOString();

  const mockEndDate = dayjs().endOf('month').endOf('day').toISOString();

  return [
    {
      request: {
        query: GET_ORGANIZATION_EVENTS_USER_PORTAL_PG,
        variables: {
          id: 'org123',
          first: 100,
          after: null,
          startDate: mockStartDate,
          endDate: mockEndDate,
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
                    id: null,
                    name: null,
                    description: null,
                    startAt: dayjs()
                      .startOf('month')
                      .startOf('day')
                      .toISOString(),
                    endAt: dayjs().endOf('month').endOf('day').toISOString(),
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
                    organization: {
                      id: 'org123',
                      name: 'Test Org',
                    },
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
      },
    },
    MOCKS[1],
  ];
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

describe('Testing Events Screen [User Portal]', () => {
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
    const cache = new InMemoryCache();
    render(
      <MockedProvider link={link} cache={cache}>
        <BrowserRouter>
          <Provider store={store}>
            <>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18nForTest}>
                  <Events />
                </I18nextProvider>
              </ThemeProvider>
            </>
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
    const cache = new InMemoryCache();
    render(
      <MockedProvider link={link} cache={cache}>
        <BrowserRouter>
          <Provider store={store}>
            <>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18nForTest}>
                  <Events />
                </I18nextProvider>
              </ThemeProvider>
            </>
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
          isInviteOnly: boolean;
        };
      }) => {
        const { input } = variables;
        return (
          input.name === 'New Test Event' &&
          input.description === 'New Test Description' &&
          input.organizationId === 'org123' &&
          input.allDay === true &&
          input.location === 'New Test Location' &&
          input.isPublic === false &&
          input.isRegisterable === true &&
          input.isInviteOnly === true &&
          typeof input.startAt === 'string' &&
          typeof input.endAt === 'string'
        );
      },
      result: {
        data: {
          createEvent: {
            id: 'newEvent1',
            name: 'New Test Event',
            description: 'New Test Description',
            startAt: new Date().toISOString(),
            endAt: new Date().toISOString(),
            allDay: true,
            location: 'New Test Location',
            isPublic: true,
            isRegisterable: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isRecurringEventTemplate: false,
            hasExceptions: false,
            sequenceNumber: null,
            totalCount: null,
            progressLabel: null,
            attachments: [],
            creator: {
              id: 'user1',
              name: 'Test User',
            },
            organization: {
              id: 'org123',
              name: 'Test Org',
            },
            baseEvent: null,
          },
        },
      },
    };

    const testLink = new StaticMockLink(
      [...MOCKS.slice(0, 2), allDayEventMock],
      true,
    );

    const cache = new InMemoryCache();
    render(
      <MockedProvider link={testLink} cache={cache}>
        <BrowserRouter>
          <Provider store={store}>
            <>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18nForTest}>
                  <Events />
                </I18nextProvider>
              </ThemeProvider>
            </>
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
          isInviteOnly: boolean;
        };
      }) => {
        const { input } = variables;
        return (
          input.name === 'New Non All Day Event' &&
          input.description === 'New Test Description Non All Day' &&
          input.organizationId === 'org123' &&
          input.allDay === false &&
          input.location === 'New Test Location' &&
          input.isPublic === false &&
          input.isRegisterable === true &&
          input.isInviteOnly === true &&
          typeof input.startAt === 'string' &&
          typeof input.endAt === 'string'
        );
      },
      result: {
        data: {
          createEvent: {
            id: 'newEvent2',
            name: 'New Non All Day Event',
            description: 'New Test Description Non All Day',
            startAt: new Date().toISOString(),
            endAt: new Date().toISOString(),
            allDay: false,
            location: 'New Test Location',
            isPublic: true,
            isRegisterable: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isRecurringEventTemplate: false,
            hasExceptions: false,
            sequenceNumber: null,
            totalCount: null,
            progressLabel: null,
            attachments: [],
            creator: {
              id: 'user1',
              name: 'Test User',
            },
            organization: {
              id: 'org123',
              name: 'Test Org',
            },
            baseEvent: null,
          },
        },
      },
    };

    const testLink = new StaticMockLink([...MOCKS, nonAllDayMock], true);

    const cache = new InMemoryCache();
    render(
      <MockedProvider link={testLink} cache={cache}>
        <BrowserRouter>
          <Provider store={store}>
            <>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18nForTest}>
                  <Events />
                </I18nextProvider>
              </ThemeProvider>
            </>
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
    const startDatePicker = screen.getByTestId(
      'eventStartAt',
    ) as HTMLInputElement;
    const endDatePicker = screen.getByTestId('eventEndAt') as HTMLInputElement;
    fireEvent.change(startDatePicker, {
      target: { value: newDateSet.format('YYYY-MM-DD') },
    });
    fireEvent.change(endDatePicker, {
      target: { value: newDateSet.format('YYYY-MM-DD') },
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
    fireEvent.change(startTimePicker, {
      target: { value: '09:00:00' },
    });
    fireEvent.change(endTimePicker, {
      target: { value: '11:00:00' },
    });

    const form = screen.getByTestId('eventTitleInput').closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    await wait(500);

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalled();
    });
  });

  it('Should handle create event error', async () => {
    const cache = new InMemoryCache();
    render(
      <MockedProvider link={createEventErrorLink} cache={cache}>
        <BrowserRouter>
          <Provider store={store}>
            <>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18nForTest}>
                  <Events />
                </I18nextProvider>
              </ThemeProvider>
            </>
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
    expect(NotificationToast.success).not.toHaveBeenCalled();
  });

  it('Should toggle all-day checkbox and enable/disable time inputs', async () => {
    const cache = new InMemoryCache();
    render(
      <MockedProvider link={link} cache={cache}>
        <BrowserRouter>
          <Provider store={store}>
            <>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18nForTest}>
                  <Events />
                </I18nextProvider>
              </ThemeProvider>
            </>
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
    const cache = new InMemoryCache();
    render(
      <MockedProvider link={link} cache={cache}>
        <BrowserRouter>
          <Provider store={store}>
            <>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18nForTest}>
                  <Events />
                </I18nextProvider>
              </ThemeProvider>
            </>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    // Open modal
    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('visibilityPublicRadio')).toBeInTheDocument();
    });

    // Test visibility radio buttons
    await userEvent.click(screen.getByTestId('visibilityOrgRadio'));
    await userEvent.click(screen.getByTestId('visibilityInviteRadio'));
    await userEvent.click(screen.getByTestId('visibilityPublicRadio'));

    // Toggle other checkboxes
    await userEvent.click(screen.getByTestId('registerableEventCheck'));
    await userEvent.click(screen.getByTestId('recurringEventCheck'));
    await userEvent.click(screen.getByTestId('createChatCheck'));

    // Toggle back
    await userEvent.click(screen.getByTestId('registerableEventCheck'));
    await userEvent.click(screen.getByTestId('recurringEventCheck'));
    await userEvent.click(screen.getByTestId('createChatCheck'));

    // All toggles should work without errors
    expect(screen.getByTestId('visibilityPublicRadio')).toBeInTheDocument();
  });

  it('Should handle date picker changes', async () => {
    const cache = new InMemoryCache();
    render(
      <MockedProvider link={link} cache={cache}>
        <BrowserRouter>
          <Provider store={store}>
            <>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18nForTest}>
                  <Events />
                </I18nextProvider>
              </ThemeProvider>
            </>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    // Open modal
    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('eventStartAt')).toBeInTheDocument();
    });

    const startDatePicker = screen.getByTestId(
      'eventStartAt',
    ) as HTMLInputElement;
    const endDatePicker = screen.getByTestId('eventEndAt') as HTMLInputElement;
    const newDate = dayjs().add(1, 'day');

    fireEvent.change(startDatePicker, {
      target: { value: newDate.format('YYYY-MM-DD') },
    });

    fireEvent.change(endDatePicker, {
      target: { value: newDate.format('YYYY-MM-DD') },
    });

    await wait();

    // Date pickers should accept the changes - re-query as elements might have been detached
    expect(screen.getByTestId('eventStartAt')).toBeInTheDocument();
    expect(screen.getByTestId('eventEndAt')).toBeInTheDocument();
  });

  it('Should handle time picker changes when all-day is disabled', async () => {
    const cache = new InMemoryCache();
    render(
      <MockedProvider link={link} cache={cache}>
        <BrowserRouter>
          <Provider store={store}>
            <>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18nForTest}>
                  <Events />
                </I18nextProvider>
              </ThemeProvider>
            </>
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
      const startTimePicker = screen.getByLabelText(
        'Start Time',
      ) as HTMLInputElement;
      expect(startTimePicker).not.toBeDisabled();
    });

    const startTimePicker = screen.getByLabelText(
      'Start Time',
    ) as HTMLInputElement;
    const endTimePicker = screen.getByLabelText('End Time') as HTMLInputElement;
    fireEvent.change(startTimePicker, {
      target: { value: '09:00:00' },
    });

    fireEvent.change(endTimePicker, {
      target: { value: '11:00:00' },
    });

    await wait();

    // Time pickers should accept the changes - re-query as elements might have been detached
    expect(screen.getByLabelText('Start Time')).toBeInTheDocument();
    expect(screen.getByLabelText('End Time')).toBeInTheDocument();
  });

  it('Should handle null date values gracefully', async () => {
    const cache = new InMemoryCache();
    render(
      <MockedProvider link={link} cache={cache}>
        <BrowserRouter>
          <Provider store={store}>
            <>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18nForTest}>
                  <Events />
                </I18nextProvider>
              </ThemeProvider>
            </>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    // Open modal
    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() => {
      screen.getByTestId('eventStartAt');
    });

    const startDatePicker = screen.getByTestId(
      'eventStartAt',
    ) as HTMLInputElement;
    const endDatePicker = screen.getByTestId('eventEndAt') as HTMLInputElement;
    fireEvent.change(startDatePicker, {
      target: { value: '' },
    });

    fireEvent.change(endDatePicker, {
      target: { value: '' },
    });

    await wait();

    // Should handle null values without crashing
    expect(screen.getByTestId('eventStartAt')).toBeInTheDocument();
  });

  it('Should handle network error gracefully', async () => {
    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    const cache = new InMemoryCache();
    render(
      <MockedProvider link={errorLink} cache={cache}>
        <BrowserRouter>
          <Provider store={store}>
            <>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18nForTest}>
                  <Events />
                </I18nextProvider>
              </ThemeProvider>
            </>
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

    const cache = new InMemoryCache();
    render(
      <MockedProvider link={rateLimitLink} cache={cache}>
        <BrowserRouter>
          <Provider store={store}>
            <>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18nForTest}>
                  <Events />
                </I18nextProvider>
              </ThemeProvider>
            </>
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
    const cache = new InMemoryCache();
    render(
      <MockedProvider link={link} cache={cache}>
        <BrowserRouter>
          <Provider store={store}>
            <>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18nForTest}>
                  <Events />
                </I18nextProvider>
              </ThemeProvider>
            </>
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
    localStorage.setItem('role', 'administrator');

    const cache = new InMemoryCache();
    render(
      <MockedProvider link={link} cache={cache}>
        <BrowserRouter>
          <Provider store={store}>
            <>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18nForTest}>
                  <Events />
                </I18nextProvider>
              </ThemeProvider>
            </>
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
    localStorage.setItem('role', 'user');
    const cache = new InMemoryCache();
    render(
      <MockedProvider link={link} cache={cache}>
        <BrowserRouter>
          <Provider store={store}>
            <>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18nForTest}>
                  <Events />
                </I18nextProvider>
              </ThemeProvider>
            </>
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
    const cache = new InMemoryCache();
    render(
      <MockedProvider link={link} cache={cache}>
        <BrowserRouter>
          <Provider store={store}>
            <>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18nForTest}>
                  <Events />
                </I18nextProvider>
              </ThemeProvider>
            </>
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
    const cache = new InMemoryCache();
    render(
      <MockedProvider link={link} cache={cache}>
        <BrowserRouter>
          <Provider store={store}>
            <>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18nForTest}>
                  <Events />
                </I18nextProvider>
              </ThemeProvider>
            </>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('calendar-view-type')).toHaveTextContent(
        'Month View',
      );
    });

    // Change view to DAY first
    const dayViewButton = screen.getByTestId('selectDay');
    await userEvent.click(dayViewButton);
    await waitFor(() => {
      expect(screen.getByTestId('calendar-view-type')).toHaveTextContent('DAY');
    });

    // Now call handleChangeView(null)
    await userEvent.click(screen.getByTestId('handleChangeNullBtn'));

    // Wait for state to settle after no-op view change
    await wait();
    // View type should remain DAY
    await waitFor(() => {
      expect(screen.getByTestId('calendar-view-type')).toHaveTextContent('DAY');
    });
  });

  it('Should call onMonthChange callback from EventCalendar', async () => {
    const cache = new InMemoryCache();
    render(
      <MockedProvider link={link} cache={cache}>
        <BrowserRouter>
          <Provider store={store}>
            <>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18nForTest}>
                  <Events />
                </I18nextProvider>
              </ThemeProvider>
            </>
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
    const cache = new InMemoryCache();
    render(
      <MockedProvider link={testLink} cache={cache}>
        <BrowserRouter>
          <Provider store={store}>
            <>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18nForTest}>
                  <Events />
                </I18nextProvider>
              </ThemeProvider>
            </>
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
    // Disable __typename to test raw data mapping without Apollo's type augmentation
    const cache = new InMemoryCache({
      addTypename: false,
    });
    render(
      <MockedProvider link={testLink} cache={cache}>
        <BrowserRouter>
          <Provider store={store}>
            <>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18nForTest}>
                  <Events />
                </I18nextProvider>
              </ThemeProvider>
            </>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(
      () => {
        // EventCalendar mock renders eventData JSON in `event-data-json`
        const jsonPre = screen.getByTestId('event-data-json');
        const parsed = JSON.parse(jsonPre.textContent || '[]');

        expect(parsed).toBeInstanceOf(Array);
        expect(parsed.length).toBeGreaterThan(0);
        // Creator fallback should be used when creator is null
        expect(parsed[0].creator).toEqual({ id: '', name: '' });
      },
      { timeout: 5000 },
    );
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
          isInviteOnly: boolean;
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
            input.isPublic === false &&
            input.isRegisterable === true &&
            input.isInviteOnly === true &&
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
            name: 'Recurring Test Event',
            description: 'Recurring Test Description',
            startAt: new Date().toISOString(),
            endAt: new Date().toISOString(),
            allDay: true,
            location: 'Recurring Test Location',
            isPublic: true,
            isRegisterable: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isRecurringEventTemplate: true,
            hasExceptions: false,
            sequenceNumber: 1,
            totalCount: 5,
            progressLabel: '1 of 5',
            attachments: [],
            creator: {
              id: 'user1',
              name: 'Test User',
            },
            organization: {
              id: 'org123',
              name: 'Test Org',
            },
            baseEvent: null,
          },
        },
      },
    };

    const testLink = new StaticMockLink(
      [...MOCKS.slice(0, 2), createEventWithRecurrenceMock],
      true,
    );

    mockToast.success.mockClear();

    const cache = new InMemoryCache();
    render(
      <MockedProvider link={testLink} cache={cache}>
        <BrowserRouter>
          <Provider store={store}>
            <>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18nForTest}>
                  <Events />
                </I18nextProvider>
              </ThemeProvider>
            </>
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

  it('Should filter events when DateRangePicker preset is selected', async () => {
    const cache = new InMemoryCache();
    render(
      <MockedProvider link={link} cache={cache}>
        <BrowserRouter>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <I18nextProvider i18n={i18nForTest}>
                <Events />
              </I18nextProvider>
            </ThemeProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getByTestId('events-date-range-preset-today'),
      ).toBeInTheDocument();
    });

    const thisWeekButton = screen.getByTestId(
      'events-date-range-preset-thisWeek',
    );
    await userEvent.click(thisWeekButton);

    await wait(300);

    expect(thisWeekButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('Should update events when date range is manually changed', async () => {
    const cache = new InMemoryCache();
    render(
      <MockedProvider link={link} cache={cache}>
        <BrowserRouter>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <I18nextProvider i18n={i18nForTest}>
                <Events />
              </I18nextProvider>
            </ThemeProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const startDateInput = screen.getByTestId(
      'events-date-range-start-input',
    ) as HTMLInputElement;
    const endDateInput = screen.getByTestId(
      'events-date-range-end-input',
    ) as HTMLInputElement;

    const newStartDate = dayjs().add(1, 'week');
    const newEndDate = dayjs().add(2, 'weeks');

    fireEvent.change(startDateInput, {
      target: { value: newStartDate.format('MM/DD/YYYY') },
    });

    fireEvent.change(endDateInput, {
      target: { value: newEndDate.format('MM/DD/YYYY') },
    });

    await wait(300);

    expect(startDateInput.value).toBe(newStartDate.format('MM/DD/YYYY'));
    expect(endDateInput.value).toBe(newEndDate.format('MM/DD/YYYY'));
  });

  it('should compute calendar from null startDate using current date', () => {
    const now = dayjs();
    const { month, year } = computeCalendarFromStartDate(null);
    expect(month).toBe(now.month());
    expect(year).toBe(now.year());
  });
});
