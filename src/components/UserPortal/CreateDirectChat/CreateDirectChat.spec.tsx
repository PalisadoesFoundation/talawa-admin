import React from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { USERS_CONNECTION_LIST } from 'GraphQl/Queries/Queries';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import Chat from '../../../screens/UserPortal/Chat/Chat';
import {
  CREATE_CHAT,
  MARK_CHAT_MESSAGES_AS_READ,
  MESSAGE_SENT_TO_CHAT,
} from 'GraphQl/Mutations/OrganizationMutations';
import {
  CHATS_LIST,
  CHAT_BY_ID,
  GROUP_CHAT_LIST,
  UNREAD_CHAT_LIST,
} from 'GraphQl/Queries/PlugInQueries';
import useLocalStorage from 'utils/useLocalstorage';
import { vi } from 'vitest';
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

const UserConnectionListMock = [
  {
    request: {
      query: USERS_CONNECTION_LIST,
      variables: {
        firstName_contains: '',
        lastName_contains: '',
      },
    },
    result: {
      data: {
        users: [
          {
            user: {
              firstName: 'Deanne',
              lastName: 'Marks',
              image: null,
              _id: '6589389d2caa9d8d69087487',
              email: 'testuser8@example.com',
              createdAt: '2023-04-13T04:53:17.742Z',
              organizationsBlockedBy: [],
              joinedOrganizations: [
                {
                  _id: '6537904485008f171cf29924',
                  name: 'Unity Foundation',
                  image: null,
                  address: {
                    city: 'Queens',
                    countryCode: 'US',
                    dependentLocality: 'Some Dependent Locality',
                    line1: '123 Coffee Street',
                    line2: 'Apartment 501',
                    postalCode: '11427',
                    sortingCode: 'ABC-133',
                    state: 'NYC',
                    __typename: 'Address',
                  },
                  createdAt: '2023-04-13T05:16:52.827Z',
                  creator: {
                    _id: '64378abd85008f171cf2990d',
                    firstName: 'Wilt',
                    lastName: 'Shepherd',
                    image: null,
                    email: 'testsuperadmin@example.com',
                    createdAt: '2023-04-13T04:53:17.742Z',
                    __typename: 'User',
                  },
                  __typename: 'Organization',
                },
                {
                  _id: '6637904485008f171cf29924',
                  name: 'Unity Foundation',
                  image: null,
                  address: {
                    city: 'Staten Island',
                    countryCode: 'US',
                    dependentLocality: 'Some Dependent Locality',
                    line1: '123 church Street',
                    line2: 'Apartment 499',
                    postalCode: '10301',
                    sortingCode: 'ABC-122',
                    state: 'NYC',
                    __typename: 'Address',
                  },
                  createdAt: '2023-04-13T05:16:52.827Z',
                  creator: {
                    _id: '64378abd85008f171cf2990d',
                    firstName: 'Wilt',
                    lastName: 'Shepherd',
                    image: null,
                    email: 'testsuperadmin@example.com',
                    createdAt: '2023-04-13T04:53:17.742Z',
                    __typename: 'User',
                  },
                  __typename: 'Organization',
                },
                {
                  _id: '6737904485008f171cf29924',
                  name: 'Unity Foundation',
                  image: null,
                  address: {
                    city: 'Brooklyn',
                    countryCode: 'US',
                    dependentLocality: 'Sample Dependent Locality',
                    line1: '123 Main Street',
                    line2: 'Apt 456',
                    postalCode: '10004',
                    sortingCode: 'ABC-789',
                    state: 'NY',
                    __typename: 'Address',
                  },
                  createdAt: '2023-04-13T05:16:52.827Z',
                  creator: {
                    _id: '64378abd85008f171cf2990d',
                    firstName: 'Wilt',
                    lastName: 'Shepherd',
                    image: null,
                    email: 'testsuperadmin@example.com',
                    createdAt: '2023-04-13T04:53:17.742Z',
                    __typename: 'User',
                  },
                  __typename: 'Organization',
                },
                {
                  _id: '6437904485008f171cf29924',
                  name: 'Unity Foundation',
                  image: null,
                  address: {
                    city: 'Bronx',
                    countryCode: 'US',
                    dependentLocality: 'Some Dependent Locality',
                    line1: '123 Random Street',
                    line2: 'Apartment 456',
                    postalCode: '10451',
                    sortingCode: 'ABC-123',
                    state: 'NYC',
                    __typename: 'Address',
                  },
                  createdAt: '2023-04-13T05:16:52.827Z',
                  creator: {
                    _id: '64378abd85008f171cf2990d',
                    firstName: 'Wilt',
                    lastName: 'Shepherd',
                    image: null,
                    email: 'testsuperadmin@example.com',
                    createdAt: '2023-04-13T04:53:17.742Z',
                    __typename: 'User',
                  },
                  __typename: 'Organization',
                },
              ],
              __typename: 'User',
            },
            appUserProfile: {
              _id: '64378abd85308f171cf2993d',
              adminFor: [],
              isSuperAdmin: false,
              createdOrganizations: [],
              createdEvents: [],
              eventAdmin: [],
              __typename: 'AppUserProfile',
            },
            __typename: 'UserData',
          },
        ],
      },
    },
  },
  {
    request: {
      query: USERS_CONNECTION_LIST,
      variables: {
        firstName_contains: 'Disha',
        lastName_contains: '',
      },
    },
    result: {
      data: {
        users: [
          {
            user: {
              firstName: 'Deanne',
              lastName: 'Marks',
              image: null,
              _id: '6589389d2caa9d8d69087487',
              email: 'testuser8@example.com',
              createdAt: '2023-04-13T04:53:17.742Z',
              organizationsBlockedBy: [],
              joinedOrganizations: [
                {
                  _id: '6537904485008f171cf29924',
                  name: 'Unity Foundation',
                  image: null,
                  address: {
                    city: 'Queens',
                    countryCode: 'US',
                    dependentLocality: 'Some Dependent Locality',
                    line1: '123 Coffee Street',
                    line2: 'Apartment 501',
                    postalCode: '11427',
                    sortingCode: 'ABC-133',
                    state: 'NYC',
                    __typename: 'Address',
                  },
                  createdAt: '2023-04-13T05:16:52.827Z',
                  creator: {
                    _id: '64378abd85008f171cf2990d',
                    firstName: 'Wilt',
                    lastName: 'Shepherd',
                    image: null,
                    email: 'testsuperadmin@example.com',
                    createdAt: '2023-04-13T04:53:17.742Z',
                    __typename: 'User',
                  },
                  __typename: 'Organization',
                },
                {
                  _id: '6637904485008f171cf29924',
                  name: 'Unity Foundation',
                  image: null,
                  address: {
                    city: 'Staten Island',
                    countryCode: 'US',
                    dependentLocality: 'Some Dependent Locality',
                    line1: '123 church Street',
                    line2: 'Apartment 499',
                    postalCode: '10301',
                    sortingCode: 'ABC-122',
                    state: 'NYC',
                    __typename: 'Address',
                  },
                  createdAt: '2023-04-13T05:16:52.827Z',
                  creator: {
                    _id: '64378abd85008f171cf2990d',
                    firstName: 'Wilt',
                    lastName: 'Shepherd',
                    image: null,
                    email: 'testsuperadmin@example.com',
                    createdAt: '2023-04-13T04:53:17.742Z',
                    __typename: 'User',
                  },
                  __typename: 'Organization',
                },
                {
                  _id: '6737904485008f171cf29924',
                  name: 'Unity Foundation',
                  image: null,
                  address: {
                    city: 'Brooklyn',
                    countryCode: 'US',
                    dependentLocality: 'Sample Dependent Locality',
                    line1: '123 Main Street',
                    line2: 'Apt 456',
                    postalCode: '10004',
                    sortingCode: 'ABC-789',
                    state: 'NY',
                    __typename: 'Address',
                  },
                  createdAt: '2023-04-13T05:16:52.827Z',
                  creator: {
                    _id: '64378abd85008f171cf2990d',
                    firstName: 'Wilt',
                    lastName: 'Shepherd',
                    image: null,
                    email: 'testsuperadmin@example.com',
                    createdAt: '2023-04-13T04:53:17.742Z',
                    __typename: 'User',
                  },
                  __typename: 'Organization',
                },
                {
                  _id: '6437904485008f171cf29924',
                  name: 'Unity Foundation',
                  image: null,
                  address: {
                    city: 'Bronx',
                    countryCode: 'US',
                    dependentLocality: 'Some Dependent Locality',
                    line1: '123 Random Street',
                    line2: 'Apartment 456',
                    postalCode: '10451',
                    sortingCode: 'ABC-123',
                    state: 'NYC',
                    __typename: 'Address',
                  },
                  createdAt: '2023-04-13T05:16:52.827Z',
                  creator: {
                    _id: '64378abd85008f171cf2990d',
                    firstName: 'Wilt',
                    lastName: 'Shepherd',
                    image: null,
                    email: 'testsuperadmin@example.com',
                    createdAt: '2023-04-13T04:53:17.742Z',
                    __typename: 'User',
                  },
                  __typename: 'Organization',
                },
              ],
              __typename: 'User',
            },
            appUserProfile: {
              _id: '64378abd85308f171cf2993d',
              adminFor: [],
              isSuperAdmin: false,
              createdOrganizations: [],
              createdEvents: [],
              eventAdmin: [],
              __typename: 'AppUserProfile',
            },
            __typename: 'UserData',
          },
        ],
      },
    },
  },
];

const MESSAGE_SENT_TO_CHAT_MOCK = [
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
          chatMessageBelongsTo: {
            _id: '1',
          },
          createdAt: '2024-07-10T17:16:33.248Z',
          messageContent: 'Test ',
          type: 'STRING',
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
          chatMessageBelongsTo: {
            _id: '1',
          },
          createdAt: '2024-07-10T17:16:33.248Z',
          messageContent: 'Test ',
          replyTo: null,
          type: 'STRING',
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
          chatMessageBelongsTo: {
            _id: '1',
          },
          createdAt: '2024-07-10T17:16:33.248Z',
          messageContent: 'Test ',
          replyTo: null,
          type: 'STRING',
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

const CHAT_BY_ID_QUERY_MOCK = [
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
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
              replyTo: null,
              media: null,
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
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
              replyTo: null,
              media: null,
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
          }),
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
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
              replyTo: null,
              media: null,
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
          }),
        },
      },
    },
  },
];

const UNREAD_CHAT_LIST_QUERY_MOCK = [
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
              replyTo: null,
              media: null,
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
              replyTo: null,
              media: null,
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
              replyTo: null,
              media: null,
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
              replyTo: null,
              media: null,
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
              replyTo: null,
              media: null,
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
              replyTo: null,
              media: null,
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
              replyTo: null,
              media: null,
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
              replyTo: null,
              media: null,
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
              replyTo: null,
              media: null,
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
          }),
        },
      },
    },
  },
];

const GROUP_CHAT_BY_USER_ID_QUERY_MOCK = [
  {
    request: {
      query: GROUP_CHAT_LIST,
      variables: {},
    },
    result: {
      data: {
        getGroupChatsByUserId: {
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
              replyTo: null,
              media: null,
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
              replyTo: null,
              media: null,
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
              replyTo: null,
              media: null,
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
          }),
        },
      },
    },
  },
];

const CHATS_LIST_MOCK = [
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
            image: null,
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
                replyTo: null,
                media: null,
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
          {
            _id: '65844efc814ddgh4003db811c4',
            isGroup: true,
            image: null,
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
                replyTo: null,
                media: null,
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
            admins: [],
            unseenMessagesByUsers: JSON.stringify({
              '1': 1,
              '2': 1,
              '3': 1,
              '4': 1,
              '5': 1,
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
        id: null,
      },
    },
    result: {
      data: {
        chatsByUserId: [
          {
            _id: '65844efc814dd40fgh03db811c4',
            isGroup: true,
            image: null,
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
                replyTo: null,
                media: null,
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
          {
            _id: '65844efc814ddgh4003db811c4',
            isGroup: true,
            image: null,
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
                replyTo: null,
                media: null,
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
            admins: [],
            unseenMessagesByUsers: JSON.stringify({
              '1': 1,
              '2': 1,
              '3': 1,
              '4': 1,
              '5': 1,
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
        id: null,
      },
    },
    result: {
      data: {
        chatsByUserId: [
          {
            _id: '65844efc814dd40fgh03db811c4',
            isGroup: true,
            image: null,
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
                replyTo: null,
                media: null,
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
          {
            _id: '65844efc814ddgh4003db811c4',
            isGroup: true,
            image: null,
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
                replyTo: null,
                media: null,
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
            admins: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@example.com',
                image: '',
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
            unseenMessagesByUsers: JSON.stringify({
              '1': 1,
              '2': 1,
              '3': 1,
              '4': 1,
              '5': 1,
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
        id: null,
      },
    },
    result: {
      data: {
        chatsByUserId: [
          {
            _id: '65844efc814dd40fgh03db811c4',
            isGroup: true,
            image: null,
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
                replyTo: null,
                media: null,
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
          {
            _id: '65844efc814ddgh4003db811c4',
            isGroup: true,
            image: null,
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
                replyTo: null,
                media: null,
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
            admins: [],
            unseenMessagesByUsers: JSON.stringify({
              '1': 1,
              '2': 1,
              '3': 1,
              '4': 1,
              '5': 1,
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
        id: null,
      },
    },
    result: {
      data: {
        chatsByUserId: [
          {
            _id: '65844efc814dd40fgh03db811c4',
            isGroup: true,
            image: null,
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
                replyTo: null,
                media: null,
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
          {
            _id: '65844efc814ddgh4003db811c4',
            isGroup: true,
            image: null,
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
                replyTo: null,
                media: null,
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
            admins: [],
            unseenMessagesByUsers: JSON.stringify({
              '1': 1,
              '2': 1,
              '3': 1,
              '4': 1,
              '5': 1,
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
        id: '',
      },
    },
    result: {
      data: {
        chatsByUserId: [
          {
            _id: '65844ghjefc814dd4003db811c4',
            isGroup: true,
            image: null,
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
                replyTo: null,
                media: null,
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
          {
            _id: 'ujhgtrdtyuiop',
            isGroup: true,
            image: null,
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
                replyTo: null,
                media: null,
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
            unseenMessagesByUsers: JSON.stringify({
              '1': 1,
              '2': 1,
              '3': 1,
              '4': 1,
              '5': 1,
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
        id: '1',
      },
    },
    result: {
      data: {
        chatsByUserId: [
          {
            _id: '65844efc814dhjmkdftyd4003db811c4',
            isGroup: true,
            image: null,
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
                replyTo: null,
                media: null,
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
          {
            _id: '65844ewsedrffc814dd4003db811c4',
            isGroup: true,
            image: null,
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
                replyTo: null,
                media: null,
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
            image: null,
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
                replyTo: null,
                media: null,
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
          {
            _id: '65844ewsedrffc814dd4003db811c4',
            isGroup: true,
            image: null,
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
                replyTo: null,
                media: null,
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
            image: null,
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
                media: null,
                createdAt: '345678908765',
                messageContent: 'Hello',
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
          {
            _id: '65844ewsedrffc814dd4003db811c4',
            isGroup: true,
            image: null,
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
                replyTo: null,
                media: null,
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
            image: null,
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
                replyTo: null,
                media: null,
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
          {
            _id: '65844ewsedrffc814dd4003db811c4',
            isGroup: true,
            image: null,
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
                replyTo: null,
                media: null,
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
            image: null,
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
                replyTo: null,
                media: null,
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
          {
            _id: '65844ewsedrffc814dd4003db811c4',
            isGroup: true,
            image: null,
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
                replyTo: null,
                media: null,
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
        ],
      },
    },
  },
];

const GROUP_CHAT_BY_ID_QUERY_MOCK = [
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
          image: null,
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
              replyTo: null,
              media: null,
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

const CREATE_CHAT_MUTATION_MOCK = [
  {
    request: {
      query: CREATE_CHAT,
      variables: {
        organizationId: undefined,
        userIds: ['1', '6589389d2caa9d8d69087487'],
        isGroup: false,
      },
    },
    result: {
      data: {
        createChat: {
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
              replyTo: null,
              type: 'STRING',
              media: null,
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
          unseenMessagesByUsers: JSON.stringify({
            '1': 1,
            '2': 1,
          }),
        },
      },
    },
  },
];

const MARK_CHAT_MESSAGES_AS_READ_MOCK = [
  {
    request: {
      query: MARK_CHAT_MESSAGES_AS_READ,
      variables: {
        userId: null,
        chatId: '',
      },
    },
    result: {
      data: {
        markChatMessagesAsRead: {
          _id: '1',
        },
      },
    },
  },
  {
    request: {
      query: MARK_CHAT_MESSAGES_AS_READ,
      variables: {
        userId: null,
        chatId: '',
      },
    },
    result: {
      data: {
        markChatMessagesAsRead: {
          _id: '1',
        },
      },
    },
  },
  {
    request: {
      query: MARK_CHAT_MESSAGES_AS_READ,
      variables: {
        userId: null,
        chatId: '',
      },
    },
    result: {
      data: {
        markChatMessagesAsRead: {
          _id: '1',
        },
      },
    },
  },
  {
    request: {
      query: MARK_CHAT_MESSAGES_AS_READ,
      variables: {
        userId: null,
        chatId: '',
      },
    },
    result: {
      data: {
        markChatMessagesAsRead: {
          _id: '1',
        },
      },
    },
  },
  {
    request: {
      query: MARK_CHAT_MESSAGES_AS_READ,
      variables: {
        userId: '1',
        chatId: '',
      },
    },
    result: {
      data: {
        markChatMessagesAsRead: {
          _id: '1',
        },
      },
    },
  },
  {
    request: {
      query: MARK_CHAT_MESSAGES_AS_READ,
      variables: {
        userId: '1',
        chatId: '',
      },
    },
    result: {
      data: {
        markChatMessagesAsRead: {
          _id: '1',
        },
      },
    },
  },
];
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
              <Chat />
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
              <Chat />
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

    await new Promise(process.nextTick);

    await wait();
  });
});
