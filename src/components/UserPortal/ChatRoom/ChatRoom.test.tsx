import React from 'react';

import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { MockSubscriptionLink, MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import {
  DIRECT_CHAT_BY_ID,
  GROUP_CHAT_BY_ID,
} from 'GraphQl/Queries/PlugInQueries';
import {
  MESSAGE_SENT_TO_DIRECT_CHAT,
  MESSAGE_SENT_TO_GROUP_CHAT,
  SEND_MESSAGE_TO_DIRECT_CHAT,
  SEND_MESSAGE_TO_GROUP_CHAT,
} from 'GraphQl/Mutations/OrganizationMutations';
import userEvent from '@testing-library/user-event';
import ChatRoom from './ChatRoom';
import { useLocalStorage } from 'utils/useLocalstorage';

const { setItem } = useLocalStorage();

const link = new StaticMockLink([], true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const SEND_MESSAGE_TO_DIRECT_CHAT_MOCK = [
  {
    request: {
      query: SEND_MESSAGE_TO_DIRECT_CHAT,
      variables: {
        messageContent: 'Hello',
        chatId: '1',
      },
    },
    result: {
      data: {
        sendMessageToDirectChat: {
          _id: '1',
          createdAt: '',
          messageContent: 'Hello',
          directChatMessageBelongsTo: {
            _id: '',
          },
          replyTo: null,
          receiver: {
            _id: '',
            firstName: '',
            lastName: '',
          },
          sender: {
            _id: '',
            firstName: '',
            lastName: '',
          },
          updatedAt: '',
        },
      },
    },
  },
  {
    request: {
      query: SEND_MESSAGE_TO_DIRECT_CHAT,
      variables: {
        chatId: '1',
        replyTo: '3',
        messageContent: 'Test reply message',
      },
    },
    result: {
      data: {
        sendMessageToDirectChat: {
          _id: '1',
          createdAt: '',
          messageContent: 'Hello',
          directChatMessageBelongsTo: {
            _id: '',
          },
          replyTo: {
            _id: '1',
            createdAt: '',
            messageContent: 'Hello',
            directChatMessageBelongsTo: {
              _id: '',
            },
            replyTo: null,
            receiver: {
              _id: '',
              firstName: '',
              lastName: '',
            },
            sender: {
              _id: '',
              firstName: '',
              lastName: '',
            },
            updatedAt: '',
          },
          receiver: {
            _id: '',
            firstName: '',
            lastName: '',
          },
          sender: {
            _id: '',
            firstName: '',
            lastName: '',
          },
          updatedAt: '',
        },
      },
    },
  },
  {
    request: {
      query: SEND_MESSAGE_TO_DIRECT_CHAT,
      variables: {
        chatId: '1',
        replyTo: '4',
        messageContent: 'Test reply message',
      },
    },
    result: {
      data: {
        sendMessageToDirectChat: {
          _id: '1',
          createdAt: '',
          messageContent: 'Hello',
          directChatMessageBelongsTo: {
            _id: '',
          },
          replyTo: {
            _id: '1',
            createdAt: '',
            messageContent: 'Hello',
            directChatMessageBelongsTo: {
              _id: '',
            },
            replyTo: null,
            receiver: {
              _id: '',
              firstName: '',
              lastName: '',
            },
            sender: {
              _id: '',
              firstName: '',
              lastName: '',
            },
            updatedAt: '',
          },
          receiver: {
            _id: '',
            firstName: '',
            lastName: '',
          },
          sender: {
            _id: '',
            firstName: '',
            lastName: '',
          },
          updatedAt: '',
        },
      },
    },
  },
  {
    request: {
      query: SEND_MESSAGE_TO_DIRECT_CHAT,
      variables: {
        chatId: '1',
        replyTo: '1',
        messageContent: 'Test reply message',
      },
    },
    result: {
      data: {
        sendMessageToDirectChat: {
          _id: '1',
          createdAt: '',
          messageContent: 'Hello',
          directChatMessageBelongsTo: {
            _id: '',
          },
          replyTo: {
            _id: '1',
            createdAt: '',
            messageContent: 'Hello',
            directChatMessageBelongsTo: {
              _id: '',
            },
            replyTo: null,
            receiver: {
              _id: '',
              firstName: '',
              lastName: '',
            },
            sender: {
              _id: '',
              firstName: '',
              lastName: '',
            },
            updatedAt: '',
          },
          receiver: {
            _id: '',
            firstName: '',
            lastName: '',
          },
          sender: {
            _id: '',
            firstName: '',
            lastName: '',
          },
          updatedAt: '',
        },
      },
    },
  },
];

const SEND_MESSAGE_TO_GROUP_CHAT_MOCK = [
  {
    request: {
      query: SEND_MESSAGE_TO_GROUP_CHAT,
      variables: {
        messageContent: 'Test message',
        chatId: '1',
      },
    },
    result: {
      data: {
        sendMessageToGroupChat: {
          _id: '123',
          createdAt: '',
          messageContent: 'Test Message',
          replyTo: null,
          sender: {
            _id: '',
            firstName: '',
            lastName: '',
          },
          updatedAt: '',
        },
      },
    },
  },
  {
    request: {
      query: SEND_MESSAGE_TO_GROUP_CHAT,
      variables: { chatId: '1', replyTo: undefined, messageContent: 'Hello' },
    },
    result: {
      data: {
        sendMessageToGroupChat: {
          _id: '123',
          createdAt: '',
          messageContent: 'Test Message',
          replyTo: null,
          sender: {
            _id: '',
            firstName: '',
            lastName: '',
          },
          updatedAt: '',
        },
      },
    },
  },
  {
    request: {
      query: SEND_MESSAGE_TO_GROUP_CHAT,
      variables: {
        messageContent: 'Test reply message',
        replyTo: '3',
        chatId: '1',
      },
    },
    result: {
      data: {
        sendMessageToGroupChat: {
          _id: '2',
          createdAt: '',
          messageContent: 'Test reply message',
          replyTo: {
            _id: '3',
            createdAt: '345678908765',
            messageContent: 'Hello',
            replyTo: null,
            sender: {
              _id: '2',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              image: '',
            },
            updatedAt: '345678908765',
          },
          sender: {
            _id: '',
            firstName: '',
            lastName: '',
          },
          updatedAt: '',
        },
      },
    },
  },
  {
    request: {
      query: SEND_MESSAGE_TO_GROUP_CHAT,
      variables: {
        messageContent: 'Test reply message',
        replyTo: '4',
        chatId: '1',
      },
    },
    result: {
      data: {
        sendMessageToGroupChat: {
          _id: '2',
          createdAt: '',
          messageContent: 'Test reply message',
          replyTo: {
            _id: '3',
            createdAt: '345678908765',
            messageContent: 'Hello',
            replyTo: null,
            sender: {
              _id: '2',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              image: '',
            },
            updatedAt: '345678908765',
          },
          sender: {
            _id: '',
            firstName: '',
            lastName: '',
          },
          updatedAt: '',
        },
      },
    },
  },
  {
    request: {
      query: SEND_MESSAGE_TO_GROUP_CHAT,
      variables: {
        messageContent: 'Test reply message',
        replyTo: '1',
        chatId: '1',
      },
    },
    result: {
      data: {
        sendMessageToGroupChat: {
          _id: '2',
          createdAt: '',
          messageContent: 'Test reply message',
          replyTo: {
            _id: '3',
            createdAt: '345678908765',
            messageContent: 'Hello',
            replyTo: null,
            sender: {
              _id: '2',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              image: '',
            },
            updatedAt: '345678908765',
          },
          sender: {
            _id: '',
            firstName: '',
            lastName: '',
          },
          updatedAt: '',
        },
      },
    },
  },
];

const MESSAGE_SENT_TO_GROUP_CHAT_MOCK = [
  {
    request: {
      query: MESSAGE_SENT_TO_GROUP_CHAT,
      variables: {
        userId: null,
      },
    },
    result: {
      data: {
        messageSentToGroupChat: {
          _id: '123',
          createdAt: '2024-07-10T17:16:33.248Z',
          groupChatMessageBelongsTo: {
            _id: '',
          },
          messageContent: 'Test message',
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
      query: MESSAGE_SENT_TO_GROUP_CHAT,
      variables: {
        userId: null,
      },
    },
    result: {
      data: {
        messageSentToGroupChat: {
          _id: '1',
          createdAt: '2024-07-10T17:16:33.248Z',
          groupChatMessageBelongsTo: {
            _id: '',
          },
          messageContent: 'Test message',
          replyTo: {
            _id: '123',
            createdAt: '2024-07-10T17:16:33.248Z',
            messageContent: 'Test message',
            replyTo: null,
            sender: {
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
              image: '',
            },
            updatedAt: '2024-07-10',
          },
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
      query: MESSAGE_SENT_TO_GROUP_CHAT,
      variables: {
        userId: null,
      },
    },
    result: {
      data: {
        messageSentToGroupChat: {
          _id: '668ec1f1364e03ac47a151',
          createdAt: '2024-07-10T17:16:33.248Z',
          groupChatMessageBelongsTo: {
            _id: '',
          },
          messageContent: 'Test ',
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
      query: MESSAGE_SENT_TO_GROUP_CHAT,
      variables: {
        userId: '2',
      },
    },
    result: {
      data: {
        messageSentToGroupChat: {
          _id: '668ec1f1df364e03ac47a151',
          createdAt: '2024-07-10T17:16:33.248Z',
          messageContent: 'Test ',
          groupChatMessageBelongsTo: {
            _id: '',
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
      query: MESSAGE_SENT_TO_GROUP_CHAT,
      variables: {
        userId: '1',
      },
    },
    result: {
      data: {
        messageSentToGroupChat: {
          _id: '668ec1f13603ac4697a151',
          createdAt: '2024-07-10T17:16:33.248Z',
          messageContent: 'Test ',
          groupChatMessageBelongsTo: {
            _id: '',
          },
          replyTo: {
            _id: '668ec1f1df364e03ac47a151',
            createdAt: '2024-07-10T17:16:33.248Z',
            messageContent: 'Test ',
            groupChatMessageBelongsTo: {
              _id: '',
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

const MESSAGE_SENT_TO_DIRECT_CHAT_MOCK = [
  {
    request: {
      query: MESSAGE_SENT_TO_DIRECT_CHAT,
      variables: {
        userId: '1',
      },
    },
    result: {
      data: {
        messageSentToDirectChat: {
          _id: '668ec1f1364e03ac4697a151',
          createdAt: '2024-07-10T17:16:33.248Z',
          messageContent: 'Test ',
          directChatMessageBelongsTo: {
            _id: '',
          },
          replyTo: null,
          receiver: {
            _id: '65378abd85008f171cf2990d',
            firstName: 'Vyvyan',
            lastName: 'Kerry',
            image: '',
          },
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
      query: MESSAGE_SENT_TO_DIRECT_CHAT,
      variables: {
        userId: '2',
      },
    },
    result: {
      data: {
        messageSentToDirectChat: {
          _id: '668ec1f1364e03ac4697vgfa151',
          createdAt: '2024-07-10T17:16:33.248Z',
          messageContent: 'Test ',
          directChatMessageBelongsTo: {
            _id: '',
          },
          replyTo: null,
          receiver: {
            _id: '65378abd85008f171cf2990d',
            firstName: 'Vyvyan',
            lastName: 'Kerry',
            image: '',
          },
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
      query: MESSAGE_SENT_TO_DIRECT_CHAT,
      variables: {
        userId: null,
      },
    },
    result: {
      data: {
        messageSentToDirectChat: {
          _id: '6ec1f1364e03ac4697a151',
          createdAt: '2024-07-10T17:16:33.248Z',
          messageContent: 'Test ',
          directChatMessageBelongsTo: {
            _id: '',
          },
          replyTo: null,
          receiver: {
            _id: '65378abd85008f171cf2990d',
            firstName: 'Vyvyan',
            lastName: 'Kerry',
            image: '',
          },
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

const DIRECT_CHAT_BY_ID_QUERY_MOCK = [
  {
    request: {
      query: DIRECT_CHAT_BY_ID,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        directChatById: {
          _id: '1',
          createdAt: '2345678903456',
          messages: [
            {
              _id: '4',
              createdAt: '345678908765',
              messageContent: 'Hello',
              replyTo: null,
              receiver: {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
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
        },
      },
    },
  },
  {
    request: {
      query: DIRECT_CHAT_BY_ID,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        directChatById: {
          _id: '1',
          createdAt: '2345678903456',
          messages: [
            {
              _id: '4',
              createdAt: '345678908765',
              messageContent: 'Hello',
              replyTo: null,
              receiver: {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
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
        },
      },
    },
  },
  {
    request: {
      query: DIRECT_CHAT_BY_ID,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        directChatById: {
          _id: '1',
          createdAt: '2345678903456',
          messages: [
            {
              _id: '4',
              createdAt: '345678908765',
              messageContent: 'Hello',
              replyTo: null,
              receiver: {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
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
        },
      },
    },
  },
  {
    request: {
      query: DIRECT_CHAT_BY_ID,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        directChatById: {
          _id: '1',
          createdAt: '2345678903456',
          messages: [
            {
              _id: '4',
              createdAt: '345678908765',
              messageContent: 'Hello',
              replyTo: null,
              receiver: {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
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
        },
      },
    },
  },
  {
    request: {
      query: DIRECT_CHAT_BY_ID,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        directChatById: {
          _id: '1',
          createdAt: '2345678903456',
          messages: [
            {
              _id: '3',
              createdAt: '345678908765',
              messageContent: 'Hello',
              replyTo: null,
              receiver: {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
              updatedAt: '345678908765',
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
        },
      },
    },
  },
  {
    request: {
      query: DIRECT_CHAT_BY_ID,
      variables: {
        id: '2',
      },
    },
    result: {
      data: {
        directChatById: {
          _id: '65844efc814dd4003db811c4',
          createdAt: '2345678903456',
          messages: [
            {
              _id: '2',
              createdAt: '345678908765',
              messageContent: 'Hello',
              replyTo: null,
              receiver: {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
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
        },
      },
    },
  },
  {
    request: {
      query: DIRECT_CHAT_BY_ID,
      variables: {
        id: '',
      },
    },
    result: {
      data: {
        directChatById: {
          _id: '65844efc814dd4003db811c4',
          createdAt: '2345678903456',
          messages: [
            {
              _id: '1',
              createdAt: '345678908765',
              messageContent: 'Hello',
              replyTo: null,
              receiver: {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
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
        },
      },
    },
  },
  {
    request: {
      query: DIRECT_CHAT_BY_ID,
      variables: {
        id: '',
      },
    },
    result: {
      data: {
        directChatById: {
          _id: '65844efc814dd4003db811c4',
          createdAt: '2345678903456',
          messages: [
            {
              _id: '1',
              createdAt: '345678908765',
              messageContent: 'Hello',
              replyTo: null,
              receiver: {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
              },
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
        },
      },
    },
  },
];

const GROUP_CHAT_BY_ID_QUERY_MOCK = [
  {
    request: {
      query: GROUP_CHAT_BY_ID,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        groupChatById: {
          _id: '65844efc814dd4003db811c4',
          createdAt: '2345678903456',
          title: 'Test Group Chat',
          messages: [
            {
              _id: '4',
              createdAt: '345678908765',
              messageContent: 'Hello',
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
        },
      },
    },
  },
  {
    request: {
      query: GROUP_CHAT_BY_ID,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        groupChatById: {
          _id: '65844efc814dd4003db811c4',
          createdAt: '2345678903456',
          title: 'Test Group Chat',
          messages: [
            {
              _id: '4',
              createdAt: '345678908765',
              messageContent: 'Hello',
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
        },
      },
    },
  },
  {
    request: {
      query: GROUP_CHAT_BY_ID,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        groupChatById: {
          _id: '65844efc814dd4003db811c4',
          createdAt: '2345678903456',
          title: 'Test Group Chat',
          messages: [
            {
              _id: '4',
              createdAt: '345678908765',
              messageContent: 'Hello',
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
        },
      },
    },
  },
  {
    request: {
      query: GROUP_CHAT_BY_ID,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        groupChatById: {
          _id: '65844efc814dd4003db811c4',
          createdAt: '2345678903456',
          title: 'Test Group Chat',
          messages: [
            {
              _id: '4',
              createdAt: '345678908765',
              messageContent: 'Hello',
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
        },
      },
    },
  },
  {
    request: {
      query: GROUP_CHAT_BY_ID,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        groupChatById: {
          _id: '1',
          createdAt: '2345678903456',
          title: 'Test Group Chat',
          messages: [
            {
              _id: '3',
              createdAt: '345678908765',
              messageContent: 'Hello',
              replyTo: null,
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
              updatedAt: '345678908765',
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
        },
      },
    },
  },
  {
    request: {
      query: GROUP_CHAT_BY_ID,
      variables: {
        id: '2',
      },
    },
    result: {
      data: {
        groupChatById: {
          _id: '65844efc814dd4003db811c4',
          createdAt: '2345678903456',
          title: 'Test Group Chat',
          messages: [
            {
              _id: '2',
              createdAt: '345678908765',
              messageContent: 'Hello',
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
        },
      },
    },
  },
  {
    request: {
      query: GROUP_CHAT_BY_ID,
      variables: {
        id: '',
      },
    },
    result: {
      data: {
        groupChatById: {
          _id: '65844efc814dd4003db811c4',
          createdAt: '2345678903456',
          title: 'Test Group Chat',
          messages: [
            {
              _id: '1',
              createdAt: '345678908765',
              messageContent: 'Hello',
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
        },
      },
    },
  },
];

describe('Testing Chatroom Component [User Portal]', () => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();

  test('Chat room should display fallback content if no chat is active', async () => {
    const mocks = [
      ...DIRECT_CHAT_BY_ID_QUERY_MOCK,
      ...MESSAGE_SENT_TO_DIRECT_CHAT_MOCK,
      ...MESSAGE_SENT_TO_GROUP_CHAT_MOCK,
      ...GROUP_CHAT_BY_ID_QUERY_MOCK,
    ];
    render(
      <MockedProvider addTypename={false} mocks={mocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatRoom selectedContact="" selectedChatType="" />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    expect(await screen.findByTestId('noChatSelected')).toBeInTheDocument();
  });

  test('Selected contact is direct chat', async () => {
    const link = new MockSubscriptionLink();
    const mocks = [
      ...DIRECT_CHAT_BY_ID_QUERY_MOCK,
      ...GROUP_CHAT_BY_ID_QUERY_MOCK,
      ...MESSAGE_SENT_TO_DIRECT_CHAT_MOCK,
      ...MESSAGE_SENT_TO_GROUP_CHAT_MOCK,
    ];
    render(
      <MockedProvider addTypename={false} mocks={mocks} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatRoom selectedContact="1" selectedChatType="direct" />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
  });

  test('send message direct chat', async () => {
    setItem('userId', '2');
    const mocks = [
      ...SEND_MESSAGE_TO_DIRECT_CHAT_MOCK,
      ...DIRECT_CHAT_BY_ID_QUERY_MOCK,
      ...GROUP_CHAT_BY_ID_QUERY_MOCK,
      ...MESSAGE_SENT_TO_DIRECT_CHAT_MOCK,
      ...MESSAGE_SENT_TO_GROUP_CHAT_MOCK,
    ];
    const link2 = new StaticMockLink(mocks, true);
    render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatRoom selectedContact="1" selectedChatType="direct" />
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
    await waitFor(() => {
      expect(input.value).toBeFalsy();
    });

    const messages = await screen.findAllByTestId('directChatMsg');

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

  test('Selected contact is group chat', async () => {
    const mocks = [
      ...DIRECT_CHAT_BY_ID_QUERY_MOCK,
      ...GROUP_CHAT_BY_ID_QUERY_MOCK,
      ...MESSAGE_SENT_TO_DIRECT_CHAT_MOCK,
      ...MESSAGE_SENT_TO_GROUP_CHAT_MOCK,
    ];
    render(
      <MockedProvider addTypename={false} mocks={mocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatRoom selectedContact="1" selectedChatType="group" />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
  });

  test('send message group chat', async () => {
    const mocks = [
      ...SEND_MESSAGE_TO_GROUP_CHAT_MOCK,
      ...DIRECT_CHAT_BY_ID_QUERY_MOCK,
      ...GROUP_CHAT_BY_ID_QUERY_MOCK,
      ...MESSAGE_SENT_TO_DIRECT_CHAT_MOCK,
      ...MESSAGE_SENT_TO_GROUP_CHAT_MOCK,
    ];
    const link2 = new StaticMockLink(mocks, true);
    render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatRoom selectedContact="1" selectedChatType="group" />
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
    await waitFor(() => {
      expect(input.value).toBeFalsy();
    });

    const messages = await screen.findAllByTestId('groupChatMsg');

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

    // act(() => {
    fireEvent.click(sendBtn);
    // })

    await wait(400);
  });

  test('remove reply msg', async () => {
    const mocks = [
      ...SEND_MESSAGE_TO_GROUP_CHAT_MOCK,
      ...DIRECT_CHAT_BY_ID_QUERY_MOCK,
      ...GROUP_CHAT_BY_ID_QUERY_MOCK,
      ...MESSAGE_SENT_TO_DIRECT_CHAT_MOCK,
      ...MESSAGE_SENT_TO_GROUP_CHAT_MOCK,
    ];
    const link2 = new StaticMockLink(mocks, true);

    render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatRoom selectedContact="1" selectedChatType="group" />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait(500);

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
    await waitFor(() => {
      expect(input.value).toBeFalsy();
    });

    const messages = await screen.findAllByTestId('groupChatMsg');

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

    await waitFor(async () => {
      expect(await screen.findByTestId('closeReplyMsg')).toBeInTheDocument();
      expect(await screen.findByTestId('closeReplyMsg')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(await screen.findByTestId('closeReplyMsg'));
    });
  });

  test('websocket subscription', async () => {
    const mocks = [
      ...SEND_MESSAGE_TO_GROUP_CHAT_MOCK,
      ...DIRECT_CHAT_BY_ID_QUERY_MOCK,
      ...GROUP_CHAT_BY_ID_QUERY_MOCK,
      ...MESSAGE_SENT_TO_DIRECT_CHAT_MOCK,
      ...MESSAGE_SENT_TO_GROUP_CHAT_MOCK,
    ];
    render(
      <MockedProvider addTypename={false} mocks={mocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatRoom selectedContact="1" selectedChatType="group" />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait(500);
  });
});
