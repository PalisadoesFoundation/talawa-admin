import { CHAT_BY_ID, UNREAD_CHATS } from 'GraphQl/Queries/PlugInQueries';
import {
  MARK_CHAT_MESSAGES_AS_READ,
  MESSAGE_SENT_TO_CHAT,
  SEND_MESSAGE_TO_CHAT,
  EDIT_CHAT_MESSAGE,
  DELETE_CHAT_MESSAGE,
} from 'GraphQl/Mutations/OrganizationMutations';

export const FIXED_UTC = new Date(Date.UTC(2023, 0, 1)).toISOString();
export const FIXED_UTC_MINUS_ONE_DAY = new Date(
  Date.UTC(2022, 11, 31),
).toISOString();

const CURRENT_USER = {
  __typename: 'User',
  id: 'user123',
  name: 'Current User',
  avatarMimeType: 'image/jpeg',
  avatarURL: 'https://example.com/user.jpg',
};

const OTHER_USER = {
  __typename: 'User',
  id: 'otherUser123',
  name: 'Other User',
  avatarMimeType: 'image/jpeg',
  avatarURL: 'https://example.com/other.jpg',
};

export const mockChatData = {
  __typename: 'Chat',
  id: 'chat123',
  name: 'Test Chat',
  description: 'Test Description',
  avatarMimeType: 'image/jpeg',
  avatarURL: 'https://example.com/avatar.jpg',
  createdAt: FIXED_UTC,
  updatedAt: FIXED_UTC,
  isGroup: false,
  organization: {
    __typename: 'Organization',
    id: 'org123',
    name: 'Test Org',
    countryCode: 'US',
  },
  creator: {
    __typename: 'User',
    id: 'creator123',
    name: 'Creator Name',
    avatarMimeType: 'image/jpeg',
    avatarURL: 'https://example.com/creator.jpg',
  },
  updater: {
    __typename: 'User',
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
          __typename: 'ChatMember',
          user: {
            __typename: 'User',
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
          __typename: 'ChatMember',
          user: {
            __typename: 'User',
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
          __typename: 'ChatMember',
          user: {
            __typename: 'User',
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
          __typename: 'ChatMessage',
          id: 'msg1',
          body: 'Hello World',
          createdAt: FIXED_UTC,
          updatedAt: FIXED_UTC,
          creator: CURRENT_USER,
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
      first: 15,
      lastMessages: 15,
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
      first: 15,
      lastMessages: 15,
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
        __typename: 'ChatMessage',
        id: 'newMsg123',
        body: 'Test message',
        createdAt: FIXED_UTC,
        updatedAt: FIXED_UTC,
        creator: CURRENT_USER,
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
        __typename: 'ChatMessage',
        id: 'newMsgUploaded',
        body: 'uploaded_obj',
        createdAt: FIXED_UTC,
        updatedAt: FIXED_UTC,
        creator: CURRENT_USER,
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
        __typename: 'ChatMessage',
        id: 'msg1',
        body: 'Edited message',
        createdAt: FIXED_UTC,
        updatedAt: FIXED_UTC,
        creator: CURRENT_USER,
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
        __typename: 'ChatMessage',
        id: 'msg1',
        body: 'Hello World',
        createdAt: FIXED_UTC,
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
        __typename: 'ChatMessage',
        id: 'subMsg123',
        body: 'New message from subscription',
        createdAt: FIXED_UTC,
        updatedAt: FIXED_UTC,
        chat: {
          __typename: 'Chat',
          id: 'chat123',
        },
        creator: OTHER_USER,
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
      first: 15,
      lastMessages: 15,
      beforeMessages: 'start',
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
                createdAt: FIXED_UTC,
                updatedAt: FIXED_UTC,
                creator: OTHER_USER,
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
      first: 15,
      lastMessages: 15,
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
                createdAt: FIXED_UTC,
                updatedAt: FIXED_UTC,
                creator: CURRENT_USER,
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
      first: 15,
      lastMessages: 15,
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
                createdAt: FIXED_UTC,
                updatedAt: FIXED_UTC,
                creator: CURRENT_USER,
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
      first: 15,
      lastMessages: 15,
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
                createdAt: FIXED_UTC,
                updatedAt: FIXED_UTC,
                creator: OTHER_USER,
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
      first: 15,
      lastMessages: 15,
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

// Additional mocks for new tests
export const CHAT_WITH_PARENT_MESSAGE_MOCK = {
  request: {
    query: CHAT_BY_ID,
    variables: {
      input: { id: 'chat123' },
      first: 15,
      lastMessages: 15,
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
                createdAt: FIXED_UTC,
                updatedAt: FIXED_UTC,
                creator: CURRENT_USER,
                parentMessage: {
                  id: 'parent1',
                  body: 'Parent body',
                  createdAt: FIXED_UTC_MINUS_ONE_DAY,
                  creator: OTHER_USER,
                },
              },
            },
          ],
        },
      },
    },
  },
};
