import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import useLocalStorage from 'utils/useLocalstorage';
import { vi, type Mock } from 'vitest';
import Chat from './Chat';
import { CHATS_LIST, UNREAD_CHATS } from 'GraphQl/Queries/PlugInQueries';

// Mock child components
vi.mock('components/UserPortal/ContactCard/ContactCard', () => ({
  default: (props: {
    id: string;
    setSelectedContact: (id: string) => void;
    lastMessage: string;
  }) => (
    <div
      data-testid={`contact-card-${props.id}`}
      onClick={() => props.setSelectedContact(props.id)}
      data-last-message={props.lastMessage}
    ></div>
  ),
}));

vi.mock('components/UserPortal/ChatRoom/ChatRoom', () => ({
  default: ({ selectedContact }: { selectedContact: string }) => (
    <div data-testid="chat-room" data-selected-contact={selectedContact}></div>
  ),
}));

vi.mock(
  '../../../components/UserPortal/CreateGroupChat/CreateGroupChat',
  () => ({
    default: () => <div data-testid="create-group-chat-modal"></div>,
  }),
);

vi.mock('components/UserPortal/CreateDirectChat/CreateDirectChat', () => ({
  default: () => <div data-testid="create-direct-chat-modal"></div>,
}));

// Mock hooks
vi.mock('utils/useLocalstorage');

// --- Corrected and Detailed GraphQL Mocks ---

const mockChatsListData = {
  chatsByUser: [
    {
      _id: 'chat-1',
      id: 'chat-1',
      name: 'Direct Chat 1',
      isGroup: false,
      users: [{}, {}],
      image: '',
      __typename: 'Chat',
    },
    {
      _id: 'chat-2',
      id: 'chat-2',
      name: 'Group Chat 1',
      isGroup: true,
      users: [{}, {}, {}],
      image: '',
      __typename: 'Chat',
    },
    {
      _id: 'chat-3',
      id: 'chat-3',
      name: 'Direct Chat 2',
      isGroup: false,
      users: [{}, {}],
      image: '',
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

// A second, identical mock for the refetch call in the group filter
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

// A second mock for the refetch call
const mockUnreadChatsRefetch = {
  request: {
    query: UNREAD_CHATS,
    variables: {},
  },
  result: {
    data: mockUnreadChatsData,
  },
};

const mocks = [
  mockChatsList,
  mockChatsListRefetch,
  mockUnreadChats,
  mockUnreadChatsRefetch,
];

describe('Chat Component', () => {
  let getItemMock: Mock;
  let setItemMock: Mock;

  beforeEach(() => {
    getItemMock = vi.fn();
    setItemMock = vi.fn();
    (useLocalStorage as Mock).mockReturnValue({
      getItem: getItemMock,
      setItem: setItemMock,
    });
    vi.clearAllMocks();
  });

  const renderComponent = (customMocks = mocks) =>
    render(
      <MockedProvider mocks={customMocks} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <Provider store={store}>
            <Chat />
          </Provider>
        </I18nextProvider>
      </MockedProvider>,
    );

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

  test('should select the first chat by default if none in local storage', async () => {
    getItemMock.mockReturnValue(null);
    renderComponent();

    await waitFor(() => {
      const chatRoom = screen.getByTestId('chat-room');
      expect(chatRoom).toHaveAttribute('data-selected-contact', 'chat-1');
    });

    expect(setItemMock).toHaveBeenCalledWith('selectedChatId', 'chat-1');
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
    getItemMock.mockReturnValue('chat-999'); // Stale ID
    renderComponent();

    // Should ignore stale ID and select the first chat from the list
    await waitFor(() => {
      const chatRoom = screen.getByTestId('chat-room');
      expect(chatRoom).toHaveAttribute('data-selected-contact', 'chat-1');
    });

    // Should update local storage with the new valid ID
    expect(setItemMock).toHaveBeenCalledWith('selectedChatId', 'chat-1');
  });

  test('should change selected chat on user click', async () => {
    renderComponent();
    await screen.findByTestId('contact-card-chat-1');

    const contactCard2 = screen.getByTestId('contact-card-chat-2');
    fireEvent.click(contactCard2);

    await waitFor(() => {
      const chatRoom = screen.getByTestId('chat-room');
      expect(chatRoom).toHaveAttribute('data-selected-contact', 'chat-2');
    });
    expect(setItemMock).toHaveBeenCalledWith('selectedChatId', 'chat-2');
  });

  test('should filter for unread chats and check last message', async () => {
    renderComponent();
    await screen.findByTestId('contact-card-chat-1'); // Wait for initial load

    const unreadButton = screen.getByTestId('unreadChat');
    fireEvent.click(unreadButton);

    await waitFor(() => {
      // Unread mock has only one chat
      const card = screen.getByTestId('contact-card-chat-1');
      expect(card).toBeInTheDocument();
      // Check that the lastMessage prop is passed correctly
      expect(card).toHaveAttribute('data-last-message', 'Hello there');

      expect(
        screen.queryByTestId('contact-card-chat-2'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('contact-card-chat-3'),
      ).not.toBeInTheDocument();
    });
  });

  test('should filter for group chats', async () => {
    renderComponent();
    await screen.findByTestId('contact-card-chat-1'); // Wait for initial load

    const groupButton = screen.getByTestId('groupChat');
    fireEvent.click(groupButton);

    await waitFor(() => {
      // The main mock has only one group chat
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
              isGroup: false, // Important: isGroup is false
              users: [{}, {}, {}], // But has 3 users
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

    // Provide all necessary mocks for this specific test
    const customMocks = [
      legacyGroupMock, // For initial CHATS_LIST load
      legacyGroupMock, // For the CHATS_LIST refetch on group filter click
      mockUnreadChats, // For the initial UNREAD_CHATS load
    ];

    renderComponent(customMocks);

    await screen.findByTestId('contact-card-legacy-group');

    const groupButton = screen.getByTestId('groupChat');
    fireEvent.click(groupButton);

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

    // Switch to unread
    fireEvent.click(screen.getByTestId('unreadChat'));
    await waitFor(() => {
      expect(
        screen.queryByTestId('contact-card-chat-2'),
      ).not.toBeInTheDocument();
    });

    // Switch back to all
    fireEvent.click(screen.getByTestId('allChat'));
    await waitFor(() => {
      expect(screen.getByTestId('contact-card-chat-1')).toBeInTheDocument();
      expect(screen.getByTestId('contact-card-chat-2')).toBeInTheDocument();
      expect(screen.getByTestId('contact-card-chat-3')).toBeInTheDocument();
    });
  });

  test('should open new direct and group chat modals', async () => {
    renderComponent();

    const dropdown = screen.getByTestId('dropdown');
    fireEvent.click(dropdown);

    const newDirectChat = await screen.findByTestId('newDirectChat');
    fireEvent.click(newDirectChat);

    expect(screen.getByTestId('create-direct-chat-modal')).toBeInTheDocument();

    const newGroupChat = await screen.findByTestId('newGroupChat');
    fireEvent.click(newGroupChat);

    expect(screen.getByTestId('create-group-chat-modal')).toBeInTheDocument();
  });
});
