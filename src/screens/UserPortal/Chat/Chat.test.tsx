import React, { act } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider, useTranslation } from 'react-i18next';

import {
  DIRECT_CHATS_LIST,
  USERS_CONNECTION_LIST,
  USER_JOINED_ORGANIZATIONS,
} from 'GraphQl/Queries/Queries';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import Chat from './Chat';
import {
  MESSAGE_SENT_TO_DIRECT_CHAT,
  MESSAGE_SENT_TO_GROUP_CHAT,
} from 'GraphQl/Mutations/OrganizationMutations';
import {
  DIRECT_CHAT_BY_ID,
  GROUP_CHAT_BY_ID,
  GROUP_CHAT_LIST,
} from 'GraphQl/Queries/PlugInQueries';
import useLocalStorage from 'utils/useLocalstorage';

const { setItem } = useLocalStorage();

const MOCKS = [
  {
    request: {
      query: GROUP_CHAT_LIST,
      variables: {
        id: null,
      },
    },
    result: {
      data: {
        groupChatsByUserId: [
          {
            _id: '1',
            creator: {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
            },
            messages: {
              _id: '1',
              createdAt: '',
              messageContent: 'Hello',
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@email.com',
              },
            },
            title: 'Test GroupChat',
            organization: {
              _id: '1',
              name: 'Test Org',
            },
            users: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@email.com',
                image: 'img',
              },
            ],
          },
          {
            _id: '2',
            creator: {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
            },
            messages: {
              _id: '1',
              createdAt: '',
              messageContent: 'Hello',
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@email.com',
              },
            },
            title: 'Test GroupChat',
            organization: {
              _id: '1',
              name: 'Test Org',
            },
            users: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@email.com',
                image: 'img',
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: GROUP_CHAT_LIST,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        groupChatsByUserId: [
          {
            _id: '1',
            creator: {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
            },
            messages: {
              _id: '1',
              createdAt: '',
              messageContent: 'Hello',
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@email.com',
              },
            },
            title: 'Test GroupChat',
            organization: {
              _id: '1',
              name: 'Test Org',
            },
            users: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@email.com',
                image: 'img',
              },
            ],
          },
          {
            _id: '2',
            creator: {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
            },
            messages: {
              _id: '1',
              createdAt: '',
              messageContent: 'Hello',
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@email.com',
              },
            },
            title: 'Test GroupChat',
            organization: {
              _id: '1',
              name: 'Test Org',
            },
            users: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@email.com',
                image: 'img',
              },
            ],
          },
        ],
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
        groupChatsByUserId: [
          {
            _id: '1',
            creator: {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
            },
            messages: {
              _id: '1',
              createdAt: '',
              messageContent: 'Hello',
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@email.com',
              },
            },
            title: 'Test GroupChat',
            organization: {
              _id: '1',
              name: 'Test Org',
            },
            users: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@email.com',
                image: 'img',
              },
            ],
          },
          {
            _id: '1',
            creator: {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
            },
            messages: {
              _id: '1',
              createdAt: '',
              messageContent: 'Hello',
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@email.com',
              },
            },
            title: 'Test GroupChat',
            organization: {
              _id: '1',
              name: 'Test Org',
            },
            users: [
              {
                _id: '1',
                firstName: 'Disha',
                lastName: 'Talreja',
                email: 'disha@email.com',
                image: 'img',
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: DIRECT_CHATS_LIST,
      variables: {
        id: null,
      },
    },
    result: {
      data: {
        directChatsByUserID: [
          {
            _id: '666c88dd92e995354d98527c',
            creator: {
              _id: '65378abd85008f171cf2990d',
              firstName: 'Vyvyan',
              lastName: 'Kerry',
              email: 'testadmin1@example.com',
              __typename: 'User',
            },
            messages: [
              {
                _id: '668930bae43ce54e6e302cf1',
                createdAt: '2024-07-06T11:55:38.933Z',
                messageContent: 'hJnkank',
                receiver: {
                  _id: '65378abd85008f171cf2990d',
                  firstName: 'Vyvyan',
                  lastName: 'Kerry',
                  email: 'testadmin1@example.com',
                  __typename: 'User',
                },
                sender: {
                  _id: '64378abd85008f171cf2990d',
                  firstName: 'Wilt',
                  lastName: 'Shepherd',
                  email: 'testsuperadmin@example.com',
                  __typename: 'User',
                },
                __typename: 'DirectChatMessage',
              },
            ],
            organization: {
              _id: '6737904485008f171cf29924',
              name: 'Unity Foundation',
              __typename: 'Organization',
            },
            users: [
              {
                _id: '64378abd85008f171cf2990d',
                firstName: 'Wilt',
                lastName: 'Shepherd',
                email: 'testsuperadmin@example.com',
                image: null,
                __typename: 'User',
              },
              {
                _id: '65378abd85008f171cf2990d',
                firstName: 'Vyvyan',
                lastName: 'Kerry',
                email: 'testadmin1@example.com',
                image: null,
                __typename: 'User',
              },
            ],
            __typename: 'DirectChat',
          },
          {
            _id: '666f09c892e995354d98a5ee',
            creator: {
              _id: '67378abd85008f171cf2990d',
              firstName: 'Darcy',
              lastName: 'Wilf',
              email: 'testadmin3@example.com',
              __typename: 'User',
            },
            messages: [
              {
                _id: '6676932692e995354d98ab7f',
                createdAt: '2024-06-22T09:02:30.776Z',
                messageContent: 'hii',
                receiver: {
                  _id: '67378abd85008f171cf2990d',
                  firstName: 'Darcy',
                  lastName: 'Wilf',
                  email: 'testadmin3@example.com',
                  __typename: 'User',
                },
                sender: {
                  _id: '64378abd85008f171cf2990d',
                  firstName: 'Wilt',
                  lastName: 'Shepherd',
                  email: 'testsuperadmin@example.com',
                  __typename: 'User',
                },
                __typename: 'DirectChatMessage',
              },
            ],
            organization: {
              _id: '6737904485008f171cf29924',
              name: 'Unity Foundation',
              __typename: 'Organization',
            },
            users: [
              {
                _id: '64378abd85008f171cf2990d',
                firstName: 'Wilt',
                lastName: 'Shepherd',
                email: 'testsuperadmin@example.com',
                image: null,
                __typename: 'User',
              },
              {
                _id: '67378abd85008f171cf2990d',
                firstName: 'Darcy',
                lastName: 'Wilf',
                email: 'testadmin3@example.com',
                image: null,
                __typename: 'User',
              },
            ],
            __typename: 'DirectChat',
          },
        ],
      },
    },
  },
  {
    request: {
      query: DIRECT_CHATS_LIST,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        directChatsByUserID: [
          {
            _id: '666c88dd92e995354d98527c',
            creator: {
              _id: '65378abd85008f171cf2990d',
              firstName: 'Vyvyan',
              lastName: 'Kerry',
              email: 'testadmin1@example.com',
              __typename: 'User',
            },
            messages: [
              {
                _id: '668930bae43ce54e6e302cf1',
                createdAt: '2024-07-06T11:55:38.933Z',
                messageContent: 'hJnkank',
                receiver: {
                  _id: '65378abd85008f171cf2990d',
                  firstName: 'Vyvyan',
                  lastName: 'Kerry',
                  email: 'testadmin1@example.com',
                  __typename: 'User',
                },
                sender: {
                  _id: '64378abd85008f171cf2990d',
                  firstName: 'Wilt',
                  lastName: 'Shepherd',
                  email: 'testsuperadmin@example.com',
                  __typename: 'User',
                },
                __typename: 'DirectChatMessage',
              },
            ],
            organization: {
              _id: '6737904485008f171cf29924',
              name: 'Unity Foundation',
              __typename: 'Organization',
            },
            users: [
              {
                _id: '64378abd85008f171cf2990d',
                firstName: 'Wilt',
                lastName: 'Shepherd',
                email: 'testsuperadmin@example.com',
                image: null,
                __typename: 'User',
              },
              {
                _id: '65378abd85008f171cf2990d',
                firstName: 'Vyvyan',
                lastName: 'Kerry',
                email: 'testadmin1@example.com',
                image: null,
                __typename: 'User',
              },
            ],
            __typename: 'DirectChat',
          },
          {
            _id: '666f09c892e995354d98a5ee',
            creator: {
              _id: '67378abd85008f171cf2990d',
              firstName: 'Darcy',
              lastName: 'Wilf',
              email: 'testadmin3@example.com',
              __typename: 'User',
            },
            messages: [
              {
                _id: '6676932692e995354d98ab7f',
                createdAt: '2024-06-22T09:02:30.776Z',
                messageContent: 'hii',
                receiver: {
                  _id: '67378abd85008f171cf2990d',
                  firstName: 'Darcy',
                  lastName: 'Wilf',
                  email: 'testadmin3@example.com',
                  __typename: 'User',
                },
                sender: {
                  _id: '64378abd85008f171cf2990d',
                  firstName: 'Wilt',
                  lastName: 'Shepherd',
                  email: 'testsuperadmin@example.com',
                  __typename: 'User',
                },
                __typename: 'DirectChatMessage',
              },
            ],
            organization: {
              _id: '6737904485008f171cf29924',
              name: 'Unity Foundation',
              __typename: 'Organization',
            },
            users: [
              {
                _id: '64378abd85008f171cf2990d',
                firstName: 'Wilt',
                lastName: 'Shepherd',
                email: 'testsuperadmin@example.com',
                image: null,
                __typename: 'User',
              },
              {
                _id: '67378abd85008f171cf2990d',
                firstName: 'Darcy',
                lastName: 'Wilf',
                email: 'testadmin3@example.com',
                image: null,
                __typename: 'User',
              },
            ],
            __typename: 'DirectChat',
          },
        ],
      },
    },
  },
  {
    request: {
      query: DIRECT_CHATS_LIST,
      variables: {
        id: '',
      },
    },
    result: {
      data: {
        directChatsByUserID: [
          {
            _id: '666c88dd92e995354d98527c',
            creator: {
              _id: '65378abd85008f171cf2990d',
              firstName: 'Vyvyan',
              lastName: 'Kerry',
              email: 'testadmin1@example.com',
              __typename: 'User',
            },
            messages: [
              {
                _id: '668930bae43ce54e6e302cf1',
                createdAt: '2024-07-06T11:55:38.933Z',
                messageContent: 'hJnkank',
                receiver: {
                  _id: '65378abd85008f171cf2990d',
                  firstName: 'Vyvyan',
                  lastName: 'Kerry',
                  email: 'testadmin1@example.com',
                  __typename: 'User',
                },
                sender: {
                  _id: '64378abd85008f171cf2990d',
                  firstName: 'Wilt',
                  lastName: 'Shepherd',
                  email: 'testsuperadmin@example.com',
                  __typename: 'User',
                },
                __typename: 'DirectChatMessage',
              },
            ],
            organization: {
              _id: '6737904485008f171cf29924',
              name: 'Unity Foundation',
              __typename: 'Organization',
            },
            users: [
              {
                _id: '64378abd85008f171cf2990d',
                firstName: 'Wilt',
                lastName: 'Shepherd',
                email: 'testsuperadmin@example.com',
                image: null,
                __typename: 'User',
              },
              {
                _id: '65378abd85008f171cf2990d',
                firstName: 'Vyvyan',
                lastName: 'Kerry',
                email: 'testadmin1@example.com',
                image: null,
                __typename: 'User',
              },
            ],
            __typename: 'DirectChat',
          },
          {
            _id: '666f09c892e995354d98a5ee',
            creator: {
              _id: '67378abd85008f171cf2990d',
              firstName: 'Darcy',
              lastName: 'Wilf',
              email: 'testadmin3@example.com',
              __typename: 'User',
            },
            messages: [
              {
                _id: '6676932692e995354d98ab7f',
                createdAt: '2024-06-22T09:02:30.776Z',
                messageContent: 'hii',
                receiver: {
                  _id: '67378abd85008f171cf2990d',
                  firstName: 'Darcy',
                  lastName: 'Wilf',
                  email: 'testadmin3@example.com',
                  __typename: 'User',
                },
                sender: {
                  _id: '64378abd85008f171cf2990d',
                  firstName: 'Wilt',
                  lastName: 'Shepherd',
                  email: 'testsuperadmin@example.com',
                  __typename: 'User',
                },
                __typename: 'DirectChatMessage',
              },
            ],
            organization: {
              _id: '6737904485008f171cf29924',
              name: 'Unity Foundation',
              __typename: 'Organization',
            },
            users: [
              {
                _id: '64378abd85008f171cf2990d',
                firstName: 'Wilt',
                lastName: 'Shepherd',
                email: 'testsuperadmin@example.com',
                image: null,
                __typename: 'User',
              },
              {
                _id: '67378abd85008f171cf2990d',
                firstName: 'Darcy',
                lastName: 'Wilf',
                email: 'testadmin3@example.com',
                image: null,
                __typename: 'User',
              },
            ],
            __typename: 'DirectChat',
          },
        ],
      },
    },
  },
];

const USER_JOINED_ORG_MOCK = [
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        users: [
          {
            user: {
              joinedOrganizations: [
                {
                  __typename: 'Organization',
                  _id: '6401ff65ce8e8406b8f07af2',
                  name: 'Any Organization',
                  image: '',
                  description: 'New Desc',
                  address: {
                    city: 'abc',
                    countryCode: '123',
                    postalCode: '456',
                    state: 'def',
                    dependentLocality: 'ghi',
                    line1: 'asdfg',
                    line2: 'dfghj',
                    sortingCode: '4567',
                  },
                  createdAt: '1234567890',
                  userRegistrationRequired: true,
                  creator: {
                    __typename: 'User',
                    firstName: 'John',
                    lastName: 'Doe',
                  },
                  members: [
                    {
                      _id: '56gheqyr7deyfuiwfewifruy8',
                      user: {
                        _id: '45ydeg2yet721rtgdu32ry',
                      },
                    },
                  ],
                  admins: [
                    {
                      _id: '45gj5678jk45678fvgbhnr4rtgh',
                      user: {
                        _id: '45ydeg2yet721rtgdu32ry',
                      },
                    },
                  ],
                  membershipRequests: [
                    {
                      _id: '56gheqyr7deyfuiwfewifruy8',
                      user: {
                        _id: '45ydeg2yet721rtgdu32ry',
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        users: [
          {
            user: {
              joinedOrganizations: [
                {
                  __typename: 'Organization',
                  _id: '6401ff65ce8e8406b8f07af2',
                  name: 'Any Organization',
                  image: '',
                  description: 'New Desc',
                  address: {
                    city: 'abc',
                    countryCode: '123',
                    postalCode: '456',
                    state: 'def',
                    dependentLocality: 'ghi',
                    line1: 'asdfg',
                    line2: 'dfghj',
                    sortingCode: '4567',
                  },
                  createdAt: '1234567890',
                  userRegistrationRequired: true,
                  creator: {
                    __typename: 'User',
                    firstName: 'John',
                    lastName: 'Doe',
                  },
                  members: [
                    {
                      _id: '56gheqyr7deyfuiwfewifruy8',
                      user: {
                        _id: '45ydeg2yet721rtgdu32ry',
                      },
                    },
                  ],
                  admins: [
                    {
                      _id: '45gj5678jk45678fvgbhnr4rtgh',
                      user: {
                        _id: '45ydeg2yet721rtgdu32ry',
                      },
                    },
                  ],
                  membershipRequests: [
                    {
                      _id: '56gheqyr7deyfuiwfewifruy8',
                      user: {
                        _id: '45ydeg2yet721rtgdu32ry',
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        users: [
          {
            user: {
              joinedOrganizations: [
                {
                  __typename: 'Organization',
                  _id: '6401ff65ce8e8406b8f07af2',
                  name: 'Any Organization',
                  image: '',
                  description: 'New Desc',
                  address: {
                    city: 'abc',
                    countryCode: '123',
                    postalCode: '456',
                    state: 'def',
                    dependentLocality: 'ghi',
                    line1: 'asdfg',
                    line2: 'dfghj',
                    sortingCode: '4567',
                  },
                  createdAt: '1234567890',
                  userRegistrationRequired: true,
                  creator: {
                    __typename: 'User',
                    firstName: 'John',
                    lastName: 'Doe',
                  },
                  members: [
                    {
                      _id: '56gheqyr7deyfuiwfewifruy8',
                      user: {
                        _id: '45ydeg2yet721rtgdu32ry',
                      },
                    },
                  ],
                  admins: [
                    {
                      _id: '45gj5678jk45678fvgbhnr4rtgh',
                      user: {
                        _id: '45ydeg2yet721rtgdu32ry',
                      },
                    },
                  ],
                  membershipRequests: [
                    {
                      _id: '56gheqyr7deyfuiwfewifruy8',
                      user: {
                        _id: '45ydeg2yet721rtgdu32ry',
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS,
      variables: {
        id: null,
      },
    },
    result: {
      data: {
        users: [
          {
            user: {
              joinedOrganizations: [
                {
                  __typename: 'Organization',
                  _id: '6401ff65ce8e8406b8f07af2',
                  name: 'Any Organization',
                  image: '',
                  description: 'New Desc',
                  address: {
                    city: 'abc',
                    countryCode: '123',
                    postalCode: '456',
                    state: 'def',
                    dependentLocality: 'ghi',
                    line1: 'asdfg',
                    line2: 'dfghj',
                    sortingCode: '4567',
                  },
                  createdAt: '1234567890',
                  userRegistrationRequired: true,
                  creator: {
                    __typename: 'User',
                    firstName: 'John',
                    lastName: 'Doe',
                  },
                  members: [
                    {
                      _id: '56gheqyr7deyfuiwfewifruy8',
                      user: {
                        _id: '45ydeg2yet721rtgdu32ry',
                      },
                    },
                  ],
                  admins: [
                    {
                      _id: '45gj5678jk45678fvgbhnr4rtgh',
                      user: {
                        _id: '45ydeg2yet721rtgdu32ry',
                      },
                    },
                  ],
                  membershipRequests: [
                    {
                      _id: '56gheqyr7deyfuiwfewifruy8',
                      user: {
                        _id: '45ydeg2yet721rtgdu32ry',
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS,
      variables: {
        id: null,
      },
    },
    result: {
      data: {
        users: [
          {
            user: {
              joinedOrganizations: [
                {
                  __typename: 'Organization',
                  _id: '6401ff65ce8e8406b8f07af2',
                  name: 'Any Organization',
                  image: '',
                  description: 'New Desc',
                  address: {
                    city: 'abc',
                    countryCode: '123',
                    postalCode: '456',
                    state: 'def',
                    dependentLocality: 'ghi',
                    line1: 'asdfg',
                    line2: 'dfghj',
                    sortingCode: '4567',
                  },
                  createdAt: '1234567890',
                  userRegistrationRequired: true,
                  creator: {
                    __typename: 'User',
                    firstName: 'John',
                    lastName: 'Doe',
                  },
                  members: [
                    {
                      _id: '56gheqyr7deyfuiwfewifruy8',
                      user: {
                        _id: '45ydeg2yet721rtgdu32ry',
                      },
                    },
                  ],
                  admins: [
                    {
                      _id: '45gj5678jk45678fvgbhnr4rtgh',
                      user: {
                        _id: '45ydeg2yet721rtgdu32ry',
                      },
                    },
                  ],
                  membershipRequests: [
                    {
                      _id: '56gheqyr7deyfuiwfewifruy8',
                      user: {
                        _id: '45ydeg2yet721rtgdu32ry',
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS,
      variables: {
        id: null,
      },
    },
    result: {
      data: {
        users: [
          {
            user: {
              joinedOrganizations: [
                {
                  __typename: 'Organization',
                  _id: '6401ff65ce8e8406b8f07af2',
                  name: 'Any Organization',
                  image: '',
                  description: 'New Desc',
                  address: {
                    city: 'abc',
                    countryCode: '123',
                    postalCode: '456',
                    state: 'def',
                    dependentLocality: 'ghi',
                    line1: 'asdfg',
                    line2: 'dfghj',
                    sortingCode: '4567',
                  },
                  createdAt: '1234567890',
                  userRegistrationRequired: true,
                  creator: {
                    __typename: 'User',
                    firstName: 'John',
                    lastName: 'Doe',
                  },
                  members: [
                    {
                      _id: '56gheqyr7deyfuiwfewifruy8',
                      user: {
                        _id: '45ydeg2yet721rtgdu32ry',
                      },
                    },
                  ],
                  admins: [
                    {
                      _id: '45gj5678jk45678fvgbhnr4rtgh',
                      user: {
                        _id: '45ydeg2yet721rtgdu32ry',
                      },
                    },
                  ],
                  membershipRequests: [
                    {
                      _id: '56gheqyr7deyfuiwfewifruy8',
                      user: {
                        _id: '45ydeg2yet721rtgdu32ry',
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    },
  },
];

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
        firstName_contains: '',
        lastName_contains: '',
      },
    },
    result: {
      data: {
        users: {
          user: [
            {
              firstName: 'Disha',
              lastName: 'Talreja',
              image: 'img',
              _id: '1',
              email: 'disha@email.com',
              createdAt: '',
              appUserProfile: {
                _id: '12',
                isSuperAdmin: 'false',
                createdOrganizations: {
                  _id: '345678',
                },
                createdEvents: {
                  _id: '34567890',
                },
              },
              organizationsBlockedBy: [],
              joinedOrganizations: [],
            },
            {
              firstName: 'Disha',
              lastName: 'Talreja',
              image: 'img',
              _id: '1',
              email: 'disha@email.com',
              createdAt: '',
              appUserProfile: {
                _id: '12',
                isSuperAdmin: 'false',
                createdOrganizations: {
                  _id: '345678',
                },
                createdEvents: {
                  _id: '34567890',
                },
              },
              organizationsBlockedBy: [],
              joinedOrganizations: [],
            },
            {
              firstName: 'Disha',
              lastName: 'Talreja',
              image: 'img',
              _id: '1',
              email: 'disha@email.com',
              createdAt: '',
              appUserProfile: {
                _id: '12',
                isSuperAdmin: 'false',
                createdOrganizations: {
                  _id: '345678',
                },
                createdEvents: {
                  _id: '34567890',
                },
              },
              organizationsBlockedBy: [],
              joinedOrganizations: [],
            },
          ],
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
        id: '',
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
        id: null,
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
        id: null,
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

const resizeWindow = (width: number): void => {
  window.innerWidth = width;
  fireEvent(window, new Event('resize'));
};

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing Chat Screen [User Portal]', () => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  test('Screen should be rendered properly', async () => {
    const mock = [
      ...USER_JOINED_ORG_MOCK,
      ...GROUP_CHAT_BY_ID_QUERY_MOCK,
      ...DIRECT_CHAT_BY_ID_QUERY_MOCK,
      ...MESSAGE_SENT_TO_DIRECT_CHAT_MOCK,
      ...MESSAGE_SENT_TO_GROUP_CHAT_MOCK,
      ...UserConnectionListMock,
      ...MOCKS,
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
  });

  test('User is able to select a contact', async () => {
    const mock = [
      ...USER_JOINED_ORG_MOCK,
      ...GROUP_CHAT_BY_ID_QUERY_MOCK,
      ...DIRECT_CHAT_BY_ID_QUERY_MOCK,
      ...MESSAGE_SENT_TO_DIRECT_CHAT_MOCK,
      ...MESSAGE_SENT_TO_GROUP_CHAT_MOCK,
      ...UserConnectionListMock,
      ...MOCKS,
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

    expect(await screen.findByText('Messages')).toBeInTheDocument();
    const contactCards = await screen.findAllByTestId('chatContact');
    console.log(contactCards);
    expect(contactCards[0]).toBeInTheDocument();
    act(() => {
      fireEvent.click(contactCards[0]);
    });
  });

  test('create new direct chat', async () => {
    const mock = [
      ...USER_JOINED_ORG_MOCK,
      ...GROUP_CHAT_BY_ID_QUERY_MOCK,
      ...DIRECT_CHAT_BY_ID_QUERY_MOCK,
      ...MESSAGE_SENT_TO_DIRECT_CHAT_MOCK,
      ...MESSAGE_SENT_TO_GROUP_CHAT_MOCK,
      ...UserConnectionListMock,
      ...MOCKS,
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

    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();

    const submitBtn = await screen.findByTestId('submitBtn');
    expect(submitBtn).toBeInTheDocument();

    fireEvent.click(closeButton);
  });

  test('create new group chat', async () => {
    const mock = [
      ...USER_JOINED_ORG_MOCK,
      ...GROUP_CHAT_BY_ID_QUERY_MOCK,
      ...DIRECT_CHAT_BY_ID_QUERY_MOCK,
      ...MESSAGE_SENT_TO_DIRECT_CHAT_MOCK,
      ...MESSAGE_SENT_TO_GROUP_CHAT_MOCK,
      ...UserConnectionListMock,
      ...MOCKS,
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

    const newGroupChatBtn = await screen.findByTestId('newGroupChat');
    expect(newGroupChatBtn).toBeInTheDocument();

    fireEvent.click(newGroupChatBtn);
    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton);
  });

  test('sidebar', async () => {
    const mock = [
      ...USER_JOINED_ORG_MOCK,
      ...GROUP_CHAT_BY_ID_QUERY_MOCK,
      ...DIRECT_CHAT_BY_ID_QUERY_MOCK,
      ...MESSAGE_SENT_TO_DIRECT_CHAT_MOCK,
      ...MESSAGE_SENT_TO_GROUP_CHAT_MOCK,
      ...UserConnectionListMock,
      ...MOCKS,
    ];
    setItem('userId', '1');

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
    screen.debug();
    await waitFor(() => {
      const closeMenuBtn = screen.queryByTestId('closeMenu');
      expect(closeMenuBtn).toBeInTheDocument();
      if (closeMenuBtn) {
        closeMenuBtn.click();
      } else {
        throw new Error('Close menu button not found');
      }
    });

    await waitFor(() => {
      const openMenuBtn = screen.queryByTestId('openMenu');
      expect(openMenuBtn).toBeInTheDocument();
      if (openMenuBtn) {
        openMenuBtn.click();
      } else {
        throw new Error('Open menu button not found');
      }
    });
  });

  test('Testing sidebar when the screen size is less than or equal to 820px', async () => {
    setItem('userId', '1');
    const mock = [
      ...USER_JOINED_ORG_MOCK,
      ...GROUP_CHAT_BY_ID_QUERY_MOCK,
      ...DIRECT_CHAT_BY_ID_QUERY_MOCK,
      ...MESSAGE_SENT_TO_DIRECT_CHAT_MOCK,
      ...MESSAGE_SENT_TO_GROUP_CHAT_MOCK,
      ...UserConnectionListMock,
      ...MOCKS,
    ];
    resizeWindow(800);
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
    screen.debug();
    await waitFor(() => {
      expect(screen.getByText('My Organizations')).toBeInTheDocument();
      expect(screen.getByText('Talawa User Portal')).toBeInTheDocument();
    });
    await waitFor(() => {
      const chatBtn = screen.getByTestId('chatBtn');
      act(() => {
        chatBtn.click();
      });
    });
  });
});
