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
        id: getItem('id'),
      },
    },
    result: {
      data: {
        user: {
          user: {
            _id: getItem('id'),
            image: null,
            firstName: 'Noble',
            lastName: 'Mittal',
            adminApproved: true,
            email: 'noble@mittal.com',
            createdAt: '2023-02-18T09:22:27.969Z',
            joinedOrganizations: [],
            membershipRequests: [],
            registeredEvents: [],
          },
          appUserProfile: {
            _id: getItem('id'),
            adminFor: [],
            createdOrganizations: [],
            createdEvents: [],
            eventAdmin: [],
            isSuperAdmin: true,
            adminApproved: true,
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
            _id: '2',
            image: 'adssda',
            firstName: 'Noble',
            lastName: 'Mittal',
            email: 'noble@mittal.com',
            createdAt: '2023-02-18T09:22:27.969Z',
            adminApproved: true,
            joinedOrganizations: [],
            membershipRequests: [],
            registeredEvents: [],
          },
          appUserProfile: {
            _id: '2',
            adminFor: [],
            createdOrganizations: [],
            createdEvents: [],
            eventAdmin: [],
            isSuperAdmin: true,
            adminApproved: true,
          },
        },
      },
    },
  },
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS,
      variables: {
        id: getItem('id'),
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
        id: '2',
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
                  image: 'dadsa',
                  description: 'New Desc',
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
        id: '3',
      },
    },
    result: {
      data: {
        users: [
          {
            user: {
              joinedOrganizations: [],
            },
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
      </MockedProvider>,
    );

    await wait();
  });

  test('Component should be rendered properly when userImage is not undefined', async () => {
    const beforeid = getItem('id');

    setItem('id', '2');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    if (beforeid) {
      setItem('id', beforeid);
    }
  });

  test('Component should be rendered properly when organizationImage is not undefined', async () => {
    const beforeid = getItem('id');

    setItem('id', '2');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    if (beforeid) {
      setItem('id', beforeid);
    }
  });

  test('Component should be rendered properly when joinedOrganizations list is empty', async () => {
    const beforeid = getItem('id');

    setItem('id', '3');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    if (beforeid) {
      setItem('id', beforeid);
    }
  });
});
