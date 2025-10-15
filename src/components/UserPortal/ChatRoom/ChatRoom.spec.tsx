import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import ChatRoom from './ChatRoom';
import { CHAT_BY_ID, UNREAD_CHATS } from 'GraphQl/Queries/PlugInQueries';
import {
  MARK_CHAT_MESSAGES_AS_READ,
  MESSAGE_SENT_TO_CHAT,
  SEND_MESSAGE_TO_CHAT,
  EDIT_CHAT_MESSAGE,
  DELETE_CHAT_MESSAGE,
} from 'GraphQl/Mutations/OrganizationMutations';

// Mock data
export const mockChatData = {
  id: 'chat123',
  name: 'Test Chat',
  description: 'Test Description',
  avatarMimeType: 'image/jpeg',
  avatarURL: 'https://example.com/avatar.jpg',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
  isGroup: false,
  organization: {
    id: 'org123',
    name: 'Test Org',
    countryCode: 'US',
  },
  creator: {
    id: 'creator123',
    name: 'Creator Name',
    avatarMimeType: 'image/jpeg',
    avatarURL: 'https://example.com/creator.jpg',
  },
  updater: {
    id: 'updater123',
    name: 'Updater Name',
    avatarMimeType: 'image/jpeg',
    avatarURL: 'https://example.com/updater.jpg',
  },
  members: {
    edges: [
      {
        cursor: 'cursor1',
        node: {
          user: {
            id: 'user123',
            name: 'Current User',
            avatarMimeType: 'image/jpeg',
            avatarURL: 'https://example.com/user.jpg',
          },
          role: 'MEMBER',
        },
      },
      {
        cursor: 'cursor2',
        node: {
          user: {
            id: 'otherUser123',
            name: 'Other User',
            avatarMimeType: 'image/jpeg',
            avatarURL: 'https://example.com/other.jpg',
          },
          role: 'MEMBER',
        },
      },
    ],
  },
  messages: {
    edges: [
      {
        cursor: 'msgCursor1',
        node: {
          id: 'msg1',
          body: 'Hello World',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
          creator: {
            id: 'user123',
            name: 'Current User',
            avatarMimeType: 'image/jpeg',
            avatarURL: 'https://example.com/user.jpg',
          },
          parentMessage: null,
        },
      },
    ],
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: 'start',
      endCursor: 'end',
    },
  },
};

export const mockGroupChatData = {
  ...mockChatData,
  isGroup: true,
  members: {
    edges: [
      ...mockChatData.members.edges,
      {
        cursor: 'cursor3',
        node: {
          user: {
            id: 'user3',
            name: 'User 3',
            avatarMimeType: 'image/jpeg',
            avatarURL: 'https://example.com/user3.jpg',
          },
          role: 'MEMBER',
        },
      },
    ],
  },
};

// GraphQL Mocks
export const CHAT_BY_ID_MOCK = {
  request: {
    query: CHAT_BY_ID,
    variables: {
      input: { id: 'chat123' },
      first: 10,
      after: null,
      lastMessages: 10,
      beforeMessages: null,
    },
  },
  result: {
    data: {
      chat: mockChatData,
    },
  },
};

export const CHAT_BY_ID_GROUP_MOCK = {
  request: {
    query: CHAT_BY_ID,
    variables: {
      input: { id: 'chat123' },
      first: 10,
      after: null,
      lastMessages: 10,
      beforeMessages: null,
    },
  },
  result: {
    data: {
      chat: mockGroupChatData,
    },
  },
};

export const UNREAD_CHATS_MOCK = {
  request: {
    query: UNREAD_CHATS,
    variables: {},
  },
  result: {
    data: {
      unreadChats: [],
    },
  },
};

export const SEND_MESSAGE_MOCK = {
  request: {
    query: SEND_MESSAGE_TO_CHAT,
    variables: {
      input: {
        chatId: 'chat123',
        parentMessageId: undefined,
        body: 'Test message',
      },
    },
  },
  result: {
    data: {
      createChatMessage: {
        id: 'newMsg123',
        body: 'Test message',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        creator: {
          id: 'user123',
          name: 'Current User',
          avatarMimeType: 'image/jpeg',
          avatarURL: 'https://example.com/user.jpg',
        },
        parentMessage: null,
      },
    },
  },
};

export const EDIT_MESSAGE_MOCK = {
  request: {
    query: EDIT_CHAT_MESSAGE,
    variables: {
      input: {
        id: 'msg1',
        body: 'Edited message',
      },
    },
  },
  result: {
    data: {
      updateChatMessage: {
        id: 'msg1',
        body: 'Edited message',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        creator: {
          id: 'user123',
          name: 'Current User',
          avatarMimeType: 'image/jpeg',
          avatarURL: 'https://example.com/user.jpg',
        },
        parentMessage: null,
      },
    },
  },
};

export const DELETE_MESSAGE_MOCK = {
  request: {
    query: DELETE_CHAT_MESSAGE,
    variables: {
      input: {
        id: 'msg1',
      },
    },
  },
  result: {
    data: {
      deleteChatMessage: {
        id: 'msg1',
        body: 'Hello World',
        createdAt: '2023-01-01T00:00:00Z',
      },
    },
  },
};

export const MARK_READ_MOCK = {
  request: {
    query: MARK_CHAT_MESSAGES_AS_READ,
    variables: {
      input: {
        chatId: 'chat123',
        messageId: 'msg1',
      },
    },
  },
  result: {
    data: {
      markChatAsRead: true,
    },
  },
};

export const MESSAGE_SENT_SUBSCRIPTION_MOCK = {
  request: {
    query: MESSAGE_SENT_TO_CHAT,
    variables: {
      input: {
        id: 'chat123',
      },
    },
  },
  result: {
    data: {
      chatMessageCreate: {
        id: 'subMsg123',
        body: 'New message from subscription',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        chat: {
          id: 'chat123',
        },
        creator: {
          id: 'otherUser123',
          name: 'Other User',
          avatarMimeType: 'image/jpeg',
          avatarURL: 'https://example.com/other.jpg',
        },
        parentMessage: null,
      },
    },
  },
};

// Load more messages mock
export const LOAD_MORE_MESSAGES_MOCK = {
  request: {
    query: CHAT_BY_ID,
    variables: {
      input: { id: 'chat123' },
      first: 10,
      after: null,
      lastMessages: 10,
      beforeMessages: 'msgCursor1',
    },
  },
  result: {
    data: {
      chat: {
        ...mockChatData,
        messages: {
          ...mockChatData.messages,
          edges: [
            {
              cursor: 'oldMsgCursor',
              node: {
                id: 'oldMsg',
                body: 'Older message',
                createdAt: '2023-01-01T00:00:00Z',
                updatedAt: '2023-01-01T00:00:00Z',
                creator: {
                  id: 'otherUser123',
                  name: 'Other User',
                  avatarMimeType: 'image/jpeg',
                  avatarURL: 'https://example.com/other.jpg',
                },
                parentMessage: null,
              },
            },
            ...mockChatData.messages.edges,
          ],
          pageInfo: {
            ...mockChatData.messages.pageInfo,
            hasPreviousPage: false,
          },
        },
      },
    },
  },
};

// Error mocks
export const CHAT_BY_ID_ERROR_MOCK = {
  request: {
    query: CHAT_BY_ID,
    variables: {
      input: { id: 'chat123' },
      first: 10,
      after: null,
      lastMessages: 10,
      beforeMessages: null,
    },
  },
  error: new Error('Failed to fetch chat'),
};

export const SEND_MESSAGE_ERROR_MOCK = {
  request: {
    query: SEND_MESSAGE_TO_CHAT,
    variables: {
      input: {
        chatId: 'chat123',
        parentMessageId: undefined,
        body: 'Test message',
      },
    },
  },
  error: new Error('Failed to send message'),
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({
      chatId: 'chat123',
    }),
  };
});

const renderChatRoom = (mocks: MockedResponse[] = []) => {
  const defaultMocks = [
    CHAT_BY_ID_MOCK,
    UNREAD_CHATS_MOCK,
    SEND_MESSAGE_MOCK,
    EDIT_MESSAGE_MOCK,
    DELETE_MESSAGE_MOCK,
    MARK_READ_MOCK,
    MESSAGE_SENT_SUBSCRIPTION_MOCK,
    LOAD_MORE_MESSAGES_MOCK,
  ];
  const chatListRefetch = vi.fn();

  return render(
    <MockedProvider mocks={[...defaultMocks, ...mocks]} addTypename={false}>
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <ChatRoom
              selectedContact="chat123"
              chatListRefetch={chatListRefetch}
            />
          </I18nextProvider>
        </BrowserRouter>
      </Provider>
    </MockedProvider>,
  );
};

describe('ChatRoom Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading state initially', () => {
    renderChatRoom();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders chat room with direct chat data', async () => {
    renderChatRoom();
    await waitFor(() => {
      expect(screen.getByText('Test Chat')).toBeInTheDocument();
    });
  });

  it('renders chat room with group chat data', async () => {
    renderChatRoom([CHAT_BY_ID_GROUP_MOCK]);
    await waitFor(() => {
      expect(screen.getByText(mockGroupChatData.name)).toBeInTheDocument();
    });
  });

  it('sends a text message successfully', async () => {
    renderChatRoom();
    await waitFor(() => {
      expect(screen.getByText('Test Chat')).toBeInTheDocument();
    });

    const messageInput = screen.getByTestId('messageInput') as HTMLInputElement;
    const sendButton = screen.getByTestId('sendMessage');

    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });
  });

  it('edits a message successfully', async () => {
    renderChatRoom();
    await waitFor(() => {
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    const editButton = screen.getByTestId('replyToMessage');
    fireEvent.click(editButton);

    const editInput = screen.getByTestId('messageInput') as HTMLInputElement;
    // pre-filled with existing message
    fireEvent.change(editInput, { target: { value: 'Edited message' } });

    const saveButton = screen.getByTestId('sendMessage');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Edited message')).toBeInTheDocument();
    });
  });

  it('deletes a message successfully', async () => {
    renderChatRoom();
    await waitFor(() => {
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    const deleteButton = screen.getByTestId('deleteMessage');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText('Hello World')).not.toBeInTheDocument();
    });
  });

  it('loads more messages when scrolling up', async () => {
    renderChatRoom();
    await waitFor(() => {
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    const chatContainer = screen.getByTestId('message-list');
    fireEvent.scroll(chatContainer, { target: { scrollTop: 0 } });

    await waitFor(() => {
      expect(screen.getByText('Older message')).toBeInTheDocument();
    });
  });

  it('displays error message when chat query fails', async () => {
    renderChatRoom([CHAT_BY_ID_ERROR_MOCK]);
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch chat')).toBeInTheDocument();
    });
  });

  it('displays error message when sending message fails', async () => {
    renderChatRoom([SEND_MESSAGE_ERROR_MOCK]);
    await waitFor(() => {
      expect(screen.getByText('Test Chat')).toBeInTheDocument();
    });

    const messageInputErr = screen.getByTestId(
      'messageInput',
    ) as HTMLInputElement;
    const sendButtonErr = screen.getByTestId('sendMessage');

    fireEvent.change(messageInputErr, { target: { value: 'Test message' } });
    fireEvent.click(sendButtonErr);

    await waitFor(() => {
      // The component surfaces errors via translation keys in errors.json; check for a generic failure string
      expect(screen.getByText(/Failed|Error/i)).toBeInTheDocument();
    });
  });
});
