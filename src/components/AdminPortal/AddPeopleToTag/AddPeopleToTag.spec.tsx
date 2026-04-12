import React from 'react';
import { vi, expect, describe, it, beforeEach, afterEach } from 'vitest';
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
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

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

const createCache = (): InMemoryCache =>
  new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getUserTag: {
            merge(existing = {}, incoming) {
              return {
                ...existing,
                ...incoming,
              };
            },
          },
        },
      },
    },
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
};

const props: InterfaceAddPeopleToTagProps = {
  addPeopleToTagModalIsOpen: true,
  hideAddPeopleToTagModal: vi.fn(),
  refetchAssignedMembersData: vi.fn(),
};

const renderAddPeopleToTagModal = (
  customProps: InterfaceAddPeopleToTagProps,
  link: ApolloLink = new StaticMockLink(MOCKS, true),
  cache: InMemoryCache = createCache(),
): RenderResult => {
  return render(
    <MockedProvider cache={cache} link={link}>
      <MemoryRouter initialEntries={['/admin/orgtags/1/manageTag/1']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <Routes>
              <Route
                path="/admin/orgtags/:orgId/manageTag/:tagId"
                element={<AddPeopleToTag {...customProps} />}
              />
            </Routes>
          </I18nextProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );
};

describe('Organisation Tags Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('Component loads correctly', async () => {
    const { getByText } = renderAddPeopleToTagModal(props);

    await waitFor(() => {
      expect(getByText(translations.addPeople)).toBeInTheDocument();
    });
  });

  it('Renders error component when when query is unsuccessful', async () => {
    renderAddPeopleToTagModal(props, new StaticMockLink(MOCKS_ERROR, true));

    await waitFor(() => {
      expect(
        screen.getByText(/error occured while loading members/i),
      ).toBeInTheDocument();
    });
  });

  it('Selects and deselects members to assign to', async () => {
    const user = userEvent.setup();
    renderAddPeopleToTagModal(props);

    await waitFor(() => {
      expect(screen.getAllByTestId('selectMemberBtn')[0]).toBeInTheDocument();
    });
    await user.click(screen.getAllByTestId('selectMemberBtn')[0]);

    await waitFor(() => {
      expect(screen.getAllByTestId('selectMemberBtn')[0]).toBeInTheDocument();
    });
    await user.click(screen.getAllByTestId('selectMemberBtn')[0]);

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
    renderAddPeopleToTagModal(props);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(translations.searchByName),
      ).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(translations.searchByName);
    await user.clear(input);
    await user.paste('usersToAssignTo');

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
    renderAddPeopleToTagModal(props);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(translations.searchByName),
      ).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(translations.searchByName);
    await user.clear(input);
    await user.paste('userToAssignTo');

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
    renderAddPeopleToTagModal(props);

    const input = await screen.findByPlaceholderText(translations.searchByName);
    await user.click(input);
    await user.paste('usersToAssignTo');

    await waitFor(() => {
      expect(input).toHaveValue('usersToAssignTo');
    });

    await user.clear(input);

    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  it('clears last name search input', async () => {
    const user = userEvent.setup();
    renderAddPeopleToTagModal(props);

    const input = await screen.findByPlaceholderText(translations.searchByName);
    await user.click(input);
    await user.paste('userToAssignTo');

    await waitFor(() => {
      expect(input).toHaveValue('userToAssignTo');
    });

    await user.clear(input);

    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  it('Renders more members with infinite scroll', async () => {
    const { getByText } = renderAddPeopleToTagModal(props);

    await waitFor(() => {
      expect(getByText(translations.addPeople)).toBeInTheDocument();
    });

    const addPeopleToTagScrollableDiv = screen.getByTestId(
      'addPeopleToTagScrollableDiv',
    );

    const initialMemberDataLength = screen.getAllByTestId('memberName').length;

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
    renderAddPeopleToTagModal(props);

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
    renderAddPeopleToTagModal(props);

    await waitFor(() => {
      expect(screen.getAllByTestId('selectMemberBtn')[0]).toBeInTheDocument();
    });

    await user.click(screen.getAllByTestId('selectMemberBtn')[0]);
    await user.click(screen.getAllByTestId('selectMemberBtn')[0]);
    await user.click(screen.getAllByTestId('selectMemberBtn')[0]);

    await user.click(screen.getByTestId('assignPeopleBtn'));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        translations.successfullyAssignedToPeople,
      );
    });
  });

  it('Displays "no more members found" overlay when data is empty', async () => {
    renderAddPeopleToTagModal(props, new StaticMockLink(MOCK_EMPTY, true));

    expect(
      await screen.findByText(translations.noMoreMembersFound),
    ).toBeInTheDocument();
  });

  it('Resets the search state and refetches when the modal transitions from closed to open', async () => {
    const cache = createCache();
    const link = new StaticMockLink(MOCKS, true);

    const { rerender } = renderAddPeopleToTagModal(
      { ...defaultProps, addPeopleToTagModalIsOpen: false },
      link,
      cache,
    );

    await act(async () => {
      rerender(
        <MockedProvider cache={cache} link={link}>
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
      expect(
        screen.getByPlaceholderText(translations.searchByName),
      ).toHaveValue('');
    });
  });

  it('displays the unknownError toast if a non-Error is thrown', async () => {
    const user = userEvent.setup();
    renderAddPeopleToTagModal(props, new StaticMockLink(MOCK_NON_ERROR, true));

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
