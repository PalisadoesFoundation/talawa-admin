import React from 'react';

import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { MockedProvider, MockSubscriptionLink } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';

import ChatRoom, { MessageImage } from './ChatRoom';
import { StaticMockLink } from 'utils/StaticMockLink';
import { it, vi } from 'vitest';
import useLocalStorage from 'utils/useLocalstorage';
import {
  CHATS_LIST,
  CHAT_BY_ID,
  GROUP_CHAT_LIST,
  UNREAD_CHAT_LIST,
} from 'GraphQl/Queries/PlugInQueries';
import {
  MARK_CHAT_MESSAGES_AS_READ,
  MESSAGE_SENT_TO_CHAT,
  SEND_MESSAGE_TO_CHAT,
} from 'GraphQl/Mutations/OrganizationMutations';

import * as fileValidation from 'utils/fileValidation';
import * as minioUpload from 'utils/MinioUpload';
import * as minioDownload from 'utils/MinioDownload';

import { toast } from 'react-toastify';

// Mock modules with simple functions, not referencing external variables
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('utils/fileValidation', async () => {
  const actual = await import('utils/fileValidation');
  return {
    ...actual,
    validateFile: vi.fn(),
  };
});

/**
 * Unit tests for the ChatRoom component
 *
 * Tests cover component rendering, message functionality (sending/replying),
 * user interactions, GraphQL integration, and provider integrations
 * (Router, Redux, i18n) for both direct and group chats.
 */

const { setItem } = useLocalStorage();

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

export const MESSAGE_SENT_TO_CHAT_MOCK = [
  {
    request: {
      query: MESSAGE_SENT_TO_CHAT,
      variables: {
        userId: null,
      },
    },
    result: {
      data: {
        messageSentToChat: {
          _id: '668ec1f1364e03ac47a151',
          createdAt: '2024-07-10T17:16:33.248Z',
          chatMessageBelongsTo: {
            _id: '1',
          },
          messageContent: 'Test ',
          media: null,
          replyTo: null,
          sender: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: '',
          },
          updatedAt: '2024-07-10',
        },
      },
    },
  },
  {
    request: {
      query: MESSAGE_SENT_TO_CHAT,
      variables: {
        userId: '2',
      },
    },
    result: {
      data: {
        messageSentToChat: {
          _id: '668ec1f1df364e03ac47a151',
          createdAt: '2024-07-10T17:16:33.248Z',
          messageContent: 'Test ',
          media: null,
          chatMessageBelongsTo: {
            _id: '1',
          },
          replyTo: null,
          sender: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: '',
          },
          updatedAt: '2024-07-10',
        },
      },
    },
  },
  {
    request: {
      query: MESSAGE_SENT_TO_CHAT,
      variables: {
        userId: '8',
      },
    },
    result: {
      data: {
        messageSentToChat: {
          _id: '668ec1f1df364e03ac47a151',
          createdAt: '2024-07-10T17:16:33.248Z',
          messageContent: 'Test ',
          media: null,
          chatMessageBelongsTo: {
            _id: '1',
          },
          replyTo: null,
          sender: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: '',
          },
          updatedAt: '2024-07-10',
        },
      },
    },
  },
  {
    request: {
      query: MESSAGE_SENT_TO_CHAT,
      variables: {
        userId: '1',
      },
    },
    result: {
      data: {
        messageSentToChat: {
          _id: '668ec1f13603ac4697a151',
          createdAt: '2024-07-10T17:16:33.248Z',
          messageContent: 'Test ',
          media: null,
          chatMessageBelongsTo: {
            _id: '1',
          },
          replyTo: null,
          sender: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: '',
          },
          updatedAt: '2024-07-10',
        },
      },
    },
  },
];

export const UNREAD_CHAT_LIST_QUERY_MOCK = [
  {
    request: {
      query: UNREAD_CHAT_LIST,
      variables: {},
    },
    result: {
      data: {
        getUnreadChatsByUserId: {
          _id: '1',
          createdAt: '2345678903456',
          isGroup: false,
          creator: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: null,
            email: 'testsuperadmin@example.com',
            createdAt: '2023-04-13T04:53:17.742Z',
            __typename: 'User',
          },
          organization: null,
          name: '',
          messages: [
            {
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
              media: null,
              replyTo: null,
              type: 'STRING',
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
            },
          ],
          users: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
            {
              _id: '2',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              image: '',
            },
          ],
          admins: [],
          unseenMessagesByUsers: JSON.stringify({
            '1': 0,
            '2': 0,
          }),
        },
      },
    },
  },
  {
    request: {
      query: UNREAD_CHAT_LIST,
      variables: {
        id: '8',
      },
    },
    result: {
      data: {
        getUnreadChatsByUserId: {
          _id: '1',
          createdAt: '2345678903456',
          isGroup: false,
          creator: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: null,
            email: 'testsuperadmin@example.com',
            createdAt: '2023-04-13T04:53:17.742Z',
            __typename: 'User',
          },
          organization: null,
          name: '',
          messages: [
            {
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
              media: null,
              replyTo: null,
              type: 'STRING',
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
            },
          ],
          users: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
            {
              _id: '2',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              image: '',
            },
          ],
          admins: [],
          unseenMessagesByUsers: JSON.stringify({
            '1': 0,
            '2': 0,
          }),
        },
      },
    },
  },
  {
    request: {
      query: UNREAD_CHAT_LIST,
      variables: {
        id: '8',
      },
    },
    result: {
      data: {
        getUnreadChatsByUserId: {
          _id: '1',
          createdAt: '2345678903456',
          isGroup: false,
          creator: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: null,
            email: 'testsuperadmin@example.com',
            createdAt: '2023-04-13T04:53:17.742Z',
            __typename: 'User',
          },
          organization: null,
          name: '',
          messages: [
            {
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
              media: null,
              replyTo: null,
              type: 'STRING',
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
            },
          ],
          users: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
            {
              _id: '2',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              image: '',
            },
          ],
          admins: [],
          unseenMessagesByUsers: JSON.stringify({
            '1': 0,
            '2': 0,
          }),
        },
      },
    },
  },
  {
    request: {
      query: UNREAD_CHAT_LIST,
      variables: {},
    },
    result: {
      data: {
        getUnreadChatsByUserId: {
          _id: '1',
          createdAt: '2345678903456',
          isGroup: false,
          creator: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: null,
            email: 'testsuperadmin@example.com',
            createdAt: '2023-04-13T04:53:17.742Z',
            __typename: 'User',
          },
          organization: null,
          name: '',
          messages: [
            {
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
              media: null,
              replyTo: null,
              type: 'STRING',
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
            },
          ],
          users: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
            {
              _id: '2',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              image: '',
            },
          ],
          admins: [],
          unseenMessagesByUsers: JSON.stringify({
            '1': 0,
            '2': 0,
          }),
        },
      },
    },
  },
  {
    request: {
      query: UNREAD_CHAT_LIST,
      variables: {},
    },
    result: {
      data: {
        getUnreadChatsByUserId: {
          _id: '1',
          createdAt: '2345678903456',
          isGroup: false,
          creator: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: null,
            email: 'testsuperadmin@example.com',
            createdAt: '2023-04-13T04:53:17.742Z',
            __typename: 'User',
          },
          organization: null,
          name: '',
          messages: [
            {
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
              media: null,
              replyTo: null,
              type: 'STRING',
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
            },
          ],
          users: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
            {
              _id: '2',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              image: '',
            },
          ],
          admins: [],
          unseenMessagesByUsers: JSON.stringify({
            '1': 0,
            '2': 0,
          }),
        },
      },
    },
  },
  {
    request: {
      query: UNREAD_CHAT_LIST,
      variables: {},
    },
    result: {
      data: {
        getUnreadChatsByUserId: {
          _id: '1',
          createdAt: '2345678903456',
          isGroup: false,
          creator: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: null,
            email: 'testsuperadmin@example.com',
            createdAt: '2023-04-13T04:53:17.742Z',
            __typename: 'User',
          },
          organization: null,
          name: '',
          messages: [
            {
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
              media: null,
              replyTo: null,
              type: 'STRING',
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
            },
          ],
          users: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
            {
              _id: '2',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              image: '',
            },
          ],
          admins: [],
          unseenMessagesByUsers: JSON.stringify({
            '1': 0,
            '2': 0,
          }),
        },
      },
    },
  },
  {
    request: {
      query: UNREAD_CHAT_LIST,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        getUnreadChatsByUserId: {
          _id: '1',
          createdAt: '2345678903456',
          isGroup: false,
          creator: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: null,
            email: 'testsuperadmin@example.com',
            createdAt: '2023-04-13T04:53:17.742Z',
            __typename: 'User',
          },
          organization: null,
          name: '',
          messages: [
            {
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
              media: null,
              replyTo: null,
              type: 'STRING',
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
            },
          ],
          users: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
            {
              _id: '2',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              image: '',
            },
          ],
          admins: [],
          unseenMessagesByUsers: JSON.stringify({
            '1': 0,
            '2': 0,
          }),
        },
      },
    },
  },
  {
    request: {
      query: UNREAD_CHAT_LIST,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        getUnreadChatsByUserId: {
          _id: '1',
          createdAt: '2345678903456',
          isGroup: false,
          creator: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: null,
            email: 'testsuperadmin@example.com',
            createdAt: '2023-04-13T04:53:17.742Z',
            __typename: 'User',
          },
          organization: null,
          name: '',
          messages: [
            {
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
              media: null,
              replyTo: null,
              type: 'STRING',
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
            },
          ],
          users: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
            {
              _id: '2',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              image: '',
            },
          ],
          admins: [],
          unseenMessagesByUsers: JSON.stringify({
            '1': 0,
            '2': 0,
          }),
        },
      },
    },
  },
  {
    request: {
      query: UNREAD_CHAT_LIST,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        getUnreadChatsByUserId: {
          _id: '1',
          createdAt: '2345678903456',
          isGroup: false,
          creator: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: null,
            email: 'testsuperadmin@example.com',
            createdAt: '2023-04-13T04:53:17.742Z',
            __typename: 'User',
          },
          organization: null,
          name: '',
          messages: [
            {
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
              media: null,
              replyTo: null,
              type: 'STRING',
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
            },
          ],
          users: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
            {
              _id: '2',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              image: '',
            },
          ],
          admins: [],
          unseenMessagesByUsers: JSON.stringify({
            '1': 0,
            '2': 0,
          }),
        },
      },
    },
  },
  {
    request: {
      query: UNREAD_CHAT_LIST,
      variables: {
        id: null,
      },
    },
    result: {
      data: {
        getUnreadChatsByUserId: {
          _id: '1',
          createdAt: '2345678903456',
          isGroup: false,
          creator: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: null,
            email: 'testsuperadmin@example.com',
            createdAt: '2023-04-13T04:53:17.742Z',
            __typename: 'User',
          },
          organization: null,
          name: '',
          messages: [
            {
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
              media: null,
              replyTo: null,
              type: 'STRING',
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
            },
          ],
          users: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
            {
              _id: '2',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              image: '',
            },
          ],
          admins: [],
          unseenMessagesByUsers: JSON.stringify({
            '1': 0,
            '2': 0,
          }),
        },
      },
    },
  },
  {
    request: {
      query: UNREAD_CHAT_LIST,
      variables: {
        id: null,
      },
    },
    result: {
      data: {
        getUnreadChatsByUserId: {
          _id: '1',
          createdAt: '2345678903456',
          isGroup: false,
          creator: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: null,
            email: 'testsuperadmin@example.com',
            createdAt: '2023-04-13T04:53:17.742Z',
            __typename: 'User',
          },
          organization: null,
          name: '',
          messages: [
            {
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
              media: null,
              replyTo: null,
              type: 'STRING',
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
            },
          ],
          users: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
            {
              _id: '2',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              image: '',
            },
          ],
          admins: [],
          unseenMessagesByUsers: JSON.stringify({
            '1': 0,
            '2': 0,
          }),
        },
      },
    },
  },
  {
    request: {
      query: UNREAD_CHAT_LIST,
      variables: {
        id: '8',
      },
    },
    result: {
      data: {
        getUnreadChatsByUserId: {
          _id: '1',
          createdAt: '2345678903456',
          isGroup: false,
          creator: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: null,
            email: 'testsuperadmin@example.com',
            createdAt: '2023-04-13T04:53:17.742Z',
            __typename: 'User',
          },
          organization: null,
          name: '',
          messages: [
            {
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
              media: null,
              replyTo: null,
              type: 'STRING',
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
            },
          ],
          users: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
            {
              _id: '2',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              image: '',
            },
          ],
          admins: [],
          unseenMessagesByUsers: JSON.stringify({
            '1': 0,
            '2': 0,
          }),
        },
      },
    },
  },
  {
    request: {
      query: UNREAD_CHAT_LIST,
      variables: {
        id: '8',
      },
    },
    result: {
      data: {
        getUnreadChatsByUserId: {
          _id: '1',
          createdAt: '2345678903456',
          isGroup: false,
          creator: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: null,
            email: 'testsuperadmin@example.com',
            createdAt: '2023-04-13T04:53:17.742Z',
            __typename: 'User',
          },
          organization: null,
          name: '',
          messages: [
            {
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
              media: null,
              replyTo: null,
              type: 'STRING',
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
            },
          ],
          users: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
            {
              _id: '2',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              image: '',
            },
          ],
          admins: [],
          unseenMessagesByUsers: JSON.stringify({
            '1': 0,
            '2': 0,
          }),
        },
      },
    },
  },
  {
    request: {
      query: UNREAD_CHAT_LIST,
      variables: {
        id: '8',
      },
    },
    result: {
      data: {
        getUnreadChatsByUserId: {
          _id: '1',
          createdAt: '2345678903456',
          isGroup: false,
          creator: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: null,
            email: 'testsuperadmin@example.com',
            createdAt: '2023-04-13T04:53:17.742Z',
            __typename: 'User',
          },
          organization: null,
          name: '',
          messages: [
            {
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
              media: null,
              replyTo: null,
              type: 'STRING',
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
            },
          ],
          users: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
            {
              _id: '2',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              image: '',
            },
          ],
          admins: [],
          unseenMessagesByUsers: JSON.stringify({
            '1': 0,
            '2': 0,
          }),
        },
      },
    },
  },
];

export const GROUP_CHAT_LIST_QUERY_MOCK = [
  {
    request: {
      query: GROUP_CHAT_LIST,
      variables: {
        id: '',
      },
    },
    result: {
      data: {
        getGroupChatsByUserId: {
          _id: '65844efc814dd4003db811c4',
          isGroup: true,
          creator: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: null,
            email: 'testsuperadmin@example.com',
            createdAt: '2023-04-13T04:53:17.742Z',
            __typename: 'User',
          },
          organization: {
            _id: 'pw3ertyuiophgfre45678',
            name: 'rtyu',
          },
          createdAt: '2345678903456',
          name: 'Test Group Chat',
          messages: [
            {
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
              media: null,
              replyTo: null,
              type: 'STRING',
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
            },
          ],
          users: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
            {
              _id: '2',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              image: '',
            },
            {
              _id: '3',
              firstName: 'Test',
              lastName: 'User1',
              email: 'test1@example.com',
              image: '',
            },
            {
              _id: '4',
              firstName: 'Test',
              lastName: 'User2',
              email: 'test2@example.com',
              image: '',
            },
            {
              _id: '5',
              firstName: 'Test',
              lastName: 'User4',
              email: 'test4@example.com',
              image: '',
            },
          ],
          admins: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
          ],
          unseenMessagesByUsers: JSON.stringify({
            '1': 1,
            '2': 1,
            '3': 1,
            '4': 1,
            '5': 1,
          }),
        },
      },
    },
  },
  {
    request: {
      query: GROUP_CHAT_LIST,
      variables: {},
    },
    result: {
      data: {
        getGroupChatsByUserId: {
          _id: '65844efc814dd4003db811c4',
          isGroup: true,
          creator: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: null,
            email: 'testsuperadmin@example.com',
            createdAt: '2023-04-13T04:53:17.742Z',
            __typename: 'User',
          },
          organization: {
            _id: 'pw3ertyuiophgfre45678',
            name: 'rtyu',
          },
          createdAt: '2345678903456',
          name: 'Test Group Chat',
          messages: [
            {
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
              media: null,
              replyTo: null,
              type: 'STRING',
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
            },
          ],
          users: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
            {
              _id: '2',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              image: '',
            },
            {
              _id: '3',
              firstName: 'Test',
              lastName: 'User1',
              email: 'test1@example.com',
              image: '',
            },
            {
              _id: '4',
              firstName: 'Test',
              lastName: 'User2',
              email: 'test2@example.com',
              image: '',
            },
            {
              _id: '5',
              firstName: 'Test',
              lastName: 'User4',
              email: 'test4@example.com',
              image: '',
            },
          ],
          admins: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
          ],
          unseenMessagesByUsers: JSON.stringify({
            '1': 1,
            '2': 1,
            '3': 1,
            '4': 1,
            '5': 1,
          }),
        },
      },
    },
  },
  {
    request: {
      query: GROUP_CHAT_LIST,
      variables: {},
    },
    result: {
      data: {
        getGroupChatsByUserId: {
          _id: '65844efc814dd4003db811c4',
          isGroup: true,
          creator: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: null,
            email: 'testsuperadmin@example.com',
            createdAt: '2023-04-13T04:53:17.742Z',
            __typename: 'User',
          },
          organization: {
            _id: 'pw3ertyuiophgfre45678',
            name: 'rtyu',
          },
          createdAt: '2345678903456',
          name: 'Test Group Chat',
          messages: [
            {
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
              media: null,
              replyTo: null,
              type: 'STRING',
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
            },
          ],
          users: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
            {
              _id: '2',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              image: '',
            },
            {
              _id: '3',
              firstName: 'Test',
              lastName: 'User1',
              email: 'test1@example.com',
              image: '',
            },
            {
              _id: '4',
              firstName: 'Test',
              lastName: 'User2',
              email: 'test2@example.com',
              image: '',
            },
            {
              _id: '5',
              firstName: 'Test',
              lastName: 'User4',
              email: 'test4@example.com',
              image: '',
            },
          ],
          admins: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
          ],
          unseenMessagesByUsers: JSON.stringify({
            '1': 1,
            '2': 1,
            '3': 1,
            '4': 1,
            '5': 1,
          }),
        },
      },
    },
  },
  {
    request: {
      query: GROUP_CHAT_LIST,
      variables: {},
    },
    result: {
      data: {
        getGroupChatsByUserId: {
          _id: '65844efc814dd4003db811c4',
          isGroup: true,
          creator: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: null,
            email: 'testsuperadmin@example.com',
            createdAt: '2023-04-13T04:53:17.742Z',
            __typename: 'User',
          },
          organization: {
            _id: 'pw3ertyuiophgfre45678',
            name: 'rtyu',
          },
          createdAt: '2345678903456',
          name: 'Test Group Chat',
          messages: [
            {
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
              media: null,
              replyTo: null,
              type: 'STRING',
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
            },
          ],
          users: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
            {
              _id: '2',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              image: '',
            },
            {
              _id: '3',
              firstName: 'Test',
              lastName: 'User1',
              email: 'test1@example.com',
              image: '',
            },
            {
              _id: '4',
              firstName: 'Test',
              lastName: 'User2',
              email: 'test2@example.com',
              image: '',
            },
            {
              _id: '5',
              firstName: 'Test',
              lastName: 'User4',
              email: 'test4@example.com',
              image: '',
            },
          ],
          admins: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
          ],
          unseenMessagesByUsers: JSON.stringify({
            '1': 1,
            '2': 1,
            '3': 1,
            '4': 1,
            '5': 1,
          }),
        },
      },
    },
  },
  {
    request: {
      query: GROUP_CHAT_LIST,
      variables: {},
    },
    result: {
      data: {
        getGroupChatsByUserId: {
          _id: '65844efc814dd4003db811c4',
          isGroup: true,
          creator: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: null,
            email: 'testsuperadmin@example.com',
            createdAt: '2023-04-13T04:53:17.742Z',
            __typename: 'User',
          },
          organization: {
            _id: 'pw3ertyuiophgfre45678',
            name: 'rtyu',
          },
          createdAt: '2345678903456',
          name: 'Test Group Chat',
          messages: [
            {
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
              media: null,
              replyTo: null,
              type: 'STRING',
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
            },
          ],
          users: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
            {
              _id: '2',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              image: '',
            },
            {
              _id: '3',
              firstName: 'Test',
              lastName: 'User1',
              email: 'test1@example.com',
              image: '',
            },
            {
              _id: '4',
              firstName: 'Test',
              lastName: 'User2',
              email: 'test2@example.com',
              image: '',
            },
            {
              _id: '5',
              firstName: 'Test',
              lastName: 'User4',
              email: 'test4@example.com',
              image: '',
            },
          ],
          admins: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
          ],
          unseenMessagesByUsers: JSON.stringify({
            '1': 1,
            '2': 1,
            '3': 1,
            '4': 1,
            '5': 1,
          }),
        },
      },
    },
  },
  {
    request: {
      query: GROUP_CHAT_LIST,
      variables: {
        id: null,
      },
    },
    result: {
      data: {
        getGroupChatsByUserId: {
          _id: '65844efc814dd4003db811c4',
          isGroup: true,
          creator: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: null,
            email: 'testsuperadmin@example.com',
            createdAt: '2023-04-13T04:53:17.742Z',
            __typename: 'User',
          },
          organization: {
            _id: 'pw3ertyuiophgfre45678',
            name: 'rtyu',
          },
          createdAt: '2345678903456',
          name: 'Test Group Chat',
          messages: [
            {
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
              media: null,
              replyTo: null,
              type: 'STRING',
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
            },
          ],
          users: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
            {
              _id: '2',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              image: '',
            },
            {
              _id: '3',
              firstName: 'Test',
              lastName: 'User1',
              email: 'test1@example.com',
              image: '',
            },
            {
              _id: '4',
              firstName: 'Test',
              lastName: 'User2',
              email: 'test2@example.com',
              image: '',
            },
            {
              _id: '5',
              firstName: 'Test',
              lastName: 'User4',
              email: 'test4@example.com',
              image: '',
            },
          ],
          admins: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
          ],
          unseenMessagesByUsers: JSON.stringify({
            '1': 1,
            '2': 1,
            '3': 1,
            '4': 1,
            '5': 1,
          }),
        },
      },
    },
  },
  {
    request: {
      query: GROUP_CHAT_LIST,
      variables: {
        id: null,
      },
    },
    result: {
      data: {
        getGroupChatsByUserId: {
          _id: '65844efc814dd4003db811c4',
          isGroup: true,
          creator: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: null,
            email: 'testsuperadmin@example.com',
            createdAt: '2023-04-13T04:53:17.742Z',
            __typename: 'User',
          },
          organization: {
            _id: 'pw3ertyuiophgfre45678',
            name: 'rtyu',
          },
          createdAt: '2345678903456',
          name: 'Test Group Chat',
          messages: [
            {
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
              media: null,
              replyTo: null,
              type: 'STRING',
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
            },
          ],
          users: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
            {
              _id: '2',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              image: '',
            },
            {
              _id: '3',
              firstName: 'Test',
              lastName: 'User1',
              email: 'test1@example.com',
              image: '',
            },
            {
              _id: '4',
              firstName: 'Test',
              lastName: 'User2',
              email: 'test2@example.com',
              image: '',
            },
            {
              _id: '5',
              firstName: 'Test',
              lastName: 'User4',
              email: 'test4@example.com',
              image: '',
            },
          ],
          admins: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
          ],
          unseenMessagesByUsers: JSON.stringify({
            '1': 1,
            '2': 1,
            '3': 1,
            '4': 1,
            '5': 1,
          }),
        },
      },
    },
  },
  {
    request: {
      query: GROUP_CHAT_LIST,
      variables: {
        id: null,
      },
    },
    result: {
      data: {
        getGroupChatsByUserId: {
          _id: '65844efc814dd4003db811c4',
          isGroup: true,
          creator: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: null,
            email: 'testsuperadmin@example.com',
            createdAt: '2023-04-13T04:53:17.742Z',
            __typename: 'User',
          },
          organization: {
            _id: 'pw3ertyuiophgfre45678',
            name: 'rtyu',
          },
          createdAt: '2345678903456',
          name: 'Test Group Chat',
          messages: [
            {
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
              media: null,
              replyTo: null,
              type: 'STRING',
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
            },
          ],
          users: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
            {
              _id: '2',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              image: '',
            },
            {
              _id: '3',
              firstName: 'Test',
              lastName: 'User1',
              email: 'test1@example.com',
              image: '',
            },
            {
              _id: '4',
              firstName: 'Test',
              lastName: 'User2',
              email: 'test2@example.com',
              image: '',
            },
            {
              _id: '5',
              firstName: 'Test',
              lastName: 'User4',
              email: 'test4@example.com',
              image: '',
            },
          ],
          admins: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
          ],
          unseenMessagesByUsers: JSON.stringify({
            '1': 1,
            '2': 1,
            '3': 1,
            '4': 1,
            '5': 1,
          }),
        },
      },
    },
  },
];

export const CHAT_BY_ID_QUERY_MOCK = [
  {
    request: {
      query: CHAT_BY_ID,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        chatById: {
          _id: '1',
          createdAt: '2345678903456',
          isGroup: false,
          creator: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: null,
            email: 'testsuperadmin@example.com',
            createdAt: '2023-04-13T04:53:17.742Z',
            __typename: 'User',
          },
          organization: null,
          name: '',
          messages: [
            {
              _id: '4',
              createdAt: '345678908765',
              messageContent: 'Hello',
              media: null,
              replyTo: null,
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
            },
          ],
          users: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
            {
              _id: '2',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              image: '',
            },
          ],
          admins: [],
          unseenMessagesByUsers: {
            '1': 0,
            '2': 0,
          },
        },
      },
    },
  },
  {
    request: {
      query: CHAT_BY_ID,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        chatById: {
          _id: '1',
          isGroup: false,
          creator: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: null,
            email: 'testsuperadmin@example.com',
            createdAt: '2023-04-13T04:53:17.742Z',
            __typename: 'User',
          },
          organization: null,
          name: '',
          createdAt: '2345678903456',
          messages: [
            {
              _id: '4',
              createdAt: '345678908765',
              messageContent: 'Hello',
              media: null,
              replyTo: null,
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
            },
          ],
          users: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
            {
              _id: '2',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              image: '',
            },
          ],
          admins: [],
          unseenMessagesByUsers: {
            '1': 0,
            '2': 0,
          },
        },
      },
    },
  },
  {
    request: {
      query: CHAT_BY_ID,
      variables: {
        id: '',
      },
    },
    result: {
      data: {
        chatById: {
          _id: '1',
          isGroup: false,
          creator: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: null,
            email: 'testsuperadmin@example.com',
            createdAt: '2023-04-13T04:53:17.742Z',
            __typename: 'User',
          },
          organization: null,
          name: '',
          createdAt: '2345678903456',
          messages: [
            {
              _id: '4',
              createdAt: '345678908765',
              messageContent: 'Hello',
              media: null,
              replyTo: null,
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
            },
          ],
          users: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
            {
              _id: '2',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              image: '',
            },
          ],
          admins: [],
          unseenMessagesByUsers: {
            '1': 0,
            '2': 0,
          },
        },
      },
    },
  },
];

export const CHATS_LIST_MOCK = [
  {
    request: {
      query: CHATS_LIST,
      variables: {
        id: '8',
      },
    },
    result: {
      data: {
        chatsByUserId: [
          {
            _id: '65844efc814dd40fgh03db811c4',
            isGroup: true,
            creator: {
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
              image: null,
              email: 'testsuperadmin@example.com',
              createdAt: '2023-04-13T04:53:17.742Z',
              __typename: 'User',
            },
            organization: {
              _id: 'pw3ertyuiophgfre45678',
              name: 'rtyu',
            },
            createdAt: '2345678903456',
            name: 'Test Group Chat',
            messages: [
              {
                _id: '345678',
                createdAt: '345678908765',
                messageContent: 'Hello',
                media: null,
                replyTo: null,
                sender: {
                  _id: '2',
                  firstName: 'Test',
                  lastName: 'User',
                  email: 'test@example.com',
                  image: '',
                },
              },
            ],
            users: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
              {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
              {
                _id: '3',
                firstName: 'Test',
                lastName: 'User1',
                email: 'test1@example.com',
                image: '',
              },
              {
                _id: '4',
                firstName: 'Test',
                lastName: 'User2',
                email: 'test2@example.com',
                image: '',
              },
              {
                _id: '5',
                firstName: 'Test',
                lastName: 'User4',
                email: 'test4@example.com',
                image: '',
              },
            ],
            admins: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
            ],
            unseenMessagesByUsers: {
              '1': 0,
              '2': 0,
              '3': 0,
              '4': 0,
              '5': 0,
            },
          },
          {
            _id: '65844efc814ddgh4003db811c4',
            isGroup: true,
            creator: {
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
              image: null,
              email: 'testsuperadmin@example.com',
              createdAt: '2023-04-13T04:53:17.742Z',
              __typename: 'User',
            },
            organization: {
              _id: 'pw3ertyuiophgfre45678',
              name: 'rtyu',
            },
            createdAt: '2345678903456',
            name: 'Test Group Chat',
            messages: [
              {
                _id: '345678',
                createdAt: '345678908765',
                messageContent: 'Hello',
                media: null,
                replyTo: null,
                sender: {
                  _id: '2',
                  firstName: 'Test',
                  lastName: 'User',
                  email: 'test@example.com',
                  image: '',
                },
              },
            ],
            users: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
              {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
              {
                _id: '3',
                firstName: 'Test',
                lastName: 'User1',
                email: 'test1@example.com',
                image: '',
              },
              {
                _id: '4',
                firstName: 'Test',
                lastName: 'User2',
                email: 'test2@example.com',
                image: '',
              },
              {
                _id: '5',
                firstName: 'Test',
                lastName: 'User4',
                email: 'test4@example.com',
                image: '',
              },
            ],
            unseenMessagesByUsers: {
              '1': 0,
              '2': 0,
              '3': 0,
              '4': 0,
              '5': 0,
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: CHATS_LIST,
      variables: {
        id: '8',
      },
    },
    result: {
      data: {
        chatsByUserId: [
          {
            _id: '65844efc814dd40fgh03db811c4',
            isGroup: true,
            creator: {
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
              image: null,
              email: 'testsuperadmin@example.com',
              createdAt: '2023-04-13T04:53:17.742Z',
              __typename: 'User',
            },
            organization: {
              _id: 'pw3ertyuiophgfre45678',
              name: 'rtyu',
            },
            createdAt: '2345678903456',
            name: 'Test Group Chat',
            messages: [
              {
                _id: '345678',
                createdAt: '345678908765',
                messageContent: 'Hello',
                media: null,
                replyTo: null,
                sender: {
                  _id: '2',
                  firstName: 'Test',
                  lastName: 'User',
                  email: 'test@example.com',
                  image: '',
                },
              },
            ],
            users: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
              {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
              {
                _id: '3',
                firstName: 'Test',
                lastName: 'User1',
                email: 'test1@example.com',
                image: '',
              },
              {
                _id: '4',
                firstName: 'Test',
                lastName: 'User2',
                email: 'test2@example.com',
                image: '',
              },
              {
                _id: '5',
                firstName: 'Test',
                lastName: 'User4',
                email: 'test4@example.com',
                image: '',
              },
            ],
            admins: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
            ],
            unseenMessagesByUsers: {
              '1': 0,
              '2': 0,
              '3': 0,
              '4': 0,
              '5': 0,
            },
          },
          {
            _id: '65844efc814ddgh4003db811c4',
            isGroup: true,
            creator: {
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
              image: null,
              email: 'testsuperadmin@example.com',
              createdAt: '2023-04-13T04:53:17.742Z',
              __typename: 'User',
            },
            organization: {
              _id: 'pw3ertyuiophgfre45678',
              name: 'rtyu',
            },
            createdAt: '2345678903456',
            name: 'Test Group Chat',
            messages: [
              {
                _id: '345678',
                createdAt: '345678908765',
                messageContent: 'Hello',
                media: null,
                replyTo: null,
                sender: {
                  _id: '2',
                  firstName: 'Test',
                  lastName: 'User',
                  email: 'test@example.com',
                  image: '',
                },
              },
            ],
            users: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
              {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
              {
                _id: '3',
                firstName: 'Test',
                lastName: 'User1',
                email: 'test1@example.com',
                image: '',
              },
              {
                _id: '4',
                firstName: 'Test',
                lastName: 'User2',
                email: 'test2@example.com',
                image: '',
              },
              {
                _id: '5',
                firstName: 'Test',
                lastName: 'User4',
                email: 'test4@example.com',
                image: '',
              },
            ],
            admins: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
            ],
            unseenMessagesByUsers: {
              '1': 0,
              '2': 0,
              '3': 0,
              '4': 0,
              '5': 0,
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: CHATS_LIST,
      variables: {
        id: '8',
      },
    },
    result: {
      data: {
        chatsByUserId: [
          {
            _id: '65844efc814dd40fgh03db811c4',
            isGroup: true,
            creator: {
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
              image: null,
              email: 'testsuperadmin@example.com',
              createdAt: '2023-04-13T04:53:17.742Z',
              __typename: 'User',
            },
            organization: {
              _id: 'pw3ertyuiophgfre45678',
              name: 'rtyu',
            },
            createdAt: '2345678903456',
            name: 'Test Group Chat',
            messages: [
              {
                _id: '345678',
                createdAt: '345678908765',
                messageContent: 'Hello',
                media: null,
                replyTo: null,
                sender: {
                  _id: '2',
                  firstName: 'Test',
                  lastName: 'User',
                  email: 'test@example.com',
                  image: '',
                },
              },
            ],
            users: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
              {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
              {
                _id: '3',
                firstName: 'Test',
                lastName: 'User1',
                email: 'test1@example.com',
                image: '',
              },
              {
                _id: '4',
                firstName: 'Test',
                lastName: 'User2',
                email: 'test2@example.com',
                image: '',
              },
              {
                _id: '5',
                firstName: 'Test',
                lastName: 'User4',
                email: 'test4@example.com',
                image: '',
              },
            ],
            admins: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
            ],
            unseenMessagesByUsers: {
              '1': 0,
              '2': 0,
              '3': 0,
              '4': 0,
              '5': 0,
            },
          },
          {
            _id: '65844efc814ddgh4003db811c4',
            isGroup: true,
            creator: {
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
              image: null,
              email: 'testsuperadmin@example.com',
              createdAt: '2023-04-13T04:53:17.742Z',
              __typename: 'User',
            },
            organization: {
              _id: 'pw3ertyuiophgfre45678',
              name: 'rtyu',
            },
            createdAt: '2345678903456',
            name: 'Test Group Chat',
            messages: [
              {
                _id: '345678',
                createdAt: '345678908765',
                messageContent: 'Hello',
                media: null,
                replyTo: null,
                sender: {
                  _id: '2',
                  firstName: 'Test',
                  lastName: 'User',
                  email: 'test@example.com',
                  image: '',
                },
              },
            ],
            users: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
              {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
              {
                _id: '3',
                firstName: 'Test',
                lastName: 'User1',
                email: 'test1@example.com',
                image: '',
              },
              {
                _id: '4',
                firstName: 'Test',
                lastName: 'User2',
                email: 'test2@example.com',
                image: '',
              },
              {
                _id: '5',
                firstName: 'Test',
                lastName: 'User4',
                email: 'test4@example.com',
                image: '',
              },
            ],
            admins: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
            ],
            unseenMessagesByUsers: {
              '1': 0,
              '2': 0,
              '3': 0,
              '4': 0,
              '5': 0,
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: CHATS_LIST,
      variables: {
        id: null,
      },
    },
    result: {
      data: {
        chatsByUserId: [
          {
            _id: '65844efc814dd40fgh03db811c4',
            isGroup: true,
            creator: {
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
              image: null,
              email: 'testsuperadmin@example.com',
              createdAt: '2023-04-13T04:53:17.742Z',
              __typename: 'User',
            },
            organization: {
              _id: 'pw3ertyuiophgfre45678',
              name: 'rtyu',
            },
            createdAt: '2345678903456',
            name: 'Test Group Chat',
            messages: [
              {
                _id: '345678',
                createdAt: '345678908765',
                messageContent: 'Hello',
                media: null,
                replyTo: null,
                sender: {
                  _id: '2',
                  firstName: 'Test',
                  lastName: 'User',
                  email: 'test@example.com',
                  image: '',
                },
              },
            ],
            users: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
              {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
              {
                _id: '3',
                firstName: 'Test',
                lastName: 'User1',
                email: 'test1@example.com',
                image: '',
              },
              {
                _id: '4',
                firstName: 'Test',
                lastName: 'User2',
                email: 'test2@example.com',
                image: '',
              },
              {
                _id: '5',
                firstName: 'Test',
                lastName: 'User4',
                email: 'test4@example.com',
                image: '',
              },
            ],
            admins: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
            ],
            unseenMessagesByUsers: {
              '1': 0,
              '2': 0,
              '3': 0,
              '4': 0,
              '5': 0,
            },
          },
          {
            _id: '65844efc814ddgh4003db811c4',
            isGroup: true,
            creator: {
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
              image: null,
              email: 'testsuperadmin@example.com',
              createdAt: '2023-04-13T04:53:17.742Z',
              __typename: 'User',
            },
            organization: {
              _id: 'pw3ertyuiophgfre45678',
              name: 'rtyu',
            },
            createdAt: '2345678903456',
            name: 'Test Group Chat',
            messages: [
              {
                _id: '345678',
                createdAt: '345678908765',
                messageContent: 'Hello',
                media: null,
                replyTo: null,
                sender: {
                  _id: '2',
                  firstName: 'Test',
                  lastName: 'User',
                  email: 'test@example.com',
                  image: '',
                },
              },
            ],
            users: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
              {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
              {
                _id: '3',
                firstName: 'Test',
                lastName: 'User1',
                email: 'test1@example.com',
                image: '',
              },
              {
                _id: '4',
                firstName: 'Test',
                lastName: 'User2',
                email: 'test2@example.com',
                image: '',
              },
              {
                _id: '5',
                firstName: 'Test',
                lastName: 'User4',
                email: 'test4@example.com',
                image: '',
              },
            ],
            admins: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
            ],
            unseenMessagesByUsers: {
              '1': 0,
              '2': 0,
              '3': 0,
              '4': 0,
              '5': 0,
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: CHATS_LIST,
      variables: {
        id: null,
      },
    },
    result: {
      data: {
        chatsByUserId: [
          {
            _id: '65844efc814dd40fgh03db811c4',
            isGroup: true,
            creator: {
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
              image: null,
              email: 'testsuperadmin@example.com',
              createdAt: '2023-04-13T04:53:17.742Z',
              __typename: 'User',
            },
            organization: {
              _id: 'pw3ertyuiophgfre45678',
              name: 'rtyu',
            },
            createdAt: '2345678903456',
            name: 'Test Group Chat',
            messages: [
              {
                _id: '345678',
                createdAt: '345678908765',
                messageContent: 'Hello',
                media: null,
                replyTo: null,
                sender: {
                  _id: '2',
                  firstName: 'Test',
                  lastName: 'User',
                  email: 'test@example.com',
                  image: '',
                },
              },
            ],
            users: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
              {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
              {
                _id: '3',
                firstName: 'Test',
                lastName: 'User1',
                email: 'test1@example.com',
                image: '',
              },
              {
                _id: '4',
                firstName: 'Test',
                lastName: 'User2',
                email: 'test2@example.com',
                image: '',
              },
              {
                _id: '5',
                firstName: 'Test',
                lastName: 'User4',
                email: 'test4@example.com',
                image: '',
              },
            ],
            admins: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
            ],
            unseenMessagesByUsers: {
              '1': 0,
              '2': 0,
              '3': 0,
              '4': 0,
              '5': 0,
            },
          },
          {
            _id: '65844efc814ddgh4003db811c4',
            isGroup: true,
            creator: {
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
              image: null,
              email: 'testsuperadmin@example.com',
              createdAt: '2023-04-13T04:53:17.742Z',
              __typename: 'User',
            },
            organization: {
              _id: 'pw3ertyuiophgfre45678',
              name: 'rtyu',
            },
            createdAt: '2345678903456',
            name: 'Test Group Chat',
            messages: [
              {
                _id: '345678',
                createdAt: '345678908765',
                messageContent: 'Hello',
                media: null,
                replyTo: null,
                sender: {
                  _id: '2',
                  firstName: 'Test',
                  lastName: 'User',
                  email: 'test@example.com',
                  image: '',
                },
              },
            ],
            users: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
              {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
              {
                _id: '3',
                firstName: 'Test',
                lastName: 'User1',
                email: 'test1@example.com',
                image: '',
              },
              {
                _id: '4',
                firstName: 'Test',
                lastName: 'User2',
                email: 'test2@example.com',
                image: '',
              },
              {
                _id: '5',
                firstName: 'Test',
                lastName: 'User4',
                email: 'test4@example.com',
                image: '',
              },
            ],
            admins: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
            ],
            unseenMessagesByUsers: {
              '1': 0,
              '2': 0,
              '3': 0,
              '4': 0,
              '5': 0,
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: CHATS_LIST,
      variables: {
        id: null,
      },
    },
    result: {
      data: {
        chatsByUserId: [
          {
            _id: '65844efc814dd40fgh03db811c4',
            isGroup: true,
            creator: {
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
              image: null,
              email: 'testsuperadmin@example.com',
              createdAt: '2023-04-13T04:53:17.742Z',
              __typename: 'User',
            },
            organization: {
              _id: 'pw3ertyuiophgfre45678',
              name: 'rtyu',
            },
            createdAt: '2345678903456',
            name: 'Test Group Chat',
            messages: [
              {
                _id: '345678',
                createdAt: '345678908765',
                messageContent: 'Hello',
                media: null,
                replyTo: null,
                sender: {
                  _id: '2',
                  firstName: 'Test',
                  lastName: 'User',
                  email: 'test@example.com',
                  image: '',
                },
              },
            ],
            users: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
              {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
              {
                _id: '3',
                firstName: 'Test',
                lastName: 'User1',
                email: 'test1@example.com',
                image: '',
              },
              {
                _id: '4',
                firstName: 'Test',
                lastName: 'User2',
                email: 'test2@example.com',
                image: '',
              },
              {
                _id: '5',
                firstName: 'Test',
                lastName: 'User4',
                email: 'test4@example.com',
                image: '',
              },
            ],
            admins: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
            ],
            unseenMessagesByUsers: {
              '1': 0,
              '2': 0,
              '3': 0,
              '4': 0,
              '5': 0,
            },
          },
          {
            _id: '65844efc814ddgh4003db811c4',
            isGroup: true,
            creator: {
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
              image: null,
              email: 'testsuperadmin@example.com',
              createdAt: '2023-04-13T04:53:17.742Z',
              __typename: 'User',
            },
            organization: {
              _id: 'pw3ertyuiophgfre45678',
              name: 'rtyu',
            },
            createdAt: '2345678903456',
            name: 'Test Group Chat',
            messages: [
              {
                _id: '345678',
                createdAt: '345678908765',
                messageContent: 'Hello',
                media: null,
                replyTo: null,
                sender: {
                  _id: '2',
                  firstName: 'Test',
                  lastName: 'User',
                  email: 'test@example.com',
                  image: '',
                },
              },
            ],
            users: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
              {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
              {
                _id: '3',
                firstName: 'Test',
                lastName: 'User1',
                email: 'test1@example.com',
                image: '',
              },
              {
                _id: '4',
                firstName: 'Test',
                lastName: 'User2',
                email: 'test2@example.com',
                image: '',
              },
              {
                _id: '5',
                firstName: 'Test',
                lastName: 'User4',
                email: 'test4@example.com',
                image: '',
              },
            ],
            admins: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
            ],
            unseenMessagesByUsers: {
              '1': 0,
              '2': 0,
              '3': 0,
              '4': 0,
              '5': 0,
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: CHATS_LIST,
      variables: {
        id: null,
      },
    },
    result: {
      data: {
        chatsByUserId: [
          {
            _id: '65844efc814dd40fgh03db811c4',
            isGroup: true,
            creator: {
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
              image: null,
              email: 'testsuperadmin@example.com',
              createdAt: '2023-04-13T04:53:17.742Z',
              __typename: 'User',
            },
            organization: {
              _id: 'pw3ertyuiophgfre45678',
              name: 'rtyu',
            },
            createdAt: '2345678903456',
            name: 'Test Group Chat',
            messages: [
              {
                _id: '345678',
                createdAt: '345678908765',
                messageContent: 'Hello',
                media: null,
                replyTo: null,
                sender: {
                  _id: '2',
                  firstName: 'Test',
                  lastName: 'User',
                  email: 'test@example.com',
                  image: '',
                },
              },
            ],
            users: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
              {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
              {
                _id: '3',
                firstName: 'Test',
                lastName: 'User1',
                email: 'test1@example.com',
                image: '',
              },
              {
                _id: '4',
                firstName: 'Test',
                lastName: 'User2',
                email: 'test2@example.com',
                image: '',
              },
              {
                _id: '5',
                firstName: 'Test',
                lastName: 'User4',
                email: 'test4@example.com',
                image: '',
              },
            ],
            admins: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
            ],
            unseenMessagesByUsers: {
              '1': 0,
              '2': 0,
              '3': 0,
              '4': 0,
              '5': 0,
            },
          },
          {
            _id: '65844efc814ddgh4003db811c4',
            isGroup: true,
            creator: {
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
              image: null,
              email: 'testsuperadmin@example.com',
              createdAt: '2023-04-13T04:53:17.742Z',
              __typename: 'User',
            },
            organization: {
              _id: 'pw3ertyuiophgfre45678',
              name: 'rtyu',
            },
            createdAt: '2345678903456',
            name: 'Test Group Chat',
            messages: [
              {
                _id: '345678',
                createdAt: '345678908765',
                messageContent: 'Hello',
                media: null,
                replyTo: null,
                sender: {
                  _id: '2',
                  firstName: 'Test',
                  lastName: 'User',
                  email: 'test@example.com',
                  image: '',
                },
              },
            ],
            users: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
              {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
              {
                _id: '3',
                firstName: 'Test',
                lastName: 'User1',
                email: 'test1@example.com',
                image: '',
              },
              {
                _id: '4',
                firstName: 'Test',
                lastName: 'User2',
                email: 'test2@example.com',
                image: '',
              },
              {
                _id: '5',
                firstName: 'Test',
                lastName: 'User4',
                email: 'test4@example.com',
                image: '',
              },
            ],
            admins: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
            ],
            unseenMessagesByUsers: {
              '1': 0,
              '2': 0,
              '3': 0,
              '4': 0,
              '5': 0,
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: CHATS_LIST,
      variables: {
        id: null,
      },
    },
    result: {
      data: {
        chatsByUserId: [
          {
            _id: '65844efc814dd40fgh03db811c4',
            isGroup: true,
            creator: {
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
              image: null,
              email: 'testsuperadmin@example.com',
              createdAt: '2023-04-13T04:53:17.742Z',
              __typename: 'User',
            },
            organization: {
              _id: 'pw3ertyuiophgfre45678',
              name: 'rtyu',
            },
            createdAt: '2345678903456',
            name: 'Test Group Chat',
            messages: [
              {
                _id: '345678',
                createdAt: '345678908765',
                messageContent: 'Hello',
                media: null,
                replyTo: null,
                sender: {
                  _id: '2',
                  firstName: 'Test',
                  lastName: 'User',
                  email: 'test@example.com',
                  image: '',
                },
              },
            ],
            users: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
              {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
              {
                _id: '3',
                firstName: 'Test',
                lastName: 'User1',
                email: 'test1@example.com',
                image: '',
              },
              {
                _id: '4',
                firstName: 'Test',
                lastName: 'User2',
                email: 'test2@example.com',
                image: '',
              },
              {
                _id: '5',
                firstName: 'Test',
                lastName: 'User4',
                email: 'test4@example.com',
                image: '',
              },
            ],
            admins: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
            ],
            unseenMessagesByUsers: {
              '1': 0,
              '2': 0,
              '3': 0,
              '4': 0,
              '5': 0,
            },
          },
          {
            _id: '65844efc814ddgh4003db811c4',
            isGroup: true,
            creator: {
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
              image: null,
              email: 'testsuperadmin@example.com',
              createdAt: '2023-04-13T04:53:17.742Z',
              __typename: 'User',
            },
            organization: {
              _id: 'pw3ertyuiophgfre45678',
              name: 'rtyu',
            },
            createdAt: '2345678903456',
            name: 'Test Group Chat',
            messages: [
              {
                _id: '345678',
                createdAt: '345678908765',
                messageContent: 'Hello',
                media: null,
                replyTo: null,
                sender: {
                  _id: '2',
                  firstName: 'Test',
                  lastName: 'User',
                  email: 'test@example.com',
                  image: '',
                },
              },
            ],
            users: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
              {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
              {
                _id: '3',
                firstName: 'Test',
                lastName: 'User1',
                email: 'test1@example.com',
                image: '',
              },
              {
                _id: '4',
                firstName: 'Test',
                lastName: 'User2',
                email: 'test2@example.com',
                image: '',
              },
              {
                _id: '5',
                firstName: 'Test',
                lastName: 'User4',
                email: 'test4@example.com',
                image: '',
              },
            ],
            admins: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
            ],
            unseenMessagesByUsers: {
              '1': 0,
              '2': 0,
              '3': 0,
              '4': 0,
              '5': 0,
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: CHATS_LIST,
      variables: {
        id: '2',
      },
    },
    result: {
      data: {
        chatsByUserId: [
          {
            _id: '65844efc814dd40fgh03db811c4',
            isGroup: true,
            creator: {
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
              image: null,
              email: 'testsuperadmin@example.com',
              createdAt: '2023-04-13T04:53:17.742Z',
              __typename: 'User',
            },
            organization: {
              _id: 'pw3ertyuiophgfre45678',
              name: 'rtyu',
            },
            createdAt: '2345678903456',
            name: 'Test Group Chat',
            messages: [
              {
                _id: '345678',
                createdAt: '345678908765',
                messageContent: 'Hello',
                media: null,
                replyTo: null,
                type: 'STRING',
                sender: {
                  _id: '2',
                  firstName: 'Test',
                  lastName: 'User',
                  email: 'test@example.com',
                  image: '',
                },
              },
            ],
            users: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
              {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
              {
                _id: '3',
                firstName: 'Test',
                lastName: 'User1',
                email: 'test1@example.com',
                image: '',
              },
              {
                _id: '4',
                firstName: 'Test',
                lastName: 'User2',
                email: 'test2@example.com',
                image: '',
              },
              {
                _id: '5',
                firstName: 'Test',
                lastName: 'User4',
                email: 'test4@example.com',
                image: '',
              },
            ],
            admins: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
            ],
            unseenMessagesByUsers: JSON.stringify({
              '1': 0,
              '2': 0,
              '3': 0,
              '4': 0,
              '5': 0,
            }),
          },
          {
            _id: '65844efc814ddgh4003db811c4',
            isGroup: true,
            creator: {
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
              image: null,
              email: 'testsuperadmin@example.com',
              createdAt: '2023-04-13T04:53:17.742Z',
              __typename: 'User',
            },
            organization: {
              _id: 'pw3ertyuiophgfre45678',
              name: 'rtyu',
            },
            createdAt: '2345678903456',
            name: 'Test Group Chat',
            messages: [
              {
                _id: '345678',
                createdAt: '345678908765',
                messageContent: 'Hello',
                media: null,
                replyTo: null,
                type: 'STRING',
                sender: {
                  _id: '2',
                  firstName: 'Test',
                  lastName: 'User',
                  email: 'test@example.com',
                  image: '',
                },
              },
            ],
            users: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
              {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
              {
                _id: '3',
                firstName: 'Test',
                lastName: 'User1',
                email: 'test1@example.com',
                image: '',
              },
              {
                _id: '4',
                firstName: 'Test',
                lastName: 'User2',
                email: 'test2@example.com',
                image: '',
              },
              {
                _id: '5',
                firstName: 'Test',
                lastName: 'User4',
                email: 'test4@example.com',
                image: '',
              },
            ],
            admins: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
            ],
            unseenMessagesByUsers: JSON.stringify({
              '1': 0,
              '2': 0,
              '3': 0,
              '4': 0,
              '5': 0,
            }),
          },
        ],
      },
    },
  },
  {
    request: {
      query: CHATS_LIST,
      variables: {
        id: '2',
      },
    },
    result: {
      data: {
        chatsByUserId: [
          {
            _id: '65844efc814dd40fgh03db811c4',
            isGroup: true,
            creator: {
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
              image: null,
              email: 'testsuperadmin@example.com',
              createdAt: '2023-04-13T04:53:17.742Z',
              __typename: 'User',
            },
            organization: {
              _id: 'pw3ertyuiophgfre45678',
              name: 'rtyu',
            },
            createdAt: '2345678903456',
            name: 'Test Group Chat',
            messages: [
              {
                _id: '345678',
                createdAt: '345678908765',
                messageContent: 'Hello',
                media: null,
                replyTo: null,
                type: 'STRING',
                sender: {
                  _id: '2',
                  firstName: 'Test',
                  lastName: 'User',
                  email: 'test@example.com',
                  image: '',
                },
              },
            ],
            users: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
              {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
              {
                _id: '3',
                firstName: 'Test',
                lastName: 'User1',
                email: 'test1@example.com',
                image: '',
              },
              {
                _id: '4',
                firstName: 'Test',
                lastName: 'User2',
                email: 'test2@example.com',
                image: '',
              },
              {
                _id: '5',
                firstName: 'Test',
                lastName: 'User4',
                email: 'test4@example.com',
                image: '',
              },
            ],
            admins: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
            ],
            unseenMessagesByUsers: {
              '1': 0,
              '2': 0,
              '3': 0,
              '4': 0,
              '5': 0,
            },
          },
          {
            _id: '65844efc814ddgh4003db811c4',
            isGroup: true,
            creator: {
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
              image: null,
              email: 'testsuperadmin@example.com',
              createdAt: '2023-04-13T04:53:17.742Z',
              __typename: 'User',
            },
            organization: {
              _id: 'pw3ertyuiophgfre45678',
              name: 'rtyu',
            },
            createdAt: '2345678903456',
            name: 'Test Group Chat',
            messages: [
              {
                _id: '345678',
                createdAt: '345678908765',
                messageContent: 'Hello',
                media: null,
                replyTo: null,
                type: 'STRING',
                sender: {
                  _id: '2',
                  firstName: 'Test',
                  lastName: 'User',
                  email: 'test@example.com',
                  image: '',
                },
              },
            ],
            users: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
              {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
              {
                _id: '3',
                firstName: 'Test',
                lastName: 'User1',
                email: 'test1@example.com',
                image: '',
              },
              {
                _id: '4',
                firstName: 'Test',
                lastName: 'User2',
                email: 'test2@example.com',
                image: '',
              },
              {
                _id: '5',
                firstName: 'Test',
                lastName: 'User4',
                email: 'test4@example.com',
                image: '',
              },
            ],
            admins: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
            ],
            unseenMessagesByUsers: {
              '1': 0,
              '2': 0,
              '3': 0,
              '4': 0,
              '5': 0,
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: CHATS_LIST,
      variables: {
        id: '2',
      },
    },
    result: {
      data: {
        chatsByUserId: [
          {
            _id: '65844efc814dd40fgh03db811c4',
            isGroup: true,
            creator: {
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
              image: null,
              email: 'testsuperadmin@example.com',
              createdAt: '2023-04-13T04:53:17.742Z',
              __typename: 'User',
            },
            organization: {
              _id: 'pw3ertyuiophgfre45678',
              name: 'rtyu',
            },
            createdAt: '2345678903456',
            name: 'Test Group Chat',
            messages: [
              {
                _id: '345678',
                createdAt: '345678908765',
                messageContent: 'Hello',
                media: null,
                replyTo: null,
                type: 'STRING',
                sender: {
                  _id: '2',
                  firstName: 'Test',
                  lastName: 'User',
                  email: 'test@example.com',
                  image: '',
                },
              },
            ],
            users: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
              {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
              {
                _id: '3',
                firstName: 'Test',
                lastName: 'User1',
                email: 'test1@example.com',
                image: '',
              },
              {
                _id: '4',
                firstName: 'Test',
                lastName: 'User2',
                email: 'test2@example.com',
                image: '',
              },
              {
                _id: '5',
                firstName: 'Test',
                lastName: 'User4',
                email: 'test4@example.com',
                image: '',
              },
            ],
            admins: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
            ],
            unseenMessagesByUsers: {
              '1': 0,
              '2': 0,
              '3': 0,
              '4': 0,
              '5': 0,
            },
          },
          {
            _id: '65844efc814ddgh4003db811c4',
            isGroup: true,
            creator: {
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
              image: null,
              email: 'testsuperadmin@example.com',
              createdAt: '2023-04-13T04:53:17.742Z',
              __typename: 'User',
            },
            organization: {
              _id: 'pw3ertyuiophgfre45678',
              name: 'rtyu',
            },
            createdAt: '2345678903456',
            name: 'Test Group Chat',
            messages: [
              {
                _id: '345678',
                createdAt: '345678908765',
                messageContent: 'Hello',
                media: null,
                replyTo: null,
                type: 'STRING',
                sender: {
                  _id: '2',
                  firstName: 'Test',
                  lastName: 'User',
                  email: 'test@example.com',
                  image: '',
                },
              },
            ],
            users: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
              {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
              {
                _id: '3',
                firstName: 'Test',
                lastName: 'User1',
                email: 'test1@example.com',
                image: '',
              },
              {
                _id: '4',
                firstName: 'Test',
                lastName: 'User2',
                email: 'test2@example.com',
                image: '',
              },
              {
                _id: '5',
                firstName: 'Test',
                lastName: 'User4',
                email: 'test4@example.com',
                image: '',
              },
            ],
            admins: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
            ],
            unseenMessagesByUsers: {
              '1': 0,
              '2': 0,
              '3': 0,
              '4': 0,
              '5': 0,
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: CHATS_LIST,
      variables: {
        id: '',
      },
    },
    result: {
      data: {
        chatsByUserId: [
          {
            _id: '65844ghjefc814dd4003db811c4',
            isGroup: true,
            creator: {
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
              image: null,
              email: 'testsuperadmin@example.com',
              createdAt: '2023-04-13T04:53:17.742Z',
              __typename: 'User',
            },
            organization: {
              _id: 'pw3ertyuiophgfre45678',
              name: 'rtyu',
            },
            createdAt: '2345678903456',
            name: 'Test Group Chat',
            messages: [
              {
                _id: '345678',
                createdAt: '345678908765',
                messageContent: 'Hello',
                media: null,
                replyTo: null,
                sender: {
                  _id: '2',
                  firstName: 'Test',
                  lastName: 'User',
                  email: 'test@example.com',
                  image: '',
                },
              },
            ],
            users: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
              {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
              {
                _id: '3',
                firstName: 'Test',
                lastName: 'User1',
                email: 'test1@example.com',
                image: '',
              },
              {
                _id: '4',
                firstName: 'Test',
                lastName: 'User2',
                email: 'test2@example.com',
                image: '',
              },
              {
                _id: '5',
                firstName: 'Test',
                lastName: 'User4',
                email: 'test4@example.com',
                image: '',
              },
            ],
            admins: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
            ],
            unseenMessagesByUsers: {
              '1': 0,
              '2': 0,
              '3': 0,
              '4': 0,
              '5': 0,
            },
          },
          {
            _id: 'ujhgtrdtyuiop',
            isGroup: true,
            creator: {
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
              image: null,
              email: 'testsuperadmin@example.com',
              createdAt: '2023-04-13T04:53:17.742Z',
              __typename: 'User',
            },
            organization: {
              _id: 'pw3ertyuiophgfre45678',
              name: 'rtyu',
            },
            createdAt: '2345678903456',
            name: 'Test Group Chat',
            messages: [
              {
                _id: '345678',
                createdAt: '345678908765',
                messageContent: 'Hello',
                media: null,
                replyTo: null,
                sender: {
                  _id: '2',
                  firstName: 'Test',
                  lastName: 'User',
                  email: 'test@example.com',
                  image: '',
                },
              },
            ],
            users: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
              {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
              {
                _id: '3',
                firstName: 'Test',
                lastName: 'User1',
                email: 'test1@example.com',
                image: '',
              },
              {
                _id: '4',
                firstName: 'Test',
                lastName: 'User2',
                email: 'test2@example.com',
                image: '',
              },
              {
                _id: '5',
                firstName: 'Test',
                lastName: 'User4',
                email: 'test4@example.com',
                image: '',
              },
            ],
            admins: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
            ],
            unseenMessagesByUsers: {
              '1': 0,
              '2': 0,
              '3': 0,
              '4': 0,
              '5': 0,
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: CHATS_LIST,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        chatsByUserId: [
          {
            _id: '65844efc814dhjmkdftyd4003db811c4',
            isGroup: true,
            creator: {
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
              image: null,
              email: 'testsuperadmin@example.com',
              createdAt: '2023-04-13T04:53:17.742Z',
              __typename: 'User',
            },
            organization: {
              _id: 'pw3ertyuiophgfre45678',
              name: 'rtyu',
            },
            createdAt: '2345678903456',
            name: 'Test Group Chat',
            messages: [
              {
                _id: '345678',
                createdAt: '345678908765',
                messageContent: 'Hello',
                media: null,
                replyTo: null,
                sender: {
                  _id: '2',
                  firstName: 'Test',
                  lastName: 'User',
                  email: 'test@example.com',
                  image: '',
                },
              },
            ],
            users: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
              {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
              {
                _id: '3',
                firstName: 'Test',
                lastName: 'User1',
                email: 'test1@example.com',
                image: '',
              },
              {
                _id: '4',
                firstName: 'Test',
                lastName: 'User2',
                email: 'test2@example.com',
                image: '',
              },
              {
                _id: '5',
                firstName: 'Test',
                lastName: 'User4',
                email: 'test4@example.com',
                image: '',
              },
            ],
            admins: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
            ],
            unseenMessagesByUsers: {
              '1': 0,
              '2': 0,
              '3': 0,
              '4': 0,
              '5': 0,
            },
          },
          {
            _id: '65844ewsedrffc814dd4003db811c4',
            isGroup: true,
            creator: {
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
              image: null,
              email: 'testsuperadmin@example.com',
              createdAt: '2023-04-13T04:53:17.742Z',
              __typename: 'User',
            },
            organization: {
              _id: 'pw3ertyuiophgfre45678',
              name: 'rtyu',
            },
            createdAt: '2345678903456',
            name: 'Test Group Chat',
            messages: [
              {
                _id: '345678',
                createdAt: '345678908765',
                messageContent: 'Hello',
                media: null,
                replyTo: null,
                sender: {
                  _id: '2',
                  firstName: 'Test',
                  lastName: 'User',
                  email: 'test@example.com',
                  image: '',
                },
              },
            ],
            users: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
              {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
              {
                _id: '3',
                firstName: 'Test',
                lastName: 'User1',
                email: 'test1@example.com',
                image: '',
              },
              {
                _id: '4',
                firstName: 'Test',
                lastName: 'User2',
                email: 'test2@example.com',
                image: '',
              },
              {
                _id: '5',
                firstName: 'Test',
                lastName: 'User4',
                email: 'test4@example.com',
                image: '',
              },
            ],
            admins: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
            ],
            unseenMessagesByUsers: JSON.stringify({
              '1': 0,
              '2': 0,
              '3': 0,
              '4': 0,
              '5': 0,
            }),
          },
        ],
      },
    },
  },
];

export const GROUP_CHAT_BY_ID_QUERY_MOCK = [
  {
    request: {
      query: CHAT_BY_ID,
      variables: {
        id: '',
      },
    },
    result: {
      data: {
        chatById: {
          _id: '65844efc814dd4003db811c4',
          isGroup: true,
          creator: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: null,
            email: 'testsuperadmin@example.com',
            createdAt: '2023-04-13T04:53:17.742Z',
            __typename: 'User',
          },
          organization: {
            _id: 'pw3ertyuiophgfre45678',
            name: 'rtyu',
          },
          createdAt: '2345678903456',
          name: 'Test Group Chat',
          messages: [
            {
              _id: '2',
              createdAt: '345678908765',
              messageContent: 'Hello',
              media: null,
              replyTo: null,
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
            },
          ],
          users: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
            {
              _id: '2',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              image: '',
            },
            {
              _id: '3',
              firstName: 'Test',
              lastName: 'User1',
              email: 'test1@example.com',
              image: '',
            },
            {
              _id: '4',
              firstName: 'Test',
              lastName: 'User2',
              email: 'test2@example.com',
              image: '',
            },
            {
              _id: '5',
              firstName: 'Test',
              lastName: 'User4',
              email: 'test4@example.com',
              image: '',
            },
          ],
          admins: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
          ],
          unseenMessagesByUsers: JSON.stringify({
            '1': 0,
            '2': 0,
            '3': 0,
            '4': 0,
            '5': 0,
          }),
        },
      },
    },
  },
  {
    request: {
      query: CHAT_BY_ID,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        chatById: {
          _id: '65844efc814dd4003db811c4',
          isGroup: true,
          creator: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: null,
            email: 'testsuperadmin@example.com',
            createdAt: '2023-04-13T04:53:17.742Z',
            __typename: 'User',
          },
          organization: {
            _id: 'pw3ertyuiophgfre45678',
            name: 'rtyu',
          },
          createdAt: '2345678903456',
          name: 'Test Group Chat',
          messages: [
            {
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
              media: null,
              replyTo: null,
              type: 'STRING',
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
            },
          ],
          users: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
            {
              _id: '2',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              image: '',
            },
            {
              _id: '3',
              firstName: 'Test',
              lastName: 'User1',
              email: 'test1@example.com',
              image: '',
            },
            {
              _id: '4',
              firstName: 'Test',
              lastName: 'User2',
              email: 'test2@example.com',
              image: '',
            },
            {
              _id: '5',
              firstName: 'Test',
              lastName: 'User4',
              email: 'test4@example.com',
              image: '',
            },
          ],
          admins: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
          ],
          unseenMessagesByUsers: JSON.stringify({
            '1': 0,
            '2': 0,
            '3': 0,
            '4': 0,
            '5': 0,
          }),
        },
      },
    },
  },
  {
    request: {
      query: CHAT_BY_ID,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        chatById: {
          _id: '65844efc814dd4003db811c4',
          isGroup: true,
          creator: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: null,
            email: 'testsuperadmin@example.com',
            createdAt: '2023-04-13T04:53:17.742Z',
            __typename: 'User',
          },
          organization: {
            _id: 'pw3ertyuiophgfre45678',
            name: 'rtyu',
          },
          createdAt: '2345678903456',
          name: 'Test Group Chat',
          messages: [
            {
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
              media: null,
              replyTo: null,
              type: 'STRING',
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
            },
          ],
          users: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
            {
              _id: '2',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              image: '',
            },
            {
              _id: '3',
              firstName: 'Test',
              lastName: 'User1',
              email: 'test1@example.com',
              image: '',
            },
            {
              _id: '4',
              firstName: 'Test',
              lastName: 'User2',
              email: 'test2@example.com',
              image: '',
            },
            {
              _id: '5',
              firstName: 'Test',
              lastName: 'User4',
              email: 'test4@example.com',
              image: '',
            },
          ],
          admins: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
          ],
          unseenMessagesByUsers: JSON.stringify({
            '1': 0,
            '2': 0,
            '3': 0,
            '4': 0,
            '5': 0,
          }),
        },
      },
    },
  },
  {
    request: {
      query: CHAT_BY_ID,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        chatById: {
          _id: '65844efc814dd4003db811c4',
          isGroup: true,
          creator: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: null,
            email: 'testsuperadmin@example.com',
            createdAt: '2023-04-13T04:53:17.742Z',
            __typename: 'User',
          },
          organization: {
            _id: 'pw3ertyuiophgfre45678',
            name: 'rtyu',
          },
          createdAt: '2345678903456',
          name: 'Test Group Chat',
          messages: [
            {
              _id: '1',
              createdAt: '345678908765',
              messageContent: 'Hello',
              media: null,
              replyTo: null,
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
            },
          ],
          users: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
            {
              _id: '2',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              image: '',
            },
            {
              _id: '3',
              firstName: 'Test',
              lastName: 'User1',
              email: 'test1@example.com',
              image: '',
            },
            {
              _id: '4',
              firstName: 'Test',
              lastName: 'User2',
              email: 'test2@example.com',
              image: '',
            },
            {
              _id: '5',
              firstName: 'Test',
              lastName: 'User4',
              email: 'test4@example.com',
              image: '',
            },
          ],
          admins: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: CHAT_BY_ID,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        chatById: {
          _id: '65844efc814dd4003db811c4',
          isGroup: true,
          creator: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: null,
            email: 'testsuperadmin@example.com',
            createdAt: '2023-04-13T04:53:17.742Z',
            __typename: 'User',
          },
          organization: {
            _id: 'pw3ertyuiophgfre45678',
            name: 'rtyu',
          },
          createdAt: '2345678903456',
          name: 'Test Group Chat',
          messages: [
            {
              _id: '1',
              createdAt: '345678908765',
              messageContent: 'Hello',
              media: '',
              replyTo: null,
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
            },
          ],
          users: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
            {
              _id: '2',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              image: '',
            },
            {
              _id: '3',
              firstName: 'Test',
              lastName: 'User1',
              email: 'test1@example.com',
              image: '',
            },
            {
              _id: '4',
              firstName: 'Test',
              lastName: 'User2',
              email: 'test2@example.com',
              image: '',
            },
            {
              _id: '5',
              firstName: 'Test',
              lastName: 'User4',
              email: 'test4@example.com',
              image: '',
            },
          ],
          admins: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
          ],
        },
      },
    },
  },
];

export const SEND_MESSAGE_TO_CHAT_MOCK = [
  {
    request: {
      query: SEND_MESSAGE_TO_CHAT,
      variables: {
        chatId: '1',
        replyTo: '4',
        messageContent: 'Test reply message',
        media: 'https://test.com/image.jpg',
      },
    },
    result: {
      data: {
        sendMessageToChat: {
          _id: '668ec1f1364e03ac47a151',
          createdAt: '2024-07-10T17:16:33.248Z',
          messageContent: 'Test ',
          media: null,
          replyTo: null,
          sender: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: '',
          },
          updatedAt: '2024-07-10',
        },
      },
    },
  },
  {
    request: {
      query: SEND_MESSAGE_TO_CHAT,
      variables: {
        chatId: '1',
        replyTo: '4',
        messageContent: 'Test reply message',
        media: null,
      },
    },
    result: {
      data: {
        sendMessageToChat: {
          _id: '668ec1f1364e03ac47a151',
          createdAt: '2024-07-10T17:16:33.248Z',
          messageContent: 'Test ',
          media: null,
          replyTo: null,
          sender: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: '',
          },
          updatedAt: '2024-07-10',
        },
      },
    },
  },
  {
    request: {
      query: SEND_MESSAGE_TO_CHAT,
      variables: {
        chatId: '1',
        replyTo: '1',
        messageContent: 'Test reply message',
      },
    },
    result: {
      data: {
        sendMessageToChat: {
          _id: '668ec1f1364e03ac47a151',
          createdAt: '2024-07-10T17:16:33.248Z',
          messageContent: 'Test ',
          media: null,
          replyTo: null,
          sender: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: '',
          },
          updatedAt: '2024-07-10',
        },
      },
    },
  },
  {
    request: {
      query: SEND_MESSAGE_TO_CHAT,
      variables: {
        chatId: '1',
        replyTo: undefined,
        messageContent: 'Hello',
        media: null,
      },
    },
    result: {
      data: {
        sendMessageToChat: {
          _id: '668ec1f1364e03ac47a151',
          createdAt: '2024-07-10T17:16:33.248Z',
          messageContent: 'Test ',
          media: null,
          replyTo: null,
          sender: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: '',
          },
          updatedAt: '2024-07-10',
        },
      },
    },
  },
  {
    request: {
      query: SEND_MESSAGE_TO_CHAT,
      variables: {
        chatId: '1',
        replyTo: '345678',
        messageContent: 'Test reply message',
        media: null,
      },
    },
    result: {
      data: {
        sendMessageToChat: {
          _id: '668ec1f1364e03ac47a151',
          createdAt: '2024-07-10T17:16:33.248Z',
          messageContent: 'Test ',
          media: null,
          replyTo: null,
          sender: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: '',
          },
          updatedAt: '2024-07-10',
        },
      },
    },
  },
  {
    request: {
      query: SEND_MESSAGE_TO_CHAT,
      variables: {
        chatId: '1',
        replyTo: undefined,
        messageContent: 'Test message',
        media: null,
      },
    },
    result: {
      data: {
        sendMessageToChat: {
          _id: '668ec1f1364e03ac47a151',
          createdAt: '2024-07-10T17:16:33.248Z',
          messageContent: 'Test ',
          media: null,
          replyTo: null,
          sender: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: '',
          },
          updatedAt: '2024-07-10',
        },
      },
    },
  },
  {
    request: {
      query: SEND_MESSAGE_TO_CHAT,
      variables: {
        chatId: '1',
        replyTo: undefined,
        messageContent: 'Test reply message',
        media: null,
      },
    },
    result: {
      data: {
        sendMessageToChat: {
          _id: '668ec1f1364e03ac47a151',
          createdAt: '2024-07-10T17:16:33.248Z',
          messageContent: 'Test ',
          media: null,
          replyTo: null,
          sender: {
            _id: '64378abd85008f171cf2990d',
            firstName: 'Wilt',
            lastName: 'Shepherd',
            image: '',
          },
          updatedAt: '2024-07-10',
        },
      },
    },
  },
];

export const MARK_CHAT_MESSAGES_AS_READ_MOCK = [
  {
    request: {
      query: MARK_CHAT_MESSAGES_AS_READ,
      variables: {
        chatId: '1',
        userId: '2',
      },
    },
    result: {
      data: {
        markChatMessagesAsRead: {
          _id: 'mocked-id-2',
          __typename: 'ChatMessage', // Important: __typename needed
        },
      },
    },
  },
  {
    request: {
      query: MARK_CHAT_MESSAGES_AS_READ,
      variables: {
        chatId: '',
        userId: null,
      },
    },
    result: {
      data: {
        markChatMessagesAsRead: {
          _id: 'mocked-id-null',
          __typename: 'ChatMessage',
        },
      },
    },
  },
  {
    request: {
      query: MARK_CHAT_MESSAGES_AS_READ,
      variables: {
        chatId: '',
        userId: 'dummyUser',
      },
    },
    result: {
      data: {
        markChatMessagesAsRead: {
          _id: 'mocked-id-dummy',
          __typename: 'ChatMessage',
        },
      },
    },
  },
  ...Array.from({ length: 5 }, () => ({
    request: {
      query: MARK_CHAT_MESSAGES_AS_READ,
      variables: {
        chatId: '1',
        userId: '8',
      },
    },
    result: {
      data: {
        markChatMessagesAsRead: {
          _id: 'mocked-id-8',
          __typename: 'ChatMessage',
        },
      },
    },
  })),
];

describe('Testing Chatroom Component [User Portal]', () => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Chat room should display fallback content if no chat is active', async () => {
    const mocks = [
      ...MESSAGE_SENT_TO_CHAT_MOCK,
      ...CHAT_BY_ID_QUERY_MOCK,
      ...CHATS_LIST_MOCK,
      ...GROUP_CHAT_BY_ID_QUERY_MOCK,
      ...SEND_MESSAGE_TO_CHAT_MOCK,
      ...MARK_CHAT_MESSAGES_AS_READ_MOCK,
      ...GROUP_CHAT_LIST_QUERY_MOCK,
      ...UNREAD_CHAT_LIST_QUERY_MOCK,
    ].flat();
    render(
      <MockedProvider mocks={mocks} addTypename={true}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatRoom selectedContact="" chatListRefetch={vi.fn()} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    expect(await screen.findByTestId('noChatSelected')).toBeInTheDocument();
  });

  it('Selected contact is direct chat', async () => {
    const link = new MockSubscriptionLink();
    const mocks = [
      ...MESSAGE_SENT_TO_CHAT_MOCK,
      ...CHAT_BY_ID_QUERY_MOCK,
      ...CHATS_LIST_MOCK,
      ...GROUP_CHAT_BY_ID_QUERY_MOCK,
      ...SEND_MESSAGE_TO_CHAT_MOCK,
      ...MARK_CHAT_MESSAGES_AS_READ_MOCK,
      ...GROUP_CHAT_LIST_QUERY_MOCK,
      ...UNREAD_CHAT_LIST_QUERY_MOCK,
    ].flat();
    render(
      <MockedProvider mocks={mocks} link={link} addTypename={true}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatRoom selectedContact="1" chatListRefetch={vi.fn()} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
  });

  it('send message direct chat', async () => {
    setItem('userId', '2');
    const mocks = [
      ...MESSAGE_SENT_TO_CHAT_MOCK,
      ...CHAT_BY_ID_QUERY_MOCK,
      ...CHATS_LIST_MOCK,
      ...GROUP_CHAT_BY_ID_QUERY_MOCK,
      ...SEND_MESSAGE_TO_CHAT_MOCK,
      ...MARK_CHAT_MESSAGES_AS_READ_MOCK,
      ...GROUP_CHAT_LIST_QUERY_MOCK,
      ...UNREAD_CHAT_LIST_QUERY_MOCK,
    ].flat();
    const link2 = new StaticMockLink(mocks, true);
    render(
      <MockedProvider link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatRoom selectedContact="1" chatListRefetch={vi.fn()} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();

    const input = (await screen.findByTestId(
      'messageInput',
    )) as HTMLInputElement;

    act(() => {
      fireEvent.change(input, { target: { value: 'Hello' } });
    });
    expect(input.value).toBe('Hello');

    const sendBtn = await screen.findByTestId('sendMessage');

    expect(sendBtn).toBeInTheDocument();
    act(() => {
      fireEvent.click(sendBtn);
    });

    const messages = await screen.findAllByTestId('message');

    console.log('MESSAGES', messages);

    expect(messages.length).not.toBe(0);

    act(() => {
      fireEvent.mouseOver(messages[0]);
    });

    await waitFor(async () => {
      expect(await screen.findByTestId('moreOptions')).toBeInTheDocument();
    });

    const moreOptionsBtn = await screen.findByTestId('dropdown');
    act(() => {
      fireEvent.click(moreOptionsBtn);
    });

    const replyBtn = await screen.findByTestId('replyBtn');

    act(() => {
      fireEvent.click(replyBtn);
    });

    const replyMsg = await screen.findByTestId('replyMsg');

    await waitFor(() => {
      expect(replyMsg).toBeInTheDocument();
    });

    act(() => {
      fireEvent.change(input, { target: { value: 'Test reply message' } });
    });
    expect(input.value).toBe('Test reply message');

    act(() => {
      fireEvent.click(sendBtn);
    });

    await wait(400);
  });

  it('send message direct chat when userId is different', async () => {
    setItem('userId', '8');
    const mocks = [
      ...GROUP_CHAT_BY_ID_QUERY_MOCK,
      ...MESSAGE_SENT_TO_CHAT_MOCK,
      ...CHAT_BY_ID_QUERY_MOCK,
      ...CHATS_LIST_MOCK,
      ...SEND_MESSAGE_TO_CHAT_MOCK,
      ...MARK_CHAT_MESSAGES_AS_READ_MOCK,
      ...GROUP_CHAT_LIST_QUERY_MOCK,
      ...UNREAD_CHAT_LIST_QUERY_MOCK,
    ].flat();

    const link2 = new StaticMockLink(mocks, true);

    render(
      <MockedProvider link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatRoom selectedContact="1" chatListRefetch={vi.fn()} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();

    const input = (await screen.findByTestId(
      'messageInput',
    )) as HTMLInputElement;

    act(() => {
      fireEvent.change(input, { target: { value: 'Hello' } });
    });
    expect(input.value).toBe('Hello');

    const sendBtn = await screen.findByTestId('sendMessage');

    expect(sendBtn).toBeInTheDocument();
    act(() => {
      fireEvent.click(sendBtn);
    });

    const messages = await screen.findAllByTestId('message');

    console.log('MESSAGES', messages);

    expect(messages.length).not.toBe(0);

    act(() => {
      fireEvent.mouseOver(messages[0]);
    });

    await waitFor(async () => {
      expect(await screen.findByTestId('moreOptions')).toBeInTheDocument();
    });

    const moreOptionsBtn = await screen.findByTestId('dropdown');
    act(() => {
      fireEvent.click(moreOptionsBtn);
    });

    const replyBtn = await screen.findByTestId('replyBtn');

    act(() => {
      fireEvent.click(replyBtn);
    });

    const replyMsg = await screen.findByTestId('replyMsg');

    await waitFor(() => {
      expect(replyMsg).toBeInTheDocument();
    });

    act(() => {
      fireEvent.change(input, { target: { value: 'Test reply message' } });
    });
    expect(input.value).toBe('Test reply message');

    act(() => {
      fireEvent.click(sendBtn);
    });

    await wait(400);
  });

  it('Selected contact is group chat', async () => {
    const mocks = [
      ...MESSAGE_SENT_TO_CHAT_MOCK,
      ...CHAT_BY_ID_QUERY_MOCK,
      ...CHATS_LIST_MOCK,
      ...SEND_MESSAGE_TO_CHAT_MOCK,
      ...MARK_CHAT_MESSAGES_AS_READ_MOCK,
      ...GROUP_CHAT_LIST_QUERY_MOCK,
      ...UNREAD_CHAT_LIST_QUERY_MOCK,
    ].flat();
    render(
      <MockedProvider mocks={mocks} addTypename={true}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatRoom selectedContact="1" chatListRefetch={vi.fn()} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
  });

  it('send message group chat', async () => {
    const mocks = [
      ...MESSAGE_SENT_TO_CHAT_MOCK,
      ...CHAT_BY_ID_QUERY_MOCK,
      ...CHATS_LIST_MOCK,
      ...GROUP_CHAT_BY_ID_QUERY_MOCK,
      ...SEND_MESSAGE_TO_CHAT_MOCK,
      ...MARK_CHAT_MESSAGES_AS_READ_MOCK,
      ...GROUP_CHAT_LIST_QUERY_MOCK,
      ...UNREAD_CHAT_LIST_QUERY_MOCK,
    ].flat();
    render(
      <MockedProvider mocks={mocks} addTypename={true}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatRoom selectedContact="1" chatListRefetch={vi.fn()} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();

    const input = (await screen.findByTestId(
      'messageInput',
    )) as HTMLInputElement;

    act(() => {
      fireEvent.change(input, { target: { value: 'Test message' } });
    });
    expect(input.value).toBe('Test message');

    const sendBtn = await screen.findByTestId('sendMessage');

    expect(sendBtn).toBeInTheDocument();
    act(() => {
      fireEvent.click(sendBtn);
    });

    const messages = await screen.findAllByTestId('message');

    expect(messages.length).not.toBe(0);

    act(() => {
      fireEvent.mouseOver(messages[0]);
    });
    await wait();
    expect(await screen.findByTestId('moreOptions')).toBeInTheDocument();

    const moreOptionsBtn = await screen.findByTestId('dropdown');
    act(() => {
      fireEvent.click(moreOptionsBtn);
    });

    act(() => {
      fireEvent.change(input, { target: { value: 'Test reply message' } });
    });
    expect(input.value).toBe('Test reply message');

    act(() => {
      fireEvent.click(sendBtn);
    });

    await wait(500);
  });

  it('should set chat title and subtitle for direct chat', async () => {
    const mocks = [
      ...CHAT_BY_ID_QUERY_MOCK,
      ...MARK_CHAT_MESSAGES_AS_READ_MOCK,
    ].flat();
    const mockRefetch = vi.fn();

    render(
      <MockedProvider mocks={mocks} addTypename={true}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatRoom selectedContact="1" chatListRefetch={mockRefetch} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      // Test full name for uniqueness
      expect(screen.getByText(/Disha Talreja/i)).toBeInTheDocument();
      // Test last name appears somewhere (in case it's split elsewhere)
      expect(screen.getAllByText(/Talreja/i).length).toBeGreaterThan(0);
      // Test email address presence
      expect(screen.getByText(/disha@example\.com/i)).toBeInTheDocument();
    });
  });
});

describe('MessageImage Component', () => {
  const mockGetFileFromMinio = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks(); // resets all spyOn patches
  });

  it('renders base64 image directly', () => {
    render(
      <MessageImage
        media="data:image/png;base64,abc123"
        getFileFromMinio={mockGetFileFromMinio}
      />,
    );
    const img = screen.getByAltText('attachment') as HTMLImageElement;
    expect(img.src).toContain('data:image/png;base64,abc123');
  });

  it('renders loading placeholder while image is loading', async () => {
    // Canonical deferred promise helper
    const deferred = (() => {
      let resolve!: (url: string) => void;
      const promise = new Promise<string>((r) => (resolve = r));
      return { promise, resolve };
    })();
    mockGetFileFromMinio.mockReturnValueOnce(deferred.promise);

    const { unmount } = render(
      <MessageImage
        media="minio-image-name.png"
        getFileFromMinio={mockGetFileFromMinio}
      />,
    );

    expect(await screen.findByText('Loading image...')).toBeInTheDocument();

    // Clean up: resolve the promise so React can finish any effects
    act(() => {
      deferred.resolve('https://dummy');
    });

    // Optionally, unmount to ensure no side effects
    unmount();
  });

  it('renders MinIO image after successful fetch', async () => {
    mockGetFileFromMinio.mockResolvedValueOnce('https://example.com/image.png');

    render(
      <MessageImage
        media="minio-image-name.png"
        getFileFromMinio={mockGetFileFromMinio}
      />,
    );

    const img = await screen.findByAltText('attachment');
    expect(img.getAttribute('src')).toBe('https://example.com/image.png');
  });

  it('renders fallback if image fetching fails', async () => {
    mockGetFileFromMinio.mockRejectedValueOnce(new Error('Failed'));

    render(
      <MessageImage
        media="minio-fail.png"
        getFileFromMinio={mockGetFileFromMinio}
      />,
    );

    expect(await screen.findByText('Image not available')).toBeInTheDocument();
  });

  it('shows error if media is not provided (no media prop)', () => {
    render(<MessageImage media="" getFileFromMinio={vi.fn()} />);
    expect(screen.getByText('Image not available')).toBeInTheDocument();
  });
});

describe('handleImageChange', () => {
  const createFile = (type = 'image/png', name = 'test.png') =>
    new File(['dummy content'], name, { type });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks(); // resets all spyOn patches
  });

  it('should do nothing if no file is selected', async () => {
    const mocks = [
      ...CHAT_BY_ID_QUERY_MOCK,
      ...MARK_CHAT_MESSAGES_AS_READ_MOCK,
    ].flat();

    render(
      <MockedProvider mocks={mocks} addTypename={true}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatRoom selectedContact="1" chatListRefetch={vi.fn()} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const input = await screen.findByTestId('hidden-file-input');

    await act(async () => {
      fireEvent.change(input, { target: { files: [] } });
    });

    // No error should be shown, and no image uploaded
    expect(screen.queryByAltText('attachment')).not.toBeInTheDocument();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('should show validation error for invalid file', async () => {
    vi.mocked(fileValidation.validateFile).mockReturnValueOnce({
      isValid: false,
      errorMessage: 'Invalid file type',
    });

    const mocks = [
      ...CHAT_BY_ID_QUERY_MOCK,
      ...MARK_CHAT_MESSAGES_AS_READ_MOCK,
    ].flat();

    render(
      <MockedProvider mocks={mocks} addTypename={true}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatRoom selectedContact="1" chatListRefetch={vi.fn()} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const input = await screen.findByTestId('hidden-file-input');
    const file = createFile('text/plain', 'test.txt');

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    expect(fileValidation.validateFile).toHaveBeenCalled();
    expect(screen.queryByAltText('attachment')).not.toBeInTheDocument();
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid file type');
    });
  });

  it('should upload and display attachment for valid image', async () => {
    vi.mocked(fileValidation.validateFile).mockReturnValueOnce({
      isValid: true,
      errorMessage: '',
    });

    vi.spyOn(minioUpload, 'useMinioUpload').mockImplementation(() => ({
      uploadFileToMinio: vi
        .fn()
        .mockResolvedValue({ objectName: 'mock-object-name' }),
    }));

    vi.spyOn(minioDownload, 'useMinioDownload').mockImplementation(() => ({
      getFileFromMinio: vi
        .fn()
        .mockResolvedValue('https://example.com/test-image.jpg'),
    }));

    const mocks = [
      ...CHAT_BY_ID_QUERY_MOCK,
      ...MARK_CHAT_MESSAGES_AS_READ_MOCK,
    ].flat();

    render(
      <MockedProvider mocks={mocks} addTypename={true}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatRoom selectedContact="1" chatListRefetch={vi.fn()} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const input = await screen.findByTestId('hidden-file-input');
    const file = createFile('image/png', 'valid-image.png');

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    expect(await screen.findByAltText('attachment')).toBeInTheDocument();
  });

  it('should handle error during upload and show toast', async () => {
    vi.mocked(fileValidation.validateFile).mockReturnValueOnce({
      isValid: true,
      errorMessage: '',
    });

    vi.spyOn(minioUpload, 'useMinioUpload').mockImplementation(() => ({
      uploadFileToMinio: vi.fn().mockRejectedValue(new Error('Upload failed')),
    }));

    const mocks = [
      ...CHAT_BY_ID_QUERY_MOCK,
      ...MARK_CHAT_MESSAGES_AS_READ_MOCK,
    ].flat();

    render(
      <MockedProvider mocks={mocks} addTypename={true}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatRoom selectedContact="1" chatListRefetch={vi.fn()} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const input = await screen.findByTestId('hidden-file-input');
    const file = createFile('image/png', 'error-image.png');

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    // Since upload failed, attachment should NOT appear
    expect(screen.queryByAltText('attachment')).not.toBeInTheDocument();
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('should remove attachment when close button is clicked', async () => {
    vi.mocked(fileValidation.validateFile).mockReturnValueOnce({
      isValid: true,
      errorMessage: '',
    });

    vi.spyOn(minioUpload, 'useMinioUpload').mockImplementation(() => ({
      uploadFileToMinio: vi
        .fn()
        .mockResolvedValue({ objectName: 'mock-object-name' }),
    }));

    vi.spyOn(minioDownload, 'useMinioDownload').mockImplementation(() => ({
      getFileFromMinio: vi
        .fn()
        .mockResolvedValue('https://example.com/test-image.jpg'),
    }));

    const mocks = [
      ...CHAT_BY_ID_QUERY_MOCK,
      ...MARK_CHAT_MESSAGES_AS_READ_MOCK,
    ].flat();

    render(
      <MockedProvider mocks={mocks} addTypename={true}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatRoom selectedContact="1" chatListRefetch={vi.fn()} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const input = await screen.findByTestId('hidden-file-input');
    const file = new File(['dummy content'], 'valid-image.png', {
      type: 'image/png',
    });

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    // Attachment should be visible
    const attachmentImg = await screen.findByAltText('attachment');
    expect(attachmentImg).toBeInTheDocument();

    // Find the close button inside the same parent as the attachment image
    const attachmentDiv = attachmentImg.parentElement;
    expect(attachmentDiv).toBeTruthy();
    const closeBtn = await screen.findByTestId('removeAttachment');
    expect(closeBtn).toBeTruthy();

    // Click the close button
    await act(async () => {
      if (closeBtn) {
        fireEvent.click(closeBtn);
      }
    });

    // Wait for the attachment to be removed
    await waitFor(() => {
      expect(screen.queryByAltText('attachment')).not.toBeInTheDocument();
    });
  });
});
