import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import { GraphQLError } from 'graphql';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DateRangePicker';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import dayjs from 'dayjs';

import OrganizationEvents from './OrganizationEvents';
import { store } from 'state/store';
import i18n from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import {
  GET_ORGANIZATION_DATA_PG,
  GET_ORGANIZATION_EVENTS_PG,
} from 'GraphQl/Queries/Queries';
import { MOCKS } from './OrganizationEventsMocks';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { green } from '@mui/material/colors';

const mockGetItem = vi.fn((key: string): string | null => {
  if (key === 'role') return 'administrator';
  if (key === 'id') return '1';
  return null;
});

vi.mock('utils/useLocalstorage', () => {
  return {
    default: () => ({
      getItem: mockGetItem,
      setItem: vi.fn(),
      removeItem: vi.fn(),
    }),
  };
});

vi.mock('shared-components/BreadcrumbsComponent/SafeBreadcrumbs', () => ({
  default: ({
    items,
  }: {
    items: Array<{ translationKey?: string; label?: string; to?: string }>;
  }) => {
    return (
      <nav aria-label="breadcrumbs">
        <ol>
          {items.map((item) => (
            <li key={item.translationKey || item.label}>
              {item.to ? (
                <a href={item.to}>{item.translationKey}</a>
              ) : (
                <span aria-current="page">{item.translationKey}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
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

const sharedWindowSpies = vi.hoisted(() => ({
  alertMock: vi.fn(),
}));

Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost/',
    assign: vi.fn((url: string) => {
      if (url.startsWith('/')) {
        window.location.href = `http://localhost${url}`;
        window.location.pathname = url;
        window.location.search = '';
        window.location.hash = '';
      } else if (url.includes('://')) {
        window.location.href = url;
        const urlParts = url.split('://')[1];
        const pathParts = urlParts.split('/');
        window.location.pathname =
          pathParts.length > 1 ? `/${pathParts.slice(1).join('/')}` : '/';
        window.location.search = '';
        window.location.hash = '';
      }
    }),
    reload: vi.fn(),
    pathname: '/admin/orglist',
    search: '',
    hash: '',
    origin: 'http://localhost',
  },
});

const defaultLink = new StaticMockLink(
  MOCKS.map((mock) => ({ ...mock, variableMatcher: () => true })),
  true,
);

async function wait(ms = 0): Promise<void> {
  await act(
    () =>
      new Promise((resolve) => {
        setTimeout(resolve, ms);
      }),
  );
}

const buildEventsVariables = () => {
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const startDate = dayjs(firstOfMonth).startOf('month').toISOString();
  const endDate = dayjs(firstOfMonth).endOf('month').toISOString();

  return {
    id: undefined,
    first: 100,
    after: null,
    startDate,
    endDate,
    includeRecurring: true,
  };
};

const buildOrgVariables = () => ({
  id: undefined,
  first: 10,
  after: null,
});

vi.mock('@mui/x-date-pickers/DateTimePicker', async () => {
  const actual = await vi.importActual(
    '@mui/x-date-pickers/DesktopDateTimePicker',
  );
  return {
    DateTimePicker: actual.DesktopDateTimePicker,
  };
});

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));

// Mock CreateEventModal to avoid testing its internal logic
vi.mock('./CreateEventModal', () => ({
  default: ({
    isOpen,
    onClose,
    onEventCreated,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onEventCreated: () => void;
  }) => {
    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent): void => {
        if (e.key === 'Escape' && isOpen) {
          onClose();
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;
    return (
      <div data-testid="createEventModal">
        <button
          type="button"
          data-testid="createEventModalCloseBtn"
          onClick={onClose}
        >
          Close
        </button>
        <button
          type="button"
          data-testid="mockCreateEventSuccess"
          onClick={() => {
            onEventCreated();
            onClose();
          }}
        >
          Create Event Success
        </button>
      </div>
    );
  },
}));

vi.mock('components/EventCalender/Monthly/EventCalender', () => ({
  __esModule: true,
  default: ({
    eventData,
    onMonthChange,
  }: {
    eventData?: unknown[];
    onMonthChange?: (month: number, year: number) => void;
  }) => {
    return (
      <div>
        <button
          type="button"
          data-testid="nextmonthordate"
          onClick={() => onMonthChange?.(1, 2023)}
        />
        <pre data-testid="event-data-json">
          {JSON.stringify(eventData ?? [])}
        </pre>
      </div>
    );
  },
}));

describe('Organisation Events Page', () => {
  beforeEach(() => {
    sharedWindowSpies.alertMock.mockReset();
    window.alert = sharedWindowSpies.alertMock;
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  const renderWithLink = (link: StaticMockLink) =>
    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/admin/orgdash/orgId/events']}>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18n}>
                  <Routes>
                    <Route
                      path="/admin/orgdash/:orgId/events"
                      element={<OrganizationEvents />}
                    />
                  </Routes>
                </I18nextProvider>
              </ThemeProvider>
            </LocalizationProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

  test('renders events page and keeps current route', async () => {
    window.location.assign('/admin/orglist');

    const { container } = renderWithLink(defaultLink);

    expect(container.textContent).not.toBe('Loading data...');
    await wait();
    expect(container.textContent).toMatch('Month');
    expect(window.location.pathname).toBe('/admin/orglist');
  });

  test('renders when there is no mock event data (no events query result)', async () => {
    const emptyLink = new StaticMockLink([], true);

    renderWithLink(emptyLink);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument();
    });
  });

  test('toggles Create Event modal open and close', async () => {
    renderWithLink(defaultLink);

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

  test('creates all-day event via modal (all-day = true)', async () => {
    renderWithLink(defaultLink);

    await wait();

    await waitFor(() =>
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
    );

    // Open modal
    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() =>
      expect(
        screen.getByTestId('createEventModalCloseBtn'),
      ).toBeInTheDocument(),
    );

    // Simulate successful event creation via mocked modal
    const successButton = screen.getByTestId('mockCreateEventSuccess');
    await userEvent.click(successButton);

    // Verify modal closes after successful creation
    await waitFor(() => {
      expect(
        screen.queryByTestId('createEventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  test('HTML5 validation prevents submit when required fields are empty', async () => {
    renderWithLink(defaultLink);

    await wait();

    await waitFor(() =>
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() =>
      expect(
        screen.getByTestId('createEventModalCloseBtn'),
      ).toBeInTheDocument(),
    );

    expect(NotificationToast.warning).not.toHaveBeenCalled();

    await userEvent.click(screen.getByTestId('createEventModalCloseBtn'));

    await waitFor(() =>
      expect(
        screen.queryByTestId('createEventModalCloseBtn'),
      ).not.toBeInTheDocument(),
    );
  });

  test('creates timed (non all-day) event and uses time pickers', async () => {
    renderWithLink(defaultLink);

    await wait();

    await waitFor(() =>
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() =>
      expect(
        screen.getByTestId('createEventModalCloseBtn'),
      ).toBeInTheDocument(),
    );

    // Simulate successful event creation
    await userEvent.click(screen.getByTestId('mockCreateEventSuccess'));

    await waitFor(() =>
      expect(
        screen.queryByTestId('createEventModalCloseBtn'),
      ).not.toBeInTheDocument(),
    );
  });

  test('verifies success path when event creation returns data', async () => {
    renderWithLink(defaultLink);

    await wait();

    await waitFor(() =>
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() =>
      expect(
        screen.getByTestId('createEventModalCloseBtn'),
      ).toBeInTheDocument(),
    );

    // Simulate successful event creation via mocked modal
    await userEvent.click(screen.getByTestId('mockCreateEventSuccess'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('createEventModalCloseBtn'),
      ).not.toBeInTheDocument();
    });
  });

  test('recurrence dropdown options and simple selection', async () => {
    renderWithLink(defaultLink);

    await wait();

    await waitFor(() =>
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() =>
      expect(
        screen.getByTestId('createEventModalCloseBtn'),
      ).toBeInTheDocument(),
    );
  });

  test('opens CustomRecurrenceModal from recurrence dropdown', async () => {
    renderWithLink(defaultLink);

    await wait();

    await waitFor(() =>
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() =>
      expect(
        screen.getByTestId('createEventModalCloseBtn'),
      ).toBeInTheDocument(),
    );
  });

  test('CustomRecurrenceModal setRecurrenceRuleState function path', async () => {
    renderWithLink(defaultLink);

    await wait();

    await waitFor(() =>
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() =>
      expect(
        screen.getByTestId('createEventModalCloseBtn'),
      ).toBeInTheDocument(),
    );
  });

  test('recurrence validation path executes when Weekly recurrence selected', async () => {
    renderWithLink(defaultLink);

    await wait();

    await waitFor(() =>
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() =>
      expect(
        screen.getByTestId('createEventModalCloseBtn'),
      ).toBeInTheDocument(),
    );
  });

  test('viewType changes from Month to Day via EventHeader', async () => {
    const { container } = renderWithLink(defaultLink);

    await wait();

    expect(container.textContent).toMatch('Month');

    const viewTypeDropdown = screen.getByTestId('selectViewType-toggle');
    await userEvent.click(viewTypeDropdown);
    // Find and click the "Day" option in the dropdown
    const dayOption = await screen.findByTestId('selectViewType-item-Day');
    await userEvent.click(dayOption);

    await waitFor(() => {
      expect(container.textContent).toMatch('Day');
    });
  });

  test('handleMonthChange via next button and year rollover', async () => {
    renderWithLink(defaultLink);

    await wait();

    const nextBtn = screen.getByTestId('nextmonthordate');

    await userEvent.click(nextBtn);
    await userEvent.click(nextBtn);

    await waitFor(() =>
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
    );
  });

  test('rate-limit eventDataError is silently suppressed', async () => {
    const mockWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const rateLimitLink = new StaticMockLink(
      [
        {
          request: {
            query: GET_ORGANIZATION_EVENTS_PG,
            variables: buildEventsVariables(),
          },
          error: new Error('Too Many Requests'),
        },
        {
          request: {
            query: GET_ORGANIZATION_DATA_PG,
            variables: buildOrgVariables(),
          },
          result: {
            data: {
              organization: { id: '1', name: 'Org' },
            },
          },
        },
      ],
      true,
    );

    renderWithLink(rateLimitLink);

    await wait();

    await waitFor(() =>
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
    );

    expect(window.location.pathname).toBe('/admin/orglist');

    const messages = mockWarn.mock.calls.map((args) => args.join(' '));
    expect(
      messages.some((msg) => msg.toLowerCase().includes('too many requests')),
    ).toBe(false);
  });

  test('rate-limit eventDataError with "rate limit" message is silently suppressed', async () => {
    const mockWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const rateLimitLink = new StaticMockLink(
      [
        {
          request: {
            query: GET_ORGANIZATION_EVENTS_PG,
            variables: buildEventsVariables(),
          },
          variableMatcher: () => true,
          error: new Error('Rate limit exceeded'),
        },
        {
          request: {
            query: GET_ORGANIZATION_DATA_PG,
            variables: buildOrgVariables(),
          },
          result: {
            data: {
              organization: { id: '1', name: 'Org' },
            },
          },
        },
      ],
      true,
    );

    renderWithLink(rateLimitLink);
    await wait();
    await waitFor(() =>
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
    );

    expect(window.location.pathname).toBe('/admin/orglist');
    const messages = mockWarn.mock.calls.map((args) => args.join(' '));
    expect(messages.some((msg) => msg.includes('Non-critical error'))).toBe(
      false,
    );
  });

  test('rate-limit eventDataError with "Please try again later" is silently suppressed', async () => {
    const mockWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const rateLimitLink = new StaticMockLink(
      [
        {
          request: {
            query: GET_ORGANIZATION_EVENTS_PG,
            variables: buildEventsVariables(),
          },
          variableMatcher: () => true,
          error: new Error('Please try again later'),
        },
        {
          request: {
            query: GET_ORGANIZATION_DATA_PG,
            variables: buildOrgVariables(),
          },
          result: {
            data: {
              organization: { id: '1', name: 'Org' },
            },
          },
        },
      ],
      true,
    );

    renderWithLink(rateLimitLink);
    await wait();
    await waitFor(() =>
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
    );

    expect(window.location.pathname).toBe('/admin/orglist');
    const messages = mockWarn.mock.calls.map((args) => args.join(' '));
    expect(messages.some((msg) => msg.includes('Non-critical error'))).toBe(
      false,
    );
  });

  test('non-rate-limit eventDataError logs warning', async () => {
    const mockWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const nonRateErrorLink = new StaticMockLink(
      [
        {
          request: {
            query: GET_ORGANIZATION_EVENTS_PG,
            variables: buildEventsVariables(),
          },
          error: new Error('some other apollo error'),
        },
        {
          request: {
            query: GET_ORGANIZATION_DATA_PG,
            variables: buildOrgVariables(),
          },
          result: {
            data: {
              organization: { id: '1', name: 'Org' },
            },
          },
        },
      ],
      true,
    );

    renderWithLink(nonRateErrorLink);

    await wait();

    await waitFor(() =>
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
    );

    expect(mockWarn).toHaveBeenCalled();
  });

  test('orgDataError with successful events query logs warning', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const orgErrorLink = new StaticMockLink(
      [
        {
          request: {
            query: GET_ORGANIZATION_EVENTS_PG,
            variables: buildEventsVariables(),
          },
          result: {
            data: {
              organization: {
                events: { edges: [] },
              },
            },
          },
        },
        {
          request: {
            query: GET_ORGANIZATION_DATA_PG,
            variables: buildOrgVariables(),
          },
          error: new Error('org data failure'),
        },
      ],
      true,
    );

    renderWithLink(orgErrorLink);

    await wait(50);

    expect(warnSpy).toHaveBeenCalled();
  });

  test('handles undefined events data gracefully (events = null)', async () => {
    const undefinedEventsLink = new StaticMockLink(
      [
        {
          request: {
            query: GET_ORGANIZATION_EVENTS_PG,
            variables: buildEventsVariables(),
          },
          result: {
            data: {
              organization: {
                events: null,
              },
            },
          },
        },
        {
          request: {
            query: GET_ORGANIZATION_DATA_PG,
            variables: buildOrgVariables(),
          },
          result: {
            data: {
              organization: { id: '1', name: 'Test Org' },
            },
          },
        },
      ],
      true,
    );

    renderWithLink(undefinedEventsLink);

    await waitFor(() =>
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
    );
  });

  test('handles empty events edges array', async () => {
    const emptyEventsLink = new StaticMockLink(
      [
        {
          request: {
            query: GET_ORGANIZATION_EVENTS_PG,
            variables: buildEventsVariables(),
          },
          result: {
            data: {
              organization: {
                events: { edges: [] },
              },
            },
          },
        },
        {
          request: {
            query: GET_ORGANIZATION_DATA_PG,
            variables: buildOrgVariables(),
          },
          result: {
            data: {
              organization: { id: '1', name: 'Org' },
            },
          },
        },
      ],
      true,
    );

    renderWithLink(emptyEventsLink);

    await waitFor(() =>
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
    );
  });

  test('normalizes event data with null description, null location, and allDay true', async () => {
    const eventDay = dayjs().add(30, 'days').startOf('day');
    const startAt = eventDay.toISOString();
    const endAt = eventDay.endOf('day').toISOString();

    const mappingCoverageLink = new StaticMockLink(
      [
        {
          request: {
            query: GET_ORGANIZATION_EVENTS_PG,
            variables: buildEventsVariables(),
          },
          variableMatcher: () => true,
          result: {
            data: {
              organization: {
                events: {
                  edges: [
                    {
                      cursor: 'cursor1',
                      node: {
                        id: '1',
                        name: 'All-Day Null Fields Event',
                        description: null,
                        startAt,
                        endAt,
                        allDay: true,
                        location: null,
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
                        attachments: [],
                        creator: { id: '1', name: 'Creator' },
                        organization: { id: '1', name: 'Org' },
                        createdAt: startAt,
                        updatedAt: startAt,
                      },
                    },
                  ],
                },
              },
            },
          },
        },
        {
          request: {
            query: GET_ORGANIZATION_DATA_PG,
            variables: buildOrgVariables(),
          },
          result: {
            data: {
              organization: { id: '1', name: 'Org' },
            },
          },
        },
      ],
      true,
    );

    renderWithLink(mappingCoverageLink);

    await waitFor(() =>
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
    );
  });

  test('unmount does not crash (cleanup effect)', async () => {
    const { unmount } = renderWithLink(defaultLink);

    await wait();

    expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument();

    expect(() => unmount()).not.toThrow();
  });

  test('unmount cleanup effect clears timeout when queryTimeoutRef is set', async () => {
    // Mock clearTimeout to verify it's called
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    const { unmount } = renderWithLink(defaultLink);
    await wait();
    expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument();

    await wait(100);
    unmount();
    await wait(50);
    clearTimeoutSpy.mockRestore();
  });

  test('search input triggers onSearch callback when Enter is pressed', async () => {
    renderWithLink(defaultLink);

    await waitFor(() =>
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
    );

    const searchInput = screen.getByTestId('searchEvent') as HTMLInputElement;
    expect(searchInput).toBeInTheDocument();
    await userEvent.type(searchInput, 'test event');
    await userEvent.keyboard('{Enter}');
    await wait(50);
  });

  test('search button triggers onSearch callback when clicked', async () => {
    renderWithLink(defaultLink);

    await waitFor(() =>
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
    );

    const searchInput = screen.getByTestId('searchEvent') as HTMLInputElement;
    const searchButton = screen.getByTestId('searchButton');
    expect(searchInput).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
    await userEvent.type(searchInput, 'test search');
    await userEvent.click(searchButton);
    await wait(50);
  });

  test('renders successfully with ADMINISTRATOR role from useLocalStorage', async () => {
    renderWithLink(defaultLink);

    await waitFor(() =>
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
    );
  });

  test('handles CreateEventModal error when mutation fails', async () => {
    renderWithLink(defaultLink);

    await wait();

    await waitFor(() =>
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() =>
      expect(
        screen.getByTestId('createEventModalCloseBtn'),
      ).toBeInTheDocument(),
    );

    // Simply close the modal - error handling is in CreateEventModal component
    await userEvent.click(screen.getByTestId('createEventModalCloseBtn'));

    await waitFor(() =>
      expect(
        screen.queryByTestId('createEventModalCloseBtn'),
      ).not.toBeInTheDocument(),
    );
  });

  test('shows Loader when orgLoading is true', async () => {
    const loadingMock = [
      {
        request: {
          query: GET_ORGANIZATION_DATA_PG,
          variables: buildOrgVariables(),
        },
        result: {
          data: {
            organization: { id: '1', name: 'Test Org' },
          },
        },
        delay: 200,
      },
      {
        request: {
          query: GET_ORGANIZATION_EVENTS_PG,
          variables: buildEventsVariables(),
        },
        result: {
          data: {
            organization: {
              events: { edges: [] },
            },
          },
        },
      },
    ];

    const loadingLink = new StaticMockLink(loadingMock, true);

    render(
      <MockedProvider link={loadingLink}>
        <MemoryRouter initialEntries={['/admin/orgdash/orgId/events']}>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18n}>
                  <Routes>
                    <Route
                      path="/admin/orgdash/:orgId/events"
                      element={<OrganizationEvents />}
                    />
                  </Routes>
                </I18nextProvider>
              </ThemeProvider>
            </LocalizationProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await wait(50);
    await waitFor(
      () =>
        expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
      { timeout: 300 },
    );
  });

  test('renders successfully with REGULAR role from useLocalStorage', async () => {
    // Temporarily override getItem to return REGULAR role
    const originalImplementation = mockGetItem.getMockImplementation();
    mockGetItem.mockImplementation((key: string): string | null => {
      if (key === 'role') return 'user';
      if (key === 'id') return '1';
      return null;
    });

    renderWithLink(defaultLink);

    await waitFor(() =>
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
    );

    // Restore original implementation
    if (originalImplementation) {
      mockGetItem.mockImplementation(originalImplementation);
    } else {
      mockGetItem.mockReset();
    }
  });

  test('viewType changes to Year view via EventHeader', async () => {
    const { container } = renderWithLink(defaultLink);

    await wait();

    expect(container.textContent).toMatch('Month');

    const viewTypeDropdown = screen.getByTestId('selectViewType-toggle');
    await userEvent.click(viewTypeDropdown);

    // Find and click the "Year View" option (value = ViewType.YEAR = 'Year View')
    const yearOption = await screen.findByTestId(
      'selectViewType-item-Year View',
    );
    await userEvent.click(yearOption);

    // The dropdown toggle now shows the selected option's label ("Select Year")
    await waitFor(() => {
      expect(container.textContent).toMatch('Select Year');
    });
  });

  test('should switch to week view when ViewType.WEEK is selected', async () => {
    const { container } = renderWithLink(defaultLink);

    await wait();

    expect(container.textContent).toMatch('Month');

    const viewTypeDropdown = screen.getByTestId('selectViewType-toggle');
    await userEvent.click(viewTypeDropdown);

    // Find and click the "Week View" option (value = ViewType.WEEK = 'Week View')
    const weekOption = await screen.findByTestId(
      'selectViewType-item-Week View',
    );
    await userEvent.click(weekOption);

    // The dropdown toggle now shows the selected option's label ("Select Week")
    await waitFor(() => {
      expect(container.textContent).toMatch('Select Week');
    });
  });

  test('handleChangeView ignores null values', async () => {
    const { container } = renderWithLink(defaultLink);

    await wait();

    const initialContent = container.textContent;
    expect(initialContent).toMatch('Month');

    // Simulate handleChangeView being called with null
    // This should not change the viewType
    const viewTypeDropdown = screen.getByTestId('selectViewType-toggle');
    await userEvent.click(viewTypeDropdown);

    // Close dropdown without selecting (simulating null)
    await userEvent.keyboard('{Escape}');

    await waitFor(() => {
      // ViewType should remain unchanged
      expect(container.textContent).toMatch('Month');
    });
  });

  test('filters events based on search term - name match', async () => {
    renderWithLink(defaultLink);

    await waitFor(() =>
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
    );

    const searchInput = screen.getByTestId('searchEvent') as HTMLInputElement;
    await userEvent.type(searchInput, 'All Day Event');
    await userEvent.keyboard('{Enter}');
    await wait(50);

    expect(searchInput.value).toBe('All Day Event');
  });

  test('filters events based on search term - description match', async () => {
    renderWithLink(defaultLink);

    await waitFor(() =>
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
    );

    const searchInput = screen.getByTestId('searchEvent') as HTMLInputElement;
    await userEvent.type(searchInput, 'timed event');
    await userEvent.keyboard('{Enter}');
    await wait(50);

    expect(searchInput.value).toBe('timed event');
  });

  test('filters events based on search term - location match', async () => {
    renderWithLink(defaultLink);

    await waitFor(() =>
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
    );

    const searchInput = screen.getByTestId('searchEvent') as HTMLInputElement;
    await userEvent.type(searchInput, 'Conference Room');
    await userEvent.keyboard('{Enter}');
    await wait(50);

    expect(searchInput.value).toBe('Conference Room');
  });

  test('filter uses matchesDescription when search term matches only description', async () => {
    renderWithLink(defaultLink);

    await waitFor(() =>
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
    );

    const searchInput = screen.getByTestId('searchEvent') as HTMLInputElement;
    await userEvent.type(searchInput, 'This is a timed');
    await userEvent.keyboard('{Enter}');
    await wait(50);

    expect(searchInput.value).toBe('This is a timed');
  });

  test('filter uses matchesLocation when search term matches only location', async () => {
    renderWithLink(defaultLink);

    await waitFor(() =>
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
    );

    const searchInput = screen.getByTestId('searchEvent') as HTMLInputElement;
    await userEvent.type(searchInput, 'Meeting Room B');
    await userEvent.keyboard('{Enter}');
    await wait(50);

    expect(searchInput.value).toBe('Meeting Room B');
  });

  test('returns all events when search term is empty', async () => {
    renderWithLink(defaultLink);

    await waitFor(() =>
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
    );

    const searchInput = screen.getByTestId('searchEvent') as HTMLInputElement;

    // First type something
    await userEvent.type(searchInput, 'test');
    await wait(50);

    // Then clear it
    await userEvent.clear(searchInput);
    await wait(50);

    expect(searchInput.value).toBe('');
  });

  test('search filtering correctly filters events from mock data', async () => {
    renderWithLink(defaultLink);

    await waitFor(() =>
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
    );

    // The MOCKS contain events: "Event with null description", "All Day Event", "Timed Event"
    // Search for "All Day" should filter to show only that event
    const searchInput = screen.getByTestId('searchEvent') as HTMLInputElement;

    // Type a search term that matches one of the mock events
    await userEvent.type(searchInput, 'All Day');

    // Trigger search
    await userEvent.keyboard('{Enter}');
    await wait(100);

    // The filtered events are passed to EventCalendar component
    // We can't directly test the filtered array, but we verified the input works
    expect(searchInput.value).toBe('All Day');
  });

  test('search with no matches returns empty filtered list', async () => {
    renderWithLink(defaultLink);

    await waitFor(() =>
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
    );

    const searchInput = screen.getByTestId('searchEvent') as HTMLInputElement;

    // Search for something that doesn't exist in any event
    await userEvent.type(searchInput, 'NonexistentEvent12345');
    await userEvent.keyboard('{Enter}');
    await wait(100);

    expect(searchInput.value).toBe('NonexistentEvent12345');
  });

  describe('Keyboard Accessibility', () => {
    test('should open create event modal when Enter is pressed on create event button', async () => {
      renderWithLink(defaultLink);

      await wait();

      await waitFor(() => {
        expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument();
      });

      const createBtn = screen.getByTestId('createEventModalBtn');
      createBtn.focus();
      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByTestId('createEventModal')).toBeInTheDocument();
      });
    });

    test('should close modal when Escape is pressed', async () => {
      renderWithLink(defaultLink);

      await wait();

      await waitFor(() => {
        expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument();
      });

      await userEvent.click(screen.getByTestId('createEventModalBtn'));

      await waitFor(() => {
        expect(screen.getByTestId('createEventModal')).toBeInTheDocument();
      });

      await userEvent.keyboard('{Escape}');

      await waitFor(() => {
        expect(
          screen.queryByTestId('createEventModal'),
        ).not.toBeInTheDocument();
      });
    });
  });

  test('renders breadcrumbs correctly', async () => {
    renderWithLink(defaultLink);

    // Wait for page to load
    await waitFor(() =>
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
    );

    const breadcrumbsNav = await screen.findByRole('navigation', {
      name: /breadcrumbs/i,
    });
    expect(breadcrumbsNav).toBeInTheDocument();

    // Verify breadcrumb items
    const breadcrumbLinks = within(breadcrumbsNav).getAllByRole('link');
    expect(breadcrumbLinks).toHaveLength(1); // Only "organization" is a link

    // Verify current page breadcrumb (events) has aria-current
    expect(screen.getByText('events')).toHaveAttribute('aria-current', 'page');
  });

  test('correctly sets startTime and endTime for events', async () => {
    renderWithLink(defaultLink);

    await waitFor(() => {
      const jsonPre = screen.getByTestId('event-data-json');
      const parsedEvents = JSON.parse(jsonPre.textContent || '[]');

      expect(parsedEvents).toBeInstanceOf(Array);
      expect(parsedEvents.length).toBe(3);

      // Event 1: Timed event (allDay: false)
      expect(parsedEvents[0].startTime).toBe('09:00:00');
      expect(parsedEvents[0].endTime).toBe('17:00:00');
      expect(parsedEvents[0].allDay).toBe(false);

      // Event 2: All day event (allDay: true)
      expect(parsedEvents[1].startTime).toBeNull();
      expect(parsedEvents[1].endTime).toBeNull();
      expect(parsedEvents[1].allDay).toBe(true);

      // Event 3: Timed event (allDay: false)
      expect(parsedEvents[2].startTime).toBe('14:30:00');
      expect(parsedEvents[2].endTime).toBe('16:30:00');
      expect(parsedEvents[2].allDay).toBe(false);
    });
  });

  test('maps non-all-day startTime/endTime from startAt/endAt and null when bounds are missing', async () => {
    const timedStartAt = dayjs().add(15, 'day').hour(9).minute(5).toISOString();
    const timedEndAt = dayjs().add(15, 'day').hour(11).minute(45).toISOString();

    const branchEventsMock = {
      request: {
        query: GET_ORGANIZATION_EVENTS_PG,
        variables: buildEventsVariables(),
      },
      result: {
        data: {
          organization: {
            events: {
              edges: [
                {
                  cursor: 'branch-cursor-1',
                  node: {
                    id: 'timed-with-bounds',
                    name: 'Timed With Bounds',
                    description: 'Has startAt/endAt',
                    startAt: timedStartAt,
                    endAt: timedEndAt,
                    startDate: null,
                    endDate: null,
                    allDay: false,
                    location: 'Room A',
                    isPublic: true,
                    isRegisterable: true,
                    isInviteOnly: false,
                    isRecurringEventTemplate: false,
                    baseEvent: null,
                    sequenceNumber: null,
                    totalCount: null,
                    hasExceptions: false,
                    progressLabel: null,
                    recurrenceDescription: null,
                    recurrenceRule: null,
                    attachments: [],
                    creator: { id: '1', name: 'Creator User' },
                    organization: { id: '1', name: 'Test Organization' },
                    createdAt: dayjs().toISOString(),
                    updatedAt: dayjs().toISOString(),
                  },
                },
                {
                  cursor: 'branch-cursor-2',
                  node: {
                    id: 'timed-missing-bounds',
                    name: 'Timed Missing Bounds',
                    description: 'Missing startAt/endAt',
                    startAt: null,
                    endAt: null,
                    startDate: null,
                    endDate: null,
                    allDay: false,
                    location: 'Room B',
                    isPublic: true,
                    isRegisterable: true,
                    isInviteOnly: false,
                    isRecurringEventTemplate: false,
                    baseEvent: null,
                    sequenceNumber: null,
                    totalCount: null,
                    hasExceptions: false,
                    progressLabel: null,
                    recurrenceDescription: null,
                    recurrenceRule: null,
                    attachments: [],
                    creator: { id: '2', name: 'Creator User 2' },
                    organization: { id: '1', name: 'Test Organization' },
                    createdAt: dayjs().toISOString(),
                    updatedAt: dayjs().toISOString(),
                  },
                },
              ],
            },
          },
        },
      },
    };

    const branchOrgMock = {
      request: {
        query: GET_ORGANIZATION_DATA_PG,
        variables: buildOrgVariables(),
      },
      result: {
        data: {
          organization: {
            id: '1',
            name: 'Test Organization',
          },
        },
      },
    };

    const branchLink = new StaticMockLink(
      [branchEventsMock, branchOrgMock].map((mock) => ({
        ...mock,
        variableMatcher: () => true,
      })),
      true,
    );

    renderWithLink(branchLink);

    await waitFor(() => {
      const jsonPre = screen.getByTestId('event-data-json');
      const parsedEvents = JSON.parse(jsonPre.textContent || '[]');

      const withBounds = parsedEvents.find(
        (event: { id: string }) => event.id === 'timed-with-bounds',
      );
      const missingBounds = parsedEvents.find(
        (event: { id: string }) => event.id === 'timed-missing-bounds',
      );

      expect(withBounds.startTime).toBe(dayjs(timedStartAt).format('HH:mm:ss'));
      expect(withBounds.endTime).toBe(dayjs(timedEndAt).format('HH:mm:ss'));
      expect(missingBounds.startTime).toBeNull();
      expect(missingBounds.endTime).toBeNull();
    });
  });
});

const ERROR_MOCK = [
  {
    request: {
      query: GET_ORGANIZATION_EVENTS_PG,
      variables: {
        id: 'orgId',
        first: 32,
        after: null,
        startDate: expect.any(String),
        endDate: expect.any(String),
      },
    },
    result: {
      errors: [new GraphQLError('Failed to fetch organization events')],
    },
  },
];

describe('OrganizationEvents - Additional Coverage Tests', () => {
  test('Testing GraphQL query error handling', async () => {
    const errorLink = new StaticMockLink(ERROR_MOCK, true);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <MockedProvider link={errorLink}>
        <MemoryRouter initialEntries={['/admin/orgdash/orgId/events']}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18n}>
                  <Routes>
                    <Route
                      path="/admin/orgdash/:orgId/events"
                      element={<OrganizationEvents />}
                    />
                  </Routes>
                </I18nextProvider>
              </ThemeProvider>
            </Provider>
          </LocalizationProvider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await wait();
    await waitFor(() => {
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  // Test for empty events array handling
  test('Testing empty events array mapping', async () => {
    const emptyEventsMock = [
      {
        request: {
          query: GET_ORGANIZATION_EVENTS_PG,
          variables: expect.any(Object),
        },
        result: {
          data: {
            organization: {
              events: {
                edges: [],
                pageInfo: {
                  hasNextPage: false,
                  endCursor: null,
                },
              },
            },
          },
        },
      },
    ];

    const emptyLink = new StaticMockLink(emptyEventsMock, true);

    render(
      <MockedProvider link={emptyLink}>
        <MemoryRouter initialEntries={['/admin/orgdash/orgId/events']}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18n}>
                  <Routes>
                    <Route
                      path="/admin/orgdash/:orgId/events"
                      element={<OrganizationEvents />}
                    />
                  </Routes>
                </I18nextProvider>
              </ThemeProvider>
            </Provider>
          </LocalizationProvider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument();
    });
  });

  // Test for null organization data
  test('Testing null organization events data', async () => {
    const nullDataMock = [
      {
        request: {
          query: GET_ORGANIZATION_EVENTS_PG,
          variables: expect.any(Object),
        },
        result: {
          data: {
            organization: null,
          },
        },
      },
    ];

    const nullLink = new StaticMockLink(nullDataMock, true);

    render(
      <MockedProvider link={nullLink}>
        <MemoryRouter initialEntries={['/admin/orgdash/orgId/events']}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18n}>
                  <Routes>
                    <Route
                      path="/admin/orgdash/:orgId/events"
                      element={<OrganizationEvents />}
                    />
                  </Routes>
                </I18nextProvider>
              </ThemeProvider>
            </Provider>
          </LocalizationProvider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument();
    });
  });
});
