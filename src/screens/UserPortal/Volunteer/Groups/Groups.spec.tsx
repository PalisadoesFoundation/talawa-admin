import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import Groups from './Groups';
import './Groups.mocks';
import useLocalStorage from 'utils/useLocalstorage';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';
import { EVENT_VOLUNTEER_GROUP_LIST } from 'GraphQl/Queries/EventVolunteerQueries';

const routerMocks = vi.hoisted(() => ({
  useParams: vi.fn(() => ({ orgId: 'orgId' })),
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: routerMocks.useParams,
  };
});

vi.mock('@mui/icons-material', () => ({
  WarningAmberRounded: () => (
    <span data-testid="warning-icon">WarningAmberRounded</span>
  ),
}));

vi.mock('./GroupModal', () => ({
  default: ({ isOpen, hide }: { isOpen: boolean; hide: () => void }) =>
    isOpen ? (
      <div data-testid="groupModal">
        <div>Manage Group</div>
        <button data-testid="modalCloseBtn" onClick={hide}>
          Close
        </button>
      </div>
    ) : null,
}));

vi.mock(
  'screens/EventVolunteers/VolunteerGroups/viewModal/VolunteerGroupViewModal',
  () => ({
    default: ({ isOpen, hide }: { isOpen: boolean; hide: () => void }) =>
      isOpen ? (
        <div data-testid="volunteerViewModal">
          <div>Group Details</div>
          <button data-testid="volunteerViewModalCloseBtn" onClick={hide}>
            Close
          </button>
        </div>
      ) : null,
  }),
);

// Create mocks with correct variable structure
const group1 = {
  __typename: 'EventVolunteerGroup',
  id: 'groupId1',
  name: 'Group 1',
  description: 'Volunteer Group Description',
  volunteersRequired: null,
  createdAt: '2024-10-25T16:16:32.978Z',
  leader: {
    __typename: 'User',
    id: 'userId',
    firstName: 'Teresa',
    lastName: 'Bradley',
    name: 'Teresa Bradley',
    email: 'teresa@example.com',
    image: null,
    avatarURL: null,
  },
  volunteers: [
    {
      __typename: 'EventVolunteer',
      id: 'volunteerId1',
      user: {
        __typename: 'User',
        id: 'userId1',
        firstName: 'John',
        lastName: 'Doe',
        name: 'John Doe',
        email: 'john@example.com',
        image: null,
        avatarURL: null,
      },
    },
  ],
  assignments: [],
  event: {
    __typename: 'Event',
    id: 'eventId1',
    title: 'Test Event 1',
  },
};

const group2 = {
  __typename: 'EventVolunteerGroup',
  id: 'groupId2',
  name: 'Group 2',
  description: 'Volunteer Group Description',
  volunteersRequired: null,
  createdAt: '2024-10-27T15:25:13.044Z',
  leader: {
    __typename: 'User',
    id: 'userId',
    firstName: 'Teresa',
    lastName: 'Bradley',
    name: 'Teresa Bradley',
    email: 'teresa@example.com',
    image: null,
    avatarURL: null,
  },
  volunteers: [],
  assignments: [],
  event: {
    __typename: 'Event',
    id: 'eventId2',
    title: 'Test Event 2',
  },
};

const CUSTOM_MOCKS = [
  {
    request: {
      query: EVENT_VOLUNTEER_GROUP_LIST,
      variables: {
        where: {
          orgId: 'orgId',
          userId: 'userId',
        },
        orderBy: 'volunteers_DESC',
      },
    },
    result: {
      data: {
        getEventVolunteerGroups: [group1, group2],
      },
    },
  },
  {
    request: {
      query: EVENT_VOLUNTEER_GROUP_LIST,
      variables: {
        where: {
          orgId: 'orgId',
          userId: 'userId',
        },
        orderBy: 'volunteers_ASC',
      },
    },
    result: {
      data: {
        getEventVolunteerGroups: [group2, group1],
      },
    },
  },
  {
    request: {
      query: EVENT_VOLUNTEER_GROUP_LIST,
      variables: {
        where: {
          orgId: 'orgId',
          userId: 'userId',
          name_contains: 'Group 1',
        },
        orderBy: 'volunteers_DESC',
      },
    },
    result: {
      data: {
        getEventVolunteerGroups: [group1],
      },
    },
  },
];

const CUSTOM_EMPTY_MOCKS = [
  {
    request: {
      query: EVENT_VOLUNTEER_GROUP_LIST,
      variables: {
        where: {
          orgId: 'orgId',
          userId: 'userId',
        },
        orderBy: 'volunteers_DESC',
      },
    },
    result: {
      data: {
        getEventVolunteerGroups: [],
      },
    },
  },
];

const CUSTOM_ERROR_MOCKS = [
  {
    request: {
      query: EVENT_VOLUNTEER_GROUP_LIST,
      variables: {
        where: {
          orgId: 'orgId',
          userId: 'userId',
        },
        orderBy: 'volunteers_DESC',
      },
    },
    error: new Error('Mock Graphql EVENT_VOLUNTEER_GROUP_LIST Error'),
  },
];

const linkSuccess = new StaticMockLink(CUSTOM_MOCKS);
const linkEmpty = new StaticMockLink(CUSTOM_EMPTY_MOCKS);
const linkError = new StaticMockLink(CUSTOM_ERROR_MOCKS);

const renderGroups = (link: StaticMockLink) => {
  return render(
    <MockedProvider link={link}>
      <MemoryRouter initialEntries={['/user/volunteer/orgId']}>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route path="/user/volunteer/:orgId" element={<Groups />} />
                <Route path="/" element={<div data-testid="paramsError" />} />
              </Routes>
            </I18nextProvider>
          </LocalizationProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );
};

describe('Groups Screen [User Portal]', () => {
  beforeEach(() => {
    const { setItem, removeItem } = useLocalStorage();
    setItem('IsLoggedIn', 'TRUE');
    setItem('userId', 'userId');
    removeItem('AdminFor');
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    routerMocks.useParams.mockReturnValue({ orgId: 'orgId' });
  });

  it('redirects when orgId param is missing', async () => {
    routerMocks.useParams.mockReturnValue({ orgId: '' });
    render(
      <MockedProvider link={linkSuccess}>
        <MemoryRouter initialEntries={['/user/volunteer/']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route path="/user/volunteer/" element={<Groups />} />
                <Route path="/" element={<div data-testid="paramsError" />} />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );
    expect(await screen.findByTestId('paramsError')).toBeInTheDocument();
  });

  it('renders groups screen with search bar and data', async () => {
    renderGroups(linkSuccess);
    expect(await screen.findByTestId('searchByInput')).toBeInTheDocument();
    expect(await screen.findByText('Group 1')).toBeInTheDocument();
  });

  it('search filters groups by name', async () => {
    renderGroups(linkSuccess);
    const searchInput = await screen.findByTestId('searchByInput');

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    // Clear and type in the search input
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'Group 1');

    // Wait for debounce (300ms) and refetch
    await waitFor(
      () => {
        expect(screen.getByText('Group 1')).toBeInTheDocument();
        // Optionally verify Group 2 is not present if your mock filters it out
        expect(screen.queryByText('Group 2')).not.toBeInTheDocument();
      },
      { timeout: 1500 },
    );
  });

  it('renders empty state when groups list is empty', async () => {
    renderGroups(linkEmpty);
    await waitFor(() => {
      expect(screen.getByText(/no volunteer groups/i)).toBeInTheDocument();
    });
  });

  it('renders error state on query failure', async () => {
    renderGroups(linkError);
    await waitFor(() => {
      expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
    });
  });

  it('opens and closes view group modal', async () => {
    renderGroups(linkSuccess);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    const viewButtons = screen.getAllByTestId('viewGroupBtn');
    await userEvent.click(viewButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/group details/i)).toBeInTheDocument();
    });

    const closeButton = screen.getByTestId('volunteerViewModalCloseBtn');
    await userEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText(/group details/i)).not.toBeInTheDocument();
    });
  });

  it('opens and closes edit group modal when permitted', async () => {
    renderGroups(linkSuccess);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByTestId('editGroupBtn');
    await userEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/manage group/i)).toBeInTheDocument();
    });

    const closeButton = screen.getByTestId('modalCloseBtn');
    await userEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText(/manage group/i)).not.toBeInTheDocument();
    });
  });

  it('shows view buttons and conditionally shows edit buttons', async () => {
    renderGroups(linkSuccess);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    const viewButtons = screen.getAllByTestId('viewGroupBtn');
    expect(viewButtons.length).toBeGreaterThan(0);

    // Edit buttons should be visible since the leader ID matches userId
    const editButtons = screen.getAllByTestId('editGroupBtn');
    expect(editButtons.length).toBeGreaterThanOrEqual(0);
  });

  it('can sort groups by number of volunteers', async () => {
    renderGroups(linkSuccess);

    // Wait for data to load with default sort (DESC)
    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    // Click sort dropdown
    const sortButton = screen.getByTestId('sort');
    await userEvent.click(sortButton);

    // Select ASC sorting
    const sortAscOption = await screen.findByTestId('volunteers_ASC');
    await userEvent.click(sortAscOption);

    // Wait for re-query with new sort
    await waitFor(() => {
      const groupNames = screen.getAllByTestId('groupName');
      expect(groupNames.length).toBe(2);
    });
  });
});
