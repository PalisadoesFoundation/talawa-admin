import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';

import BlockUser from './BlockUser';
import { MEMBERS_LIST, USER_LIST } from 'GraphQl/Queries/Queries';
import {
  BLOCK_USER_MUTATION,
  UNBLOCK_USER_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { store } from 'state/store';
import userEvent from '@testing-library/user-event';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';

const MOCKS = [
  {
    request: {
      query: USER_LIST,
    },
    result: {
      data: {
        users: [
          {
            _id: '123',
            firstName: 'John',
            lastName: 'Doe',
            image: 'dummyImage',
            email: 'johndoe@gmail.com',
            userType: 'SUPERADMIN',
            adminApproved: true,
            createdAt: '20/06/2022',
            organizationsBlockedBy: [
              {
                _id: '123',
                name: 'ABC',
              },
            ],
          },
          {
            _id: '456',
            firstName: 'Sam',
            lastName: 'Smith',
            image: 'dummyImage',
            email: 'samsmith@gmail.com',
            userType: 'ADMIN',
            adminApproved: false,
            createdAt: '20/06/2022',
            organizationsBlockedBy: [
              {
                _id: '443',
                name: 'DEF',
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: MEMBERS_LIST,
      variables: {
        id: '123',
      },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '123',
            members: [
              {
                _id: '123',
                firstName: 'John',
                lastName: 'Doe',
                image: 'dummyImage',
                email: 'johndoe@gmail.com',
                createdAt: '20/06/2022',
              },
              {
                _id: '456',
                firstName: 'Sam',
                lastName: 'Smith',
                image: 'dummyImage',
                email: 'samsmith@gmail.com',
                createdAt: '20/06/2022',
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: BLOCK_USER_MUTATION,
      variables: {
        userId: '123',
        orgId: undefined,
      },
    },
    result: {
      data: {
        blockUser: {
          _id: '123',
        },
      },
    },
  },
  {
    request: {
      query: UNBLOCK_USER_MUTATION,
      variables: {
        userId: '123',
        orgId: undefined,
      },
    },
    result: {
      data: {
        unblockUser: {
          _id: '123',
        },
      },
    },
  },
];
const link = new StaticMockLink(MOCKS, true);
async function wait(ms = 100) {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing Block/Unblock user screen', () => {
  test('Components should be rendered properly', async () => {
    window.location.assign('/orglist');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <BlockUser />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    expect(screen.getByText('Search By Name')).toBeInTheDocument();
    expect(screen.getByText('List of Users who spammed')).toBeInTheDocument();
    expect(window.location).toBeAt('/orglist');
  });

  test('Testing block/unblock user functionality', async () => {
    window.location.assign('/blockuser/id=123');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <BlockUser />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByTestId('unBlockUser123'));
    userEvent.click(screen.getByTestId('blockUser456'));
  });

  test('Testing seach functionality', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <BlockUser />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.type(screen.getByTestId('searchByName'), 'john');
  });
});
