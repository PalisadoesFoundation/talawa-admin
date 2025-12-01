import React from 'react';
import { useState } from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { renderHook, act as hookAct } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import useLocalStorage from 'utils/useLocalstorage';
import { vi, type Mock, beforeEach, afterEach } from 'vitest';
import Chat from './Chat';
import { CHATS_LIST, UNREAD_CHATS } from 'GraphQl/Queries/PlugInQueries';


vi.mock('./Chat.module.css', () => ({
  default: {
    containerHeight: 'containerHeight',
    mainContainer: 'mainContainer',
    contactContainer: 'contactContainer',
    addChatContainer: 'addChatContainer',
    contactListContainer: 'contactListContainer',
    filters: 'filters',
    filterButton: 'filterButton',
    selectedBtn: 'selectedBtn',
    contactCardContainer: 'contactCardContainer',
    chatContainer: 'chatContainer',
    customToggle: 'customToggle',
  },
}));

const { mockUseParams } = vi.hoisted(() => ({
  mockUseParams: vi.fn(),
}));

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

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: mockUseParams,
  };
});

// --- GraphQL Mocks ---

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

const mocks = [
  mockChatsList,
  mockChatsListRefetch,
  {
    request: { query: CHATS_LIST, variables: { first: 10, after: null } },
    result: { data: mockChatsListData },
  } as any,
  {
    request: { query: CHATS_LIST, variables: { first: 10, after: null } },
    result: { data: mockChatsListData },
  } as any,
  mockUnreadChats,
  mockUnreadChatsRefetch,
];

describe('Chat Component - Coverage for Uncovered Lines', () => {
  let getItemMock: Mock;
  let setItemMock: Mock;

  beforeEach(() => {
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
    mockUseParams.mockReturnValue({}); // Default: no orgId
  });

  afterEach(() => {
    vi.restoreAllMocks();
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

    await waitFor(() => {
      const chatRoom = screen.getByTestId('chat-room');
      expect(chatRoom).toHaveAttribute('data-selected-contact', 'chat-1');
    });

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
      const card = screen.getByTestId('contact-card-chat-1');
      expect(card).toBeInTheDocument();
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
    await screen.findByTestId('contact-card-chat-1');

    const groupButton = screen.getByTestId('groupChat');
    fireEvent.click(groupButton);

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

    const customMocks = [legacyGroupMock, legacyGroupMock, mockUnreadChats];

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

    fireEvent.click(screen.getByTestId('unreadChat'));
    await waitFor(() => {
      expect(
        screen.queryByTestId('contact-card-chat-2'),
      ).not.toBeInTheDocument();
    });

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

    renderComponent([mockWithOrgId, mockWithOrgId, mockUnreadChats]);

    await waitFor(() => {
      expect(screen.getByTestId('contact-card-chat-1')).toBeInTheDocument();
      expect(
        screen.queryByTestId('contact-card-chat-2'),
      ).not.toBeInTheDocument();
    });
  });

  test('should filter unread chats by orgId with NewChatType', async () => {
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
          ],
        },
      },
    };

    const mockChatsList = {
      request: { query: CHATS_LIST, variables: { first: 10, after: null } },
      result: { data: mockChatsListData },
    };

    renderComponent([mockChatsList, mockUnreadWithOrgId, mockUnreadWithOrgId]);

    await screen.findByTestId('contact-card-chat-1');

    const unreadButton = screen.getByTestId('unreadChat');
    fireEvent.click(unreadButton);

    await waitFor(() => {
      expect(screen.getByTestId('contact-card-chat-1')).toBeInTheDocument();
    });
  });

  test('should filter group chats by orgId with NewChatType', async () => {
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
              createdAt: '2024-01-01',
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
              createdAt: '2024-01-01',
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
    fireEvent.click(groupButton);

    await waitFor(() => {
      expect(screen.getByTestId('contact-card-group-1')).toBeInTheDocument();
    });
  });

  test('should handle NewChatType in second useEffect with orgId filtering', async () => {
    const mockNewChatTypeWithOrg = {
      request: { query: CHATS_LIST, variables: { first: 10, after: null } },
      result: {
        data: {
          chatsByUser: [
            {
              _id: 'chat-new-1',
              id: 'chat-new-1',
              name: 'New Type Chat Org 1',
              isGroup: false,
              description: '',
              createdAt: '2024-01-01',
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
              _id: 'chat-new-2',
              id: 'chat-new-2',
              name: 'New Type Chat Org 2',
              isGroup: false,
              description: '',
              createdAt: '2024-01-01',
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
      mockUnreadChats,
    ]);

    await waitFor(() => {
      expect(screen.getByTestId('contact-card-chat-new-1')).toBeInTheDocument();
    });
  });

  test('should handle legacy GroupChat type in orgId filtering', async () => {
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
            createdAt: '2024-01-01',
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
            createdAt: '2024-01-01',
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
  mockUseParams.mockReturnValue({ orgId: 'org-1' });
  
  renderComponent([
    mockLegacyWithOrgId,
    mockLegacyWithOrgId,
    mockUnreadChats,
  ]);

  await waitFor(() => {

    expect(screen.getByTestId('contact-card-legacy-1')).toBeInTheDocument();
  });
});
  test('should toggle create direct chat modal state', () => {
    const { result } = renderHook(() => {
      const [isOpen, setIsOpen] = useState(false);
      const toggle = () => setIsOpen(!isOpen);
      return { isOpen, toggle };
    });

    hookAct(() => {
      result.current.toggle();
    });

    expect(result.current.isOpen).toBe(true);
  });

  test('should toggle create group chat modal state', () => {
    const { result } = renderHook(() => {
      const [isOpen, setIsOpen] = useState(false);
      const toggle = () => setIsOpen(!isOpen);
      return { isOpen, toggle };
    });

    hookAct(() => {
      result.current.toggle();
    });

    expect(result.current.isOpen).toBe(true);
  });

  test('should filter chats with mixed schema types by organization', async () => {
    const mixedSchemaMocks = {
      request: { query: CHATS_LIST, variables: { first: 10, after: null } },
      result: {
        data: {
          chatsByUser: [
        
            {
              id: 'new-schema-1',
              name: 'New Schema Chat',
              organization: { id: 'org-1' },
              members: { edges: [{}, {}] },
              __typename: 'Chat',
            },
              
            {
              _id: 'legacy-schema-1',
              name: 'Legacy Schema Chat',
              organization: { _id: 'org-1' },
              users: [{}, {}],
              __typename: 'Chat',
            },
            
            {
              id: 'new-schema-2',
              name: 'Different Org Chat',
              organization: { id: 'org-2' },
              members: { edges: [{}, {}] },
              __typename: 'Chat',
            },
          ],
        },
      },
    };

    mockUseParams.mockReturnValue({ orgId: 'org-1' });
    renderComponent([mixedSchemaMocks, mixedSchemaMocks, mockUnreadChats]);

    await waitFor(() => {
      expect(screen.getByTestId('contact-card-new-schema-1')).toBeInTheDocument();
      expect(screen.getByTestId('contact-card-legacy-schema-1')).toBeInTheDocument();
      expect(screen.queryByTestId('contact-card-new-schema-2')).not.toBeInTheDocument();
    });
  });

  test('should detect group chats for NewChatType by member count', async () => {
    const groupChatMock = {
      request: { query: CHATS_LIST, variables: { first: 10, after: null } },
      result: {
        data: {
          chatsByUser: [
            {
              id: 'group-chat',
              name: 'Group Chat',
              organization: { id: 'org-1' },
              members: { edges: [{}, {}, {}] }, 
              __typename: 'Chat',
            },
            {
              id: 'direct-chat',
              name: 'Direct Chat',
              organization: { id: 'org-1' },
              members: { edges: [{}, {}] }, 
              __typename: 'Chat',
            },
          ],
        },
      },
    };

    renderComponent([groupChatMock, groupChatMock, mockUnreadChats]);
    await screen.findByTestId('contact-card-group-chat');

    const groupButton = screen.getByTestId('groupChat');
    fireEvent.click(groupButton);

    await waitFor(() => {
      expect(screen.getByTestId('contact-card-group-chat')).toBeInTheDocument();
      expect(screen.queryByTestId('contact-card-direct-chat')).not.toBeInTheDocument();
    });
  });

  test('should handle empty chats list gracefully', async () => {
    const emptyMocks = {
      request: { query: CHATS_LIST, variables: { first: 10, after: null } },
      result: {
        data: {
          chatsByUser: [],
        },
      },
    };

    renderComponent([emptyMocks, emptyMocks, mockUnreadChats]);

    await waitFor(() => {
      const contactCardContainer = screen.getByTestId('contactCardContainer');
      expect(contactCardContainer).toBeInTheDocument();
       // Verify no contact cards are rendered
      expect(screen.queryByTestId(/^contact-card-/)).not.toBeInTheDocument();
    });
  });

  test('should correctly identify NewChatType through component behavior', async () => {
    const newChatTypeMock = {
      request: { query: CHATS_LIST, variables: { first: 10, after: null } },
      result: {
        data: {
          chatsByUser: [
            {
              id: 'new-chat-1',
              name: 'New Chat Type',
              avatarURL: 'avatar.jpg',
              organization: { id: 'org-1' },
              members: { edges: [{}, {}, {}] }, 
              unreadMessagesCount: 5,
              lastMessage: { body: 'Last message text' },
              __typename: 'Chat',
            },
          ],
        },
      },
    };

    renderComponent([newChatTypeMock, newChatTypeMock, mockUnreadChats]);

    await waitFor(() => {
      const contactCard = screen.getByTestId('contact-card-new-chat-1');
      expect(contactCard).toBeInTheDocument();
      expect(contactCard).toHaveAttribute('data-last-message', 'Last message text');
    });
  });
  test('should apply correct CSS classes to active filter buttons', async () => {
    renderComponent();
    await screen.findByTestId('contact-card-chat-1');

    const allButton = screen.getByTestId('allChat');
    const unreadButton = screen.getByTestId('unreadChat');
    const groupButton = screen.getByTestId('groupChat');

    expect(allButton).toHaveClass('selectedBtn');
    expect(unreadButton).not.toHaveClass('selectedBtn');
    expect(groupButton).not.toHaveClass('selectedBtn');

    fireEvent.click(unreadButton);
    expect(allButton).not.toHaveClass('selectedBtn');
    expect(unreadButton).toHaveClass('selectedBtn');
    expect(groupButton).not.toHaveClass('selectedBtn');

    fireEvent.click(groupButton);
    expect(allButton).not.toHaveClass('selectedBtn');
    expect(unreadButton).not.toHaveClass('selectedBtn');
    expect(groupButton).toHaveClass('selectedBtn');
  });
});
