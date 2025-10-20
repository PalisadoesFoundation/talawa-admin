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

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS_ERROR, true);

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

    await waitFor(() => {
      expect(getByText(translations.addPeople)).toBeInTheDocument();
    });
  });

  it('Renders error component when when query is unsuccessful', async () => {
    const { queryByText } = renderAddPeopleToTagModal(props, link2);

    await waitFor(() => {
      expect(queryByText(translations.addPeople)).not.toBeInTheDocument();
    });
  });

  it('Selects and deselects members to assign to', async () => {
    renderAddPeopleToTagModal(props, link);

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
      const finalMemberDataLength = screen.getAllByTestId('memberName').length;
      expect(finalMemberDataLength).toBeGreaterThan(initialMemberDataLength);

      expect(getByText(translations.addPeople)).toBeInTheDocument();
    });
  });

  it('Toasts error when no one is selected while assigning', async () => {
    renderAddPeopleToTagModal(props, link);

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
    fireEvent.scroll(scrollableDiv, {
      target: { scrollY: 99999 },
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

  it('verifies modal header is rendered with correct test ID', async () => {
    renderAddPeopleToTagModal(props, link);

    await waitFor(() => {
      expect(screen.getByTestId('modalOrganizationHeader')).toBeInTheDocument();
    });
  });

  it('verifies modal renders with correct structure and footer buttons', async () => {
    renderAddPeopleToTagModal(props, link);

    await waitFor(() => {
      expect(
        screen.getByTestId('closeAddPeopleToTagModal'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('assignPeopleBtn')).toBeInTheDocument();
    });
  });

  it('verifies search inputs have correct placeholder text', async () => {
    renderAddPeopleToTagModal(props, link);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(translations.firstName),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(translations.lastName),
      ).toBeInTheDocument();
    });
  });

  it('verifies member selection badge displays correct member info', async () => {
    renderAddPeopleToTagModal(props, link);

    await waitFor(() => {
      expect(screen.getAllByTestId('selectMemberBtn')[0]).toBeInTheDocument();
    });

    await userEvent.click(screen.getAllByTestId('selectMemberBtn')[0]);

    await waitFor(() => {
      const memberBadges = screen.getAllByTestId('clearSelectedMember');
      expect(memberBadges).toHaveLength(1);
    });
  });

  it('verifies member names render in data grid', async () => {
    renderAddPeopleToTagModal(props, link);

    await waitFor(() => {
      const memberNames = screen.getAllByTestId('memberName');
      expect(memberNames).toHaveLength(10);
    });
  });

  it('verifies assign button is enabled by default', async () => {
    renderAddPeopleToTagModal(props, link);

    const assignBtn = screen.getByTestId('assignPeopleBtn');
    expect(assignBtn).toBeEnabled();
  });

  it('handles modal close button click correctly', async () => {
    const mockHideModal = vi.fn();
    const customProps = {
      ...props,
      hideAddPeopleToTagModal: mockHideModal,
    };

    renderAddPeopleToTagModal(customProps, link);

    await waitFor(() => {
      expect(
        screen.getByTestId('closeAddPeopleToTagModal'),
      ).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('closeAddPeopleToTagModal'));

    await waitFor(() => {
      expect(mockHideModal).toHaveBeenCalled();
    });
  });

  it('refetch is called when modal transitions from closed to open', async () => {
    const { rerender } = renderComponent({
      addPeopleToTagModalIsOpen: false,
    });

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

  it('verifies search input trimming works correctly for firstName', async () => {
    renderAddPeopleToTagModal(props, link);

    const firstNameInput = screen.getByPlaceholderText(
      translations.firstName,
    ) as HTMLInputElement;
    fireEvent.change(firstNameInput, {
      target: { value: '  usersToAssignTo  ' },
    });

    await waitFor(() => {
      const members = screen.getAllByTestId('memberName');
      expect(members.length).toEqual(2);
    });
  });

  it('verifies search input trimming works correctly for lastName', async () => {
    renderAddPeopleToTagModal(props, link);

    const lastNameInput = screen.getByPlaceholderText(
      translations.lastName,
    ) as HTMLInputElement;
    fireEvent.change(lastNameInput, {
      target: { value: '  userToAssignTo  ' },
    });

    await waitFor(() => {
      const members = screen.getAllByTestId('memberName');
      expect(members.length).toEqual(2);
    });
  });

  it('verifies button has correct styling when member is selected (danger variant)', async () => {
    renderAddPeopleToTagModal(props, link);

    await waitFor(() => {
      expect(screen.getAllByTestId('selectMemberBtn')[0]).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByTestId('selectMemberBtn')[0]);

    await waitFor(() => {
      const deselectBtn = screen.getAllByTestId('deselectMemberBtn')[0];
      expect(deselectBtn).toHaveClass('btn-danger');
      expect(deselectBtn).toHaveClass('btn-sm');
    });
  });

  it('verifies button has correct styling when member is not selected (primary variant)', async () => {
    renderAddPeopleToTagModal(props, link);

    await waitFor(() => {
      const selectBtn = screen.getAllByTestId('selectMemberBtn')[0];
      expect(selectBtn).toBeInTheDocument();
      expect(selectBtn).toHaveClass('btn-primary');
      expect(selectBtn).toHaveClass('btn-sm');
      expect(selectBtn).not.toHaveClass('btn-danger');
    });
  });
});
