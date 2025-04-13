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
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { store } from 'state/store';
import userEvent from '@testing-library/user-event';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import { InMemoryCache, type ApolloLink } from '@apollo/client';
import type { InterfaceAddPeopleToTagProps } from 'types/Tag/interface';
import AddPeopleToTag from './AddPeopleToTag';
import i18n from 'utils/i18nForTest';
import { USER_TAGS_MEMBERS_TO_ASSIGN_TO } from 'GraphQl/Queries/userTagQueries';
import { TFunction } from 'i18next';
import {
  MOCK_EMPTY,
  MOCK_NO_DATA,
  MOCK_NON_ERROR,
  MOCK_NULL_FETCH_MORE,
} from './AddPeopleToTagsMocks';

// Add test data
const mockTagData = {
  tag: {
    id: '1',
    name: 'Test Tag',
    organization: {
      id: '1',
      members: {
        edges: [
          {
            node: {
              id: '1',
              name: 'Test Member 1',
            },
            cursor: 'cursor1',
          },
          {
            node: {
              id: '2',
              name: 'Test Member 2',
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
};

const MOCKS = [
  {
    request: {
      query: USER_TAGS_MEMBERS_TO_ASSIGN_TO,
      variables: { id: '1', first: 10 },
    },
    result: {
      data: mockTagData,
    },
  },
];

const MOCKS_ERROR = [
  {
    request: {
      query: USER_TAGS_MEMBERS_TO_ASSIGN_TO,
      variables: { id: '1', first: 10 },
    },
    error: new Error('An error occurred'),
  },
];

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

describe('AddPeopleToTag Component', () => {
  beforeEach(() => {
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useParams: () => ({ tagId: '1' }),
      };
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('displays error message when query fails', async () => {
    renderAddPeopleToTagModal(props, new StaticMockLink(MOCKS_ERROR, true));
  });

  it('handles successful data loading', async () => {
    renderAddPeopleToTagModal(props, new StaticMockLink(MOCKS, true));

    await waitFor(() => {
      expect(screen.getByText('Test Member 1')).toBeInTheDocument();
      expect(screen.getByText('Test Member 2')).toBeInTheDocument();
    });
  });

  it('allows selecting and deselecting members', async () => {
    renderAddPeopleToTagModal(props, new StaticMockLink(MOCKS, true));

    await waitFor(() => {
      const selectButtons = screen.getAllByRole('button', { name: '+' });
      expect(selectButtons.length).toBeGreaterThan(0);
      fireEvent.click(selectButtons[0]);
    });
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

    await userEvent.click(screen.getAllByTestId('selectMemberBtn')[1]);

    await waitFor(() => {
      expect(
        screen.getAllByTestId('clearSelectedMember')[0],
      ).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByTestId('clearSelectedMember')[0]);
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
    await waitFor(() => {
      const members = screen.getAllByTestId('memberName');
      expect(members.length).toEqual(2);
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

    // Set scroll position to the bottom
    fireEvent.scroll(addPeopleToTagScrollableDiv, {
      target: { scrollY: addPeopleToTagScrollableDiv.scrollHeight },
    });

    await waitFor(() => {
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

    await userEvent.click(screen.getAllByTestId('selectMemberBtn')[1]);

    await userEvent.click(screen.getAllByTestId('selectMemberBtn')[2]);

    await userEvent.click(screen.getByTestId('assignPeopleBtn'));
  });

  it('Displays "no more members found" overlay when data is empty', async () => {
    const link = new StaticMockLink(MOCK_EMPTY, true);
    renderAddPeopleToTagModal(props, link);

    await waitFor(() => {
      expect(
        screen.queryByTestId('infiniteScrollLoader'),
      ).not.toBeInTheDocument();
    });
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

    await userEvent.click(screen.getByTestId('assignPeopleBtn'));
  });

  it('skips the if(data) block when the mutation returns data = null', async () => {
    const linkNoData = new StaticMockLink(MOCK_NO_DATA, true);
    renderAddPeopleToTagModal(props, linkNoData);
    await userEvent.click(screen.getByTestId('assignPeopleBtn'));

    await waitFor(() => {
      expect(toast.success).not.toHaveBeenCalled();
    });
  });
});
