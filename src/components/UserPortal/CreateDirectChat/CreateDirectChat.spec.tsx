import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import useLocalStorage from 'utils/useLocalstorage';
import { vi } from 'vitest';
import CreateDirectChatModal from './CreateDirectChat';
import { ORGANIZATION_MEMBERS } from 'GraphQl/Queries/OrganizationQueries';
import {
  CREATE_CHAT,
  CREATE_CHAT_MEMBERSHIP,
} from 'GraphQl/Mutations/OrganizationMutations';
import * as ErrorHandler from 'utils/errorHandler';

// Mock dependencies
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => ({ orgId: 'test-org-id' }),
  };
});

const errorHandlerSpy = vi.spyOn(ErrorHandler, 'errorHandler');

// Mocks
const mockUsers = [
  {
    __typename: 'OrganizationMemberEdge',
    cursor: 'cursor-1',
    node: {
      __typename: 'User',
      id: '1', // This is the current user
      name: 'Current User',
      avatarURL: '',
      role: 'Admin',
    },
  },
  {
    __typename: 'OrganizationMemberEdge',
    cursor: 'cursor-2',
    node: {
      __typename: 'User',
      id: 'user-2',
      name: 'Test User 2',
      avatarURL: '',
      role: 'Member',
    },
  },
  {
    __typename: 'OrganizationMemberEdge',
    cursor: 'cursor-3',
    node: {
      __typename: 'User',
      id: 'user-3',
      name: 'Test User 3',
      avatarURL: '',
      role: 'Member',
    },
  },
];

const ORGANIZATION_MEMBERS_MOCK = {
  request: {
    query: ORGANIZATION_MEMBERS,
    variables: {
      input: { id: 'test-org-id' },
      first: 20,
      after: null,
      where: {},
    },
  },
  result: {
    data: {
      organization: {
        __typename: 'Organization',
        members: {
          __typename: 'OrganizationMemberConnection',
          edges: mockUsers,
          pageInfo: {
            __typename: 'PageInfo',
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: 'cursor-1',
            endCursor: 'cursor-3',
          },
        },
      },
    },
  },
};

const ORGANIZATION_MEMBERS_SEARCH_MOCK = {
  request: {
    query: ORGANIZATION_MEMBERS,
    variables: {
      input: { id: 'test-org-id' },
      first: 20,
      after: null,
      where: { name_contains: 'Test User 2' },
    },
  },
  result: {
    data: {
      organization: {
        __typename: 'Organization',
        members: {
          __typename: 'OrganizationMemberConnection',
          edges: [mockUsers[1]],
          pageInfo: {
            __typename: 'PageInfo',
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: 'cursor-2',
            endCursor: 'cursor-2',
          },
        },
      },
    },
  },
};

const CREATE_CHAT_MOCK = {
  request: {
    query: CREATE_CHAT,
    variables: {
      input: {
        organizationId: 'test-org-id',
        name: 'Current User & Test User 2',
        description: 'A direct chat conversation',
        avatar: null,
      },
    },
  },
  result: {
    data: {
      createChat: {
        __typename: 'Chat',
        id: 'new-chat-id',
      },
    },
  },
};

const CREATE_CHAT_MEMBERSHIP_MOCK_1 = {
  request: {
    query: CREATE_CHAT_MEMBERSHIP,
    variables: {
      input: { memberId: '1', chatId: 'new-chat-id', role: 'regular' },
    },
  },
  result: {
    data: {
      createChatMembership: { __typename: 'ChatMembership', id: 'cm-1' },
    },
  },
};

const CREATE_CHAT_MEMBERSHIP_MOCK_2 = {
  request: {
    query: CREATE_CHAT_MEMBERSHIP,
    variables: {
      input: { memberId: 'user-2', chatId: 'new-chat-id', role: 'regular' },
    },
  },
  result: {
    data: {
      createChatMembership: { __typename: 'ChatMembership', id: 'cm-2' },
    },
  },
};

const mocks = [
  ORGANIZATION_MEMBERS_MOCK,
  ORGANIZATION_MEMBERS_SEARCH_MOCK,
  CREATE_CHAT_MOCK,
  CREATE_CHAT_MEMBERSHIP_MOCK_1,
  CREATE_CHAT_MEMBERSHIP_MOCK_2,
];

describe('CreateDirectChatModal', () => {
  const { setItem } = useLocalStorage();
  const toggleCreateDirectChatModal = vi.fn();
  const chatsListRefetch = vi.fn();

  beforeEach(() => {
    setItem('userId', '1');
    vi.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      createDirectChatModalisOpen: true,
      toggleCreateDirectChatModal,
      chatsListRefetch,
      chats: [],
      ...props,
    };
    return render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <Provider store={store}>
            <CreateDirectChatModal {...defaultProps} />
          </Provider>
        </I18nextProvider>
      </MockedProvider>,
    );
  };

  test('should render users and allow creating a new direct chat', async () => {
    renderComponent();

    // Wait for users to load and verify the list
    const userRows = await screen.findAllByTestId('user');
    expect(userRows.length).toBe(2);
    expect(userRows[0]).toHaveTextContent('Test User 2');
    expect(userRows[1]).toHaveTextContent('Test User 3');
    expect(screen.queryByText('Current User')).not.toBeInTheDocument();

    // Click the add button for a user
    const addButtons = await screen.findAllByTestId('addBtn');
    fireEvent.click(addButtons[0]); // Click add for Test User 2

    // Assert that mutations and functions were called
    await waitFor(() => {
      expect(chatsListRefetch).toHaveBeenCalled();
    });
    expect(toggleCreateDirectChatModal).toHaveBeenCalled();
  });

  test('should allow searching for a user', async () => {
    renderComponent();

    // Wait for initial list
    await screen.findAllByTestId('user');

    // Search for a user
    const searchInput = screen.getByTestId('searchUser');
    const searchButton = screen.getByTestId('submitBtn');
    fireEvent.change(searchInput, { target: { value: 'Test User 2' } });
    fireEvent.click(searchButton);

    // Assert that the list is filtered
    await waitFor(async () => {
      const userRows = await screen.findAllByTestId('user');
      expect(userRows.length).toBe(1);
      expect(userRows[0]).toHaveTextContent('Test User 2');
    });
    expect(screen.queryByText('Test User 3')).not.toBeInTheDocument();
  });

  test('should prevent creating a duplicate chat', async () => {
    const existingChats = [
      {
        users: [{ _id: '1' }, { _id: 'user-2' }], // Pre-existing chat with user-2
      },
    ] as any;

    renderComponent({ chats: existingChats });

    // Wait for users to load
    const userRows = await screen.findAllByTestId('user');
    expect(userRows[0]).toHaveTextContent('Test User 2');

    // Click the add button for the user already in a chat
    const addButtons = await screen.findAllByTestId('addBtn');
    fireEvent.click(addButtons[0]);

    // Assert that the error handler was called and chat was not created
    await waitFor(() => {
      expect(errorHandlerSpy).toHaveBeenCalledWith(
        expect.any(Function), // the t function
        expect.any(Error),
      );
    });
    expect(chatsListRefetch).not.toHaveBeenCalled();
    expect(toggleCreateDirectChatModal).not.toHaveBeenCalled();
  });
});
