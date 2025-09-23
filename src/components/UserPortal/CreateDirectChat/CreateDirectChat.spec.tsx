import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import ChatComp from 'screens/UserPortal/Chat/Chat';
import useLocalStorage from 'utils/useLocalstorage';
import { handleCreateDirectChat } from './CreateDirectChat';
import type { GroupChat } from 'types/Chat/type';
import type { TFunction } from 'i18next';
import type { ApolloQueryResult, FetchResult } from '@apollo/client';
import {
  MESSAGE_SENT_TO_CHAT_MOCK,
  CHAT_BY_ID_QUERY_MOCK,
  UNREAD_CHAT_LIST_QUERY_MOCK,
  GROUP_CHAT_BY_USER_ID_QUERY_MOCK,
  UserConnectionListMock,
} from './CreateDirectChatMocks';
import {
  GROUP_CHAT_BY_ID_QUERY_MOCK,
  CHATS_LIST_MOCK,
  CREATE_CHAT_MUTATION_MOCK,
  MARK_CHAT_MESSAGES_AS_READ_MOCK,
} from './CreateDirectChatMocks2';
const { setItem } = useLocalStorage();

/**
 * Unit tests for the Create Direct Chat Modal functionality in the User Portal
 *
 * These tests cover the following scenarios:
 * 1. Opening and closing the create new direct chat modal, ensuring proper UI elements
 *    like dropdown, search input, and submit button are displayed and functional.
 * 2. Creating a new direct chat, which includes testing the interaction with the add button,
 *    submitting the chat, and closing the modal.
 *
 * Tests involve interacting with the modal's UI elements, performing actions like
 * opening the dropdown, searching for users, clicking on the submit button, and closing
 * the modal. GraphQL mocks are used for testing chat-related queries and mutations,
 * ensuring that the modal behaves as expected when interacting with the GraphQL API.
 */

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing Create Direct Chat Modal [User Portal]', () => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // Deprecated
      removeListener: vi.fn(), // Deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  it('Open and close create new direct chat modal', async () => {
    const mock = [
      ...GROUP_CHAT_BY_ID_QUERY_MOCK,
      ...MESSAGE_SENT_TO_CHAT_MOCK,
      ...UserConnectionListMock,
      ...CHATS_LIST_MOCK,
      ...CHAT_BY_ID_QUERY_MOCK,
      ...CREATE_CHAT_MUTATION_MOCK,
      ...MARK_CHAT_MESSAGES_AS_READ_MOCK,
      ...UNREAD_CHAT_LIST_QUERY_MOCK,
      ...GROUP_CHAT_BY_USER_ID_QUERY_MOCK,
    ];
    render(
      <MockedProvider addTypename={false} mocks={mock}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatComp />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const dropdown = await screen.findByTestId('dropdown');
    expect(dropdown).toBeInTheDocument();
    fireEvent.click(dropdown);
    const newDirectChatBtn = await screen.findByTestId('newDirectChat');
    expect(newDirectChatBtn).toBeInTheDocument();
    fireEvent.click(newDirectChatBtn);

    const submitBtn = await screen.findByTestId('submitBtn');
    expect(submitBtn).toBeInTheDocument();

    const searchInput = (await screen.findByTestId(
      'searchUser',
    )) as HTMLInputElement;
    expect(searchInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'Disha' } });

    expect(searchInput.value).toBe('Disha');

    fireEvent.click(submitBtn);

    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);
  });

  it('create new direct chat', async () => {
    setItem('userId', '1');
    const mock = [
      ...GROUP_CHAT_BY_ID_QUERY_MOCK,
      ...MESSAGE_SENT_TO_CHAT_MOCK,
      ...UserConnectionListMock,
      ...CHATS_LIST_MOCK,
      ...CHAT_BY_ID_QUERY_MOCK,
      ...CREATE_CHAT_MUTATION_MOCK,
      ...MARK_CHAT_MESSAGES_AS_READ_MOCK,
      ...UNREAD_CHAT_LIST_QUERY_MOCK,
      ...GROUP_CHAT_BY_USER_ID_QUERY_MOCK,
    ];
    render(
      <MockedProvider addTypename={false} mocks={mock}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatComp />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const dropdown = await screen.findByTestId('dropdown');
    expect(dropdown).toBeInTheDocument();
    fireEvent.click(dropdown);
    const newDirectChatBtn = await screen.findByTestId('newDirectChat');
    expect(newDirectChatBtn).toBeInTheDocument();
    fireEvent.click(newDirectChatBtn);

    const addBtn = await screen.findAllByTestId('addBtn');
    waitFor(() => {
      expect(addBtn[0]).toBeInTheDocument();
    });

    fireEvent.click(addBtn[0]);

    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);

    await new Promise((resolve) => setTimeout(resolve, 0));

    await wait();
  });

  it('should create chat if a conversation does not with the selected user', async () => {
    const t = ((key: string) => {
      return key;
    }) as TFunction;
    const createChat = vi.fn(async (): Promise<FetchResult<unknown>> => {
      return { data: {} } as FetchResult<unknown>;
    });
    const chatsListRefetch = vi.fn(
      async (): Promise<ApolloQueryResult<unknown>> => {
        return { data: {} } as ApolloQueryResult<unknown>;
      },
    );
    const toggleCreateDirectChatModal = vi.fn();
    const chats: GroupChat[] = [
      {
        _id: '1',
        isGroup: false,
        name: '',
        image: '',
        messages: [],
        unseenMessagesByUsers: '{}',
        users: [
          {
            _id: '1',
            firstName: 'Aaditya',
            lastName: 'Agarwal',
            email: '',
            image: '',
            createdAt: new Date(),
          },
          {
            _id: '3',
            firstName: 'Test',
            lastName: 'User',
            email: '',
            image: '',
            createdAt: new Date(),
          },
        ],
        createdAt: new Date(),
        admins: [],
        description: '',
      },
    ];
    await handleCreateDirectChat(
      '2',
      chats,
      t,
      createChat,
      '1',
      '1',
      chatsListRefetch,
      toggleCreateDirectChatModal,
    );
    expect(createChat).toHaveBeenCalled();
    expect(chatsListRefetch).toHaveBeenCalled();
    expect(toggleCreateDirectChatModal).toHaveBeenCalled();
  });
  it('should not create chat if a conversation already exists with the selected user', async () => {
    const t = ((key: string) => {
      return key;
    }) as TFunction;
    const createChat = vi.fn(async (): Promise<FetchResult<unknown>> => {
      return { data: {} } as FetchResult<unknown>;
    });
    const chatsListRefetch = vi.fn(
      async (): Promise<ApolloQueryResult<unknown>> => {
        return { data: {} } as ApolloQueryResult<unknown>;
      },
    );
    const toggleCreateDirectChatModal = vi.fn();
    const chats: GroupChat[] = [
      {
        _id: '1',
        isGroup: false,
        name: '',
        image: '',
        messages: [],
        unseenMessagesByUsers: '{}',
        users: [
          {
            _id: '1',
            firstName: 'Aaditya',
            lastName: 'Agarwal',
            email: '',
            image: '',
            createdAt: new Date(),
          },
          {
            _id: '2',
            firstName: 'Test',
            lastName: 'User',
            email: '',
            image: '',
            createdAt: new Date(),
          },
        ],
        createdAt: new Date(),
        admins: [],
        description: '',
      },
    ];
    await handleCreateDirectChat(
      '2',
      chats,
      t,
      createChat,
      '1',
      '1',
      chatsListRefetch,
      toggleCreateDirectChatModal,
    );
    expect(createChat).not.toHaveBeenCalled();
    expect(chatsListRefetch).not.toHaveBeenCalled();
    expect(toggleCreateDirectChatModal).not.toHaveBeenCalled();
  });

  it('should handle error if create chat fails', async () => {
    const t = ((key: string) => {
      return key;
    }) as TFunction;
    const createChat = vi.fn(async (): Promise<FetchResult<unknown>> => {
      throw new Error('Error');
    });
    const chatsListRefetch = vi.fn();
    const toggleCreateDirectChatModal = vi.fn();
    const chats: GroupChat[] = [
      {
        _id: '1',
        isGroup: false,
        name: '',
        image: '',
        messages: [],
        unseenMessagesByUsers: '{}',
        users: [
          {
            _id: '1',
            firstName: 'Aaditya',
            lastName: 'Agarwal',
            email: '',
            image: '',
            createdAt: new Date(),
          },
          {
            _id: '3',
            firstName: 'Test',
            lastName: 'User',
            email: '',
            image: '',
            createdAt: new Date(),
          },
        ],
        createdAt: new Date(),
        admins: [],
        description: '',
      },
    ];
    await handleCreateDirectChat(
      '2',
      chats,
      t,
      createChat,
      '1',
      '1',
      chatsListRefetch,
      toggleCreateDirectChatModal,
    );
    expect(createChat).toHaveBeenCalled();
    expect(chatsListRefetch).not.toHaveBeenCalled();
    expect(toggleCreateDirectChatModal).not.toHaveBeenCalled();
  });

  it('should handle existing user without firstName and fallback to "this user"', async () => {
    const t = ((key: string) => {
      return key;
    }) as TFunction;
    const createChat = vi.fn();
    const chatsListRefetch = vi.fn();
    const toggleCreateDirectChatModal = vi.fn();
    const chats: GroupChat[] = [
      {
        _id: '1',
        isGroup: false,
        name: '',
        image: '',
        messages: [],
        unseenMessagesByUsers: '{}',
        users: [
          {
            _id: '1',
            firstName: 'Aaditya',
            lastName: 'Agarwal',
            email: '',
            image: '',
            createdAt: new Date(),
          },
          {
            _id: '2',
            firstName: '',
            lastName: 'User',
            email: '',
            image: '',
            createdAt: new Date(),
          },
        ],
        createdAt: new Date(),
        admins: [],
        description: '',
      },
    ];
    await handleCreateDirectChat(
      '2',
      chats,
      t,
      createChat,
      '1',
      '1',
      chatsListRefetch,
      toggleCreateDirectChatModal,
    );
    expect(createChat).not.toHaveBeenCalled();
    expect(chatsListRefetch).not.toHaveBeenCalled();
    expect(toggleCreateDirectChatModal).not.toHaveBeenCalled();
  });

  it('should handle search form submission with firstName and lastName', async () => {
    setItem('userId', '1');
    const mock = [
      ...GROUP_CHAT_BY_ID_QUERY_MOCK,
      ...MESSAGE_SENT_TO_CHAT_MOCK,
      ...UserConnectionListMock,
      ...CHATS_LIST_MOCK,
      ...CHAT_BY_ID_QUERY_MOCK,
      ...CREATE_CHAT_MUTATION_MOCK,
      ...MARK_CHAT_MESSAGES_AS_READ_MOCK,
      ...UNREAD_CHAT_LIST_QUERY_MOCK,
      ...GROUP_CHAT_BY_USER_ID_QUERY_MOCK,
    ];
    render(
      <MockedProvider addTypename={false} mocks={mock}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatComp />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const dropdown = await screen.findByTestId('dropdown');
    fireEvent.click(dropdown);
    const newDirectChatBtn = await screen.findByTestId('newDirectChat');
    fireEvent.click(newDirectChatBtn);

    const searchInput = (await screen.findByTestId(
      'searchUser',
    )) as HTMLInputElement;

    fireEvent.change(searchInput, { target: { value: 'John Doe' } });
    expect(searchInput.value).toBe('John Doe');

    const submitBtn = await screen.findByTestId('submitBtn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(searchInput).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
  });

  it('should handle search form submission with only firstName', async () => {
    setItem('userId', '1');
    const mock = [
      ...GROUP_CHAT_BY_ID_QUERY_MOCK,
      ...MESSAGE_SENT_TO_CHAT_MOCK,
      ...UserConnectionListMock,
      ...CHATS_LIST_MOCK,
      ...CHAT_BY_ID_QUERY_MOCK,
      ...CREATE_CHAT_MUTATION_MOCK,
      ...MARK_CHAT_MESSAGES_AS_READ_MOCK,
      ...UNREAD_CHAT_LIST_QUERY_MOCK,
      ...GROUP_CHAT_BY_USER_ID_QUERY_MOCK,
    ];
    render(
      <MockedProvider addTypename={false} mocks={mock}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatComp />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const dropdown = await screen.findByTestId('dropdown');
    fireEvent.click(dropdown);
    const newDirectChatBtn = await screen.findByTestId('newDirectChat');
    fireEvent.click(newDirectChatBtn);

    const searchInput = (await screen.findByTestId(
      'searchUser',
    )) as HTMLInputElement;

    fireEvent.change(searchInput, { target: { value: 'John' } });
    expect(searchInput.value).toBe('John');

    const submitBtn = await screen.findByTestId('submitBtn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(searchInput).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
  });

  it('should handle search form submission with empty search (triggering firstName || fallback)', async () => {
    setItem('userId', '1');
    const mock = [
      ...GROUP_CHAT_BY_ID_QUERY_MOCK,
      ...MESSAGE_SENT_TO_CHAT_MOCK,
      ...UserConnectionListMock,
      ...CHATS_LIST_MOCK,
      ...CHAT_BY_ID_QUERY_MOCK,
      ...CREATE_CHAT_MUTATION_MOCK,
      ...MARK_CHAT_MESSAGES_AS_READ_MOCK,
      ...UNREAD_CHAT_LIST_QUERY_MOCK,
      ...GROUP_CHAT_BY_USER_ID_QUERY_MOCK,
    ];
    render(
      <MockedProvider addTypename={false} mocks={mock}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ChatComp />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const dropdown = await screen.findByTestId('dropdown');
    fireEvent.click(dropdown);
    const newDirectChatBtn = await screen.findByTestId('newDirectChat');
    fireEvent.click(newDirectChatBtn);

    const searchInput = (await screen.findByTestId(
      'searchUser',
    )) as HTMLInputElement;

    fireEvent.change(searchInput, { target: { value: ' ' } });
    expect(searchInput.value).toBe(' ');

    const submitBtn = await screen.findByTestId('submitBtn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(searchInput).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
  });
});
