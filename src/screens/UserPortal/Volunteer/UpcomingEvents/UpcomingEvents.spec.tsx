/* eslint-disable react/no-multi-comp */
import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DateRangePicker';
import type { RenderResult } from '@testing-library/react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import UpcomingEvents from './UpcomingEvents';
import type { ApolloLink } from '@apollo/client';
import useLocalStorage from 'utils/useLocalstorage';
import {
  USER_EVENTS_VOLUNTEER,
  USER_VOLUNTEER_MEMBERSHIP,
} from 'GraphQl/Queries/EventVolunteerQueries';
import {
  vi,
  beforeEach,
  afterEach,
  describe,
  it,
  expect,
  beforeAll,
} from 'vitest';
import dayjs from 'dayjs';
import {
  MOCKS,
  MEMBERSHIP_LOOKUP_MOCKS,
  EMPTY_MOCKS,
  ERROR_MOCKS,
} from './UpcomingEvents.mocks';

const sharedMocks = vi.hoisted(() => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  useParams: vi.fn(() => ({ orgId: 'orgId' })),
}));

vi.mock('react-toastify', () => ({
  toast: sharedMocks.toast,
}));

vi.mock('@mui/icons-material', async () => {
  const actual = (await vi.importActual('@mui/icons-material')) as Record<
    string,
    unknown
  >;
  return {
    ...actual,
    Circle: () => React.createElement('div', { 'data-testid': 'circle-icon' }),
    WarningAmberRounded: () =>
      React.createElement('div', { 'data-testid': 'warning-icon' }),
    ExpandMore: () =>
      React.createElement('div', { 'data-testid': 'expand-more-icon' }),
    Event: () => React.createElement('div', { 'data-testid': 'event-icon' }),
  };
});

vi.mock('react-icons/io5', () => ({
  IoLocationOutline: () =>
    React.createElement('div', { 'data-testid': 'location-icon' }),
}));

vi.mock('react-icons/io', () => ({
  IoIosHand: () => React.createElement('div', { 'data-testid': 'hand-icon' }),
}));

vi.mock('react-icons/fa', () => ({
  FaCheck: () => React.createElement('div', { 'data-testid': 'check-icon' }),
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: sharedMocks.useParams,
  };
});

const { setItem, clearAllItems } = useLocalStorage();

const renderUpcomingEvents = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider link={link}>
      <MemoryRouter initialEntries={['/user/volunteer/orgId']}>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route
                  path="/user/volunteer/:orgId"
                  element={<UpcomingEvents />}
                />
                <Route
                  path="/"
                  element={<div data-testid="paramsError"></div>}
                />
              </Routes>
            </I18nextProvider>
          </LocalizationProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );
};

describe('UpcomingEvents', () => {
  beforeAll(() => {
    // Ensure i18n has necessary keys for tests
    i18n.addResourceBundle('en', 'translation', {
      userVolunteer: {
        noEvents: 'No upcoming events',
        description: 'Description',
        location: 'Location',
        startDate: 'Start Date',
        endDate: 'End Date',
        recurrence: 'Recurrence',
        volunteerGroups: 'Volunteer Groups',
        groupsAvailable: '{{count}} groups available',
        volunteersRequired: 'Required',
        signedUp: 'Signed up',
        name: 'Name',
        join: 'Join',
        volunteer: 'Volunteer',
        pending: 'Pending',
        joined: 'Joined',
        volunteered: 'Volunteered',
        rejected: 'Rejected',
        titleOrLocation: 'title or location',
        notSpecified: 'Not specified',
      },
    });
    i18n.addResourceBundle('en', 'common', {
      searchBy: 'Search by',
      location: 'Location',
    });
    i18n.addResourceBundle('en', 'errors', {
      errorLoading: 'Error loading {{entity}}',
    });
  });

  beforeEach(() => {
    setItem('userId', 'userId');
    sharedMocks.useParams.mockReturnValue({ orgId: 'orgId' });
  });

  afterEach(() => {
    vi.clearAllMocks();
    clearAllItems();
  });

  it('navigates to home if no orgId', () => {
    sharedMocks.useParams.mockReturnValue({ orgId: '' });
    const link = new StaticMockLink(EMPTY_MOCKS);
    renderUpcomingEvents(link);
    expect(screen.getByTestId('paramsError')).toBeInTheDocument();
  });

  it('navigates to home if no userId', () => {
    clearAllItems();
    const link = new StaticMockLink(EMPTY_MOCKS);
    renderUpcomingEvents(link);
    expect(screen.getByTestId('paramsError')).toBeInTheDocument();
  });

  it('shows loader while loading', () => {
    const link = new StaticMockLink([]); // No matching mocks, remains loading
    renderUpcomingEvents(link);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('displays error when events fail to load', async () => {
    const link = new StaticMockLink(ERROR_MOCKS);
    renderUpcomingEvents(link);
    await waitFor(() => {
      expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
    });
  });

  it('displays no events message when list is empty', async () => {
    const link = new StaticMockLink(EMPTY_MOCKS);
    renderUpcomingEvents(link);
    await waitFor(() => {
      expect(screen.getByTestId('events-empty-state')).toBeInTheDocument();
      expect(
        screen.getByTestId('events-empty-state-message'),
      ).toHaveTextContent(/no upcoming events/i);
    });
  });

  it('renders SearchFilterBar with correct props', async () => {
    const link = new StaticMockLink(MOCKS);
    renderUpcomingEvents(link);
    await waitFor(() => {
      expect(screen.getByTestId('searchByInput')).toBeInTheDocument();
    });
  });

  it('handles multiple events in the list', async () => {
    const link = new StaticMockLink(MOCKS);
    renderUpcomingEvents(link);
    await waitFor(() => {
      const titles = screen.getAllByTestId('eventTitle');
      expect(titles.length).toBeGreaterThan(1);
    });
  });

  it('displays non-recurring event dates', async () => {
    const nonRecurringMocks = [
      {
        request: {
          query: USER_EVENTS_VOLUNTEER,
          variables: { organizationId: 'orgId', upcomingOnly: true, first: 30 },
        },
        result: {
          data: {
            organization: {
              id: 'orgId',
              events: {
                edges: [
                  {
                    node: {
                      id: 'event1',
                      name: 'One-time Event',
                      description: 'A single event',
                      startAt: dayjs().add(30, 'days').toISOString(),
                      endAt: dayjs().add(31, 'days').toISOString(),
                      location: 'Downtown',
                      isRecurringEventTemplate: false,
                      baseEvent: null,
                      recurrenceRule: null,
                      volunteerGroups: [],
                      volunteers: [],
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
          query: USER_VOLUNTEER_MEMBERSHIP,
          variables: { where: { userId: 'userId' } },
        },
        result: {
          data: { getVolunteerMembership: [] },
        },
      },
    ];
    const link = new StaticMockLink(nonRecurringMocks);
    renderUpcomingEvents(link);
    await waitFor(() => {
      const expandIcon = screen.getByTestId('expand-more-icon');
      expect(expandIcon).toBeInTheDocument();
    });
    const accordionSummary = screen.getByRole('button', {
      name: /one-time event/i,
    });
    await userEvent.click(accordionSummary);
    await waitFor(() => {
      expect(accordionSummary).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText(/start date/i)).toBeInTheDocument();
      expect(screen.getByText(/end date/i)).toBeInTheDocument();
    });
  });

  it('displays recurring event frequency', async () => {
    const recurringMocks = [
      {
        request: {
          query: USER_EVENTS_VOLUNTEER,
          variables: { organizationId: 'orgId', upcomingOnly: true, first: 30 },
        },
        result: {
          data: {
            organization: {
              id: 'orgId',
              events: {
                edges: [
                  {
                    node: {
                      id: 'event1',
                      name: 'Weekly Cleanup',
                      description: null,
                      startAt: dayjs().add(30, 'days').toISOString(),
                      endAt: dayjs().add(31, 'days').toISOString(),
                      location: 'Downtown',
                      isRecurringEventTemplate: true,
                      baseEvent: null,
                      recurrenceRule: {
                        frequency: 'WEEKLY',
                      },
                      volunteerGroups: [],
                      volunteers: [],
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
          query: USER_VOLUNTEER_MEMBERSHIP,
          variables: { where: { userId: 'userId' } },
        },
        result: {
          data: { getVolunteerMembership: [] },
        },
      },
    ];
    const link = new StaticMockLink(recurringMocks);
    renderUpcomingEvents(link);
    await waitFor(() => {
      screen.getByText('Weekly Cleanup');
    });
    const accordionSummary = screen.getByRole('button', {
      name: /weekly cleanup/i,
    });
    await userEvent.click(accordionSummary);
    await waitFor(() => {
      expect(accordionSummary).toHaveAttribute('aria-expanded', 'true');
    });
    await waitFor(() => {
      expect(screen.getByText(/recurrence/i)).toBeInTheDocument();
      // Use getAllByText since "WEEKLY" appears in both the title and the recurrence field
      const weeklyTexts = screen.getAllByText(/WEEKLY/i);
      expect(weeklyTexts.length).toBeGreaterThan(0);
    });
  });

  it('should not render description section when description is null', async () => {
    const noDescMocks = [
      {
        request: {
          query: USER_EVENTS_VOLUNTEER,
          variables: { organizationId: 'orgId', upcomingOnly: true, first: 30 },
        },
        result: {
          data: {
            organization: {
              id: 'orgId',
              events: {
                edges: [
                  {
                    node: {
                      id: 'event1',
                      name: 'No Desc Event',
                      description: null,
                      startAt: dayjs().add(30, 'days').toISOString(),
                      endAt: dayjs().add(31, 'days').toISOString(),
                      location: 'Downtown',
                      isRecurringEventTemplate: false,
                      baseEvent: null,
                      recurrenceRule: null,
                      volunteerGroups: [],
                      volunteers: [],
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
          query: USER_VOLUNTEER_MEMBERSHIP,
          variables: { where: { userId: 'userId' } },
        },
        result: {
          data: { getVolunteerMembership: [] },
        },
      },
    ];
    const link = new StaticMockLink(noDescMocks);
    renderUpcomingEvents(link);
    await waitFor(() => {
      screen.getByText('No Desc Event');
    });
    const accordionSummary = screen.getByRole('button', {
      name: /no desc event/i,
    });
    await userEvent.click(accordionSummary);
    expect(screen.queryByText(/Description:/i)).not.toBeInTheDocument();
  });

  describe('volunteer status buttons', () => {
    it('displays volunteer button for no membership', async () => {
      const link = new StaticMockLink(MOCKS);
      renderUpcomingEvents(link);
      await waitFor(() => {
        const btn = screen.getByTestId('eventVolunteerBtn-0');
        expect(btn).toHaveTextContent(/volunteer/i);
        expect(btn).not.toBeDisabled();
      });
    });

    it('displays pending button for requested/invited status', async () => {
      const requestedMocks = [
        {
          request: {
            query: USER_EVENTS_VOLUNTEER,
            variables: {
              organizationId: 'orgId',
              upcomingOnly: true,
              first: 30,
            },
          },
          result: {
            data: {
              organization: {
                id: 'orgId',
                events: {
                  edges: [
                    {
                      node: {
                        id: 'eventId1',
                        name: 'Requested Event',
                        startAt: dayjs().add(30, 'days').toISOString(),
                        endAt: dayjs().add(31, 'days').toISOString(),
                        location: 'Location',
                        isRecurringEventTemplate: false,
                        baseEvent: null,
                        recurrenceRule: null,
                        volunteerGroups: [],
                        volunteers: [],
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
            query: USER_VOLUNTEER_MEMBERSHIP,
            variables: { where: { userId: 'userId' } },
          },
          result: {
            data: {
              getVolunteerMembership: [
                {
                  id: 'membership1',
                  status: 'requested',
                  event: { id: 'eventId1' },
                  group: null,
                },
              ],
            },
          },
        },
      ];
      const link = new StaticMockLink(requestedMocks);
      renderUpcomingEvents(link);
      await waitFor(() => {
        const btn = screen.getByTestId('eventVolunteerBtn-0');
        expect(btn).toHaveTextContent(/pending/i);
        expect(btn).toBeDisabled();
        // Verify StatusBadge renders for the requested status
        const statusBadge = screen.getByTestId('event-status-0');
        expect(statusBadge).toBeInTheDocument();
      });
    });

    it('displays volunteered button for accepted status without group', async () => {
      const acceptedMocks = [
        {
          request: {
            query: USER_EVENTS_VOLUNTEER,
            variables: {
              organizationId: 'orgId',
              upcomingOnly: true,
              first: 30,
            },
          },
          result: {
            data: {
              organization: {
                id: 'orgId',
                events: {
                  edges: [
                    {
                      node: {
                        id: 'eventId1',
                        name: 'Accepted Event',
                        startAt: dayjs().add(30, 'days').toISOString(),
                        endAt: dayjs().add(31, 'days').toISOString(),
                        location: 'Location',
                        isRecurringEventTemplate: false,
                        baseEvent: null,
                        recurrenceRule: null,
                        volunteerGroups: [],
                        volunteers: [],
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
            query: USER_VOLUNTEER_MEMBERSHIP,
            variables: { where: { userId: 'userId' } },
          },
          result: {
            data: {
              getVolunteerMembership: [
                {
                  id: 'm1',
                  status: 'accepted',
                  event: { id: 'eventId1' },
                  group: null,
                },
              ],
            },
          },
        },
      ];
      const link = new StaticMockLink(acceptedMocks);
      renderUpcomingEvents(link);
      await waitFor(() => {
        const btn = screen.getByTestId('eventVolunteerBtn-0');
        expect(btn).toHaveTextContent(/volunteered/i);
        expect(btn).toBeDisabled();
      });
    });

    it('displays rejected button for rejected status', async () => {
      const rejectedMocks = [
        {
          request: {
            query: USER_EVENTS_VOLUNTEER,
            variables: {
              organizationId: 'orgId',
              upcomingOnly: true,
              first: 30,
            },
          },
          result: {
            data: {
              organization: {
                id: 'orgId',
                events: {
                  edges: [
                    {
                      node: {
                        id: 'eventId1',
                        name: 'Rejected Event',
                        startAt: dayjs().add(30, 'days').toISOString(),
                        endAt: dayjs().add(31, 'days').toISOString(),
                        location: 'Location',
                        isRecurringEventTemplate: false,
                        baseEvent: null,
                        recurrenceRule: null,
                        volunteerGroups: [],
                        volunteers: [],
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
            query: USER_VOLUNTEER_MEMBERSHIP,
            variables: { where: { userId: 'userId' } },
          },
          result: {
            data: {
              getVolunteerMembership: [
                {
                  id: 'm1',
                  status: 'rejected',
                  event: { id: 'eventId1' },
                  group: null,
                },
              ],
            },
          },
        },
      ];
      const link = new StaticMockLink(rejectedMocks);
      renderUpcomingEvents(link);
      await waitFor(() => {
        const btn = screen.getByTestId('eventVolunteerBtn-0');
        expect(btn).toHaveTextContent(/rejected/i);
        expect(btn).toBeDisabled();
      });
    });

    it('handles unknown membership status with default case', async () => {
      const unknownMocks = [
        {
          request: {
            query: USER_EVENTS_VOLUNTEER,
            variables: {
              organizationId: 'orgId',
              upcomingOnly: true,
              first: 30,
            },
          },
          result: {
            data: {
              organization: {
                id: 'orgId',
                events: {
                  edges: [
                    {
                      node: {
                        id: 'eventId1',
                        name: 'Unknown Status Event',
                        startAt: dayjs().add(30, 'days').toISOString(),
                        endAt: dayjs().add(31, 'days').toISOString(),
                        location: 'Location',
                        isRecurringEventTemplate: false,
                        baseEvent: null,
                        recurrenceRule: null,
                        volunteerGroups: [],
                        volunteers: [],
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
            query: USER_VOLUNTEER_MEMBERSHIP,
            variables: { where: { userId: 'userId' } },
          },
          result: {
            data: {
              getVolunteerMembership: [
                {
                  id: 'm1',
                  status: 'unknown',
                  event: { id: 'eventId1' },
                  group: null,
                },
              ],
            },
          },
        },
      ];
      const link = new StaticMockLink(unknownMocks);
      renderUpcomingEvents(link);
      await waitFor(() => {
        const btn = screen.getByTestId('eventVolunteerBtn-0');
        expect(btn).toHaveTextContent(/volunteer/i);
        expect(btn).not.toBeDisabled();
      });
    });
  });

  describe('volunteer groups', () => {
    it('displays volunteer groups count when present', async () => {
      const groupsMocks = [
        {
          request: {
            query: USER_EVENTS_VOLUNTEER,
            variables: {
              organizationId: 'orgId',
              upcomingOnly: true,
              first: 30,
            },
          },
          result: {
            data: {
              organization: {
                id: 'orgId',
                events: {
                  edges: [
                    {
                      node: {
                        id: 'event1',
                        name: 'Event with Groups',
                        startAt: dayjs().add(30, 'days').toISOString(),
                        endAt: dayjs().add(31, 'days').toISOString(),
                        location: 'Location',
                        isRecurringEventTemplate: false,
                        baseEvent: null,
                        recurrenceRule: null,
                        volunteerGroups: [
                          {
                            id: 'g1',
                            name: 'Group 1',
                            volunteersRequired: 5,
                            volunteers: [],
                            description: 'Desc',
                          },
                          {
                            id: 'g2',
                            name: 'Group 2',
                            volunteersRequired: 3,
                            volunteers: [{}],
                            description: null,
                          },
                        ],
                        volunteers: [],
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
            query: USER_VOLUNTEER_MEMBERSHIP,
            variables: { where: { userId: 'userId' } },
          },
          result: {
            data: { getVolunteerMembership: [] },
          },
        },
      ];
      const link = new StaticMockLink(groupsMocks);
      renderUpcomingEvents(link);
      await waitFor(() => {
        screen.getByText('Event with Groups');
      });
      const accordionSummary = screen.getByRole('button', {
        name: /event with groups/i,
      });
      await userEvent.click(accordionSummary);
      await waitFor(() => {
        expect(screen.getByText(/2 groups available/i)).toBeInTheDocument();
      });
    });

    it('renders volunteer groups with join buttons and details', async () => {
      const groupsMocks = [
        {
          request: {
            query: USER_EVENTS_VOLUNTEER,
            variables: {
              organizationId: 'orgId',
              upcomingOnly: true,
              first: 30,
            },
          },
          result: {
            data: {
              organization: {
                id: 'orgId',
                events: {
                  edges: [
                    {
                      node: {
                        id: 'event1',
                        name: 'Event with Groups',
                        startAt: dayjs().add(30, 'days').toISOString(),
                        endAt: dayjs().add(31, 'days').toISOString(),
                        location: 'Location',
                        isRecurringEventTemplate: false,
                        baseEvent: null,
                        recurrenceRule: null,
                        volunteerGroups: [
                          {
                            id: 'g1',
                            name: 'Setup Team',
                            description: 'Setup volunteers',
                            volunteersRequired: 5,
                            volunteers: [{ id: 'v1' }, { id: 'v2' }],
                          },
                          {
                            id: 'g2',
                            name: 'Cleanup Team',
                            description: null,
                            volunteersRequired: 3,
                            volunteers: [],
                          },
                        ],
                        volunteers: [],
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
            query: USER_VOLUNTEER_MEMBERSHIP,
            variables: { where: { userId: 'userId' } },
          },
          result: {
            data: { getVolunteerMembership: [] },
          },
        },
      ];
      const link = new StaticMockLink(groupsMocks);
      renderUpcomingEvents(link);
      await waitFor(() => {
        screen.getByText('Event with Groups');
      });
      const accordionSummary = screen.getByRole('button', {
        name: /event with groups/i,
      });
      await userEvent.click(accordionSummary);
      await waitFor(() => {
        expect(screen.getByText('Volunteer Groups')).toBeInTheDocument();
        expect(screen.getByText('Setup Team')).toBeInTheDocument();
        expect(screen.getByText('Setup volunteers')).toBeInTheDocument();
        expect(
          screen.getByText('Required: 5, Signed up: 2'),
        ).toBeInTheDocument();
        expect(screen.getByText('Cleanup Team')).toBeInTheDocument();
        expect(screen.queryByText('Cleanup desc')).not.toBeInTheDocument(); // no desc
        expect(
          screen.getByText('Required: 3, Signed up: 0'),
        ).toBeInTheDocument();
        const joinBtns = screen.getAllByRole('button', { name: /join/i });
        expect(joinBtns.length).toBe(2);
      });
    });

    it('displays join button for group with no membership (default case)', async () => {
      const groupNoMembershipMocks = [
        {
          request: {
            query: USER_EVENTS_VOLUNTEER,
            variables: {
              organizationId: 'orgId',
              upcomingOnly: true,
              first: 30,
            },
          },
          result: {
            data: {
              organization: {
                id: 'orgId',
                events: {
                  edges: [
                    {
                      node: {
                        id: 'event1',
                        name: 'Event with Group',
                        startAt: dayjs().add(30, 'days').toISOString(),
                        endAt: dayjs().add(31, 'days').toISOString(),
                        location: 'Location',
                        isRecurringEventTemplate: false,
                        baseEvent: null,
                        recurrenceRule: null,
                        volunteerGroups: [
                          {
                            id: 'g1',
                            name: 'Test Group',
                            description: 'Test description',
                            volunteersRequired: 5,
                            volunteers: [],
                          },
                        ],
                        volunteers: [],
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
            query: USER_VOLUNTEER_MEMBERSHIP,
            variables: { where: { userId: 'userId' } },
          },
          result: {
            data: { getVolunteerMembership: [] },
          },
        },
      ];
      const link = new StaticMockLink(groupNoMembershipMocks);
      renderUpcomingEvents(link);
      await waitFor(() => {
        screen.getByText('Event with Group');
      });
      const accordionSummary = screen.getByRole('button', {
        name: /event with group/i,
      });
      await userEvent.click(accordionSummary);
      await waitFor(() => {
        const joinBtn = screen.getByTestId('groupVolunteerBtn-g1');
        expect(joinBtn).toHaveTextContent(/join/i);
        expect(joinBtn).not.toBeDisabled();
      });
    });

    it('displays join button for group with unknown status (default case)', async () => {
      const groupUnknownStatusMocks = [
        {
          request: {
            query: USER_EVENTS_VOLUNTEER,
            variables: {
              organizationId: 'orgId',
              upcomingOnly: true,
              first: 30,
            },
          },
          result: {
            data: {
              organization: {
                id: 'orgId',
                events: {
                  edges: [
                    {
                      node: {
                        id: 'event1',
                        name: 'Event with Group Unknown Status',
                        startAt: dayjs().add(30, 'days').toISOString(),
                        endAt: dayjs().add(31, 'days').toISOString(),
                        location: 'Location',
                        isRecurringEventTemplate: false,
                        baseEvent: null,
                        recurrenceRule: null,
                        volunteerGroups: [
                          {
                            id: 'g1',
                            name: 'Group with Unknown Status',
                            description: 'Test',
                            volunteersRequired: 5,
                            volunteers: [],
                          },
                        ],
                        volunteers: [],
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
            query: USER_VOLUNTEER_MEMBERSHIP,
            variables: { where: { userId: 'userId' } },
          },
          result: {
            data: {
              getVolunteerMembership: [
                {
                  id: 'm1',
                  status: 'someUnknownStatus',
                  event: { id: 'event1' },
                  group: { id: 'g1' },
                },
              ],
            },
          },
        },
      ];
      const link = new StaticMockLink(groupUnknownStatusMocks);
      renderUpcomingEvents(link);
      await waitFor(() => {
        screen.getByText('Event with Group Unknown Status');
      });
      const accordionSummary = screen.getByRole('button', {
        name: /event with group unknown status/i,
      });
      await userEvent.click(accordionSummary);
      await waitFor(() => {
        const joinBtn = screen.getByTestId('groupVolunteerBtn-g1');
        // Default case should return "Join" for groups
        expect(joinBtn).toHaveTextContent(/join/i);
        expect(joinBtn).not.toBeDisabled();
      });
    });

    it('displays joined button for accepted group status', async () => {
      const groupAcceptedMocks = [
        {
          request: {
            query: USER_EVENTS_VOLUNTEER,
            variables: {
              organizationId: 'orgId',
              upcomingOnly: true,
              first: 30,
            },
          },
          result: {
            data: {
              organization: {
                id: 'orgId',
                events: {
                  edges: [
                    {
                      node: {
                        id: 'event1',
                        name: 'Event with Joined Group',
                        startAt: dayjs().add(30, 'days').toISOString(),
                        endAt: dayjs().add(31, 'days').toISOString(),
                        location: 'Location',
                        isRecurringEventTemplate: false,
                        baseEvent: null,
                        recurrenceRule: null,
                        volunteerGroups: [
                          {
                            id: 'g1',
                            name: 'Joined Group',
                            volunteersRequired: 1,
                            volunteers: [],
                            description: null,
                          },
                        ],
                        volunteers: [],
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
            query: USER_VOLUNTEER_MEMBERSHIP,
            variables: { where: { userId: 'userId' } },
          },
          result: {
            data: {
              getVolunteerMembership: [
                {
                  id: 'm1',
                  status: 'accepted',
                  event: { id: 'event1' },
                  group: { id: 'g1' },
                },
              ],
            },
          },
        },
      ];
      const link = new StaticMockLink(groupAcceptedMocks);
      renderUpcomingEvents(link);
      await waitFor(() => {
        screen.getByText('Event with Joined Group');
      });
      const accordionSummary = screen.getByRole('button', {
        name: /event with joined group/i,
      });
      await userEvent.click(accordionSummary);
      await waitFor(() => {
        const btn = screen.getByTestId('groupVolunteerBtn-g1');
        expect(btn).toHaveTextContent(/joined/i);
        expect(btn).toBeDisabled();
        // Verify StatusBadge renders for the accepted group status
        const groupStatusBadge = screen.getByTestId('group-status-g1');
        expect(groupStatusBadge).toBeInTheDocument();
      });
    });
  });

  describe('membership inheritance for recurring instances', () => {
    it('inherits membership from base event for recurring instance', async () => {
      const link = new StaticMockLink(MEMBERSHIP_LOOKUP_MOCKS);
      renderUpcomingEvents(link);
      await waitFor(() => {
        const btn = screen.getByTestId('eventVolunteerBtn-0');
        expect(btn).toBeDisabled();
        expect(btn).toHaveTextContent(/volunteered/i);
      });
    });

    it('inherits group membership from base event', async () => {
      const updatedMocks = [
        {
          request: {
            query: USER_EVENTS_VOLUNTEER,
            variables: {
              organizationId: 'orgId',
              upcomingOnly: true,
              first: 30,
            },
          },
          result: {
            data: {
              organization: {
                id: 'orgId',
                events: {
                  edges: [
                    {
                      node: {
                        id: 'instanceId',
                        name: 'Instance with Group',
                        baseEvent: {
                          id: 'baseEventId1',
                          isRecurringEventTemplate: true,
                        },
                        volunteerGroups: [
                          {
                            id: 'g1',
                            name: 'Inherited Group',
                            volunteersRequired: 1,
                            volunteers: [],
                            description: null,
                          },
                        ],
                        startAt: dayjs().add(30, 'days').toISOString(),
                        endAt: dayjs().add(31, 'days').toISOString(),
                        location: 'Downtown',
                        isRecurringEventTemplate: false,
                        recurrenceRule: {
                          frequency: 'WEEKLY',
                        },
                        volunteers: [],
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
            query: USER_VOLUNTEER_MEMBERSHIP,
            variables: { where: { userId: 'userId' } },
          },
          result: {
            data: {
              getVolunteerMembership: [
                {
                  id: 'baseMembership',
                  status: 'accepted',
                  event: { id: 'baseEventId1' },
                  group: { id: 'g1', name: 'Inherited Group' },
                },
              ],
            },
          },
        },
      ];
      const link = new StaticMockLink(updatedMocks);
      renderUpcomingEvents(link);
      await waitFor(() => {
        screen.getByText('Instance with Group');
      });
      const accordionSummary = screen.getByRole('button', {
        name: /instance with group/i,
      });
      await userEvent.click(accordionSummary);
      await waitFor(() => {
        const btn = screen.getByTestId('groupVolunteerBtn-g1');
        expect(btn).toBeDisabled();
        expect(btn).toHaveTextContent(/joined/i);
      });
    });

    it('does not override existing instance-specific membership with base event membership', async () => {
      const noOverrideMocks = [
        {
          request: {
            query: USER_EVENTS_VOLUNTEER,
            variables: {
              organizationId: 'orgId',
              upcomingOnly: true,
              first: 30,
            },
          },
          result: {
            data: {
              organization: {
                id: 'orgId',
                events: {
                  edges: [
                    {
                      node: {
                        id: 'instanceId1',
                        name: 'Instance with Own Membership',
                        baseEvent: {
                          id: 'baseEventId1',
                          isRecurringEventTemplate: true,
                        },
                        volunteerGroups: [],
                        startAt: dayjs().add(30, 'days').toISOString(),
                        endAt: dayjs().add(31, 'days').toISOString(),
                        location: 'Downtown',
                        isRecurringEventTemplate: false,
                        recurrenceRule: null,
                        volunteers: [],
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
            query: USER_VOLUNTEER_MEMBERSHIP,
            variables: { where: { userId: 'userId' } },
          },
          result: {
            data: {
              getVolunteerMembership: [
                {
                  id: 'instanceMembership',
                  status: 'rejected',
                  event: { id: 'instanceId1' },
                  group: null,
                },
                {
                  id: 'baseMembership',
                  status: 'accepted',
                  event: { id: 'baseEventId1' },
                  group: null,
                },
              ],
            },
          },
        },
      ];
      const link = new StaticMockLink(noOverrideMocks);
      renderUpcomingEvents(link);
      await waitFor(() => {
        const btn = screen.getByTestId('eventVolunteerBtn-0');
        // Should show rejected status from instance-specific membership, not accepted from base
        expect(btn).toHaveTextContent(/rejected/i);
        expect(btn).toBeDisabled();
      });
    });

    it('adds base event membership to lookup when instance key does not exist', async () => {
      const addToLookupMocks = [
        {
          request: {
            query: USER_EVENTS_VOLUNTEER,
            variables: {
              organizationId: 'orgId',
              upcomingOnly: true,
              first: 30,
            },
          },
          result: {
            data: {
              organization: {
                id: 'orgId',
                events: {
                  edges: [
                    {
                      node: {
                        id: 'instanceId2',
                        name: 'Instance Inheriting Membership',
                        baseEvent: {
                          id: 'baseEventId2',
                          isRecurringEventTemplate: true,
                        },
                        volunteerGroups: [],
                        startAt: dayjs().add(30, 'days').toISOString(),
                        endAt: dayjs().add(31, 'days').toISOString(),
                        location: 'Downtown',
                        isRecurringEventTemplate: false,
                        recurrenceRule: null,
                        volunteers: [],
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
            query: USER_VOLUNTEER_MEMBERSHIP,
            variables: { where: { userId: 'userId' } },
          },
          result: {
            data: {
              getVolunteerMembership: [
                {
                  id: 'baseMembership',
                  status: 'accepted',
                  event: { id: 'baseEventId2' },
                  group: null,
                },
              ],
            },
          },
        },
      ];
      const link = new StaticMockLink(addToLookupMocks);
      renderUpcomingEvents(link);
      await waitFor(() => {
        const btn = screen.getByTestId('eventVolunteerBtn-0');
        // Should inherit accepted status from base event since instance has no membership
        expect(btn).toHaveTextContent(/volunteered/i);
        expect(btn).toBeDisabled();
      });
    });
  });

  describe('handleVolunteerClick and modal', () => {
    it('calls handleVolunteerClick for event and opens modal', async () => {
      const eventModalMocks = [
        {
          request: {
            query: USER_EVENTS_VOLUNTEER,
            variables: {
              organizationId: 'orgId',
              upcomingOnly: true,
              first: 30,
            },
          },
          result: {
            data: {
              organization: {
                id: 'orgId',
                events: {
                  edges: [
                    {
                      node: {
                        id: 'event1',
                        name: 'Test Event',
                        startAt: dayjs().toISOString(),
                        endAt: dayjs().add(8, 'hours').toISOString(),
                        location: 'Test Location',
                        isRecurringEventTemplate: false,
                        baseEvent: null,
                        recurrenceRule: null,
                        volunteerGroups: [],
                        volunteers: [],
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
            query: USER_VOLUNTEER_MEMBERSHIP,
            variables: { where: { userId: 'userId' } },
          },
          result: {
            data: { getVolunteerMembership: [] },
          },
        },
      ];
      const link = new StaticMockLink(eventModalMocks);
      renderUpcomingEvents(link);
      await waitFor(() => {
        expect(screen.getByText('Test Event')).toBeInTheDocument();
      });
      const volunteerBtn = screen.getByTestId('eventVolunteerBtn-0');
      await userEvent.click(volunteerBtn);
      await waitFor(() => {
        expect(screen.getByTestId('recurringEventModal')).toBeInTheDocument();
        expect(screen.getByTestId('recurringEventModal')).toHaveTextContent(
          'Test Event',
        );
      });
    });

    it('calls handleVolunteerClick for group and opens modal with group details', async () => {
      const groupsMocks = [
        {
          request: {
            query: USER_EVENTS_VOLUNTEER,
            variables: {
              organizationId: 'orgId',
              upcomingOnly: true,
              first: 30,
            },
          },
          result: {
            data: {
              organization: {
                id: 'orgId',
                events: {
                  edges: [
                    {
                      node: {
                        id: 'event1',
                        name: 'Group Event',
                        startAt: dayjs().toISOString(),
                        endAt: dayjs().add(8, 'hours').toISOString(),
                        location: 'Test Location',
                        isRecurringEventTemplate: false,
                        baseEvent: null,
                        recurrenceRule: null,
                        volunteerGroups: [
                          {
                            id: 'g1',
                            name: 'Test Group',
                            volunteersRequired: 1,
                            volunteers: [],
                            description: null,
                          },
                        ],
                        volunteers: [],
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
            query: USER_VOLUNTEER_MEMBERSHIP,
            variables: { where: { userId: 'userId' } },
          },
          result: {
            data: { getVolunteerMembership: [] },
          },
        },
      ];
      const link = new StaticMockLink(groupsMocks);
      renderUpcomingEvents(link);
      await waitFor(() => {
        screen.getByText('Group Event');
      });
      const accordionSummary = screen.getByRole('button', {
        name: /group event/i,
      });
      await userEvent.click(accordionSummary);
      const groupBtn = screen.getByTestId('groupVolunteerBtn-g1');
      await userEvent.click(groupBtn);
      await waitFor(() => {
        expect(screen.getByTestId('recurringEventModal')).toBeInTheDocument();
        expect(screen.getByTestId('recurringEventModal')).toHaveTextContent(
          'Test Group',
        );
      });
    });

    it('handles recurring event volunteer click', async () => {
      const recurringMocks = [
        {
          request: {
            query: USER_EVENTS_VOLUNTEER,
            variables: {
              organizationId: 'orgId',
              upcomingOnly: true,
              first: 30,
            },
          },
          result: {
            data: {
              organization: {
                id: 'orgId',
                events: {
                  edges: [
                    {
                      node: {
                        id: 'recurringId',
                        name: 'Recurring Event',
                        startAt: dayjs().add(30, 'days').toISOString(),
                        endAt: dayjs().add(31, 'days').toISOString(),
                        location: 'Test Location',
                        isRecurringEventTemplate: true,
                        recurrenceRule: { frequency: 'WEEKLY' },
                        volunteerGroups: [],
                        volunteers: [],
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
            query: USER_VOLUNTEER_MEMBERSHIP,
            variables: { where: { userId: 'userId' } },
          },
          result: {
            data: { getVolunteerMembership: [] },
          },
        },
      ];
      const link = new StaticMockLink(recurringMocks);
      renderUpcomingEvents(link);
      await waitFor(() => {
        screen.getByText('Recurring Event');
      });
      const volunteerBtn = screen.getByTestId('eventVolunteerBtn-0');
      await userEvent.click(volunteerBtn);
      await waitFor(() => {
        expect(screen.getByTestId('recurringEventModal')).toBeInTheDocument();
        expect(screen.getByTestId('recurringEventModal')).toHaveTextContent(
          'Recurring Event',
        );
      });
    });

    it('closes modal when onHide is called', async () => {
      const eventModalMocks = [
        {
          request: {
            query: USER_EVENTS_VOLUNTEER,
            variables: {
              organizationId: 'orgId',
              upcomingOnly: true,
              first: 30,
            },
          },
          result: {
            data: {
              organization: {
                id: 'orgId',
                events: {
                  edges: [
                    {
                      node: {
                        id: 'event1',
                        name: 'Test Event',
                        startAt: dayjs().toISOString(),
                        endAt: dayjs().add(8, 'hours').toISOString(),
                        location: 'Test Location',
                        isRecurringEventTemplate: false,
                        baseEvent: null,
                        recurrenceRule: null,
                        volunteerGroups: [],
                        volunteers: [],
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
            query: USER_VOLUNTEER_MEMBERSHIP,
            variables: { where: { userId: 'userId' } },
          },
          result: {
            data: { getVolunteerMembership: [] },
          },
        },
      ];
      const link = new StaticMockLink(eventModalMocks);
      renderUpcomingEvents(link);
      await waitFor(() => {
        expect(screen.getByText('Test Event')).toBeInTheDocument();
      });
      const volunteerBtn = screen.getByTestId('eventVolunteerBtn-0');
      await userEvent.click(volunteerBtn);
      await waitFor(() => {
        expect(screen.getByTestId('recurringEventModal')).toBeInTheDocument();
      });
      // Close the modal using the Cancel button
      const cancelBtn = screen.getByRole('button', { name: /cancel/i });
      await userEvent.click(cancelBtn);
      await waitFor(() => {
        expect(
          screen.queryByTestId('recurringEventModal'),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('search and filter', () => {
    const searchMocks = [
      {
        request: {
          query: USER_EVENTS_VOLUNTEER,
          variables: { organizationId: 'orgId', upcomingOnly: true, first: 30 },
        },
        result: {
          data: {
            organization: {
              id: 'orgId',
              events: {
                edges: [
                  {
                    node: {
                      id: 'e1',
                      name: 'Beach Cleanup',
                      location: 'Park',
                      startAt: dayjs().add(30, 'days').toISOString(),
                      endAt: dayjs().add(31, 'days').toISOString(),
                      isRecurringEventTemplate: false,
                      baseEvent: null,
                      recurrenceRule: null,
                      volunteerGroups: [],
                      volunteers: [],
                    },
                  },
                  {
                    node: {
                      id: 'e2',
                      name: 'City Run',
                      location: 'Beach',
                      startAt: dayjs().add(30, 'days').toISOString(),
                      endAt: dayjs().add(31, 'days').toISOString(),
                      isRecurringEventTemplate: false,
                      baseEvent: null,
                      recurrenceRule: null,
                      volunteerGroups: [],
                      volunteers: [],
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
          query: USER_VOLUNTEER_MEMBERSHIP,
          variables: { where: { userId: 'userId' } },
        },
        result: {
          data: { getVolunteerMembership: [] },
        },
      },
    ];

    it('shows all events when no search term', async () => {
      const link = new StaticMockLink(searchMocks);
      renderUpcomingEvents(link);
      await waitFor(() => {
        const titles = screen.getAllByTestId('eventTitle');
        expect(titles.length).toBe(2);
      });
    });

    it('filters events by title search', async () => {
      const link = new StaticMockLink(searchMocks);
      renderUpcomingEvents(link);

      await waitFor(() => {
        expect(screen.getAllByTestId('eventTitle').length).toBe(2);
      });
      const input = screen.getByTestId('searchByInput');
      await userEvent.type(input, 'beach');
      await waitFor(() => {
        const titles = screen.getAllByTestId('eventTitle');
        expect(titles.length).toBe(1);
        expect(titles[0]).toHaveTextContent('Beach Cleanup');
      });
    });

    it('shows no events when search does not match', async () => {
      const link = new StaticMockLink(searchMocks);
      renderUpcomingEvents(link);
      await waitFor(() => {
        expect(screen.getAllByTestId('eventTitle').length).toBe(2);
      });

      const input = screen.getByTestId('searchByInput');
      await userEvent.type(input, 'xyz');
      await waitFor(() => {
        expect(screen.getByTestId('events-empty-state')).toBeInTheDocument();
        expect(screen.getByText(/no upcoming events/i)).toBeInTheDocument();
      });
    });

    it('filters by location when searchBy is location', async () => {
      const link = new StaticMockLink(searchMocks);
      renderUpcomingEvents(link);
      await waitFor(() => {
        expect(screen.getAllByTestId('eventTitle').length).toBe(2);
      });
      // Change dropdown to location
      const dropdownButton = screen.getByTestId('searchBy-toggle');
      await userEvent.click(dropdownButton);
      const locationOption = screen.getByTestId('searchBy-item-location');
      await userEvent.click(locationOption);
      const input = screen.getByTestId('searchByInput');
      await userEvent.type(input, 'park');
      await waitFor(() => {
        const titles = screen.getAllByTestId('eventTitle');
        expect(titles.length).toBe(1);
        expect(titles[0]).toHaveTextContent('Beach Cleanup');
      });
    });

    it('handles location search when location is null', async () => {
      const nullLocationMocks = [
        {
          request: {
            query: USER_EVENTS_VOLUNTEER,
            variables: {
              organizationId: 'orgId',
              upcomingOnly: true,
              first: 30,
            },
          },
          result: {
            data: {
              organization: {
                id: 'orgId',
                events: {
                  edges: [
                    {
                      node: {
                        id: 'e1',
                        name: 'Event with Location',
                        location: 'Park',
                        startAt: dayjs().add(30, 'days').toISOString(),
                        endAt: dayjs().add(31, 'days').toISOString(),
                        isRecurringEventTemplate: false,
                        baseEvent: null,
                        recurrenceRule: null,
                        volunteerGroups: [],
                        volunteers: [],
                      },
                    },
                    {
                      node: {
                        id: 'e2',
                        name: 'Event without Location',
                        location: null,
                        startAt: dayjs().add(30, 'days').toISOString(),
                        endAt: dayjs().add(31, 'days').toISOString(),
                        isRecurringEventTemplate: false,
                        baseEvent: null,
                        recurrenceRule: null,
                        volunteerGroups: [],
                        volunteers: [],
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
            query: USER_VOLUNTEER_MEMBERSHIP,
            variables: { where: { userId: 'userId' } },
          },
          result: {
            data: { getVolunteerMembership: [] },
          },
        },
      ];
      const link = new StaticMockLink(nullLocationMocks);
      renderUpcomingEvents(link);
      await waitFor(() => {
        expect(screen.getAllByTestId('eventTitle').length).toBe(2);
      });
      // Change dropdown to location
      const dropdownButton = screen.getByTestId('searchBy-toggle');
      await userEvent.click(dropdownButton);
      const locationOption = screen.getByTestId('searchBy-item-location');
      await userEvent.click(locationOption);
      const input = screen.getByTestId('searchByInput');
      await userEvent.type(input, 'park');
      await waitFor(() => {
        const titles = screen.getAllByTestId('eventTitle');
        expect(titles.length).toBe(1);
        expect(titles[0]).toHaveTextContent('Event with Location');
      });
    });
  });

  describe('miscellaneous', () => {
    it('displays location not specified when location is empty', async () => {
      const noLocationMocks = [
        {
          request: {
            query: USER_EVENTS_VOLUNTEER,
            variables: {
              organizationId: 'orgId',
              upcomingOnly: true,
              first: 30,
            },
          },
          result: {
            data: {
              organization: {
                id: 'orgId',
                events: {
                  edges: [
                    {
                      node: {
                        id: 'e1',
                        name: 'No Location Event',
                        location: null,
                        startAt: dayjs().add(30, 'days').toISOString(),
                        endAt: dayjs().add(31, 'days').toISOString(),
                        isRecurringEventTemplate: false,
                        baseEvent: null,
                        recurrenceRule: null,
                        volunteerGroups: [],
                        volunteers: [],
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
            query: USER_VOLUNTEER_MEMBERSHIP,
            variables: { where: { userId: 'userId' } },
          },
          result: {
            data: { getVolunteerMembership: [] },
          },
        },
      ];
      const link = new StaticMockLink(noLocationMocks);
      renderUpcomingEvents(link);
      await waitFor(() => {
        screen.getByText('No Location Event');
      });
      const accordionSummary = screen.getByRole('button', {
        name: /no location event/i,
      });
      await userEvent.click(accordionSummary);
      await waitFor(() => {
        expect(screen.getByText(/not specified/i)).toBeInTheDocument();
      });
    });

    it('handles empty volunteer groups without rendering groups section', async () => {
      const emptyGroupsMocks = [
        {
          request: {
            query: USER_EVENTS_VOLUNTEER,
            variables: {
              organizationId: 'orgId',
              upcomingOnly: true,
              first: 30,
            },
          },
          result: {
            data: {
              organization: {
                id: 'orgId',
                events: {
                  edges: [
                    {
                      node: {
                        id: 'e1',
                        name: 'No Groups Event',
                        startAt: dayjs().add(30, 'days').toISOString(),
                        endAt: dayjs().add(31, 'days').toISOString(),
                        location: 'Location',
                        isRecurringEventTemplate: false,
                        baseEvent: null,
                        recurrenceRule: null,
                        volunteerGroups: [],
                        volunteers: [],
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
            query: USER_VOLUNTEER_MEMBERSHIP,
            variables: { where: { userId: 'userId' } },
          },
          result: {
            data: { getVolunteerMembership: [] },
          },
        },
      ];
      const link = new StaticMockLink(emptyGroupsMocks);
      renderUpcomingEvents(link);
      await waitFor(() => {
        screen.getByText('No Groups Event');
      });
      const accordionSummary = screen.getByRole('button', {
        name: /no groups event/i,
      });
      await userEvent.click(accordionSummary);
      expect(screen.queryByText('Volunteer Groups')).not.toBeInTheDocument();
    });

    it('should load upcoming events successfully', async () => {
      const link = new StaticMockLink(MOCKS);
      renderUpcomingEvents(link);

      await waitFor(() => {
        const eventTitles = screen.getAllByTestId('eventTitle');
        expect(eventTitles.length).toBeGreaterThan(0);
      });
    });
  });
});
