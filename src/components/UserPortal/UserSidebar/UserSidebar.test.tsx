import React from 'react';
import { act, render } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';

import {
  USER_DETAILS,
  USER_JOINED_ORGANIZATIONS,
} from 'GraphQl/Queries/Queries';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import UserSidebar from './UserSidebar';
import useLocalStorage from 'utils/useLocalstorage';

const { getItem, setItem } = useLocalStorage();

const MOCKS = [
  {
    request: {
      query: USER_DETAILS,
      variables: {
        id: getItem('userId'),
      },
    },
    result: {
      data: {
        user: {
          __typename: 'UserData',
          appUserProfile: {
            __typename: 'AppUserProfile',
            adminFor: [
              { __typename: 'Organization', _id: '65e0df0906dd1228350cfd4a' },
              { __typename: 'Organization', _id: '65e0e2abb92c9f3e29503d4e' },
            ],
            createdEvents: [
              { __typename: 'Event', _id: '65e32a5b2a1f4288ca1f086a' },
            ],
            eventAdmin: [
              { __typename: 'Event', _id: '65e32a5b2a1f4288ca1f086a' },
            ],
            createdOrganizations: [
              { __typename: 'Organization', _id: '65e0df0906dd1228350cfd4a' },
              { __typename: 'Organization', _id: '65e0e2abb92c9f3e29503d4e' },
            ],
            pluginCreationAllowed: true,
            appLanguageCode: 'fr',
            isSuperAdmin: true,
          },
          user: {
            __typename: 'User',
            firstName: 'Aditya',
            lastName: 'Agarwal',
            createdAt: '2024-02-26T10:36:33.098Z',
            image: null,
            email: 'adi79@gmail.com',
            adminApproved: true,
            joinedOrganizations: [
              { __typename: 'Organization', _id: '65e0df0906dd1228350cfd4a' },
              { __typename: 'Organization', _id: '65e0e2abb92c9f3e29503d4e' },
            ],
            membershipRequests: [],
            registeredEvents: [
              { __typename: 'Event', _id: '65e32a5b2a1f4288ca1f086a' },
            ],
            organizationsBlockedBy: [],
          },
        },
      },
    },
  },
  {
    request: {
      query: USER_DETAILS,
      variables: {
        id: '2',
      },
    },
    result: {
      data: {
        user: {
          user: {
            __typename: 'UserData',
            appUserProfile: {
              __typename: 'AppUserProfile',
              adminFor: [
                {
                  __typename: 'Organization',
                  _id: '65e0df0906dd1228350cfd4a',
                },
                {
                  __typename: 'Organization',
                  _id: '65e0e2abb92c9f3e29503d4e',
                },
              ],
              isSuperAdmin: true,
              appLanguageCode: 'en',
              createdEvents: [],
              createdOrganizations: [],
              eventAdmin: [],
              pluginCreationAllowed: true,
            },
            user: {
              __typename: 'User',
              adminApproved: true,
              createdAt: '2024-02-26T10:36:33.098Z',
              email: 'adi790u@gmail.com',
              firstName: 'Aditya',
              image: null,
              lastName: 'Agarwal',
              joinedOrganizations: [],
              membershipRequests: [],
              organizationsBlockedBy: [],
              registeredEvents: [],
            },
          },
        },
      },
    },
  },
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS,
      variables: {
        id: getItem('userId'),
      },
    },
    result: {
      data: {
        users: [
          {
            joinedOrganizations: [
              {
                __typename: 'Organization',
                _id: '6401ff65ce8e8406b8f07af2',
                name: 'Any Organization',
                image: '',
                description: 'New Desc',
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS,
      variables: {
        id: '2',
      },
    },
    result: {
      data: {
        users: [
          {
            joinedOrganizations: [
              {
                __typename: 'Organization',
                _id: '6401ff65ce8e8406b8f07af2',
                name: 'Any Organization',
                image: 'dadsa',
                description: 'New Desc',
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS,
      variables: {
        id: '3',
      },
    },
    result: {
      data: {
        users: [
          {
            joinedOrganizations: [],
          },
        ],
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing UserSidebar Component [User Portal]', () => {
  test('Component should be rendered properly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
  });

  test('Component should be rendered properly when userImage is not undefined', async () => {
    const beforeUserId = getItem('userId');

    setItem('userId', '2');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  test('Component should be rendered properly when organizationImage is not undefined', async () => {
    const beforeUserId = getItem('userId');

    setItem('userId', '2');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  test('Component should be rendered properly when joinedOrganizations list is empty', async () => {
    const beforeUserId = getItem('userId');

    setItem('userId', '3');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });
});
