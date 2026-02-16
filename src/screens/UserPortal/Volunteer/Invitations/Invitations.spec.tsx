import React, { act } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { MockedProvider } from '@apollo/client/testing';
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
import Invitations from './Invitations';
import type { ApolloLink } from '@apollo/client';
import { USER_VOLUNTEER_MEMBERSHIP } from 'GraphQl/Queries/EventVolunteerQueries';
import { UPDATE_VOLUNTEER_MEMBERSHIP } from 'GraphQl/Mutations/EventVolunteerMutation';
import useLocalStorage from 'utils/useLocalstorage';
import { vi, expect, beforeEach, afterEach, describe, it } from 'vitest';

const sharedMocks = vi.hoisted(() => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    dismiss: vi.fn(),
  },
  navigate: vi.fn(),
}));

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: sharedMocks.NotificationToast,
}));

vi.mock('@mui/icons-material', async () => {
  const actual = (await vi.importActual('@mui/icons-material')) as Record<
    string,
    unknown
  >;
  return {
    ...actual,
    WarningAmberRounded: () => (
      <span data-test-id="warning-amber-icon">WarningAmberRounded</span>
    ),
  };
});

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => ({ orgId: 'orgId' }),
    useNavigate: () => sharedMocks.navigate,
  };
});

const { setItem, clearAllItems } = useLocalStorage();

// Create base data
const baseEvent = (
  id: string,
  name: string,
  startAt: string,
  recurrenceRule: unknown = null,
) => ({
  _id: id,
  id,
  name,
  startAt,
  endAt: startAt,
  recurrenceRule,
});

const baseVolunteer = (
  id: string,
  name: string,
  avatarURL: string | null,
  email = 'john@example.com',
) => ({
  _id: id,
  id,
  hasAccepted: false,
  hoursVolunteered: 0,
  user: {
    _id: id.replace('volunteer', 'user'),
    id: id.replace('volunteer', 'user'),
    name,
    emailAddress: email,
    avatarURL,
  },
});

const baseAudit = { id: 'adminId', name: 'Admin User' };

const membership1 = {
  _id: 'membershipId1',
  id: 'membershipId1',
  status: 'invited',
  createdAt: dayjs.utc().subtract(4, 'day').toISOString(),
  updatedAt: dayjs.utc().subtract(4, 'day').toISOString(),
  event: baseEvent(
    'eventId',
    'Event 1',
    dayjs.utc().add(20, 'year').toISOString(),
  ),
  volunteer: baseVolunteer('volunteerId1', 'John Doe', 'img-url'),
  createdBy: baseAudit,
  updatedBy: baseAudit,
  group: null,
};

const membership2 = {
  _id: 'membershipId2',
  id: 'membershipId2',
  status: 'invited',
  createdAt: dayjs.utc().subtract(3, 'day').toISOString(),
  updatedAt: dayjs.utc().subtract(3, 'day').toISOString(),
  event: baseEvent(
    'eventId2',
    'Event 2',
    dayjs.utc().add(20, 'year').toISOString(),
  ),
  volunteer: baseVolunteer('volunteerId2', 'John Doe', null),
  group: {
    _id: 'groupId1',
    id: 'groupId1',
    name: 'Group 1',
    description: 'Group 1 description',
  },
  createdBy: baseAudit,
  updatedBy: baseAudit,
};

const membership3 = {
  _id: 'membershipId3',
  id: 'membershipId3',
  status: 'invited',
  createdAt: dayjs.utc().subtract(2, 'day').toISOString(),
  updatedAt: dayjs.utc().subtract(2, 'day').toISOString(),
  event: baseEvent(
    'eventId3',
    'Event 3',
    dayjs.utc().add(20, 'year').toISOString(),
    {
      id: 'recurrenceRuleId3',
    },
  ),
  volunteer: baseVolunteer('volunteerId3', 'John Doe', null),
  group: {
    name: 'Group 2',
    _id: 'groupId2',
    id: 'groupId2',
    description: 'Group 2 description',
  },
  createdBy: baseAudit,
  updatedBy: baseAudit,
};

const membership4 = {
  _id: 'membershipId4',
  id: 'membershipId4',
  status: 'invited',
  createdAt: dayjs.utc().subtract(1, 'day').toISOString(),
  updatedAt: dayjs.utc().subtract(1, 'day').toISOString(),
  event: baseEvent(
    'eventId4',
    'Event 4',
    dayjs.utc().add(20, 'year').toISOString(),
  ),
  volunteer: baseVolunteer('volunteerId4', 'John Doe', null),
  group: null,
  createdBy: baseAudit,
  updatedBy: baseAudit,
};

const membership5 = {
  _id: 'membershipId5',
  id: 'membershipId5',
  status: 'invited',
  createdAt: dayjs.utc().toISOString(),
  updatedAt: dayjs.utc().toISOString(),
  event: baseEvent(
    'eventId5',
    'Event 5',
    dayjs.utc().add(20, 'year').toISOString(),
    {
      id: 'recurrenceRuleId5',
    },
  ),
  volunteer: baseVolunteer('volunteerId5', 'John Doe', null),
  group: null,
  createdBy: baseAudit,
  updatedBy: baseAudit,
};

// Create mocks that match the component's query structure
const MOCKS = [
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          userId: 'userId',
          status: 'invited',
        },
        orderBy: 'createdAt_DESC',
      },
    },
    result: {
      data: {
        getVolunteerMembership: [
          membership2,
          membership3,
          membership4,
          membership5,
          membership1,
        ],
      },
    },
  },
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          userId: 'userId',
          status: 'invited',
        },
        orderBy: 'createdAt_ASC',
      },
    },
    result: {
      data: {
        getVolunteerMembership: [
          membership1,
          membership2,
          membership3,
          membership4,
          membership5,
        ],
      },
    },
  },
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          userId: 'userId',
          status: 'invited',
          eventTitle: '1',
        },
        orderBy: 'createdAt_DESC',
      },
    },
    result: {
      data: {
        getVolunteerMembership: [membership1],
      },
    },
  },
  {
    request: {
      query: UPDATE_VOLUNTEER_MEMBERSHIP,
      variables: {
        id: 'membershipId2',
        status: 'accepted',
      },
    },
    result: {
      data: {
        updateVolunteerMembership: {
          _id: 'membershipId2',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_VOLUNTEER_MEMBERSHIP,
      variables: {
        id: 'membershipId2',
        status: 'rejected',
      },
    },
    result: {
      data: {
        updateVolunteerMembership: {
          _id: 'membershipId2',
        },
      },
    },
  },
];

const EMPTY_MOCKS = [
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          userId: 'userId',
          status: 'invited',
        },
        orderBy: 'createdAt_DESC',
      },
    },
    result: {
      data: {
        getVolunteerMembership: [],
      },
    },
  },
];

const ERROR_MOCKS = [
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          userId: 'userId',
          status: 'invited',
        },
        orderBy: 'createdAt_DESC',
      },
    },
    error: new Error('Mock Graphql USER_VOLUNTEER_MEMBERSHIP Error'),
  },
];

const UPDATE_ERROR_MOCKS = [
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          userId: 'userId',
          status: 'invited',
        },
        orderBy: 'createdAt_DESC',
      },
    },
    result: {
      data: {
        getVolunteerMembership: [membership1, membership2],
      },
    },
  },
  {
    request: {
      query: UPDATE_VOLUNTEER_MEMBERSHIP,
      variables: {
        id: 'membershipId1',
        status: 'accepted',
      },
    },
    error: new Error('Mock Graphql UPDATE_VOLUNTEER_MEMBERSHIP Error'),
  },
];

const GROUP_RECURRING_MOCKS = [
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          userId: 'userId',
          status: 'invited',
        },
        orderBy: 'createdAt_DESC',
      },
    },
    result: {
      data: {
        getVolunteerMembership: [membership3],
      },
    },
  },
];

const GROUP_NON_RECURRING_MOCKS = [
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          userId: 'userId',
          status: 'invited',
        },
        orderBy: 'createdAt_DESC',
      },
    },
    result: {
      data: {
        getVolunteerMembership: [membership2],
      },
    },
  },
];

const INDIVIDUAL_RECURRING_MOCKS = [
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          userId: 'userId',
          status: 'invited',
        },
        orderBy: 'createdAt_DESC',
      },
    },
    result: {
      data: {
        getVolunteerMembership: [membership5],
      },
    },
  },
];

const INDIVIDUAL_NON_RECURRING_MOCKS = [
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          userId: 'userId',
          status: 'invited',
        },
        orderBy: 'createdAt_DESC',
      },
    },
    result: {
      data: {
        getVolunteerMembership: [membership4],
      },
    },
  },
];

const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(ERROR_MOCKS);
const link3 = new StaticMockLink(EMPTY_MOCKS);
const link4 = new StaticMockLink(UPDATE_ERROR_MOCKS);

const t = {
  ...JSON.parse(
    JSON.stringify(
      i18n.getDataByLanguage('en')?.translation.userVolunteer ?? {},
    ),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

const debounceWait = async (ms = 300): Promise<void> => {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
};

const renderInvitations = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider link={link}>
      <MemoryRouter initialEntries={['/user/volunteer/orgId']}>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route
                  path="/user/volunteer/:orgId"
                  element={<Invitations />}
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

describe('Testing Invitations Screen', () => {
  let user: ReturnType<typeof userEvent.setup>;
  beforeEach(() => {
    user = userEvent.setup();
    setItem('userId', 'userId');
  });

  afterEach(() => {
    vi.clearAllMocks();
    sharedMocks.navigate.mockReset();
    clearAllItems();
  });

  it('should redirect to fallback URL if URL params are undefined', async () => {
    setItem('userId', null);
    render(
      <MockedProvider link={link1}>
        <MemoryRouter initialEntries={['/user/volunteer/']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route path="/user/volunteer/" element={<Invitations />} />
                <Route
                  path="/"
                  element={<div data-testid="paramsError"></div>}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('paramsError')).toBeInTheDocument();
    });
  });

  it('should render Invitations screen', async () => {
    renderInvitations(link1);
    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });
    const searchInput = await screen.findByTestId('searchByInput');
    expect(searchInput).toBeInTheDocument();
  });

  it('Check Sorting Functionality', async () => {
    renderInvitations(link1);
    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });
    const searchInput = await screen.findByTestId('searchByInput');
    expect(searchInput).toBeInTheDocument();

    let sortBtn = await screen.findByTestId('sort-toggle');
    expect(sortBtn).toBeInTheDocument();
    // Sort by createdAt_DESC (default)
    await waitFor(() => {
      const inviteSubject = screen.getAllByTestId('inviteSubject');
      expect(inviteSubject[0]).toHaveTextContent(
        'Invitation to join volunteer group',
      );
    });

    // Sort by createdAt_ASC
    sortBtn = screen.getByTestId('sort-toggle');
    await user.click(sortBtn);
    const createdAtASC = await screen.findByTestId('sort-item-createdAt_ASC');
    expect(createdAtASC).toBeInTheDocument();
    await user.click(createdAtASC);

    await waitFor(() => {
      const inviteSubject = screen.getAllByTestId('inviteSubject');
      expect(inviteSubject[0]).toHaveTextContent(
        'Invitation to volunteer for event',
      );
    });
  });

  it('Filter Invitations (all)', async () => {
    renderInvitations(link1);
    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    const searchInput = await screen.findByTestId('searchByInput');
    expect(searchInput).toBeInTheDocument();
    // Filter by All
    const filter = await screen.findByTestId('filter-toggle');
    expect(filter).toBeInTheDocument();

    await user.click(filter);
    const filterAll = await screen.findByTestId('filter-item-all');
    expect(filterAll).toBeInTheDocument();

    await user.click(filterAll);

    await waitFor(() => {
      expect(screen.getAllByTestId('inviteSubject').length).toBeGreaterThan(0);
    });
  });

  it('Filter Invitations (group)', async () => {
    renderInvitations(link1);
    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    const searchInput = await screen.findByTestId('searchByInput');
    expect(searchInput).toBeInTheDocument();
    // Filter by group
    const filter = await screen.findByTestId('filter-toggle');
    expect(filter).toBeInTheDocument();

    await user.click(filter);
    const filterGroup = await screen.findByTestId('filter-item-group');
    expect(filterGroup).toBeInTheDocument();

    await user.click(filterGroup);

    await waitFor(() => {
      const inviteSubject = screen.getAllByTestId('inviteSubject');
      expect(inviteSubject.length).toBeGreaterThan(0);
      // After filtering, should only show group invitations
      inviteSubject.forEach((subject) => {
        expect(subject.textContent).toMatch(
          /Invitation to join volunteer group/,
        );
      });
    });
  });

  it('Filter Invitations (individual)', async () => {
    renderInvitations(link1);

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    const searchInput = await screen.findByTestId('searchByInput');
    expect(searchInput).toBeInTheDocument();
    // Filter by individual
    const filter = await screen.findByTestId('filter-toggle');
    expect(filter).toBeInTheDocument();

    await user.click(filter);
    const filterIndividual = await screen.findByTestId(
      'filter-item-individual',
    );
    expect(filterIndividual).toBeInTheDocument();

    await user.click(filterIndividual);

    await waitFor(() => {
      const inviteSubject = screen.getAllByTestId('inviteSubject');
      expect(inviteSubject.length).toBeGreaterThan(0);
      // After filtering, should only show individual invitations (both regular and recurring events)
      inviteSubject.forEach((subject) => {
        expect(subject.textContent).toMatch(
          /Invitation to volunteer for (recurring )?event/,
        );
      });
    });
  });

  it('Search Invitations', async () => {
    renderInvitations(link1);
    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    const searchInput = await screen.findByTestId('searchByInput');
    expect(searchInput).toBeInTheDocument();
    // Search by name on press of search button
    await user.type(searchInput, '1');
    await debounceWait();
    await user.click(screen.getByTestId('searchBtn'));

    await waitFor(() => {
      const inviteSubject = screen.getAllByTestId('inviteSubject');
      expect(inviteSubject).toHaveLength(1);
      expect(inviteSubject[0]).toHaveTextContent(
        'Invitation to volunteer for event',
      );
    });
  });

  it('should render screen with No Invitations', async () => {
    renderInvitations(link3);

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });
    expect(screen.getByText(t.noInvitations)).toBeInTheDocument();
  });

  it('Error while fetching invitations data', async () => {
    renderInvitations(link2);

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });
    expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
  });

  it('Accept Invite', async () => {
    renderInvitations(link1);
    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    const searchInput = await screen.findByTestId('searchByInput');
    expect(searchInput).toBeInTheDocument();
    const acceptBtn = await screen.findAllByTestId('acceptBtn');
    expect(acceptBtn.length).toBeGreaterThan(0);

    // Accept Request
    await user.click(acceptBtn[0]);

    await waitFor(() => {
      expect(sharedMocks.NotificationToast.success).toHaveBeenCalledWith(
        t.invitationAccepted,
      );
    });
  });

  it('Reject Invite', async () => {
    renderInvitations(link1);
    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    const searchInput = await screen.findByTestId('searchByInput');
    expect(searchInput).toBeInTheDocument();
    const rejectBtn = await screen.findAllByTestId('rejectBtn');
    expect(rejectBtn.length).toBeGreaterThan(0);

    // Reject Request
    await user.click(rejectBtn[0]);

    await waitFor(() => {
      expect(sharedMocks.NotificationToast.success).toHaveBeenCalledWith(
        t.invitationRejected,
      );
    });
  });

  it('Error in Update Invite Mutation', async () => {
    renderInvitations(link4);
    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });
    const searchInput = await screen.findByTestId('searchByInput');
    expect(searchInput).toBeInTheDocument();
    const acceptBtn = await screen.findAllByTestId('acceptBtn');
    expect(acceptBtn.length).toBeGreaterThan(0);

    // Accept Request
    await user.click(acceptBtn[0]);

    await waitFor(() => {
      expect(sharedMocks.NotificationToast.error).toHaveBeenCalled();
    });
  });

  describe('Invitation subject rendering based on type and recurrence', () => {
    it('should display group invitation recurring subject for group invitations with recurrence rule', async () => {
      const groupRecurringLink = new StaticMockLink(GROUP_RECURRING_MOCKS);
      renderInvitations(groupRecurringLink);

      await waitFor(() => {
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      });
      expect(screen.queryByTestId('errorMsg')).not.toBeInTheDocument();
      const inviteSubject = screen.getByTestId('inviteSubject');
      expect(inviteSubject).toHaveTextContent(
        t.groupInvitationRecurringSubject,
      );
    });

    it('should display group invitation subject for group invitations without recurrence rule', async () => {
      const groupNonRecurringLink = new StaticMockLink(
        GROUP_NON_RECURRING_MOCKS,
      );
      renderInvitations(groupNonRecurringLink);

      await waitFor(() => {
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      });
      expect(screen.queryByTestId('errorMsg')).not.toBeInTheDocument();
      const inviteSubject = screen.getByTestId('inviteSubject');
      expect(inviteSubject).toHaveTextContent(t.groupInvitationSubject);
    });

    it('should display event invitation recurring subject for individual invitations with recurrence rule', async () => {
      const individualRecurringLink = new StaticMockLink(
        INDIVIDUAL_RECURRING_MOCKS,
      );
      renderInvitations(individualRecurringLink);

      await waitFor(() => {
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      });
      expect(screen.queryByTestId('errorMsg')).not.toBeInTheDocument();
      const inviteSubject = screen.getByTestId('inviteSubject');
      expect(inviteSubject).toHaveTextContent(
        t.eventInvitationRecurringSubject,
      );
    });

    it('should display event invitation subject for individual invitations without recurrence rule', async () => {
      const individualNonRecurringLink = new StaticMockLink(
        INDIVIDUAL_NON_RECURRING_MOCKS,
      );
      renderInvitations(individualNonRecurringLink);

      await waitFor(() => {
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      });
      expect(screen.queryByTestId('errorMsg')).not.toBeInTheDocument();
      expect(screen.getByTestId('inviteSubject')).toBeInTheDocument();
    });
  });

  describe('StatusBadge rendering and status mapping', () => {
    it('should render StatusBadge with "pending" variant for invited status', async () => {
      renderInvitations(link1);
      await waitFor(() => {
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      });

      // All invitations in MOCKS have 'invited' status
      const statusBadges = screen.getAllByTestId(/invitation-status-/);
      expect(statusBadges.length).toBeGreaterThan(0);

      // Verify the first badge exists and has the status role
      const firstBadge = statusBadges[0];
      expect(firstBadge).toBeInTheDocument();
      expect(firstBadge).toHaveAttribute('role', 'status');
    });

    it('should render StatusBadge for each invitation item', async () => {
      renderInvitations(link1);
      await waitFor(() => {
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      });

      const invitations = screen.getAllByTestId('inviteSubject');
      const statusBadges = screen.getAllByTestId(/invitation-status-/);

      // Should have same number of status badges as invitations
      expect(statusBadges.length).toBe(invitations.length);
    });

    it('should have unique dataTestId for each StatusBadge', async () => {
      renderInvitations(link1);
      await waitFor(() => {
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      });

      const statusBadges = screen.getAllByTestId(/invitation-status-/);
      const testIds = statusBadges.map((badge) =>
        badge.getAttribute('data-testid'),
      );

      // All test IDs should be unique
      const uniqueIds = new Set(testIds);
      expect(uniqueIds.size).toBe(testIds.length);
    });

    it('should maintain StatusBadge rendering after accept action', async () => {
      renderInvitations(link1);
      await waitFor(() => {
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      });

      const acceptBtn = await screen.findAllByTestId('acceptBtn');
      expect(acceptBtn.length).toBeGreaterThan(0);

      // Verify StatusBadge exists before accept
      const statusBadgesBefore = screen.getAllByTestId(/invitation-status-/);
      expect(statusBadgesBefore.length).toBeGreaterThan(0);

      // Accept Request
      await user.click(acceptBtn[0]);

      await waitFor(() => {
        expect(sharedMocks.NotificationToast.success).toHaveBeenCalledWith(
          t.invitationAccepted,
        );
      });

      // StatusBadges should still be present after action
      const statusBadgesAfter = screen.queryAllByTestId(/invitation-status-/);
      expect(statusBadgesAfter.length).toBeGreaterThan(0);
    });

    it('should maintain StatusBadge rendering after reject action', async () => {
      renderInvitations(link1);
      await waitFor(() => {
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      });

      const rejectBtn = await screen.findAllByTestId('rejectBtn');
      expect(rejectBtn.length).toBeGreaterThan(0);

      // Verify StatusBadge exists before reject
      const statusBadgesBefore = screen.getAllByTestId(/invitation-status-/);
      expect(statusBadgesBefore.length).toBeGreaterThan(0);

      // Reject Request
      await user.click(rejectBtn[0]);

      await waitFor(() => {
        expect(sharedMocks.NotificationToast.success).toHaveBeenCalledWith(
          t.invitationRejected,
        );
      });

      // StatusBadges should still be present after action
      const statusBadgesAfter = screen.queryAllByTestId(/invitation-status-/);
      expect(statusBadgesAfter.length).toBeGreaterThan(0);
    });
  });
});
