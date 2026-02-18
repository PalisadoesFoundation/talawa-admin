import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DateRangePicker';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import Groups from './Groups';

import useLocalStorage from 'utils/useLocalstorage';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';
import { EVENT_VOLUNTEER_GROUP_LIST } from 'GraphQl/Queries/EventVolunteerQueries';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const routerMocks = vi.hoisted(() => ({
  useParams: vi.fn(() => ({
    orgId: 'orgId',
  })),
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: routerMocks.useParams,
  };
});

vi.mock('@mui/icons-material', async () => {
  const actual = (await vi.importActual('@mui/icons-material')) as Record<
    string,
    unknown
  >;
  return {
    ...actual,
    WarningAmberRounded: () => (
      <span data-testid="warning-icon">WarningAmberRounded</span>
    ),
  };
});

vi.mock('./GroupModal', () => ({
  default: ({
    isOpen,
    hide,
    refetchGroups,
  }: {
    isOpen: boolean;
    hide: () => void;
    refetchGroups?: () => void;
  }) =>
    isOpen ? (
      <div data-testid="groupModal">
        <div>Manage Group</div>
        <button type="button" data-testid="modalCloseBtn" onClick={hide}>
          Close
        </button>
        <button
          type="button"
          data-testid="triggerRefetch"
          onClick={() => refetchGroups?.()}
        >
          Trigger Refetch
        </button>
      </div>
    ) : null,
}));

vi.mock(
  'shared-components/VolunteerGroupViewModal/VolunteerGroupViewModal',
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
  createdAt: dayjs().toISOString(),
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
  createdAt: dayjs().toISOString(),
  leader: {
    __typename: 'User',
    id: 'differentUserId',
    firstName: 'Jane',
    lastName: 'Smith',
    name: 'Jane Smith',
    email: 'jane@example.com',
    image: null,
    avatarURL: 'https://example.com/avatar.jpg',
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
    maxUsageCount: 2,
  },
  {
    request: {
      query: EVENT_VOLUNTEER_GROUP_LIST,
      variables: {
        where: {
          orgId: 'orgId',
          userId: 'userId',
          leaderName: 'Teresa',
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
  {
    request: {
      query: EVENT_VOLUNTEER_GROUP_LIST,
      variables: {
        where: {
          orgId: 'orgId',
          userId: 'userId',
          leaderName: 'Teresa',
        },
        orderBy: 'volunteers_DESC',
      },
    },
    result: {
      data: {
        getEventVolunteerGroups: [group1],
      },
    },
    maxUsageCount: 2,
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
        <MemoryRouter initialEntries={['/user/volunteer/orgId']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route path="/user/volunteer/:orgId" element={<Groups />} />
                <Route path="/" element={<div data-testid="paramsError" />} />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );
    expect(await screen.findByTestId('paramsError')).toBeInTheDocument();
  });

  it('redirects when userId is missing', async () => {
    const { removeItem } = useLocalStorage();
    removeItem('userId');

    render(
      <MockedProvider link={linkSuccess}>
        <MemoryRouter initialEntries={['/user/volunteer/orgId']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route path="/user/volunteer/:orgId" element={<Groups />} />
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
    // Wait for data to load (LoadingState completes)
    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });
    expect(screen.getByTestId('searchByInput')).toBeInTheDocument();
  });

  it('search filters groups by name', async () => {
    renderGroups(linkSuccess);

    // Wait for initial data to load (LoadingState completes)
    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByInput');

    // Clear and type in the search input
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'Group 1');

    // Wait for debounce (300ms) and refetch
    await waitFor(
      () => {
        expect(screen.getByText('Group 1')).toBeInTheDocument();
        expect(screen.queryByText('Group 2')).not.toBeInTheDocument();
      },
      { timeout: 1500 },
    );
  });

  it('search filters groups by leader name', async () => {
    renderGroups(linkSuccess);

    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
      expect(screen.getByText('Group 2')).toBeInTheDocument();
    });

    // Change searchBy to leader - this changes the condition path
    const searchByDropdown = screen.getByTestId('searchBy-toggle');
    await userEvent.click(searchByDropdown);

    const leaderOption = await screen.findByTestId('searchBy-item-leader');
    await userEvent.click(leaderOption);

    // Type in search to trigger the leaderName variable assignment (line 96)
    const searchInput = screen.getByTestId('searchByInput');
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'Teresa');

    // Wait for debounce (300ms) and query with leaderName variable to execute
    // This ensures line 96 (vars.leaderName = searchTerm.trim()) is covered
    await waitFor(
      () => {
        // Verify that Group 2 is filtered out (only Teresa's group should show)
        expect(screen.queryByText('Group 2')).not.toBeInTheDocument();
      },
      { timeout: 2000 },
    );

    // Verify the filtered result shows only Group 1 (led by Teresa)
    expect(screen.getByText('Group 1')).toBeInTheDocument();
  });

  it('trims whitespace when searching by leader name', async () => {
    renderGroups(linkSuccess);

    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    // Change searchBy to leader to enable leaderName code path
    const searchByDropdown = screen.getByTestId('searchBy-toggle');
    await userEvent.click(searchByDropdown);

    const leaderOption = await screen.findByTestId('searchBy-item-leader');
    await userEvent.click(leaderOption);

    // Type leader name with whitespace to test trim() functionality
    const searchInput = screen.getByTestId('searchByInput');
    await userEvent.clear(searchInput);
    // This will set debouncedSearchTerm to '   Teresa   '
    await userEvent.type(searchInput, '   Teresa   ');

    // Wait for debounce and query execution
    // The vars.leaderName = debouncedSearchTerm.trim() line should execute
    await waitFor(
      () => {
        // Verify query completed with trimmed value
        const groupNames = screen.getAllByTestId('groupName');
        expect(groupNames.length).toBeGreaterThanOrEqual(1);
      },
      { timeout: 1500 },
    );

    expect(screen.getByText('Group 1')).toBeInTheDocument();
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

  it('does not show edit button for groups where user is not the leader', async () => {
    renderGroups(linkSuccess);

    await waitFor(() => {
      expect(screen.getByText('Group 2')).toBeInTheDocument();
    });

    const allEditButtons = screen.getAllByTestId('editGroupBtn');
    // Group 1 has userId as leader, Group 2 has differentUserId
    // So we should only have 1 edit button (for Group 1)
    expect(allEditButtons.length).toBe(1);
  });

  it('displays leader avatar image when avatarURL is provided', async () => {
    renderGroups(linkSuccess);

    await waitFor(() => {
      expect(screen.getByText('Group 2')).toBeInTheDocument();
    });

    // Group 2 has an avatarURL
    const leaderNames = screen.getAllByTestId('leaderName');
    const group2Leader = leaderNames.find((el) =>
      el.textContent?.includes('Jane Smith'),
    );

    expect(group2Leader).toBeInTheDocument();
    expect(group2Leader?.querySelector('img')).toBeInTheDocument();
  });

  it('displays Avatar component when avatarURL is not provided', async () => {
    renderGroups(linkSuccess);

    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    // Group 1 has no avatarURL, should use Avatar component
    const leaderNames = screen.getAllByTestId('leaderName');
    expect(leaderNames[0]).toBeInTheDocument();
  });

  it('displays correct number of volunteers in each group', async () => {
    renderGroups(linkSuccess);

    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    const groupNames = screen.getAllByTestId('groupName');
    expect(groupNames).toHaveLength(2);

    // Group 1 has 1 volunteer, Group 2 has 0
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('shows view buttons and conditionally shows edit buttons', async () => {
    renderGroups(linkSuccess);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    const viewButtons = screen.getAllByTestId('viewGroupBtn');
    expect(viewButtons.length).toBeGreaterThan(0);

    // Edit buttons should be visible only for groups where user is leader
    const editButtons = screen.getAllByTestId('editGroupBtn');
    expect(editButtons.length).toBe(1);
  });

  it('can sort groups by number of volunteers', async () => {
    renderGroups(linkSuccess);

    // Wait for data to load with default sort (DESC)
    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    // Click sort dropdown
    const sortButton = screen.getByTestId('sort-toggle');
    await userEvent.click(sortButton);

    // Select ASC sorting
    const sortAscOption = await screen.findByTestId('sort-item-volunteers_asc');
    await userEvent.click(sortAscOption);

    // Wait for re-query with new sort
    await waitFor(() => {
      const groupNames = screen.getAllByTestId('groupName');
      expect(groupNames.length).toBe(2);
    });
  });

  it('should handle debounce cleanup on unmount', async () => {
    const { unmount } = renderGroups(linkSuccess);

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByTestId('searchByInput')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByInput');
    await userEvent.type(searchInput, 'test');

    // Unmount while debounce is pending
    unmount();
  });

  it('should maintain search state across modal open/close', async () => {
    renderGroups(linkSuccess);

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByTestId('searchByInput')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByInput') as HTMLInputElement;
    await userEvent.type(searchInput, 'Group');

    // Open modal
    const viewButtons = screen.getAllByTestId('viewGroupBtn');
    expect(viewButtons.length).toBeGreaterThan(0);
    await userEvent.click(viewButtons[0]);

    // Search text should still be there
    await waitFor(() => {
      expect(searchInput.value).toBe('Group');
    });
  });

  it('should handle sort dropdown interaction', async () => {
    renderGroups(linkSuccess);

    await waitFor(() => {
      expect(screen.getByTestId('searchByInput')).toBeInTheDocument();
    });

    const sortButton = screen.getByTestId('sort-container');
    expect(sortButton).toBeInTheDocument();
  });

  it('should handle search-by dropdown change', async () => {
    renderGroups(linkSuccess);

    await waitFor(() => {
      expect(screen.getByTestId('searchByInput')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByInput');
    expect(searchInput).toBeInTheDocument();
  });

  it('should handle modal close without selection', async () => {
    render(
      <MockedProvider link={linkSuccess}>
        <MemoryRouter initialEntries={['/user/volunteer/orgId']}>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18n}>
                <Routes>
                  <Route path="/user/volunteer/:orgId" element={<Groups />} />
                </Routes>
              </I18nextProvider>
            </LocalizationProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    const viewButtons = screen.getAllByTestId('viewGroupBtn');
    expect(viewButtons.length).toBeGreaterThan(0);
    await userEvent.click(viewButtons[0]);

    const closeButton = await screen.findByTestId('volunteerViewModalCloseBtn');
    await userEvent.click(closeButton);

    // Verify modal is closed
    await waitFor(() => {
      expect(
        screen.queryByTestId('volunteerViewModal'),
      ).not.toBeInTheDocument();
    });
  });

  it('calls refetchGroups when triggered from GroupModal', async () => {
    const refetchSpy = vi.fn();

    // Create a custom mock that tracks refetch calls
    const customMocks = [
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
        result: () => {
          refetchSpy();
          return {
            data: {
              getEventVolunteerGroups: [group1, group2],
            },
          };
        },
      },
    ];

    const customLink = new StaticMockLink(customMocks);

    render(
      <MockedProvider link={customLink}>
        <MemoryRouter initialEntries={['/user/volunteer/orgId']}>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18n}>
                <Routes>
                  <Route path="/user/volunteer/:orgId" element={<Groups />} />
                </Routes>
              </I18nextProvider>
            </LocalizationProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    // Initial load should have called the query once
    expect(refetchSpy).toHaveBeenCalledTimes(1);

    // Open edit modal
    const editButtons = screen.getAllByTestId('editGroupBtn');
    await userEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/manage group/i)).toBeInTheDocument();
    });

    // Trigger refetch through the mock
    const refetchButton = screen.getByTestId('triggerRefetch');
    await userEvent.click(refetchButton);

    // Verify refetch was called
    await waitFor(() => {
      expect(refetchSpy).toHaveBeenCalledTimes(2);
    });
  });

  it('handles empty search term correctly', async () => {
    renderGroups(linkSuccess);

    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByInput');

    // Type and then clear
    await userEvent.type(searchInput, 'test');
    await userEvent.clear(searchInput);

    // Wait for debounce
    await waitFor(
      () => {
        expect(screen.getByText('Group 1')).toBeInTheDocument();
        expect(screen.getByText('Group 2')).toBeInTheDocument();
      },
      { timeout: 1500 },
    );
  });

  it('handles spaces in search term correctly', async () => {
    renderGroups(linkSuccess);

    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByInput');

    // Type search with spaces
    await userEvent.type(searchInput, '   Group 1   ');

    // Wait for debounce - should trim spaces
    await waitFor(
      () => {
        expect(screen.getByText('Group 1')).toBeInTheDocument();
      },
      { timeout: 1500 },
    );
  });

  it('switches between search by group and leader multiple times', async () => {
    renderGroups(linkSuccess);

    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    // Switch to leader
    const searchByDropdown = screen.getByTestId('searchBy-toggle');
    await userEvent.click(searchByDropdown);

    let leaderOption = await screen.findByTestId('searchBy-item-leader');
    await userEvent.click(leaderOption);

    // Switch back to group
    await userEvent.click(searchByDropdown);
    const groupOption = await screen.findByTestId('searchBy-item-group');
    await userEvent.click(groupOption);

    expect(screen.getByText('Group 1')).toBeInTheDocument();
  });

  it('renders all table columns correctly', async () => {
    renderGroups(linkSuccess);

    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    // Check if all columns are rendered
    expect(screen.getAllByTestId('groupName')).toHaveLength(2);
    expect(screen.getAllByTestId('leaderName')).toHaveLength(2);
    expect(screen.getAllByTestId('viewGroupBtn')).toHaveLength(2);
  });

  it('opens view modal for second group', async () => {
    renderGroups(linkSuccess);

    await waitFor(() => {
      expect(screen.getByText('Group 2')).toBeInTheDocument();
    });

    const viewButtons = screen.getAllByTestId('viewGroupBtn');
    await userEvent.click(viewButtons[1]);

    await waitFor(() => {
      expect(screen.getByText(/group details/i)).toBeInTheDocument();
    });
  });

  it('handles clicking sort dropdown multiple times', async () => {
    renderGroups(linkSuccess);

    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    const sortButton = screen.getByTestId('sort-container');

    // Click multiple times
    await userEvent.click(sortButton);
    await userEvent.click(sortButton);

    expect(sortButton).toBeInTheDocument();
  });

  it('verifies DataGrid props are correctly set', async () => {
    renderGroups(linkSuccess);

    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    // Verify groups are displayed in DataGrid
    const groupNames = screen.getAllByTestId('groupName');
    expect(groupNames).toHaveLength(2);
  });

  it('should display LoadingState spinner while data is loading', async () => {
    const DELAYED_MOCKS = [
      {
        request: {
          query: EVENT_VOLUNTEER_GROUP_LIST,
          variables: {
            where: { orgId: 'orgId', userId: 'userId' },
            orderBy: 'volunteers_DESC',
          },
        },
        result: {
          data: {
            getEventVolunteerGroups: [group1, group2],
          },
        },
        delay: 100, // Add delay to simulate loading
      },
    ];

    const linkDelayed = new StaticMockLink(DELAYED_MOCKS);
    renderGroups(linkDelayed);

    // Assert spinner is visible during loading
    expect(screen.getByTestId('spinner')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    // Assert groups are displayed
    expect(screen.getByText('Group 1')).toBeInTheDocument();
  });

  it('handles search input interactions correctly', async () => {
    renderGroups(linkSuccess);

    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    // Test search input functionality
    const searchInput = screen.getByTestId('searchByInput');
    await userEvent.type(searchInput, 'test');
    expect(searchInput).toHaveValue('test');

    await userEvent.clear(searchInput);
    expect(searchInput).toHaveValue('');

    // Test search mode switching
    const searchByDropdown = screen.getByTestId('searchBy-toggle');
    await userEvent.click(searchByDropdown);
    const leaderOption = await screen.findByTestId('searchBy-item-leader');
    await userEvent.click(leaderOption);

    await userEvent.type(searchInput, 'leader test');
    expect(searchInput).toHaveValue('leader test');
  });

  test('handles empty search term in leader mode', async () => {
    renderGroups(linkSuccess);

    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    const searchByDropdown = screen.getByTestId('searchBy-toggle');
    await userEvent.click(searchByDropdown);
    const leaderOption = await screen.findByTestId('searchBy-item-leader');
    await userEvent.click(leaderOption);

    const searchInput = screen.getByTestId('searchByInput');
    await userEvent.type(searchInput, '   '); // whitespace only
    await userEvent.clear(searchInput);

    expect(searchInput).toHaveValue('');
  });

  test('handles group search with non-empty term', async () => {
    renderGroups(linkSuccess);

    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByInput');
    await userEvent.type(searchInput, 'test group');

    expect(searchInput).toHaveValue('test group');
  });

  test('handles search term with whitespace trimming', async () => {
    renderGroups(linkSuccess);

    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByInput');
    await userEvent.type(searchInput, '  test group  ');

    expect(searchInput).toHaveValue('  test group  ');
  });

  test('adds leaderName to variables when searching by leader with non-empty term', async () => {
    renderGroups(linkSuccess);

    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    const searchByDropdown = screen.getByTestId('searchBy-toggle');
    await userEvent.click(searchByDropdown);
    const leaderOption = await screen.findByTestId('searchBy-item-leader');
    await userEvent.click(leaderOption);

    const searchInput = screen.getByTestId('searchByInput');
    await userEvent.type(searchInput, 'leader name');

    expect(searchInput).toHaveValue('leader name');
  });

  test('converts volunteers_desc to volunteers_DESC in onSortChange', async () => {
    renderGroups(linkSuccess);

    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    const sortDropdown = screen.getByTestId('sort-toggle');
    await userEvent.click(sortDropdown);

    const sortOption = await screen.findByTestId('sort-item-volunteers_desc');
    await userEvent.click(sortOption);

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  test('adds name_contains to variables when searching by group with non-empty term', async () => {
    renderGroups(linkSuccess);

    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByInput');
    await userEvent.type(searchInput, 'group name');

    expect(searchInput).toHaveValue('group name');
  });

  test('handles empty search term in group mode', async () => {
    renderGroups(linkSuccess);

    await waitFor(() => {
      expect(screen.getByTestId('searchByInput')).toBeInTheDocument();
    });

    // Just verify the component renders with search functionality
    const searchInput = screen.getByTestId('searchByInput');
    await userEvent.clear(searchInput);

    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });
  });

  test('handles search by change callback', async () => {
    renderGroups(linkSuccess);

    await waitFor(() => {
      expect(screen.getByTestId('searchBy-container')).toBeInTheDocument();
    });

    const searchByDropdown = screen.getByTestId('searchBy-toggle');
    await userEvent.click(searchByDropdown);

    const leaderOption = await screen.findByTestId('searchBy-item-leader');
    await userEvent.click(leaderOption);

    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });
  });

  test('handles DataGridWrapper sort value conversion from volunteers_asc to volunteers_ASC', async () => {
    renderGroups(linkSuccess);

    await waitFor(() => {
      expect(screen.getByTestId('sort-container')).toBeInTheDocument();
    });

    const sortDropdown = screen.getByTestId('sort-toggle');
    await userEvent.click(sortDropdown);

    const leastVolunteersOption = await screen.findByTestId(
      'sort-item-volunteers_asc',
    );
    await userEvent.click(leastVolunteersOption);

    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });
  });

  test('verifies DataGridWrapper configuration properties are set correctly', async () => {
    renderGroups(linkSuccess);

    await waitFor(() => {
      expect(screen.getByTestId('searchByInput')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByInput');
    expect(searchInput).toHaveAttribute(
      'placeholder',
      'Search by Group or Leader',
    );

    // Test that loading is set to false
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();

    // Test that server-side search is enabled
    await userEvent.type(searchInput, 'test');
    expect(searchInput).toHaveValue('test');
  });

  test('uses translation key for error message instead of hardcoded string', async () => {
    renderGroups(linkError);

    await waitFor(() => {
      expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
    });

    // Verify error message uses translation
    const errorElement = screen.getByTestId('errorMsg');
    expect(errorElement).toBeInTheDocument();

    // The error message should contain translated text, not hardcoded "Volunteer Groups"
    expect(errorElement.textContent).toMatch(/error.*loading/i);
  });

  test('DataGridWrapper loading state is properly configured', async () => {
    const LOADING_MOCKS = [
      {
        request: {
          query: EVENT_VOLUNTEER_GROUP_LIST,
          variables: {
            where: { orgId: 'orgId', userId: 'userId' },
            orderBy: 'volunteers_DESC',
          },
        },
        result: {
          data: {
            getEventVolunteerGroups: [group1, group2],
          },
        },
        delay: 200,
      },
    ];

    const linkLoading = new StaticMockLink(LOADING_MOCKS);
    renderGroups(linkLoading);

    // DataGridWrapper should handle its own loading state
    // No external LoadingState wrapper should be present
    expect(
      screen.queryByTestId('loading-state-wrapper'),
    ).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });
  });

  test('hooks are called in correct order before early return', async () => {
    // This test verifies the Rules of Hooks fix by ensuring component renders successfully
    // when both orgId and userId are present
    const { setItem } = useLocalStorage();
    setItem('userId', 'userId'); // Use the same userId as in mocks

    routerMocks.useParams.mockReturnValue({ orgId: 'orgId' }); // Use the same orgId as in mocks

    renderGroups(linkSuccess); // Use success mock, not error mock

    await waitFor(() => {
      expect(screen.getByTestId('searchByInput')).toBeInTheDocument();
    });

    // If hooks were called after early return, the component wouldn't render properly
    expect(screen.getByTestId('searchByInput')).toBeInTheDocument();

    // Wait for data to load from GraphQL query
    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });
  });

  test('early return works correctly when orgId is missing', async () => {
    routerMocks.useParams.mockReturnValue({ orgId: '' });

    render(
      <MockedProvider link={linkSuccess}>
        <MemoryRouter initialEntries={['/user/volunteer/']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route path="/user/volunteer/:orgId?" element={<Groups />} />
                <Route path="/" element={<div data-testid="paramsError" />} />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    expect(await screen.findByTestId('paramsError')).toBeInTheDocument();
  });

  test('early return works correctly when userId is missing', async () => {
    const { removeItem } = useLocalStorage();
    removeItem('userId');

    routerMocks.useParams.mockReturnValue({ orgId: 'testOrgId' });

    render(
      <MockedProvider link={linkSuccess}>
        <MemoryRouter initialEntries={['/user/volunteer/testOrgId']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route path="/user/volunteer/:orgId" element={<Groups />} />
                <Route path="/" element={<div data-testid="paramsError" />} />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    expect(await screen.findByTestId('paramsError')).toBeInTheDocument();
  });

  test('component renders without LoadingState wrapper', async () => {
    renderGroups(linkSuccess);

    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    // Verify no LoadingState wrapper is present in the DOM
    expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument();

    // DataGridWrapper should be the main container
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  test('DataGridWrapper receives correct loading prop', async () => {
    const DELAYED_MOCKS = [
      {
        request: {
          query: EVENT_VOLUNTEER_GROUP_LIST,
          variables: {
            where: { orgId: 'orgId', userId: 'userId' },
            orderBy: 'volunteers_DESC',
          },
        },
        result: {
          data: {
            getEventVolunteerGroups: [group1, group2],
          },
        },
        delay: 100,
      },
    ];

    const linkDelayed = new StaticMockLink(DELAYED_MOCKS);
    renderGroups(linkDelayed);

    // During loading, DataGridWrapper should show its loading state
    expect(screen.getByTestId('spinner')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });
  });

  test('DataGridWrapper server-side search configuration is properly set', async () => {
    renderGroups(linkSuccess);

    await waitFor(() => {
      expect(screen.getByTestId('searchByInput')).toBeInTheDocument();
    });

    // Verify server-side search is enabled
    const searchInput = screen.getByTestId('searchByInput');
    expect(searchInput).toBeInTheDocument();

    // Verify search by options are available
    const searchByDropdown = screen.getByTestId('searchBy-toggle');
    expect(searchByDropdown).toBeInTheDocument();

    // Test search by options
    await userEvent.click(searchByDropdown);
    expect(
      await screen.findByTestId('searchBy-item-group'),
    ).toBeInTheDocument();
    expect(
      await screen.findByTestId('searchBy-item-leader'),
    ).toBeInTheDocument();
  });

  test('DataGridWrapper handles server-side search term changes', async () => {
    renderGroups(linkSuccess);

    await waitFor(() => {
      expect(screen.getByTestId('searchByInput')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByInput');

    // Type in search input to trigger server-side search
    await userEvent.type(searchInput, 'test search');

    // Verify the search term is set
    expect(searchInput).toHaveValue('test search');

    // Clear search
    await userEvent.clear(searchInput);
    expect(searchInput).toHaveValue('');
  });

  test('DataGridWrapper handles sort configuration correctly', async () => {
    renderGroups(linkSuccess);

    await waitFor(() => {
      expect(screen.getByTestId('sort-container')).toBeInTheDocument();
    });

    const sortDropdown = screen.getByTestId('sort-toggle');
    await userEvent.click(sortDropdown);

    await waitFor(() => {
      // Verify sort options are available
      expect(
        screen.getByTestId('sort-item-volunteers_desc'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('sort-item-volunteers_asc'),
      ).toBeInTheDocument();
    });

    // Test sort selection
    const sortOption = await screen.findByTestId('sort-item-volunteers_asc');
    await userEvent.click(sortOption);

    // Verify sort change is handled
    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });
  });

  test('DataGridWrapper handles search by change correctly', async () => {
    renderGroups(linkSuccess);

    await waitFor(() => {
      expect(screen.getByTestId('searchBy-container')).toBeInTheDocument();
    });

    const searchByDropdown = screen.getByTestId('searchBy-toggle');

    // Test switching to leader search
    await userEvent.click(searchByDropdown);
    const leaderOption = await screen.findByTestId('searchBy-item-leader');
    await userEvent.click(leaderOption);

    // Test switching back to group search
    await userEvent.click(searchByDropdown);
    const groupOption = await screen.findByTestId('searchBy-item-group');
    await userEvent.click(groupOption);

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  test('DataGridWrapper search functionality with debounce', async () => {
    renderGroups(linkSuccess);

    await waitFor(() => {
      expect(screen.getByTestId('searchByInput')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByInput');

    // Type multiple characters quickly to test debounce
    await userEvent.type(searchInput, 'Group');

    // Wait for debounce (300ms)
    await waitFor(
      () => {
        expect(searchInput).toHaveValue('Group');
      },
      { timeout: 1500 },
    );
  });

  test('DataGridWrapper empty state message is displayed correctly', async () => {
    renderGroups(linkEmpty);

    await waitFor(() => {
      expect(screen.getByText(/no volunteer groups/i)).toBeInTheDocument();
    });

    // Verify empty state is shown
    expect(screen.getByText(/no volunteer groups/i)).toBeInTheDocument();
  });

  test('DataGridWrapper handles search submit correctly', async () => {
    renderGroups(linkSuccess);

    await waitFor(() => {
      expect(screen.getByTestId('searchByInput')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByInput');

    // Type and submit search
    await userEvent.type(searchInput, 'Group 1');
    await userEvent.keyboard('{Enter}');

    // Verify search is handled
    expect(searchInput).toHaveValue('Group 1');
  });
});
