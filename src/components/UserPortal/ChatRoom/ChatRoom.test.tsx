import React from 'react';

import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
  findAllByTestId,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
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

const SEND_MESSAGE_TO_DIRECT_CHAT_MOCK = {
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
        _id: '',
        createdAt: '',
        messageContent: '',
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
};

const SEND_MESSAGE_TO_GROUP_CHAT_MOCK = {
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
        _id: '',
        createdAt: '',
        messageContent: '',
        sender: {
          _id: '',
          firstName: '',
          lastName: '',
        },
        updatedAt: '',
      },
    },
  },
};

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
          _id: '668ec1f1364e03ac47a151',
          createdAt: '2024-07-10T17:16:33.248Z',
          messageContent: 'Test ',
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
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
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
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
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
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
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
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
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
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
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
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
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
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
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
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
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
              <ChatRoom selectedContact="1" selectedChatType="direct" />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
  });

  test('Test send message direct chat', async () => {
    setItem('userId', '2');
    const mocks = [
      SEND_MESSAGE_TO_DIRECT_CHAT_MOCK,
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

  test('Test send message group chat', async () => {
    const mocks = [
      SEND_MESSAGE_TO_GROUP_CHAT_MOCK,
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
  });
});
