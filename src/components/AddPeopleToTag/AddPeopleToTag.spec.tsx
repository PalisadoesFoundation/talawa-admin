import React from 'react';
import { vi, expect, describe, it } from 'vitest';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
  act,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { store } from 'state/store';
import userEvent from '@testing-library/user-event';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import { InMemoryCache, type ApolloLink } from '@apollo/client';
import type { InterfaceAddPeopleToTagProps } from 'types/Tag/interface';
import AddPeopleToTag from './AddPeopleToTag';
import i18n from 'utils/i18nForTest';
import {
  MOCK_EMPTY,
  MOCK_NULL_FETCH_MORE,
  MOCK_NO_DATA,
  MOCK_NON_ERROR,
  MOCKS,
  MOCKS_ERROR,
} from './AddPeopleToTagsMocks';
import type { TFunction } from 'i18next';
import { USER_TAGS_MEMBERS_TO_ASSIGN_TO } from 'GraphQl/Queries/userTagQueries';
import { ADD_PEOPLE_TO_TAG } from 'GraphQl/Mutations/TagMutations';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS_ERROR, true);

async function wait(): Promise<void> {
  await waitFor(() => {
    // The waitFor utility automatically uses optimal timing
    return Promise.resolve();
  });
}

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const translations = {
  ...JSON.parse(
    JSON.stringify(i18n.getDataByLanguage('en')?.translation.manageTag ?? {}),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

const defaultProps: InterfaceAddPeopleToTagProps = {
  addPeopleToTagModalIsOpen: false,
  hideAddPeopleToTagModal: vi.fn(),
  refetchAssignedMembersData: vi.fn(),
  t: ((key: string) => key) as TFunction<'translation', 'manageTag'>,
  tCommon: ((key: string) => key) as TFunction<'common', undefined>,
};

const props: InterfaceAddPeopleToTagProps = {
  addPeopleToTagModalIsOpen: true,
  hideAddPeopleToTagModal: () => {},
  refetchAssignedMembersData: () => {},
  t: ((key: string) => translations[key]) as TFunction<
    'translation',
    'manageTag'
  >,
  tCommon: ((key: string) => translations[key]) as TFunction<
    'common',
    undefined
  >,
};

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        getUserTag: {
          merge(existing = {}, incoming) {
            const merged = {
              ...existing,
              ...incoming,
              usersToAssignTo: {
                ...existing.usersToAssignTo,
                ...incoming.usersToAssignTo,
                edges: [
                  ...(existing.usersToAssignTo?.edges || []),
                  ...(incoming.usersToAssignTo?.edges || []),
                ],
              },
            };

            return merged;
          },
        },
      },
    },
  },
});

const renderAddPeopleToTagModal = (
  props: InterfaceAddPeopleToTagProps,
  link: ApolloLink,
): RenderResult => {
  return render(
    <MockedProvider cache={cache} addTypename={false} link={link}>
      <MemoryRouter initialEntries={['/orgtags/123/manageTag/1']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <Routes>
              <Route
                path="/orgtags/:orgId/manageTag/:tagId"
                element={<AddPeopleToTag {...props} />}
              />
            </Routes>
          </I18nextProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );
};

const renderComponent = (
  customProps?: Partial<InterfaceAddPeopleToTagProps>,
): RenderResult =>
  render(
    <MockedProvider cache={cache} link={new StaticMockLink(MOCKS, true)}>
      <MemoryRouter initialEntries={['/orgtags/1/manageTag/1']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <Routes>
              <Route
                path="/orgtags/:orgId/manageTag/:tagId"
                element={
                  <AddPeopleToTag {...defaultProps} {...(customProps ?? {})} />
                }
              />
            </Routes>
          </I18nextProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );

describe('Organisation Tags Page', () => {
  beforeEach(() => {
    // Mocking `react-router-dom` to return the actual module and override `useParams`
    vi.mock('react-router', async () => {
      const actual = await vi.importActual('react-router'); // Import the actual module
      return {
        ...actual,
        useParams: () => ({ orgId: '1', tagId: '1' }), // Mock `useParams` to return a custom object
      };
    });

    // Reset any necessary cache or mocks
    vi.clearAllMocks(); // Clear all mocks to ensure a clean state before each test
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('Component loads correctly', async () => {
    const { getByText } = renderAddPeopleToTagModal(props, link);

    await wait();

    await waitFor(() => {
      expect(getByText(translations.addPeople)).toBeInTheDocument();
    });
  });

  it('Renders error component when when query is unsuccessful', async () => {
    const { queryByText } = renderAddPeopleToTagModal(props, link2);

    await wait();

    await waitFor(() => {
      expect(queryByText(translations.addPeople)).not.toBeInTheDocument();
    });
  });

  it('Selects and deselects members to assign to', async () => {
    renderAddPeopleToTagModal(props, link);

    await wait();

    await waitFor(() => {
      expect(screen.getAllByTestId('selectMemberBtn')[0]).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByTestId('selectMemberBtn')[0]);

    await waitFor(() => {
      expect(screen.getAllByTestId('selectMemberBtn')[1]).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByTestId('selectMemberBtn')[1]);

    await waitFor(() => {
      expect(
        screen.getAllByTestId('clearSelectedMember')[0],
      ).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByTestId('clearSelectedMember')[0]);

    await waitFor(() => {
      expect(screen.getAllByTestId('deselectMemberBtn')[0]).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByTestId('deselectMemberBtn')[0]);
  });

  it('searchs for tags where the firstName matches the provided firstName search input', async () => {
    renderAddPeopleToTagModal(props, link);

    await wait();

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(translations.firstName),
      ).toBeInTheDocument();
    });
    const input = screen.getByPlaceholderText(translations.firstName);
    fireEvent.change(input, { target: { value: 'usersToAssignTo' } });

    // should render the two users from the mock data
    // where firstName starts with "usersToAssignTo"
    await waitFor(() => {
      const members = screen.getAllByTestId('memberName');
      expect(members.length).toEqual(2);
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('memberName')[0]).toHaveTextContent(
        'usersToAssignTo user1',
      );
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('memberName')[1]).toHaveTextContent(
        'usersToAssignTo user2',
      );
    });
  });

  it('searchs for tags where the lastName matches the provided lastName search input', async () => {
    renderAddPeopleToTagModal(props, link);

    await wait();

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(translations.lastName),
      ).toBeInTheDocument();
    });
    const input = screen.getByPlaceholderText(translations.lastName);
    fireEvent.change(input, { target: { value: 'userToAssignTo' } });

    // should render the two users from the mock data
    // where lastName starts with "usersToAssignTo"
    await waitFor(() => {
      const members = screen.getAllByTestId('memberName');
      expect(members.length).toEqual(2);
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('memberName')[0]).toHaveTextContent(
        'first userToAssignTo',
      );
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('memberName')[1]).toHaveTextContent(
        'second userToAssignTo',
      );
    });
  });

  it('Renders more members with infinite scroll', async () => {
    const { getByText } = renderAddPeopleToTagModal(props, link);

    await wait();

    await waitFor(() => {
      expect(getByText(translations.addPeople)).toBeInTheDocument();
    });

    // Find the infinite scroll div by test ID or another selector
    const addPeopleToTagScrollableDiv = screen.getByTestId(
      'addPeopleToTagScrollableDiv',
    );

    const initialMemberDataLength = screen.getAllByTestId('memberName').length;

    // Set up realistic scroll properties to trigger infinite scroll
    Object.defineProperty(addPeopleToTagScrollableDiv, 'scrollHeight', {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(addPeopleToTagScrollableDiv, 'clientHeight', {
      configurable: true,
      value: 300,
    });
    Object.defineProperty(addPeopleToTagScrollableDiv, 'scrollTop', {
      configurable: true,
      writable: true,
      value: 700,
    });

    // Trigger scroll event with scrollTop property
    fireEvent.scroll(addPeopleToTagScrollableDiv, {
      target: { scrollTop: 700 },
    });

    await waitFor(() => {
      const finalMemberDataLength = screen.getAllByTestId('memberName').length;
      expect(finalMemberDataLength).toBeGreaterThan(initialMemberDataLength);

      expect(getByText(translations.addPeople)).toBeInTheDocument();
    });
  });

  it('Toasts error when no one is selected while assigning', async () => {
    renderAddPeopleToTagModal(props, link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('assignPeopleBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('assignPeopleBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(translations.noOneSelected);
    });
  });

  it('Assigns tag to multiple people', async () => {
    renderAddPeopleToTagModal(props, link);

    await wait();

    // select members and assign them
    await waitFor(() => {
      expect(screen.getAllByTestId('selectMemberBtn')[0]).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByTestId('selectMemberBtn')[0]);

    await waitFor(() => {
      expect(screen.getAllByTestId('selectMemberBtn')[1]).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByTestId('selectMemberBtn')[1]);

    await waitFor(() => {
      expect(screen.getAllByTestId('selectMemberBtn')[2]).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByTestId('selectMemberBtn')[2]);

    await userEvent.click(screen.getByTestId('assignPeopleBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        translations.successfullyAssignedToPeople,
      );
    });
  });

  it('Displays "no more members found" overlay when data is empty', async () => {
    const link = new StaticMockLink(MOCK_EMPTY, true);
    renderAddPeopleToTagModal(props, link);

    await waitFor(() => {
      expect(
        screen.queryByTestId('infiniteScrollLoader'),
      ).not.toBeInTheDocument();
    });

    expect(
      screen.getByText(translations.noMoreMembersFound),
    ).toBeInTheDocument();
  });

  it('Resets the search state and refetches when the modal transitions from closed to open', async () => {
    const { rerender } = renderComponent({ addPeopleToTagModalIsOpen: false });

    act(() => {
      rerender(
        <MockedProvider cache={cache} link={new StaticMockLink(MOCKS, true)}>
          <MemoryRouter initialEntries={['/orgtags/1/manageTag/1']}>
            <Provider store={store}>
              <I18nextProvider i18n={i18n}>
                <Routes>
                  <Route
                    path="/orgtags/:orgId/manageTag/:tagId"
                    element={
                      <AddPeopleToTag
                        {...defaultProps}
                        addPeopleToTagModalIsOpen={true}
                      />
                    }
                  />
                </Routes>
              </I18nextProvider>
            </Provider>
          </MemoryRouter>
        </MockedProvider>,
      );
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText('firstName')).toHaveValue('');
      expect(screen.getByPlaceholderText('lastName')).toHaveValue('');
    });
  });

  it('displays the unknownError toast if a non-Error is thrown', async () => {
    const linkWithNonError = new StaticMockLink(MOCK_NON_ERROR, true);

    const customProps = {
      ...props,
      addPeopleToTagModalIsOpen: true,
    };

    renderAddPeopleToTagModal(customProps, linkWithNonError);

    await waitFor(() => {
      expect(screen.getAllByTestId('selectMemberBtn')).toHaveLength(1);
    });

    await userEvent.click(screen.getAllByTestId('selectMemberBtn')[0]);
    await userEvent.click(screen.getByTestId('assignPeopleBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('returns prevResult if fetchMoreResult is null', async () => {
    const linkWithNullFetchMore = new StaticMockLink(
      MOCK_NULL_FETCH_MORE,
      true,
    );

    renderAddPeopleToTagModal(props, linkWithNullFetchMore);

    await waitFor(() => {
      expect(screen.getByText('member 1')).toBeInTheDocument();
    });

    const scrollableDiv = screen.getByTestId('addPeopleToTagScrollableDiv');
    
    // Set up realistic scroll properties
    Object.defineProperty(scrollableDiv, 'scrollHeight', {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(scrollableDiv, 'clientHeight', {
      configurable: true,
      value: 300,
    });
    Object.defineProperty(scrollableDiv, 'scrollTop', {
      configurable: true,
      writable: true,
      value: 700,
    });

    fireEvent.scroll(scrollableDiv, {
      target: { scrollTop: 700 },
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('memberName')).toHaveLength(1);
    });
  });

  it('skips the if(data) block when the mutation returns data = null', async () => {
    const linkNoData = new StaticMockLink(MOCK_NO_DATA, true);
    renderAddPeopleToTagModal(props, linkNoData);

    await waitFor(() => {
      expect(screen.getAllByTestId('selectMemberBtn')).toHaveLength(1);
    });

    await userEvent.click(screen.getAllByTestId('selectMemberBtn')[0]);
    await userEvent.click(screen.getByTestId('assignPeopleBtn'));

    await waitFor(() => {
      expect(toast.success).not.toHaveBeenCalled();
    });
  });

  it('renders modal with correct structure and fetches data successfully', async () => {
    renderAddPeopleToTagModal(props, link);

    await wait();

    // Verify modal structure is rendered correctly
    await waitFor(() => {
      expect(screen.getByText(translations.addPeople)).toBeInTheDocument();
      expect(screen.getByTestId('searchByFirstName')).toBeInTheDocument();
      expect(screen.getByTestId('searchByLastName')).toBeInTheDocument();
      expect(screen.getByTestId('addPeopleToTagScrollableDiv')).toBeInTheDocument();
      expect(screen.getByTestId('closeAddPeopleToTagModal')).toBeInTheDocument();
      expect(screen.getByTestId('assignPeopleBtn')).toBeInTheDocument();
    });

    // Verify data loads successfully
    await waitFor(() => {
      expect(screen.getAllByTestId('memberName').length).toBeGreaterThan(0);
    });
  });

  it('closes modal when cancel button is clicked', async () => {
    const hideModalMock = vi.fn();
    const customProps = {
      ...props,
      hideAddPeopleToTagModal: hideModalMock,
    };

    renderAddPeopleToTagModal(customProps, link);

    await wait();

    await waitFor(() => {
      expect(
        screen.getByTestId('closeAddPeopleToTagModal'),
      ).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('closeAddPeopleToTagModal'));

    expect(hideModalMock).toHaveBeenCalled();
  });

  it('renders DataGrid with correct number of columns', async () => {
    renderAddPeopleToTagModal(props, link);

    await wait();

    await waitFor(() => {
      // Check that the header columns are rendered
      expect(screen.getByText('#')).toBeInTheDocument();
      expect(screen.getByText(translations.userName)).toBeInTheDocument();
      expect(screen.getByText(translations.actions)).toBeInTheDocument();
    });
  });

  it('assigns members when multiple members are selected from different pages', async () => {
    renderAddPeopleToTagModal(props, link);

    await wait();

    // Select members from first page
    await waitFor(() => {
      expect(screen.getAllByTestId('selectMemberBtn').length).toBeGreaterThan(
        0,
      );
    });

    const firstPageSelectButtons = screen.getAllByTestId('selectMemberBtn');
    await userEvent.click(firstPageSelectButtons[0]);

    // Verify first member is selected
    await waitFor(() => {
      expect(screen.getAllByTestId('deselectMemberBtn')[0]).toBeInTheDocument();
    });

    // Scroll to load more members
    const scrollableDiv = screen.getByTestId('addPeopleToTagScrollableDiv');
    
    // Set up realistic scroll properties
    Object.defineProperty(scrollableDiv, 'scrollHeight', {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(scrollableDiv, 'clientHeight', {
      configurable: true,
      value: 300,
    });
    Object.defineProperty(scrollableDiv, 'scrollTop', {
      configurable: true,
      writable: true,
      value: 700,
    });

    fireEvent.scroll(scrollableDiv, {
      target: { scrollTop: 700 },
    });

    // Wait for more members to load
    await waitFor(() => {
      const memberNames = screen.getAllByTestId('memberName');
      expect(memberNames.length).toBeGreaterThan(10);
    });

    // Select a member from the second page
    const allSelectButtons = screen.getAllByTestId('selectMemberBtn');
    if (allSelectButtons.length > 1) {
      await userEvent.click(allSelectButtons[allSelectButtons.length - 1]);
    }

    // Verify both members are selected and first member is still selected
    await waitFor(() => {
      const clearButtons = screen.getAllByTestId('clearSelectedMember');
      expect(clearButtons.length).toBeGreaterThanOrEqual(2);
      
      // Verify first member is still marked as deselected (has deselectMemberBtn)
      const deselectButtons = screen.getAllByTestId('deselectMemberBtn');
      expect(deselectButtons.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('does not render modal when addPeopleToTagModalIsOpen is false', () => {
    const customProps = {
      ...props,
      addPeopleToTagModalIsOpen: false,
    };

    const { container } = renderAddPeopleToTagModal(customProps, link);

    // Modal should not be visible
    const modal = container.querySelector('.modal.show');
    expect(modal).not.toBeInTheDocument();
  });

  it('handles member selection and deselection via badge removal correctly', async () => {
    renderAddPeopleToTagModal(props, link);

    await wait();

    // Select a member
    await waitFor(() => {
      expect(screen.getAllByTestId('selectMemberBtn')[0]).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByTestId('selectMemberBtn')[0]);

    // Verify the member appears in the badge container
    await waitFor(() => {
      const badges = screen.getAllByTestId('clearSelectedMember');
      expect(badges.length).toBe(1);
    });

    // Remove the member via the badge
    const clearButton = screen.getAllByTestId('clearSelectedMember')[0];
    await userEvent.click(clearButton);

    // Verify all badges are removed (count becomes zero)
    await waitFor(() => {
      const badges = screen.queryAllByTestId('clearSelectedMember');
      expect(badges.length).toBe(0);
    });
  });

  it('handles mutation error with Error instance correctly', async () => {
    const MOCK_ERROR_MUTATION = [
      {
        request: {
          query: USER_TAGS_MEMBERS_TO_ASSIGN_TO,
          variables: {
            id: '1',
            first: TAGS_QUERY_DATA_CHUNK_SIZE,
            where: {
              firstName: { starts_with: '' },
              lastName: { starts_with: '' },
            },
          },
        },
        result: {
          data: {
            getUsersToAssignTo: {
              usersToAssignTo: {
                edges: [
                  {
                    node: { _id: '1', firstName: 'Test', lastName: 'User' },
                    cursor: 'cursor1',
                  },
                ],
                pageInfo: {
                  hasNextPage: false,
                  endCursor: 'cursor1',
                  startCursor: 'cursor1',
                  hasPreviousPage: false,
                },
                totalCount: 1,
              },
              name: 'tag1',
            },
          },
        },
      },
      {
        request: {
          query: ADD_PEOPLE_TO_TAG,
          variables: { tagId: '1', userIds: ['1'] },
        },
        error: new Error('Mutation failed'),
      },
    ];

    const linkWithError = new StaticMockLink(MOCK_ERROR_MUTATION, true);
    renderAddPeopleToTagModal(props, linkWithError);

    await waitFor(() => {
      expect(screen.getAllByTestId('selectMemberBtn')).toHaveLength(1);
    });

    await userEvent.click(screen.getAllByTestId('selectMemberBtn')[0]);
    await userEvent.click(screen.getByTestId('assignPeopleBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Mutation failed');
    });
  });
});
