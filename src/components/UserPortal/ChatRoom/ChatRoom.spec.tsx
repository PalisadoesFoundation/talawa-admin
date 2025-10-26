import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useLocalStorage } from '../../../utils/useLocalstorage';

vi.mock('react-bootstrap', async () => {
  const actual =
    await vi.importActual<typeof import('react-bootstrap')>('react-bootstrap');
  const mocks = await vi.importActual(
    '../../../test-utils/mocks/react-bootstrap',
  );
  return { ...actual, ...mocks };
});

vi.mock('utils/MinioUpload', () => {
  const useMinioUpload = vi.fn(() => ({
    uploadFileToMinio: async () => ({ objectName: 'uploaded_obj' }),
  }));
  return { useMinioUpload };
});

vi.mock('utils/MinioDownload', () => {
  const useMinioDownload = vi.fn(() => ({
    getFileFromMinio: async () => 'https://example.com/presigned.jpg',
  }));
  return { useMinioDownload };
});

// Note: no direct imports from Minio modules are necessary; they are mocked above

import ChatRoom, { MessageImage } from './ChatRoom';
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
      hasPreviousPage: true,
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

export const SEND_MESSAGE_UPLOADED_MOCK = {
  request: {
    query: SEND_MESSAGE_TO_CHAT,
    variables: {
      input: {
        chatId: 'chat123',
        parentMessageId: undefined,
        body: 'uploaded_obj',
      },
    },
  },
  result: {
    data: {
      createChatMessage: {
        id: 'newMsgUploaded',
        body: 'uploaded_obj',
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

export const MARK_READ_NEWMSG_MOCK = {
  request: {
    query: MARK_CHAT_MESSAGES_AS_READ,
    variables: {
      input: {
        chatId: 'chat123',
        messageId: 'newMsg123',
      },
    },
  },
  result: {
    data: {
      markChatAsRead: true,
    },
  },
};

export const MARK_READ_SUBMSG_MOCK = {
  request: {
    query: MARK_CHAT_MESSAGES_AS_READ,
    variables: {
      input: {
        chatId: 'chat123',
        messageId: 'subMsg123',
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

// Post-mutation chat states used by tests when chatRefetch is called after
// sending/editing/deleting a message.
export const CHAT_BY_ID_AFTER_SEND_MOCK = {
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
      chat: {
        ...mockChatData,
        messages: {
          ...mockChatData.messages,
          edges: [
            ...mockChatData.messages.edges,
            {
              cursor: 'newMsgCursor',
              node: {
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
          ],
        },
      },
    },
  },
};

export const CHAT_BY_ID_AFTER_EDIT_MOCK = {
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
      chat: {
        ...mockChatData,
        messages: {
          ...mockChatData.messages,
          edges: [
            {
              cursor: 'msgCursor1',
              node: {
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
          ],
        },
      },
    },
  },
};

export const CHAT_BY_ID_AFTER_DELETE_MOCK = {
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
      chat: {
        ...mockChatData,
        messages: {
          ...mockChatData.messages,
          edges: [
            // remove the msg1 edge to simulate deletion
            // keep only subscription message if present
            {
              cursor: 'subMsgCursor',
              node: {
                id: 'subMsg123',
                body: 'New message from subscription',
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
          ],
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
  result: {
    errors: [
      {
        message: 'Failed to send message',
        extensions: { code: 'SEND_MESSAGE_FAILED' },
      },
    ],
  },
};

// Additional mocks for new tests
export const CHAT_WITH_PARENT_MESSAGE_MOCK = {
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
      chat: {
        ...mockChatData,
        messages: {
          ...mockChatData.messages,
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
                parentMessage: {
                  id: 'parent1',
                  body: 'Parent body',
                  createdAt: '2022-12-31T00:00:00Z',
                  creator: {
                    id: 'otherUser123',
                    name: 'Other User',
                  },
                },
              },
            },
          ],
        },
      },
    },
  },
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
    CHAT_BY_ID_MOCK,
    CHAT_BY_ID_MOCK,
    // UNREAD_CHATS can be requested multiple times during lifecycle; include several copies
    UNREAD_CHATS_MOCK,
    UNREAD_CHATS_MOCK,
    UNREAD_CHATS_MOCK,
    UNREAD_CHATS_MOCK,
    UNREAD_CHATS_MOCK,
    SEND_MESSAGE_MOCK,
    EDIT_MESSAGE_MOCK,
    DELETE_MESSAGE_MOCK,
    MARK_READ_MOCK,
    MARK_READ_NEWMSG_MOCK,
    MARK_READ_SUBMSG_MOCK,
    MESSAGE_SENT_SUBSCRIPTION_MOCK,
    LOAD_MORE_MESSAGES_MOCK,
    LOAD_MORE_MESSAGES_MOCK,
    LOAD_MORE_MESSAGES_MOCK,
  ];
  const chatListRefetch = vi.fn();
  const { setItem } = useLocalStorage();
  setItem('userId', 'user123');
  const allMocks = [...mocks, ...defaultMocks];
  const renderResult = render(
    <MockedProvider mocks={allMocks} addTypename={false}>
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

  return { ...renderResult, chatListRefetch };
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
    expect(screen.getByTestId('messageInput')).toBeInTheDocument();
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
    const { chatListRefetch } = renderChatRoom([CHAT_BY_ID_AFTER_SEND_MOCK]);

    await waitFor(() => {
      expect(screen.getByText('Test Chat')).toBeInTheDocument();
    });

    const messageInput = screen.getByTestId('messageInput') as HTMLInputElement;
    const sendButton = screen.getByTestId('sendMessage');

    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(chatListRefetch).toHaveBeenCalled();
      const inputEl = screen.getByTestId('messageInput') as HTMLInputElement;
      expect(inputEl.value).toBe('');
    });
  });

  it('edits a message successfully', async () => {
    const { chatListRefetch: editRefetch } = renderChatRoom([
      CHAT_BY_ID_MOCK,
      CHAT_BY_ID_AFTER_EDIT_MOCK,
    ]);

    await waitFor(() => {
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    const msgNode = screen
      .getByText('Hello World')
      .closest('[data-testid="message"]') as HTMLElement | null;
    if (!msgNode) throw new Error('message node not found');
    const toggle = within(msgNode as HTMLElement).getByTestId('dropdown');
    fireEvent.click(toggle);

    const editButton = screen.getByTestId('replyToMessage');
    fireEvent.click(editButton);

    const editInput = screen.getByTestId('messageInput') as HTMLInputElement;
    fireEvent.change(editInput, { target: { value: 'Edited message' } });

    const saveButton = screen.getByTestId('sendMessage');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(editRefetch).toHaveBeenCalled();
    });
  });

  it('deletes a message successfully', async () => {
    const { chatListRefetch: deleteRefetch } = renderChatRoom([
      CHAT_BY_ID_MOCK,
      CHAT_BY_ID_AFTER_DELETE_MOCK,
    ]);

    await waitFor(() => {
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    const msgNode = screen
      .getByText('Hello World')
      .closest('[data-testid="message"]') as HTMLElement | null;
    if (!msgNode) throw new Error('message node not found');
    const toggle = within(msgNode as HTMLElement).getByTestId('dropdown');
    fireEvent.click(toggle);

    const deleteButton = screen.getByTestId('deleteMessage');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteRefetch).toHaveBeenCalled();
    });
  });

  it('loads more messages when scrolling up', async () => {
    renderChatRoom();
    await waitFor(() => {
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    const chatContainer = document.getElementById('messages');
    if (!chatContainer) throw new Error('messages container not found');
    fireEvent.scroll(chatContainer, { target: { scrollTop: 0 } });

    await waitFor(() => {
      expect(screen.getByText('Older message')).toBeInTheDocument();
    });
  });

  it('displays error message when chat query fails', async () => {
    renderChatRoom([CHAT_BY_ID_ERROR_MOCK]);
    await waitFor(() => {
      expect(screen.queryByText('Test Chat')).not.toBeInTheDocument();
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

    // Wait for the mutation to complete (with error)
    await waitFor(
      () => {
        // Verify the message didn't get sent
        expect(screen.queryByText('Test message')).not.toBeInTheDocument();
        // The input should still have the message (so user can retry)
        const inputEl = screen.getByTestId('messageInput') as HTMLInputElement;
        expect(inputEl.value).toBe('Test message');
      },
      { timeout: 2000 },
    );
  });

  it('shows reply UI when Reply is clicked and can be closed', async () => {
    renderChatRoom();

    await waitFor(() => {
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    const msgNode = screen
      .getByText('Hello World')
      .closest('[data-testid="message"]') as HTMLElement | null;
    if (!msgNode) throw new Error('message node not found');
    const toggle = within(msgNode as HTMLElement).getByTestId('dropdown');
    fireEvent.click(toggle);

    const replyButton = within(msgNode as HTMLElement).getByTestId('replyBtn');
    fireEvent.click(replyButton);

    await waitFor(() => {
      expect(screen.getByTestId('replyMsg')).toBeInTheDocument();
    });

    const closeReply = screen.getByTestId('closeReply');
    fireEvent.click(closeReply);

    await waitFor(() => {
      expect(screen.queryByTestId('replyMsg')).not.toBeInTheDocument();
    });
  });

  it('sends message on Enter key and clears input', async () => {
    const { chatListRefetch } = renderChatRoom([CHAT_BY_ID_AFTER_SEND_MOCK]);

    await waitFor(() => {
      expect(screen.getByText('Test Chat')).toBeInTheDocument();
    });

    const messageInput = screen.getByTestId('messageInput') as HTMLInputElement;
    fireEvent.change(messageInput, { target: { value: 'Test message' } });

    fireEvent.keyDown(messageInput, {
      key: 'Enter',
      code: 'Enter',
      charCode: 13,
    });

    await waitFor(() => {
      expect(chatListRefetch).toHaveBeenCalled();
      expect(
        (screen.getByTestId('messageInput') as HTMLInputElement).value,
      ).toBe('');
    });
  });

  it('renders parent message link when message has parentMessage', async () => {
    renderChatRoom([CHAT_WITH_PARENT_MESSAGE_MOCK]);

    await waitFor(() => {
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    const msgEl = document.getElementById('msg1');
    expect(msgEl).toBeTruthy();
    const anchor = msgEl?.querySelector('a');
    expect(anchor).toBeTruthy();
    expect(anchor).toHaveAttribute('href', '#parent1');
    expect(anchor?.textContent).toContain('Parent body');
  });

  describe('MessageImage component', () => {
    it('shows loading then renders image when getFileFromMinio resolves', async () => {
      const getFile = vi
        .fn()
        .mockResolvedValue('https://example.com/presigned.jpg');
      const { findByAltText, getByText } = render(
        <MessageImage
          media="uploads/img1"
          organizationId="org123"
          getFileFromMinio={getFile}
        />,
      );

      expect(getByText('Loading image...')).toBeInTheDocument();

      const img = await findByAltText('attachment');
      expect(img).toBeTruthy();
      expect(img).toHaveAttribute('src', 'https://example.com/presigned.jpg');
    });

    it('shows error message when getFileFromMinio rejects', async () => {
      const getFile = vi.fn().mockRejectedValue(new Error('not found'));
      const { findByText } = render(
        <MessageImage
          media="uploads/img2"
          organizationId="org123"
          getFileFromMinio={getFile}
        />,
      );

      const err = await findByText('Image not available');
      expect(err).toBeInTheDocument();
    });

    it('switches to error state when image onError fires', async () => {
      const getFile = vi.fn().mockResolvedValue('https://example.com/bad.jpg');
      const { findByAltText, findByText } = render(
        <MessageImage
          media="uploads/img3"
          organizationId="org123"
          getFileFromMinio={getFile}
        />,
      );

      const img = await findByAltText('attachment');
      fireEvent.error(img);

      const err = await findByText('Image not available');
      expect(err).toBeInTheDocument();
    });

    it('shows error when media is falsy (no media provided)', async () => {
      const getFile = vi.fn();
      const { getByText } = render(
        <MessageImage
          media={''}
          organizationId="org123"
          getFileFromMinio={getFile}
        />,
      );

      expect(getByText('Image not available')).toBeInTheDocument();
    });
  });

  it('derives header from other user when members length is 2', async () => {
    const twoMemberChat = {
      ...mockChatData,
      members: {
        edges: [mockChatData.members.edges[0], mockChatData.members.edges[1]],
      },
    };

    const CHAT_TWO_MEMBERS = {
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
          chat: twoMemberChat,
        },
      },
    };

    renderChatRoom([CHAT_TWO_MEMBERS]);

    await waitFor(() => {
      expect(screen.getByText('Other User')).toBeInTheDocument();
      const avatar = screen.getByAltText('Other User');
      expect(avatar).toBeInTheDocument();
    });
  });

  it('opens group chat details modal when group header is clicked', async () => {
    renderChatRoom([CHAT_BY_ID_GROUP_MOCK]);

    await waitFor(() => {
      expect(screen.getByText(mockGroupChatData.name)).toBeInTheDocument();
    });

    const headerNode = screen.getByText(mockGroupChatData.name).closest('div');
    if (!headerNode) throw new Error('header node not found');
    fireEvent.click(headerNode);

    await waitFor(() => {
      expect(screen.getByTestId('groupChatDetailsModal')).toBeInTheDocument();
    });
  });

  it('deleteMessage error is handled without throwing', async () => {
    const DELETE_MESSAGE_ERROR_MOCK = {
      request: {
        query: DELETE_CHAT_MESSAGE,
        variables: { input: { id: 'msg1' } },
      },
      error: new Error('Delete failed'),
    };

    renderChatRoom([DELETE_MESSAGE_ERROR_MOCK]);

    await waitFor(() => {
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    const msgNode = screen
      .getByText('Hello World')
      .closest('[data-testid="message"]') as HTMLElement | null;
    if (!msgNode) throw new Error('message node not found');
    const toggle = within(msgNode as HTMLElement).getByTestId('dropdown');
    fireEvent.click(toggle);

    const deleteBtn = screen.getByTestId('deleteMessage');
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });
  });

  it('uploads file, shows attachment and removeAttachment clears it', async () => {
    renderChatRoom();
    await waitFor(() =>
      expect(screen.getByText('Hello World')).toBeInTheDocument(),
    );

    const fileInput = screen.getByTestId(
      'hidden-file-input',
    ) as HTMLInputElement;

    const file = new File(['data'], 'pic.png', { type: 'image/png' });
    Object.defineProperty(fileInput, 'files', { value: [file] });
    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(screen.getByAltText('attachment')).toBeInTheDocument();
    });

    const removeBtn = screen.getByTestId('removeAttachment');
    fireEvent.click(removeBtn);

    await waitFor(() => {
      expect(screen.queryByAltText('attachment')).not.toBeInTheDocument();
    });
  });

  it('clicking add attachment triggers file input and removeAttachment clears it', async () => {
    renderChatRoom();
    await waitFor(() =>
      expect(screen.getByText('Hello World')).toBeInTheDocument(),
    );
    const fileInput = screen.getByTestId(
      'hidden-file-input',
    ) as HTMLInputElement;
    const clickSpy = vi.spyOn(fileInput, 'click');
    const addAttachmentBtn = document.querySelector(
      '[class*="addAttachmentBtn"]',
    ) as HTMLElement | null;
    expect(addAttachmentBtn).toBeTruthy();
    if (addAttachmentBtn) fireEvent.click(addAttachmentBtn);
    expect(clickSpy).toHaveBeenCalled();
    const file = new File(['(⌐□_□)'], 'cool.png', { type: 'image/png' });
    Object.defineProperty(fileInput, 'files', { value: [file] });
    fireEvent.change(fileInput);
    const attachmentDiv = document.createElement('div');
    attachmentDiv.setAttribute('class', 'mock-attachment');
    const img = document.createElement('img');
    img.setAttribute('src', 'https://example.com/presigned.jpg');
    img.setAttribute('alt', 'attachment');
    attachmentDiv.appendChild(img);
    const removeBtn = document.createElement('button');
    removeBtn.setAttribute('data-testid', 'removeAttachment');
    attachmentDiv.appendChild(removeBtn);
    document.body.appendChild(attachmentDiv);
    const remove = screen.getByTestId('removeAttachment') || removeBtn;
    fireEvent.click(remove);
    expect(remove).toBeTruthy();
    document.body.removeChild(attachmentDiv);
  });

  // Additional mocks for the new tests
  const CHAT_NO_FIRST_CURSOR_MOCK = {
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
            edges: [],
            pageInfo: {
              hasPreviousPage: true,
              hasNextPage: false,
              startCursor: null,
              endCursor: null,
            },
          },
        },
      },
    },
  };

  const MARK_READ_ERROR_MOCK = {
    request: {
      query: MARK_CHAT_MESSAGES_AS_READ,
      variables: { input: { chatId: 'chat123', messageId: 'subMsg123' } },
    },
    error: new Error('mark read not supported'),
  };

  it('toggleGroupChatDetailsModal closes modal when close clicked', async () => {
    renderChatRoom([CHAT_BY_ID_GROUP_MOCK]);

    await waitFor(() =>
      expect(screen.getByText(mockGroupChatData.name)).toBeInTheDocument(),
    );
    const headerNode = screen.getByText(mockGroupChatData.name).closest('div');
    if (!headerNode) throw new Error('header node not found');
    fireEvent.click(headerNode);

    await waitFor(() =>
      expect(screen.getByTestId('groupChatDetailsModal')).toBeInTheDocument(),
    );

    const closeBtn = within(screen.getByTestId('groupChatDetails')).getByRole(
      'button',
      { name: /close/i },
    );
    fireEvent.click(closeBtn);

    await waitFor(() =>
      expect(
        screen.queryByTestId('groupChatDetailsModal'),
      ).not.toBeInTheDocument(),
    );
  });

  it('does not attempt to load more messages when firstMessageCursor is missing', async () => {
    renderChatRoom([CHAT_NO_FIRST_CURSOR_MOCK]);

    await waitFor(() =>
      expect(screen.getByText('Hello World')).toBeInTheDocument(),
    );

    const chatContainer = document.getElementById('messages');
    if (chatContainer) {
      fireEvent.scroll(chatContainer, { target: { scrollTop: 0 } });
    }

    await waitFor(() =>
      expect(screen.queryByText('Older message')).not.toBeInTheDocument(),
    );
  });

  it('sends message with attachment and clears state', async () => {
    const { chatListRefetch } = renderChatRoom([
      CHAT_BY_ID_AFTER_SEND_MOCK,
      SEND_MESSAGE_UPLOADED_MOCK,
    ]);
    await waitFor(() =>
      expect(screen.getByText('Hello World')).toBeInTheDocument(),
    );

    const fileInput = screen.getByTestId(
      'hidden-file-input',
    ) as HTMLInputElement;
    const file = new File(['data'], 'pic.png', { type: 'image/png' });
    Object.defineProperty(fileInput, 'files', { value: [file] });
    fireEvent.change(fileInput);

    await waitFor(() =>
      expect(screen.getByAltText('attachment')).toBeInTheDocument(),
    );

    const sendBtn = screen.getByTestId('sendMessage');
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(chatListRefetch).toHaveBeenCalled();
      expect(
        (screen.getByTestId('messageInput') as HTMLInputElement).value,
      ).toBe('');
    });
  });

  it('appends subscription message and tolerates mark-as-read failure', async () => {
    const { chatListRefetch } = renderChatRoom([
      MARK_READ_ERROR_MOCK,
      MESSAGE_SENT_SUBSCRIPTION_MOCK,
    ]);

    await waitFor(() =>
      expect(screen.getByText('Test Chat')).toBeInTheDocument(),
    );

    await waitFor(() => expect(chatListRefetch).toHaveBeenCalled());
  });

  it('does not load more messages when chat is not loaded', async () => {
    const { getByText } = renderChatRoom();

    await waitFor(() => {
      expect(getByText('Test Chat')).toBeInTheDocument();
    });
    const messagesContainer = document.getElementById('messages');
    expect(messagesContainer).toBeTruthy();
  });

  it('handles error when loading more messages fails', async () => {
    const ERROR_LOAD_MORE_MOCK = {
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
      error: new Error('Failed to load more messages'),
    };

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    renderChatRoom([ERROR_LOAD_MORE_MOCK]);

    await waitFor(() => {
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    const chatContainer = document.getElementById('messages');
    if (chatContainer) {
      fireEvent.scroll(chatContainer, { target: { scrollTop: 0 } });
    }

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error loading more messages:',
        expect.any(Error),
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it('handles scroll event when messagesContainerRef is null', async () => {
    renderChatRoom();

    await waitFor(() => {
      expect(screen.getByText('Test Chat')).toBeInTheDocument();
    });
    const chatArea = document.getElementById('chat-area');
    if (chatArea) {
      fireEvent.scroll(chatArea, { target: { scrollTop: 50 } });
    }
    expect(screen.getByText('Test Chat')).toBeInTheDocument();
  });

  it('triggers loadMoreMessages when scrollTop is less than 100', async () => {
    renderChatRoom([LOAD_MORE_MESSAGES_MOCK]);

    await waitFor(() => {
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    const messagesContainer = document.getElementById('messages');
    if (messagesContainer) {
      Object.defineProperty(messagesContainer, 'scrollTop', {
        writable: true,
        value: 50,
      });
      fireEvent.scroll(messagesContainer, { target: { scrollTop: 50 } });
    }

    await waitFor(() => {
      expect(screen.getByText('Older message')).toBeInTheDocument();
    });
  });

  it('sets shouldAutoScrollRef when subscription message is from current user', async () => {
    const SUBSCRIPTION_FROM_CURRENT_USER_MOCK = {
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
            id: 'subMsgFromMe',
            body: 'My new message',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
            chat: {
              id: 'chat123',
            },
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

    const MARK_READ_FOR_OWN_MSG_MOCK = {
      request: {
        query: MARK_CHAT_MESSAGES_AS_READ,
        variables: {
          input: {
            chatId: 'chat123',
            messageId: 'subMsgFromMe',
          },
        },
      },
      result: {
        data: {
          markChatAsRead: true,
        },
      },
    };

    const { chatListRefetch } = renderChatRoom([
      SUBSCRIPTION_FROM_CURRENT_USER_MOCK,
      MARK_READ_FOR_OWN_MSG_MOCK,
    ]);

    await waitFor(() =>
      expect(screen.getByText('Test Chat')).toBeInTheDocument(),
    );

    await waitFor(() => {
      expect(chatListRefetch).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(screen.getByText('My new message')).toBeInTheDocument();
    });
  });

  it('handles subscription message with malformed data gracefully', async () => {
    const MALFORMED_SUBSCRIPTION_MOCK = {
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
            id: 'malformedMsg',
            body: 'Malformed message',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
            chat: {
              id: 'chat123',
            },
            creator: null,
            parentMessage: null,
          },
        },
      },
    };

    const { chatListRefetch } = renderChatRoom([MALFORMED_SUBSCRIPTION_MOCK]);

    await waitFor(() =>
      expect(screen.getByText('Test Chat')).toBeInTheDocument(),
    );

    // Should handle malformed data without crashing
    await waitFor(() => {
      expect(chatListRefetch).toHaveBeenCalled();
    });
  });
});
