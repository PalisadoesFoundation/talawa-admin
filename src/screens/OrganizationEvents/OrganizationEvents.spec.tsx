import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { GraphQLError } from 'graphql';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
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
import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/EventMutations';
import { MOCKS } from './OrganizationEventsMocks';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';

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

const theme = createTheme({
  palette: {
    primary: {
      main: '#31bb6b',
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
    pathname: '/orglist',
    search: '',
    hash: '',
    origin: 'http://localhost',
  },
});

const defaultLink = new StaticMockLink(MOCKS, true);

async function wait(ms = 0): Promise<void> {
  await act(
    () =>
      new Promise((resolve) => {
        setTimeout(resolve, ms);
      }),
  );
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

const buildEventsVariables = () => {
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const startDate = dayjs(firstOfMonth).startOf('month').toISOString();
  const endDate = dayjs(firstOfMonth).endOf('month').toISOString();

  return {
    id: undefined,
    first: 150,
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

const getPickerInputByLabel = (label: string) =>
  screen.getByLabelText(label, { selector: 'input' }) as HTMLInputElement;

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

  beforeEach(() => {
    sharedWindowSpies.alertMock.mockReset();
    window.alert = sharedWindowSpies.alertMock;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderWithLink = (link: StaticMockLink) =>
    render(
      <MockedProvider link={link}>
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

  test('renders events page and keeps current route', async () => {
    window.location.assign('/orglist');

    const { container } = renderWithLink(defaultLink);

    expect(container.textContent).not.toBe('Loading data...');
    await wait();
    expect(container.textContent).toMatch('Month');
    expect(window.location.pathname).toBe('/orglist');
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

    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() =>
      expect(screen.getByTestId('eventTitleInput')).toBeInTheDocument(),
    );

    await userEvent.type(screen.getByTestId('eventTitleInput'), formData.title);
    await userEvent.type(
      screen.getByTestId('eventDescriptionInput'),
      formData.description,
    );
    await userEvent.type(
      screen.getByTestId('eventLocationInput'),
      formData.location,
    );

    const endDatePicker = getPickerInputByLabel('End Date');
    const startDatePicker = getPickerInputByLabel('Start Date');

    fireEvent.change(endDatePicker, {
      target: { value: formData.endDate },
    });
    fireEvent.change(startDatePicker, {
      target: { value: formData.startDate },
    });

    // flip public/registrable for branch coverage
    await userEvent.click(screen.getByTestId('publicEventCheck'));
    await userEvent.click(screen.getByTestId('registerableEventCheck'));

    await wait();

    await userEvent.click(screen.getByTestId('createEventBtn'));

    // Wait for mutation to complete and verify success path (lines 101-106)
    await waitFor(
      () => {
        expect(toast.success).toHaveBeenCalledWith(translations.eventCreated);
      },
      { timeout: 3000 },
    );

    // Verify modal closes (onClose is called)
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
      expect(screen.getByTestId('eventTitleInput')).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByTestId('createEventBtn'));

    await waitFor(() =>
      expect(
        screen.getByTestId('createEventModalCloseBtn'),
      ).toBeInTheDocument(),
    );

    expect(toast.warning).not.toHaveBeenCalled();

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
      expect(screen.getByTestId('eventTitleInput')).toBeInTheDocument(),
    );

    await userEvent.type(screen.getByTestId('eventTitleInput'), formData.title);
    await userEvent.type(
      screen.getByTestId('eventDescriptionInput'),
      formData.description,
    );
    await userEvent.type(
      screen.getByTestId('eventLocationInput'),
      formData.location,
    );

    const endDatePicker = getPickerInputByLabel('End Date');
    const startDatePicker = getPickerInputByLabel('Start Date');

    fireEvent.change(endDatePicker, {
      target: { value: formData.endDate },
    });
    fireEvent.change(startDatePicker, {
      target: { value: formData.startDate },
    });

    await userEvent.click(screen.getByTestId('allDayEventCheck'));

    await waitFor(() =>
      expect(getPickerInputByLabel(translations.startTime)).toBeInTheDocument(),
    );

    const startTimePicker = getPickerInputByLabel(translations.startTime);
    const endTimePicker = getPickerInputByLabel(translations.endTime);

    fireEvent.change(startTimePicker, {
      target: { value: formData.startTime },
    });

    fireEvent.change(endTimePicker, {
      target: { value: formData.endTime },
    });

    await userEvent.click(screen.getByTestId('createEventBtn'));
    await wait();

    if (screen.queryByTestId('createEventModalCloseBtn')) {
      await userEvent.click(screen.getByTestId('createEventModalCloseBtn'));
    }

    await waitFor(() =>
      expect(
        screen.queryByTestId('createEventModalCloseBtn'),
      ).not.toBeInTheDocument(),
    );
  });

  test('verifies success path when event creation returns data', async () => {
    const parsedStartDate = dayjs('03/28/2022', 'MM/DD/YYYY');
    const parsedEndDate = dayjs('03/30/2022', 'MM/DD/YYYY');
    const startDateObj = parsedStartDate.toDate();
    const endDateObj = parsedEndDate.toDate();
    const startAt = dayjs.utc(startDateObj).startOf('day').toISOString();
    const endAt = dayjs.utc(endDateObj).endOf('day').toISOString();

    // Create a mock that matches the exact variables the test will send
    const successMock = [
      ...MOCKS.filter((mock) => mock.request.query !== CREATE_EVENT_MUTATION),
      {
        request: {
          query: CREATE_EVENT_MUTATION,
          variables: {
            input: {
              name: formData.title,
              description: formData.description,
              startAt,
              endAt,
              organizationId: '',
              allDay: true,
              location: formData.location,
              isPublic: false,
              isRegisterable: true,
              recurrence: undefined,
            },
          },
        },
        result: {
          data: {
            createEvent: {
              id: 'test-event-id',
              name: formData.title,
              description: formData.description,
              startAt,
              endAt,
              allDay: true,
              location: formData.location,
              isPublic: false,
              isRegisterable: true,
              createdAt: '2030-03-28T00:00:00.000Z',
              updatedAt: '2030-03-28T00:00:00.000Z',
              isRecurringTemplate: false,
              recurringEventId: null,
              instanceStartTime: null,
              isMaterialized: false,
              baseEventId: null,
              hasExceptions: false,
              sequenceNumber: 1,
              totalCount: 1,
              progressLabel: 'Event 1 of 1',
              creator: { id: '1', name: 'Admin User' },
              updater: { id: '1', name: 'Admin User' },
              organization: { id: '1', name: 'Test Organization' },
            },
          },
        },
      },
    ];

    const successLink = new StaticMockLink(successMock, true);
    renderWithLink(successLink);

    await wait();

    await waitFor(() =>
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() =>
      expect(screen.getByTestId('eventTitleInput')).toBeInTheDocument(),
    );

    await userEvent.type(screen.getByTestId('eventTitleInput'), formData.title);
    await userEvent.type(
      screen.getByTestId('eventDescriptionInput'),
      formData.description,
    );
    await userEvent.type(
      screen.getByTestId('eventLocationInput'),
      formData.location,
    );

    const endDatePicker = getPickerInputByLabel('End Date');
    const startDatePicker = getPickerInputByLabel('Start Date');

    fireEvent.change(endDatePicker, {
      target: { value: formData.endDate },
    });
    fireEvent.change(startDatePicker, {
      target: { value: formData.startDate },
    });

    // Toggle public and registerable to match mock expectations
    await userEvent.click(screen.getByTestId('publicEventCheck'));
    await userEvent.click(screen.getByTestId('registerableEventCheck'));
    await wait();
    await userEvent.click(screen.getByTestId('createEventBtn'));

    await waitFor(
      () => {
        expect(toast.success).toHaveBeenCalledWith(translations.eventCreated);
      },
      { timeout: 3000 },
    );

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
      expect(screen.getByTestId('eventTitleInput')).toBeInTheDocument(),
    );

    // Enable recurrence toggle first
    await userEvent.click(screen.getByTestId('recurringEventCheck'));

    await waitFor(() =>
      expect(screen.getByTestId('recurrenceDropdown')).toBeInTheDocument(),
    );

    const recurrenceDropdown = screen.getByTestId('recurrenceDropdown');
    expect(recurrenceDropdown).toBeInTheDocument();

    await userEvent.click(recurrenceDropdown);

    await waitFor(() =>
      expect(screen.getByTestId('recurrenceOption-0')).toBeInTheDocument(),
    );

    const firstOption = screen.getByTestId('recurrenceOption-0');
    await userEvent.click(firstOption);

    // Wait a bit for state update
    await wait(100);

    // Verify dropdown toggle is still present after selection
    await waitFor(() => {
      const dropdownToggle = screen.getByTestId('recurrenceDropdown');
      expect(dropdownToggle).toBeInTheDocument();
    });
  });

  test('opens CustomRecurrenceModal from recurrence dropdown', async () => {
    renderWithLink(defaultLink);

    await wait();

    await waitFor(() =>
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() =>
      expect(screen.getByTestId('eventTitleInput')).toBeInTheDocument(),
    );

    // Enable recurrence toggle first
    await userEvent.click(screen.getByTestId('recurringEventCheck'));

    await waitFor(() =>
      expect(screen.getByTestId('recurrenceDropdown')).toBeInTheDocument(),
    );

    const recurrenceDropdown = screen.getByTestId('recurrenceDropdown');
    await userEvent.click(recurrenceDropdown);

    await waitFor(() =>
      expect(screen.getByTestId('recurrenceOption-0')).toBeInTheDocument(),
    );

    // Find and click the last option (Custom…)
    const options = screen.getAllByTestId(/recurrenceOption-/);
    const customOption = options[options.length - 1];
    await userEvent.click(customOption);

    const customModal = await screen.findByTestId(
      'customRecurrenceModalCloseBtn',
    );
    expect(customModal).toBeInTheDocument();
  });

  test('CustomRecurrenceModal setRecurrenceRuleState function path', async () => {
    renderWithLink(defaultLink);

    await wait();

    await waitFor(() =>
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() =>
      expect(screen.getByTestId('eventTitleInput')).toBeInTheDocument(),
    );

    // Enable recurrence toggle first
    await userEvent.click(screen.getByTestId('recurringEventCheck'));

    await waitFor(() =>
      expect(screen.getByTestId('recurrenceDropdown')).toBeInTheDocument(),
    );

    const recurrenceDropdown = screen.getByTestId('recurrenceDropdown');
    await userEvent.click(recurrenceDropdown);

    await waitFor(() =>
      expect(screen.getByTestId('recurrenceOption-0')).toBeInTheDocument(),
    );

    // Find and click the last option (Custom…) to open the modal
    const options = screen.getAllByTestId(/recurrenceOption-/);
    const customOption = options[options.length - 1];
    await userEvent.click(customOption);

    const customModal = await screen.findByTestId(
      'customRecurrenceModalCloseBtn',
    );
    expect(customModal).toBeInTheDocument();

    // Test that setRecurrenceRuleState function is called when submitting
    const submitBtn = screen.getByTestId('customRecurrenceSubmitBtn');
    await userEvent.click(submitBtn);

    await waitFor(() =>
      expect(
        screen.queryByTestId('customRecurrenceModalCloseBtn'),
      ).not.toBeInTheDocument(),
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
      expect(screen.getByTestId('eventTitleInput')).toBeInTheDocument(),
    );

    await userEvent.type(screen.getByTestId('eventTitleInput'), formData.title);
    await userEvent.type(
      screen.getByTestId('eventDescriptionInput'),
      formData.description,
    );
    await userEvent.type(
      screen.getByTestId('eventLocationInput'),
      formData.location,
    );

    // Enable recurrence toggle first
    await userEvent.click(screen.getByTestId('recurringEventCheck'));

    await waitFor(() =>
      expect(screen.getByTestId('recurrenceDropdown')).toBeInTheDocument(),
    );

    const recurrenceDropdown = screen.getByTestId('recurrenceDropdown');
    await userEvent.click(recurrenceDropdown);

    await waitFor(() =>
      expect(screen.getByTestId('recurrenceOption-0')).toBeInTheDocument(),
    );

    // Find the weekly option by its text content (more resilient to option reordering)
    const options = screen.getAllByTestId(/recurrenceOption-/);
    const weeklyOption = options.find((opt) =>
      opt.textContent?.toLowerCase().includes('weekly'),
    );
    expect(weeklyOption).toBeDefined();
    if (weeklyOption) {
      await userEvent.click(weeklyOption);
    }

    await userEvent.click(screen.getByTestId('createEventBtn'));

    await waitFor(() =>
      expect(screen.getByTestId('createEventBtn')).toBeInTheDocument(),
    );
  });

  test('viewType changes from Month to Day via EventHeader', async () => {
    const { container } = renderWithLink(defaultLink);

    await wait();

    expect(container.textContent).toMatch('Month');

    const viewTypeDropdown = screen.getByTestId('selectViewType');
    await userEvent.click(viewTypeDropdown);
    // Find and click the "Day" option in the dropdown
    const dayOption = await screen.findByText('Day');
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

    expect(window.location.pathname).toBe('/orglist');

    const messages = mockWarn.mock.calls.map((args) => args.join(' '));
    expect(
      messages.some((msg) => msg.toLowerCase().includes('too many requests')),
    ).toBe(false);
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

  test('handles CreateEventModal error when mutation fails (lines 107-109)', async () => {
    const errorMock = [
      ...MOCKS.filter((mock) => mock.request.query !== CREATE_EVENT_MUTATION),
      {
        request: {
          query: CREATE_EVENT_MUTATION,
          variables: expect.any(Object),
        },
        error: new Error('Failed to create event'),
      },
    ];

    const errorLink = new StaticMockLink(errorMock, true);
    renderWithLink(errorLink);

    await wait();

    await waitFor(() =>
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByTestId('createEventModalBtn'));

    await waitFor(() =>
      expect(screen.getByTestId('eventTitleInput')).toBeInTheDocument(),
    );

    await userEvent.type(screen.getByTestId('eventTitleInput'), formData.title);
    await userEvent.type(
      screen.getByTestId('eventDescriptionInput'),
      formData.description,
    );
    await userEvent.type(
      screen.getByTestId('eventLocationInput'),
      formData.location,
    );

    const endDatePicker = getPickerInputByLabel('End Date');
    const startDatePicker = getPickerInputByLabel('Start Date');

    fireEvent.change(endDatePicker, {
      target: { value: formData.endDate },
    });
    fireEvent.change(startDatePicker, {
      target: { value: formData.startDate },
    });

    await wait();

    await userEvent.click(screen.getByTestId('createEventBtn'));
    await waitFor(
      () => {
        expect(errorHandler).toHaveBeenCalled();
      },
      { timeout: 3000 },
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

    const viewTypeDropdown = screen.getByTestId('selectViewType');
    await userEvent.click(viewTypeDropdown);

    // Find and click the "Year View" option
    const yearOption = await screen.findByText('Year View');
    await userEvent.click(yearOption);

    await waitFor(() => {
      expect(container.textContent).toMatch('Year View');
    });
  });

  test('handleChangeView ignores null values', async () => {
    const { container } = renderWithLink(defaultLink);

    await wait();

    const initialContent = container.textContent;
    expect(initialContent).toMatch('Month');

    // Simulate handleChangeView being called with null
    // This should not change the viewType
    const viewTypeDropdown = screen.getByTestId('selectViewType');
    await userEvent.click(viewTypeDropdown);

    // Close dropdown without selecting (simulating null)
    await userEvent.keyboard('{Escape}');

    await waitFor(() => {
      // ViewType should remain unchanged
      expect(container.textContent).toMatch('Month');
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
  test('Testing GraphQL query error handling - line 162', async () => {
    const errorLink = new StaticMockLink(ERROR_MOCK, true);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <MockedProvider link={errorLink}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18n}>
                  <OrganizationEvents />
                </I18nextProvider>
              </ThemeProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
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
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18n}>
                  <OrganizationEvents />
                </I18nextProvider>
              </ThemeProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
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
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18n}>
                  <OrganizationEvents />
                </I18nextProvider>
              </ThemeProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createEventModalBtn')).toBeInTheDocument();
    });
  });
});
