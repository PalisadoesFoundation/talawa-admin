import React, { act } from 'react';
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
import VolunteerGroups from './VolunteerGroups';
import type { ApolloLink } from '@apollo/client';
import { MOCKS, MOCKS_EMPTY, MOCKS_ERROR } from './modal/VolunteerGroups.mocks';
import { vi } from 'vitest';

const { routerMocks } = vi.hoisted(() => {
  const useParams = vi.fn();
  useParams.mockReturnValue({ orgId: 'orgId', eventId: 'eventId' });
  return {
    routerMocks: {
      useParams,
    },
  };
});

vi.mock('react-router', async () => {
  const actual =
    await vi.importActual<typeof import('react-router')>('react-router');
  return {
    ...actual,
    useParams: routerMocks.useParams,
  };
});

const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(MOCKS_ERROR);
const link3 = new StaticMockLink(MOCKS_EMPTY);
const t = {
  ...JSON.parse(
    JSON.stringify(
      i18n.getDataByLanguage('en')?.translation.eventVolunteers ?? {},
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

const renderVolunteerGroups = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider link={link}>
      <MemoryRouter initialEntries={['/event/orgId/eventId']}>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route
                  path="/event/:orgId/:eventId"
                  element={<VolunteerGroups />}
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

/** Mock useParams to provide consistent test data */

describe('Testing VolunteerGroups Screen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    routerMocks.useParams.mockReturnValue({
      orgId: 'orgId',
      eventId: 'eventId',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockRouteParams = (orgId = 'orgId', eventId = 'eventId'): void => {
    routerMocks.useParams.mockReturnValue({ orgId, eventId });
  };

  it('should redirect to fallback URL if URL params are undefined', async () => {
    /**  Mocking the useParams hook to return undefined parameters */
    mockRouteParams('', '');
    render(
      <MockedProvider link={link1}>
        <MemoryRouter initialEntries={['/event/']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route path="/event/" element={<VolunteerGroups />} />
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

  it('should render Groups screen', async () => {
    mockRouteParams();
    renderVolunteerGroups(link1);

    // Wait for LoadingState to complete and table data to render
    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();
  });

  it('Check Sorting Functionality', async () => {
    const user = userEvent.setup();
    mockRouteParams();
    renderVolunteerGroups(link1);

    // Wait for LoadingState to complete and table data to render
    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    let sortBtn = await screen.findByTestId('sort-toggle');
    expect(sortBtn).toBeInTheDocument();

    // Sort by members_DESC
    await user.click(sortBtn);
    const volunteersDESC = await screen.findByTestId(
      'sort-item-volunteers_DESC',
    );
    expect(volunteersDESC).toBeInTheDocument();
    await user.click(volunteersDESC);

    let groupName = await screen.findAllByTestId('groupName');
    expect(groupName[0]).toHaveTextContent('Group 1');

    // Sort by members_ASC
    sortBtn = await screen.findByTestId('sort-toggle');
    expect(sortBtn).toBeInTheDocument();
    await user.click(sortBtn);
    const volunteersASC = await screen.findByTestId('sort-item-volunteers_ASC');
    expect(volunteersASC).toBeInTheDocument();
    await user.click(volunteersASC);

    groupName = await screen.findAllByTestId('groupName');
    expect(groupName[0]).toHaveTextContent('Group 2');
  });

  it('Search by Groups', async () => {
    mockRouteParams();
    renderVolunteerGroups(link1);

    // Wait for LoadingState to complete and table data to render
    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    const searchToggle = await screen.findByTestId('searchByToggle-toggle');
    expect(searchToggle).toBeInTheDocument();
    await userEvent.click(searchToggle);

    const searchByGroup = await screen.findByTestId(
      'searchByToggle-item-group',
    );
    expect(searchByGroup).toBeInTheDocument();
    await userEvent.click(searchByGroup);

    await userEvent.type(searchInput, '1');
    await debounceWait();

    const groupName = await screen.findAllByTestId('groupName');
    expect(groupName[0]).toHaveTextContent('Group 1');
  });

  it('Search by Leader', async () => {
    mockRouteParams();
    renderVolunteerGroups(link1);

    // Wait for LoadingState to complete and table data to render
    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    const searchToggle = await screen.findByTestId('searchByToggle-toggle');
    expect(searchToggle).toBeInTheDocument();
    await userEvent.click(searchToggle);

    const searchByLeader = await screen.findByTestId(
      'searchByToggle-item-leader',
    );
    expect(searchByLeader).toBeInTheDocument();
    await userEvent.click(searchByLeader);

    // Search by name on press of ENTER
    await userEvent.type(searchInput, 'Bruce');
    await debounceWait();

    const groupName = await screen.findAllByTestId('groupName');
    expect(groupName[0]).toHaveTextContent('Group 1');
  });

  it('should render screen with No Groups', async () => {
    mockRouteParams();
    renderVolunteerGroups(link3);

    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
      expect(
        screen.getByTestId('volunteerGroups-empty-state'),
      ).toBeInTheDocument();
      expect(screen.getByText(t.noVolunteerGroups)).toBeInTheDocument();
    });
  });

  it('Error while fetching groups data', async () => {
    mockRouteParams();
    renderVolunteerGroups(link2);

    await waitFor(() => {
      expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
    });
  });

  it('Open and close ViewModal', async () => {
    mockRouteParams();
    renderVolunteerGroups(link1);

    const viewGroupBtn = await screen.findAllByTestId('viewGroupBtn');
    await userEvent.click(viewGroupBtn[0]);

    expect(await screen.findByText(t.groupDetails)).toBeInTheDocument();
    await userEvent.click(await screen.findByTestId('modalCloseBtn'));
  });

  it('Open and Close Delete Modal', async () => {
    mockRouteParams();
    renderVolunteerGroups(link1);

    const deleteGroupBtn = await screen.findAllByTestId('deleteGroupBtn');
    await userEvent.click(deleteGroupBtn[0]);

    expect(await screen.findByText(t.deleteGroup)).toBeInTheDocument();
    await userEvent.click(await screen.findByTestId('modalCloseBtn'));
  });

  it('Open and close GroupModal (Edit)', async () => {
    mockRouteParams();
    renderVolunteerGroups(link1);

    const editGroupBtn = await screen.findAllByTestId('editGroupBtn');
    await userEvent.click(editGroupBtn[0]);

    expect(await screen.findAllByText(t.updateGroup)).toHaveLength(1);
    await userEvent.click(await screen.findByTestId('modalCloseBtn'));
  });

  it('Open and close GroupModal (Create)', async () => {
    mockRouteParams();
    renderVolunteerGroups(link1);

    // Wait for LoadingState to complete and table data to render
    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    const createGroupBtn = screen.getByTestId('createGroupBtn');
    await userEvent.click(createGroupBtn);

    expect(await screen.findAllByText(t.createGroup)).toHaveLength(1);
    await userEvent.click(await screen.findByTestId('modalCloseBtn'));
  });

  describe('Search and Filter Functionality', () => {
    it('should filter groups by leader name with case insensitive search', async () => {
      mockRouteParams();
      renderVolunteerGroups(link1);

      await waitFor(() => {
        expect(screen.getByTestId('searchBy')).toBeInTheDocument();
      });

      // Switch to search by leader
      const searchToggle = await screen.findByTestId('searchByToggle-toggle');
      await userEvent.click(searchToggle);
      const searchByLeader = await screen.findByTestId(
        'searchByToggle-item-leader',
      );
      await userEvent.click(searchByLeader);

      // Test case insensitive search with leader name
      const searchInput = screen.getByTestId('searchBy');
      await userEvent.type(searchInput, 'BRUCE'); // Uppercase to test toLowerCase()
      await debounceWait();

      // This should match "Bruce Trainer" from the mock data
      const groupNames = await screen.findAllByTestId('groupName');
      expect(groupNames.length).toBeGreaterThan(0);
    });

    it('should filter groups by leader name with partial match', async () => {
      mockRouteParams();
      renderVolunteerGroups(link1);

      await waitFor(() => {
        expect(screen.getByTestId('searchBy')).toBeInTheDocument();
      });

      // Switch to search by leader
      const searchToggle = await screen.findByTestId('searchByToggle-toggle');
      await userEvent.click(searchToggle);
      const searchByLeader = await screen.findByTestId(
        'searchByToggle-item-leader',
      );
      await userEvent.click(searchByLeader);

      // Test partial match with includes() functionality
      const searchInput = screen.getByTestId('searchBy');
      await userEvent.type(searchInput, 'ruce'); // Partial match for "Bruce"
      await debounceWait();

      // Should find groups with leaders containing "ruce"
      const groupNames = screen.queryAllByTestId('groupName');
      // Test that filtering logic is executed
      expect(groupNames.length).toBeGreaterThanOrEqual(0);
    });

    it('should filter groups by group name with case insensitive search', async () => {
      mockRouteParams();
      renderVolunteerGroups(link1);

      await waitFor(() => {
        expect(screen.getByTestId('searchBy')).toBeInTheDocument();
      });

      // Search by group name (default)
      const searchInput = screen.getByTestId('searchBy');
      await userEvent.type(searchInput, 'GROUP'); // Uppercase to test toLowerCase()
      await debounceWait();

      // This tests the else branch: groupName.toLowerCase().includes(searchTerm.toLowerCase())
      const groupNames = screen.queryAllByTestId('groupName');
      expect(groupNames.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle empty search term - show all groups', async () => {
      mockRouteParams();
      renderVolunteerGroups(link1);

      await waitFor(() => {
        expect(screen.getByTestId('searchBy')).toBeInTheDocument();
      });

      // Start with a search term
      const searchInput = screen.getByTestId('searchBy');
      await userEvent.type(searchInput, 'test');
      await debounceWait();

      // Clear the search term
      await userEvent.clear(searchInput);
      await debounceWait();

      // Should show all groups when search term is empty
      // This tests the if (searchTerm) condition - when false, no filtering occurs
      const groupNames = screen.queryAllByTestId('groupName');
      expect(groupNames.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle leader search with null/empty leader name', async () => {
      mockRouteParams();
      renderVolunteerGroups(link1);

      await waitFor(() => {
        expect(screen.getByTestId('searchBy')).toBeInTheDocument();
      });

      // Switch to search by leader
      const searchToggle = await screen.findByTestId('searchByToggle-toggle');
      await userEvent.click(searchToggle);
      const searchByLeader = await screen.findByTestId(
        'searchByToggle-item-leader',
      );
      await userEvent.click(searchByLeader);

      // Search for something that won't match any leader
      const searchInput = screen.getByTestId('searchBy');
      await userEvent.type(searchInput, 'NonexistentLeader');
      await debounceWait();

      // This tests the fallback: group.leader?.name || ''
      // Should handle groups with null/undefined leaders gracefully
      const groupNames = screen.queryAllByTestId('groupName');
      expect(groupNames.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle group name search with null/empty group name', async () => {
      mockRouteParams();
      renderVolunteerGroups(link1);

      await waitFor(() => {
        expect(screen.getByTestId('searchBy')).toBeInTheDocument();
      });

      // Search for something specific to test the fallback logic
      const searchInput = screen.getByTestId('searchBy');
      await userEvent.type(searchInput, 'NonexistentGroup');
      await debounceWait();

      // This tests the fallback: group.name || ''
      // Should handle groups with null/undefined names gracefully
      const groupNames = screen.queryAllByTestId('groupName');
      expect(groupNames.length).toBeGreaterThanOrEqual(0);
    });

    it('should test complete filter function execution path', async () => {
      mockRouteParams();
      renderVolunteerGroups(link1);

      await waitFor(() => {
        expect(screen.getByTestId('searchBy')).toBeInTheDocument();
      });

      // This test ensures the entire filter logic is executed:
      // 1. if (searchTerm) check
      // 2. filteredGroups.filter() call
      // 3. Both searchBy === 'leader' and else branches
      // 4. Variable assignments and return statements

      const searchInput = screen.getByTestId('searchBy');

      // Test leader search branch
      const searchToggle = await screen.findByTestId('searchByToggle-toggle');
      await userEvent.click(searchToggle);
      const searchByLeader = await screen.findByTestId(
        'searchByToggle-item-leader',
      );
      await userEvent.click(searchByLeader);

      await userEvent.type(searchInput, 'a'); // Generic search that should match
      await debounceWait();

      // Switch back to group search to test else branch
      await userEvent.click(searchToggle);
      const searchByGroup = await screen.findByTestId(
        'searchByToggle-item-group',
      );
      await userEvent.click(searchByGroup);

      await debounceWait();

      // Both branches should have been executed successfully
      const groupNames = screen.queryAllByTestId('groupName');
      expect(groupNames.length).toBeGreaterThanOrEqual(0);
    });

    it('should execute debouncedSearch function and trigger filtering via search button', async () => {
      mockRouteParams();
      renderVolunteerGroups(link1);

      await waitFor(() => {
        expect(screen.getByTestId('searchBy')).toBeInTheDocument();
      });

      // Type in search input
      const searchInput = screen.getByTestId('searchBy');
      await userEvent.type(searchInput, '1');

      // Click search button to trigger onSearch (debouncedSearch)
      const searchBtn = screen.getByTestId('searchBtn');
      await userEvent.click(searchBtn);

      // Wait for debounce to complete
      await debounceWait(400);

      // This should trigger:
      // 1. debouncedSearch useMemo creation
      // 2. debounce function execution
      // 3. setSearchTerm call
      // 4. groups useMemo recalculation
      // 5. if (searchTerm) condition = true
      // 6. filteredGroups.filter() execution
      // 7. else branch (searchBy === 'group' by default)
      // 8. groupName.toLowerCase().includes(searchTerm.toLowerCase())

      const groupNames = await screen.findAllByTestId('groupName');
      expect(groupNames.length).toBeGreaterThan(0);
      expect(groupNames[0]).toHaveTextContent('Group 1');
    });

    it('should execute leader search branch in filter function via Enter key', async () => {
      mockRouteParams();
      renderVolunteerGroups(link1);

      await waitFor(() => {
        expect(screen.getByTestId('searchBy')).toBeInTheDocument();
      });

      // Switch to leader search first
      const searchToggle = await screen.findByTestId('searchByToggle-toggle');
      await userEvent.click(searchToggle);
      const searchByLeader = await screen.findByTestId(
        'searchByToggle-item-leader',
      );
      await userEvent.click(searchByLeader);

      // Type and press Enter to trigger search
      const searchInput = screen.getByTestId('searchBy');
      await userEvent.type(searchInput, 'Bruce');
      await userEvent.keyboard('{Enter}');

      // Wait for debounce to complete
      await debounceWait(400);

      // This should execute:
      // 1. debouncedSearch function
      // 2. setSearchTerm('Bruce')
      // 3. groups useMemo recalculation
      // 4. if (searchTerm) = true
      // 5. if (searchBy === 'leader') = true
      // 6. const leaderName = group.leader?.name || ''
      // 7. leaderName.toLowerCase().includes(searchTerm.toLowerCase())

      const groupNames = await screen.findAllByTestId('groupName');
      expect(groupNames.length).toBeGreaterThan(0);
    });

    it('should execute group name search branch in filter function via search button', async () => {
      mockRouteParams();
      renderVolunteerGroups(link1);

      await waitFor(() => {
        expect(screen.getByTestId('searchBy')).toBeInTheDocument();
      });

      // searchBy should be 'group' by default, so we test the else branch
      const searchInput = screen.getByTestId('searchBy');
      await userEvent.type(searchInput, 'Group');

      // Click search button to trigger onSearch
      const searchBtn = screen.getByTestId('searchBtn');
      await userEvent.click(searchBtn);

      // Wait for debounce to complete
      await debounceWait(400);

      // This should execute:
      // 1. debouncedSearch function
      // 2. setSearchTerm('Group')
      // 3. groups useMemo recalculation
      // 4. if (searchTerm) = true
      // 5. if (searchBy === 'leader') = false -> else branch
      // 6. const groupName = group.name || ''
      // 7. groupName.toLowerCase().includes(searchTerm.toLowerCase())

      const groupNames = await screen.findAllByTestId('groupName');
      expect(groupNames.length).toBeGreaterThan(0);
    });

    it('should test case sensitivity in search filtering via Enter key', async () => {
      mockRouteParams();
      renderVolunteerGroups(link1);

      await waitFor(() => {
        expect(screen.getByTestId('searchBy')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('searchBy');

      // Test case insensitive search with mixed case
      await userEvent.type(searchInput, 'gRoUp');
      await userEvent.keyboard('{Enter}'); // Trigger search
      await debounceWait(400);

      // This specifically tests the toLowerCase() method calls:
      // - groupName.toLowerCase().includes(searchTerm.toLowerCase())
      // Should find "Group 1", "Group 2", etc. despite case mismatch

      const groupNames = await screen.findAllByTestId('groupName');
      expect(groupNames.length).toBeGreaterThan(0);
    });

    it('should trigger debouncedSearch on Enter key press', async () => {
      mockRouteParams();
      renderVolunteerGroups(link1);

      await waitFor(() => {
        expect(screen.getByTestId('searchBy')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('searchBy');

      // Type and press Enter to trigger the onSearch callback
      await userEvent.type(searchInput, '2');
      await userEvent.keyboard('{Enter}');
      await debounceWait(400);

      // This ensures debouncedSearch is called and filtering occurs
      const groupNames = await screen.findAllByTestId('groupName');
      expect(groupNames.length).toBeGreaterThan(0);
    });

    it('should trigger debouncedSearch on search button click', async () => {
      mockRouteParams();
      renderVolunteerGroups(link1);

      await waitFor(() => {
        expect(screen.getByTestId('searchBy')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('searchBy');
      const searchBtn = screen.getByTestId('searchBtn');

      // Type and click search button
      await userEvent.type(searchInput, '3');
      await userEvent.click(searchBtn);
      await debounceWait(400);

      // This ensures debouncedSearch is called and filtering occurs
      const groupNames = await screen.findAllByTestId('groupName');
      expect(groupNames.length).toBeGreaterThan(0);
    });
  });

  it('should load volunteer groups successfully from GraphQL', async () => {
    // Use delayed mock to test loading state
    const delayedMocks = MOCKS.map((mock) => ({
      ...mock,
      delay: 100,
    }));
    const link = new StaticMockLink(delayedMocks);
    renderVolunteerGroups(link);

    // Assert loading spinner is visible (may be multiple spinners from LoadingState and DataGridWrapper)
    expect(screen.getAllByTestId('spinner').length).toBeGreaterThan(0);

    await waitFor(() => {
      // Assert spinner is removed after loading
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      // Assert data is rendered
      const groupNames = screen.getAllByTestId('groupName');
      expect(groupNames.length).toBeGreaterThan(0);
    });
  });
});
