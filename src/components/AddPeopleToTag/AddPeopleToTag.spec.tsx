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
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { I18nextProvider } from 'react-i18next';

import { store } from 'state/store';
import userEvent from '@testing-library/user-event';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import { InMemoryCache, type ApolloLink } from '@apollo/client';
import type { InterfaceAddPeopleToTagProps } from './AddPeopleToTag';
import AddPeopleToTag from './AddPeopleToTag';
import i18n from 'utils/i18nForTest';
import { MOCKS, MOCKS_ERROR } from './AddPeopleToTagsMocks';
import type { TFunction } from 'i18next';

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

describe('Organisation Tags Page', () => {
  beforeEach(() => {
    // Mocking `react-router-dom` to return the actual module and override `useParams`
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom'); // Import the actual module
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
    userEvent.click(screen.getAllByTestId('selectMemberBtn')[0]);

    await waitFor(() => {
      expect(screen.getAllByTestId('selectMemberBtn')[1]).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('selectMemberBtn')[1]);

    await waitFor(() => {
      expect(
        screen.getAllByTestId('clearSelectedMember')[0],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('clearSelectedMember')[0]);

    await waitFor(() => {
      expect(screen.getAllByTestId('deselectMemberBtn')[0]).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('deselectMemberBtn')[0]);
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

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('assignPeopleBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('assignPeopleBtn'));

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
    userEvent.click(screen.getAllByTestId('selectMemberBtn')[0]);

    await waitFor(() => {
      expect(screen.getAllByTestId('selectMemberBtn')[1]).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('selectMemberBtn')[1]);

    await waitFor(() => {
      expect(screen.getAllByTestId('selectMemberBtn')[2]).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('selectMemberBtn')[2]);

    userEvent.click(screen.getByTestId('assignPeopleBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        translations.successfullyAssignedToPeople,
      );
    });
  });
});
