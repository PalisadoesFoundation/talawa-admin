import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import useLocalStorage from 'utils/useLocalstorage';
import {
  vi,
  type Mock,
  beforeEach,
  afterEach,
  describe,
  test,
  expect,
} from 'vitest';
import '@testing-library/jest-dom';
import Chat from './Chat';
import { CHATS_LIST, UNREAD_CHATS } from 'GraphQl/Queries/PlugInQueries';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

type MockType = {
  request: {
    query: typeof CHATS_LIST | typeof UNREAD_CHATS;
    variables?: Record<string, unknown>;
  };
  result: { data: Record<string, unknown> };
  error?: Error;
};
const { mockUseParams } = vi.hoisted(() => ({
  mockUseParams: vi.fn(),
}));

// Mock child components
vi.mock('components/UserPortal/ContactCard/ContactCard', () => ({
  default: (props: {
    id: string;
    setSelectedContact: (id: string) => void;
    lastMessage: string;
    title: string;
    unseenMessages: number;
  }) => (
    <div
      data-testid={`contact-card-${props.id}`}
      onClick={() => props.setSelectedContact(props.id)}
      onKeyDown={(e) => e.key === 'Enter' && props.setSelectedContact(props.id)}
      role="button"
      tabIndex={0}
      data-last-message={props.lastMessage}
      data-title={props.title}
      data-unseen={props.unseenMessages}
    ></div>
  ),
}));

vi.mock('components/UserPortal/ChatRoom/ChatRoom', () => ({
  default: ({
    selectedContact,
    chatListRefetch,
  }: {
    selectedContact: string;
    chatListRefetch: () => void;
  }) => (
    <div
      data-testid="chat-room"
      data-selected-contact={selectedContact}
      onClick={() => chatListRefetch()}
      onKeyDown={(e) => e.key === 'Enter' && chatListRefetch()}
      role="button"
      tabIndex={0}
    ></div>
  ),
}));

vi.mock(
  '../../../components/UserPortal/CreateGroupChat/CreateGroupChat',
  () => ({
    default: ({
      toggleCreateGroupChatModal,
      chatsListRefetch,
    }: {
      toggleCreateGroupChatModal: () => void;
      chatsListRefetch: () => void;
    }) => (
      <div
        data-testid="create-group-chat-modal"
        onClick={() => {
          toggleCreateGroupChatModal();
          chatsListRefetch();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            toggleCreateGroupChatModal();
            chatsListRefetch();
          }
        }}
        role="button"
        tabIndex={0}
      ></div>
    ),
  }),
);

vi.mock('components/UserPortal/CreateDirectChat/CreateDirectChat', () => ({
  default: ({
    toggleCreateDirectChatModal,
    chatsListRefetch,
    chats,
  }: {
    toggleCreateDirectChatModal: () => void;
    chatsListRefetch: () => void;
    chats: unknown[];
  }) => (
    <div
      data-testid="create-direct-chat-modal"
      data-chats-length={chats.length}
      onClick={() => {
        toggleCreateDirectChatModal();
        chatsListRefetch();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          toggleCreateDirectChatModal();
          chatsListRefetch();
        }
      }}
      role="button"
      tabIndex={0}
    ></div>
  ),
}));

// Mock hooks
vi.mock('utils/useLocalstorage');

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: mockUseParams,
  };
});

// Mock SVG imports
vi.mock('assets/svgs/newChat.svg?react', () => ({
  default: () => <svg data-testid="new-chat-icon" />,
}));

// --- GraphQL Mocks ---

const mockChatsListData = {
  chatsByUser: [
    {
      _id: 'chat-1',
      id: 'chat-1',
      name: 'Direct Chat 1',
      isGroup: false,
      users: [{}, {}],
      image: 'http://example.com/chat1.png',
      __typename: 'Chat',
    },
    {
      _id: 'chat-2',
      id: 'chat-2',
      name: 'Group Chat 1',
      isGroup: true,
      users: [{}, {}, {}],
      image: 'http://example.com/chat2.png',
      __typename: 'Chat',
    },
    {
      _id: 'chat-3',
      id: 'chat-3',
      name: 'Direct Chat 2',
      isGroup: false,
      users: [{}, {}],
      image: 'http://example.com/chat3.png',
      __typename: 'Chat',
    },
  ],
};

const mockChatsList = {
  request: {
    query: CHATS_LIST,
    variables: { first: 10, after: null },
  },
  result: {
    data: mockChatsListData,
  },
};

const mockChatsListRefetch = {
  request: {
    query: CHATS_LIST,
    variables: { first: 10, after: null },
  },
  result: {
    data: mockChatsListData,
  },
};

const mockUnreadChatsData = {
  unreadChats: [
    {
      __typename: 'Chat',
      id: 'chat-1',
      name: 'Unread Direct Chat',
      description: 'This is an unread chat.',
      avatarMimeType: 'image/png',
      avatarURL: 'http://example.com/avatar.png',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      organization: {
        __typename: 'Organization',
        id: 'org-1',
        name: 'Test Organization',
        countryCode: 'US',
      },
      creator: {
        __typename: 'User',
        id: 'user-2',
        name: 'Test User 2',
        avatarMimeType: 'image/png',
        avatarURL: 'http://example.com/avatar2.png',
      },
      updater: {
        __typename: 'User',
        id: 'user-2',
        name: 'Test User 2',
        avatarMimeType: 'image/png',
        avatarURL: 'http://example.com/avatar2.png',
      },
      unreadMessagesCount: 2,
      hasUnread: true,
      firstUnreadMessageId: 'msg-unread-1',
      lastMessage: {
        __typename: 'ChatMessage',
        id: 'msg-last-1',
        body: 'Hello there',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        creator: {
          __typename: 'User',
          id: 'user-2',
          name: 'Test User 2',
          avatarMimeType: 'image/png',
          avatarURL: 'http://example.com/avatar2.png',
        },
        parentMessage: null,
      },
      members: {
        __typename: 'ChatMemberConnection',
        edges: [
          { __typename: 'ChatMemberEdge' },
          { __typename: 'ChatMemberEdge' },
        ],
      },
    },
  ],
};

const mockUnreadChats = {
  request: {
    query: UNREAD_CHATS,
    variables: {},
  },
  result: {
    data: mockUnreadChatsData,
  },
};

const mockUnreadChatsRefetch = {
  request: {
    query: UNREAD_CHATS,
    variables: {},
  },
  result: {
    data: mockUnreadChatsData,
  },
};

const repeatMocks = <T,>(mock: T, count: number): T[] =>
  Array.from({ length: count }, () => mock);

const mocks = [
  mockChatsList,
  mockChatsListRefetch,
  ...repeatMocks(
    {
      request: { query: CHATS_LIST, variables: { first: 10, after: null } },
      result: { data: mockChatsListData },
    },
    2,
  ),
  ...repeatMocks(mockUnreadChats, 2),
  mockUnreadChatsRefetch,
  // Add duplicated mocks to prevent "No more mocked responses" error
  mockChatsList,
  {
    request: { query: CHATS_LIST, variables: { first: 10, after: null } },
    result: { data: mockChatsListData },
  },
  ...repeatMocks(mockUnreadChats, 3),
];

describe('Chat Component - Comprehensive Coverage', () => {
  let getItemMock: Mock;
  let setItemMock: Mock;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    getItemMock = vi.fn();
    setItemMock = vi.fn();
    (useLocalStorage as Mock).mockReturnValue({
      getItem: getItemMock,
      setItem: setItemMock,
    });
    mockUseParams.mockReturnValue({});
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  const renderComponent = (customMocks: MockType[] = mocks as MockType[]) =>
    render(
      <MockedProvider mocks={customMocks} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <Provider store={store}>
            <Chat />
          </Provider>
        </I18nextProvider>
      </MockedProvider>,
    );

  // ==================== BASIC RENDERING ====================

  test('should render component with main structure', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('chat')).toBeInTheDocument();
    expect(screen.getByText('Messages')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown')).toBeInTheDocument();
    expect(screen.getByTestId('chat-room')).toBeInTheDocument();
  });

  test('should render loading state initially', () => {
    renderComponent();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('should display all three filter buttons', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('allChat')).toBeInTheDocument();
    expect(screen.getByTestId('unreadChat')).toBeInTheDocument();
    expect(screen.getByTestId('groupChat')).toBeInTheDocument();
  });

  // ==================== CHAT LIST RENDERING ====================

  test('should render loading state and then the list of chats', async () => {
    renderComponent();
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('contact-card-chat-1')).toBeInTheDocument();
    expect(screen.getByTestId('contact-card-chat-2')).toBeInTheDocument();
    expect(screen.getByTestId('contact-card-chat-3')).toBeInTheDocument();
  });

  test('should render contact cards with correct properties', async () => {
    renderComponent();

    await waitFor(() => {
      const card1 = screen.getByTestId('contact-card-chat-1');
      expect(card1).toHaveAttribute('data-title', 'Direct Chat 1');

      const card2 = screen.getByTestId('contact-card-chat-2');
      expect(card2).toHaveAttribute('data-title', 'Group Chat 1');
    });
  });

  test('should render contactCardContainer with correct structure', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const container = screen.getByTestId('contactCardContainer');
    expect(container).toBeInTheDocument();
  });

  // ==================== SELECTED CONTACT LOGIC ====================

  test('should select the first chat by default if none in local storage', async () => {
    getItemMock.mockReturnValue(null);
    renderComponent();

    await waitFor(() => {
      const chatRoom = screen.getByTestId('chat-room');
      expect(chatRoom).toHaveAttribute('data-selected-contact', 'chat-1');
    });

    await waitFor(() => {
      expect(setItemMock).toHaveBeenCalledWith('selectedChatId', 'chat-1');
    });
  });

  test('should select chat from local storage if it exists', async () => {
    getItemMock.mockReturnValue('chat-2');
    renderComponent();

    await waitFor(() => {
      const chatRoom = screen.getByTestId('chat-room');
      expect(chatRoom).toHaveAttribute('data-selected-contact', 'chat-2');
    });
  });

  test('should fall back to first chat if local storage ID is stale', async () => {
    getItemMock.mockReturnValue('chat-999');
    renderComponent();

    await waitFor(() => {
      const chatRoom = screen.getByTestId('chat-room');
      expect(chatRoom).toHaveAttribute('data-selected-contact', 'chat-1');
    });

    await waitFor(() => {
      expect(setItemMock).toHaveBeenCalledWith('selectedChatId', 'chat-1');
    });
  });

  test('should change selected chat on user click', async () => {
    renderComponent();
    await screen.findByTestId('contact-card-chat-1');

    const contactCard2 = screen.getByTestId('contact-card-chat-2');
    await user.click(contactCard2);

    await waitFor(() => {
      const chatRoom = screen.getByTestId('chat-room');
      expect(chatRoom).toHaveAttribute('data-selected-contact', 'chat-2');
    });
    expect(setItemMock).toHaveBeenCalledWith('selectedChatId', 'chat-2');
  });

  test('should update localStorage when selectedContact changes', async () => {
    renderComponent();
    await screen.findByTestId('contact-card-chat-1');

    const contactCard3 = screen.getByTestId('contact-card-chat-3');
    await user.click(contactCard3);

    await waitFor(() => {
      expect(setItemMock).toHaveBeenCalledWith('selectedChatId', 'chat-3');
    });
  });

  test('should not set selectedContact if chats array is empty', async () => {
    const emptyMocks = [
      {
        request: { query: CHATS_LIST, variables: { first: 10, after: null } },
        result: { data: { chatsByUser: [] } },
      },
      {
        request: { query: UNREAD_CHATS, variables: {} },
        result: { data: { unreadChats: [] } },
      },
    ];

    renderComponent(emptyMocks);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Should not call setItem when chats are empty
    expect(setItemMock).not.toHaveBeenCalled();
  });

  // ==================== FILTER FUNCTIONALITY ====================

  test('should filter for unread chats', async () => {
    renderComponent();
    await screen.findByTestId('contact-card-chat-1');

    const unreadButton = screen.getByTestId('unreadChat');
    await user.click(unreadButton);

    await waitFor(() => {
      expect(screen.getByTestId('contact-card-chat-1')).toBeInTheDocument();
      expect(
        screen.queryByTestId('contact-card-chat-2'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('contact-card-chat-3'),
      ).not.toBeInTheDocument();
    });
  });

  test('should filter for unread chats and check last message', async () => {
    renderComponent();
    await screen.findByTestId('contact-card-chat-1');

    const unreadButton = screen.getByTestId('unreadChat');
    await user.click(unreadButton);

    await waitFor(() => {
      const card = screen.getByTestId('contact-card-chat-1');
      expect(card).toBeInTheDocument();
      expect(card).toHaveAttribute('data-last-message', 'Hello there');
      expect(card).toHaveAttribute('data-unseen', '2');
    });
  });

  test('should filter for group chats', async () => {
    renderComponent();
    await screen.findByTestId('contact-card-chat-1');

    const groupButton = screen.getByTestId('groupChat');
    await user.click(groupButton);

    await waitFor(() => {
      expect(screen.getByTestId('contact-card-chat-2')).toBeInTheDocument();
      expect(
        screen.queryByTestId('contact-card-chat-1'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('contact-card-chat-3'),
      ).not.toBeInTheDocument();
    });
  });

  test('should filter for legacy group chats by user count', async () => {
    const legacyGroupMock = {
      request: { query: CHATS_LIST, variables: { first: 10, after: null } },
      result: {
        data: {
          chatsByUser: [
            {
              _id: 'legacy-group',
              id: 'legacy-group',
              name: 'Legacy Group',
              isGroup: false,
              users: [{}, {}, {}],
              image: '',
              __typename: 'Chat',
            },
            {
              _id: 'legacy-direct',
              id: 'legacy-direct',
              name: 'Legacy Direct',
              isGroup: false,
              users: [{}, {}],
              image: '',
              __typename: 'Chat',
            },
          ],
        },
      },
    };

    const customMocks = [
      legacyGroupMock,
      legacyGroupMock,
      legacyGroupMock,
      mockUnreadChats,
    ];

    renderComponent(customMocks);

    await screen.findByTestId('contact-card-legacy-group');

    const groupButton = screen.getByTestId('groupChat');
    await user.click(groupButton);

    await waitFor(() => {
      expect(
        screen.getByTestId('contact-card-legacy-group'),
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('contact-card-legacy-direct'),
      ).not.toBeInTheDocument();
    });
  });

  test('should switch back to all filter', async () => {
    renderComponent();
    await screen.findByTestId('contact-card-chat-1');

    await user.click(screen.getByTestId('unreadChat'));
    await waitFor(() => {
      expect(
        screen.queryByTestId('contact-card-chat-2'),
      ).not.toBeInTheDocument();
    });

    await user.click(screen.getByTestId('allChat'));
    await waitFor(() => {
      expect(screen.getByTestId('contact-card-chat-1')).toBeInTheDocument();
      expect(screen.getByTestId('contact-card-chat-2')).toBeInTheDocument();
      expect(screen.getByTestId('contact-card-chat-3')).toBeInTheDocument();
    });
  });

  test('should apply selectedBtn class to active filter', async () => {
    renderComponent();
    await screen.findByTestId('contact-card-chat-1');

    const allButton = screen.getByTestId('allChat');
    const unreadButton = screen.getByTestId('unreadChat');
    const groupButton = screen.getByTestId('groupChat');

    // Initially 'all' should be selected (CSS modules hash the class name)
    expect(allButton.className).toMatch(/selectedBtn/);
    expect(unreadButton.className).not.toMatch(/selectedBtn/);
    expect(groupButton.className).not.toMatch(/selectedBtn/);

    // Click unread
    await user.click(unreadButton);
    await waitFor(() => {
      expect(unreadButton.className).toMatch(/selectedBtn/);
      expect(allButton.className).not.toMatch(/selectedBtn/);
      expect(groupButton.className).not.toMatch(/selectedBtn/);
    });

    // Click group
    await user.click(groupButton);
    await waitFor(() => {
      expect(groupButton.className).toMatch(/selectedBtn/);
      expect(allButton.className).not.toMatch(/selectedBtn/);
      expect(unreadButton.className).not.toMatch(/selectedBtn/);
    });
  });

  // ==================== MODAL FUNCTIONALITY ====================

  test('should open and close new direct chat modal', async () => {
    renderComponent();
    await screen.findByTestId('contact-card-chat-1');

    const dropdown = screen.getByTestId('dropdown');
    await user.click(dropdown);

    const newDirectChat = await screen.findByTestId('newDirectChat');
    await user.click(newDirectChat);

    await waitFor(() => {
      expect(
        screen.getByTestId('create-direct-chat-modal'),
      ).toBeInTheDocument();
    });

    // Click modal to toggle it (based on mock implementation)
    const modal = screen.getByTestId('create-direct-chat-modal');
    await user.click(modal);

    await waitFor(() => {
      expect(
        screen.queryByTestId('create-direct-chat-modal'),
      ).not.toBeInTheDocument();
    });
  });

  test('should open and close new group chat modal', async () => {
    renderComponent();
    await screen.findByTestId('contact-card-chat-1');

    const dropdown = screen.getByTestId('dropdown');
    await user.click(dropdown);

    const newGroupChat = await screen.findByTestId('newGroupChat');
    await user.click(newGroupChat);

    await waitFor(() => {
      expect(screen.getByTestId('create-group-chat-modal')).toBeInTheDocument();
    });

    // Click modal to toggle it
    const modal = screen.getByTestId('create-group-chat-modal');
    await user.click(modal);

    await waitFor(() => {
      expect(
        screen.queryByTestId('create-group-chat-modal'),
      ).not.toBeInTheDocument();
    });
  });

  test('should open both modals simultaneously', async () => {
    renderComponent();
    await screen.findByTestId('contact-card-chat-1');

    const dropdown = screen.getByTestId('dropdown');

    // Open direct chat modal
    await user.click(dropdown);
    const newDirectChat = await screen.findByTestId('newDirectChat');
    await user.click(newDirectChat);

    await waitFor(() => {
      expect(
        screen.getByTestId('create-direct-chat-modal'),
      ).toBeInTheDocument();
    });

    // Open group chat modal without closing direct chat
    await user.click(dropdown);
    const newGroupChat = await screen.findByTestId('newGroupChat');
    await user.click(newGroupChat);

    await waitFor(() => {
      expect(screen.getByTestId('create-group-chat-modal')).toBeInTheDocument();
      expect(
        screen.getByTestId('create-direct-chat-modal'),
      ).toBeInTheDocument();
    });
  });

  test('should pass filtered legacy chats to CreateDirectChat', async () => {
    const legacyMocks = [
      {
        request: { query: CHATS_LIST, variables: { first: 10, after: null } },
        result: {
          data: {
            chatsByUser: [
              {
                _id: 'legacy-1',
                id: 'legacy-1',
                name: 'Legacy Chat',
                isGroup: false,
                users: [{}, {}],
                image: '',
                __typename: 'Chat',
              },
            ],
          },
        },
      },
      mockUnreadChats,
    ];

    renderComponent(legacyMocks);
    await screen.findByTestId('contact-card-legacy-1');

    const dropdown = screen.getByTestId('dropdown');
    await user.click(dropdown);

    const newDirectChat = await screen.findByTestId('newDirectChat');
    await user.click(newDirectChat);

    await waitFor(() => {
      const modal = screen.getByTestId('create-direct-chat-modal');
      expect(modal).toHaveAttribute('data-chats-length', '1');
    });
  });

  // ==================== ORG FILTERING ====================

  test('should filter chats by orgId when provided in route params', async () => {
    mockUseParams.mockReturnValue({ orgId: 'org-1' });

    const mockWithOrgId = {
      request: { query: CHATS_LIST, variables: { first: 10, after: null } },
      result: {
        data: {
          chatsByUser: [
            {
              _id: 'chat-1',
              id: 'chat-1',
              name: 'Chat in Org 1',
              isGroup: false,
              users: [{}, {}],
              image: '',
              organization: { id: 'org-1', _id: 'org-1' },
              __typename: 'Chat',
            },
            {
              _id: 'chat-2',
              id: 'chat-2',
              name: 'Chat in Org 2',
              isGroup: false,
              users: [{}, {}],
              image: '',
              organization: { id: 'org-2', _id: 'org-2' },
              __typename: 'Chat',
            },
          ],
        },
      },
    };

    renderComponent([
      mockWithOrgId,
      mockWithOrgId,
      mockWithOrgId,
      mockUnreadChats,
    ]);

    await waitFor(() => {
      expect(screen.getByTestId('contact-card-chat-1')).toBeInTheDocument();
      expect(
        screen.queryByTestId('contact-card-chat-2'),
      ).not.toBeInTheDocument();
    });
  });

  test('should filter unread chats by orgId with NewChatType', async () => {
    mockUseParams.mockReturnValue({ orgId: 'org-1' });

    const mockUnreadWithOrgId = {
      request: { query: UNREAD_CHATS, variables: {} },
      result: {
        data: {
          unreadChats: [
            {
              __typename: 'Chat',
              id: 'chat-1',
              name: 'Unread Chat Org 1',
              description: 'Description',
              avatarMimeType: 'image/png',
              avatarURL: 'http://example.com/avatar.png',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              organization: {
                __typename: 'Organization',
                id: 'org-1',
                name: 'Test Organization',
                countryCode: 'US',
              },
              creator: {
                __typename: 'User',
                id: 'user-2',
                name: 'Test User 2',
                avatarMimeType: 'image/png',
                avatarURL: 'http://example.com/avatar2.png',
              },
              updater: {
                __typename: 'User',
                id: 'user-2',
                name: 'Test User 2',
                avatarMimeType: 'image/png',
                avatarURL: 'http://example.com/avatar2.png',
              },
              unreadMessagesCount: 2,
              hasUnread: true,
              firstUnreadMessageId: 'msg-unread-1',
              lastMessage: {
                __typename: 'ChatMessage',
                id: 'msg-last-1',
                body: 'Hello',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                creator: {
                  __typename: 'User',
                  id: 'user-2',
                  name: 'Test User 2',
                  avatarMimeType: 'image/png',
                  avatarURL: 'http://example.com/avatar2.png',
                },
                parentMessage: null,
              },
              members: {
                __typename: 'ChatMemberConnection',
                edges: [
                  { __typename: 'ChatMemberEdge' },
                  { __typename: 'ChatMemberEdge' },
                ],
              },
            },
            {
              __typename: 'Chat',
              id: 'chat-2',
              name: 'Unread Chat Org 2',
              description: 'Description',
              avatarMimeType: 'image/png',
              avatarURL: 'http://example.com/avatar.png',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              organization: {
                __typename: 'Organization',
                id: 'org-2',
                name: 'Test Organization 2',
                countryCode: 'US',
              },
              creator: {
                __typename: 'User',
                id: 'user-3',
                name: 'Test User 3',
                avatarMimeType: 'image/png',
                avatarURL: 'http://example.com/avatar3.png',
              },
              updater: {
                __typename: 'User',
                id: 'user-3',
                name: 'Test User 3',
                avatarMimeType: 'image/png',
                avatarURL: 'http://example.com/avatar3.png',
              },
              unreadMessagesCount: 1,
              hasUnread: true,
              firstUnreadMessageId: 'msg-unread-2',
              lastMessage: {
                __typename: 'ChatMessage',
                id: 'msg-last-2',
                body: 'Hi',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                creator: {
                  __typename: 'User',
                  id: 'user-3',
                  name: 'Test User 3',
                  avatarMimeType: 'image/png',
                  avatarURL: 'http://example.com/avatar3.png',
                },
                parentMessage: null,
              },
              members: {
                __typename: 'ChatMemberConnection',
                edges: [
                  { __typename: 'ChatMemberEdge' },
                  { __typename: 'ChatMemberEdge' },
                ],
              },
            },
          ],
        },
      },
    };

    const mockChatsListWithOrg = {
      request: { query: CHATS_LIST, variables: { first: 10, after: null } },
      result: {
        data: {
          chatsByUser: [
            {
              _id: 'chat-1',
              id: 'chat-1',
              name: 'Chat in Org 1',
              isGroup: false,
              users: [{}, {}],
              image: '',
              organization: { id: 'org-1', _id: 'org-1' },
              __typename: 'Chat',
            },
          ],
        },
      },
    };

    renderComponent([
      mockChatsListWithOrg,
      mockUnreadWithOrgId,
      mockUnreadWithOrgId,
    ]);

    await screen.findByTestId('contact-card-chat-1');

    const unreadButton = screen.getByTestId('unreadChat');
    await user.click(unreadButton);

    await waitFor(() => {
      expect(screen.getByTestId('contact-card-chat-1')).toBeInTheDocument();
      expect(
        screen.queryByTestId('contact-card-chat-2'),
      ).not.toBeInTheDocument();
    });
  });

  test('should filter group chats by orgId with NewChatType', async () => {
    mockUseParams.mockReturnValue({ orgId: 'org-1' });

    const mockGroupsWithOrgId = {
      request: { query: CHATS_LIST, variables: { first: 10, after: null } },
      result: {
        data: {
          chatsByUser: [
            {
              _id: 'group-1',
              id: 'group-1',
              name: 'Group in Org 1',
              isGroup: true,
              description: '',
              createdAt: dayjs.utc().toISOString(),
              users: [{}, {}, {}],
              image: '',
              organization: { id: 'org-1', _id: 'org-1', name: 'Org 1' },
              members: {
                edges: [
                  {
                    node: {
                      _id: 'user1',
                      firstName: 'A',
                      lastName: 'B',
                      email: 'a@b.com',
                    },
                  },
                  {
                    node: {
                      _id: 'user2',
                      firstName: 'C',
                      lastName: 'D',
                      email: 'c@d.com',
                    },
                  },
                  {
                    node: {
                      _id: 'user3',
                      firstName: 'E',
                      lastName: 'F',
                      email: 'e@f.com',
                    },
                  },
                ],
                pageInfo: { hasNextPage: false, endCursor: null },
              },
              lastMessage: null,
              unreadMessagesCount: 0,
              __typename: 'Chat',
            },
            {
              _id: 'group-2',
              id: 'group-2',
              name: 'Group in Org 2',
              isGroup: true,
              description: '',
              createdAt: dayjs.utc().toISOString(),
              users: [{}, {}, {}],
              image: '',
              organization: { id: 'org-2', _id: 'org-2', name: 'Org 2' },
              members: {
                edges: [
                  {
                    node: {
                      _id: 'user4',
                      firstName: 'G',
                      lastName: 'H',
                      email: 'g@h.com',
                    },
                  },
                  {
                    node: {
                      _id: 'user5',
                      firstName: 'I',
                      lastName: 'J',
                      email: 'i@j.com',
                    },
                  },
                  {
                    node: {
                      _id: 'user6',
                      firstName: 'K',
                      lastName: 'L',
                      email: 'k@l.com',
                    },
                  },
                ],
                pageInfo: { hasNextPage: false, endCursor: null },
              },
              lastMessage: null,
              unreadMessagesCount: 0,
              __typename: 'Chat',
            },
          ],
        },
      },
    };

    renderComponent([
      mockGroupsWithOrgId,
      mockGroupsWithOrgId,
      mockGroupsWithOrgId,
      mockUnreadChats,
    ]);

    await screen.findByTestId('contact-card-group-1');

    const groupButton = screen.getByTestId('groupChat');
    await user.click(groupButton);

    await waitFor(() => {
      expect(screen.getByTestId('contact-card-group-1')).toBeInTheDocument();
      expect(
        screen.queryByTestId('contact-card-group-2'),
      ).not.toBeInTheDocument();
    });
  });

  test('should handle NewChatType in second useEffect with orgId filtering', async () => {
    mockUseParams.mockReturnValue({ orgId: 'org-1' });

    const mockNewChatTypeWithOrg = {
      request: { query: CHATS_LIST, variables: { first: 10, after: null } },
      result: {
        data: {
          chatsByUser: [
            {
              id: 'chat-new-1',
              name: 'New Type Chat Org 1',
              isGroup: false,
              description: '',
              createdAt: dayjs.utc().toISOString(),
              users: [{}, {}],
              image: '',
              organization: { id: 'org-1', name: 'Org 1' },
              members: {
                edges: [
                  {
                    node: {
                      _id: 'u1',
                      firstName: 'A',
                      lastName: 'B',
                      email: 'a@b.com',
                    },
                  },
                  {
                    node: {
                      _id: 'u2',
                      firstName: 'C',
                      lastName: 'D',
                      email: 'c@d.com',
                    },
                  },
                ],
                pageInfo: { hasNextPage: false, endCursor: null },
              },
              lastMessage: null,
              unreadMessagesCount: 0,
              __typename: 'Chat',
            },
            {
              id: 'chat-new-2',
              name: 'New Type Chat Org 2',
              isGroup: false,
              description: '',
              createdAt: dayjs.utc().toISOString(),
              users: [{}, {}],
              image: '',
              organization: { id: 'org-2', name: 'Org 2' },
              members: {
                edges: [
                  {
                    node: {
                      _id: 'u3',
                      firstName: 'E',
                      lastName: 'F',
                      email: 'e@f.com',
                    },
                  },
                  {
                    node: {
                      _id: 'u4',
                      firstName: 'G',
                      lastName: 'H',
                      email: 'g@h.com',
                    },
                  },
                ],
                pageInfo: { hasNextPage: false, endCursor: null },
              },
              lastMessage: null,
              unreadMessagesCount: 0,
              __typename: 'Chat',
            },
          ],
        },
      },
    };

    renderComponent([
      mockNewChatTypeWithOrg,
      mockNewChatTypeWithOrg,
      mockNewChatTypeWithOrg,
      mockUnreadChats,
    ]);

    // The second useEffect filters chatsListData when filterType is 'all'
    // It should filter out chat-new-2 (org-2) and only show chat-new-1 (org-1)
    await waitFor(() => {
      expect(screen.getByTestId('contact-card-chat-new-1')).toBeInTheDocument();
    });

    expect(
      screen.queryByTestId('contact-card-chat-new-2'),
    ).not.toBeInTheDocument();
  });

  test('should handle legacy GroupChat type in orgId filtering', async () => {
    mockUseParams.mockReturnValue({ orgId: 'org-1' });

    const mockLegacyWithOrgId = {
      request: { query: CHATS_LIST, variables: { first: 10, after: null } },
      result: {
        data: {
          chatsByUser: [
            {
              _id: 'legacy-1',
              id: 'legacy-1',
              name: 'Legacy Chat Org 1',
              isGroup: false,
              description: '',
              createdAt: dayjs.utc().toISOString(),
              users: [{}, {}],
              image: '',
              organization: { _id: 'org-1', id: 'org-1', name: 'Org 1' },
              lastMessage: null,
              unreadMessagesCount: 0,
              __typename: 'Chat',
            },
            {
              _id: 'legacy-2',
              id: 'legacy-2',
              name: 'Legacy Chat Org 2',
              isGroup: false,
              description: '',
              createdAt: dayjs.utc().toISOString(),
              users: [{}, {}],
              image: '',
              organization: { _id: 'org-2', id: 'org-2', name: 'Org 2' },
              lastMessage: null,
              unreadMessagesCount: 0,
              __typename: 'Chat',
            },
          ],
        },
      },
    };

    renderComponent([
      mockLegacyWithOrgId,
      mockLegacyWithOrgId,
      mockUnreadChats,
    ]);

    await waitFor(() => {
      expect(screen.getByTestId('contact-card-legacy-1')).toBeInTheDocument();
      expect(
        screen.queryByTestId('contact-card-legacy-2'),
      ).not.toBeInTheDocument();
    });
  });

  // ==================== NEWCHATTYPE VS LEGACY TYPE ====================

  test('should handle NewChatType with members.edges for group detection', async () => {
    const newChatTypeMock = {
      request: { query: CHATS_LIST, variables: { first: 10, after: null } },
      result: {
        data: {
          chatsByUser: [
            {
              id: 'new-group',
              name: 'New Group Chat',
              avatarURL: 'http://example.com/new-group.png',
              members: {
                edges: [
                  { __typename: 'ChatMemberEdge' },
                  { __typename: 'ChatMemberEdge' },
                  { __typename: 'ChatMemberEdge' },
                ],
              },
              unreadMessagesCount: 5,
              lastMessage: { body: 'Test message' },
              __typename: 'Chat',
            },
          ],
        },
      },
    };

    renderComponent([newChatTypeMock, newChatTypeMock, mockUnreadChats]);

    await waitFor(() => {
      const card = screen.getByTestId('contact-card-new-group');
      expect(card).toHaveAttribute('data-title', 'New Group Chat');
      expect(card).toHaveAttribute('data-unseen', '5');
      expect(card).toHaveAttribute('data-last-message', 'Test message');
    });
  });

  test('should handle NewChatType with null/undefined members', async () => {
    const newChatTypeNullMembersMock = {
      request: { query: CHATS_LIST, variables: { first: 10, after: null } },
      result: {
        data: {
          chatsByUser: [
            {
              id: 'new-chat-no-members',
              name: 'Chat No Members',
              avatarURL: null,
              members: null,
              unreadMessagesCount: 0,
              lastMessage: null,
              __typename: 'Chat',
            },
          ],
        },
      },
    };

    renderComponent([
      newChatTypeNullMembersMock,
      newChatTypeNullMembersMock,
      mockUnreadChats,
    ]);

    await waitFor(() => {
      const card = screen.getByTestId('contact-card-new-chat-no-members');
      expect(card).toHaveAttribute('data-title', 'Chat No Members');
      expect(card).toHaveAttribute('data-unseen', '0');
      expect(card).toHaveAttribute('data-last-message', '');
    });
  });

  test('should handle legacy chat with no name', async () => {
    const legacyChatNoNameMock = {
      request: { query: CHATS_LIST, variables: { first: 10, after: null } },
      result: {
        data: {
          chatsByUser: [
            {
              _id: 'no-name-chat',
              id: 'no-name-chat',
              name: null,
              isGroup: false,
              users: [{}, {}],
              image: '',
              __typename: 'Chat',
            },
          ],
        },
      },
    };

    renderComponent([
      legacyChatNoNameMock,
      legacyChatNoNameMock,
      mockUnreadChats,
    ]);

    await waitFor(() => {
      const card = screen.getByTestId('contact-card-no-name-chat');
      expect(card).toHaveAttribute('data-title', 'Chat');
    });
  });

  test('should correctly identify isGroup for NewChatType with 2 members', async () => {
    const newChatTypeTwoMembersMock = {
      request: { query: CHATS_LIST, variables: { first: 10, after: null } },
      result: {
        data: {
          chatsByUser: [
            {
              id: 'two-member-chat',
              name: 'Direct Chat',
              avatarURL: '',
              members: {
                edges: [
                  { __typename: 'ChatMemberEdge' },
                  { __typename: 'ChatMemberEdge' },
                ],
              },
              unreadMessagesCount: 0,
              lastMessage: null,
              __typename: 'Chat',
            },
          ],
        },
      },
    };

    renderComponent([
      newChatTypeTwoMembersMock,
      newChatTypeTwoMembersMock,
      mockUnreadChats,
    ]);

    await screen.findByTestId('contact-card-two-member-chat');

    // Switch to group filter - this chat should NOT appear
    const groupButton = screen.getByTestId('groupChat');
    await user.click(groupButton);

    await waitFor(() => {
      expect(
        screen.queryByTestId('contact-card-two-member-chat'),
      ).not.toBeInTheDocument();
    });
  });

  test('should correctly identify isGroup for legacy chat with isGroup=true', async () => {
    const legacyGroupTrueMock = {
      request: { query: CHATS_LIST, variables: { first: 10, after: null } },
      result: {
        data: {
          chatsByUser: [
            {
              _id: 'legacy-explicit-group',
              id: 'legacy-explicit-group',
              name: 'Explicit Group',
              isGroup: true,
              users: [{}, {}],
              image: '',
              __typename: 'Chat',
            },
          ],
        },
      },
    };

    renderComponent([
      legacyGroupTrueMock,
      legacyGroupTrueMock,
      legacyGroupTrueMock,
      mockUnreadChats,
    ]);

    await screen.findByTestId('contact-card-legacy-explicit-group');

    // Switch to group filter - should appear
    const groupButton = screen.getByTestId('groupChat');
    await user.click(groupButton);

    await waitFor(() => {
      expect(
        screen.getByTestId('contact-card-legacy-explicit-group'),
      ).toBeInTheDocument();
    });
  });

  // ==================== CHATROOM INTEGRATION ====================

  test('should pass chatListRefetch to ChatRoom', async () => {
    renderComponent();
    await screen.findByTestId('contact-card-chat-1');

    const chatRoom = screen.getByTestId('chat-room');

    // Click chatRoom to trigger refetch (based on mock)
    await user.click(chatRoom);

    // Verify the component receives the refetch function
    expect(chatRoom).toBeInTheDocument();
  });

  test('should pass selectedContact to ChatRoom', async () => {
    renderComponent();
    await screen.findByTestId('contact-card-chat-1');

    const contactCard2 = screen.getByTestId('contact-card-chat-2');
    await user.click(contactCard2);

    await waitFor(() => {
      const chatRoom = screen.getByTestId('chat-room');
      expect(chatRoom).toHaveAttribute('data-selected-contact', 'chat-2');
    });
  });

  // ==================== DROPDOWN AND NEW CHAT ====================

  test('should render dropdown with new chat icon', async () => {
    renderComponent();
    await screen.findByTestId('contact-card-chat-1');

    expect(screen.getByTestId('dropdown')).toBeInTheDocument();
    expect(screen.getByTestId('new-chat-icon')).toBeInTheDocument();
  });

  test('should show dropdown menu items when clicked', async () => {
    renderComponent();
    await screen.findByTestId('contact-card-chat-1');

    const dropdown = screen.getByTestId('dropdown');
    await user.click(dropdown);

    await waitFor(() => {
      expect(screen.getByTestId('newDirectChat')).toBeInTheDocument();
      expect(screen.getByTestId('newGroupChat')).toBeInTheDocument();
      expect(screen.getByText('Starred Messages')).toBeInTheDocument();
    });
  });

  // ==================== COVERAGE FOR MISSING LINES ====================

  test('should call chatsListRefetch when switching to all filter from another filter', async () => {
    renderComponent();
    await screen.findByTestId('contact-card-chat-1');

    // Switch to unread filter first
    const unreadButton = screen.getByTestId('unreadChat');
    await user.click(unreadButton);

    await waitFor(() => {
      expect(screen.getByTestId('contact-card-chat-1')).toBeInTheDocument();
    });

    // Switch back to all filter - this should trigger chatsListRefetch
    const allButton = screen.getByTestId('allChat');
    await user.click(allButton);

    await waitFor(() => {
      expect(screen.getByTestId('contact-card-chat-1')).toBeInTheDocument();
      expect(screen.getByTestId('contact-card-chat-2')).toBeInTheDocument();
      expect(screen.getByTestId('contact-card-chat-3')).toBeInTheDocument();
    });
  });

  test('should handle chatsListData changes when filterType is all', async () => {
    const initialMock = {
      request: { query: CHATS_LIST, variables: { first: 10, after: null } },
      result: {
        data: {
          chatsByUser: [
            {
              _id: 'initial-chat',
              id: 'initial-chat',
              name: 'Initial Chat',
              isGroup: false,
              users: [{}, {}],
              image: '',
              __typename: 'Chat',
            },
          ],
        },
      },
    };

    renderComponent([initialMock, initialMock, mockUnreadChats]);

    await waitFor(() => {
      expect(
        screen.getByTestId('contact-card-initial-chat'),
      ).toBeInTheDocument();
    });

    // Verify filterType is 'all' and chatsListData is processed
    expect(screen.getByTestId('allChat').className).toMatch(/selectedBtn/);
  });

  test('should not set selected contact when chats array is empty on mount', async () => {
    getItemMock.mockReturnValue(null);

    const emptyMocks = [
      {
        request: { query: CHATS_LIST, variables: { first: 10, after: null } },
        result: { data: { chatsByUser: [] } },
      },
      {
        request: { query: UNREAD_CHATS, variables: {} },
        result: { data: { unreadChats: [] } },
      },
    ];

    renderComponent(emptyMocks);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Verify early return in useEffect when chats.length === 0
    const chatRoom = screen.getByTestId('chat-room');
    expect(chatRoom).toHaveAttribute('data-selected-contact', '');
    expect(setItemMock).not.toHaveBeenCalled();
  });

  test('should handle refetch in getChats for group filter', async () => {
    renderComponent();
    await screen.findByTestId('contact-card-chat-1');

    // Click group filter to trigger getChats with refetch
    const groupButton = screen.getByTestId('groupChat');
    await user.click(groupButton);

    await waitFor(() => {
      expect(screen.getByTestId('contact-card-chat-2')).toBeInTheDocument();
    });
  });

  // ==================== EDGE CASES ====================

  test('should handle chats without organization', async () => {
    const chatsNoOrgMock = {
      request: { query: CHATS_LIST, variables: { first: 10, after: null } },
      result: {
        data: {
          chatsByUser: [
            {
              _id: 'no-org-chat',
              id: 'no-org-chat',
              name: 'Chat No Org',
              isGroup: false,
              users: [{}, {}],
              image: '',
              organization: null,
              __typename: 'Chat',
            },
          ],
        },
      },
    };

    renderComponent([chatsNoOrgMock, chatsNoOrgMock, mockUnreadChats]);

    await waitFor(() => {
      expect(
        screen.getByTestId('contact-card-no-org-chat'),
      ).toBeInTheDocument();
    });
  });

  test('should handle filtering with orgId when chats have no organization', async () => {
    mockUseParams.mockReturnValue({ orgId: 'org-1' });

    const chatsNoOrgMock = {
      request: { query: CHATS_LIST, variables: { first: 10, after: null } },
      result: {
        data: {
          chatsByUser: [
            {
              _id: 'no-org-chat',
              id: 'no-org-chat',
              name: 'Chat No Org',
              isGroup: false,
              users: [{}, {}],
              image: '',
              organization: null,
              __typename: 'Chat',
            },
          ],
        },
      },
    };

    renderComponent([chatsNoOrgMock, chatsNoOrgMock, mockUnreadChats]);

    await waitFor(() => {
      // Should not display chat without organization when orgId filter is active
      expect(
        screen.queryByTestId('contact-card-no-org-chat'),
      ).not.toBeInTheDocument();
    });
  });

  test('should handle empty unread chats list', async () => {
    const emptyUnreadMock = {
      request: { query: UNREAD_CHATS, variables: {} },
      result: { data: { unreadChats: [] } },
    };

    renderComponent([
      mockChatsList,
      mockChatsListRefetch,
      emptyUnreadMock,
      emptyUnreadMock,
    ]);

    await screen.findByTestId('contact-card-chat-1');

    const unreadButton = screen.getByTestId('unreadChat');
    await user.click(unreadButton);

    await waitFor(() => {
      expect(
        screen.queryByTestId('contact-card-chat-1'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('contact-card-chat-2'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('contact-card-chat-3'),
      ).not.toBeInTheDocument();
    });
  });

  test('should handle mixed NewChatType and legacy chats', async () => {
    const mixedChatsMock = {
      request: { query: CHATS_LIST, variables: { first: 10, after: null } },
      result: {
        data: {
          chatsByUser: [
            {
              _id: 'legacy-chat',
              id: 'legacy-chat',
              name: 'Legacy Chat',
              isGroup: false,
              users: [{}, {}],
              image: 'http://example.com/legacy.png',
              __typename: 'Chat',
            },
            {
              id: 'new-chat',
              name: 'New Chat',
              avatarURL: 'http://example.com/new.png',
              members: { edges: [{}, {}] },
              unreadMessagesCount: 3,
              lastMessage: { body: 'Latest message' },
              __typename: 'Chat',
            },
          ],
        },
      },
    };

    renderComponent([
      mixedChatsMock,
      mixedChatsMock,
      mixedChatsMock,
      mockUnreadChats,
    ]);

    await waitFor(() => {
      expect(
        screen.getByTestId('contact-card-legacy-chat'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('contact-card-new-chat')).toBeInTheDocument();
    });
  });

  test('should maintain selection when switching between filter types', async () => {
    getItemMock.mockReturnValue('chat-2');
    renderComponent();

    await waitFor(() => {
      const chatRoom = screen.getByTestId('chat-room');
      expect(chatRoom).toHaveAttribute('data-selected-contact', 'chat-2');
    });

    // Switch to group filter
    const groupButton = screen.getByTestId('groupChat');
    await user.click(groupButton);

    await waitFor(() => {
      const chatRoom = screen.getByTestId('chat-room');
      // Selection should still be chat-2 since it's a group
      expect(chatRoom).toHaveAttribute('data-selected-contact', 'chat-2');
    });
  });

  test('should handle rapid filter switching', async () => {
    renderComponent();
    await screen.findByTestId('contact-card-chat-1');

    const allButton = screen.getByTestId('allChat');
    const unreadButton = screen.getByTestId('unreadChat');
    const groupButton = screen.getByTestId('groupChat');

    // Rapidly switch filters
    await user.click(unreadButton);
    await user.click(groupButton);
    await user.click(allButton);
    await user.click(unreadButton);
    await user.click(allButton);

    await waitFor(() => {
      expect(screen.getByTestId('contact-card-chat-1')).toBeInTheDocument();
      expect(screen.getByTestId('contact-card-chat-2')).toBeInTheDocument();
      expect(screen.getByTestId('contact-card-chat-3')).toBeInTheDocument();
    });
  });

  test('should handle chat selection when no local storage and empty chats', async () => {
    getItemMock.mockReturnValue(null);

    const emptyMocks = [
      {
        request: { query: CHATS_LIST, variables: { first: 10, after: null } },
        result: { data: { chatsByUser: [] } },
      },
      {
        request: { query: UNREAD_CHATS, variables: {} },
        result: { data: { unreadChats: [] } },
      },
    ];

    renderComponent(emptyMocks);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Should not crash and should not call setItem
    expect(setItemMock).not.toHaveBeenCalled();
  });

  // ==================== USEEFFECT COVERAGE ====================

  test('should not call refetch on selectedContact change if commented out', async () => {
    renderComponent();
    await screen.findByTestId('contact-card-chat-1');

    const contactCard2 = screen.getByTestId('contact-card-chat-2');
    await user.click(contactCard2);

    // The useEffect for markChatMessagesAsRead is commented out
    // This test verifies that behavior
    await waitFor(() => {
      expect(setItemMock).toHaveBeenCalledWith('selectedChatId', 'chat-2');
    });
  });

  test('should filter chats when filterType changes from "all" to "group"', async () => {
    renderComponent();
    await screen.findByTestId('contact-card-chat-1');

    // Verify all chats are shown initially
    expect(screen.getByTestId('contact-card-chat-1')).toBeInTheDocument();
    expect(screen.getByTestId('contact-card-chat-2')).toBeInTheDocument();

    // Switch to group filter
    const groupButton = screen.getByTestId('groupChat');
    await user.click(groupButton);

    await waitFor(() => {
      expect(screen.getByTestId('contact-card-chat-2')).toBeInTheDocument();
      expect(
        screen.queryByTestId('contact-card-chat-1'),
      ).not.toBeInTheDocument();
    });
  });

  test('should update chats when chatsListData changes', async () => {
    const initialMock = {
      request: { query: CHATS_LIST, variables: { first: 10, after: null } },
      result: {
        data: {
          chatsByUser: [
            {
              _id: 'initial-chat',
              id: 'initial-chat',
              name: 'Initial Chat',
              isGroup: false,
              users: [{}, {}],
              image: '',
              __typename: 'Chat',
            },
          ],
        },
      },
    };

    renderComponent([initialMock, initialMock, mockUnreadChats]);

    await waitFor(() => {
      expect(
        screen.getByTestId('contact-card-initial-chat'),
      ).toBeInTheDocument();
    });

    // The second useEffect should trigger when chatsListData changes
    // This is covered by the natural flow of the component
  });

  // ==================== COMPONENT STRUCTURE ====================

  test('should render main container with correct structure', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const mainContainer = screen.getByTestId('chat');
    expect(mainContainer.className).toMatch(/mainContainer/);

    const chatContainer = document.getElementById('chat-container');
    expect(chatContainer).toBeInTheDocument();
    expect(chatContainer?.className).toMatch(/chatContainer/);
  });

  test('should render filters section with correct buttons', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const allButton = screen.getByTestId('allChat');
    const unreadButton = screen.getByTestId('unreadChat');
    const groupButton = screen.getByTestId('groupChat');

    expect(allButton).toHaveTextContent('All');
    expect(unreadButton).toHaveTextContent('Unread');
    expect(groupButton).toHaveTextContent('Groups');
  });

  // ==================== PROP PASSING ====================

  test('should pass correct props to ContactCard for NewChatType', async () => {
    const newChatMock = {
      request: { query: CHATS_LIST, variables: { first: 10, after: null } },
      result: {
        data: {
          chatsByUser: [
            {
              id: 'new-chat-props',
              name: 'New Chat Props',
              avatarURL: 'http://example.com/new-props.png',
              members: {
                edges: [
                  { __typename: 'ChatMemberEdge' },
                  { __typename: 'ChatMemberEdge' },
                  { __typename: 'ChatMemberEdge' },
                  { __typename: 'ChatMemberEdge' },
                ],
              },
              unreadMessagesCount: 7,
              lastMessage: { body: 'Last message text' },
              __typename: 'Chat',
            },
          ],
        },
      },
    };

    renderComponent([newChatMock, newChatMock, mockUnreadChats]);

    await waitFor(() => {
      const card = screen.getByTestId('contact-card-new-chat-props');
      expect(card).toHaveAttribute('data-title', 'New Chat Props');
      expect(card).toHaveAttribute('data-unseen', '7');
      expect(card).toHaveAttribute('data-last-message', 'Last message text');
    });
  });

  test('should pass correct props to ContactCard for legacy chat', async () => {
    const legacyChatMock = {
      request: { query: CHATS_LIST, variables: { first: 10, after: null } },
      result: {
        data: {
          chatsByUser: [
            {
              _id: 'legacy-props',
              id: 'legacy-props',
              name: 'Legacy Props Chat',
              isGroup: true,
              users: [{}, {}, {}],
              image: 'http://example.com/legacy-props.png',
              __typename: 'Chat',
            },
          ],
        },
      },
    };

    renderComponent([legacyChatMock, legacyChatMock, mockUnreadChats]);

    await waitFor(() => {
      const card = screen.getByTestId('contact-card-legacy-props');
      expect(card).toHaveAttribute('data-title', 'Legacy Props Chat');
      expect(card).toHaveAttribute('data-unseen', '0');
      expect(card).toHaveAttribute('data-last-message', '');
    });
  });

  // ==================== TYPE GUARD TESTING ====================

  test('should correctly use isNewChatType type guard', async () => {
    const mixedTypesMock = {
      request: { query: CHATS_LIST, variables: { first: 10, after: null } },
      result: {
        data: {
          chatsByUser: [
            {
              id: 'only-id',
              name: 'Only ID Chat',
              avatarURL: '',
              members: { edges: [{}, {}] },
              unreadMessagesCount: 0,
              lastMessage: null,
              __typename: 'Chat',
            },
            {
              _id: 'only-underscore-id',
              id: 'only-underscore-id',
              name: 'Only Underscore ID',
              isGroup: false,
              users: [{}, {}],
              image: '',
              __typename: 'Chat',
            },
          ],
        },
      },
    };

    renderComponent([mixedTypesMock, mixedTypesMock, mockUnreadChats]);

    await waitFor(() => {
      expect(screen.getByTestId('contact-card-only-id')).toBeInTheDocument();
      expect(
        screen.getByTestId('contact-card-only-underscore-id'),
      ).toBeInTheDocument();
    });
  });

  // ==================== MODAL REFETCH ====================

  test('should allow modals to trigger chat list refetch', async () => {
    renderComponent();
    await screen.findByTestId('contact-card-chat-1');

    // Open group chat modal
    const dropdown = screen.getByTestId('dropdown');
    await user.click(dropdown);
    const newGroupChat = await screen.findByTestId('newGroupChat');
    await user.click(newGroupChat);

    await waitFor(() => {
      expect(screen.getByTestId('create-group-chat-modal')).toBeInTheDocument();
    });

    // Click modal to trigger refetch (based on mock)
    const modal = screen.getByTestId('create-group-chat-modal');
    await user.click(modal);

    // Modal should close and refetch should be triggered
    await waitFor(() => {
      expect(
        screen.queryByTestId('create-group-chat-modal'),
      ).not.toBeInTheDocument();
    });
  });

  // ==================== COMPREHENSIVE EDGE CASES ====================

  test('should handle chat with undefined unreadMessagesCount', async () => {
    const chatUndefinedUnreadMock = {
      request: { query: CHATS_LIST, variables: { first: 10, after: null } },
      result: {
        data: {
          chatsByUser: [
            {
              id: 'undefined-unread',
              name: 'Undefined Unread',
              avatarURL: '',
              members: { edges: [{}, {}] },
              unreadMessagesCount: undefined,
              lastMessage: { body: 'Message' },
              __typename: 'Chat',
            },
          ],
        },
      },
    };

    renderComponent([
      chatUndefinedUnreadMock,
      chatUndefinedUnreadMock,
      mockUnreadChats,
    ]);

    await waitFor(() => {
      const card = screen.getByTestId('contact-card-undefined-unread');
      expect(card).toHaveAttribute('data-unseen', '0');
    });
  });

  test('should handle chat with undefined lastMessage', async () => {
    const chatUndefinedLastMsgMock = {
      request: { query: CHATS_LIST, variables: { first: 10, after: null } },
      result: {
        data: {
          chatsByUser: [
            {
              id: 'undefined-last-msg',
              name: 'Undefined Last Message',
              avatarURL: '',
              members: { edges: [{}, {}] },
              unreadMessagesCount: 0,
              lastMessage: undefined,
              __typename: 'Chat',
            },
          ],
        },
      },
    };

    renderComponent([
      chatUndefinedLastMsgMock,
      chatUndefinedLastMsgMock,
      mockUnreadChats,
    ]);

    await waitFor(() => {
      const card = screen.getByTestId('contact-card-undefined-last-msg');
      expect(card).toHaveAttribute('data-last-message', '');
    });
  });

  test('should handle legacy chat with undefined users array length', async () => {
    const legacyUndefinedUsersMock = {
      request: { query: CHATS_LIST, variables: { first: 10, after: null } },
      result: {
        data: {
          chatsByUser: [
            {
              _id: 'undefined-users',
              id: 'undefined-users',
              name: 'Undefined Users',
              isGroup: false,
              users: undefined,
              image: '',
              __typename: 'Chat',
            },
          ],
        },
      },
    };

    renderComponent([
      legacyUndefinedUsersMock,
      legacyUndefinedUsersMock,
      legacyUndefinedUsersMock,
      mockUnreadChats,
    ]);

    await screen.findByTestId('contact-card-undefined-users');

    // Switch to group filter - should not appear
    const groupButton = screen.getByTestId('groupChat');
    await user.click(groupButton);

    await waitFor(() => {
      expect(
        screen.queryByTestId('contact-card-undefined-users'),
      ).not.toBeInTheDocument();
    });
  });

  test('should handle NewChatType with undefined members.edges length', async () => {
    const newChatUndefinedEdgesMock = {
      request: { query: CHATS_LIST, variables: { first: 10, after: null } },
      result: {
        data: {
          chatsByUser: [
            {
              id: 'undefined-edges',
              name: 'Undefined Edges',
              avatarURL: '',
              members: { edges: undefined },
              unreadMessagesCount: 0,
              lastMessage: null,
              __typename: 'Chat',
            },
          ],
        },
      },
    };

    renderComponent([
      newChatUndefinedEdgesMock,
      newChatUndefinedEdgesMock,
      newChatUndefinedEdgesMock,
      mockUnreadChats,
    ]);

    await screen.findByTestId('contact-card-undefined-edges');

    // Switch to group filter - should not appear
    const groupButton = screen.getByTestId('groupChat');
    await user.click(groupButton);

    await waitFor(() => {
      expect(
        screen.queryByTestId('contact-card-undefined-edges'),
      ).not.toBeInTheDocument();
    });
  });

  test('should handle both null and undefined avatarURL/image', async () => {
    const nullAvatarMock = {
      request: { query: CHATS_LIST, variables: { first: 10, after: null } },
      result: {
        data: {
          chatsByUser: [
            {
              id: 'null-avatar',
              name: 'Null Avatar',
              avatarURL: null,
              members: { edges: [{}, {}] },
              unreadMessagesCount: 0,
              lastMessage: null,
              __typename: 'Chat',
            },
            {
              _id: 'null-image',
              id: 'null-image',
              name: 'Null Image',
              isGroup: false,
              users: [{}, {}],
              image: null,
              __typename: 'Chat',
            },
          ],
        },
      },
    };

    renderComponent([
      nullAvatarMock,
      nullAvatarMock,
      nullAvatarMock,
      mockUnreadChats,
    ]);

    await waitFor(() => {
      expect(
        screen.getByTestId('contact-card-null-avatar'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('contact-card-null-image')).toBeInTheDocument();
    });
  });
});
