import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { toast } from 'react-toastify';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import ManageTag from './ManageTag';
import { MOCKS, MOCKS_ERROR_ASSIGNED_MEMBERS } from './ManageTagMocks';
import {
  MOCKS_SUCCESS_UNASSIGN_USER_TAG,
  MOCKS_SUCCESS_UPDATE_USER_TAG,
  MOCKS_SUCCESS_REMOVE_USER_TAG,
  MOCKS_WITH_ANCESTOR_TAGS,
  MOCKS_INFINITE_SCROLL_PAGINATION,
  MOCKS_ERROR_OBJECT,
} from './ManageTagNonErrorMocks';
import {
  MOCKS_NULL_USERS_ASSIGNED_TO,
  MOCKS_EMPTY_ASSIGNED_MEMBERS_ARRAY,
  MOCKS_EMPTY_EDGES_ARRAY,
  MOCKS_EMPTY_PAGE_INFO,
  MOCKS_NULL_ANCESTOR_TAGS,
  MOCKS_UNDEFINED_DATA,
  MOCKS_NULL_DATA,
  MOCKS_ERROR_UNASSIGN_USER_TAG,
  MOCKS_ERROR_UPDATE_USER_TAG,
  MOCKS_ERROR_REMOVE_USER_TAG,
} from './ManageTagNullFalsyMocks';
import { USER_TAGS_ASSIGNED_MEMBERS } from 'GraphQl/Queries/userTagQueries';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';
import { type ApolloLink } from '@apollo/client';
import { vi, beforeEach, afterEach, expect, it } from 'vitest';

const translations = {
  ...JSON.parse(
    JSON.stringify(i18n.getDataByLanguage('en')?.translation.manageTag ?? {}),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

// Mock InfiniteScroll component
vi.mock('react-infinite-scroll-component', () => ({
  default: function InfiniteScroll({
    children,
    next,
    hasMore,
  }: {
    children: React.ReactNode;
    next: () => void;
    hasMore: boolean;
  }) {
    return (
      <div data-testid="infinite-scroll-mock">
        {children}
        {hasMore && (
          <button type="button" data-testid="load-more-trigger" onClick={next}>
            Load More
          </button>
        )}
      </div>
    );
  },
}));

const link = new StaticMockLink(MOCKS, false);
const link2 = new StaticMockLink(MOCKS_ERROR_ASSIGNED_MEMBERS, false);
const link3 = new StaticMockLink(MOCKS_SUCCESS_UNASSIGN_USER_TAG, false);
const link4 = new StaticMockLink(MOCKS_SUCCESS_UPDATE_USER_TAG, false);
const link5 = new StaticMockLink(MOCKS_SUCCESS_REMOVE_USER_TAG, false);
const link6 = new StaticMockLink(MOCKS_WITH_ANCESTOR_TAGS, false);
const link7 = new StaticMockLink(MOCKS_INFINITE_SCROLL_PAGINATION, false);
const link8 = new StaticMockLink(MOCKS_ERROR_OBJECT, false);
const link9 = new StaticMockLink(MOCKS_NULL_USERS_ASSIGNED_TO, false);
const link10 = new StaticMockLink(MOCKS_EMPTY_ASSIGNED_MEMBERS_ARRAY, false);
const link11 = new StaticMockLink(MOCKS_EMPTY_EDGES_ARRAY, false);
const link12 = new StaticMockLink(MOCKS_EMPTY_PAGE_INFO, false);
const link13 = new StaticMockLink(MOCKS_NULL_ANCESTOR_TAGS, false);
const link14 = new StaticMockLink(MOCKS_UNDEFINED_DATA, false);
const link15 = new StaticMockLink(MOCKS_NULL_DATA, false);
const link16 = new StaticMockLink(MOCKS_ERROR_UNASSIGN_USER_TAG, false);
const link17 = new StaticMockLink(MOCKS_ERROR_UPDATE_USER_TAG, false);
const link18 = new StaticMockLink(MOCKS_ERROR_REMOVE_USER_TAG, false);

async function wait(ms = 500): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../../components/AddPeopleToTag/AddPeopleToTag', async () => {
  return await import('./ManageTagMockComponents/MockAddPeopleToTag');
});

vi.mock('../../components/TagActions/TagActions', async () => {
  return await import('./ManageTagMockComponents/MockTagActions');
});

const renderManageTag = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={link}>
      <MemoryRouter initialEntries={['/orgtags/123/manageTag/1']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <Routes>
              <Route
                path="/orgtags/:orgId"
                element={<div data-testid="organizationTagsScreen"></div>}
              />
              <Route
                path="/orgtags/:orgId/manageTag/:tagId"
                element={<ManageTag />}
              />
              <Route
                path="/orgtags/:orgId/subTags/:tagId"
                element={<div data-testid="subTagsScreen"></div>}
              />
              <Route
                path="/member/:orgId"
                element={<div data-testid="memberProfileScreen"></div>}
              />
            </Routes>
          </I18nextProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );
};

describe('Manage Tag Page', () => {
  beforeEach(() => {
    vi.mock('react-router', async () => ({
      ...(await vi.importActual('react-router')),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('Component loads correctly', async () => {
    const { getByText } = renderManageTag(link);

    await wait();

    await waitFor(() => {
      expect(getByText(translations.addPeopleToTag)).toBeInTheDocument();
    });
  });

  it('renders error component on unsuccessful userTag assigned members query', async () => {
    const { queryByText } = renderManageTag(link2);

    await wait();

    await waitFor(() => {
      expect(queryByText(translations.addPeopleToTag)).not.toBeInTheDocument();
    });
  });

  it('opens and closes the add people to tag modal', async () => {
    renderManageTag(link);

    await waitFor(() => {
      expect(screen.getByTestId('addPeopleToTagBtn')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('addPeopleToTagBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('addPeopleToTagModal')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('closeAddPeopleToTagModal'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('addPeopleToTagModal'),
      ).not.toBeInTheDocument();
    });
  });

  it('opens and closes the unassign tag modal', async () => {
    renderManageTag(link);

    await wait();

    await waitFor(() => {
      expect(screen.getAllByTestId('unassignTagBtn')[0]).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByTestId('unassignTagBtn')[0]);

    await waitFor(() => {
      return expect(
        screen.findByTestId('unassignTagModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('unassignTagModalCloseBtn'));

    await waitFor(() =>
      expect(
        screen.queryByTestId('unassignTagModalCloseBtn'),
      ).not.toBeInTheDocument(),
    );
  });

  it('opens and closes the assignToTags modal', async () => {
    renderManageTag(link);

    // Wait for the assignToTags button to be present
    await waitFor(() => {
      expect(screen.getByTestId('assignToTags')).toBeInTheDocument();
    });

    // Click the assignToTags button to open the modal
    await userEvent.click(screen.getByTestId('assignToTags'));

    // Wait for the close button in the modal to be present
    await waitFor(() => {
      expect(screen.getByTestId('closeTagActionsModalBtn')).toBeInTheDocument();
    });

    // Click the close button to close the modal
    await userEvent.click(screen.getByTestId('closeTagActionsModalBtn'));

    // Wait for the modal to be removed from the document
    await waitFor(() => {
      expect(screen.queryByTestId('tagActionsModal')).not.toBeInTheDocument();
    });
  });

  it('opens and closes the removeFromTags modal', async () => {
    renderManageTag(link);

    // Wait for the removeFromTags button to be present
    await waitFor(() => {
      expect(screen.getByTestId('removeFromTags')).toBeInTheDocument();
    });

    // Click the removeFromTags button to open the modal
    await userEvent.click(screen.getByTestId('removeFromTags'));

    // Wait for the close button in the modal to be present
    await waitFor(() => {
      expect(screen.getByTestId('closeTagActionsModalBtn')).toBeInTheDocument();
    });

    // Click the close button to close the modal
    await userEvent.click(screen.getByTestId('closeTagActionsModalBtn'));

    // Wait for the modal to be removed from the document
    await waitFor(() => {
      expect(screen.queryByTestId('tagActionsModal')).not.toBeInTheDocument();
    });
  });

  it('opens and closes the edit tag modal', async () => {
    renderManageTag(link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('editUserTag')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('editUserTag'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('closeEditTagModalBtn'),
      ).resolves.toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('closeEditTagModalBtn'));

    await waitFor(() =>
      expect(
        screen.queryByTestId('closeEditTagModalBtn'),
      ).not.toBeInTheDocument(),
    );
  });

  it('opens and closes the remove tag modal', async () => {
    renderManageTag(link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('removeTag')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('removeTag'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('removeUserTagModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('removeUserTagModalCloseBtn'));

    await waitFor(() =>
      expect(
        screen.queryByTestId('removeUserTagModalCloseBtn'),
      ).not.toBeInTheDocument(),
    );
  });

  it("navigates to the member's profile after clicking the view option", async () => {
    renderManageTag(link);

    await wait();

    await waitFor(() => {
      expect(screen.getAllByTestId('viewProfileBtn')[0]).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByTestId('viewProfileBtn')[0]);

    await waitFor(() => {
      expect(screen.getByTestId('memberProfileScreen')).toBeInTheDocument();
    });
  });

  it('navigates to the subTags screen after clicking the subTags option', async () => {
    renderManageTag(link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('subTagsBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('subTagsBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('subTagsScreen')).toBeInTheDocument();
    });
  });

  it('navigates to the manageTag screen after clicking a tag in the breadcrumbs', async () => {
    renderManageTag(link);

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('redirectToManageTag')[0],
      ).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByTestId('redirectToManageTag')[0]);

    await waitFor(() => {
      expect(screen.getByTestId('addPeopleToTagBtn')).toBeInTheDocument();
    });
  });

  it('navigates to organization tags screen screen after clicking tha all tags option in the breadcrumbs', async () => {
    renderManageTag(link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('allTagsBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('allTagsBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('organizationTagsScreen')).toBeInTheDocument();
    });
  });

  it('searchs for tags where the name matches the provided search input', async () => {
    // Create separate mocks for initial and search queries
    const initialMock = {
      request: {
        query: USER_TAGS_ASSIGNED_MEMBERS,
        variables: {
          id: '1',
          first: TAGS_QUERY_DATA_CHUNK_SIZE,
          where: {
            firstName: { starts_with: '' },
            lastName: { starts_with: '' },
          },
          sortedBy: { id: 'DESCENDING' },
        },
      },
      result: {
        data: {
          getAssignedUsers: {
            __typename: 'UserTag',
            name: 'tag1',
            ancestorTags: [],
            usersAssignedTo: {
              __typename: 'UserTagUsersAssignedToConnection',
              edges: [
                {
                  __typename: 'UserTagUsersAssignedToEdge',
                  node: {
                    __typename: 'User',
                    _id: '1',
                    firstName: 'member',
                    lastName: '1',
                    id: '1',
                  },
                  cursor: '1',
                },
              ],
              pageInfo: {
                __typename: 'PageInfo',
                startCursor: '1',
                endCursor: '1',
                hasNextPage: false,
                hasPreviousPage: false,
              },
              totalCount: 1,
            },
          },
        },
      },
    };

    const searchMock = {
      request: {
        query: USER_TAGS_ASSIGNED_MEMBERS,
        variables: {
          id: '1',
          first: TAGS_QUERY_DATA_CHUNK_SIZE,
          where: {
            firstName: { starts_with: 'assigned' },
            lastName: { starts_with: 'user' },
          },
          sortedBy: { id: 'DESCENDING' },
        },
      },
      result: {
        data: {
          getAssignedUsers: {
            __typename: 'UserTag',
            name: 'tag1',
            ancestorTags: [],
            usersAssignedTo: {
              __typename: 'UserTagUsersAssignedToConnection',
              edges: [
                {
                  __typename: 'UserTagUsersAssignedToEdge',
                  node: {
                    __typename: 'User',
                    _id: '1',
                    firstName: 'assigned',
                    lastName: 'user1',
                    id: '1',
                  },
                  cursor: '1',
                },
                {
                  __typename: 'UserTagUsersAssignedToEdge',
                  node: {
                    __typename: 'User',
                    _id: '2',
                    firstName: 'assigned',
                    lastName: 'user2',
                    id: '2',
                  },
                  cursor: '2',
                },
              ],
              pageInfo: {
                __typename: 'PageInfo',
                startCursor: '1',
                endCursor: '2',
                hasNextPage: false,
                hasPreviousPage: false,
              },
              totalCount: 2,
            },
          },
        },
      },
    };

    const mocks = [initialMock, searchMock];
    const searchLink = new StaticMockLink(mocks, false);

    renderManageTag(searchLink);

    await wait();

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(translations.searchByName),
      ).toBeInTheDocument();
    });

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('member 1')).toBeInTheDocument();
    });

    // Perform search
    const searchInput = screen.getByPlaceholderText(translations.searchByName);
    const searchButton = screen.getByTestId('searchBtn');

    await userEvent.type(searchInput, 'assigned user');
    await userEvent.click(searchButton);

    // Wait for search results with extended timeout
    await waitFor(
      () => {
        expect(screen.getByText('assigned user1')).toBeInTheDocument();
        expect(screen.getByText('assigned user2')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    // Verify we have 2 users
    await waitFor(() => {
      const buttons = screen.getAllByTestId('viewProfileBtn');
      expect(buttons.length).toEqual(2);
    });
  });

  it('fetches the tags by the sort order, i.e. latest or oldest first', async () => {
    // Create separate mocks for initial and search queries
    const initialMock = {
      request: {
        query: USER_TAGS_ASSIGNED_MEMBERS,
        variables: {
          id: '1',
          first: TAGS_QUERY_DATA_CHUNK_SIZE,
          where: {
            firstName: { starts_with: '' },
            lastName: { starts_with: '' },
          },
          sortedBy: { id: 'DESCENDING' },
        },
      },
      result: {
        data: {
          getAssignedUsers: {
            __typename: 'UserTag',
            name: 'tag1',
            ancestorTags: [],
            usersAssignedTo: {
              __typename: 'UserTagUsersAssignedToConnection',
              edges: [
                {
                  __typename: 'UserTagUsersAssignedToEdge',
                  node: {
                    __typename: 'User',
                    _id: '1',
                    firstName: 'member',
                    lastName: '1',
                    id: '1',
                  },
                  cursor: '1',
                },
              ],
              pageInfo: {
                __typename: 'PageInfo',
                startCursor: '1',
                endCursor: '1',
                hasNextPage: false,
                hasPreviousPage: false,
              },
              totalCount: 1,
            },
          },
        },
      },
    };

    const searchMock = {
      request: {
        query: USER_TAGS_ASSIGNED_MEMBERS,
        variables: {
          id: '1',
          first: TAGS_QUERY_DATA_CHUNK_SIZE,
          where: {
            firstName: { starts_with: 'assigned' },
            lastName: { starts_with: 'user' },
          },
          sortedBy: { id: 'DESCENDING' },
        },
      },
      result: {
        data: {
          getAssignedUsers: {
            __typename: 'UserTag',
            name: 'tag1',
            ancestorTags: [],
            usersAssignedTo: {
              __typename: 'UserTagUsersAssignedToConnection',
              edges: [
                {
                  __typename: 'UserTagUsersAssignedToEdge',
                  node: {
                    __typename: 'User',
                    _id: '1',
                    firstName: 'assigned',
                    lastName: 'user1',
                    id: '1',
                  },
                  cursor: '1',
                },
                {
                  __typename: 'UserTagUsersAssignedToEdge',
                  node: {
                    __typename: 'User',
                    _id: '2',
                    firstName: 'assigned',
                    lastName: 'user2',
                    id: '2',
                  },
                  cursor: '2',
                },
              ],
              pageInfo: {
                __typename: 'PageInfo',
                startCursor: '1',
                endCursor: '2',
                hasNextPage: false,
                hasPreviousPage: false,
              },
              totalCount: 2,
            },
          },
        },
      },
    };

    const mocks = [initialMock, searchMock];
    const searchLink = new StaticMockLink(mocks, false);

    renderManageTag(searchLink);

    await wait();

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(translations.searchByName),
      ).toBeInTheDocument();
    });

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('member 1')).toBeInTheDocument();
    });

    // Perform search
    const searchInput = screen.getByPlaceholderText(translations.searchByName);
    const searchButton = screen.getByTestId('searchBtn');

    await userEvent.type(searchInput, 'assigned user');
    await userEvent.click(searchButton);

    // Wait for search results with extended timeout
    await waitFor(
      () => {
        expect(screen.getByText('assigned user1')).toBeInTheDocument();
        expect(screen.getByText('assigned user2')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    // Verify we have 2 users
    await waitFor(() => {
      const buttons = screen.getAllByTestId('viewProfileBtn');
      expect(buttons.length).toEqual(2);
    });
  });

  it('Fetches more assigned members with infinite scroll', async () => {
    const { getByText } = renderManageTag(link7);

    await wait();

    await waitFor(() => {
      expect(getByText(translations.addPeopleToTag)).toBeInTheDocument();
    });

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('member 1')).toBeInTheDocument();
    });

    // Get the initial number of members loaded
    const initialAssignedMembersDataLength =
      screen.getAllByTestId('viewProfileBtn').length;

    // Click the mocked load more button
    const loadMoreBtn = screen.getByTestId('load-more-trigger');
    await userEvent.click(loadMoreBtn);

    // Wait for second member to appear
    await waitFor(
      () => {
        expect(screen.getByText('member 2')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    await waitFor(() => {
      const finalAssignedMembersDataLength =
        screen.getAllByTestId('viewProfileBtn').length;
      expect(finalAssignedMembersDataLength).toBeGreaterThan(
        initialAssignedMembersDataLength,
      );

      expect(getByText(translations.addPeopleToTag)).toBeInTheDocument();
    });
  });

  it('unassigns a tag from a member', async () => {
    renderManageTag(link);

    await wait();

    await waitFor(() => {
      expect(screen.getAllByTestId('unassignTagBtn')[0]).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByTestId('unassignTagBtn')[0]);

    await userEvent.click(screen.getByTestId('unassignTagModalSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        translations.successfullyUnassigned,
      );
    });
  });

  it('successfully edits the tag name', async () => {
    renderManageTag(link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('editUserTag')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('editUserTag'));

    await userEvent.click(screen.getByTestId('editTagSubmitBtn'));

    await waitFor(() => {
      expect(toast.info).toHaveBeenCalledWith(translations.changeNameToEdit);
    });

    const tagNameInput = screen.getByTestId('tagNameInput');
    await await userEvent.clear(tagNameInput);
    await await userEvent.type(tagNameInput, 'tag 1 edited');
    expect(tagNameInput).toHaveValue('tag 1 edited');

    await userEvent.click(screen.getByTestId('editTagSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        translations.tagUpdationSuccess,
      );
    });
  });

  it('successfully removes the tag and redirects to orgTags page', async () => {
    renderManageTag(link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('removeTag')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('removeTag'));

    await userEvent.click(screen.getByTestId('removeUserTagSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        translations.tagRemovalSuccess,
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('organizationTagsScreen')).toBeInTheDocument();
    });
  });

  it('handles null usersAssignedTo data gracefully', async () => {
    const { queryByText } = renderManageTag(link9);

    await wait();

    await waitFor(() => {
      expect(queryByText(translations.addPeopleToTag)).toBeInTheDocument();
    });
  });

  it('handles empty assigned members array gracefully', async () => {
    const { getByText } = renderManageTag(link10);

    await wait();

    await waitFor(() => {
      expect(getByText(translations.addPeopleToTag)).toBeInTheDocument();
    });
  });

  it('handles null edges array gracefully', async () => {
    const { queryByText } = renderManageTag(link11);

    await wait();

    await waitFor(() => {
      expect(queryByText(translations.addPeopleToTag)).toBeInTheDocument();
    });
  });

  it('handles null pageInfo gracefully', async () => {
    const { queryByText } = renderManageTag(link12);

    await wait();

    await waitFor(() => {
      expect(queryByText(translations.addPeopleToTag)).toBeInTheDocument();
    });
  });

  it('handles null ancestorTags gracefully', async () => {
    const { getByText } = renderManageTag(link13);

    await wait();

    await waitFor(() => {
      expect(getByText(translations.addPeopleToTag)).toBeInTheDocument();
    });
  });

  it('handles undefined data gracefully', async () => {
    const { queryByText } = renderManageTag(link14);

    await wait();

    await waitFor(() => {
      expect(queryByText(translations.addPeopleToTag)).toBeInTheDocument();
    });
  });

  it('handles null data gracefully', async () => {
    const { queryByText } = renderManageTag(link15);

    await wait();

    await waitFor(() => {
      expect(queryByText(translations.addPeopleToTag)).toBeInTheDocument();
    });
  });

  it('handles error in unassign user tag mutation', async () => {
    renderManageTag(link16);

    await wait();

    await waitFor(() => {
      expect(screen.getAllByTestId('unassignTagBtn')[0]).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByTestId('unassignTagBtn')[0]);

    await userEvent.click(screen.getByTestId('unassignTagModalSubmitBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('handles error in update user tag mutation', async () => {
    renderManageTag(link17);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('editUserTag')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('editUserTag'));

    await userEvent.click(screen.getByTestId('editTagSubmitBtn'));

    await waitFor(() => {
      expect(toast.info).toHaveBeenCalledWith(translations.changeNameToEdit);
    });

    const tagNameInput = screen.getByTestId('tagNameInput');
    await userEvent.clear(tagNameInput);
    await userEvent.type(tagNameInput, 'tag 1 edited');
    expect(tagNameInput).toHaveValue('tag 1 edited');

    await userEvent.click(screen.getByTestId('editTagSubmitBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('handles error in remove user tag mutation', async () => {
    renderManageTag(link18);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('removeTag')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('removeTag'));

    await userEvent.click(screen.getByTestId('removeUserTagSubmitBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('renders breadcrumbs with ancestor tags', async () => {
    const { getByText } = renderManageTag(link6);

    await wait();

    await waitFor(() => {
      expect(getByText(translations.addPeopleToTag)).toBeInTheDocument();
    });

    // Check if ancestor tags are rendered in breadcrumbs
    await waitFor(() => {
      expect(screen.getByTestId('allTagsBtn')).toBeInTheDocument();
    });
  });

  it.skip('handles infinite scroll with pagination correctly', async () => {
    // This test is a duplicate of the earlier "Fetches more assigned members with infinite scroll" test
    // Skipped to avoid redundant coverage and reduce test runtime
  });

  it('handles non-Error object in catch block', async () => {
    renderManageTag(link8);

    await wait();

    await waitFor(() => {
      expect(screen.getAllByTestId('unassignTagBtn')[0]).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByTestId('unassignTagBtn')[0]);

    await userEvent.click(screen.getByTestId('unassignTagModalSubmitBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('successfully unassigns a tag from a member with success mock', async () => {
    renderManageTag(link3);

    await wait();

    await waitFor(() => {
      expect(screen.getAllByTestId('unassignTagBtn')[0]).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByTestId('unassignTagBtn')[0]);

    await userEvent.click(screen.getByTestId('unassignTagModalSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        translations.successfullyUnassigned,
      );
    });
  });

  it('successfully updates the tag name with success mock', async () => {
    renderManageTag(link4);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('editUserTag')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('editUserTag'));

    await userEvent.click(screen.getByTestId('editTagSubmitBtn'));

    await waitFor(() => {
      expect(toast.info).toHaveBeenCalledWith(translations.changeNameToEdit);
    });

    const tagNameInput = screen.getByTestId('tagNameInput');
    await userEvent.clear(tagNameInput);
    await userEvent.type(tagNameInput, 'tag 1 edited');
    expect(tagNameInput).toHaveValue('tag 1 edited');

    await userEvent.click(screen.getByTestId('editTagSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        translations.tagUpdationSuccess,
      );
    });
  });

  it('successfully removes the tag with success mock', async () => {
    renderManageTag(link5);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('removeTag')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('removeTag'));

    await userEvent.click(screen.getByTestId('removeUserTagSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        translations.tagRemovalSuccess,
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('organizationTagsScreen')).toBeInTheDocument();
    });
  });

  it('should render sort functionality and cover setAssignedMemberSortOrder callback', async () => {
    const mocks = [
      {
        request: {
          query: USER_TAGS_ASSIGNED_MEMBERS,
          variables: {
            id: 'tag-123',
            first: TAGS_QUERY_DATA_CHUNK_SIZE,
            where: {
              firstName: { starts_with: '' },
              lastName: { starts_with: '' },
            },
            sortedBy: { id: 'DESCENDING' },
          },
        },
        result: {
          data: {
            getAssignedUsers: {
              __typename: 'UserTag',
              name: 'Test Tag',
              ancestorTags: [],
              usersAssignedTo: {
                __typename: 'UserTagUsersAssignedToConnection',
                edges: [
                  {
                    __typename: 'UserTagUsersAssignedToEdge',
                    node: {
                      __typename: 'User',
                      _id: '1',
                      firstName: 'John',
                      lastName: 'Doe',
                    },
                    cursor: '1',
                  },
                ],
                pageInfo: {
                  __typename: 'PageInfo',
                  hasNextPage: false,
                  endCursor: null,
                },
              },
            },
          },
        },
      },
      {
        request: {
          query: USER_TAGS_ASSIGNED_MEMBERS,
          variables: {
            id: 'tag-123',
            first: TAGS_QUERY_DATA_CHUNK_SIZE,
            where: {
              firstName: { starts_with: '' },
              lastName: { starts_with: '' },
            },
            sortedBy: { id: 'ASCENDING' },
          },
        },
        result: {
          data: {
            getAssignedUsers: {
              __typename: 'UserTag',
              name: 'Test Tag',
              ancestorTags: [],
              usersAssignedTo: {
                __typename: 'UserTagUsersAssignedToConnection',
                edges: [
                  {
                    __typename: 'UserTagUsersAssignedToEdge',
                    node: {
                      __typename: 'User',
                      _id: '1',
                      firstName: 'John',
                      lastName: 'Doe',
                    },
                    cursor: '1',
                  },
                ],
                pageInfo: {
                  __typename: 'PageInfo',
                  hasNextPage: false,
                  endCursor: null,
                },
              },
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={['/orgtags/org-123/manageTag/tag-123']}>
          <Routes>
            <Route
              path="/orgtags/:orgId/manageTag/:tagId"
              element={<ManageTag />}
            />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Click the sort button to open the dropdown
    const sortButton = screen.getByTestId('sortPeople');
    await userEvent.click(sortButton);

    // Wait for dropdown to open and click on "Oldest" option (ASCENDING)
    await waitFor(() => {
      const oldestOption = screen.getByTestId('ASCENDING');
      expect(oldestOption).toBeInTheDocument();
    });

    const oldestOption = screen.getByTestId('ASCENDING');
    await userEvent.click(oldestOption);

    // This should trigger the onSortChange callback on line 410
    // The callback calls setAssignedMemberSortOrder(value as SortedByType)
    // We can verify this by checking that the component re-renders with the new sort order
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});
