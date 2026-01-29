import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import useLocalStorage from 'utils/useLocalstorage';
import { vi } from 'vitest';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
import CreateDirectChatModal from './CreateDirectChat';
import { ORGANIZATION_MEMBERS } from 'GraphQl/Queries/OrganizationQueries';
import {
  CREATE_CHAT,
  CREATE_CHAT_MEMBERSHIP,
} from 'GraphQl/Mutations/OrganizationMutations';
import { errorHandler } from 'utils/errorHandler';
import type { GroupChat } from 'types/UserPortal/Chat/type';
import userEvent from '@testing-library/user-event';

// Mock dependencies
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => ({ orgId: 'test-org-id' }),
  };
});

vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));

// Mocks
const mockUsers = [
  {
    __typename: 'OrganizationMemberEdge',
    cursor: 'cursor-1',
    node: {
      __typename: 'User',
      id: '1',
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
      role: '',
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
  afterEach(() => {
    vi.restoreAllMocks();
  });
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
      <MockedProvider mocks={mocks}>
        <I18nextProvider i18n={i18nForTest}>
          <Provider store={store}>
            <CreateDirectChatModal {...defaultProps} />
          </Provider>
        </I18nextProvider>
      </MockedProvider>,
    );
  };

  test('should render users and allow creating a new direct chat', async () => {
    const user = userEvent.setup();
    renderComponent();

    const userRows = await screen.findAllByTestId('user');
    expect(userRows.length).toBe(2);
    expect(userRows[0]).toHaveTextContent('Test User 2');
    expect(userRows[1]).toHaveTextContent('Test User 3');
    expect(screen.queryByText('Current User')).not.toBeInTheDocument();

    const addButtons = await screen.findAllByTestId('addBtn');
    await user.click(addButtons[0]);

    await waitFor(() => {
      expect(chatsListRefetch).toHaveBeenCalled();
    });
    expect(toggleCreateDirectChatModal).toHaveBeenCalled();
  });

  test('should allow searching for a user', async () => {
    const user = userEvent.setup();
    renderComponent();

    await screen.findAllByTestId('user');

    const searchInput = screen.getByTestId('searchUser');
    const searchButton = screen.getByTestId('submitBtn');
    await user.clear(searchInput);
    await user.type(searchInput, 'Test User 2');
    await user.click(searchButton);

    await waitFor(() => {
      const userRows = screen.getAllByTestId('user');
      expect(userRows.length).toBe(1);
      expect(userRows[0]).toHaveTextContent('Test User 2');
    });
    expect(screen.queryByText('Test User 3')).not.toBeInTheDocument();
  });

  test('should clear the search input when clear button is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    await screen.findAllByTestId('user');

    const searchInput = screen.getByTestId('searchUser');
    const searchButton = screen.getByTestId('submitBtn');

    await user.type(searchInput, 'Test User 2');
    await user.click(searchButton);

    await waitFor(() => {
      const userRows = screen.getAllByTestId('user');
      expect(userRows.length).toBe(1);
      expect(userRows[0]).toHaveTextContent('Test User 2');
    });

    const clearButton = screen.getByLabelText(/clear/i);
    await user.click(clearButton);

    expect(searchInput).toHaveValue('');
    expect(screen.queryByLabelText(/clear/i)).not.toBeInTheDocument();
  });

  test('shows member fallback when role is missing', async () => {
    renderComponent();

    const userRows = await screen.findAllByTestId('user');
    const lastRow = userRows[userRows.length - 1];

    expect(lastRow).toHaveTextContent('Test User 3');
    expect(lastRow).toHaveTextContent('Member');
  });

  test('should prevent creating a duplicate chat', async () => {
    const user = userEvent.setup();
    const existingChats: GroupChat[] = [
      {
        _id: 'existing-chat-1',
        isGroup: false,
        name: 'Current User & Test User 2',
        image: undefined,
        messages: [],
        admins: [],
        users: [
          {
            _id: '1',
            createdAt: dayjs.utc().toDate(),
            email: 'user1@example.com',
            firstName: 'Current',
            lastName: 'User',
          },
          {
            _id: 'user-2',
            createdAt: dayjs.utc().toDate(),
            email: 'user2@example.com',
            firstName: 'Test',
            lastName: 'User2',
          },
        ],
        unseenMessagesByUsers: '',
        description: 'A direct chat conversation',
        createdAt: dayjs.utc().toDate(),
      },
    ];

    renderComponent({ chats: existingChats });

    const userRows = await screen.findAllByTestId('user');
    expect(userRows[0]).toHaveTextContent('Test User 2');

    const addButtons = await screen.findAllByTestId('addBtn');
    await user.click(addButtons[0]);

    await waitFor(() => {
      expect(errorHandler).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Error),
      );
    });
    expect(chatsListRefetch).not.toHaveBeenCalled();
    expect(toggleCreateDirectChatModal).not.toHaveBeenCalled();
  });
});
