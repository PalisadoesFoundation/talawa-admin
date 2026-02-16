import React from 'react';
import { vi, expect, describe, it } from 'vitest';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import { render, screen, cleanup, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { store } from 'state/store';
import userEvent from '@testing-library/user-event';
import { StaticMockLink } from 'utils/StaticMockLink';
import { InMemoryCache, type ApolloLink } from '@apollo/client';
import type { InterfaceAddPeopleToTagProps } from 'types/AdminPortal/Tag/interface';
import AddPeopleToTag from './AddPeopleToTag';
import i18n from 'utils/i18nForTest';
import {
  MOCK_EMPTY,
  MOCK_NON_ERROR,
  MOCKS,
  MOCKS_ERROR,
} from './AddPeopleToTagsMocks';
import type { TFunction } from 'i18next';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS_ERROR, true);

async function wait(): Promise<void> {
  await waitFor(() => {
    // The waitFor utility automatically uses optimal timing
    return Promise.resolve();
  });
}

const toastMocks = vi.hoisted(() => {
  return {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    dismiss: vi.fn(),
  };
});

vi.mock('components/NotificationToast/NotificationToast', async () => {
  return {
    NotificationToast: toastMocks,
  };
});

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
    <MockedProvider cache={cache} link={link}>
      <MemoryRouter initialEntries={['/admin/orgtags/123/manageTag/1']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <Routes>
              <Route
                path="/admin/orgtags/:orgId/manageTag/:tagId"
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
      <MemoryRouter initialEntries={['/admin/orgtags/1/manageTag/1']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <Routes>
              <Route
                path="/admin/orgtags/:orgId/manageTag/:tagId"
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
    const user = userEvent.setup();
    renderAddPeopleToTagModal(props, link);

    await wait();

    await waitFor(() => {
      expect(screen.getAllByTestId('selectMemberBtn')[0]).toBeInTheDocument();
    });
    await user.click(screen.getAllByTestId('selectMemberBtn')[0]);

    await waitFor(() => {
      expect(screen.getAllByTestId('selectMemberBtn')[1]).toBeInTheDocument();
    });
    await user.click(screen.getAllByTestId('selectMemberBtn')[1]);

    await waitFor(() => {
      expect(
        screen.getAllByTestId('clearSelectedMember')[0],
      ).toBeInTheDocument();
    });
    await user.click(screen.getAllByTestId('clearSelectedMember')[0]);

    await waitFor(() => {
      expect(screen.getAllByTestId('deselectMemberBtn')[0]).toBeInTheDocument();
    });
    await user.click(screen.getAllByTestId('deselectMemberBtn')[0]);
  });

  it('searchs for tags where the firstName matches the provided firstName search input', async () => {
    const user = userEvent.setup();
    renderAddPeopleToTagModal(props, link);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(translations.firstName),
      ).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(translations.firstName);

    // clear and type value
    await user.clear(input);
    await user.paste('usersToAssignTo');

    // should render the two users from the mock data
    await waitFor(() => {
      const members = screen.getAllByTestId('memberName');
      expect(members).toHaveLength(2);
    });

    const members = screen.getAllByTestId('memberName');

    expect(members[0]).toHaveTextContent('usersToAssignTo user1');
    expect(members[1]).toHaveTextContent('usersToAssignTo user2');
  });

  it('searchs for tags where the lastName matches the provided lastName search input', async () => {
    const user = userEvent.setup();
    renderAddPeopleToTagModal(props, link);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(translations.lastName),
      ).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(translations.lastName);

    // clear and type value
    await user.clear(input);
    await user.paste('userToAssignTo');

    // should render the two users from the mock data
    await waitFor(() => {
      const members = screen.getAllByTestId('memberName');
      expect(members).toHaveLength(2);
    });

    const members = screen.getAllByTestId('memberName');

    expect(members[0]).toHaveTextContent('first userToAssignTo');
    expect(members[1]).toHaveTextContent('second userToAssignTo');
  });

  it('clears first name search input', async () => {
    const user = userEvent.setup();
    renderAddPeopleToTagModal(props, link);
    await wait();

    const input = screen.getByPlaceholderText(translations.firstName);
    // use a value that exists in mocks
    await user.click(input);
    await user.paste('usersToAssignTo');

    await waitFor(() => {
      expect(input).toHaveValue('usersToAssignTo');
    });

    // clear button exists because query succeeded
    const clearBtn = await screen.findByTestId('clearFirstNameSearch');
    await user.click(clearBtn);
    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  it('clears last name search input', async () => {
    const user = userEvent.setup();
    renderAddPeopleToTagModal(props, link);
    await wait();

    const input = screen.getByPlaceholderText(translations.lastName);

    // use a value that exists in mocks
    await user.click(input);
    await user.paste('userToAssignTo');

    await waitFor(() => {
      expect(input).toHaveValue('userToAssignTo');
    });

    // SearchBar renders a clear button when value is not empty
    const clearBtn = await screen.findByTestId('clearLastNameSearch');
    await user.click(clearBtn);
    await waitFor(() => {
      expect(input).toHaveValue('');
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
    await act(async () => {
      addPeopleToTagScrollableDiv.scrollTop =
        addPeopleToTagScrollableDiv.scrollHeight;
      addPeopleToTagScrollableDiv.dispatchEvent(
        new Event('scroll', { bubbles: true }),
      );
    });

    await waitFor(() => {
      const finalMemberDataLength = screen.getAllByTestId('memberName').length;
      expect(finalMemberDataLength).toBeGreaterThan(initialMemberDataLength);

      expect(getByText(translations.addPeople)).toBeInTheDocument();
    });
  });

  it('Toasts error when no one is selected while assigning', async () => {
    const user = userEvent.setup();
    renderAddPeopleToTagModal(props, link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('assignPeopleBtn')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('assignPeopleBtn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        translations.noOneSelected,
      );
    });
  });

  it('Assigns tag to multiple people', async () => {
    const user = userEvent.setup();
    renderAddPeopleToTagModal(props, link);

    await wait();

    // select members and assign them
    await waitFor(() => {
      expect(screen.getAllByTestId('selectMemberBtn')[0]).toBeInTheDocument();
    });
    await user.click(screen.getAllByTestId('selectMemberBtn')[0]);

    await waitFor(() => {
      expect(screen.getAllByTestId('selectMemberBtn')[1]).toBeInTheDocument();
    });
    await user.click(screen.getAllByTestId('selectMemberBtn')[1]);

    await waitFor(() => {
      expect(screen.getAllByTestId('selectMemberBtn')[2]).toBeInTheDocument();
    });
    await user.click(screen.getAllByTestId('selectMemberBtn')[2]);

    await user.click(screen.getByTestId('assignPeopleBtn'));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
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

    await act(async () => {
      rerender(
        <MockedProvider cache={cache} link={new StaticMockLink(MOCKS, true)}>
          <MemoryRouter initialEntries={['/admin/orgtags/1/manageTag/1']}>
            <Provider store={store}>
              <I18nextProvider i18n={i18n}>
                <Routes>
                  <Route
                    path="/admin/orgtags/:orgId/manageTag/:tagId"
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
    const user = userEvent.setup();
    const linkWithNonError = new StaticMockLink(MOCK_NON_ERROR, true);

    const customProps = {
      ...props,
      addPeopleToTagModalIsOpen: true,
    };

    renderAddPeopleToTagModal(customProps, linkWithNonError);

    await waitFor(() => {
      expect(screen.getAllByTestId('selectMemberBtn')).toHaveLength(1);
    });

    await user.click(screen.getAllByTestId('selectMemberBtn')[0]);
    await user.click(screen.getByTestId('assignPeopleBtn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });
  });
});
